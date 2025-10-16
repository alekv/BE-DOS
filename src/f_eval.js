// Commands for evaluation.

'use strict';

/*
===================
rta_item

Function to convert relative to absolute item. Doesn't check if the item exists, that's the job of fs_item().
===================
*/

function rta_item(relative_item)
{
	var i, absolute_item=[];
	
	/*
	* It should always be a string. If it's not, I want to know about it.
	*/
	
	if (typeof relative_item != 'string')
		console.error("rta_item(): relative_item is not a string");
		
	/*
	* I don't remove_empty() on relative_path[] because an empty first element means we skip relative paths
	* and we go on root.	
	*/
	
	relative_item = relative_item.split(path_delimiter);
	absolute_item = remove_empty(cwd.split(path_delimiter));

	/*
	* The essence: if you find a ".." remove the last element from cwd[]. Otherwise add to it. And
	* if we're on root, remove all path.
	*/
	
	for (i in relative_item)
	{
		if (relative_item[i] == "..")
		{
			absolute_item.pop();
		}
		else if (relative_item[i] == ".")
		{
			// do nothing
		}
		else if (relative_item[i] == "" && i == 0)
		{
			/*
			* The user requested to start from the root directory, so relative path doesn't matter.
			*/
			
			absolute_item = [];
		}
		else
		{
			absolute_item.push(relative_item[i]);
		}
	}

	return remove_empty(absolute_item); // Now, I can remove the empty ones.
}

/*
===================
fs_item

Returns information about a filesystem item. It'll tell us if it exists, and if yes, if it's a file or a directory. If it doesn't exist it'll tell us whether the path up to the point of the file exists (if 'WRITING' exists in C:\DOCS\WRITING\REPORT.TXT). This function is intented to be used in everything that deals with the filesystem: DIR, CD, MD, RD, etc. Takes absolute path for an item. rta_item() converts a relative to an absolute path.
===================
*/

function fs_item(item)
{
	var i, j, levels, last_modified, results=[], fs_current, type, name, size, contents;
	var parent_last_modified;
	
	/*
	* It should always be an array. If it's not, I want to know about it.
	*/
	
	if (typeof item != 'object')
		console.error("fs_item(): input is not an array");

	fs_current = noref(fs.contents);
	parent_last_modified = noref(fs).last_modified;
	levels = 0;

	for (i in item)
	{
		for (j in fs_current)
		{
			// we found the item we wanted, keep iterating because we may not be at the end yet
			if (item[i] == fs_current[j].name)
			{
				levels++;
				name = fs_current[j].name;
				type = fs_current[j].type;
				size = fs_current[j].contents.length;
				last_modified = fs_current[j].last_modified;
				
				/*
				* I need this to print the date in the ".." element in DIR.
				*/
				
				if (i == item.length-2)
					parent_last_modified = last_modified;
				
				/*
				* NOTICE: I need this in command_type() and command_view().
				* If I don't do this here I will have to repeat this loop there.
				* The burden to have it here is that it'll read the contents of
				* all files in the current directory when you DIR. Considering
				* it's all in memory and that file sizes will not exceed 40kb
				* this doesn't seem a problem.
				*/
				contents = fs_current[j].contents;
				
				fs_current = fs_current[j].contents;
				break;
			}
		}
	}

	/*
	* Item exists. Obviously, the path (up to that point) also exists.
	*/
	
	if (levels == item.length)
	{		
		/*
		* If we're on root, type will not be gathered because the previous loop will
		* not iterate. So we manually collect it.
		*/
		
		if (!type)
			type = fs.type;

		results =
		{
			"item_exists": true,
			"path_exists": true,
			"type": type,
		};
		
		if (type == "dir" || type == "root_dir")
			results.contents = fs_current;
		
		if (type == "dir" && type != "root_dir")
		{
			results.contents.push
			(
				{
					"name": ".",
					"type": "dir",
					"last_modified": last_modified,
				},
				{
					"name": "..",
					"type": "dir",
					"last_modified": parent_last_modified,
				},
			);
		}
		
		results.name = name;
		
		if (type == "file")
		{
			results.size = size;		
			results.contents = contents;
		}
		
		/*
		* This is the last_modified timestamp of the item we ask in params or we're in.
		* Used in DIR to show the date of ".".
		*/
		
		if (!last_modified)
			last_modified = false; // I set it to false because it's easier to check than undefined.
		
		results.last_modified = last_modified;
	}
	
	/*
	* Path up to that point exists but not the item itself.
	*/
	
	else if (levels == item.length-1)
	{
		results =
		{
			"item_exists": false,
			"path_exists": true,
		};
	}
	
	/*
	* Path up to that point doesn't exist. Obviously, the item itself also doesn't exist.
	*/
	
	else if (levels < item.length-1)
	{
		results =
		{
			"item_exists": false,
			"path_exists": false,
		};
	}

	return results;
}

/*
===================
update_prompt

Sets the new prompt when you change directory. Called from window.onload() and command_cd().
===================
*/

function update_prompt()
{
	if (check_fs(false) == false)
		prompt = prompt_sign;
	else
		prompt = prompt_prefix + cwd.toUpperCase() + prompt_sign;
}

/*
===================
check_fs

Will do a basic check on the filesystem (the 'fs' variable). In a future version it'll also do an in-depth validity check. Do timestamps exist for all items? Does a file contain other files (invalid)? Is an item anything else other than file or dir, or even not defined at all? Does it contain the root_dir?
===================
*/

function check_fs(verbal=true)
{
	if (typeof fs == "undefined" || typeof fs != "object")
	{
		if (verbal == true)
			print_to_buffer("Filesystem is invalid. This command is disabled.");
		
		return false;
	}
}

/*
===================
valid_name

Will return true if the name is valid or will give another (string) response if the name has any kind of problem.
===================
*/

function valid_name(string)
{
	var i, split=[];
	
	if (string == "")
		return "empty";
	
	for (i in forbidden_chars)
	{
		if (string.includes(forbidden_chars[i]) == true) // it's using one of the forbidden characters
			return "forbidden";	
	}

	if (string.replace(".", "") == "") // contains only dots
		return "only_dots";
		
	if (string.split(".").length > 2) // has more than one dots
		return "dots";
		
	if (string.split(".")[0] == "")	// has only extension
		return "only_ext";
	
	return true;
}

/*
===================
evaluate_command

Takes cmd_text and checks if it's a command, and if yes it executes the appropriate function. Otherwise it informs us that there is no such command.
===================
*/

function evaluate_command(input)
{
	var command, params, to_buffer, command_lowcase;

	if (!input || input == " ") 
		return false;
	
	/*
	* I can do this on key_press(), inside the ENTER action but I would not be able to test things from
	* test_facilities().
	*/
	
	cmd_history.push(input);
	cmd_history_current = cmd_history.length;
	
	//console.log(cmd_history);
	
	command = input.split(" ", 1).toString();
	
	/*
	* When a user submits text it is echoed back to the console, and I need to maintain the letter case.
	* Yet, I also need to compare commands in non-case sensitive manner, so I create a low case version
	* of the command.
	*/

	command_lowcase = command.toLowerCase();
	
	//params = input.toLowerCase().split(" "); // the original
	params = input.toLowerCase().replace(prompt_prefix.toLowerCase(), "").split(" "); // ignores "C:"
	
	params.shift();
	params = remove_empty(params);

	if (command_lowcase == "dir")
	{
		command_dir(params);
	}
	else if (command_lowcase == "echo")
	{
		command_echo(params);		
	}
	else if	(command_lowcase == "rem")
	{
		command_rem();
	}
	// When the user types it, it's received as "cd\\" but when I do 'evaluate_command("cd\")' it's received as 'cd\', ergo the double check.
	else if
	(
		command_lowcase == "cd" || command_lowcase == "chdir" ||
		command_lowcase == "cd" + path_delimiter || command_lowcase == "cd" + path_delimiter + path_delimiter
	) 
	{	
		// This all is somewhat of a hack and it saves me from redesigning command evaluation to take backslash into account.
		
		if (command_lowcase == "cd" + path_delimiter || command_lowcase == "cd" + path_delimiter + path_delimiter)
			params.unshift(path_delimiter);
		
		command_cd(params);
	}
	else if (command_lowcase == "rd" || command_lowcase == "rmdir")
	{
		command_rd(params);
	}
	else if (command_lowcase == "md" || command_lowcase == "mkdir")
	{
		command_md(params);
	}
	else if (command_lowcase == "cls")
	{
		command_cls();
	}
	else if (command_lowcase == "type" || command_lowcase == "view")
	{
		command_type(params);
	}
	else if (command_lowcase == "help")
	{
		command_help();
	}
	else if (command_lowcase == "easter")
	{
		command_easter(params);
	}
	else if (command_lowcase == "color" || command_lowcase == "colors")
	{
		command_color(params);
	}
	else if (command_lowcase == "del")
	{
		command_del(params);
	}
	else if (command_lowcase == "copy")
	{
		command_copy(params);
	}
	else if (command_lowcase == "intro")
	{
		command_intro();
	}
	else if (command_lowcase == "move" || command_lowcase == "ren" || command_lowcase == "rename")
	{
		command_move(params);
	}
	else if (command_lowcase == prompt_prefix.toLowerCase()) // Gets called when the user just types 'C:' and of course does nothing. It feels kind of a hack interpreting this as a command.
	{
		print_to_buffer("");
	}
	else
	{
		print_to_buffer("Unrecognized command: " + command);
	}
	
	/*
	* Sometimes I execute evaluate_command() from test_facilities() and I might even execute commands at "boot"
	* time. If I don't do this, the prompt will remain at "C:\>" until the user presses a key, and it gets
	* immediatelly updated.
	*/

	print_cmd();
}

/*
===================
command_not_implemented

Used as a placeholder, when I've not yet implemented a command but I want it to respond. It'll console.log the parameters which helps me with debugging.
===================
*/

function command_not_implemented(params)
{
	print_to_buffer("This command has not been implemented yet.");
	
	console.log("command_not_implemented(): parameters supplied:", params);
}

/*
===================
command_cls

The CLS command.
===================
*/

function command_cls()
{
	buffer.innerHTML = "";
}

/*
===================
command_intro

The INTRO command.
===================
*/

function command_intro()
{
	print_to_buffer(wrap_text(intro_message));
}

/*
===================
command_echo

The ECHO command. Displays a message.
===================
*/

function command_echo(params)
{
	params = params.join(" ");
	
	print_to_buffer(params);
}

/*
===================
command_rem

The REM command.
===================
*/

function command_rem()
{
}

/*
===================
command_easter

The EASTER command. Displays an easter egg.
===================
*/

function command_easter(params)
{
	var i, egg;
	
	if (params.length == 0)
	{
		print_to_buffer("You manage to found that! Now you'll have to guess the next part ;-)");
	}
	else
	{
		for (i in params)
		{
			egg = params[i].toLowerCase();
		
			if (egg == "doom")                        print_to_buffer(easter_doom);
			else if (egg == "bofh")                   print_to_buffer(easter_bofh, false);
			else if (egg == "cake" || egg == "cake1") print_to_buffer(easter_cake1);
			else if (egg == "cake2")                  print_to_buffer(easter_cake2);
			else if (egg == "razor")                  print_to_buffer(easter_razor);
			else if (egg == "aperture")               print_to_buffer(easter_aperture);
			else print_to_buffer("Nope!");
		}
	}
}

/*
===================
command_type

The TYPE command. Difference from DOS's TYPE is that it does soft word wrap.
===================
*/

function command_type(params)
{
	var item;
	
	params = params[0]; // show us only the first item
	
	item = fs_item(rta_item(params));
	
	if (item.item_exists == false)
		print_to_buffer("File not found");
	else if (item.type == "dir")
		print_to_buffer("Cannot use TYPE on a directory. It's only for files.");
	else
		print_to_buffer(wrap_text(item.contents));
}

/*
===================
command_help

The HELP command. Displays a list and description of commands.
===================
*/

function command_help()
{
	print_to_buffer(help_message);
}

/*
===================
command_dir

The DIR command. It seperates switches although doesn't use any. I'll be adding /W and /B in a future version.
===================
*/

function command_dir(params)
{
	var i, item=[], switches=[], temp, files=[], dirs=[], parent_last_modified;
	
	if (check_fs() == false)
		return false;
	
	/*
	* Parameters should always be an array. If they're not I want to know about it.
	*/
	
	if (typeof params != 'object')
		console.error("command_dir(): params is not an array/object");

	/*
	* If parameters were supplied, distinguish switches from the item (item = directory or file).
	*/
	
	if (params && params.length > 0)
	{
		temp = seperate(params);
		//switches = temp[0];
		item = temp[1].join();
	}
	else
	{
		item = cwd;
	}
	
	item = fs_item(rta_item(item));

	/*
	* If it's a directory give it some more processing. This info is not necessary if it's a file.
	* If item.type is filled, the item always exists.
	*/
	
	if (item.type == "dir" || item.type == "root_dir")
	{
		/*
		* Put dirs first and files second. And sort each one alphabetically.
		*/
		
		for (i in item.contents)
		{
			if (typeof item.contents[i] == 'object' && item.contents[i].type == "dir")
			{
				dirs.push(item.contents[i]);
			}
			else
			{
				files.push(item.contents[i]);
			}
		}

		/*
		* Sorting. From: https://stackoverflow.com/questions/6712034
		*/
		
		files.sort(function(a,b){ return a.name.localeCompare(b.name); })
		dirs.sort(function(a,b){ return a.name.localeCompare(b.name); })
		
		item.contents = dirs.concat(files);
	}

	print_dir(item);
}

/*
===================
command_cd

The CD command. This function processes and recycles the supplied variable, 'params'.
===================
*/

function command_cd(params)
{
	if (check_fs() == false)
		return false;
	
	var new_dir, new_cwd, temp;
	
	/*
	* If it's not an array, I want to know.
	*/

	if (typeof params != 'object')
		console.error("command_cd(): params should be an array. Although I later convert to string");
		
	/*
	* If no parameters are supplied, just tell us in which directory we are and exit.
	*/
	
	if (typeof params == 'undefined' || params.length == 0)
	{
		print_to_buffer(prompt_prefix + cwd.toUpperCase());
		return true;
	}

	/*
	* CD can only take one or none parameters. If we get more than one throw an error and exit.
	*/
	
	if (params.length > 1)
	{
		params.shift();
		params = params.join(" ");
		print_to_buffer("Too many parameters - " + params);
		return false;
	}

	/*
	*  We got 1 parameter. Lets see more of it.
	*/

	params = params.join(" ");

	new_dir = rta_item(params);
	new_cwd = path_delimiter + new_dir.join(path_delimiter);
	new_dir = fs_item(new_dir);
	
	if (new_dir.type == "dir")
	{
		cwd = new_cwd;
		update_prompt();
		print_to_buffer(""); // in MS-DOS (and DOSBox) it left a blank line
	}
	else if (new_dir.type == "root_dir")
	{
		cwd = path_delimiter;
		update_prompt();
		print_to_buffer(""); // in MS-DOS (and DOSBox) it left a blank line
	}			
	else if (new_dir.type == "file")
	{
		print_to_buffer("This is a file, not a directory.");
	}
	else if (new_dir.item_exists == false)
	{
		print_to_buffer("Directory not found.");
	}
	else if (new_dir.path_exists == false)
	{
		print_to_buffer("Path not found.");
	}
}

/*
===================
command_md

The MD/MKDIR command.
===================
*/

function command_md(params)
{
	var item, full_name, name, ext, where, type, fs_current, i, j, target, timestamp, valid;

	target = params.join("\\"); // rta_item() expects a string
	valid = valid_name(target);
	
	if (valid == "empty")
	{
		print_to_buffer("You didn't give me a name");
		return false;
	}
	else
	if (valid == "forbidden")
	{
		// Would be a good idea to tell the user which the invalid characters are.
		print_to_buffer("Name contains one or more invalid characters");
		return false;
	}
	else
	if (valid == "dots")
	{
		print_to_buffer("You can't use more than one dot");
		return false;
	}
	else
	if (valid == "only_dots")
	{
		print_to_buffer("You can't use a single dot as the name");
		return false;
	}
	else
	if (valid == "only_ext")
	{
		print_to_buffer("You give me an extension, I need a name too");
		return false;
	}

	item = rta_item(target);
	full_name = item[item.length-1]; // the last part is the name
	
	/*
	* Trim name to 8.3. Long live DOS!
	*/
	
	// If the program gets file creation, these will end up in function because we'll need them there too.
	
	full_name = full_name.split(".");
	
	if (typeof full_name[0] != 'undefined')
		full_name[0] = full_name[0].slice(0,8);
	
	if (typeof full_name[1] != 'undefined')
		full_name[1] = full_name[1].slice(0,3);
	
	full_name = full_name.join(".");

	where = noref(item);
	where.pop();
		
	item = fs_item(item);
	
	if (item.item_exists == true)
	{
		if (item.type == "dir")
			type = "directory";
		else
			type = "file";
		
		if (item.type == "file")
			print_to_buffer("A file named " + full_name + " already exists. Cannot create a directory with the same name.");
		else
			print_to_buffer("Directory already exists.");
		
		return false;
	}
	else if (item.path_exists == false)
	{
		print_to_buffer("Can't create a subdirectory in a directory that doesn't exist.");
		return false;
	}
	else
	{
		// lets create the directory

		timestamp = Math.floor(Date.now() / 1000);

		item = rta_item(target);
		fs_current = fs.contents;
		
		for (i in item)
		{
			for (j in fs_current)
			{
				if (item[i] == fs_current[j].name)
				{
					fs_current = fs_current[j].contents;
					break;
				}
			}
		}

		fs_current.push
		(
			{
				"name": full_name,
				"type": "dir",
				"last_modified": timestamp,
				"contents": [],
			},
		);
		
		print_to_buffer(""); // leave an empty line, that's the way DOS does it
	}
}

/*
===================
command_color

The COLOR/COLORS command.
===================
*/

function command_color(params)
{
	var i, success, message, colors;
	
	if (typeof params == 'undefined' || params.length == 0)
	{
		print_to_buffer("You didn't give me a color template. Available templates:");
		
		for (i in color_templates)
			print_to_buffer("  " + color_templates[i].name, false);
		
		print_to_buffer("");
		
		return false;
	}
	
	if (typeof params == 'object')
		params = params.join("");
	
	success = false;
	
	for (i in color_templates)
	{
		if (color_templates[i].name == params)
		{
			apply_template(i);
			success = true;
			break; // lets save a few cycles :P
		}
	}

	if (success == false)
		print_to_buffer("This color template doesn't exist.");
}

/*
===================
command_rd

The RD/RMDIR command.
===================
*/

function command_rd(params)
{
	var dir, item, switches;

	params = seperate(params);
	
	switches = params[0];
	dir = params[1][0];
	
	if (typeof dir == 'undefined')
	{
		print_to_buffer("You didn't give me a directory.");
		return;
	}
	
	item = fs_item(rta_item(dir));
	
	if (item.item_exists == false)
	{
		print_to_buffer("There is no such directory.");
	}
	else if (item.type == "file")
	{
		print_to_buffer("This is a file. Use DEL.");
	}
	else if (item.type == "root_dir")
	{
		print_to_buffer("You can't use this command on the root directory.")
	}
	else
	{
		/*
		* Every directory's first two elements is "." and "..", which is why I'm doing '==2'. It's a way to detect if
		* a directory is empty.	Of course, if the user added '/S' we'll delete the directory no matter if it's empty.
		*/

		if (item.contents.length == 2 || switches.includes("s") == true)
		{
			remove_item(dir);
		}
		else
		{
			print_to_buffer("Directory is not empty. Use /S.");
		}
	}
	
	print_to_buffer("");
}

/*
===================
command_del

The DEL command.

In MS-DOS doing DEL on a dir is like doing 'DEL *.*' while being inside the dir: it'll delete all files. I could easily do that with command_del() but if I want to be consistent I'll also have to implement wildcards, which I have planned for a future version.
===================
*/

function command_del(params)
{
	var i, j, item
	
	if (params.length == 0)
	{
		print_to_buffer("You didn't give me a file to delete.");
		return;
	}
	
	// evaluate_command() sends an array but lets also have the luxury of calling the function directly
	if (typeof params != 'object')
		params = params.split(" ");
	
	for (i in params)
	{
		item = fs_item(rta_item(params[i]));
	
		if (item.item_exists == false)
		{
			print_to_buffer(params[i] + " - No such file.", false);
		}
		else if (item.type == "dir")
		{
			print_to_buffer(params[i] +  " - That's a directory. Use RMDIR.", false);
		}
		else if (item.type == "file")
		{
			remove_item(params[i]);
			print_to_buffer("Deleted " + params[i],false);
		}
	}
	
	print_to_buffer("");
}

/*
===================
command_copy

The COPY command.

In contrast to MS-DOS, it'll perform a cyclyc copy (it'll copy a directory in itself). I don't see a reason not to!
===================
*/

function command_copy(params)
{
	var switches, source_items, destination_dir, items, i, j, source_item, destination_info, copied=0, temp, destination_dir_parent, name, source_item_stats;
	
	params = seperate(params);
	switches = params[0];
	items = params[1]; // it can take multiple source files; the last one is the destination

	destination_dir = items[items.length-1];
	
	source_items = noref(items);
	source_items.pop();
	
	destination_info = fs_item(rta_item(destination_dir));
	
	if (destination_info.path_exists == false)
	{
		// otherwise doing 'copy os user\nick\personal /r' (nick doesn't exist) will result in 'user\personal'
		
		print_to_buffer("Path up the subdirectory doesn't exist"); // could use a better message
	}	
	else if (destination_info.item_exists == false)
	{
		if (source_items.length > 1)
		{
			print_to_buffer("Destination directory '" + destination_dir + "' doesn't exist.");
		}
		else
		{
			source_items = source_items.join(path_delimiter);
			destination_dir_parent = rta_item(destination_dir);
			name = destination_dir_parent.pop();  // we remove the last item from the array and at the same time we store it on 'name'
			destination_dir_parent = destination_dir_parent.join(path_delimiter);

			source_item_stats = fs_item(rta_item(source_items));
			
			if (source_item_stats.type == "dir" && switches.includes("r") == false)
			{
				// this item is a dir but you didn't give me /R so I'll skip
				print_to_buffer(source_items.toUpperCase() + " - is a directory, skipping. Use /R.");	
			}
			else
			{
				copy_item(source_items, destination_dir_parent, name);
				print_to_buffer(destination_dir_parent.toUpperCase() + path_delimiter + name.toUpperCase(), false);
				copied++;
			}
		}
	}
	else
	{
		for (i in source_items)
		{
			source_item = fs_item(rta_item(source_items[i]));
			
			if (source_item.item_exists == false)
			{
				print_to_buffer(source_items[i].toUpperCase() + " - this item doesn't exist.");
			}
			else if (source_item.type == "dir" && switches.includes("r") == false)
			{
				// this item is a dir but you didn't give me /R so I'll skip
				print_to_buffer(source_item.name.toUpperCase() + " - is a directory, skipping. Use /R.", false);	
			}
			else
			{
				temp = fs_item(rta_item(destination_dir + path_delimiter + source_item.name));
				
				if (temp.item_exists == true && switches.includes("o") == false)
				{
					print_to_buffer(temp.name.toUpperCase() + " - already exists. Use /O to overwrite.", false);
				}
				else
				{
 					copy_item(source_items[i], destination_dir);
					print_to_buffer(source_items[i].toUpperCase(), false);
					copied++;
				}
			}
		}
	}
	
	if (copied > 0) // this check may be useless
		print_to_buffer("    " + copied + " item(s) copied.");
}

/*
===================
command_move

The MOVE command.
===================
*/

function command_move(params)
{
	var source, dest, i, j, temp, name
	
	if (params.length != 2)
	{
		print_to_buffer("You need to give me exactly two items.");
		return false;
	}

	source = fs_item(rta_item(params[0]));
	dest = fs_item(rta_item(params[1]));
	
	if (source.item_exists == false) // source item doesn't exist
	{
		print_to_buffer("Can't find " + params[0]);
	}
	else if (dest.item_exists == true)
	{
		if (dest.type == "file")
		{
			print_to_buffer("There is a file with this name. Cannot move/rename.");
			return;
		}
		else
		{
			copy_item(params[0], params[1], params[0]);
			remove_item(params[0]);
			console.log("moved source to dest");
		}
	}
	else if (dest.item_exists == false)
	{
		source = rta_item(params[0]);
		dest = rta_item(params[1]);
		
		source.pop();
		name = dest.pop(); // we remove the last item from the array and at the same time we store it on 'name'

		
		if (compare_arrays(source,dest) == true)
		{
			dest = dest.join(path_delimiter); // maybe I should add an empty element and then join?
			copy_item(params[0], dest, name);
			remove_item(params[0]);
		}
	}
	
	// DOS prints a message "c:\hi => c:\bye [ok]" but I ommit it.
	print_to_buffer("");
}


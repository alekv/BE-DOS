// Miscellaneous - functions that don't belong anywhere else.I can't put in any other file :P

'use strict';

/*
===================
print_json

Will pretty print an object or array.
===================
*/

function print_json(object)
{
	var to_print = JSON.stringify(object, null, 2);
	console.log(to_print)
}

/*
===================
remove_empty

Removes empty items from an array. Used by command_dir().
===================
*/

function remove_empty(array)
{
	var i, cleared=[];

	for (i in array)
	{
		if (array[i] != "")
			cleared.push(array[i]);
	}
	
	return cleared;
}

/*
===================
noref

Used when you want to store an object (or a part of it) in another object without having reference. It uses a "dirty" trick to do it. From: https://stackoverflow.com/posts/49220848/revisions
===================
*/

function noref(object)
{
	if (typeof object != "object")
		return false;
		
	return JSON.parse(JSON.stringify(object))
}

/*
===================
wrap_text

Takes a string and slices it into lines equal to terminal_width, or, optionally, a width you'll set. Returns an array. This algorithm is light enough on resources that I believe would easily run on a 286 in MS-DOS.
===================
*/

function wrap_text(input, wrap_width=terminal_width)
{
	var i, slice, prev_char, cur_char, next_char, reverse=[], break_pos, printed, remaining, lines=[], did_break, pack=[];	
	
	/*
	* The principle:
	*
	* Asuming that wrap limit is 50 chars-- slice 50 chars. If the last character
	* is a space then cut on 50. If the character after the last is a space, cut
	* on 50. Otherwise start checking the letters backwards till we hit a space.
	* wrap_width-i is the location of space if you count from the start of the
	* line; i is the location of you start from the end of the line. If we don't
	* find a space (we notice because did_break remains false) cut at 50.
	*/	
	
	// the algorithm I wrote can't handle '\n', but even more importantly we need to maintain line breaks!
	if (typeof input != 'object')
		pack = input.split("\n");
	else
		pack = input;
	
	for (i in pack)
	{
		remaining = pack[i];	
	
		did_break=false;
	
		// That's an empty line and we need to demonstrate that into lines[]. The
		// 'while (remaining.length > 0)' loop will not activate on empty lines.
		if (pack[i] == 0) 
			lines.push("");
			
		while (remaining.length > 0)
		{
			slice = remaining.slice(0, wrap_width);
			prev_char = remaining.slice(wrap_width-2, wrap_width-1);
			cur_char = remaining.slice(wrap_width-1, wrap_width);
			
			if (prev_char == " ")
			{
				break_pos =  wrap_width - 1;
			}
			else if (cur_char == " " || cur_char == "") // empty string means we reached the end of the line
			{
				break_pos = wrap_width;
			}
			else
			{
				reverse = slice.split("").reverse();
				
				for (i in reverse)
				{
					if (reverse[i] == " ")
					{
						did_break = true;
						break;
					}
				}
				
				if (did_break == true)
					break_pos = wrap_width - i;
				else
					break_pos = wrap_width;
			}

			lines.push(remaining.slice(0, break_pos)); // the cut line
			remaining = remaining.slice(break_pos, remaining.length);
		}
	}

	return lines;
}

/*
===================
html_entities

Replace special characters with their HTML entities. Right now it's just two characters, if they get to 10 I'll use an array.
===================
*/

function html_entities(string)
{
	if (typeof string == 'undefined')
		return false;
	else
		return string.replace("<", "&lt;").replace(">", "&gt;");
}

/*
===================
seperate

Will take a command line and seperate the switches from the parameters (files).
===================
*/

function seperate(line)
{
	var i, j, switches1=[], switches2=[], params=[], temp=[];
	
	if (typeof line != 'object')
		line = line.split(" ");
	
	for (i in line)
	{
		if (line[i].includes("/") == true)
			switches1.push(line[i].toLowerCase().replace("/", ""));
		else
			params.push(line[i].toLowerCase());
	}
	
	// Because the user may have not put spaces between switches. They might remember good old DOS.
	for (i in switches1)
	{
		temp = switches1[i].split("/");
		
		for (j in temp)
			switches2.push(temp[j]);	
	}
	
	// I always need swithces in low case. It's easier to do it here.
	for (i in switches2)
		switches2[i] = switches2[i].toLowerCase();
	
	return [ switches2, params ];
}

/*
===================
remove_item

Removes a file or directory from the filesystem.
===================
*/

function remove_item(item)
{
	var item, levels, fs_div, last_element_position, i, j
	
	if (typeof item == undefined || item == "")
		return false;

	item = rta_item(item);

	levels = 0;
	fs_div = fs.contents; // object reference ensures that whatever we do to fs_div will be reflected to fs
	
	for (i in item)
	{
		for (j in fs_div)
		{
			if (item[i] == fs_div[j].name)
			{
				levels++;
				
				/*
				* We want to stop at the prenult (because splice() only works on the parent object), except when item.length==1.
				* When item.length==1 we rely uppon 'fs_div=fs.contents' before the big 'for' loop to provide us the
				* part of the filesystem we desire.
				*/
				
				if (item.length > 1 & levels != item.length)
					fs_div = fs_div[j].contents;
					
				/*
				* We need to know the position of the element we'll remove, inside the parent object. I could have used
				* 'j' but this feels more clear.
				*/

				last_element_position = j;

				break;
			}
		}
	}
	
	fs_div.splice(last_element_position, 1);
}

/*
===================
copy_item

Copies an item to a new location. Maintains the original name uness you provide a third argument (new_name). It can be a file or directory. The method: read all the attributes of the item and then create those attributes at the destination. If the source item exists in the destination dir it'll be replaced (deleted and copied over). A future version of BE-DOS will do folder merging instead of replacing.
===================
*/

function copy_item(item, destination, new_name=false)
{
	var fs_current, fs_div, source_item, destination_dir, i, j, slice=[], temp, existing

	source_item = fs_item(rta_item(item));
	destination_dir = rta_item(destination);

	/*
	* If there is already an item with this name, remove it.
	*/
	
	existing = noref(destination_dir); // I can probably do without noref()
	
	if (new_name == false)
		existing.push(source_item.name);
	else
		existing.push(new_name); // untested code

	existing = existing.join(path_delimiter);
	existing = fs_item(rta_item(existing));

	if (existing.item_exists == true)
		remove_item(destination + path_delimiter + source_item.name);

	/*
	* fs_item() will "." and ".." into the .contents of directories as it makes it easier for
	* print_dir() to later on print them. We don't want this here as it makes these two elements
	* appear twice. I remove them by searching inside source_item.contents instead of just removing
	* the last two elements (the algorithm places them at the end) because I want to use copy_item()
	* for files too.
	*/
	
	for (i in source_item.contents)
	{
		if (source_item.contents[i].name == "." || source_item.contents[i].name == "..")
			slice.push(i);
	}
	
	/*
	* Sort from larger to smaller because if we first remove the smaller then the larger will change number.
	* Taken, almost verbatim from: https://stackoverflow.com/questions/1063007
	*/

	slice.sort(function(a, b) { return b - a; });
	
	for (i in slice)
		source_item.contents.splice(slice[i], 1);
	
	fs_current = fs.contents;
	
	for (i in destination_dir)
	{
		for (j in fs_current)
		{
			if (destination_dir[i] == fs_current[j].name)
			{
				fs_current = fs_current[j].contents;
				break;
			}
		}
	}
	
	if (new_name != false)
		temp = new_name;
	else
		temp = source_item.name;
	
	fs_current.push
	(
		{
			"name": temp,
			"type": source_item.type,
			"last_modified": source_item.last_modified,
			"contents": source_item.contents,
		}
	);
}

/*
===================
compare_arrays

Returns true of the two arrays are identical.
===================
*/

function compare_arrays(n, t)
{
	var i, identical=true;
	
	if (typeof n == 'undefined')
	{
		console.error("compare_arrays(): You didn't supply any array. I need two.");
		return;
	}
	
	if (typeof t == 'undefined')
	{
		console.error("compare_arrays(): You didn't supply the second array");
		return;
	}
	
	if (n.length != t.length)
		return false;
	
	for (i in n)
	{
		if (n[i] != t[i])
			return false;
	}
	
	return true;	
}


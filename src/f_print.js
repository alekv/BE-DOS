// Functions that do printing on screen.

'use strict';

/*
===================
scroll_to

scrollIntoView() will make the requested line the top line, and I want to request pages with referance to the bottom, thus this function exists to equalize things. buffer_current_line is considered to be on the bottom. If you request line 10 you'll scroll to line 11 because the counter begins from 0. Known issue: the first time you press PGUP, it'll go up for one additional character. If you call the function without setting a line, it'll go to the last one.
===================
*/

function scroll_to(line)
{
	var loc, last_line, to_line;
	
	last_line = buffer.querySelectorAll('.line').length;
	to_line = buffer.querySelectorAll('.line')[loc];
		
	
	if (!line)
		line = last_line;

	if (line < terminal_height - 1)
		line = terminal_height - 1;
		
	if (line > last_line)
		line = last_line;
	
	/*
	* loc is the desired location.
	*/
	
	loc = line - terminal_height + 1;
	
	/*
	* Otherwise it'll become negative if you keep pressing PGUP and then you'll
	* need to press PGDN several times before it starts scrolling down
	*/
	
	if (loc < 0)
		loc = 0;
	
	/*
	* Otherwise it'll become huge if you keep pressing PGDN and then you'll
	* need to press PGUP several times before it starts scrolling up.
	*/
	
	if (loc > buffer.querySelectorAll('.line').length - terminal_height)
		loc = buffer.querySelectorAll('.line').length - 1; // '-1' because it starts from zero

	if (typeof to_line != 'undefined')
		to_line.scrollIntoView();

	if (typeof buffer.querySelectorAll('.line')[loc] != 'undefined') // otherwise it'll throw an error. It's not a showstopper but I like clean things.
		buffer.querySelectorAll('.line')[loc].scrollIntoView()

	buffer_current_line = line;

	if (buffer_current_line < 1)
		buffer_current_line = 1;
	
	// This would be usefull if I were to print something on the console at 'boot'. But this auto-exec
	// thing can happen later on in window.onload().
	//cursor.scrollIntoView();
}

/*
===================
apply_template

Changes the colors of the terminal from a pre-deterned collection, residing in color_templates[]. This function is really "dumb". It expects a number from the color_templates[] array. It's the job of command_color() to provide a valid color template.

The property changes are taken from here:

https://stackoverflow.com/questions/37801882/
https://stackoverflow.com/questions/41370741/
===================
*/

function apply_template(template_number)
{
	document.documentElement.style.setProperty('--primary', color_templates[template_number].primary);
	document.documentElement.style.setProperty('--secondary', color_templates[template_number].secondary);
	document.documentElement.style.setProperty('--gradient', color_templates[template_number].gradient);
	document.documentElement.style.setProperty('--emphasis', color_templates[template_number].emphasis);
}

/*
===================
print_cmd

Prints into #cmd what's in cmd_text.

Because CSS's white-space:pre-wrap collapses white space after the end of a line, we split the line into parts equal to terminal's width. We take into account the size of the prompt. We also have a cursor that moves when we press Left, Right, Home, End, Del, Backspace, so we split the line the cursor is in, into 3 parts.
===================
*/

function print_cmd()
{
	var line_compile="", remaining, lines=[], i, real_position, which_position;
	var line_chars_before_cursor, line_chars_after_cursor, line_char_on_cursor;

	/*
	* Slice input into lines.
	*/
	
	remaining = prompt + cmd_text;
	
	while (remaining.length > 0)
	{
		lines.push(remaining.slice(0, terminal_width));
		remaining = remaining.slice(terminal_width, remaining.length);
	}
	
	/*
	* Find in which line and position (in that line) the cursor is located.
	*/
	
	real_position = prompt.length + cmd_cursor_position;
	var pp = real_position / terminal_width; // pp stands for proportional position

	for (i=0; i<=lines.length; i++) // Starts from 0 but checks line starting from 1.
	{
		if ((pp > i && pp < i+1) || pp == i+1)
		{
			var cursor_in_line = i; // warning: first number is 0
			break;
		}
	}

	which_position = real_position % terminal_width;
	
	// 0 is division without remainder, meaning it's the last position of the line.
	if (which_position == 0)
		which_position = terminal_width;
		
	/*
	* When the cursor reaches the end of a line it goes to the beginning of the next. The loop I've
	* figured needs one additional empty line in order to do that. I consider this to be a hack, but
	* one that works well.
	*/
	
	if (typeof lines[cursor_in_line] == 'undefined')
		lines.push("");
	
	/*
	* Compile the markup we'll be printing into #cmd.
	*/
	
	for (i=0; i<=lines.length-1; i++)
	{
		/*
		* The cursor is in this line.
		*/
		
		if (cursor_in_line == i)
		{
			line_chars_before_cursor = html_entities(lines[i].substring(0, which_position-1));
			line_chars_after_cursor = html_entities(lines[i].substring(which_position, lines[i].length));
			line_char_on_cursor = html_entities(lines[i].substring(which_position-1, which_position));

			/*
			* When the cursor is not on a character we fill with an HTML space entity so that it can be styled.
			* In a future version I'll investigate the posibility that #cursor will be a floated empty div or
			* something similar, in order to avoid using a space.
			*/
			
			if (line_char_on_cursor == "")
				line_char_on_cursor = "&nbsp;";

			line_compile = line_compile + "\n\t\t" + '<div class="line">' + line_chars_before_cursor + '<span id="cursor">' + line_char_on_cursor + '</span>' + line_chars_after_cursor + '</div>';
		}
		
		/*
		* The cursor is not in this line.
		*/
		
		else
		{
			line_compile = line_compile + "\n\t\t" + '<div class="line">' + html_entities(lines[i]) + '</div>';
		}
	}

	cmd.innerHTML = line_compile + "\n\t";
	
	/*
	* Style the cursor.
	*
	* The cursor is rendered each time we press a key. I want to configure blinking and type (block/underscore)
	* from config.js so this means that each time I render the cursor (each time I press a key) I need to pass
	* it its styling.
	*/
	
	if (typeof cursor_style == 'undefined' || cursor_style == "underscore")
	{
		cursor.style.setProperty('background', 'linear-gradient(to top, transparent 0em, var(--primary) 0em, var(--primary) 0.17em, transparent 0.17em, transparent 100%)');
	}
	else if (cursor_style == "block")
	{
		cursor.style.setProperty('background', 'var(--primary)');
		cursor.style.setProperty('color', 'var(--secondary)');
	}
		
	if (typeof cursor_blink != 'undefined' && cursor_blink > 0)
		cursor.style.setProperty('animation', "blink " + cursor_blink + "s step-end infinite alternate");
}

/*
===================
print_to_buffer

Prepares and adds a string into the #buffer. Will first split the string when a new line is encountered, and after that when a line is longer than terminal_width. Does this with div.line's.
===================
*/

function print_to_buffer(input, addon=true)
{	
	var i, split, lines=[], lines_compile="", remaining;
	
	if (Array.isArray(input))
	{
		/*
		* It is assumed that if the input is an array, it's elements will NOT have '\n' in them.
		*/
		
		// *** edw einai to provlima
		
		// slicing lines that are larger than terminal_width
		for (i in input)
		{
			if (input[i].length == 0)
			{
				lines.push(input[i]); // maintain empty lines
			}
			else
			{
				remaining = input[i];

				while (remaining.length > 0)
				{
					lines.push(remaining.slice(0, terminal_width));
					remaining = remaining.slice(terminal_width, remaining.length);
				}
			}
			

			
			
		}

		
	}
	else	
	{
		split = input.split("\n");
		
		for (i=0; i<=split.length-1; i++)
		{
			remaining = split[i];
			
			while (remaining.length > 0)
			{
				lines.push(remaining.slice(0, terminal_width));
				remaining = remaining.slice(terminal_width, remaining.length);
			}
		}
	}

	//lines = wrap_text(lines);
	
	// sometimes I want to disable the empty line that is added by default
	if (addon == true)
		lines.push("");

	for (i=0; i<=lines.length-1; i++)
		lines_compile = lines_compile + '<div class="line">' + lines[i] + '</div>';
	
	buffer.innerHTML = buffer.innerHTML + lines_compile;
	
	// because we might have printed something taller than terminal_height
	scroll_to()
}

/*
===================
commas

Will put commas in numbers to seperate thousands. Taken verbatim from: https://stackoverflow.com/questions/2901102/
===================
*/

function commas(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*
===================
print_dir

Formats and prints the results of command_dir(). Gets called from command_dir(). I spinned this off to a different function because I didn't want to get command_dir() heavy.
===================
*/

function print_dir(input)
{
	var contents=[], i, temp, item=[], biggest_size, compiled=[], compiled_line, date;
	
	if (input.path_exists == true && input.item_exists == false)
	{
		print_to_buffer("File or directory not found.");
		return false;
	}	
	else if (input.path_exists == false)
	{
		print_to_buffer("Path not found.");
		return false;
	}
		
	if (input.type == "dir" || input.type == "root_dir")
	{
		for (i in input.contents)
		{
			if (input.contents[i] != null && input.contents[i].name != "." && input.contents[i].name != ".." )
			{
				item=[];
				
				temp = input.contents[i].name.split(".");
				
				item["name"] = temp[0].padEnd(8, ' ');

				if (temp[1])
					item["ext"] = temp[1].padEnd(3, ' ');
				else
					// If there is no extension, add spaces.
					item["ext"] = "   ";
			}
			else
			{
				item["name"] = input.contents[i].name.padEnd(8, ' ');
				item["ext"] = "   ";
			}
			
			if (input.contents[i] && input.contents[i].type == "dir")
			{
				item["type"] = "dir";
			}
			else
			{
				item["type"] = "file";
				item["size"] = commas(input.contents[i].contents.length);
			}

			date = new Date(input.contents[i].last_modified * 1000);
			item["day"] = date.getDate().toString().padStart(2, '0');
			item["month"] = (date.getMonth() + 1).toString().padStart(2, '0'); // we '+1' because it starts from 0
			item["year"] = date.getFullYear().toString();
			item["hours"] = date.getHours().toString().padStart(2, '0');
			item["minutes"] = date.getMinutes().toString().padStart(2, '0');

			contents.push(item);
			
			item=[];
		}
	
		/*
		* Find the biggest size among all the files. Needed when we leave space in the list.
		* In a future version I'll omit printing the size in bytes and just add a letter to
		* denote bytes, kilobytes, megabytes, etc. Saves space.
		*/

		biggest_size = 0;
		
		for (i in contents)
		{
			if (contents[i].size && biggest_size < contents[i].size.length)
					biggest_size = contents[i].size.length;
		}
	}
	else if (input.type == "file")
	{
		item=[];
		
		temp = input['name'].split(".");
		
		item["name"] = temp[0].padEnd(8, ' ');
		
		if (temp[1])
			item["ext"] = temp[1].padEnd(3, ' ');
		else
			item["ext"] = "   ";

		item["size"] = input["size"];
		
		// These lines get repeated above. I could make them a function.
		date = new Date(input.last_modified * 1000);
		item["day"] = date.getDate().toString().padStart(2, '0');
		item["month"] = date.getMonth().toString().padStart(2, '0');
		item["year"] = date.getFullYear().toString();
		item["hours"] = date.getHours().toString().padStart(2, '0');
		item["minutes"] = date.getMinutes().toString().padStart(2, '0');
		
		contents.push(item);
	}

	/*
	* In the second part we make a string from the array items and we put each
	* string into a new array. print_to_buffer() expects an array of strings.
	*/

	for (i=0; i<=contents.length-1; i++)
	{
		compiled_line = contents[i].name + " " + contents[i].ext + "  ";
		compiled_line = compiled_line.toUpperCase();
		
		if (contents[i].type == "dir")
			compiled_line += "&lt;DIR&gt;";
		else
			compiled_line += "     ";

		if (typeof contents[i].size != "undefined")
			compiled_line += " " + contents[i].size.toString().padStart(biggest_size, " ");
		else
			compiled_line += " " + " ".padStart(biggest_size, " ");
		
		compiled_line += " " + contents[i].day + "-" + contents[i].month + "-" + contents[i].year;
		compiled_line += " " + contents[i].hours + ":" + contents[i].minutes;
		
		compiled.push(compiled_line);
	}
	
	// MS-DOS says "Directory of C:\FOO" but this function's input doesn't have the path info. I could add this in a future version.	
	//print_to_buffer("Directory of ...");
	
	print_to_buffer(compiled, false);
	print_to_buffer("    " + compiled.length + " items(s)");
}


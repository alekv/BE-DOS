// Sanity checks (and in the future also bariables that are derived from things
// we set in config.js). You're not supposed to touch these.

'use strict';

/*
* If we had these things outside of window.onload we would need to have this script after
* all the markup in the page and all the other scripts.
*/

window.onload = function()
{
	if (buffer_scroll < 1)
		buffer_scroll = 1;

	/*
	* Apply the selected template.
	*/

	if (typeof color_template != 'undefined')
		command_color(color_template);

	/*
	* Set the terminal size.
	*/
	
	terminal.style.width = "calc(" + terminal_width + " * var(--lw))";
	terminal.style.height = "calc(" + (terminal_height * 1) + " * var(--lh))";
	buffer.style.maxHeight = "calc(" + (terminal_height - 1) + " * var(--lh))";	
	
	/*
	* Takes the current path and adds it to the prompt. Needs to be done each time we change directory
	* so update_prompt() is also called from command_cd(). This initial call is necessary to display the path
	* before the user does anything. If you call it after print_cmd() the prompt will not be printed when
	* the program starts. But when the user presses a key, it will be.
	*/

	update_prompt();
	
	/*
	* If I don't execute them here, the prompt and the cursor will not appear
	* until the user presses a button.
	*/
	
	measure_cmd();
	print_cmd();

	/*
	* I might have inserted something in #buffer in index.html and this will
	* scroll me to the last line. Alternatively, I could call scroll_to().
	*/
	
	buffer_current_line = buffer.querySelectorAll('.line').length; // Selects the last line.
	buffer.scrollTop = buffer.scrollHeight; // Will go to the last line.
	
	/*
	* The greeding! This is the old way of doing it. The new way is adding 'intro' to autoexec.bat.
	*/
	/*
	if (intro_message != undefined)
		print_to_buffer(intro_message);
	*/
	
	/*
	* The autoexec.bat gets executed. The commands will be stored in history and I don't want to, so clear the history.
	*/
	
	var item, i;
		
	item = fs_item(rta_item(path_delimiter + "autoexec.bat")).contents.split("\n");
	
	for (i in item)
		evaluate_command(item[i]);
		
	cmd_history = [];
	
	/*
	* Sometimes I want to test things, like how will an array respond to being
	* sliced. Instead of comming in window.onload to do my test, I can head to
	* this function.
	*/
	
	test_facilities();
	
	
}


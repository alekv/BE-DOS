// Functions that do keyboard reading.

'use strict';

/*
===================
key_press

Gets executed each time there is a key press. Handles everything about key presses, including ignored and special keys.
===================
*/

function key_press(key)
{
	var inserted_key, no_cursor, p1;
	
	measure_cmd();
	
	/*
	* When #buffer has at least terminal_height-1 lines and #cmd becomes larger
	* than one line we need to bring #cursor into view if we want to see all of
	* #cmd.
	*/
	
	cursor.scrollIntoView();
	
	if (disabled_keys.includes(key.keyCode))
	{
		// We need to do this because some keys have a special function.
		key.preventDefault();
		
		// Unnecessary, but saves a minuscule of cycles.
		return false;
	}
	else
	{
		/*
		* Special keys -
		* Keys we change their normal browser behavior because it's undesirable to us
		* I.e. Backspace doesn't go to the previous page in history, but deletes a
		* character (actually removes a character from the memory and from the printed
		* set). Listing a key here without declaring a functionality has the same effect
		* as disabling it.
		*/

		if (key.which == 8) // BACKSPACE
		{
			var p1 = cmd_chars_before_cursor.substring(0,cmd_chars_before_cursor.length-1)
			cmd_text = p1 + cmd_char_on_cursor + cmd_chars_after_cursor;
			
			if (cmd_cursor_position > 1)
				cmd_cursor_position--;

			// Without this, it'll go to the previous page. If you place this line
			// outside this block, it'll not block Backspace's default behavior.

			key.preventDefault();
		}
		else if (key.which == 46) // DELETE
		{
			var p1 = cmd_chars_after_cursor.substr(0);
			cmd_text = cmd_chars_before_cursor + p1;
		}
		else if (key.which == 13 ) // ENTER
		{
			print_to_buffer(prompt + cmd_text, false);
			
			// I'm escaping the backslashes the user enters.
			// NOTICE: changes I did in other parts of the code made this pointless
			//cmd_text = cmd_text.replace("\\", "\\\\");
			
			evaluate_command(cmd_text);
			
			cmd_text = "";
			cmd_cursor_position = 1;
			buffer_current_line = buffer.querySelectorAll('.line').length + 1; // notice: might be useless

			/*
			* From: https://stackoverflow.com/questions/270612
			*/
			
			buffer.scrollTop = buffer.scrollHeight;
		}
		else if (key.which == 37) // LEFT ARROW
		{
			if (cmd_cursor_position > 1)
				cmd_cursor_position--;
		}
		else if (key.which == 39) // RIGHT ARROW
		{
			if (cmd_cursor_position < cmd_length + 1)
				cmd_cursor_position++;
		}
		else if (key.which == 36) // HOME
		{
			key.preventDefault(); // as in Backspace
			cmd_cursor_position = 1;
		}
		else if (key.which == 35) // END
		{
			key.preventDefault(); // as in Backspace
			cmd_cursor_position = cmd_length + 1;
		}
		else if (key.which == 33) // PGUP
		{
			key.preventDefault(); // as in Backspace
			
			scroll_to(buffer_current_line - buffer_scroll);

			/*
			* Otherwise if the cmd has more than one line, the second one will be cut off.
			* I'm not sure why it does this, and it would be interesting to check.
			*/
			
			cursor.scrollIntoView();
		}
		else if (key.which == 34) // PGDN
		{
			// Likewise as in Backspace.
			key.preventDefault();
			
			scroll_to(buffer_current_line + buffer_scroll);
		}
		else if (key.which == 116) // F5
		{
			/*
			* Reload the page but don't have "F5" printed on the terminal. Although if it did
			* it would only be for a split of a second.
			*/
			
			location.reload();
		}		
		else if (key.which == 38) // UP ARROW
		{
			//console.log(cmd_history_current);
			
			if (cmd_history.length > 0)
			{
				if (cmd_history_current == undefined)
					cmd_history_current = cmd_history.length;
				
				if (cmd_history_current > 0)
					cmd_history_current--;

				cmd_text = cmd_history[cmd_history_current];
				
				// Copy-paste from the action for End. When I go Object-Oriented I'll have a way not to repeat this.			
				key.preventDefault(); // tests where inconclusive on whether it helps or not, so I kept it
				measure_cmd();				
				cmd_cursor_position = cmd_length + 1;
			}
		}
		else if (key.which == 40) // DOWN ARROW
		{
			if (typeof cmd_history_current == undefined)
				cmd_history_current = cmd_history.length;
			
			if (cmd_history_current < cmd_history.length-1)
			{
				cmd_history_current++;
				cmd_text = cmd_history[cmd_history_current];
			}
			else
			{
				cmd_text = "";
			}
			
			// Copy-paste from the action for End. When I go Object-Oriented I'll have a way not to repeat this.
			key.preventDefault(); // tests where inconclusive on whether it helps or not, so I kept it
			measure_cmd();				
			cmd_cursor_position = cmd_length + 1;
		}
		else if (key.which == 45) // INSERT
		{
			// I consider making it switch between insert and overwrite, like in MS-DOS, but the feature was dropped.
		}
		else
		{
			/*
			* These are the keys that are inserted on the command line, inside the terminal.
			*/
			
			/*
			* Firefox opens the page search box when you press "/" and "'" (key codes 191 and
			* 222). We disable the special function of these keys with preventDefault(). I would put
			* a check for the two key codes (and thus limit the scope of preventDefault) but
			* a browser in the future might do the same with other keys, so I disable it for
			* all except F12 (code 123).
			*/
			
			if (key.keyCode != 123)
				key.preventDefault();

			/*
			* Limit how much text the user can enter.
			*/
			
			if (cmd_length >= cmd_limit-1)
			{
				if (logging.informative == true)
					console.debug("You reached the end of cmd_length:", cmd_length);

				return;
			}
			
			/*
			* I'm using inserted_key only so that F12 will open the devtools but wont get printed in the terminal.
			*/
			
			inserted_key = key.key;
			if (key.keyCode == 123)
				inserted_key = "";

			cmd_text = cmd_chars_before_cursor + inserted_key + cmd_char_on_cursor + cmd_chars_after_cursor;
			
			cmd_cursor_position++;
			
			// This was pointless but I'm keeping it as referance.
			//cursor.scrollIntoView();
		}
	}
	
	measure_cmd();
	print_cmd();
}

/*
===================
measure_cmd

Does some measurements on the cmd_text.
===================
*/

function measure_cmd()
{
	cmd_length = cmd_text.length;
	
	/*
	* If cmd_cursor_position is 0 it means it's never been utilized, the normal value is >= 1.
	*/	
	
	if (cmd_cursor_position == 0)
		cmd_cursor_position = cmd_length + 1; // we want the cursor after the last letter
	
	cmd_chars_before_cursor = cmd_text.substring(0, cmd_cursor_position-1);
	cmd_char_on_cursor = cmd_text.substring(cmd_cursor_position-1, cmd_cursor_position);
	cmd_chars_after_cursor = cmd_text.substring(cmd_cursor_position, cmd_length);
	
	//console.log(cmd_chars_before_cursor, cmd_char_on_cursor, cmd_chars_after_cursor, cmd_cursor_position);
}


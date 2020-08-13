// We declare global variables. For most of these it'll not matter to tweak them.

'use strict';

/*
* Used in buffer scrolling.
*/

var buffer_current_line = 0;

/*
* Stores what the user types until they press Enter. You can set this to
* something and it'll become a message for the user. Read the comments on print_cmd()
* for more info.
*/

var cmd_length = 0;
var cmd_cursor_position = 0;
var cmd_chars_before_cursor = "";
var cmd_chars_after_cursor = "";
var cmd_char_on_cursor = "";

/*
* The prompt.
*/

var prompt = "";

/*
* Stores a history of commands typed so that the user can press UP and DOWN to scroll through history
* and repeat or correct a command they previously typed.
*/

var cmd_history = [];
var cmd_history_current = undefined;


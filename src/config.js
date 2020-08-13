// Configuration. Things you can and should review and tweak.

'use strict';

/*
--------------------------------------------------------
Filesystem
--------------------------------------------------------
*/

/*
* DOS uses the backslash. In JavaScript the backslash is an escape character so
* you need to backslashes.
*/

var path_delimiter = "\\";

/*
* The current working directory. Setting this to the delimiter means we're on the
* root directory. You can set it to a directory and on boot the terminal will be
* in that directory.
*/

var cwd = path_delimiter;
//var cwd = "\\user" // example

/*
--------------------------------------------------------
Prompt
--------------------------------------------------------
*/

/*
* It's called 'prompt_prefix' and not 'prompt_drive' because I don't want to characterize it.
* Right now it's drive 'C:' because that'll feel familiar to DOS user but in the future, it may
* not be a drive.
*/

var prompt_prefix = "C:"
var prompt_sign = "&gt;"; // all terminals have an ending sign, Linux has '$' DOS has '>'
//var prompt_sign = "]"; // for debugging

/*
* Normally, this is empty but if you set it to something it'll be as if someone
* typed something on the user's terminal before they opened it. Under that state,
* pressing Enter will attempt to execute it as a command.
*/

var cmd_text = "";

/*
--------------------------------------------------------
Terminal
--------------------------------------------------------
*/

/*
* Measured in number of charatcers. style.css has metrics for the width and
* height of a character (it depends on the font and right now is configured
* for Consolas). styles.css also has the default set to 80x25 and setting
* anything here will override it.
*/

var terminal_width = 80;
var terminal_height = 25;

/*
* Limits how many chars the user can input on the command line. In MS-DOS 6.2,
* it's 131 chars and the prompt itself doesn't substract from that. The screen
* in DOS has 80 chars width so it's around 1.64 times the width of the line.
*/

var cmd_limit = Math.floor(terminal_width * 1.64);

/*
* How many lines will the terminal scroll on PGUP and PGDN. It's analogus to
* the height of the terminal. MS-DOS didn't had this feature with COMMAND.COM,
* but 3rd-party interpreters had it. It's very useful! I'm doing a sensible guess
* here with the division by 3.
*/

var buffer_scroll = Math.floor(terminal_height/3);

/*
* This is the color that we pick. Commenting it disables color picking. The ones that look good
* without text-shadow with white body background: gray, black, vt420a/b/c, amstrad, amber, red, node.
* If you use the COLOR command in AUTOEXEC.BAT it'll override this.
*/

var color_template = "gray";

/*
* Settings for the cursor. 'underscore' is the default, so if you don't define cursor_style it'll
* be an underscore.
*/

var cursor_style = "underscore";
//var cursor_style = "block";

/*
* 0.25 is close to MS-DOS blinking frequency, 0.55 is close to Win7, and 0.32 is close to the
* Matrix1 ending. These are all miliseconds. Don't put an 's', in the variable, it's an integer.
* Set to 0 or comment it to disable.
*/

var cursor_blink = 0.55;


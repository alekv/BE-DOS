//
// Generic stuff
//

'use strict';

/*
* Will create a new <script> tag and will include a JavaScript file. Since this creates
* a tag inside the HTML file, the js file locations are relative to the HTML file, not
* this import.js file.
*/

function include_javascript(script_name)
{
	var sc = document.createElement("script");
	sc.setAttribute("src", script_name); // alternative: sc.src = script_name;
	sc.setAttribute("type", "text/javascript");
	sc.async = false; // otherwise scripts will be loaded in parallel and we may not want that
	document.head.appendChild(sc);
}

/*
* Include the single (for now) script of the program.
*/

include_javascript("config.js");
include_javascript("preliminary.js");
include_javascript("prefabs.js");
include_javascript("declarations.js");
include_javascript("f_read.js");
include_javascript("f_print.js");
include_javascript("f_eval.js");
include_javascript("f_misc.js");
include_javascript("f_test.js");
include_javascript("main.js");
//include_javascript("f_unused.js"); // normally, I don't use this, it's just a code dump for things I feel I might need in the future


// Prefabricated things. You can adjust them, of course, but you don't do that as frequently as in config.js
// and I'd like these infrequently configurable things out of my feet.

'use strict';

/*
-----------------------------------------------------------
Help message
-----------------------------------------------------------
*/

var help_message =
[
	"DIR   - Show files and dirs in current dir.",
	"CD    - Displays or changes the current directory.",
	"MD    - Create a new directory.",
	"RD    - Removes an empty directory. Use /S to remove a non-empty one.",
	"DEL   - Removes a file.",
	"COPY  - Copies files or dirs (with /R) into a another dir. /O overwrites.",
	"MOVE  - Move or rename files and directories.",
	"TYPE  - Display the contents of a text file with soft word wrap.",
	"COLOR - Change the color template of the terminal.",
	"INTRO - Display a short introduction",
	"CLS   - Clear screen.",
	"ECHO  - Display a message.",
	"REM   - Place a remark (comment) in a batch file (like in AUTOEXEC.BAT).",
	"HELP  - Display this help message.",
	"",
	"Commands, files, and directories are case insensitive.",
];

/*
-----------------------------------------------------------
Filesystem
-----------------------------------------------------------
*/

/*
* Obviously, it's gone when the browser closes. The user can create, delete, and move
* files and directories but doesn't have control over the case of filenames. They're stored
* internally as lowcase and presented to the user as upper case.
*
* The idea comes from:
* 
* https:github.com/clarkduvall/jsterm/blob/master/json/sample.json
* https:www.reddit.com/r/godot/comments/8pxhuu/help_simulating_a_file_system/e0f3rk8/
*
* No 3rd party code was used.
*/

var fs =
{
	"name": path_delimiter,
	"type": "root_dir",
	"last_modified": 1592008007, // when the "disk" was formated :P
	"contents":
	[
		{
			"name": "autoexec.bat",
			"type": "file",
			"last_modified": 1596286913,
			"contents": "REM You don't need to do '@echo off' to prevent command echoing.\n\nREM Set the color template. Type COLOR without parameters to see\nREM available templates.\nCOLOR gray\n\nREM Display the intro message, for new users.\nINTRO",
		},
		{
			"name": "os",
			"type": "dir",
			"last_modified": 1595510666,
			"contents":
			[
				{
					"name": "note.txt",
					"type": "file",
					"last_modified": 1595510463,
					"contents": "All commands are 'internal' but in a future version I can create representations of commands in this directory.",
				},
			]
		},
		{
			"name": "prog",
			"type": "dir",
			"last_modified": 1595510727 ,
			"contents":
			[
				{
					"name": "note.txt",
					"type": "file",
					"last_modified": 1595510758,
					"contents": "A nice place to put 3rd party apps.",
				}
			]
		},		
		{
			"name": "user",
			"type": "dir",
			"last_modified": 1595510801,
			"contents":
			[
				{
					"name": "lorem.txt",
					"type": "file",
					"last_modified": 1593867468,
					"contents": "Lorem Ipsum--\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu erat dolor, in dictum libero. Quisque ultrices urna nec dolor cursus porta. Proin et mauris ligula, quis pellentesque turpis. Nullam in tortor nunc, in porta ligula. Aliquam iaculis pellentesque aliquet. Integer posuere luctus velit, at fringilla nisl pellentesque ac. Cras vel orci eget erat consequat lacinia et nec risus. Nullam quis posuere massa. Etiam quam tellus, fringilla id condimentum nec, imperdiet sed tortor. Donec sit amet eros erat. Aliquam facilisis lectus venenatis arcu pulvinar vel adipiscing risus venenatis. Phasellus luctus auctor massa id ornare. Integer auctor accumsan pretium. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur scelerisque tellus ut elit sollicitudin auctor. Quisque rutrum ultricies eleifend. Fusce orci enim, pretium sit amet ornare vel, dictum eget sem. Aenean lacus enim, ornare ac elementum eget, porttitor non tortor.\n\nEtiam mi sapien, bibendum eget congue semper, faucibus vitae justo. Nulla pulvinar nibh vel nibh consequat ornare. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris augue eros, iaculis eleifend mollis id, molestie et est. Vivamus consequat posuere mauris quis venenatis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque tincidunt neque eget odio interdum blandit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam porttitor placerat ornare. Morbi cursus facilisis massa at venenatis. Vivamus sed nibh sit amet sem dignissim pulvinar. Ut cursus nunc vitae sapien posuere nec pretium lectus malesuada. In lacinia congue laoreet. Mauris orci nibh, fermentum quis dapibus id, tempus ac massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi feugiat, risus quis hendrerit vestibulum, tellus dui condimentum lorem, vel ullamcorper sem magna quis purus. Sed non orci at diam fermentum lobortis. Donec tincidunt iaculis enim, sit amet sagittis justo pretium vitae. Suspendisse potenti.",
				},
				{
					"name": "note.txt",
					"last_modified": 1595510947,
					"type": "file",
					"contents": "A nice place to put user files.",
				},
				{
					"name": "test",
					"type": "dir",
					"last_modified": 1595543590,
					"contents": [],
				},
			],
		},
		{
			"name": "readme.txt",
			"type": "file",
			"last_modified": 1597150133,
			"contents": "Why did I pick DOS? First, there is no DOS simulation out there. There are a few Unix-like ones (JS/UIX, jsterm, uni.xkcd.com) but none for DOS.\n\nSecond, DOS is single user, single task. It's what you use to launch your app and do file management. It's the simplest thing you can have and still call it an OS. Plus it's the first OS I used, and I have some nice memories. It's fairly simple (Linux is insanely complex because it can do so many things) and there is something magical to really know what each file on your computer does. It's simplicity. It's Zen.\n\nMy personal goal for version 1.0 was to remind myself JavaScript, learn a few more things, and have a fun challenge. The project goal was to create a fully capable virtual filesystem. The next step would be to rewrite the program with Object Oriented methods, create a way to have Text User Interface apps (Norton Commander-like) inside the simulation, and have a back-end with persistent user accounts. So this could turn into a productivity showcase that people will be able to use for more than a minute. I guess the next step is to write little games (text at first and graphics next) and have an API to easily create apps, and then to create more heavyweight games (3D) and a GUI. There is a lot of room for improvements and evolving the project.\n\nLets see some points of interest:\n\n- You can create, delete, move, and rename directories. You can delete, rename, and move files but not create them.\n- There is no piping or redirecting.\n- There is no wildcards.\n- You can't do 'COPY/R', you need a space there: 'COPY /R'.\n- In DIR you won't get told which directory you DIRed.\n- DIR doesn't have any switches.\n- TYPE does soft word wrap. There is no switch to turn it off.\n- Would be great to be able to do 'CD -' and return to the previous directory. Although DOS didn't had this (at least with COMMAND.COM).\n- You can't use BE-DOS in a smartphone or a tablet. Text entry is not done with a text-box or a text-area (the standard ways websites do text entry) so your browser doesn't know that it's time to open the keyboard. A virtual keyboard from BE-DOS is needed.\n- Commands ignore invalid switches.\n- There is no XCOPY, it's only COPY. Use /R to copy folders. Also, /R doesn't merge source and destination if they have the same name, it'll replace destination with source.\n- COPY can do cyclic copy (will copy a directory inside itself). I didn't see a reason not to.\n- RMDIR deletes empty directories and with /S it'll also delete non-empty ones. Just like in Windows 7.\n- You can't do 'MKDIR A\\B\\C'.\n- You can't execute AUTOEXEC.BAT. It gets (automatically) executed at 'boot' time. And since you also can't modify files the only way to change it is by tweaking the 'fs' variable through Console (or edit prefabs.js).\n- Due to disabling keys, you can't do [CTRL]+[+] and [CTRL]+[-]. Use [CTRL]+[MOUSE WHEEL]. Also, there is no [CTRL]+[C] or [CTRL]+[D] to cancel a command you're typing.\n\nBE-DOS is very simplistic to be useful as any kind of base to build something on. If you need a nice JavaScript terminal library I recommend you take a look at termlib (https://www.masswerk.at/termlib/), it's the base for JS/UIX, the most advanced OS simulation that I know. On the other hand, BE-DOS is so simple that'll make it easy for you to understand it's workings and learn how you can start coding your own browser-based terminal simulation.\n\nTo give you a little help, here is what the program does in a nutshell. It captures keystrokes, ignores the ones we don't want (like NumLock or F2) and the rest gets stored in the cmd_text variable. In each keystroke, cmd_text is printed in div#cmd. Some keys are special, like Enter, and PGUP, etc, and will trigger an action. Enter will take what's in cmd_text through evaluate_command(), see if it's a valid command, and then execute it. Afterwords it'll add the command and it's result (even if it's an error) to div#buffer.\n\nThe idea that the filesystem can be an object structure comes from jsterm and a Reddit post (search for post 8pxhuu). The idea of slicing command and buffer into lines comes from termlib and it solves the problem that white-space:pre-wrap collapses white space when going to the next line. No code was used from any project. Occasional code examples were taken from Stack Exchange, Codepen, and other places on the Internet. Proper credit has been given in all cases inside the source code.\n\nThe code is licensed under GPLv3. I understand that it's kind of limiting so if you intent to use this code for something that matters, drop me a line and I'll consider another (open source) license. You can find my email at www.alekv.com.\n\nI understand that you might have an idea for a feature (and I'm sure it's going to be great) or want to submit a patch. However other obligations don't allow me to work on this project. It was mostly done as an exercise. You're free to fork it and play all you want! If you do something nice with it, drop me a line!",
		}
	]
}

/*
-----------------------------------------------------------
Terminal
-----------------------------------------------------------
*/

/*
* A set of colors that customizes the terminal. Right now it only contains one
* as I only wanted to add the functionality. The 'emphasis' value is unutilized right now.
* Whenever I do text-shadow there an artifact appears, so I don't use that, for now.
* All primary colors are RGBA with A being 0.99. This because Chrome (and all browser that use its
* engine will tweak the color if it's 1.00.
*/

var color_templates =
[
	// This is the default. Has just the right brightness to look good on a white page body. It's also declared in style.css. It's rendundant to also put it here but it feels right. 
	{
		"name": "gray",
		"primary": "#E2E2E2",
		"emphasis": "#FCFCFC",
		"secondary": "#363636",
		"gradient": "#363636",
		"border": "0.5em solid gray",
	},
	// The default in my list of terminal templates. It's a bit darker than 'gray'. Looks too dark on a white page body.
	{
		"name": "darkgray",
		"primary": "rgba(168,168,168, 0.99)",
		"emphasis": "#FCFCFC",
		"secondary": "#20201E",
		"gradient": "#20201E",
		"border": "0.5em solid gray",
	},
	// This is the original MS-DOS colors.
	{
		"name": "black",
		"primary": "#A8A8A8",
		"secondary": "black",
		"gradient": "black",
		"border": "none",
	},
	{
		"name": "phosphor",
		"primary": "rgba(63,200,108, 0.99)",
		"secondary": "black",
		"gradient": "black",
		"border": "none",
	},
	{
		"name": "phosphor2",
		"primary": "rgba(144,238,144, 0.99)",
		"emphasis": "#CBFFCB",
		"secondary": "black",
		"gradient": "black",
		"border": "none",
	},
	{
		"name": "phosphor3",
		"primary": "rgba(13,214,194, 0.99)",
		"emphasis": "#D0FFFF",
		"secondary": "#010A06",
		"gradient": "#010A06",
		"border": "none",
		// has text-shadow which is not included
	},
	{
		"name": "phosphor4",
		"primary": "rgba(7,255,248, 0.99)",
		"emphasis": "#D3FFFE",
		"secondary": "#011F1E",
		"gradient": "#011F1E",
		"border": "none",
		// has text-shadow which is not included
	},
	{
		"name": "hex",
		"primary": "rgba(104,192,114, 0.99)",
		"emphasis": "#c5f7c5",
		"secondary": "#20201E",
		"gradient": "#2C3239",
		"border": "none",
	},
	{
		"name": "sneaker",
		"primary": "rgba(161,181,145, 0.99)",
		"emphasis": "#C9E0B9",
		"secondary": "black",
		"gradient": "black",
		"border": "none",
	},
	{
		"name": "vt420a",
		"primary": "rgba(122,150,117, 0.99)",
		"emphasis": "#B6E1AD",
		"secondary": "#151A14",
		"gradient": "#151A14",
		"border": "none",
	},
	{
		"name": "vt420b",
		"primary": "rgba(122,150,117, 0.99)",
		"emphasis": "#B6E1AD",
		"secondary": "#0B1F2B",
		"gradient": "#0B1F2B",
		"border": "none",
	},
	{
		"name": "vt420c",
		"primary": "rgba(175,219,172, 0.99)",
		"emphasis": "#EBF5E9",
		"secondary": "#112228",
		"gradient": "#112228",
		"border": "none",
	},
	{
		"name": "vt420d",
		"primary": "rgba(151,189,148, 0.99)",
		"emphasis": "#B6E1AD",
		"secondary": "#112228",
		"gradient": "#112228",
		"border": "none",
	},
	{
		"name": "amstrad",
		"primary": "rgba(214,236,187, 0.99)",
		"emphasis": "#F2FFE9",
		"secondary": "#313B32",
		"gradient": "#313B32",
		"border": "none",
	},
	{
		"name": "amber",
		"primary": "rgba(254,253,144, 0.99)",
		"secondary": "#292327",
		"gradient": "#292327",
		"emphasis": "#FEFDD2",
		"border": "none",
		// has text-shadow which is not included
	},
	{
		"name": "orange",
		"primary": "rgba(235,86,43, 0.99)",
		"emphasis": "#FF8562",
		"secondary": "#242424",
		"gradient": "#242424",
		"border": "none",
	},
	{
		"name": "red",
		"primary": "rgba(255,85,51, 0.99)",
		"emphasis": "#FF9A77",
		"secondary": "#220808",
		"gradient": "#220808",
		"border": "none",
	},
	{
		"name": "red2",
		"primary": "rgba(255,85,51, 0.99)",
		"emphasis": "#FF9A77",
		"secondary": "#220808",
		"gradient": "#220808",
		"border": "none",
		// has text-shadow which is not included
	},
	// Immitating n-o-d-e.net circa 2014: http://web.archive.org/web/20141219075014/http://n-o-d-e.net/
	{
		"name": "node",
		"primary": "rgba(53,210,255, 0.99)",
		"emphasis": "#BCF0FF",
		"secondary": "#020C0E",
		"gradient": "#061D23",
		"border": "none",
		// has text-shadow which is not included
	},
];

/*
-----------------------------------------------------------
Keys
-----------------------------------------------------------
*/

/*
* Keys I don't want to have any effect at all.
*/

var disabled_keys = [ 0, 9, 16, 17, 18, 19, 20, 27, 91, 92, 93, 112, 113, 114, 115, 117, 118, 119, 120, 121, 122, 144, 145 ];

/*
-----------------------------------------------------------
Filenames

Forbidden characters in filenames.
-----------------------------------------------------------
*/

var forbidden_chars = [ "*", "=", "+", "[", "]", "\"", "<", ">", "/", "\\", "?", " " ];
var name_limit = 8;
var ext_limit = 3;

/*
-----------------------------------------------------------
Easter eggs
-----------------------------------------------------------
*/

var easter_doom =
[
	"=================     ===============     ===============   ========  ========",
	"\\\\ . . . . . . .\\\\   //. . . . . . .\\\\   //. . . . . . .\\\\  \\\\. . .\\\\// . . //",
	"||. . ._____. . .|| ||. . ._____. . .|| ||. . ._____. . .|| || . . .\\/ . . .||",
	"|| . .||   ||. . || || . .||   ||. . || || . .||   ||. . || ||. . . . . . . ||",
	"||. . ||   || . .|| ||. . ||   || . .|| ||. . ||   || . .|| || . | . . . . .||",
	"|| . .||   ||. _-|| ||-_ .||   ||. . || || . .||   ||. _-|| ||-_.|\\ . . . . ||",
	"||. . ||   ||-'  || ||  `-||   || . .|| ||. . ||   ||-'  || ||  `|\\_ . .|. .||",
	"|| . _||   ||    || ||    ||   ||_ . || || . _||   ||    || ||   |\\ `-_/| . ||",
	"||_-' ||  .|/    || ||    \\|.  || `-_|| ||_-' ||  .|/    || ||   | \\  / |-_.||",
	"||    ||_-'      || ||      `-_||    || ||    ||_-'      || ||   | \\  / |  `||",
	"||    `'         || ||         `'    || ||    `'         || ||   | \\  / |   ||",
	"||            .===' `===.         .==='.`===.         .===' /==. |  \\/  |   ||",
	"||         .=='   \\_|-_ `===. .==='   _|_   `===. .===' _-|/   `==  \\/  |   ||",
	"||      .=='    _-'    `-_  `='    _-'   `-_    `='  _-'   `-_  /|  \\/  |   ||",
	"||   .=='    _-'          `-__\\._-'         `-_./__-'         `' |. /|  |   ||",
	"||.=='    _-'                                                     `' |  /==.||",
	"=='    _-'                                                            \\/   `==",
	"\\   _-'                                                                `-_   /",
	 " `''                                                                      ``'",
	 "                                                             Frans P. de Vries ",
];

var easter_bofh =
[
	"                              `                 `          ",
	"                            -+.                 .+.        ",
	"                           :y/                   +y-       ",
	"                           +ys//++ooooooooooo++//sy+       ",
	"                        ./syyyyyyyyyyyyyyyyyyyyyyyyys/`    ",
	"                       :yyyyyyyyyyys++///++syyyyyyyyyyy-   ",
	"                       oyyyyyyy+.`os-.---.-so`.+yyyyyyyo   ",
	"                       /+++++++`.+yyyysssyyyy/.`+++++++/   ",
	"                        `````` :yyy+.    `-oyyy:```````    ",
	"                          ````:yyy/         /yyy-          ",
	"                      -+o+++oyyyyy`         `yyyy.         ",
	"                     +o.    `syyyy:         /yyyyo         ",
	"                    -y`     -yyyyyy+.     .+yyyyyy-        ",
	"                    /o      /yyyyyyyyysosyyyyyyyyy/        ",
	"                    -y`     `---------------------`        ",
	"                     ++`          ``````                   ",
	"                      :o+::::/+ooooo++++oo:`               ",
	"                        `.-...`          `+s`              ",
	"                                           s/              ",
	"                                           so              ",
	"                                        `.-y-              ",
	"                                        /yyo.              ",
	"                                        oyo:`              ",
	"                                       .-`                 ",
] 

var easter_cake1 =
[
	"                                   i.",
	"                                    .7.",
	"                                   .. :v",
	"                                  c:  .X",
	"                                   i.::",
	"                                     :",
	"                                    ..i..",
	"                                   #MMMMM",
	"                                   QM  AM",
	"                                   9M  zM",
	"                                   6M  AM",
	"                                   2M  ZMX#MM@1.",
	"                                   OM  tMMMMMMMMMM;",
	"                              .X#MMMM  ;MMMMMMMMMMMMv",
	"                          cEMMMMMMMMMU7@MMMMMMMMMMMMM@",
	"                    .n@MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM",
	"                   MMMMMMMM@@#$BWWB#@@#$WWWQQQWWWWB#@MM.",
	"                   MM                                ;M.",
	"                   $M                                EM",
	"                   WMO$@@@@@@@@@@@@@@@@@@@@@@@@@@@@#OMM",
	"                   #M                                cM",
	"                   QM                                tM",
	"                   MM                                CMO",
	"                .MMMM                                oMMMt",
	"               1MO 6MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM iMM",
	"              .M1  BM                                vM  ,Mt",
	"              1M   @M .............................. WM   M6",
	"               MM  .A8OQWWWWWWWWWWWWWWWWWWWWWWWWWWWOAz2  #M",
	"                MM                                      MM.",
	"                 @MMY                                vMME",
	"                   UMMMbi                        i8MMMt",
	"                      C@MMMMMbt;;i.......i;XQMMMMMMt",
	"                            ;ZMMMMMMMMMMMMMM@A;.",
	"                                                                    ",
	"                               (press PGUP)                         ",
];

var easter_cake2 =
[
	"                               ,:/+/-                      ",
	"                               /M/              .,-=;//;-  ",
	"                          .:/= ;MH/,    ,=/+%$XH@MM#@:     ",
	"                         -$##@+$###@H@MMM#######H:.    -/H#",
	"                    .,H@H@ X######@ -H#####@+-     -+H###@ ",
	"                     .,@##H;      +XM##M/,     =%@###@X;-  ",
	"                   X%-  :M##########$.    .:%M###@%:       ",
	"                   M##H,   +H@@@$/-.  ,;$M###@%,          -",
	"                   M####M=,,---,.-%%H####M$:          ,+@##",
	"                   @##################@/.         :%H##@$- ",
	"                   M###############H,         ;HM##M$=     ",
	"                   #################.    .=$M##M$=         ",
	"                   ################H..;XM##M$=          .:+",
	"                   M###################@%=           =+@MH%",
	"                   @################M/.          =+H#X%=   ",
	"                   =+M##############M,       -/X#X+;.      ",
	"                     .;XM##########H=    ,/X#H+:,          ",
	"                        .=+HM######M+/+HM@+=.              ",
	"                            ,:/%XM####H/.                  ",
	"                                 ,.:=-.   ",
];

var easter_girl =
[
	"          MM:::::8888M:::::::88::::::::8:::::888888:::M:::::M       ",
	"          8M:::::888MM::::::::8:::::::::::M::::8888::::M::::M       ",
	"          8M:::::88:M::::::::::8:::::::::::M:::8888::::::M::M       ",
	"          8MM:::888:M:::::::::::::::::::::::M:8888:::::::::M:       ",
	"          88M:::88::M:::::::::::::::::::::::MM:88::::::::::::M      ",
	"          88M:::88::M::::::::::*88*::::::::::M:88::::::::::::::M    ",
	"          88M:::88::M:::::::::88@@88:::::::::M::88::::::::::::::M   ",
	"          88MM::88::MM::::::::88@@88:::::::::M:::8::::::::::::::*8  ",
	"           88M:::8::MM:::::::::*88*::::::::::M:::::::::::::::::88@@ ",
	"          88 MM::::::MM:::::::::::::::::::::MM:::::::::::::::::88@@ ",
	"         888  M:::::::MM:::::::::::::::::::MM::M::::::::::::::::*8  ",
	"         88   MM:::::::MMM::::::::::::::::MM:::MM:::::::::::::::M   ",
	"         8     M::::::::MMMM:::::::::::MMMM:::::MM::::::::::::MM    ",
	"         88    MM:::::::::MMMMMMMMMMMMMMM::::::::MMM::::::::MMM     ",
	"          88    MM::::::::::::MMMMMMM::::::::::::::MMMMMMMMMM       ",
	"           88   8MM::::::::::::::::::::::::::::::::::MMMMMM         ",
	"            8   88MM::::::::::::::::::::::M:::M::::::::MM           ",
	"                888MM::::::::::::::::::MM::::::MM::::::MM           ",
	"               88888MM:::::::::::::::MMM:::::::mM:::::MM            ",
	"               888888MM:::::::::::::MMM:::::::::MMM:::M             ",
	"              88888888MM:::::::::::MMM:::::::::::MM:::M             ",
	"             88 8888888M:::::::::MMM::::::::::::::M:::M             ",
	"             8  888888 M:::::::MM:::::::::::::::::M:::M:            ",
	"                888888 M::::::M:::::::::::::::::::M:::MM            ",
	"               888888  M:::::M::::::::::::::::::::::::M:M           ",
	"               888888  M:::::M:::::::::@::::::::::::::M::M          ",
	"               88888   M::::::::::::::@@:::::::::::::::M::M         ",
	"              88888   M::::::::::::::@@@::::::::::::::::M::M        ",
	"             88888   M:::::::::::::::@@::::::::::::::::::M::M       ",
	"            88888   M:::::m::::::::::@::::::::::Mm:::::::M:::M      ",
	"            8888   M:::::M:::::::::::::::::::::::MM:::::::M:::M     ",
	"           8888   M:::::M:::::::::::::::::::::::MMM::::::::M:::M    ",
	"          888    M:::::Mm::::::::::::::::::::::MMM:::::::::M::::M   ",
	"                M:::::M::::::::::::::::::::MMM::::::::::::M::mm:::M ",
	"               MM:::::::::::::::::::::::::MM:::::::::::::mM::MM:::M:",
	"              MM::::::m:::::::::::::::::::::::::::::::::::M::MM:::MM",
	"              M::::::::M:::::::::::::::::::::::::::::::::::M::M:::MM",
	"             MM:::::::::M:::::::::::::M:::::::::::::::::::::M:M:::MM",
	"             M:::::::::::M88:::::::::M:::::::::::::::::::::::MM::MMM",
	"             M::::::::::::8888888888M::::::::::::::::::::::::MM::MM ",
	"             M:::::::::::::88888888M:::::::::::::::::::::::::M::MM  ",
	"             M::::::::::::::888888M:::::::::::::::::::::::::M::MM   ",
	"             M:::::::::::::::88888M:::::::::::::::::::::::::M:MM    ",
	"             M:::::::::::::::::88M::::::::::::::::::::::::::MMM     ",
	"             M:::::::::::::::::::M::::::::::::::::::::::::::MMM     ",
	"             MM:::::::::::::::::M::::::::::::::::::::::::::MMM      ",
	"              M:::::::::::::::::M::::::::::::::::::::::::::MMM      ",
	"              MM:::::::::::::::M::::::::::::::::::::::::::MMM       ",
	"               M:::::::::::::::M:::::::::::::::::::::::::MMM        ",
	"               MM:::::::::::::M:::::::::::::::::::::::::MMM         ",
	"                M:::::::::::::M::::::::::::::::::::::::MMM          ",
	"                 M:::::::::::M:::::::::::::::::::::::MMM            ",
	"                 MM:::::::::M:::::::::::::::::::::::MMM             ",
	"                  M:::::::::M::::::::::::::::::::::MMM              ",
	"                  MM:::::::M::::::::::::::::::::::MMM               ",
	"                   MM::::::M:::::::::::::::::::::MMM                ",
	"                   MM:::::M:::::::::::::::::::::MMM                 ",
	"                    MM::::M::::::::::::::::::::MMM                  ",
	"                    MM:::M::::::::::::::::::::MMM                   ",
	"                     MM::M:::::::::::::::::::MMM                    ",
	"                     MM:M:::::::::::::::::::MMM                     ",
	"                      MMM::::::::::::::::::MMM                      ",
	"                       MM::::::::::::::::::MMM                      ",
	"                        M:::::::::::::::::MMM                       ",
	"                        MM::::::::::::::::MMM                       ",
	"                        MM:::::::::::::::MMM                        ",
	"                        MM::::M:::::::::MMM:                        ",
	"                        mMM::::MM:::::::MMMM                        ",
	"                         MMM:::::::::::MMM:M                        ",
	"                          MM::MMMM:::::::M:M                        ",
	"                          MM::MMM::::::::M:M                        ",
	"                           MM::MM:::::::::M:M                       ",
	"                           MM::MM::::::::::M:m                      ",
	"                           MMM:::::::::::::::M:                     ",
	"                           MMM:::::::::::::::M::                    ",
	"                           mMM:::M::::::::::::M:                    ",
	"                           MMM::::::::::::::::Mn                    ",
	"                           MMM::::::::::::::::MN                    ",
	"                                                                    ",
	"                               (press PGUP)                         ",
];

var easter_razor =
[
	"",
	"         ▄▄▀▀▀▄                                                               ",
	"     ▄▄▀▀ ▄▄█  ▀▀▀▄▄▄▄                                                        ",
	"    █ ▄▄█████▄███▄▄▄▄ ▀█▄▄▄▄▄                   ▄█▀▀▀█    ▄▄▄                 ",
	"    ▀▄▄ ▀███▀ ▀▀██████▄ ▀▀▀▀▀▀▀▀█▄█▀▀▀▀▀▀▀▀▀▀▀██▀ ▄▀ █▄▄█▀ ▄ ▀▀▀▀▄▄           ",
	"       █ ███    ▄█████▀ ▀▀▀████ ▀█ ▄█████████▄  ▄███▄ ▀ ▄▄██▄▀██▄▄ ▀▄         ",
	"       █ ███  ▄██▀▀▀▀ ▄▀ ▄██▀███   ▀█▀   ▄██▀ ▄█▀ ▀███▄  ███   ▀███▄ █        ",
	"       █ ███▄██▄  ▄▄██▀ ███ ▄ ███ ▀▄▄  ▄██▀ ▄██▄ ▀▄ ▀███▄███  ▄██▀▀ ▄▀        ",
	"       █ ███▀████▄  ██ ███▀    ███ ▀ ▄██▀   ▄████▄ ▀ ▄█▀ ███▀██▄  ▄▀          ",
	"       █ ███  ▀████▄  ▄███ ▄▄█▀▀███▄███▄▄▄▄███ ▀███▄█▀   ███  ▀██▄ ▀▄▄        ",
	"     ▄▀ ▄███▄ ▄ ▀████▄▀██▀▀▀ ▄ ▀▀▀▀███▀▀▀▀▀▀▀  ▄ ▀█▀ ▄█ ▀▀▀▀▀ ▄ ▀██▄  ▀▀▄▄▄▄  ",
	"    █▄ ▀▀▀▀▀▀▀ █▄ ▀█████▄▄ ▀▀▀▀▀██▄  ▀▀▄ ██▀▀▀██ ▀ ▄███▀▀▀▀▀▀▀▀▀▄ ▀▀██▄▄  ▄ ▀▄",
	"  ▀▀▀█▀▀▀▀▀▀▀▀▀▀▀█▄▄▀▀███████▄▄▄   ▄▄▀ ▄▄█     █▀▀▀▀▀            ▀▀▄▄▄ ▀▀▀ ▄▀ ",
	"                  ▀▀█▄▄▄ ▀▀▀▀█████▀▀ ▄█▀                              ▀▀▀▀▀   ",
	"                      ▀▀▀▀▀▀▄▄▄▄▄▄▄▀▀                   1 9 1 1               ",
];

var easter_aperture =
[
	"                                   .,-:;//;:=, ",
	"                              . :H@@@MM@M#H/.,+%;,",
	"                           ,/X+ +M@@M@MM/=,-/HMMM@X/,",
	"                         -+@MM; $M@@MH+-,;XMMMM@MMMM@+- ",
	"                        ;@M@@M- XM@X;. -+XXXXXHHH@M@M#@/.",
	"                      ,/MM@@MH ,@/=            .---=-=:=,.",
	"                      =@#@@@MX .,              -/HX$$///+;",
	"                     =-./@M@M$                  .;@MMMM@MM:",
	"                     X@/ -$MM/                    .+MM@@@M$ ",
	"                    ,@M@H: :@:                    . =X#@@@@-",
	"                    ,@@@MMX, .                    /H- ;@M@M= ",
	"                    .H@@@@M@+,                    /MM+../#$. ",
	"                     /MMMM@MMH/.                  XM@MH; =;",
	"                      //+/$XHH@$=              , .H@@@@MX, ",
	"                       .=--------.           -/H.,@@@@@MX,",
	"                       ./MM@@@HHHXX$$$/+- .:$MMX =M@@MM/.",
	"                         =XMMM@MM@MM#H;,-+HMM@M+ /MMMX=",
	"                           =/@M@M#@$-.=$@MM@@@M; /M/=",
	"                             ,:+$+-,/H#MMMMMMM@= =,",
	"                                  =++////+/:-.",
];



/*
-----------------------------------------------------------
Intro message
-----------------------------------------------------------
*/

var intro_message =
[
	"Browser Embeded DOS 1.0",
	"",
	"Welcome to BE-DOS! BE-DOS creates a simulated shell that feels a lot like good old DOS (or CP/M).",
	"",
	"Use the keys Left, Right, Home, End, Backspace, Del, Up, Down to enter and change text in the command line, and PgUp and PgDn to scroll the buffer.",
	"",
	"Type 'HELP' for a full list of comands and 'TYPE README.TXT' for more detailed info.",
]


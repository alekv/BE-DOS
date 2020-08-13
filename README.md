Why did I pick DOS? First, there is no DOS simulation out there. There are a few Unix-like ones (JS/UIX, jsterm, uni.xkcd.com) but none for DOS.

Second, DOS is single user, single task. It's what you use to launch your app and do file management. It's the simplest thing you can have and still call it an OS. Plus it's the first OS I used, and I have some nice memories. It's fairly simple (Linux is insanely complex because it can do so many things) and there is something magical to really know what each file on your computer does. It's simplicity. It's Zen.

My personal goal for version 1.0 was to remind myself JavaScript, learn a few more things, and have a fun challenge. The project goal was to create a fully capable virtual filesystem. The next step would be to rewrite the program with Object Oriented methods, create a way to have Text User Interface apps (Norton Commander-like) inside the simulation, and have a back-end with persistent user accounts. So this could turn into a productivity showcase that people will be able to use for more than a minute. I guess the next step is to write little games (text at first and graphics next) and have an API to easily create apps, and then to create more heavyweight games (3D) and a GUI. There is a lot of room for improvements and evolving the project.

Lets see some points of interest:

- You can create, delete, move, and rename directories. You can delete, rename, and move files but not create them.
- There is no piping or redirecting.
- There is no wildcards.
- You can't do 'COPY/R', you need a space there: 'COPY /R'.
- In DIR you won't get told which directory you DIRed.
- DIR doesn't have any switches.
- TYPE does soft word wrap. There is no switch to turn it off.
- Would be great to be able to do 'CD -' and return to the previous directory. Although DOS didn't had this (at least with COMMAND.COM).
- You can't use BE-DOS in a smartphone or a tablet. Text entry is not done with a text-box or a text-area (the standard ways websites do text entry) so your browser doesn't know that it's time to open the keyboard. A virtual keyboard from BE-DOS is needed.
- Commands ignore invalid switches.
- There is no XCOPY, it's only COPY. Use /R to copy folders. Also, /R doesn't merge source and destination if they have the same name, it'll replace destination with source.
- COPY can do cyclic copy (will copy a directory inside itself). I didn't see a reason not to.

- RMDIR deletes empty directories and with /S it'll also delete non-empty ones. Just like in Windows 7.
- You can't do 'MKDIR A\B\C'.
- You can't execute AUTOEXEC.BAT. It gets (automatically) executed at 'boot' time. And since you also can't modify files the only way to change it is by tweaking the 'fs' variable through Console (or edit prefabs.js).
- Due to disabling keys, you can't do [CTRL]+[+] and [CTRL]+[-]. Use [CTRL]+[MOUSE WHEEL]. Also, there is no [CTRL]+[C] or [CTRL]+[D] to cancel a command you're typing.

BE-DOS is very simplistic to be useful as any kind of base to build something on. If you need a nice JavaScript terminal library I recommend you take a look at termlib (https://www.masswerk.at/termlib/), it's the base for JS/UIX, the most advanced OS simulation that I know. On the other hand, BE-DOS is so simple that'll make it easy for you to understand it's workings and learn how you can start coding your own browser-based terminal simulation.

To give you a little help, here is what the program does in a nutshell. It captures keystrokes, ignores the ones we don't want (like NumLock or F2) and the rest gets stored in the cmd_text variable. In each keystroke, cmd_text is printed in div#cmd. Some keys are special, like Enter, and PGUP, etc, and will trigger an action. Enter will take what's in cmd_text through evaluate_command(), see if it's a valid command, and then execute it. Afterwords it'll add the command and it's result (even if it's an error) to div#buffer.

The idea that the filesystem can be an object structure comes from jsterm and a Reddit post (search for post 8pxhuu). The idea of slicing command and buffer into lines comes from termlib and it solves the problem that white-space:pre-wrap collapses white space when going to the next line. No code was used from any project. Occasional code examples were taken from Stack Exchange, Codepen, and other places on the Internet. Proper credit has been given in all cases inside the source code.

The code is licensed under GPLv3. I understand that it's kind of limiting so if you intent to use this code for something that matters, drop me a line and I'll consider another (open source) license. You can find my email at www.alekv.com.

I understand that you might have an idea for a feature (and I'm sure it's going to be great) or want to submit a patch. However other obligations don't allow me to work on this project. It was mostly done as an exercise. You're free to fork it and play all you want! If you do something nice with it, drop me a line!
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js

Play with the Media Embed plugin.

Things to check:

* inserting widgets,
* undo manager integration (tricky due to async loading on set data and switching modes),
* clipboard,
* loading supported and unsupported URL,
* switching modes and contents of the data,
* notifications.

Notes:

* JSONP communication is slowed down to stress its delays.
* Many iframely's iframes throw errors on IEs (8-11) - this isn't our fault. Warnings on other browsers aren't our fault too...
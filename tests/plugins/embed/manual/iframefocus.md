@bender-tags: embed, trac14538, bug, 4.5.9
@bender-ui: collapsed
@bender-ckeditor-plugins: embed,wysiwygarea,sourcearea,htmlwriter,entities,toolbar,elementspath,undo,clipboard

**Procedure:**

1. Embed URL from "Test URLs" list between paragraphs inside the editor.
2. Press right arrow to move focus from widget to the following paragraph.
3. Press <kbd>Tab</kbd>.

**Expected:**

Focus is moved to the button following the editor.

**Unexpected:**

Focus is moved inside embedded video's `iframe`.

Notes:

* Many iframely's iframes throw errors on IEs (8-11) - this isn't our fault. Warnings on other browsers aren't our fault too...

@bender-tags: bug, 4.7.0, tp2098
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard, pastefromword, pastetext

1. Click paste button on the toolbar.
2. Repeat it for "Paste from Word" and "Paste as plain text"

#### Expected result:
* For "Paste" and "Paste from Word" the notification is shown mentioning "Cmd/Ctrl+V" keystroke.
* For "Paste as plain text" the notification is shown mentioning:
	* `Cmd+Alt+Shift+V` keystroke in Safari;
	* `Ctrl+V` keystroke in Edge and IE;
	* `Cmd/Ctrl+Shift+V` keystroke in all other browsers (Firefox, Chrome, Opera).

**Note for IE:** after accepting direct access to the clipboard via security dialog, **no** notifications are shown.

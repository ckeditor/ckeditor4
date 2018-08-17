@bender-tags: bug, 4.7.0, tp2098, 4.9.0, 1363
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard, pastefromword, pastetext

1. Click paste button on the toolbar.
2. Repeat it for "Paste from Word" and "Paste as plain text"

#### Expected result:
* For each button the notification is shown:
	> Press `keystroke` to paste. Your browser doesn't support pasting with the toolbar button or context menu option.
* For "Paste" and "Paste from Word" the notification keystroke is `Cmd/Ctrl+V`.
* For "Paste as plain text" the notification is shown mentioning:
	* `Cmd+Alt+Shift+V` keystroke in Safari;
	* `Ctrl+V` keystroke in Edge and IE;
	* `Cmd/Ctrl+Shift+V` keystroke in all other browsers (Firefox, Chrome, Opera).

**Note for IE:** after accepting direct access to the clipboard via security dialog, **no** notifications are shown.

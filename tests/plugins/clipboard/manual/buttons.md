@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard, floatingspace, htmlwriter, blockquote, notification

1. Select some text in the editor.
2. Click the *Copy* button.
3. Click somewhere else.
4. Press `Ctrl + V` to paste the text.

#### Expected result:

**Chrome, Edge, Opera:** Selected text should be copied into clipboard and pasted into editor. Notifications should be opened for copy and paste.

**IE:** A security alert may be displayed &ndash; confirm it. After confirming it everything should be the same as in Chrome.

**Other browsers:** There should be a notification with information that copying is not available.

----

1. The same as above, but use the *Cut* button.

#### Expected result:

The same as above.

----

1. Copy some text from the editor.
2. Press the *Paste* button.

#### Expected result:

**IE (not Edge):** A security alert may be displayed &ndash; confirm it. After confirming the content should be pasted.

**Other browsers:** The paste dialog should be displyed.

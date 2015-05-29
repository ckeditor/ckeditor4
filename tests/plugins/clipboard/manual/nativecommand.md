@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard, floatingspace, htmlwriter, blockquote, notification

1. Select some text in the editor.
2. Click `copy` button.
3. Click somewhere to make selection collapsed.
4. Press `Ctrl` + `V` to paste text.

#### Expected result:

**Chrome: **
1. Selected text should be copied into clipboard and pasted into editor.
2. Notification in the editor should be present.

**Firefox: ** There should be a notification with information that copying is not available.

**IE: ** There should be one time popup which ask for permission to access to the clipboard. After confirming it everything should be the same as in chrome.

----

1. Select some text in the editor.
2. Click `cut` button.

**Chrome: **
1. Selected text should be cut from the editor.
2. Notification in the editor should be present.

**Firefox: ** There should be a notification with information that cut is not available.

**IE: ** There should be one time popup which ask for permission to access to the clipboard. After confirming it everything should be the same as in chrome.

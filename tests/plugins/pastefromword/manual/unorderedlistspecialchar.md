@bender-tags: bug, 4.8.0, 877, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, sourcearea, list

----
1. Open browser console.
1. Open [file](../generated/_fixtures/Unordered_list_special_char_bullet/Unordered_list_special_char_bullet.docx) in Word.
1. Select whole content in Word and copy it to clipboard.
1. Focus CKEditor.
1. Paste word content to editor.

### Expected
List is pasted to the editor.

### Unexpected
Error appears in console and list is not pasted to the editor.

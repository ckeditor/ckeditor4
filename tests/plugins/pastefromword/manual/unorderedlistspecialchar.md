@bender-tags: bug, 4.8.0, 877, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, sourcearea, list

----
1. Open browser console.
1. Open [Unordered_list_special_char_bullet.docx](../generated/_fixtures/Unordered_list_special_char_bullet/Unordered_list_special_char_bullet.docx) in Word.
1. Select and copy whole content from Word.
1. Focus CKEditor.
1. Paste copied Word content into the editor.

### Expected
List is pasted to the editor.

### Unexpected
Error appears in browser console and list is not pasted to the editor.

@bender-tags: 4.11.3, bug, 2292
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard, list, link

1. Open browser console.
2. Select entire content of editor.
3. Drag selected content onto margin of editable.
## Expected:
There is no error in browser's console. Dragged text remains in editor.
## Unexpected:
There is an error in browser's console. Dragged text is removed from editor.

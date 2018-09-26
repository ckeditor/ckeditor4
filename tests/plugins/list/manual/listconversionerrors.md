@bender-tags: bug, 4.10.2, 2411, 2438
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, htmlwriter, list, link, basicstyles, sourcearea, undo, elementspath

----
1. Test both markups separately for all editors.
2. Switch to source mode in editor.
3. Copy markup and paste it into editor's source.
4. Switch to wysiwyg mode.
5. Open browser's console.
6. Select entire editor's content.
7. Press `numbered list` button.

## Expected:
There is no error in console.
However content might look strange and this is not a bug, situation is reportd as list plugin improvement.

## Unexpected:
There is an error in a console.

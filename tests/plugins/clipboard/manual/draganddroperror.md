@bender-tags: bug, 4.10.1, 724
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, sourcearea, elementspath, clipboard, basicstyles

## Please note tat bug exist on Windows only, that's why you should perform a test under Windows, if it's possible.

1. Open console
2. Select text
3. Drag selected text to the bottom of editable (<a href="https://user-images.githubusercontent.com/20988892/28924759-10f4f568-7863-11e7-80bc-d3e3bf14211d.gif" target="_blank">link</a>)

## Expected:
* text is preserved in current position or is apend at the end of line if was selected partially
* there is no error in console

## Unexpected:
* there is error in console
* selected text disappear

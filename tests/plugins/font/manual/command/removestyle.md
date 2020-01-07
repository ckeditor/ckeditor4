@bender-tags: 4.14.0, feature, 3728
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, enterkey, elementspath, notification, sourcearea

General Note:
* Font and font size now use commands instead of direct operation on editor's content.
* When font or fontSize command is executed then notification should be displayed in the editor and browser's console.
* Please repeat steps for both font and font size features

1. Select styled text and remove font/fontSize from it.
2. Try to remove style from not styled text.

## Expected:
Command should be executed once. Removing style only when needed.

## Unexpected:
Command is not executed or is executed more than once.
<br>_Please notice there is a bug [#1116](https://github.com/ckeditor/ckeditor-dev/issues/1116)_

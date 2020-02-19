@bender-tags: 4.14.0, feature, 3728
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, enterkey, elementspath, notification, sourcearea

## General Note:
* Font and font size now use commands instead of direct operation on editor's content.
* When font or fontSize command is executed then notification should be displayed below the editor in the red box and the browser's console.
* Please repeat steps for both font and font size features

## Test scenario:
1. Select styled text and **remove** font/fontSize from it.
2. Try to **remove** style from not styled text.

### Expected:
* Each click into richcombo option, should generate related command execution.
* Removing non-existing style shouldn't generate command log.

### Unexpected:
* Command is not executed.
* Command is executed multiple times for one richcombo click.
* Command is executed with wrong style.
* Command is executed when removing non-existing style.


_Please notice there is a bug [#1116](https://github.com/ckeditor/ckeditor-dev/issues/1116),
which doesn't remove font style if selection starts outside of styled element._

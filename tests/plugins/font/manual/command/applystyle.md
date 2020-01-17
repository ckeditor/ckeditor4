@bender-tags: 4.14.0, feature, 3728
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, enterkey, elementspath, notification, sourcearea

## General Note:
* Font and font size now use commands instead of direct operation on editor's content.
* When font or fontSize command is executed then notification should be displayed below the editor in the red box and the browser's console.
* Please repeat steps for both font and font size features

## Test scenario:
1. Select unstyled text and **apply** new font/fontSize.
2. Try to **apply** this same font/fontSize again.
3. Try to **apply** different font for already styled text.

### Expected:
Each click into richcombo option, should generate related command execution.

### Unexpected:
* Command is not executed
* Command is executed multiple times for one richcombo click
* Command is executed with wrong style

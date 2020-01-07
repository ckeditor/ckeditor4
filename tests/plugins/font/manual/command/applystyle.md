@bender-tags: 4.14.0, feature, 3728
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, enterkey, elementspath, notification

General Note:
* Font and font size now use commands instead of direct operation on editor's content.
* When font or fontSize command is executed then notification should be displayed in the editor and browser's console.
* Please repeat steps for both font and font size features

1. Select unstyled text and apply new font/fontSize.
2. Try to apply this same font/fontSize again.
3. Try to apply different font for already styled text.

## Expected:
Command should be executed only once. Styling the same content with the same style should not trigger command.

## Unexpected:
Command is not executed or is executed more than once.

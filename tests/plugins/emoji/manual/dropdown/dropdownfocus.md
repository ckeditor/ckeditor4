@bender-tags: 4.11.0, feature, emoji, 2062
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, stylescombo, format
@bender-ui: collapsed

1. Open emoji dropdown.
2. Start to move around it with `Tab`, `Shift + tab` and arrow keys.
### Expected: Focus is moved to next elements.
_Note that down and up arrows works same as `Tab` and `Shift + Tab`._
3. Focus one of emoji by keyboard and press `Space` then repeat the same for `Enter` key.
### Expected: Focused emoji is insert to editor. Emoji panel is closed

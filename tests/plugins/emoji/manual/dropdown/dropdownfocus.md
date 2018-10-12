@bender-tags: 4.11.0, feature, emoji, 2062
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, stylescombo, format
@bender-ui: collapsed
@bender-include: ../../_helpers/tools.js

1. Open emoji dropdown.
2. Start to move around it with `Tab`, `Shift + tab` and arrow keys.
  * Expected: Focus is moved to next elements. Notice arrow down and up also move to next selection not to next line or section.
3. Focus one of emoji by keyboard and press `Space` then repeat the same for `Enter` key.
  * Expected: Focused emoji is insert to editor. Emoji panel is closed

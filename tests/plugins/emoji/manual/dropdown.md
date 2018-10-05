@bender-tags: 4.11.0, feature, emoji, 2062
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, stylescombo, format
@bender-ui: collapsed
@bender-include: ../_helpers/tools.js

1. Open emoji dropdown.
2. Hover mouse over emoji:
  * Expected: Hovered emoji is highlited and displayed at status bar ( bottom of emoji dropdown )
3. Hover mouse over top navigation groups:
  * Expected: Icons became darker indicated that user has cursor over it
4. Click into navigation groups other than first one
  * Expected: Emoji are scrolled to given group. Navigation has moved blue indicator under it.
5. Scroll up and down emoji list
  * Expected Navigation group indicator ( blue line under it ) moves according to scrolled position
6. Type any search string
  * Expected: Emoji result are narrowed down to proper match
7. Type search string 'kebab'
  * Expected: Emoji are narrowed down to 2 results ( `oden` and `stuffed_flatbread` ) based on keywords. Empty sections are removed.
8. Click outside of emoji dropdow ( or press ESC ) to close it and open it again
  * Expected: Search result should be cleared out. All emoji should be displayed.
9. Click into emoji
  * Expected: Emojis is insert inside current selection in editor. Emoji panel is closed.
10. Open emoji panel, start to move around it with `Tab`, `Shift + tab` and arrow keys.
  * Expected: Focus is moved to next elements. Notice arrow down and up also move to next selection not to next line or section.
11. Focus one of emoji by keyboard and press `Space` then repeat the same for `Enter` key.
  * Expected: Focused emoji is insert to editor. Emoji panel is closed
12. You can albo check other cases which came to your mind with emoji dropdown.

@bender-tags: 4.11.2, bug, emoji, 2572
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, stylescombo, format
@bender-ui: collapsed
@bender-include: ../../_helpers/tools.js

## Test case 1:

1. Open emoji dropdown.
2. Move focus (blue rectangular border) to `nature and animals` group.
### Expected
Icon has equal margin between left and right border.
### Unexpected
Icon is moved to the left side.

## Test case 2:
1. Open emoji dropdown.
2. Search for `wastebasket` emoji.
3. Move cursor over mentioned emoji to present it in statusbar.
### Expected
Emoji in status bar has nice top margin.
### Unexpected
Emoji in status bar visually seems to be moved a little bit to high.

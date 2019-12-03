@bender-tags: 4.14.0, bug, feature, 3654
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,panel

# Horizontal movement

1. Click empty toolbar menu button.
2. Press right arrow key 16 times.

## Expected

Green cell indicating focus moves with key press horizontally. It cycles through the whole grid and finishes at the begining.

3. Repeat 1-2 with left arrow key to verify the same functionality in the reverse order.

## Vertical movement

1. Click empty toolbar menu button.
2. Press up arrow key 4 times.

## Expected

Green cell indicating focus moves with key press vertically. It cycles through the whole grid and finishes at the begining.

3. Repeat 1-2 with left down key to verify the same functionality in the reverse order.


Play a bit with the menu button to verify different focus position on custom choosen arrow key press.

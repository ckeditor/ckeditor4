@bender-tags: 2395, bug, 4.12.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, link

## Test both editors:

1. Scroll down until editor is visible.
1. Press link button.

## Things to check:


- Play around focusing and blurring inputs, zooming and scrolling page.

#### Expected:

- When opening dialog or focusing input caret page should be scrolled in a way caret is visible.

#### Unexpected

- Caret is outside of current viewport.

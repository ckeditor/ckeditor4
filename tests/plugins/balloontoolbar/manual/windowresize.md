@bender-ui: collapsed
@bender-tags: 4.8.0, feature, balloontoolbar, 933
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, floatingspace, balloontoolbar, sourcearea, list, link, elementspath, image

## Window Resize

### Scenario 1

_Perform for each editor instance._

1. Click inside an element (`strong`, `em`, `a` or `li`) so balloon toolbar appears.
1. Resize the whole window.

#### Expected

If element moves on the window resize, balloon toolbar should move with the element so it is always properly attached to it.

Note: Edge the toolbar will be hidden during the resize as editor fires `blur` events ([#1265](https://github.com/ckeditor/ckeditor4/issues/1265)).

### Scenario 2

1. Put a selection in any `strong` within the each editor.
1. Blur last editor by clicking outside.
1. Resize the whole window.

#### Expected

Window is resized, no toolbars are shown.

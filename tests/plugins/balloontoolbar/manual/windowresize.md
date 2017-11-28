@bender-ui: collapsed
@bender-tags: 4.8.0, feature, balloontoolbar, 933
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, floatingspace, balloontoolbar, sourcearea, list, link, elementspath, image

## Window Resize

### Test Scenario

_Perform for each editor instance._

1. Click inside an element (`strong`, `em`, `a`, `li`) so balloon toolbar appears.
2. Resize the whole window.

#### Expected

If element moves on the window resize, balloon toolbar should move with the element so it is always properly attached to it.

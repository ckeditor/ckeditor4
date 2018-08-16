@bender-ui: collapsed
@bender-tags: 4.8.0, bug, balloontoolbar
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,floatingspace,balloontoolbar,link,image,resize,language,stylescombo
@bender-include: ../_helpers/default.js

Perform below steps in both editors:
1. Click image.
1. Check how Balloon Toolbar looks like.

_Note:_ Please be aware that buttons in Balloon Toolbar use main skin.

**Expected:** Balloon Toolbar background should be different from used skin (fallback `default.css` should be loaded).

**Unexpected:** Balloon Toolbar is not visible. Balloon Toolbar has the same skin as editor (grey gradient at ballon background).

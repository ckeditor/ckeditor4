@bender-ui: collapsed
@bender-tags: 4.8.0, bug, inlinetoolbar
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,floatingspace,inlinetoolbar,link,image,resize,language,stylescombo
@bender-include: ../_helpers/default.js

Perform below steps in both editors:
1. Click image.
1. Check how inline toolbar looks like.

_Note:_ Please be aware that buttons in inline toolbar use main skin.

**Expected:** Inline toolbar background should be different from used skin (fallback `default.css` should be loaded).

**Unexpected:** Inline toolbar is not visible. Inline toolbar has the same skin as editor (grey gradient at ballon background).

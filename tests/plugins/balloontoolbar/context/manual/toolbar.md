@bender-ui: collapsed
@bender-tags: 4.8.0, feature, balloontoolbar, 933
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, floatingspace, balloontoolbar, sourcearea, list, link, elementspath, language, stylescombo, image

## Editor Toolbar Imitation

Selecting:
* `u, s` - will show `Strike,Underline` buttons.
*  `li` - will show `BulletedList,NumberedList` buttons.
* _any other selection_ - shuold display a toolbar context displayed on the top of the editor.

### Test Case

Put a selection in `Para^graph after the list.`

#### Expected

A toolbar with many buttons is shown on top of the editor.

#### Unexpected

* Toolbar has only 2 buttons.
* Toolbar is displayed over the focused paragraph.
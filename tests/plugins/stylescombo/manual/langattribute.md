@bender-tags: 4.21.1, feature, 5410
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, stylescombo


1. Click on the Styles combo box to open the panel elements.
2. Look at the dropped data.

**Expected**

* Item 0 should have the lang attribute set to `pl`.
* Item 1 should have the `lang` attribute set to the editor language value.

**Unexpected**

* Both panel items do not contain the lang attribute.
* Only the first element contains the lang attribute.
* The applied lang attribute is invalid.

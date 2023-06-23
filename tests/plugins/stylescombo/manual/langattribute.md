@bender-tags: 4.22.0, feature, 5410
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, stylescombo


1. Click on the Styles combo box to open the panel elements.
2. Look at the dropped data.

**Expected**

* Item 1 should have the lang attribute set to `pl`.
* Item 2 should have the `lang` attribute set to `Not defined`.

**Unexpected**

* Both panel items have `Not defined` lang attribute.
* The applied lang attribute is invalid.

@bender-tags: 727, style, bug, 4.10.1
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,sourcearea,toolbar,undo,clipboard,stylescombo,floatingspace

Repeat below steps in all editors.

----

1. Select paragraph
2. Open stylecombo
3. Check what is displayed in styles combo

**Expected:** Styles combo should display 3 different styles

----

1. Select entire paragraph
2. Apply style `Marker 2` from styles combo to the paragraph
3. Do not change selection or reselect the same text
4. Re-open stylescombo

**Expected:** Stylescombo shows selected `Marker 2` style. If it's possible you can check sourcemode. There should be visible `span` with classes `b-test a-test` applied to selected fragment.

@bender-tags: 4.7.2, 525, trac13553, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, stylescombo, elementspath

## Case 1

1. Select all content inside the editor.

**Expected result:**

Styles combo has default (not set) value.

**Unexpected result:**

Styles combo has value matching styles from the first paragraph.

## Case 2

1. Select `e` in the last paragraph (`mark{e}d`).

**Expected result:**

Styles combo has value of "Marker".

**Unexpected result:**

Styles combo has value of "Italic Title".

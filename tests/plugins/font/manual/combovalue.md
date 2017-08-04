@bender-tags: 4.7.2, 525, trac13553, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, elementspath

## Case 1

1. Select all content inside the editor.

**Expected result:**

Font style and size combos have default (not set value).

**Unexpected result:**

Font style and size combos have values matching styles from the first paragraph.

## Case 2

1. Select `a` in the last paragraph (`foob{a}r`).

**Expected result:**

Font style has value of "Arial".

**Unexpected result:**

Font style has value of "Comic Sans MS".

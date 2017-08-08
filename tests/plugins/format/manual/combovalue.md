@bender-tags: 4.7.2, 525, trac13553, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, format, elementspath

## Case 1

1. Select all content inside the editor.

**Expected result:**

Format combo has default (not set) value.

**Unexpected result:**

Format combo has value matching styles from the first paragraph.

## Case 2

1. Select `a` in the last paragraph (`foob{a}r`).

**Expected result:**

Format combo has value of "Address".

**Unexpected result:**

Format combo has value of "Formatted".

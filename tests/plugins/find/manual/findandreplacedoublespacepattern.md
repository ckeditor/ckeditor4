@bender-tags: 4.17.2, bug, 4987
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, find, sourcearea

**Note:** 

There are two spaces between the words in step 2.

1. Open Find and Replace dialog and move to `Find` tab.
2. In `Find what:` input type `CKEditor4  search`.
3. Click `Find` button.

**Expected**

Find works fine with double spaced between words.
The search text is highlighted on the editable.

**Unexpected**

The searched text was not found, an alert was displayed: ```The specified text was not found```.

4. Repeat above steps for the `Replace` tab and try to find and replace the search text.

**Additional:**

Check if space character in languages with different alphabets (like Japanese, Arabic) works correctly by changing OS keyboard language.

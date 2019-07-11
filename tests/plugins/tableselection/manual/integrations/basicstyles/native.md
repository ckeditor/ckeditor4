@bender-ui: collapsed
@bender-tags: bug, 4.13.0, 941
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, basicstyles

1. Open console.
2. Select the first cell text using native selection.
3. Click `Bold` button.

**Expected**: Text is bolded, selection changes into visual selection.

4. Click `Bold` button again.

**Expected:** Text is unbolded, visual selection is preserved.

**Unexpected**: Console registers exception.


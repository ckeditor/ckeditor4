@bender-tags: find, feature, 4.10.0
@bender-ui: collapsed
@bender-ckeditor-plugins: find, wysiwygarea, toolbar

1. Select a word, e.g. `regular`.
2. Click "Find" toolbar button.
	**Expected:**
	* Find dialog is open.
	* "Find what" field has `regular` value preset.
3. Set "Find what:" to `ar`.
4. Press "Find" button.
	**Expected:** `ar` part of `regular` word gets highlighted.

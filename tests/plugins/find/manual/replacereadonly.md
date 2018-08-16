@bender-tags: find, feature, 4.10.0
@bender-ui: collapsed
@bender-ckeditor-plugins: find, wysiwygarea, toolbar

Replace tab should not be visible in readonly mode.

## Editor 1

1. Select a word, e.g. "regular"
2. Click "Replace" toolbar button.
	**Expected:** Nothing happens.
	**Unexpected:** Replace dialog is open.
3. Click "Find" toolbar button.
	**Expected:** Dialog is open, there is no replace tab.
	**Unexpected:** Replace tab is visible.

## Editor 2

1. Select a word, e.g. "regular"
2. Click "Replace" toolbar button.
	**Expected:** Replace dialog is open.
	**Unexpected:** Nothing happens.
3. Click "Find" toolbar button.
	**Expected:** Replace tab is visible.
	**Unexpected:** Dialog is open, there is no replace tab.

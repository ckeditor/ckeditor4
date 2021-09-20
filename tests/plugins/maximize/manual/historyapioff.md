@bender-tags: feature, 4.17.0, 4374
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, maximize

**Note** The test is best run on a browser tab with clear history.

**Note** Maximized editor will be covering test steps after starting, so better read them all first!

1. Click "Push history" button.
1. Click "Maximize" toolbar button.
1. Press browser's "Go back" button.

	**Expected** Editor is still maximized.

	**Unexpected** Editor is no longer maximized.
1. Press borwser's "Go forward" button.

	**Expected** Editor is still maximized.

	**Unexpected** Editor is no longer maximized.

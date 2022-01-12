@bender-tags: bug, 4.17.2, 4761
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, emoji, copyformatting, easyimage, tableselection

**Note**: This test requires CKEDITOR with set `CKEDITOR.timestamp` (e.g. built one).

1. Open developer tools and switch to "Network" tab.
2. Refresh the page.

	**Expected** CKEditor 4's resources are loaded with the cache key (`?t=<some alphanum characters>` at the end of URL).

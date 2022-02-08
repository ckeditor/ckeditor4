@bender-ui: collapsed
@bender-tags: bug, 4.15.1, 4306
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, undo, elementspath

Note: this test checks if the [upstream issue in WebKit](https://bugs.webkit.org/show_bug.cgi?id=217221) is still present.

1. Click the "Select the last column" button.

	### Expected

	The last column can't be selected or wrong cells become selected.

	### Unexpected

	The last column is selected.

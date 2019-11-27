@bender-tags: bug, 2294, 2380, 4.11.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, sourcearea, htmlwriter

1. Open the console.
1. Focus the editor.
1. Select all the contents (`ctrl/cmd+a`).
1. Click the "Bold" button in the toolbar.

	### Expected

	No errors are thrown in the console.

	### Actual

	JS error is thrown, like `Uncaught TypeError: Cannot read property 'getParents' of null`

1. Click the "Source" button.

	### Expected

	HTML comments that are ouside of paragraphs, are not wrapped with additional `p` or `strong` tags.

	### Actual

	Additional markup is created around HTML comments.

### Notes

[Edge will throw `Permission denied` exception](https://github.com/ckeditor/ckeditor4/issues/2035), this particular error is not related to this test.

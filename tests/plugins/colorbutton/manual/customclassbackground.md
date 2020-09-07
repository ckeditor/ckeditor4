@bender-tags: feature, 3940, 4.15.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea

1. Select first word.
1. Click **Background Color** button.
1. Hover over a red square inside color panel.

	### Expected:

	Tooltip displays: `bg-red`

1. Press red square.

	### Expected:

	Selected text background turns red.

1. Click on `Show source` button.

	### Expected:

	Previously selected text should have span with `bg-red` class.

1. Click on `Show source` button to back to WYSIWYG mode.

	### Expected:

	Previously selected text background should be red.


### Unexpected:

Selected text doesn't have class `bg-red` and selected text background doesn't turns red.

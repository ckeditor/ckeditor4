@bender-tags: feature, 3940, 4.15.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea

1. Select first word.
1. Click **Text Color** button.
1. Hover over a red square inside color panel.

	### Expected:

	Tooltip displays: `text-red`

1. Press red square.

	### Expected:

	Selected text turns red.

1. Click on `Show source` button.

	### Expected:

	Previously selected text should have span with `text-red` class.

1. Click on `Show source` button to back to WYSIWYG mode.

	### Expected:

	Previously selected text should be red.


### Unexpected:

Selected text doesn't have class `text-red` and selected text doesn't turns red.

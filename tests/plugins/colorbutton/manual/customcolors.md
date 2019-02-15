@bender-tags: bug, 1478, 4.12.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea

1. Select first word.
1. Press on text color button.
1. Hover over red square.

	### Expected:

	Tooltip displays: `Not blue`

1. Press red square.

### Expected:

Selected text turns red.


### Unexpected:

Selected text doesn't change color.

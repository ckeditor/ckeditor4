@bender-tags: feature, 3940, 4.15.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea

1. Select first word.
1. Press on text color button.
1. Hover over red square.

	### Expected:

	Tooltip displays: `text-red`

1. Press red square.

1. Press `Show source` button.

### Expected:

Selected text should have class `text-red` and selected text turns red.


### Unexpected:

Selected text doesn't have class `text-red` and selected text doesn't turns red.

@bender-tags: bug, 988, 4.10.1
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea

1. Press 'source' button.

## Expected:

Editor source contains all of custom tags from list:

	- objectfoo
	- embedfoo
	- paramfoo
	- htmlfoo
	- headfoo
	- bodyfoo
	- titlefoo

Tags, has `[data-foo="bar"]` attribute, and text matching tag name.
Example: `<objectfoo data-foo"bar">objectfoo</objectfoo>`

## Unexpected:

Any of tags is missing.

@bender-tags: 2782, feature, 4.11.3
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, bbcode, undo, justify, basicstyles, sourcearea, elementspath

1. Paste into editor: <input type="text" readonly value="[[][/url]">

1. Go to source mode.
	## Expected
	- All square brackets are replaced with HTML entities.
	## Unexpected
	- Square brackets are visible in source.

1. Go to WYSIWYG mode.

## Expected
- Editor contains: `[[][/url]`

## Unexpected
- Editor is empty.
- Buttons are disabled.

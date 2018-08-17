@bender-tags: bug, 4.6.1, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, colorbutton, pastefromword, sourcearea, elementspath

1. Using Microsoft Word open/create a document where some text have background color (e.g. `Colors.docx`).
1. Copy the text with background color.
1. Paste it into CKEditor instance.

	**Expected:** Background is retained.

	**Unexpected:** Background gets stripped.

1. Click source button.

	**Expected:** Background is added as a `span` with `background-color` property.

	**Unexpected:** Background is added as a `span` with `background` property.

@bender-tags: tc, 4.6.0, config, word
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, list, basicstyles, pastefromword, sourcearea, elementspath, newpage

### pasteFromWordCleanup event

In this test `pasteFromWordCleanup` event is canceled, so there should be no content cleanup. You'll see a lot of garbage markup.

1. Copy any rich format content from Microsoft Word, e.g. list with multiple levels.
1. Put the cursor in the second, empty paragraph.
1. Paste content.
1. Press "Source" button to see source code.

## Expected

There's a lot of messy styles / attributes like `mso-list` and so on.

## Unexpected

All the messy attributes get removed and the content is clear.
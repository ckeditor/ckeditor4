@bender-tags: feature, 4.12.0, pastefromword, 2598
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, sourcearea, elementspath, list, pagebreak, table, image, div

1. Using Microsoft Word open/create a document with a page break (e.g. [`page_break.docx`](%BASE_PATH%/plugins/pastefromword/manual/_assets/page_break.docx)).
1. Select the whole document.
1. Paste it into CKEditor instances.

## Editor with Page Break plugin

### Expected

Content has been pasted with page breaks.

### Unexpected

Page breaks are not preserved.

## Editor without Page Break plugin

### Expected

Page breaks are not preserved.

### Unexpected

Content has been pasted with page breaks.

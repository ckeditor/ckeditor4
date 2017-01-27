@bender-tags: tc, 4.7.0, 16826, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, sourcearea, elementspath, list

1. Using Microsoft Word open/create a document with list (e.g. [`Ordered_list_multiple.docx`](https://github.com/ckeditor/ckeditor-dev/blob/c9dbec1769c1987b48fa4d7823a71643bd2d5f14/tests/plugins/pastefromword/generated/_fixtures/Ordered_list_multiple/Ordered_list_multiple.docx)).
1. Select the whole list.
1. Paste it into CKEditor instance.

**Expected:** List items doesn't have paragraphs in it.

**Unexpected:** Paragraphs are present in `li` elements.
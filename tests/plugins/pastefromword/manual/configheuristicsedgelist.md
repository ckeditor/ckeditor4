@bender-tags: tc, 4.6.2, 16682, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, sourcearea, elementspath, list

Testing [`config.pasteFromWord_heuristicsEdgeList`](http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-pasteFromWord_heuristicsEdgeList) set to `false`.

1. Using Microsoft Word open/create a document with list (e.g. [`Unordered_list.docx`](https://github.com/ckeditor/ckeditor-dev/blob/master/tests/plugins/pastefromword/generated/_fixtures/Unordered_list/Unordered_list.docx)).
1. Select the whole list.
1. Paste it into CKEditor instance.

	**Expected:** List **is** pasted as a set of paragraphs.

	**Unexpected:** List is pasted as semantic element.
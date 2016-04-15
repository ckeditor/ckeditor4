@bender-tags: tc, link, 7154, 4.5.5
@bender-ui: collapsed
@bender-ckeditor-plugins: link, toolbar, wysiwygarea, source

----

1. Click and put cursor in link.
2. Open link dialog.
3. Change Display Text input to "baz".
4. Click OK.
5. Click Source button.

**Expected:**
* The Display Text input was not disabled.
* The Display Text input contained the text `bar` when opened.
* The source should be `foo <a href="http://example.com">baz</a>.`

1. Click Source button again to show wysiwyg editor.
2. Select everything in the editor.
3. Click the link icon to open link dialog.

**Expected:**
* The Display text input should be disabled and contain `<< Selection in Document >>`
* The URL text input should be empty.

1. Change URL text input to `ckeditor.com`
2. Click OK.
3. Click the Source button.

**Expected:**
* The source should be `<a href="http://ckeditor.com">foo </a><a href="http://example.com">baz</a>.`

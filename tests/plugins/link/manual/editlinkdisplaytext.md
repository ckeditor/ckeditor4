@bender-tags: bug, link, trac7154, 4.5.11
@bender-ui: collapsed
@bender-ckeditor-plugins: link, toolbar, wysiwygarea, sourcearea, basicstyles

----

1. Click and put cursor in link.
1. Open link dialog.
	* The Display Text contains `bar` value.
	* The Display Text input is not disabled.
1. Change Display Text input to "baz".
1. Click OK.
	* The link should get selected, like so `foo [baz].`
1. Click Source button.

**Expected:**

The source should be `<p>foo <a href="http://example.com">baz</a>.</p>`

1. Click Source button again to show wysiwyg editor.
1. Select all the content in the editor.
1. Click the link icon to open link dialog.
	* The Display text input should contain `foo baz.` value.
	* The URL text input should be empty.
1. Change URL text input to `ckeditor.com`
1. Click OK.
1. Click the Source button.

**Expected:**
* The source should be `<p><a href="http://ckeditor.com">foo baz.</a></p>`

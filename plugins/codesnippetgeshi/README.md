Code Snippet GeSHi plugin
==================================================

The **Code Snippet GeSHi** is an extension of [Code Snippet](http://ckeditor.com/addon/codesnippet) plugin,
which uses [GeSHi](http://qbnz.com/highlighter/) server-side syntax highlighting engine instead
of default, client-side [highlight.js](http://highlightjs.org).

### Requirements

* CKEditor 4.4+
* [Code Snippet](http://ckeditor.com/addon/codesnippet) plugin.
* A modern web browser or **IE9+**.

### Installation

See the official [Plugin Installation Guide](http://docs.ckeditor.com/#!/guide/dev_plugins).

## Sample configurations

The following configuration assumes that [GeSHi](http://qbnz.com/highlighter/) is located
in `plugins/codesnippetgeshi/lib`:

	CKEDITOR.replace( 'editor1', {
		extraPlugins: 'codesnippet,codesnippetgeshi',
		codeSnippetGeshi_url: 'lib/geshi/colorize.php'
	} );

**Note**: It is possible to specify absolute path in [`codeSnippetGeshi_url`](http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-codeSnippetGeshi_url). 

**Note**: [`codeSnippet_languages`](http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-codeSnippet_languages) 
can be used to reduce the list of available languages.

	CKEDITOR.replace( 'editor1', {
		extraPlugins: 'codesnippet,codesnippetgeshi',
		codeSnippet_languages: {
			html4strict: 'HTML',
			html5: 'HTML5',
			javascript: 'JavaScript',
			php: 'PHP',
			sql: 'SQL'
		},
		codeSnippetGeshi_url: 'http://example.com/geshi/colorize.php'
	} );
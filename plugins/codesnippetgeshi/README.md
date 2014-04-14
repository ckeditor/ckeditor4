Code Snippet GeSHi plugin
==================================================

The **Code Snippet GeSHi** plugin is an extension of the [Code Snippet](http://ckeditor.com/addon/codesnippet) plugin
that uses the [GeSHi](http://qbnz.com/highlighter/) server-side syntax highlighting engine instead
of the default, client-side [highlight.js](http://highlightjs.org).

## Requirements

* CKEditor 4.4+
* The [Code Snippet](http://ckeditor.com/addon/codesnippet) plugin.
* A modern web browser or **IE9+**.

## Installation

See the official [Plugin Installation Guide](http://docs.ckeditor.com/#!/guide/dev_plugins).

## Sample Configuration

The following configuration assumes that [GeSHi](http://qbnz.com/highlighter/) is located
in the `plugins/codesnippetgeshi/lib` directory:

	CKEDITOR.replace( 'editor1', {
		extraPlugins: 'codesnippet,codesnippetgeshi',
		codeSnippetGeshi_url: 'lib/geshi/colorize.php'
	} );

It is possible to specify an absolute path in the [`codeSnippetGeshi_url`](http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-codeSnippetGeshi_url) configuration setting. 

**Note**: The [`codeSnippet_languages`](http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-codeSnippet_languages) configuration setting can be used to reduce the list of available languages.

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
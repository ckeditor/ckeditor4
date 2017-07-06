@bender-tags: link, bug, trac7154, 4.5.11
@bender-ui: collapsed
@bender-ckeditor-plugins: link, toolbar, wysiwygarea, sourcearea, basicstyles, format, undo

## Selection with header

1. Put the selection like follows:

	```
	h[eader

	fo]o
	```

1. Insert a link using a "Link" button.
1. Set URL to `foo`.
1. Click OK button.

### Expected

* Selected fragment of header is linked.
* Selected fragment of a paragraph is linked.
* Header has not been removed.
* Following HTML as source: `<h1>h<a href="http://foo">eader</a></h1><p><a href="http://foo">fo</a>o</p><p><a href="myCustomUrl">bar</a></p><p>baz</p>`.

@bender-ui: collapsed
@bender-tags: 4.11.0, 965, bug,htmlwriter
@bender-ckeditor-plugins: wysiwygarea,toolbar,link,htmlwriter,sourcearea

1. Click the "Source" button.
	## Expected

	`a[href]` attribute is equal to `https://foo.bar?foo=1&bar=2` note `&` character it should not be encoded into an entity.

	## Unexpected

	`&` character in `a[href]` gets encoded to `&amp;`.
1. Repeat steps for other editors.

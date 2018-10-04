@bender-ui: collapsed
@bender-tags: 4.11.0, feature, 1815
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, link, autolink

1. Focus the editor.
1. Type `http://example.com example`.

## Expected

Typed link text is turned into an anchor. The rest of the text i.e. `example` is preserved as a plain text.

## Unexpected

Whole typed text is turned into an anchor.

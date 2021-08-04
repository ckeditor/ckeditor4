@bender-tags: 4.16.2, bug, 4555
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, enterkey, elementspath, basicstyles, sourcearea

1. Select all content in the editor.
2. Apply "small" font size.
3. Apply "medium" font size.

## Expected result

* The font is visibly bigger after applying medium font size.
* There is only one `span` element with `[class]` attribute inside the editor's content.

## Unexpected result

* The font size didn't change after applying medium font size.
* There is more than one `span` element with `[class]` attribute inside the editor's content.

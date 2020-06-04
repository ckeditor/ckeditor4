@bender-ui: collapsed
@bender-tags: 4.13.0, 4.8.0, feature, 468, 3354
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image2, list, elementspath, clipboard, link

## Custom types

1. Select part of the editor content.
1. Copy using `ctrl/cmd+c`.
1. Paste the clipboard into the same editable.

### Expected

1. Table contains 4 types: `Text`, `text/html`, `foo-bar`, `baz`.
1. Each type has a value: `<type> value`, e.g. `foo-bar` has `foo-bar value`.

_In Edge 16+, `Native HTML data` contains also special comment with custom MIME types encoded. e.g.:
`<!--cke-data:%7B%22type%22%3A%22value%22%7D-->text/html value`_

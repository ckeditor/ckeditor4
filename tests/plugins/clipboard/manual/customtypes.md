@bender-ui: collapsed
@bender-tags: 4.8.0, feature, 468
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image2, list, elementspath, clipboard, link

## Custom types

1. Select part of the editor content.
1. Copy using `ctrl/cmd+c`.
1. Paste the clipboard into the same editable.

### Expected

1. Table contains 4 types: `Text`, `text/html`, `foo-bar`, `baz`.
1. Each type has a value: `<type> value`, e.g. `foo-bar` has `foo-bar value`.

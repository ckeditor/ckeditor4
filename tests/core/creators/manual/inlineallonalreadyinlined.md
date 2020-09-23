@bender-tags: 4.15.1, bug, 4293
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, basicstyles, floatingspace

1. Open the console.
2. Press "Inline all" button.

## Expected

1. There are no errors in the console.
2. The second editor is created.

## Unexpected

1. There are errors in the console, especially `editor-element-conflict` one.
2. The second editor is not created.

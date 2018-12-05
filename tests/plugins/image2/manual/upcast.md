@bender-tags: 4.11.2, bug, 2506
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2, sourcearea

1. Open developer console.
1. Press `source` button.
1. Paste following into editor:
<textarea><figure class="image"></figure></textarea>
1. Press `source` again.

## Expected:

- There are no errors logged to console.

## Unexpected:

- `TypeError` is thrown.

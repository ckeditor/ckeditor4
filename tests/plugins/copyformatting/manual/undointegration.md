@bender-ui: collapsed
@bender-tags: bug, copyformatting, 4.11.3, trac16675
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, undo, basicstyles

## Test both editors
1. Add some content to editor (e.g. new line), to "avctivate" undo step.
2. Start to click around editor to change selection inside editor (20-25 times). Selection have to differ between adjacent steps.

### Expected:
Undo UI button is active.

### Unexpected:
Undo UI became disabled.

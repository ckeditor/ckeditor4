@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.13.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, list, liststyle

**NOTE:** For modern browsers you will see "real" HTML in **expected** results instead of `[element HTML]` string.

1. Open context menu over the unordered list and click properties option.
2. Verify status above the editor.

## Expected

Dialog name: **bulletedListStyle** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[element HTML]`

4. Repeat 1-2 for ordered list.

## Expected

Dialog name: **numberedListStyle** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[element HTML]`

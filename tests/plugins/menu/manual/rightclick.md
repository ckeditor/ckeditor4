@bender-ui: collapsed
@bender-tags: 2858, 4.13.0, bug
@bender-ckeditor-plugins: wysiwygarea, language, contextmenu, clipboard, toolbar, sourcearea

## Procedure

1. Open console.
2. Open editor's context menu by right-clicking its content.
3. Right click any menu item.

	### Expected result:

	Focus remains on the first option.

	WARNING: it's best to check it using arrow keys, as visible focus indicator (background + outline) can be in fact moved to the clicked option.

	### Unexpected result:

	Action connected with clicked item is applied to the editor.
4. Press `Space`/`Enter`.

	### Expected result:

	Action connected with focused item is applied to the editor.

	### Unexpected result:

	Error is thrown.

Repeat the procedure for the menu under "Language" button.

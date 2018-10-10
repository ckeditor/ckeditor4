@bender-tags: bug, 4.6.0, config
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, colorbutton, font, list, table, image, pastefromword, sourcearea, elementspath

Testing [`config.pasteFromWordRemoveFontStyles`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html#cfg-pasteFromWordRemoveFontStyles) set to `true`.

1. Paste some content from Word that contains following font styling:
	* font size;
	* font family;
	* font foreground/background color.

You might use `Config_remove_font_styles.docx` as an example.

**Expected:** editor 1: no font formatting is preserved.

**Expected:** editor 2: font formatting is preserved.

**Note:** It's OK to transfer styles like `text-decoration`.

You could also paste stuff like tables / lists. These should still be preserved, but without font formatting though.

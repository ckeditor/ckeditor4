@bender-tags: 4.11.0, feature, emoji, 2062
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, emoji, clipboard, undo
@bender-ui: collapsed

1. Open the emoji dropdown in the first editor.

  ### Expected

	Dropdown contains two emojis:

	* 🍕 in the "People" category.
	* 🍰 in the "Nature" category.

  ### Unexpected

	Any different emojis than the above.

1. Insert a 🍕 emoji.

	### Expected

	Emoji gets inserted into the first editor.

1. Use **Editor two**.
1. Open the emoji dropdown in the editor.

	### Expected

	Dropdown contains one emoji:

	* ⭐ in the "Travel and places" category.

	### Unexpected

	Any different emojis than the above.

1. Insert a ⭐ emoji.

	### Expected

	Emoji gets inserted into the second editor.

	### Unexpected

	Emoji gets inserted into other editor / wrong emoji being inserted.

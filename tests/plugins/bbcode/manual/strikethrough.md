@bender-tags: 3315, feature, 4.13.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, bbcode, undo, justify, basicstyles, sourcearea, elementspath

# BBCode strikethrough

1. Focus the editor.
1. Select some text.
1. Apply Strikethrough.
1. Press "Source" button.

  ## Expected

  Strikethrough text is represented with `[s]...text[/s]`.

  ## Unexpected

  There's no `[s]` tag.
  
5. Switch back to WYSIWYG mode.

  ## Expected

  Strikethrough text formatting is still visible.

  ## Unexpected

  Strikethrough text lost it's formatting.

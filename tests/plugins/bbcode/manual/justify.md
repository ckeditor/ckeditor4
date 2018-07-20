@bender-tags: 2248, feature, 4.11.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, bbcode, undo, justify, basicstyles, sourcearea, elementspath

# BBCode justification

1. Focus the editor.
1. Select `[One]`.
1. Press "Center" button.
1. Press "Source" button.

  ## Expected

  "One" gets wrapped with `[center]` markers, like so: `[center]One[/center]`.

  ## Unexpected

  There's no `[center]` tag.

1. Try other combinations.

## Notes

Applying left aligned on an already left aligned code doesn't result with explicit `[left]` tag application, that's an issue of justify plugin.
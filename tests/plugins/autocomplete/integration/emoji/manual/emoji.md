@bender-tags: 4.16.0, feature, 3582
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo
@bender-ui: collapsed

1. Select mode (Left / Right / Bottom).
1. Place selection inside editor content as close as possible to window border.
1. Type `:da`.

  ### Expected:

  Emoji panel should appear inside browser viewport and be fully visible.

  ### Unexpected:

  Emoji panel appears outside browser borders and is not fully visible.

1. Play around with different caret placements to check if the panel is always visible and accessible.

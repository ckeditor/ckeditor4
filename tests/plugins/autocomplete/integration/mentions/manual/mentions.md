@bender-tags: 4.16.0, feature, 3582
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, mentions, clipboard, undo
@bender-ui: collapsed

*Repeat steps below for all 3 editors and modes (Left, Right and Bottom - but skip the last one on IE 10 and older).*

1. Select mode (Left / Right / Bottom).
1. Place selection inside editor content as close as possible to window border.
1. Type `@`.

  ### Expected:

  Mentions panel should appear inside browser viewport and be fully visible.

  ### Unexpected:

  Mentions panel appears outside browser borders and is not fully visible.

1. Play around with different caret placements to check if the panel is always visible and accessible.

@bender-ui: collapsed
@bender-tags: 4007, 4.15.0, bug
@bender-ckeditor-plugins: wysiwygarea, stylescombo, toolbar

**Note:** This is the test for screen readers, so open one before testing.

1. Press <kbd>Tab</kbd> key multiple times to move focus to the editor.
1. Press <kbd>Alt+F10</kbd> to switch focus to the toolbar and navigate to the `Styles` combo.

  **Expected:**

  * ChromeVox, NVDA, Narrator, VoiceOver - announced the list is collapsed.
  * JAWS announced how to navigate through dropdown in its own way.

  **Unexpected:**

  Screen reader didn't announce that combo is collapsed.

1. Press <kbd>Space</kbd>.

  **Expected:**

  * ChromeVox and NVDA - announced the list is expanded.
  * Narrator and VoiceOver - didn't announce the list is expanded (they follow the browser focus too quickly and move to the list itself).
  * JAWS announced how to navigate through dropdown in its own way.

  **Unexpected:**

  Different behaviour than described above (depending on the screen reader).

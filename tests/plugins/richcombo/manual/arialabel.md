@bender-ui: collapsed
@bender-tags: 4493, 4.16.1, bug
@bender-ckeditor-plugins: wysiwygarea, stylescombo, toolbar

**Note:** This is the test for screen readers, so open one before testing.

1. Press <kbd>Tab</kbd> key multiple times to move focus to the editor.
2. Press <kbd>Alt+F10</kbd> to switch focus to the toolbar and navigate to the `Styles` combo.

  **Expected:**

  * Screen reader announces the name of the combo (`Styles`).

  **Unexpected:**

  Screen reader didn't announce the combo's name.

3. Press <kbd>Space</kbd>, move with arrows keys and press <kbd>Space</kbd> to select one of the values.

4. Focus `Styles` combo once more by repeating steps 1 & 2.

  **Expected:**

  * Screen reader announces `<selected value>, Styles`.

  **Unexpected:**

  * Screen reader announces only `Styles`.

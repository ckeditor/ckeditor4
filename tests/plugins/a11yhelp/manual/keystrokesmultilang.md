@bender-tags: manual, 456, 4.8.0, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, a11yhelp

1. Focus the first editor.
1. Press `Ctrl/Cmd + /`.

  **Expected:**  Table contains at least 2 keystrokes `Alt + 0` and `Strg + Schrägstrich`.

1. Focus the second editor.
1. Press `Ctrl/Cmd + /`.

  **Expected:** Table contains at least 2 keystrokes `Alt + 0` and `Ctrl/Cmd + Forward Slash` (English language).

  **Unexpected:** Hotkeys are in German language.

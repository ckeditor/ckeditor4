@bender-ui: collapsed
@bender-tags: 4.9.0, bug, 869
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard

----

1. Select some text in editor.
1. Copy text with shortcut `Ctrl/Cmd + C`.
1. Paste text in editor.
1. Now make collapsed selection.
1. Copy this collapsed selection with shortcut `Ctrl/Cmd + C`.
1. Paste text in editor.

**Expected:** Previously selected text is paste in editor.

**Unexpected:** There is nothing pasted in editor.

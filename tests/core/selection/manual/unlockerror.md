@bender-tags: selection, 4.14.1, bug, 3931
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, basicstyles, clipboard

**Note:** Make sure that you have default level for Clipboard access. For example in IE 11 you can change it in a browser options at: _Internet Options > Security > Custom Level > Scripting > Allow Programmatic Clipboard Access > Prompt_.

1. Open browser console.
1. Copy HTML above the editor.
1. Paste HTML into the editor using paste button.
1. Make sure that Clipboard Access Prompt alert showed up.
1. Allow Clipboard Access.

  **Expected:** No console error. Content gets pasted.

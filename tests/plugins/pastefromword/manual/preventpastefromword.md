@bender-tags: bug, 4.6.0, config, word
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, list, basicstyles, pastefromword, sourcearea, elementspath, newpage

## Preventing direct paste

1. Create / open word document with rich formatting.
1. Copy it and paste into the editor.

### Expected

* The content **is not** handled by the PFW plugin.

## Paste using dialog

1. Use same Word document as in previous test.
1. Click on "Paste from Word" button.
1. If your browser shows the popup dialog, paste the content inside of it.

### Expected

* The content **is** handled by the PFW plugin.

Note: It might be hard to tell for IE as it's pasting pretty nice markup out of Word, so you can look at "Was last paste (...)" information.

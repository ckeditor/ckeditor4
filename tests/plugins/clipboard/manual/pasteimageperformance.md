@bender-ui: collapsed
@bender-tags: 4.17.0, clipboard, 4807
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image, clipboard, sourcearea

 1. Open Developer Tools and make sure log output contains the `Verbose` level.
 1. Paste an image with a size of 20-25 MB from your clipboard into the first editor.
 1. Observe the browser log - after a delay it outputs `[Violation] 'paste' handler took Xms` - take note of the time spent.
 1. Paste the same image in the second editor.
 1. Observe the browser log - after a delay it outputs `[Violation] 'paste' handler took Xms` - take note of the time spent.

**Expected** The paste violation for the first editor is reduced to approx. 30% compared to the paste violation for the second editor.

**Unexpected** The violation entries are almost identical in time usage.
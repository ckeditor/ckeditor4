@bender-ui: collapsed
@bender-tags: 4.17.0, clipboard, 4807
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image, clipboard, sourcearea

 1. Copy an image with a size of 20-25 MB from an image editor.
 1. Open Developer Tools in Chrome and make sure log output contains the `Verbose` level.
 1. Paste the image from your clipboard into the first editor.
 1. Observe the browser log - after a delay it outputs `[Violation] 'paste' handler took Xms` - take note of the time spent.
 1. Paste the same image in the second editor (* see note).
 1. Observe the browser log - after a delay it outputs `[Violation] 'paste' handler took Xms` - take note of the time spent.

**Expected** The paste violation for the first editor is reduced to 30% or less compared to the paste violation for the second editor.

**Unexpected** The violation entries are almost identical in time usage.

**Note**

Image might not become visible when pasted in the second editor, because it does not have a plugin installed to handle the clipboard data.
However, if image is copied from a browser, the image actually will emerge as it is merely referenced with its URL. The test and measurement
of the paste violation will still be valid though.

Also note that the first editor is capable of reading clipboard data copied from the file system (e.g. from Finder on macOS and from Explorer on Windows),
while the second editor is not - make sure to copy an actual image into the clipboard, preferably from an image editor.

Results may vary depending on hardware and platform.
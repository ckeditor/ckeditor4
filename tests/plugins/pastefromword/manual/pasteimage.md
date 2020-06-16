@bender-tags: bug, 4.7.0, trac16912
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, pastefromword, elementspath, image, format

1. Select the image.
1. Copy it (`ctrl/cmd + c` or `Copy` button).
1. Put caret somewhere else.
1. Paste the image as `Word` (Click `Paste from Word` button and follow the instructions).

**Expected:** Image is pasted.

**Unexpected:** Image is not pasted, error is thrown in the console.

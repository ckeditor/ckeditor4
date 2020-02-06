@bender-tags: 4.14.0, bug, 2517
@bender-ui: collapsed
@bender-ckeditor-plugins: image2, wysiwygarea, toolbar, sourcearea, floatingspace, elementspath

**Please note**: You can use such link: `/tests/_assets/lena.jpg`.

1. Open browser console.
1. Start selection at the text below the image (`^`) and restore mouse button over the image.
1. Open image dialog and insert new image.

**Expected:** New image has been added to the editor.

**Unexpected:** Browser console error shows up.

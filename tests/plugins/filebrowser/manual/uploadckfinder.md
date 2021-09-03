@bender-tags: 4.9.1, bug, 1835
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, filebrowser, filetools, image, link, floatingspace

# CKFinder upload

1. Open Image dialog using the Image button.
2. Go to the Upload tab.
3. Choose an image to be uploaded.
4. Click the "Send it to the Server" button.

## Expected

No errors are displayed.

CKFinder _might_ report an alert like: "A file with the same name already exists. The uploaded file was renamed to "city-wallpaper-47(8).jpg"." - that's fine it only means that the file was renamed.

## Unexpected

There should be no errors, e.g. like (but not limited to):

* "Network error occurred during file upload."
* "Incorrect server response."

@bender-tags: 4.21.0, feature, 4400, 5431
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, uploadimage, undo, image2
@bender-include: ../../uploadwidget/manual/_helpers/xhr.js

**Note:** dropped images are replaced with Lena photo after the "upload" is finished.

1. Drop [JPG image](%BASE_PATH%_assets/lena.jpg) into the editor.

**Expected** The image is inserted into the editor.

**Unexpected** The image is not inserted into the editor and the notification about unsupported image format is shown.

2. Drop [PNG image](%BASE_PATH%_assets/logo.png) into the editor.

**Expected** The image is not inserted into the editor and the notification about unsupported image format is shown.

**Unexpected** The image is inserted into the editor.

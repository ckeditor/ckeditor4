@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, imagebase, elementspath, placeholder, cloudservices, easyimage
@bender-include: %BASE_PATH%/plugins/easyimage/_helpers/tools.js

## Upload Feature

1. Drop any file from your file system to the editable.

## Expected

A placeholder widget is created, containing file name.

**Note:** at the time of writing Cloud Service accepts only images, and return `400` code for any other resource type.

_If you're truly curious about the actual URL returned by Cloud Services, you can find it in console log._

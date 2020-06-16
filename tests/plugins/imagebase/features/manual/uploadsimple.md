@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, imagebase, cloudservices, easyimage
@bender-include: %BASE_PATH%/plugins/easyimage/_helpers/tools.js

## Upload Widget

1. Drop a png/jpg files into the editor.

## Expected

A simple widget with the name of a file is created.

**Note:** at the time of writing Cloud Service accepts only images, and return `400` code for any other resource type.

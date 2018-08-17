@bender-tags: 4.9.0, feature, 932, tp3301
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage
@bender-include: ../_helpers/tools.js

## Easy Image Upload

Upload some small image, e.g. [`foo.png`](%BASE_PATH%plugins/image2/_assets/foo.png).

### Expected

Image has its natural dimensions.

### Unexpected

Image is stretched to fill whole editor's width.

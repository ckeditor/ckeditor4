@bender-tags: 4.9.0, feature, 932, tp3131
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, toolbar, easyimage
@bender-include: %BASE_PATH%plugins/uploadwidget/manual/_helpers/xhrerror.js

## Easy Image Upload Error

Upload some images (might by few at a time) to any editor. The image upload will be automatically canceled after around 50% progress.

### Expected

* For each started upload `createObjectURL` was logged in the console once.
* For each canceled/errored upload `revokeObjectURL` was logged in the console once.

### Unexpected

The `createObjectURL` and `revokeObjectURL` methods were logged less/more than once per image.

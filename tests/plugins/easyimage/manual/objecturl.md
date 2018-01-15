@bender-tags: 4.9.0, feature, 932, tp3131
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage
@bender-include: _helpers/tools.js

## Easy Image Upload

Upload some images (might by few at a time) to any editor. You may also try to abort/cancel uploading
(by e.g. switching to `source mode` or deleting a widget).

**Notice**: deleting widget or switching to `Source mode` during upload will not log `revokeObjectURL` due to upstream
issue ([#1454](https://github.com/ckeditor/ckeditor-dev/issues/1454)).

### Expected

* For each started upload `createObjectURL` was logged in the console once.
* For each finished (even canceled or aborted) upload `revokeObjectURL` was logged in the console once.

### Unexpected

The `createObjectURL` and `revokeObjectURL` methods were logged less/more than once per image.

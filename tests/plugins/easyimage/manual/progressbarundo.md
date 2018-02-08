@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage, undo, resize
@bender-include: ../../uploadwidget/manual/_helpers/xhr.js

## Progressbar with Undo

_Proceed for all editor instances._

1. Upload some image or images (using drag and drop, copy/paste, etc).
2. During image upload manipulate selection (click somewhere, select some editor content, etc).

### Expected

**Snapshot contains progressbar** should always be _false_.

### Remarks

* In the end your image will be replaced with old CKEditor 4 logo.
* Upload progress is intentionally slowed down.

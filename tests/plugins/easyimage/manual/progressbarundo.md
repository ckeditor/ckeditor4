@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage, undo, resize

## Easy Image Progressbar Undo

1. Upload some images (using drag and drop, copy/paste, etc).
2. During image upload manipulate selection (click somewhere, select some editor content, etc).

### Expected

**Saved undo steps** counter should not increment on selection manipulation.

**Important**: Selecting or deselecting widget will create an undo step.

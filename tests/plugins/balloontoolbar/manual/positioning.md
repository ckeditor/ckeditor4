@bender-tags: 4.11.4, bug, balloontoolbar, 1076
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,balloontoolbar
@bender-ui: collapsed

Check balloon toolbars initial position in relation to the editors editable.

## Expected

The balloon toolbar is located inside the editable.

## Unexpected

The balloon toolbar is located outside the editable.

**Note**: When editor is loaded outside of the browser viewport the balloon toolbar may be positioned incorrectly (see [#2978](https://github.com/ckeditor/ckeditor4/issues/2978)).

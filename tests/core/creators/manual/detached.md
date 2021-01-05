@bender-tags: 4.16.0, bug, 4461
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, sourcearea, undo, clipboard, basicstyles, elementspath

1. Use first button to attach first editor targeting element to DOM.
2. Use second button to attach second editor targeting element and create it from callback.

**Expected** Each editor is created. Each editor is editable. Each editor contains initial data.

**Unexpected** Editor isn't created. Editor data is empty. Editor data is not editable.

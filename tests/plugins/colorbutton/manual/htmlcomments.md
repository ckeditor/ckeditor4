@bender-tags: bug, 2294, 4.10.1
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton

1. Open the console.
1. Focus the editor.
1. Select all the contents (`ctrl/cmd+a`).
1. Click "Background Color" button in the toolbar.

### Expected

Content gets bolded, no error are thrown in the console.

### Actual

Content gets Bold but a js error is thrown.

### Notes

[Edge will throw `Premission denied` exception](https://github.com/ckeditor/ckeditor-dev/issues/2035), this particular error is not related to this test.
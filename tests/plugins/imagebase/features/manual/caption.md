@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcedialog, wysiwygarea, floatingspace, toolbar, imagebase, link, htmlwriter, elementspath, easyimage

Check if caption is working correctly:

* If caption is empty, it's hidden when widget is blurred.
* If caption is empty and is focused, it's shown and it contains a placeholder text.
* In source mode every widget contains `figcaption` element.
* In source mode there are no attributes for any `figcaption` element.

Repeat these checks for all editors.

## Note

On Edge you could be affected by [#1458](https://github.com/ckeditor/ckeditor4/issues/1458) and have to double click widget to focus it.

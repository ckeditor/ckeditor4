@bender-tags: 4.8.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, imagebase, link, htmlwriter, elementspath

Check if caption is working correctly:

* In source mode every widget contains `figcaption` element.
* In source mode there are no attributes for any `figcaption` element.
* If caption is empty, it's hidden when widget is blurred.
* If caption is empty, it's shown when widget is focused.
* If caption is empty, it contains placeholder text.

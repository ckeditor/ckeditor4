@bender-ui: collapsed
@bender-tags: placeholdertext, feature, 4.15.0
@bender-ckeditor-plugins: wysiwygarea, placeholdertext, toolbar, undo, basicstyles, clipboard, floatingspace

Check if:

* placeholder text is present inside the empty editor after its initialization;
* placeholder text is not present inside the non-empty editor after its initialization;
* placeholder text is hidden when editor is focused;
* after deleting whole content from the editor and blurring it (both via keyboard and mouse), placeholder text appears;
* removing/adding placeholder does not create undo step;
* placeholder text is semi-transparent;
* placeholder text is not returned by call to `editor.getData()`.

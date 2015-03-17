@bender-tags: 4.5.0, tc, range, selection
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, table, image, list, link, format

1. Make different selections (using mouse and keyboard).
2. At any moment the selection shouldn't automagically change.

Background: every 1s a `range.cloneContents` method is called (you can see its result on the console). This method tended to break selection.
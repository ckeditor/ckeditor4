@bender-tags: widget, bug, 4.5.3, trac13414
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, floatingspace, elementspath, htmlwriter, enterkey

### Test if auto paragraphing is disabled in nested editables:

1. Click on widget's editable with _"Edit me..."_ text.
2. Add more characters.
 ### Expected
 Elements path shows: `body` `test-widget` `div`

3. Click "Source"
 ### Expected
 * There's **no** paragraph within `<div class="content">`.

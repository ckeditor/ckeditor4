@bender-tags: widget, tc, 4.5.3, 13414
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, floatingspace, elementspath, htmlwriter, enterkey

### Test if auto paragraphing is disabled in nested editables:
1. Click on widget's editable with 'Edit me...' text.
2. Add more characters.

### Expected
Elements path shows:
`body` `test-widget` `div`

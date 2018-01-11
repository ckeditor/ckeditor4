@bender-tags: 4.8.1, bug, 1419, widgetselection
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,widgetselection,elementspath

----

Test should be performed on a Windows operating system with Polish keyboard layout. You can't validate this test case on UNIX based systems. 

1. Set system settings to use Polish keyboard layout.
2. Focus editor instance.
3. Press `Alt + a` to insert `ą` letter.

## Expected
`ą` letter has been inserted at the caret position. Editor content has not been selected.

## Expected
`ą` letter has not been inserted and/or editor content has been selected.

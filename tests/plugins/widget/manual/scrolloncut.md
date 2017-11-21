@bender-ui: collapsed
@bender-tags: 4.8.0, 1160, bug
@bender-ckeditor-plugins: wysiwygarea,toolbar,undo,elementspath,clipboard,floatingspace,sourcearea,htmlwriter,image2,format,blockquote

## For each editor instance:

 * Select widget inside editor.
 * Cut widget (`Ctrl/Cmd + X` or `Cut` button).

### Expected:

Widget is cut. Editor content does not scroll upon cut or scrolls in a way that after widget is removed, caret is still visible near top of the content.



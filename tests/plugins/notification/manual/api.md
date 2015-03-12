@bender-tags: 4.5.0, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, notification, floatingspace
@bender-include: _helpers/manualplayground.js

Play with notifications using console, e.g.:

```js
var editor = CKEDITOR.instances.editor1;

var warning = editor.showNotification( 'Foo', 'warning' );
warning.hide();

var progress = editor.showNotification( 'Bar', 'progress', 0.1 );
progress.update( { progress: 0.5 } );
progress.update( { type: 'success', message: 'Done!', important: true } );
```
Check if API is complete and consistent.

**Note:** if you close notification it will be shown again if update is important.
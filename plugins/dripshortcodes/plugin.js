( function() {
  CKEDITOR.plugins.add( 'dripshortcodes', {
    init: function( editor ) {
      editor.addCommand( 'showShortcodesModal', {
        exec: function( editor ) {
          editor.fire("shortcodesModalRequested");
        }
      } );

      editor.ui.addButton( 'Shortcodes', {
        label: 'View Shortcodes',
        command: 'showShortcodesModal',
        toolbar: 'help'
      });
    }
  } );
} )();
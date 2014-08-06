( function() {
  CKEDITOR.plugins.add( 'dripuploads', {
    icons: 'uploads',
    hidpi: true,
    init: function( editor ) {
      var allowed = 'img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}',
          required = 'img[alt,src]';

      editor.addCommand( 'showUploadsModal', {
        allowedContent: allowed,
        requiredContent: required,
        exec: function( editor ) {
          editor.fire("uploadsModalRequested");
        }
      } );

      editor.ui.addButton( 'Uploads', {
        label: 'Insert Image',
        command: 'showUploadsModal',
        toolbar: 'insert'
      });
    }
  } );
} )();
CKEDITOR.addCss(
    '[data-start-counter-class] {' +
        'position: relative;' +
    '}' +
    '[data-start-counter-class]:after {' +
        'content: "";' +
        'position: absolute;' +
        'bottom: 0px;' +
        'left: 0;' +
        'height: 1px;' +
        'width: 100%;' +
        'border-bottom: 2px dashed #000;' +
    '}'
);
CKEDITOR.plugins.add( 'rkpi', {
    icons: 'about',
    lang: 'en',
    init: function( editor ) {
        var dialog = CKEDITOR.dialog.add( 'rkpi', this.path + 'dialogs/rkpi.js' );
        var dialogCommand = editor.addCommand( 'openDialog', new CKEDITOR.dialogCommand( 'rkpi' ) );
        editor.ui.addButton( 'Animated Numbers', {
            label: 'Insert Animated Numbers',
            command: 'openDialog',
            toolbar: 'basicstyles,100',
            icon: this.path + 'icons/rkpi4.png'
        });

        // Activate listener for content change
        var style = {
          name: 'runningNumbers',
          element: 'span',
          checkActive: function (elementPath) {
            for(var i = 0; i < elementPath.elements.length; i++) {
              var element = elementPath.elements[i].$
              var isActive = element ? element.getAttribute('data-start-counter-class') != null : false;
              if(isActive) return true;
            }
            return false;
          }
        };
        editor.attachStyleStateChange( style, function( state ) {
          !editor.readOnly && editor.getCommand( 'openDialog' ).setState( state );
        } );
    }
});

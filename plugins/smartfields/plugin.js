( function() {
	CKEDITOR.plugins.add( 'smartfields', {
		lang: 'en,ru', // %REMOVE_LINE_CORE%
    hidpi: true, // %REMOVE_LINE_CORE%
    
		onLoad: function() {
			// Register styles for placeholder widget frame.
			CKEDITOR.addCss( '.cke_placeholder{background-color:#ff0}' );
		},

		init: function( editor ) {
      editor.ui.addRichCombo( 'smartfields', {
        label: 'Smart field',
        title: 'Add a smart field',
        toolbar: 'insert,5',

        panel: {
          css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( editor.config.contentsCss ),
          multiSelect: false
        },

        init: function() {
          this.startGroup( 'Smart Fields' ); 

          var self = this;    
          // this.startGroup( 'My Dropdown Group #1' );
          var smartFields = editor.config.smartFields || [];
          smartFields.forEach(function(smartField) {
            self.add( smartField.value, smartField.label );          
          })
        },

        onClick: function( id ) {
          editor.focus();
          editor.fire( 'saveSnapshot' );

          var fragment = editor.getSelection().getRanges()[0].extractContents();
					var container = CKEDITOR.dom.element.createFromHtml('<span class="cke_placeholder" ' +
						'>[[' + id + ']]</span>', editor.document);

					fragment.appendTo(container);
					editor.insertElement(container);
					editor.widgets.initOn( container, 'placeholder' );
        }
    } );       
		}
	} );

} )();

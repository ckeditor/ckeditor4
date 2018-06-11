/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea */

CKEDITOR.replaceClass = 'ckeditor';

bender.test( {
	'test auto initilization': function() {
		var editor = CKEDITOR.instances.editor1;

		// For Firefox 60.0.1+ this code is executed after 'instanceReady' event so listener won't be called.
		// For that case just assert it right away.
		if ( editor.instanceReady ) {
			this._assertEditor( editor );
		} else {
			CKEDITOR.on( 'instanceReady', function( evt ) {
				if ( evt.editor.name == editor.name ) {
					resume( function() {
						this._assertEditor( editor );
					} );
				}
			} );

			wait();
		}
	},

	'test replace': function() {
		CKEDITOR.replace( 'editor2', { on: {
			instanceReady: function( evt ) {
				resume( function() {
					this._assertEditor( evt.editor );
				} );
			}
		} } );

		wait();
	},

	_assertEditor: function( editor ) {
		assert.areEqual( '<p>ed' + editor.name[ editor.name.length - 1 ] + '</p>', bender.tools.compatHtml( editor.getData() ) );
	}
} );

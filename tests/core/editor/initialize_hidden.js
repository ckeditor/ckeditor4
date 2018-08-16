/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea */

CKEDITOR.replaceClass = 'ckeditor';

bender.test( {
	'test auto initilization': function() {
		var editor = CKEDITOR.instances.editor1,
			expected = '<p>ed1</p>';

		// For Firefox 60.0.1+ this code is executed after 'instanceReady' event so listener won't be called.
		// For that case just assert it right away (#2019).
		if ( editor.status === 'ready' ) {
			this._assertEditor( expected, editor );
		} else {
			editor.once( 'instanceReady', function( evt ) {
				if ( evt.editor.name == editor.name ) {
					resume( function() {
						this._assertEditor( expected, editor );
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
					this._assertEditor( '<p>ed2</p>', evt.editor );
				} );
			}
		} } );

		wait();
	},

	_assertEditor: function( expectedData, editor ) {
		assert.areEqual( expectedData, bender.tools.compatHtml( editor.getData() ) );
	}
} );

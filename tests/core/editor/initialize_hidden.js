/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea */

CKEDITOR.replaceClass = 'ckeditor';

bender.test( {
	'test auto initilization': function() {
		CKEDITOR.on( 'instanceReady', function( evt ) {
			if ( evt.editor.name == 'editor1' ) {
				resume( function() {
					assert.areEqual( '<p>ed1</p>', bender.tools.compatHtml( evt.editor.getData() ) );
				} );
			}
		} );

		wait();
	},

	'test replace': function() {
		CKEDITOR.replace( 'editor2', { on: {
			instanceReady: function( evt ) {
				resume( function() {
					assert.areEqual( '<p>ed2</p>', bender.tools.compatHtml( evt.editor.getData() ) );
				} );
			}
		} } );

		wait();
	}
} );
/* bender-tags: editor */
/* bender-ckeditor-plugins: panel */

( function() {
	'use sctrict';

	bender.editor = {};

	bender.test( {
		// #2035
		'test panel src is empty': function() {
			if ( !CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var editor = this.editor,
				panel = new CKEDITOR.ui.panel( CKEDITOR.document, {
					forceIFrame: true
				} ),
				html = panel.render( editor ),
				src = html.match( /src="([^"]*)"/i )[ 1 ];

			src = src.substring( 5, src.length - 1 );

			assert.areSame( '', src, 'Frame source should be empty.' );
		}
	} );
} )();

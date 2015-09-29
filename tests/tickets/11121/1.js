/* bender-tags: editor,unit */

( function() {
	'use strict';

	bender.test( {
		'test HC detection in hidden iframe': function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
				assert.ignore();
			}

			var iframe = CKEDITOR.document.getById( 'iframe' ),
				doc = iframe.getFrameDocument();

			iframe.on( 'load', function() {
				resume( function() {
					assert.isFalse( iframe.$.contentWindow.CKEDITOR.env.hc, 'High contrast mode should not be enabled' );
				} );
			} );

			doc.$.open();
			doc.$.write( '<script src="' + CKEDITOR.getUrl( 'ckeditor.js' ) + '"></scr' + 'ipt>' );
			doc.$.close();

			wait();
		},

		'test normal HC detection': function() {
			assert.isFalse( CKEDITOR.env.hc, 'High contrast should be disabled' );
		}
	} );
} )();

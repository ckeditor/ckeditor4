/* bender-tags: editor,unit */

( function() {
	'use strict';

	bender.test( {
		'test CKEDITOR.basePath when used src="ckeditor.js?foo&bar"': function() {
			var iframe = CKEDITOR.document.getById( 'iframe-default-params' ),
				doc = iframe.getFrameDocument();

			iframe.on( 'load', function() {
				resume( function() {
					var iCKEDITOR = iframe.$.contentWindow.CKEDITOR;

					assert.areSame( CKEDITOR.basePath, iCKEDITOR.basePath );
				} );
			} );

			doc.$.open();
			doc.$.write( '<script src="' + CKEDITOR.getUrl( 'ckeditor.js' ) + '?foo=1&bar=2"></scr' + 'ipt>' );
			doc.$.close();

			wait();
		},

		'test CKEDITOR.basePath ckeditor.js src pattern': function() {
			var pattern = CKEDITOR._.basePathSrcPattern;

			a( 'ckeditor.js' );
			a( '/ckeditor.js' );
			a( '\\ckeditor.js' );
			a( '/ckeditor.js?foo=1#bar' );
			a( 'CKEDITOR.JS' );
			// #12215
			a( '/ckeditor.js;id=foo-bar' );

			function a( src ) {
				assert.isMatching( pattern, src, src );
			}
		}

		/*
		#12215
		Test impossible to perform with present Bender's capabilities.
		'test CKEDITOR.basePath when used src="ckeditor.js;foo&bar"': function() {
			var iframe = CKEDITOR.document.getById( 'iframe-semicolon-params' ),
				doc = iframe.getFrameDocument();

			iframe.on( 'load', function() {
				resume( function() {
					var iCKEDITOR = iframe.$.contentWindow.CKEDITOR;

					assert.areSame( CKEDITOR.basePath, iCKEDITOR.basePath );
				} );
			} );

			doc.$.open();
			doc.$.write( '<script src="' + CKEDITOR.getUrl( 'ckeditor.js' ) + ';foo=1&bar=2"></scr' + 'ipt>' );
			doc.$.close();

			wait();
		}
		*/
	} );
} )();
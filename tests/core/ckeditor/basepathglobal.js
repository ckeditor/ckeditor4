/* bender-tags: editor */

( function() {
	'use strict';

		// http://tests.ckeditor.dev:1030/
	var path = window.location.protocol + '//' + window.location.host,
		testDir = '%TEST_DIR%',
		// http://tests.ckeditor.dev:1030/tests/core/ckeditor
		folderPath = path + testDir.slice( 0, testDir.lastIndexOf( '/' ) ),
		expectedEditorPath = '/apps/ckeditor/',
		query = CKEDITOR.timestamp ? '?t=' + CKEDITOR.timestamp : '',
		secondDomainName = 'sub.ckeditor.example',
		port = window.location.port;


	// If we're running tests on special port, append it to the second domain too.
	if ( port != 80 ) {
		secondDomainName += ':' + port;
	}

	bender.test( {
		'test default BASEPATH': function() {
			var iframe = CKEDITOR.document.getById( 'iframe-default' ),
				doc = iframe.getFrameDocument(),
				defaultPath = CKEDITOR.basePath;

			iframe.on( 'load', function() {
				resume( function() {
					var iCKEDITOR = iframe.$.contentWindow.CKEDITOR;

					assert.areSame( defaultPath  + 'ckeditor.js' + query,
						iCKEDITOR.getUrl( 'ckeditor.js' ) );
					assert.areSame( defaultPath  + 'skins/default/editor.css' + query,
						iCKEDITOR.getUrl( 'skins/default/editor.css' ) );
					assert.areSame( '/skins/default/editor.css' + query,
						iCKEDITOR.getUrl( '/skins/default/editor.css' ) );
					assert.areSame( 'http://www.otherdomain.com/skins/default/editor.css'  + query,
						iCKEDITOR.getUrl( 'http://www.otherdomain.com/skins/default/editor.css' ) );
				} );
			} );

			doc.$.open();
			doc.$.write(
				'<script src="' + defaultPath + 'ckeditor.js"></scr' + 'ipt>' );
			doc.$.close();

			wait();
		},

		'test full BASEPATH': function() {
			if ( CKEDITOR.env.iOS ) {
				// Tests using `secondDomainName` will not work on iOS where we can not set hosts.
				assert.ignore();
			}

			var iframe = CKEDITOR.document.getById( 'iframe-full' ),
				doc = iframe.getFrameDocument();

			iframe.on( 'load', function() {
				resume( function() {
					var iCKEDITOR = iframe.$.contentWindow.CKEDITOR;

					assert.areSame( 'http://' + secondDomainName + expectedEditorPath, iCKEDITOR.basePath );
					assert.areSame( 'http://' + secondDomainName + expectedEditorPath + 'ckeditor.js' + query,
						iCKEDITOR.getUrl( 'ckeditor.js' ) );
					assert.areSame( 'http://' + secondDomainName + expectedEditorPath + 'skins/default/editor.css' + query,
						iCKEDITOR.getUrl( 'skins/default/editor.css' ) );
					assert.areSame( '/skins/default/editor.css' + query,
						iCKEDITOR.getUrl( '/skins/default/editor.css' ) );
					assert.areSame( 'http://www.otherdomain.com/skins/default/editor.css' + query,
						iCKEDITOR.getUrl( 'http://www.otherdomain.com/skins/default/editor.css' ) );
				} );
			} );

			doc.$.open();
			doc.$.write(
				'<script>CKEDITOR_BASEPATH = "http://' + secondDomainName + expectedEditorPath + '";</scr' + 'ipt>' +
				'<script src="' + CKEDITOR.getUrl( 'ckeditor.js' ) + '"></scr' + 'ipt>' );
			doc.$.close();

			wait();
		},

		'test absolute BASEPATH': function() {
			var iframe = CKEDITOR.document.getById( 'iframe-absolute' ),
				doc = iframe.getFrameDocument();

			iframe.on( 'load', function() {
				resume( function() {
					var iCKEDITOR = iframe.$.contentWindow.CKEDITOR;

					assert.areSame( path + expectedEditorPath, iCKEDITOR.basePath );
					assert.areSame( path + expectedEditorPath + 'ckeditor.js' + query,
						iCKEDITOR.getUrl( 'ckeditor.js' ) );
					assert.areSame( path + expectedEditorPath + 'skins/default/editor.css' + query,
						iCKEDITOR.getUrl( 'skins/default/editor.css' ) );
					assert.areSame( '/skins/default/editor.css' + query,
						iCKEDITOR.getUrl( '/skins/default/editor.css' ) );
					assert.areSame( 'http://www.otherdomain.com/skins/default/editor.css' + query,
						iCKEDITOR.getUrl( 'http://www.otherdomain.com/skins/default/editor.css' ) );
				} );
			} );

			doc.$.open();
			doc.$.write(
				'<script>CKEDITOR_BASEPATH = "' + expectedEditorPath + '";</scr' + 'ipt>' +
				'<script src="' + CKEDITOR.getUrl( 'ckeditor.js' ) + '"></scr' + 'ipt>' );
			doc.$.close();

			wait();
		},

		'test relative BASEPATH': function() {
			var iframe = CKEDITOR.document.getById( 'iframe-relative' ),
				doc = iframe.getFrameDocument(),
				// Transform e.g. "/tests/core/editor/" to "../../..".
				relativeEditorPath = testDir.replace( /[^\/]+/g, '..' ).slice( 1, -1 ) + expectedEditorPath;

			iframe.on( 'load', function() {
				resume( function() {
					var iCKEDITOR = iframe.$.contentWindow.CKEDITOR;

					assert.areSame( path + testDir + relativeEditorPath, iCKEDITOR.basePath );
					assert.areSame( folderPath + '/' + relativeEditorPath + 'ckeditor.js' + query,
						iCKEDITOR.getUrl( 'ckeditor.js' ) );
					assert.areSame( folderPath + '/' + relativeEditorPath + 'skins/default/editor.css' + query,
						iCKEDITOR.getUrl( 'skins/default/editor.css' ) );
					assert.areSame( '/skins/default/editor.css' + query,
						iCKEDITOR.getUrl( '/skins/default/editor.css' ) );
					assert.areSame( 'http://www.otherdomain.com/skins/default/editor.css' + query,
						iCKEDITOR.getUrl( 'http://www.otherdomain.com/skins/default/editor.css' ) );
				} );
			} );

			doc.$.open();
			doc.$.write(
				'<script>CKEDITOR_BASEPATH = "' + relativeEditorPath + '";</scr' + 'ipt>' +
				'<script src="' + CKEDITOR.getUrl( 'ckeditor.js' ) + '"></scr' + 'ipt>' );
			doc.$.close();

			wait();
		},

		'test protocol relative BASEPATH': function() {
			if ( CKEDITOR.env.iOS ) {
				// Tests using `secondDomainName` will not work on iOS where we can not set hosts.
				assert.ignore();
			}

			var iframe = CKEDITOR.document.getById( 'iframe-protocol-relative' ),
				doc = iframe.getFrameDocument();

			iframe.on( 'load', function() {
				resume( function() {
					var iCKEDITOR = iframe.$.contentWindow.CKEDITOR;

					assert.areSame( '//' + secondDomainName + expectedEditorPath, iCKEDITOR.basePath );
					assert.areSame( '//' + secondDomainName + expectedEditorPath + 'ckeditor.js' + query,
						iCKEDITOR.getUrl( 'ckeditor.js' ) );
					assert.areSame( '//' + secondDomainName + expectedEditorPath + 'skins/default/editor.css' + query,
						iCKEDITOR.getUrl( 'skins/default/editor.css' ) );
					assert.areSame( '/skins/default/editor.css' + query,
						iCKEDITOR.getUrl( '/skins/default/editor.css' ) );
					assert.areSame( 'http://www.otherdomain.com/skins/default/editor.css' + query,
						iCKEDITOR.getUrl( 'http://www.otherdomain.com/skins/default/editor.css' ) );
				} );
			} );

			doc.$.open();
			doc.$.write(
				'<script>CKEDITOR_BASEPATH = "//' + secondDomainName + expectedEditorPath + '";</scr' + 'ipt>' +
				'<script src="' + CKEDITOR.getUrl( 'ckeditor.js' ) + '"></scr' + 'ipt>' );
			doc.$.close();

			wait();
		}
	} );
} )();

/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: uploadwidget,uploadimage,toolbar,image2 */
/* bender-include: %BASE_PATH%/plugins/clipboard/_helpers/pasting.js */

'use strict';

( function() {
	var editors, editorBots, uploadCount, loadAndUploadCount, lastUploadUrl;

	var editorsDefinitions = {
		classic: {
			name: 'classic',
			creator: 'replace',
			config: {
				extraPlugins: 'uploadimage,image',
				removePlugins: 'image2',
				imageUploadUrl: 'http://foo/upload'
			}
		},
		inline: {
			name: 'inline',
			creator: 'inline',
			config: {
				extraPlugins: 'uploadimage,image2',
				filebrowserImageUploadUrl: 'http://foo/upload?type=Images'
			}
		},

	};

	function assertUploadingWidgets( editor, expectedSrc ) {
		var widgets = editor.editable().find( 'img[data-widget="uploadimage"]' ),
			widget, i;

		assert.areSame( 1, widgets.count(), 'Expected widgets count should be 1' );

		for ( i = 0; i < widgets.count(); i++ ) {
			widget = widgets.getItem( i );
			assert.areSame( '0', widget.getAttribute( 'data-cke-upload-id' ) );
			assert.areSame( expectedSrc, widget.getAttribute( 'src' ).substring( 0, 55 ) );
		};
	}

	var tests = {
		'setUp': function() {
			var editorName;

			uploadCount = 0;
			loadAndUploadCount = 0;

			CKEDITOR.filetools.FileLoader.prototype.loadAndUpload = function( url ) {
				loadAndUploadCount++;
				lastUploadUrl = url;
			}

			CKEDITOR.filetools.FileLoader.prototype.load = function() {};

			CKEDITOR.filetools.FileLoader.prototype.upload = function( url ) {
				uploadCount++;
				lastUploadUrl = url;
			};

			for ( editorName in editors ) {
				// Clear uploads repository.
				editors[ editorName ].uploadsRepository._.loaders = [];
			};
		},

		'test classic with image1 (integration test)': function() {
			var bot = editorBots[ 'classic' ],
				editor = editors[ 'classic' ];

			pasteFiles( editor, [ bender.tools.getTestFile( 'test.jpg' ) ] );

			assertUploadingWidgets( editor, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPC' );
			assert.areSame( '', editor.getData(), 'getData on loading.' );

			var loader = editor.uploadsRepository.get( 0 );

			loader.data = bender.tools.pngBase64;
			loader.changeStatusAndFire( 'uploading' );

			assertUploadingWidgets( editor, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABC' );
			assert.areSame( '', editor.getData(), 'getData on uploading.' );

			loader.url = 'http://foo/test.jpg'
			loader.changeStatusAndFire( 'uploaded' );

			assert.areSame( '<p><img src="http://foo/test.jpg" style="height:1px; width:1px" /></p>', editor.getData() );
			assert.areSame( 0, editor.editable().find( 'img[data-widget="image"]' ).count() );

			assert.areSame( 1, loadAndUploadCount );
			assert.areSame( 0, uploadCount );
			assert.areSame( 'http://foo/upload', lastUploadUrl );
		},

		'test inline with image2 (integration test)': function() {
			var bot = editorBots[ 'inline' ],
				editor = editors[ 'inline' ];

			pasteFiles( editor, [ bender.tools.getTestFile( 'test.jpg' ) ] );

			assertUploadingWidgets( editor, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPC' );
			assert.areSame( '', editor.getData(), 'getData on loading.' );

			var loader = editor.uploadsRepository.get( 0 );

			loader.data = bender.tools.pngBase64;
			loader.changeStatusAndFire( 'uploading' );

			assertUploadingWidgets( editor, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABC' );
			assert.areSame( '', editor.getData(), 'getData on uploading.' );

			loader.url = 'http://foo/test.jpg'
			loader.changeStatusAndFire( 'uploaded' );

			assert.areSame( '<p><img width="1" height="1" alt="" src="http://foo/test.jpg" /></p>', editor.getData() );
			assert.areSame( 1, editor.editable().find( 'img[data-widget="image"]' ).count() );

			assert.areSame( 1, loadAndUploadCount );
			assert.areSame( 0, uploadCount );
			assert.areSame( 'http://foo/upload?type=Images&responseType=json', lastUploadUrl );
		},

		'test paste img as html (integration test)': function() {
			var bot = editorBots[ 'classic' ],
				editor = editors[ 'classic' ];

			bot.setData( '', function() {
				pasteFiles( editor, [], '<p>x<img src="' + bender.tools.pngBase64 + '">x</p>' );

				assertUploadingWidgets( editor, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABC' );
				assert.areSame( '<p>xx</p>', editor.getData(), 'getData on loading.' );

				var loader = editor.uploadsRepository.get( 0 );

				loader.data = bender.tools.pngBase64;
				loader.changeStatusAndFire( 'uploading' );

				assertUploadingWidgets( editor, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABC' );
				assert.areSame( '<p>xx</p>', editor.getData(), 'getData on uploading.' );

				loader.url = 'http://foo/test.jpg'
				loader.changeStatusAndFire( 'uploaded' );

				assert.areSame( '<p>x<img src="http://foo/test.jpg" style="height:1px; width:1px" />x</p>', editor.getData() );
				assert.areSame( 0, editor.editable().find( 'img[data-widget="image"]' ).count() );

				assert.areSame( 0, loadAndUploadCount );
				assert.areSame( 1, uploadCount );
				assert.areSame( 'http://foo/upload', lastUploadUrl );
			} );
		}
	};

	bender.tools.setUpEditors( editorsDefinitions, function( e, eB ) {
		editors = e;
		editorBots = eB;

		bender.test( tests );
	} );
} )();
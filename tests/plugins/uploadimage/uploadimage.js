/* bender-tags: editor,unit,clipboard,widget */
/* bender-ckeditor-plugins: uploadwidget,uploadimage,toolbar,image2 */
/* bender-include: %BASE_PATH%/plugins/clipboard/_helpers/pasting.js */
/* bender-include: %BASE_PATH%/plugins/uploadfile/_helpers/waitForImage.js */
/* global pasteFiles, waitForImage */

'use strict';

( function() {
	var uploadCount, loadAndUploadCount, lastUploadUrl, resumeAfter,
		IMG_URL = '%BASE_PATH%_assets/logo.png',
		LOADING_IMG = 'data:image/gif;base64,R0lGODlhDgAOAIAAAAAAAP///yH5BAAAA',
		LOADED_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABC';

	bender.editors = {
		classic: {
			name: 'classic',
			creator: 'replace',
			config: {
				extraPlugins: 'uploadimage,image',
				removePlugins: 'image2',
				imageUploadUrl: 'http://foo/upload',
				// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
				pasteFilter: null
			}
		},
		inline: {
			name: 'inline',
			creator: 'inline',
			config: {
				extraPlugins: 'uploadimage,image2',
				filebrowserImageUploadUrl: 'http://foo/upload?type=Images',
				// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
				pasteFilter: null
			}
		}
	};

	function assertUploadingWidgets( editor, expectedSrc ) {
		var widgets = editor.editable().find( 'img[data-widget="uploadimage"]' ),
			widget, i;

		assert.areSame( 1, widgets.count(), 'Expected widgets count should be 1' );

		for ( i = 0; i < widgets.count(); i++ ) {
			widget = widgets.getItem( i );
			assert.areSame( '0', widget.getAttribute( 'data-cke-upload-id' ) );
			assert.areSame( expectedSrc, widget.getAttribute( 'src' ).substring( 0, 55 ) );
		}
	}

	bender.test( {
		init: function() {
			resumeAfter = bender.tools.resumeAfter;

			CKEDITOR.fileTools.fileLoader.prototype.loadAndUpload = function( url ) {
				loadAndUploadCount++;
				lastUploadUrl = url;

				this.responseData = {};
			};

			CKEDITOR.fileTools.fileLoader.prototype.load = function() {};

			CKEDITOR.fileTools.fileLoader.prototype.upload = function( url ) {
				uploadCount++;
				lastUploadUrl = url;

				this.responseData = {};
			};
		},

		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}

			var editorName;

			uploadCount = 0;
			loadAndUploadCount = 0;

			for ( editorName in this.editors ) {
				// Clear upload repository.
				this.editors[ editorName ].uploadRepository.loaders = [];
			}

			if ( CKEDITOR.fileTools.bindNotifications.reset ) {
				CKEDITOR.fileTools.bindNotifications.reset();
			}
		},

		'test classic with image1 (integration test)': function() {
			var editor = this.editors.classic;

			pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

			assertUploadingWidgets( editor, LOADING_IMG );
			assert.areSame( '', editor.getData(), 'getData on loading.' );

			var loader = editor.uploadRepository.loaders[ 0 ];

			loader.data = bender.tools.pngBase64;
			loader.uploadTotal = 10;
			loader.changeStatus( 'uploading' );

			assertUploadingWidgets( editor, LOADED_IMG );
			assert.areSame( '', editor.getData(), 'getData on uploading.' );

			var image = editor.editable().find( 'img[data-widget="uploadimage"]' ).getItem( 0 );

			waitForImage( image, function() {
				loader.url = IMG_URL;
				loader.changeStatus( 'uploaded' );

				assert.sameData( '<p><img src="' + IMG_URL + '" style="height:1px; width:1px" /></p>', editor.getData() );
				assert.areSame( 0, editor.editable().find( 'img[data-widget="image"]' ).count() );

				assert.areSame( 1, loadAndUploadCount );
				assert.areSame( 0, uploadCount );
				assert.areSame( 'http://foo/upload', lastUploadUrl );
			} );
		},

		'test finish upload notification marked as important and is visible (#13032).': function() {
			var editor = this.editors.classic;

			pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

			var loader = editor.uploadRepository.loaders[ 0 ];

			loader.data = bender.tools.pngBase64;
			loader.uploadTotal = 10;
			loader.changeStatus( 'uploading' );

			var area = editor._.notificationArea;

			// Closing notification.
			area.notifications[ 0 ].hide();

			assertUploadingWidgets( editor, LOADED_IMG );

			var image = editor.editable().find( 'img[data-widget="uploadimage"]' ).getItem( 0 );

			waitForImage( image, function() {
				loader.url = IMG_URL;
				loader.changeStatus( 'uploaded' );

				assert.areSame( 1, area.notifications.length, 'Successs notification is present because it\'s important one.' );
				assert.areSame( 'success', area.notifications[ 0 ].type );
			} );
		},

		'test inline with image2 (integration test)': function() {
			var editor = this.editors.inline;

			pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

			assertUploadingWidgets( editor, LOADING_IMG );
			assert.areSame( '', editor.getData(), 'getData on loading.' );

			var loader = editor.uploadRepository.loaders[ 0 ];

			loader.data = bender.tools.pngBase64;
			loader.changeStatus( 'uploading' );

			assertUploadingWidgets( editor, LOADED_IMG );
			assert.areSame( '', editor.getData(), 'getData on uploading.' );

			var image = editor.editable().find( 'img[data-widget="uploadimage"]' ).getItem( 0 );

			waitForImage( image, function() {
				loader.url = IMG_URL;
				loader.changeStatus( 'uploaded' );

				assert.sameData( '<p><img alt="" height="1" src="' + IMG_URL + '" width="1" /></p>', editor.getData() );
				assert.areSame( 1, editor.editable().find( 'img[data-widget="image"]' ).count() );

				assert.areSame( 1, loadAndUploadCount );
				assert.areSame( 0, uploadCount );
				assert.areSame( 'http://foo/upload?type=Images&responseType=json', lastUploadUrl );
			} );
		},

		'test paste img as html (integration test)': function() {
			var bot = this.editorBots.classic,
				editor = this.editors.classic;

			bot.setData( '', function() {
				pasteFiles( editor, [], '<p>x<img src="' + bender.tools.pngBase64 + '">x</p>' );

				assertUploadingWidgets( editor, LOADED_IMG );
				assert.areSame( '<p>xx</p>', editor.getData(), 'getData on loading.' );

				var loader = editor.uploadRepository.loaders[ 0 ];

				loader.data = bender.tools.pngBase64;
				loader.changeStatus( 'uploading' );

				assertUploadingWidgets( editor, LOADED_IMG );
				assert.areSame( '<p>xx</p>', editor.getData(), 'getData on uploading.' );

				var image = editor.editable().find( 'img[data-widget="uploadimage"]' ).getItem( 0 );

				waitForImage( image, function() {
					loader.url = IMG_URL;
					loader.changeStatus( 'uploaded' );

					assert.sameData( '<p>x<img src="' + IMG_URL + '" style="height:1px; width:1px" />x</p>', editor.getData() );
					assert.areSame( 0, editor.editable().find( 'img[data-widget="image"]' ).count() );

					assert.areSame( 0, loadAndUploadCount );
					assert.areSame( 1, uploadCount );
					assert.areSame( 'http://foo/upload', lastUploadUrl );
				} );
			} );
		},

		'test setting image dimensions via response (integration test) (#13794)': function() {
			var bot = this.editorBots.classic,
				editor = this.editors.classic;

			bot.setData( '', function() {
				pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

				var loader = editor.uploadRepository.loaders[ 0 ];

				loader.data = bender.tools.pngBase64;
				loader.uploadTotal = 10;
				loader.changeStatus( 'uploading' );

				loader.responseData.width = 555;
				loader.responseData.height = 444;

				resumeAfter( loader, 'uploaded', function() {
					assert.sameData( '<p><img src="' + IMG_URL + '" style="height:444px; width:555px" /></p>', editor.getData() );
					assert.areSame( 0, editor.editable().find( 'img[data-widget="image"]' ).count() );
				} );

				loader.url = IMG_URL;
				loader.changeStatus( 'uploaded' );

				wait();
			} );
		},

		'test supportedTypes png': function() {
			var bot = this.editorBots.classic,
				editor = this.editors.classic;

			bot.setData( '', function() {
				resumeAfter( editor, 'paste', function() {
					assertUploadingWidgets( editor, LOADING_IMG );
				} );

				pasteFiles( editor, [ { name: 'test.png', type: 'image/png' } ] );

				wait();
			} );
		},

		'test supportedTypes jpg': function() {
			var bot = this.editorBots.classic,
				editor = this.editors.classic;

			bot.setData( '', function() {
				resumeAfter( editor, 'paste', function() {
					assertUploadingWidgets( editor, LOADING_IMG );
				} );

				pasteFiles( editor, [ { name: 'test.jpg', type: 'image/jpeg' } ] );

				wait();
			} );
		},

		'test supportedTypes gif': function() {
			var bot = this.editorBots.classic,
				editor = this.editors.classic;

			bot.setData( '', function() {
				resumeAfter( editor, 'paste', function() {
					assertUploadingWidgets( editor, LOADING_IMG );
				} );

				pasteFiles( editor, [ { name: 'test.gif', type: 'image/gif' } ] );

				wait();
			} );
		},

		'test supportedTypes bmp': function() {
			var bot = this.editorBots.classic,
				editor = this.editors.classic;

			bot.setData( '', function() {
				resumeAfter( editor, 'paste', function() {
					assertUploadingWidgets( editor, LOADING_IMG );
				} );

				pasteFiles( editor, [ { name: 'test.bmp', type: 'image/bmp' } ] );

				wait();
			} );
		},

		'test not supportedTypes tiff': function() {
			var bot = this.editorBots.classic,
				editor = this.editors.classic;

			bot.setData( '', function() {
				resumeAfter( editor, 'paste', function() {
					assert.areSame( 0, editor.editable().find( 'img[data-widget="uploadimage"]' ).count() );
				} );

				pasteFiles( editor, [ { name: 'test.tiff', type: 'image/tiff' } ] );

				wait();
			} );
		},

		'test paste single image': function() {
			var editor = this.editors.classic;

			resumeAfter( editor, 'paste', function( evt ) {
				var img = CKEDITOR.dom.element.createFromHtml( evt.data.dataValue );

				assert.areSame( '0', img.getAttribute( 'data-cke-upload-id' ) );
				assert.areSame( 'uploadimage', img.getAttribute( 'data-widget' ) );

				assert.areSame( 0, loadAndUploadCount );
				assert.areSame( 1, uploadCount );
			} );

			editor.fire( 'paste', {
				dataValue: '<img src="' + bender.tools.pngBase64 + '">'
			} );

			wait();
		},

		'test paste nested image': function() {
			var editor = this.editors.classic;

			resumeAfter( editor, 'paste', function( evt ) {
				var imgs = CKEDITOR.dom.element.createFromHtml( evt.data.dataValue ).find( 'img[data-widget="uploadimage"]' ),
					img, i;

				assert.areSame( 2, imgs.count(), 'Expected imgs count should be 2' );

				for ( i = 0; i < imgs.count(); i++ ) {
					img = imgs.getItem( i );
					assert.areSame( i + '', img.getAttribute( 'data-cke-upload-id' ) );
				}

				assert.areSame( 0, loadAndUploadCount );
				assert.areSame( 2, uploadCount );
			} );

			editor.fire( 'paste', {
				dataValue: '<div>x<img src="' + bender.tools.pngBase64 + '">x' +
							'<p>x<img src="' + bender.tools.pngBase64 + '">x</p></div>'
			} );

			wait();
		},

		'test paste no image': function() {
			var editor = this.editors.classic;

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( 'foo', evt.data.dataValue );

				assert.areSame( 0, loadAndUploadCount );
				assert.areSame( 0, uploadCount );
			} );

			editor.fire( 'paste', {
				dataValue: 'foo'
			} );

			wait();
		},

		'test paste no data in image': function() {
			var editor = this.editors.classic;

			resumeAfter( editor, 'paste', function( evt ) {
				var img = CKEDITOR.dom.element.createFromHtml( evt.data.dataValue );

				assert.isNull( img.getAttribute( 'data-cke-upload-id' ) );
				assert.isNull( img.getAttribute( 'data-widget' ) );

				assert.areSame( 0, loadAndUploadCount );
				assert.areSame( 0, uploadCount );
			} );

			editor.fire( 'paste', {
				dataValue: '<img src="' + IMG_URL + '">'
			} );

			wait();
		},

		'test paste image already marked': function() {
			var editor = this.editors.classic,
				uploads = editor.uploadRepository;

			resumeAfter( editor, 'paste', function( evt ) {
				var img = CKEDITOR.dom.element.createFromHtml( evt.data.dataValue );

				assert.areSame( '0', img.getAttribute( 'data-cke-upload-id' ) );
				assert.areSame( 'uploadimage', img.getAttribute( 'data-widget' ) );

				assert.areSame( 0, loadAndUploadCount );
				assert.areSame( 0, uploadCount );
			} );

			// Fill upload repository.
			uploads.create( bender.tools.getTestPngFile() );

			editor.fire( 'paste', {
				dataValue: '<img src="' + bender.tools.pngBase64 + '" data-widget="uploadimage" data-cke-upload-id="0">'
			} );

			wait();
		},

		'test omit images in non contentEditable': function() {
			var editor = this.editors.classic;

			resumeAfter( editor, 'paste', function( evt ) {
				var img = CKEDITOR.dom.element.createFromHtml( evt.data.dataValue ).findOne( 'img' );

				assert.isNull( img.getAttribute( 'data-cke-upload-id' ) );
				assert.isNull( img.getAttribute( 'data-widget' ) );

				assert.areSame( 0, loadAndUploadCount );
				assert.areSame( 0, uploadCount );
			} );

			editor.fire( 'paste', {
				dataValue:
					'<div contentEditable="false">' +
						'<img src="' + bender.tools.pngBase64 + '">' +
					'</div>'
			} );

			wait();
		},

		'test handle images in nested editable': function() {
			var editor = this.editors.classic;

			resumeAfter( editor, 'paste', function( evt ) {
				var img = CKEDITOR.dom.element.createFromHtml( evt.data.dataValue ).findOne( 'img' );

				assert.areSame( '0', img.getAttribute( 'data-cke-upload-id' ) );
				assert.areSame( 'uploadimage', img.getAttribute( 'data-widget' ) );

				assert.areSame( 0, loadAndUploadCount );
				assert.areSame( 1, uploadCount );
			} );

			editor.fire( 'paste', {
				dataValue:
					'<div contentEditable="false">' +
						'<div contentEditable="true">' +
							'<img src="' + bender.tools.pngBase64 + '">' +
						'</div>' +
					'</div>'
			} );

			wait();
		},

		'test handle images in nested editable using cke-editable': function() {
			var editor = this.editors.classic;

			resumeAfter( editor, 'paste', function( evt ) {
				var img = CKEDITOR.dom.element.createFromHtml( evt.data.dataValue ).findOne( 'img' );

				assert.areSame( '0', img.getAttribute( 'data-cke-upload-id' ) );
				assert.areSame( 'uploadimage', img.getAttribute( 'data-widget' ) );

				assert.areSame( 0, loadAndUploadCount );
				assert.areSame( 1, uploadCount );
			} );

			editor.fire( 'paste', {
				dataValue:
					'<div contentEditable="false">' +
						'<div data-cke-editable="1">' +
							'<img src="' + bender.tools.pngBase64 + '">' +
						'</div>' +
					'</div>'
			} );

			wait();
		},

		'test bindNotifications when paste image': function() {
			var editor = this.editors.classic;

			CKEDITOR.fileTools.bindNotifications = sinon.spy();

			resumeAfter( editor, 'paste', function() {
				var spy = CKEDITOR.fileTools.bindNotifications;
				assert.areSame( 1, spy.callCount );
				assert.isTrue( spy.calledWith( editor ) );
				assert.areSame( bender.tools.pngBase64, spy.firstCall.args[ 1 ].data );
			} );

			editor.fire( 'paste', {
				dataValue: '<img src="' + bender.tools.pngBase64 + '">'
			} );

			wait();
		},

		'test XSS attack': function() {
			var editor = this.editors.inline;

			window.attacked = sinon.spy();

			editor.fire( 'paste', {
				dataValue: '<img src="x" onerror="window.attacked();">' + bender.tools.pngBase64
			} );

			editor.once( 'afterPaste', function() {
				resume( function() {
					assert.areSame( 0, window.attacked.callCount );
				} );
			} );

			wait();
		},

		'test prevent upload fake elements (#13003)': function() {
			var editor = this.editors.inline,
				createspy = sinon.spy( editor.uploadRepository, 'create' );

			editor.fire( 'paste', {
				dataValue: '<img src="data:image/gif;base64,aw==" alt="nothing" data-cke-realelement="some" />'
			} );

			editor.once( 'afterPaste', function() {
				resume( function() {
					assert.isTrue( createspy.notCalled );
				} );
			} );

			wait();
		}
	} );
} )();

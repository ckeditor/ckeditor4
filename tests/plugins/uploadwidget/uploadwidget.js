/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: uploadwidget */

'use strict';

( function() {
	var filetools, resumeAfter, lastUploadUrl;

	bender.editor = {
		config: {
			extraPlugins: 'uploadwidget'
		}
	};

	function pasteFiles( editor, files ) {
		var	nativeData = bender.tools.mockNativeDataTransfer();

		nativeData.files = files;

		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		editor.fire( 'paste', {
			dataTransfer: dataTransfer,
			dataValue: ''
		} );
	}

	function addTestUploadWidget( editor, name, def ) {
		if ( !def ) {
			def = {}
		}

		CKEDITOR.tools.extend( def, {
			uploadUrl: 'uploadUrl',

			fileToElement: function( file ) {
				var span = new CKEDITOR.dom.element( 'span' );
				span.setText( 'uploading...' );
				return span;
			},

			onuploaded: function( upload ) {
				this.replaceWith( 'uploaded' );
			}
		} );

		filetools.addUploadWidget( editor, name, def );
	}

	function assertUploadingWidgets( editor, expectedWidgetsCount ) {
		var widgets = CKEDITOR.dom.element.createFromHtml( editor.editable().getHtml() ).find( 'span[data-widget="testuploadwidget"]' ),
			widget, i;

		if ( !expectedWidgetsCount ) {
			expectedWidgetsCount = 1;
		}

		assert.areSame( expectedWidgetsCount, widgets.count() );

		for ( i = 0; i < widgets.count(); i++ ) {
			widget = widgets.getItem( i );
			assert.areSame( '0', widget.getAttribute( 'data-cke-upload-id' ) );
			assert.areSame( 'uploading...', widget.getHtml() );
		};

		assert.areSame( '', editor.getData() );
	}

	bender.test( {
		'setUp': function() {
			filetools = CKEDITOR.filetools;
			resumeAfter = bender.tools.resumeAfter;

			CKEDITOR.filetools.FileLoader.prototype.load = function() {};

			CKEDITOR.filetools.FileLoader.prototype.upload = function( url ) {
				lastUploadUrl = url;
			};
		},

		'tearDown': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			// Clear uploads repository.
			editor.uploadsRepository._.loaders = [];
		},

		'test upload (integration test)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			addTestUploadWidget( editor, 'testuploadwidget' );

			pasteFiles( editor, [ bender.tools.getTestFile() ] );

			assertUploadingWidgets( editor );

			var loader = editor.uploadsRepository.get( 0 );

			loader.changeStatusAndFire( 'uploaded' );

			assert.areSame( '<p>uploaded</p>', editor.getData() );
		}
	} );
} )();
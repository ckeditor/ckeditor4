/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: uploadwidget */

'use strict';

( function() {
	var filetools, lastUploadUrl;

	bender.editor = {
		config: {
			extraPlugins: 'uploadwidget'
		}
	};

	bender.test( {
		'setUp': function() {
			filetools = CKEDITOR.filetools;

			CKEDITOR.filetools.FileLoader.prototype.load = function() {};

			CKEDITOR.filetools.FileLoader.prototype.upload = function( url ) {
				lastUploadUrl = url;
			};
		},
		'test upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				nativeData = bender.tools.mockNativeDataTransfer();

			nativeData.files = [ bender.tools.getTestFile() ];

			var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

			filetools.addUploadWidget( editor, 'testuploadwidget', {
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

			editor.fire( 'paste', {
				dataTransfer: dataTransfer,
				dataValue: ''
			} );

			var widgets = CKEDITOR.dom.element.createFromHtml( editor.editable().getHtml() ).find( 'span[data-widget="testuploadwidget"]' );
			assert.areSame( 1, widgets.count() );
			var widget = widgets.getItem( 0 );
			assert.areSame( '0', widget.getAttribute( 'data-cke-upload-id' ) );
			assert.areSame( 'uploading...', widget.getHtml() );

			assert.areSame( '', editor.getData() );

			var loader = editor.uploadsRepository.get( 0 );

			loader.changeStatusAndFire( 'uploaded' );

			assert.areSame( '<p>uploaded</p>', editor.getData() );
		}
	} );
} )();
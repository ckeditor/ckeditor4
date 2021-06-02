/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard */
/* bender-include: _helpers/pasting.js */

( function() {
	'use strict';

	var setHtmlWithSelection = bender.tools.setHtmlWithSelection,
		onDrop,
		onPaste;

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	function mockDropFile( editor, type ) {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.files.push( {
			name: 'mock.file',
			type: type
		} );

		nativeData.types.push( 'Files' );
		dataTransfer.cacheData();

		return dataTransfer.$;
	}

	bender.test( {
		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}

			CKEDITOR.plugins.clipboard.resetDragDataTransfer();

			this.editor.removeListener( 'drop', onDrop );
			this.editor.removeListener( 'paste', onPaste );
		},

		'test drop .png image': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/png',
				expected = '<p class="p">Paste image here:<img src="data:image/png;base64,fileMockBase64=" /></p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			this.assertDropImage( dropEvt, imageType, expected, {
				dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
				dropOffset: 17
			} );
		},

		'test drop .jpeg image': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/jpeg',
				expected = '<p class="p">Paste image here:<img src="data:image/jpeg;base64,fileMockBase64=" /></p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			this.assertDropImage( dropEvt, imageType, expected, {
				dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
				dropOffset: 17
			} );
		},

		'test drop .gif image': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/gif',
				expected = '<p class="p">Paste image here:<img src="data:image/gif;base64,fileMockBase64=" /></p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			this.assertDropImage( dropEvt, imageType, expected, {
				dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
				dropOffset: 17
			} );
		},

		'test drop unsupported image type': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'application/pdf',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			this.assertDropImage( dropEvt, imageType, expected, {
				dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
				dropOffset: 17
			} );
		},

		'test abort drop': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/png',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'abort' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			this.assertDropImage( dropEvt, imageType, expected, {
				dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
				dropOffset: 17
			} );
		},

		'test failed drop': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/gif',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'error' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			this.assertDropImage( dropEvt, imageType, expected, {
				dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
				dropOffset: 17
			} );
		},

		assertDropImage: function( evt, type, expected, config ) {
			var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( this.editor ),
				range = new CKEDITOR.dom.range( this.editor.document );

			if ( CKEDITOR.env.gecko ) {
				range.setStart( config.dropContainer, config.dropOffset );
				evt.testRange = range;
			}

			// Push data into clipboard and invoke paste event
			evt.$.dataTransfer = mockDropFile( this.editor, type );

			onDrop = function( dropEvt ) {
				var dropRange = dropEvt.data.dropRange;

				dropRange.startContainer = config.dropContainer;
				dropRange.startOffset = config.dropOffset;
				dropRange.endOffset = config.dropOffset;
			};

			onPaste = function( pasteEvt ) {
				resume( function() {
					assert.beautified.html( expected, this.editor.getData() );
				} );
			};

			this.editor.on( 'drop', onDrop );
			this.editor.on( 'paste', onPaste );

			dropTarget.fire( 'drop', evt );

			wait();
		}
	} );
} )();

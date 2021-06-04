/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard */

( function() {
	'use strict';

	var setHtmlWithSelection = bender.tools.setHtmlWithSelection,
		onDrop,
		onPaste;

	// Mock FileReader.
	( function() {
		var fileMockBase64 = ';base64,fileMockBase64=',
			fileMockType,
			readResultMock;

		function FileReaderMock() {
			this.listeners = {};
		}

		// Any MIME type.
		FileReaderMock.setFileMockType = function( type ) {
			fileMockType = type;
		};

		// Result can be: load, abort, error.
		FileReaderMock.setReadResult = function( readResult ) {
			readResultMock = readResult;
			if ( !readResultMock ) {
				readResultMock = 'load';
			}
		};

		FileReaderMock.prototype.addEventListener = function( eventName, callback ) {
			this.listeners[ eventName ] = callback;
		};

		FileReaderMock.prototype.readAsDataURL = function() {
			CKEDITOR.tools.setTimeout( function() {
				this.result = ( readResultMock == 'load' ? 'data:' + fileMockType + fileMockBase64 : null );

				if ( this.listeners[ readResultMock ] ) {
					this.listeners[ readResultMock ]();
				}
			}, 15, this );
		};

		window.FileReader = FileReaderMock;
	} )();

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	function mockDropFile( type ) {
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

	function assertDropImage( editor, evt, type, expected, config ) {
		var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor ),
			range = new CKEDITOR.dom.range( editor.document );

		range.setStart( config.dropContainer, config.dropOffset );
		evt.testRange = range;

		// Push data into clipboard and invoke paste event
		evt.$.dataTransfer = mockDropFile( type );

		onDrop = function( dropEvt ) {
			var dropRange = dropEvt.data.dropRange;

			dropRange.startContainer = config.dropContainer;
			dropRange.startOffset = config.dropOffset;
			dropRange.endOffset = config.dropOffset;
		};

		onPaste = function() {
			resume( function() {
				assert.beautified.html( expected, editor.getData() );
			} );
		};

		editor.on( 'drop', onDrop );
		editor.on( 'paste', onPaste );

		dropTarget.fire( 'drop', evt );

		wait();
	}

	bender.test( {
		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}

			FileReader.setFileMockType();
			FileReader.setReadResult();

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
			assertDropImage( this.editor, dropEvt, imageType, expected, {
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
			assertDropImage( this.editor, dropEvt, imageType, expected, {
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
			assertDropImage( this.editor, dropEvt, imageType, expected, {
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
			assertDropImage( this.editor, dropEvt, imageType, expected, {
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
			assertDropImage( this.editor, dropEvt, imageType, expected, {
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
			assertDropImage( this.editor, dropEvt, imageType, expected, {
				dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
				dropOffset: 17
			} );
		}
	} );
} )();

/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard */
/* bender-include: _helpers/pasting.js */
/* globals mockFileReader */

( function() {
	'use strict';

	var setHtmlWithSelection = bender.tools.setHtmlWithSelection,
		originalFileReader = window.FileReader,
		onDrop,
		onPaste;

	bender.editor = {
		config: {
			allowedContent: true,
			language: 'en'
		}
	};

	var tests = {
		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}

			mockFileReader();
			CKEDITOR.plugins.clipboard.resetDragDataTransfer();

			this.editor.removeListener( 'drop', onDrop );
			this.editor.removeListener( 'paste', onPaste );
		},

		tearDown: function() {
			window.FileReader = originalFileReader;
		},

		'test drop .png image': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/png',
				expected = '<p class="p">Paste image here:<img src="data:image/png;base64,fileMockBase64=" /></p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertDropImage( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expected: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		'test drop .jpeg image': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/jpeg',
				expected = '<p class="p">Paste image here:<img src="data:image/jpeg;base64,fileMockBase64=" /></p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertDropImage( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expected: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		'test drop .gif image': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/gif',
				expected = '<p class="p">Paste image here:<img src="data:image/gif;base64,fileMockBase64=" /></p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertDropImage( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expected: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		'test drop unsupported image type': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'application/pdf',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertDropImage( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expected: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		// (#4750)
		'test showing notification for dropping unsupported image type': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'application/pdf',
				expected = '<p class="p">Paste image here:</p>',
				expectedMsg = this.editor.lang.clipboard.fileFormatNotSupportedNotification,
				spy = sinon.spy( this.editor, 'showNotification' );

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertDropImage(  {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expected: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				},
				callback: function() {
					spy.restore();

					assert.areSame( 1, spy.callCount, 'There was only one notification' );
					assert.areSame( expectedMsg, spy.getCall( 0 ).args[ 0 ],
						'The notification had correct message' );
				}
			} );
		},

		'test abort drop': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/png',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'abort' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertDropImage( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expected: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		'test failed drop': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/gif',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'error' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertDropImage( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expected: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		}
	};

	bender.test( tests );

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

	function assertDropImage( options ) {
		var editor = options.editor,
			evt = options.event,
			type = options.type,
			expected = options.expected,
			callback = options.callback,
			dropRangeOptions = options.dropRange,
			dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor ),
			range = new CKEDITOR.dom.range( editor.document );

		range.setStart( dropRangeOptions.dropContainer, dropRangeOptions.dropOffset );
		evt.testRange = range;

		// Push data into clipboard and invoke paste event
		evt.$.dataTransfer = mockDropFile( type );

		onDrop = function( dropEvt ) {
			var dropRange = dropEvt.data.dropRange;

			dropRange.startContainer = dropRangeOptions.dropContainer;
			dropRange.startOffset = dropRangeOptions.dropOffset;
			dropRange.endOffset = dropRangeOptions.dropOffset;
		};

		onPaste = function() {
			resume( function() {
				assert.beautified.html( expected, editor.getData() );

				if ( callback ) {
					callback();
				}
			} );
		};

		editor.on( 'drop', onDrop );
		editor.on( 'paste', onPaste );

		dropTarget.fire( 'drop', evt );

		wait();
	}
} )();

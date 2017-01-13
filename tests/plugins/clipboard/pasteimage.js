/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: clipboard */

( function() {
	'use strict';

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

		/* jshint ignore:start */
		FileReader = FileReaderMock;
		/* jshint ignore:end */
	} )();

	// Mock paste file from clipboard.
	function mockPasteFile( editor, type ) {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.files.push( {
			name: 'mock.file',
			type: type
		} );

		dataTransfer.cacheData();

		editor.fire( 'paste', {
			dataTransfer: dataTransfer,
			dataValue: '',
			method: 'paste',
			type: 'auto'
		} );
	}


	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		setUp: function() {
			if ( !CKEDITOR.env.gecko ) {
				assert.ignore();
			}
			FileReader.setFileMockType();
			FileReader.setReadResult();
			this.editor.focus();
		},

		'test paste .png from clipboard': function() {
			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here: {}</p>' );
			this.assertPaste( 'image/png',
				'<p>Paste image here: <img data-cke-saved-src="data:image/png;base64,fileMockBase64=" src="data:image/png;base64,fileMockBase64=" />^@</p>' );
		},

		'test paste .jpeg from clipboard': function() {
			FileReader.setFileMockType( 'image/jpeg' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here: {}</p>' );
			this.assertPaste( 'image/jpeg',
				'<p>Paste image here: <img data-cke-saved-src="data:image/jpeg;base64,fileMockBase64=" src="data:image/jpeg;base64,fileMockBase64=" />^@</p>' );
		},

		'test paste .gif from clipboard': function() {
			FileReader.setFileMockType( 'image/gif' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here: {}</p>' );
			this.assertPaste( 'image/gif',
				'<p>Paste image here: <img data-cke-saved-src="data:image/gif;base64,fileMockBase64=" src="data:image/gif;base64,fileMockBase64=" />^@</p>' );
		},

		'test unsupported file type': function() {
			FileReader.setFileMockType( 'application/pdf' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here: {}</p>' );
			this.assertPaste( 'application/pdf',
				'<p>Paste image here: ^@</p>' );
		},

		'test aborted paste': function() {
			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'abort' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here: {}</p>' );
			this.assertPaste( 'image/png',
				'<p>Paste image here: ^@</p>' );
		},

		'test failed paste': function() {
			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'error' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here: {}</p>' );
			this.assertPaste( 'image/png',
				'<p>Paste image here: ^@</p>' );
		},

		assertPaste: function( type, expected ) {
			this.editor.once( 'paste', function() {
				resume( function() {
					assert.isInnerHtmlMatching( expected, bender.tools.selection.getWithHtml( this.editor ), {
						noTempElements: true,
						fixStyles: true,
						compareSelection: true,
						normalizeSelection: true
					} );
				} );
			}, this, null, 9999 );

			mockPasteFile( this.editor, type );

			wait();
		}
	} );

} )();

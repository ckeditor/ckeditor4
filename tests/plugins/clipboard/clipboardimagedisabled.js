/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard */
/* bender-include: _helpers/pasting.js */
/* globals mockFileReader, assertImageDrop, assertImagePaste */

( function() {
	'use strict';

	var pasteCount = 0,
		dropCount = 0;

	CKEDITOR.plugins.add( 'customImagePasteHandlerPlugin', {
		init: function( editor ) {
			editor.on( 'paste', function( event ) {
				if ( event.data.dataTransfer.$.files.length === 1 ) {
					pasteCount++;
				}
			} );

			editor.on( 'drop', function( event ) {
				if ( event.data.dataTransfer.$.files.length === 1 ) {
					dropCount++;
				}
			} );
		}
	} );

	var originalFileReader = window.FileReader;

	bender.editor = {
		config: {
			extraAllowedContent: 'img[*];strong',
			language: 'en',
			clipboard_handleImages: false,
			extraPlugins: 'customImagePasteHandlerPlugin'
		}
	};

	bender.test( {
		setUp: function() {
			mockFileReader();
			this.editor.focus();
		},

		tearDown: function() {
			window.FileReader = originalFileReader;
		},

		'test image paste from clipboard suppressed': function() {
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}

			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'load' );

			pasteCount = 0;

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );

			this.assertPaste( {
				type: 'image/png',
				expected: '<p>Paste image here:^@</p>',
				callback: function() {
					assert.areSame( pasteCount, 1, 'custom image handler plugin did not receive file' );
				}
			} );
		},

		'test image and text paste from clipboard, only image suppressed': function() {
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}

			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'load' );

			pasteCount = 0;

			bender.tools.selection.setWithHtml( this.editor, '<p>{}</p>' );

			this.assertPaste( {
				type: 'image/png',
				expected: '<p><strong>Hello world^</strong>@</p><p></p>',
				additionalData: [
					{ type: 'text/html', data: '<strong>Hello world</strong>' }
				],
				callback: function() {
					assert.areSame( pasteCount, 1, 'custom image handler plugin did not receive file' );
				}
			} );
		},

		'test image drop suppressed': function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}

			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/png',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			dropCount = 0;

			bender.tools.setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );

			assertImageDrop( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expectedData: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				},
				callback: function() {
					assert.areSame( dropCount, 1, 'custom image handler plugin did not receive file' );
				}
			} );
		},

		assertPaste: function( options ) {
			assertImagePaste( this.editor, options );
		}
	} );
} )();

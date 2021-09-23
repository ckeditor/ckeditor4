/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard */
/* bender-include: _helpers/pasting.js */
/* globals mockFileReader */

( function() {
	'use strict';

	var originalFileReader = window.FileReader;

	bender.editor = {
		config: {
			allowedContent: true,
			language: 'en',
			clipboard_handleImagePasting: false
		}
	};

	bender.test( {
		setUp: function() {
			// (#4612).
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}

			mockFileReader();
			this.editor.focus();
		},

		tearDown: function() {
			window.FileReader = originalFileReader;
		},

		'test image paste from clipboard suppressed': function() {
			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );
			this.assertPaste( {
				type: 'image/png',
				expected: '<p>Paste image here:^@</p>'
			} );
		},

		'test image and text paste from clipboard, only image suppressed': function() {
			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>{}</p>' );
			this.assertPaste( {
				type: 'image/png',
				expected: '<p><strong>Hello world^</strong>@</p><p></p>',
				additionalData: [
					{ type: 'text/html', data: '<strong>Hello world</strong>' }
				]
			} );
		},

		'test image drop suppressed': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/png',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			bender.tools.setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertDropImage( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expectedData: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		assertPaste: function( options ) {
			assertImagePaste( this.editor, options );
		}
	} );
} )();

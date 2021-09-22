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

		assertPaste: function( options ) {
			assertImagePaste( this.editor, options );
		}
	} );
} )();

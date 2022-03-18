/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: toolbar,clipboard */

'use strict';

bender.editor = true;

bender.test( {
	'test showNotification if command execution fail': function() {
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = this.editor;

		bot.setHtmlWithSelection( '<p>[foo]</p>' );

		sinon.stub( editor.document.$, 'execCommand' ).withArgs( 'cut' ).throws( '' );

		sinon.stub( editor, 'showNotification', function() {
			assert.isTrue( true );
		} );

		editor.execCommand( 'cut' );
	},

	// #869
	'test check if collapse selection is not copied': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
			assert.ignore();
		}

		var editor = this.editor,
			bot = this.editorBot,
			range;

		bot.setHtmlWithSelection( '<p>[Some] text</p>' );

		editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
		assert.areSame( 'Some', CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );

		range = editor.getSelection().getRanges()[ 0 ];
		range.collapse();
		range.select();

		editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
		assert.areSame( 'Some', CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/x-icon\'': function() {
		assertSetSupportedImageMIMEType( 'image/x-icon' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/apng\'': function() {
		assertSetSupportedImageMIMEType( 'image/apng' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/webp\'': function() {
		assertSetSupportedImageMIMEType( 'image/webp' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/svg\'': function() {
		assertSetSupportedImageMIMEType( 'image/svg' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/vnd.ms-photo\'': function() {
		assertSetSupportedImageMIMEType( 'image/vnd.ms-photo' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/bmp\'': function() {
		assertSetSupportedImageMIMEType( 'image/bmp' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/x-bmp\'': function() {
		assertSetSupportedImageMIMEType( 'image/x-bmp' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/jpm\'': function() {
		assertSetSupportedImageMIMEType( 'image/jpm' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/jpx\'': function() {
		assertSetSupportedImageMIMEType( 'image/jpx' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/jp2\'': function() {
		assertSetSupportedImageMIMEType( 'image/jp2' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/xbm\'': function() {
		assertSetSupportedImageMIMEType( 'image/xbm' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/xbitmap\'': function() {
		assertSetSupportedImageMIMEType( 'image/xbitmap' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/jxr\'': function() {
		assertSetSupportedImageMIMEType( 'image/jxr' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds imageType: \'image/tiff-fx\'': function() {
		assertSetSupportedImageMIMEType( 'image/tiff-fx' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds image type: \'image/tiff\'': function() {
		assertSetSupportedImageMIMEType( 'image/tiff' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds image type: \'image/avif\'': function() {
		assertSetSupportedImageMIMEType( 'image/avif' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds image type: \'image/heif\'': function() {
		assertSetSupportedImageMIMEType( 'image/heif' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds image type: \'image/heic\'': function() {
		assertSetSupportedImageMIMEType( 'image/heic' );
	},

	// (#5095)
	'test setSupportedImageMIMEType() properly adds multiple image type': function() {
		bender.editorBot.create( {
			name: 'multiple-MIME-type'
		},
		function() {
			var mimeType = [ 'image/heic', 'image/webp', 'image/heif', 'image/jp2' ];

			CKEDITOR.plugins.clipboard.setSupportedImageMIMEType( mimeType );

			var types = CKEDITOR.plugins.clipboard.supportedImageMIMETypes,
				isNewlyAddedImageTypeExist = CKEDITOR.tools.array.indexOf( types, mimeType ) !== -1;

			assert.isFalse( isNewlyAddedImageTypeExist, 'Type ' + mimeType + ' shouldn\'t\' be added' );

			CKEDITOR.plugins.clipboard.supportedImageMIMETypes = [ 'image/png', 'image/jpeg', 'image/gif' ];
		} );
	},

	// (#5095)
	'test setSupportedImageMIMEType() prevents adding duplicates': function() {
		bender.editorBot.create( {
			name: 'duplicate-MIME-type'
		},
		function() {
			var mimeType = [ 'image/webp', 'image/webp', 'image/jp2', 'image/jp2' ],
				expected = [ 'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/jp2' ];

			CKEDITOR.plugins.clipboard.setSupportedImageMIMEType( mimeType );

			var types = CKEDITOR.plugins.clipboard.supportedImageMIMETypes;

			assert.isTrue( JSON.stringify( types ) === JSON.stringify( expected ), 'supportedImageMIMETypes contain duplicates' );

			CKEDITOR.plugins.clipboard.supportedImageMIMETypes = [ 'image/png', 'image/jpeg', 'image/gif' ];
		} );
	},

	// (#5095)
	'test setSupportedImageMIMEType() prevents adding unsupported image type': function() {
		bender.editorBot.create( {
			name: 'unsupported-MIME-type'
		},
		function() {
			var mimeType = 'image/foobar';

			CKEDITOR.plugins.clipboard.setSupportedImageMIMEType( [ mimeType ] );

			var types = CKEDITOR.plugins.clipboard.supportedImageMIMETypes,
				isNewlyAddedImageTypeExist = CKEDITOR.tools.array.indexOf( types, mimeType ) !== -1;

			assert.isFalse( isNewlyAddedImageTypeExist, 'Type ' + mimeType + ' shouldn\'t\' be added' );

			CKEDITOR.plugins.clipboard.supportedImageMIMETypes = [ 'image/png', 'image/jpeg', 'image/gif' ];
		} );
	}
} );

// (#5095)
function assertSetSupportedImageMIMEType( mimeType ) {
	bender.editorBot.create( {
		name: mimeType + '-MIMEType'
	},
	function() {
		var defaultTypes = CKEDITOR.plugins.clipboard.supportedImageMIMETypes;

		assert.isTrue(
			JSON.stringify( defaultTypes ) ===
			JSON.stringify( [ 'image/png', 'image/jpeg', 'image/gif' ], 'Default image MIME types are different' )
		);

		CKEDITOR.plugins.clipboard.setSupportedImageMIMEType( [ mimeType ] );

		var types = CKEDITOR.plugins.clipboard.supportedImageMIMETypes,
			isNewlyAddedImageTypeExist = CKEDITOR.tools.array.indexOf( types, mimeType ) !== -1;

		assert.isTrue( isNewlyAddedImageTypeExist, 'Newly added image MIME type ' + mimeType + ' not exist' );

		CKEDITOR.plugins.clipboard.supportedImageMIMETypes = [ 'image/png', 'image/jpeg', 'image/gif' ];
	} );
}

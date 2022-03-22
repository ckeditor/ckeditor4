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
	'test setIgnoredImageMimeType() properly adds imageType: \'image/x-icon\'': function() {
		assertSetIgnoredImageMimeType( 'image/x-icon' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/apng\'': function() {
		assertSetIgnoredImageMimeType( 'image/apng' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/webp\'': function() {
		assertSetIgnoredImageMimeType( 'image/webp' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/svg\'': function() {
		assertSetIgnoredImageMimeType( 'image/svg' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/vnd.ms-photo\'': function() {
		assertSetIgnoredImageMimeType( 'image/vnd.ms-photo' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/bmp\'': function() {
		assertSetIgnoredImageMimeType( 'image/bmp' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/x-bmp\'': function() {
		assertSetIgnoredImageMimeType( 'image/x-bmp' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/jpm\'': function() {
		assertSetIgnoredImageMimeType( 'image/jpm' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/jpx\'': function() {
		assertSetIgnoredImageMimeType( 'image/jpx' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/jp2\'': function() {
		assertSetIgnoredImageMimeType( 'image/jp2' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/xbm\'': function() {
		assertSetIgnoredImageMimeType( 'image/xbm' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/xbitmap\'': function() {
		assertSetIgnoredImageMimeType( 'image/xbitmap' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/jxr\'': function() {
		assertSetIgnoredImageMimeType( 'image/jxr' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds imageType: \'image/tiff-fx\'': function() {
		assertSetIgnoredImageMimeType( 'image/tiff-fx' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds image type: \'image/tiff\'': function() {
		assertSetIgnoredImageMimeType( 'image/tiff' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds image type: \'image/avif\'': function() {
		assertSetIgnoredImageMimeType( 'image/avif' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds image type: \'image/heif\'': function() {
		assertSetIgnoredImageMimeType( 'image/heif' );
	},

	// (#5095)
	'test setIgnoredImageMimeType() properly adds image type: \'image/heic\'': function() {
		assertSetIgnoredImageMimeType( 'image/heic' );
	},

	// (#5095)
	'test assertSetIgnoredImageMimeType() properly adds multiple image type': function() {
		bender.editorBot.create( {
			name: 'multiple-MIME-type'
		},
		function() {
			var mimeType = [ 'image/heic', 'image/webp', 'image/heif', 'image/jp2' ];

			CKEDITOR.plugins.clipboard.setIgnoredImageMimeType( mimeType );

			var types = CKEDITOR.plugins.clipboard.ignoredImageMimeTypes,
				isNewlyAddedImageTypeExist = CKEDITOR.tools.array.indexOf( types, mimeType ) !== -1;

			assert.isFalse( isNewlyAddedImageTypeExist, 'Type ' + mimeType + ' shouldn\'t\' be added' );

			CKEDITOR.plugins.clipboard.ignoredImageMimeTypes = [ 'image/png', 'image/jpeg', 'image/gif' ];
		} );
	},

	// (#5095)
	'test assertSetIgnoredImageMimeType() prevents adding duplicates': function() {
		bender.editorBot.create( {
			name: 'duplicate-MIME-type'
		},
		function() {
			var mimeType = [ 'image/webp', 'image/webp', 'image/jp2', 'image/jp2' ],
				expected = [ 'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/jp2' ];

			CKEDITOR.plugins.clipboard.setIgnoredImageMimeType( mimeType );

			var types = CKEDITOR.plugins.clipboard.ignoredImageMimeTypes;

			assert.isTrue( JSON.stringify( types ) === JSON.stringify( expected ), 'ignoredImageMimeType contain duplicates' );

			CKEDITOR.plugins.clipboard.ignoredImageMimeTypes = [ 'image/png', 'image/jpeg', 'image/gif' ];
		} );
	},

	// (#5095)
	'test assertSetIgnoredImageMimeType() prevents adding unsupported image type': function() {
		bender.editorBot.create( {
			name: 'unsupported-MIME-type'
		},
		function() {
			var mimeType = 'image/foobar';

			CKEDITOR.plugins.clipboard.setIgnoredImageMimeType( [ mimeType ] );

			var types = CKEDITOR.plugins.clipboard.ignoredImageMimeTypes,
				isNewlyAddedImageTypeExist = CKEDITOR.tools.array.indexOf( types, mimeType ) !== -1;

			assert.isFalse( isNewlyAddedImageTypeExist, 'Type ' + mimeType + ' shouldn\'t\' be added' );

			CKEDITOR.plugins.clipboard.ignoredImageMimeTypes = [ 'image/png', 'image/jpeg', 'image/gif' ];
		} );
	}
} );

// (#5095)
function assertSetIgnoredImageMimeType( mimeType ) {
	bender.editorBot.create( {
		name: mimeType + '-MIMEType'
	},
	function() {
		var defaultTypes = [ 'image/png', 'image/jpeg', 'image/gif' ];

		assert.isTrue(
			JSON.stringify( defaultTypes ) ===
			JSON.stringify( [ 'image/png', 'image/jpeg', 'image/gif' ], 'Default image MIME types are different' )
		);

		CKEDITOR.plugins.clipboard.setIgnoredImageMimeType( [ mimeType ] );

		var types = CKEDITOR.plugins.clipboard.ignoredImageMimeTypes,
			isNewlyAddedImageTypeExist = CKEDITOR.tools.array.indexOf( types, mimeType ) !== -1;

		assert.isTrue( isNewlyAddedImageTypeExist, 'Newly added image MIME type ' + mimeType + ' not exist' );

		CKEDITOR.plugins.clipboard.ignoredImageMimeTypes = defaultTypes;
	} );
}

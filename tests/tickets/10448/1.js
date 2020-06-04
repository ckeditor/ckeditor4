/* bender-tags: 10448 */
/* bender-ckeditor-plugins: toolbar, bidi, wysiwygarea */

( function() {
	'use strict';

	bender.editor = {
		config: {
			width: 300
		}
	};

	bender.test( {
		_should: {
			ignore: {
				'test paragraph fits into editable width': CKEDITOR.env.safari && CKEDITOR.env.iOS
			}
		},

		'test paragraph fits into editable width': function() {
			var html = CKEDITOR.document.findOne( 'p' ).getOuterHtml(),
				editor = this.editor,
				editable = editor.editable(),
				editableSize = editable.getSize( 'width' ),
				paragraphSize;

			this.editorBot.setData( html, function() {
				paragraphSize = editable.findOne( 'p' ).$.scrollWidth;

				assert.isTrue( editableSize >= paragraphSize );
			} );
		}
	} );
} )();

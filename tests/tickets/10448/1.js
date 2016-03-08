/* bender-tags: 10488 */
/* bender-ckeditor-plugins: toolbar, bidi, wysiwygarea */

( function() {
	'use strict';

	bender.editor = {
		config: {
			width: 300
		}
	};

	bender.test( {
		'test paragraph fits into editable width': function() {
			var html = CKEDITOR.document.findOne( 'p' ).getOuterHtml(),
				editor = this.editor,
				editable = editor.editable(),
				editableSize = editable.getSize( 'width' ),
				paragraphSize = editable.findOne( 'p' ).getSize( 'width' );

			editor.setData( html );

			assert.isTrue( editableSize >= paragraphSize );
		}
	} );
} )();

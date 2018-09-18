/* bender-tags: editor */
/* bender-ckeditor-plugins: link, dialog, toolbar, wysiwygarea */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		// #748
		'test opening dialog doesn\'t scroll editor': function() {
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			var editor = this.editor,
				bot = this.editorBot,
				spy = sinon.spy( editor, 'focus' ),
				spacer = new CKEDITOR.dom.element( 'div' );

			spacer.setStyle( 'height', '100vh' );
			spacer.insertBefore( CKEDITOR.document.getBody().getFirst() );

			bot.dialog( 'link', function( dialog ) {
				dialog.hide();
				// Check every call, as opening dialog with blurred editor also calls `editor.focus`.
				CKEDITOR.tools.array.forEach( spy.args, function( call ) {
					assert.isTrue( call[ 0 ].preventScroll );
				} );
			} );
		}
	} );
} )();

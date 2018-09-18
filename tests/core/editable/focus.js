/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'classic'
		},
		inline: {
			name: 'inline',
			creator: 'inline'
		}
	};

	var tests = {
		// #2420
		'test scroll position doesn\'t change when preventScroll is set to true': function( editor ) {
			if ( CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var editable = editor.editable(),
				body = CKEDITOR.document.getBody(),
				html = body.getParent(),
				spacer = new CKEDITOR.dom.element( 'div' ),
				scrollTop = {};

			spacer.setStyle( 'height', '100vh' );
			spacer.insertBefore( body.getFirst() );

			scrollTop.body = body.$.scrollTop;
			scrollTop.html = html.$.scrollTop;

			editable.focus( { preventScroll: true } );

			assert.areEqual( scrollTop.body, body.$.scrollTop, 'Body should be scrolled top' );
			assert.areEqual( scrollTop.html, html.$.scrollTop, 'Html should be scrolled top' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();

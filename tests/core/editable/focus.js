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
		// #748
		'test scroll position doesn\'t change when focusing editable': function( editor ) {
			// Edge should be ignored until this is fixed:
			// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/14721015/
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

			editable.focus();

			assert.areEqual( scrollTop.body, body.$.scrollTop, 'Body should be scrolled top' );
			assert.areEqual( scrollTop.html, html.$.scrollTop, 'Html should be scrolled top' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();

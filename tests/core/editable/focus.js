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
		tearDown: function() {
			CKEDITOR.document.findOne( '.focusable' ).focus();
		},
		// (#2420)
		'test editable focus': function( editor ) {
			var spy = sinon.spy( CKEDITOR.dom.element.prototype, 'focus' ),
				editable = editor.editable(),
				focusOptions = {
					preventScroll: true,
					defer: false
				};

			editable.focus( focusOptions );

			assert.areSame( focusOptions, spy.args[ 0 ][ 0 ] );

			spy.restore();
		},
		// (#2420)
		'test scroll position doesn\'t change when preventScroll is set to true': function( editor ) {
			var editable = editor.editable(),
				body = CKEDITOR.document.getBody(),
				html = body.getParent();

			editable.focus( { preventScroll: true } );

			// Scroll is delayed in IE and Edge.
			setTimeout( function() {
				resume( function() {
					assert.areEqual( 0, body.$.scrollTop, 'Body should be scrolled top' );
					assert.areEqual( 0, html.$.scrollTop, 'Html should be scrolled top' );
				} );
			}, 50 );
			wait();
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();

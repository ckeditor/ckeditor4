/* bender-tags: editor */
/* bender-ckeditor-plugins: colorbutton,undo,toolbar,wysiwygarea */
/* global console */

( function() {
	'use strict';

	bender.test( {
		// (#27)
		'test CKEDITOR.tools.canBeValidColor() returns proper values': function() {
			assert.isTrue( CKEDITOR.tools.canBeValidColor( '123' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( '#123' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( '123123' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( '#123123' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'rgb(60,60,60)' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'rgb( 60, 60, 60 )' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'rgba(60,60,60,0.2)' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'rgba( 60, 60, 60, 0.2 )' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'hsl(60,60%,60%)' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'hsl( 60, 60%, 60% )' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'hsla(60,60%,60%,0.2)' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'hsla( 60, 60%, 60%, 0.2 )' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'hsla( 60, 60%, 60% / 0.2 )' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'red' ) );
			assert.isTrue( CKEDITOR.tools.canBeValidColor( 'darkblue' ) );

			assert.isFalse( CKEDITOR.tools.canBeValidColor( '<img>' ) );
			assert.isFalse( CKEDITOR.tools.canBeValidColor( 'scam!' ) );
			assert.isFalse( CKEDITOR.tools.canBeValidColor( 'deceit;' ) );
			assert.isFalse( CKEDITOR.tools.canBeValidColor( 'foo-' ) );
			assert.isFalse( CKEDITOR.tools.canBeValidColor( 'bar&' ) );
			assert.isFalse( CKEDITOR.tools.canBeValidColor( '<im src="1" onerror="&#x61;&#x6c;&#x65;&#x72;&#x74;&#x28;&#x31;&#x29;" />' ) );
		},

		// (#27)
		'test CKEDITOR.tools.canBeValidColor() does not throw error when called without parameter': function() {
			var stub = sinon.stub( console, 'log' );

			try {
				CKEDITOR.tools.canBeValidColor();
			} catch ( error ) {
				console.log( error );
			}

			sinon.assert.notCalled( stub );
			stub.restore();
			assert.pass();
		}
	} );
} )();

/* bender-tags: editor */
/* bender-ckeditor-plugins: colorbutton,undo,toolbar,wysiwygarea */
/* global console */

( function() {
	'use strict';

	var tests = {},
		testValuesPass = [
			'123',
			'#123',
			'123123',
			'#123123',
			'rgb(60,60,60)',
			'rgba(60,60,60,0.2)',
			'rgba( 60, 60, 60, 0.2 )',
			'hsl(60,60%,60%)',
			'hsl( 60, 60%, 60% )',
			'hsla(60,60%,60%,0.2)',
			'hsla( 60, 60%, 60%, 0.2 )',
			'hsla( 60, 60%, 60% / 0.2 )',
			'red',
			'darkblue'
		],
		testValuesFail = [
			'<img>',
			'scam!',
			'deceit;',
			'foo-',
			'bar&',
			'<im src="1" onerror="&#x61;&#x6c;&#x65;&#x72;&#x74;&#x28;&#x31;&#x29;" />'
		];

	for ( var i = 0; i < testValuesPass.length; i++ ) {
		tests[ 'test CKEDITOR.tools.isValidColorFormat() returns proper value for the string: ' + testValuesPass[ i ] ] = function() {
			// (#27)
			// This will be executed after the whole for loop, so we can't use `i` variable here.
			assert.isTrue( CKEDITOR.tools.isValidColorFormat( testValuesPass.shift() ) );
		};
	}

	for ( var j = 0; j < testValuesFail.length; j++ ) {
		tests[ 'test CKEDITOR.tools.isValidColorFormat() returns proper value for the string: ' + testValuesFail[ j ] ] = function() {
			// (#27)
			// This will be executed after the whole for loop, so we can't use `j` variable here.
			assert.isFalse( CKEDITOR.tools.isValidColorFormat( testValuesFail.shift() ) );
		};
	}

	tests[ 'test CKEDITOR.tools.isValidColorFormat() does not throw error when called without parameter' ] = function() {
		// console is required, so sorry IE.
		if ( bender.env.ie && bender.env.version < 10 ) {
			assert.ignore();
		}

		var stub = sinon.stub( console, 'log' );

		try {
			CKEDITOR.tools.isValidColorFormat();
		} catch ( error ) {
			console.log( error );
		}

		sinon.assert.notCalled( stub );
		stub.restore();
		assert.pass();
	};

	bender.test( tests );
} )();

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

	// (#27)
	for ( var i = 0; i < testValuesPass.length; i++ ) {
		var testPassing = testValuesPass[ i ];

		tests[ 'test CKEDITOR.tools._isValidColorFormat() returns proper value for the string: ' + testPassing ] = function() {
			assert.isTrue( CKEDITOR.tools._isValidColorFormat( testPassing ) );
		};
	}

	// (#27)
	for ( var j = 0; j < testValuesFail.length; j++ ) {
		var testFailing = testValuesPass[ i ];

		tests[ 'test CKEDITOR.tools._isValidColorFormat() returns proper value for the string: ' + testFailing ] = function() {
			assert.isFalse( CKEDITOR.tools._isValidColorFormat( testFailing ) );
		};
	}

	// (#27)
	tests[ 'test CKEDITOR.tools._isValidColorFormat() does not throw error when called without parameter' ] = function() {
		// console is required, so sorry IE.
		if ( bender.env.ie && bender.env.version < 10 ) {
			assert.ignore();
		}

		var stub = sinon.stub( console, 'log' );

		try {
			CKEDITOR.tools._isValidColorFormat();
		} catch ( error ) {
			console.log( error );
		}

		sinon.assert.notCalled( stub );
		stub.restore();
		assert.pass();
	};

	bender.test( tests );
} )();

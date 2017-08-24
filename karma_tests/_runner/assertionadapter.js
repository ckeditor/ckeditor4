( function() {
	'use strict';

	window.assert.isInstanceOf = function( type, actual, msg ) {
		assert.instanceOf( actual, type, msg );
	}

	window.assert.areSame = function( expected, actual, msg ) {
		assert.equal( actual, expected, msg );
	};

	window.assert.areNotSame = function( expected, actual, msg ) {
		assert.notEqual( actual, expected, msg );
	};

	window.arrayAssert = {
		itemsAreSame: function( expected, actual, msg ) {
			assert.deepEqual( actual, expected, msg );
		}
	};
} )();
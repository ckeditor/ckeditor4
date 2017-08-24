( function() {
	'use strict';

	assert.isInstanceOf = function( type, val, msg ) {
		return assert.instanceOf.call( this, val, type, msg );
	}

	window.YUI( {
		useBrowserConsole: false,
		debug: false
	} ).use( 'test', function( Y ) {
		window.arrayAssert = Y.ArrayAssert;
		window.objectAssert = Y.ObjectAssert;
		window.yuiAssert = Y.Assert;

		window.assert = window.yuiAssert;
	} );
} )();
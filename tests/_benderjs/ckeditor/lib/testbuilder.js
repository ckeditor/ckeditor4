/**
 * Copyright (c) 2015, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

/* jshint browser: false, node: true */

'use strict';

/**
 * Generic test metadata parser will create test.ckeditor object containing ckeditor options.
 * This builder converts each value to a proper format
 * @param  {Object} data Test data
 * @return {Object}
 */
function build( data ) {
	function toArray( str ) {
		return str.replace( /\s/g, '' ).split( ',' );
	}

	Object.keys( data.tests ).forEach( function( id ) {
		var test = data.tests[ id ];

		if ( !test.ckeditor ) {
			return;
		}

		Object.keys( test.ckeditor ).forEach( function( key ) {
			test.ckeditor[ key ] = toArray( test.ckeditor[ key ] );
		} );
	} );

	return data;
}

module.exports = {
	name: 'bender-testbuilder-ckeditor',
	attach: function() {
		this.testbuilders.add( 'ckeditor', build );
	}
};

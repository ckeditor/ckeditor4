/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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
	// converts recursively strings found in an object to arrays
	function convert( obj ) {
		if ( typeof obj == 'string' ) {
			return obj.trim().split( /\s*,\s*/ );
		}

		if ( obj && typeof obj == 'object' && !Array.isArray( obj ) ) {
			Object.keys( obj ).forEach( function( key ) {
				obj[ key ] = convert( obj[ key ] );
			} );
		}

		return obj;
	}

	Object.keys( data.tests ).forEach( function( id ) {
		var test = data.tests[ id ];

		if ( !test.ckeditor ) {
			return;
		}

		test.ckeditor = convert( test.ckeditor );
	} );

	return data;
}

module.exports = {
	name: 'bender-testbuilder-ckeditor',
	attach: function() {
		this.testbuilders.add( 'ckeditor', build );
	}
};

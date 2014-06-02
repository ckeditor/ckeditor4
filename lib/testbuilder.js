'use strict';

var fs = require( 'fs' ),
	whenNode = require( 'when/node' ),
	whenKeys = require( 'when/keys' ),
	pattern = /\/\*\s*bender\-ckeditor\-([\w-]+)\:([\w\s,]+)([^*]|[\r\n])*\*\//gi;

/**
 * Find "bender-ckeditor-plugins" comment and return matched plugins
 * @param  {Buffer} data File buffer
 * @return {Array.<String>}
 */
function parseMeta( data ) {
	var result = {},
		match;

	data = data.toString();

	while ( ( match = pattern.exec( data ) ) ) {
		result[ match[ 1 ] ] = match[ 2 ].replace( /\s/g, '' ).split( ',' );
	}

	return result;
}

/**
 * Add CKEditor plugins to tests in given group
 * @param  {Object} data Group object
 * @return {Promise}
 */
function build( data ) {
	var files = {};

	// add plugins to tests in given group object
	function addPlugins( results ) {
		Object.keys( results ).forEach( function( id ) {
			data.tests[ id ].editor = results[ id ];
		} );

		return data;
	}

	// create a promise for each test
	Object.keys( data.tests ).forEach( function( id ) {
		files[ id ] = whenNode
			.call( fs.readFile, data.tests[ id ].js )
			.then( parseMeta );
	} );

	return whenKeys
		.all( files )
		.then( addPlugins );
}

module.exports = {
	name: 'bender-testbuilder-ckeditor',

	attach: function() {
		this.testbuilders.push( build );
	}
};

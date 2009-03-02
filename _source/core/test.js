/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.test} object, which contains
 *		functions used at our testing environment.
 */

/*jsl:import ../tests/yuitest.js*/

/**
 * Contains functions used at our testing environment. Currently,
 * our testing system is based on the
 * <a href="http://developer.yahoo.com/yui/yuitest/">YUI Test</a>.
 * @namespace
 * @example
 */
CKEDITOR.test = {
	/**
	 * The assertion namespace, containing all assertion functions. Currently,
	 * this is an alias for
	 * <a href="http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html">YAHOO.util.Assert</a>.
	 * @example
	 * <b>CKEDITOR.test.assert</b>.areEqual( '10', 10 );        // "true"
	 * <b>CKEDITOR.test.assert</b>.areSame( '10', 10 );         // "false"
	 * <b>CKEDITOR.test.assert</b>.isUndefined( window.test );  // "true"
	 */
	assert: YAHOO.util.Assert,

	/**
	 * Adds a test case to the test runner.
	 * @param {Object} testCase The test case object. See other tests for
	 *		examples.
	 * @example
	 * <b>CKEDITOR.test.addTestCase</b>((function()
	 * {
	 *     // Local reference to the "assert" object.
	 *     var assert = CKEDITOR.test.assert;
	 *
	 *     return {
	 *         test_example : function()
	 *         {
	 *             assert.areSame( '10', 10 );  // FAIL
	 *         }
	 *      };
	 * })());
	 */
	addTestCase: function( testCase ) {
		YAHOO.tool.TestRunner.add( new YAHOO.tool.TestCase( testCase ) );
	},

	/**
	 * Gets the inner HTML of an element, for testing purposes.
	 */
	getInnerHtml: function( elementOrId ) {
		var html = ( elementOrId.nodeType ? elementOrId : document.getElementById( elementOrId ) ).innerHTML;
		html = html.toLowerCase();
		html = html.replace( /[\n\r]/g, '' );

		html = html.replace( /<\w[^>]*/g, function( match ) {
			var attribs = [];
			var hasClass;

			match = match.replace( /\s([^\s=]+)=((?:"[^"]*")|(?:'[^']*')|(?:[^\s]+))/g, function( match, attName, attValue ) {
				if ( attName == 'style' ) {
					// Safari adds some extra space to the end.
					attValue = attValue.replace( /\s+/g, '' );

					// IE doesn't add the final ";"
					attValue = attValue.replace( /([^"';\s])\s*(["']?)$/, '$1;$2' );
				}

				// IE may have 'class' more than once.
				if ( attName == 'class' ) {
					if ( hasClass )
						return '';

					hasClass = true;
				}

				if ( attName != '_cke_expando' )
					attribs.push( [ attName, attValue ] );

				return '';
			});

			attribs.sort( function( a, b ) {
				var nameA = a[ 0 ];
				var nameB = b[ 0 ];
				return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
			});

			var ret = match.replace( /\s{2,}/g, ' ' );

			for ( var i = 0; i < attribs.length; i++ ) {
				ret += ' ' + attribs[ i ][ 0 ] + '=';
				ret += ( /^["']/ ).test( attribs[ i ][ 1 ] ) ? attribs[ i ][ 1 ] : '"' + attribs[ i ][ 1 ] + '"';
			}

			return ret;
		});

		return html;
	}
};

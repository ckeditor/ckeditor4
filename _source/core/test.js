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

	runner: YAHOO.tool.TestRunner,

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
	 * @param {Boolean} stripLineBreaks Assign 'false' to avoid trimming line-breaks.
	 */
	getInnerHtml: function( elementOrId, stripLineBreaks ) {
		var html;

		if ( typeof elementOrId == 'string' )
			html = document.getElementById( elementOrId ).innerHTML;
		else if ( elementOrId.getHtml )
			html = elementOrId.getHtml();
		else
			html = elementOrId.innerHTML // retrieve from innerHTML
		|| elementOrId.value; // retrieve from value

		return CKEDITOR.test.fixHtml( html, stripLineBreaks );
	},

	fixHtml: function( html, stripLineBreaks ) {
		html = html.toLowerCase();

		if ( stripLineBreaks !== false )
			html = html.replace( /[\n\r]/g, '' );
		else
			html = html.replace( /\r/g, '' ); // Normalize CRLF.

		function sorter( a, b ) {
			var nameA = a[ 0 ];
			var nameB = b[ 0 ];
			return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
		}

		html = html.replace( /<\w[^>]*/g, function( match ) {
			var attribs = [];
			var hasClass;

			match = match.replace( /\s([^\s=]+)=((?:"[^"]*")|(?:'[^']*')|(?:[^\s]+))/g, function( match, attName, attValue ) {
				if ( attName == 'style' ) {
					// Reorganize the style rules so they are sorted by name.

					var rules = [];

					// Push all rules into an Array.
					attValue.replace( /(?:"| |;|^ )\s*([^ :]+?)\s*:\s*([^;"]+?)\s*(?=;|"|$)/g, function( match, name, value ) {
						rules.push( [ name, value ] );
					});

					// Sort the Array.
					rules.sort( sorter );

					// Transform each rule entry into a string name:value.
					for ( var i = 0; i < rules.length; i++ )
						rules[ i ] = rules[ i ].join( ':' );

					// Join all rules with commas, removing spaces and adding an extra comma to the end.
					attValue = '"' + rules && ( rules.join( ';' ).replace( /\s+/g, '' ) + ';' );
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

			attribs.sort( sorter );

			var ret = match.replace( /\s{2,}/g, ' ' );

			for ( var i = 0; i < attribs.length; i++ ) {
				ret += ' ' + attribs[ i ][ 0 ] + '=';
				ret += ( /^["']/ ).test( attribs[ i ][ 1 ] ) ? attribs[ i ][ 1 ] : '"' + attribs[ i ][ 1 ] + '"';
			}

			return ret;
		});

		return html;
	},

	/**
	 * Wrapper of CKEDITOR.dom.element::getAttribute for style text normalization.
	 * @param element
	 * @param attrName
	 */
	getAttribute: function( element, attrName ) {
		var retval = element.getAttribute( attrName );
		if ( attrName == 'style' ) {
			// 1. Lower case property name.
			// 2. Add space after colon.
			// 3. Strip whitepsaces around semicolon.
			// 4. Always end with semicolon
			return retval.replace( /(?:^|;)\s*([A-Z-_]+)(:\s*)/ig, function( match, property, colon ) {
				return property.toLowerCase() + ': ';
			}).replace( /\s+(?:;\s*|$)/g, ';' ).replace( /([^;])$/g, '$1;' );
		}

		return retval;
	},

	/**
	 * Whether control the runner manually instead of running on window onload.
	 */
	deferRunner: false
};

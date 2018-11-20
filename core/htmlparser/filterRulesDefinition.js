/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.htmlParser.filterRulesDefinition} class
 * that contains the definition of filter rules. This file is for
 * documentation purposes only.
 */

/**
 * Abstract class describing the definition of {@link CKEDITOR.htmlParser.filter} rules.
 *
 * Definition object represents rules as a set of properties with callback functions
 * to be applied for transforming and filtering content upon data processing.
 *
 * @class CKEDITOR.htmlParser.filterRulesDefinition
 * @abstract
 */

/**
 * @property {CKEDITOR.htmlParser.nameFilterRule[]} elementNames An array of rules for element names transformation.
 * Every rule match will be replaced by the given string.
 *
 * Examples:
 *
 * ```javascript
 * elementNames: [
 * 		[ /^div$/, 'p' ], // Converts 'div' into 'p'.
 * 		[ /^cke:?/, '' ] // Removes 'cke:' prefixes.
 * ]
 * ```
 *
 */

/**
 * @property {CKEDITOR.htmlParser.nameFilterRule[]} attributeNames An array of rules for attribute names transformation.
 * Every matching string from the first item will be converted into a second.
 *
 * Examples:
 *
 * ```javascript
 * attributeNames: [
 * 		[ 'data-foo', 'data-bar' ],
 * 		// Converts string in attribute name from 'data-foo' into 'data-bar'
 * 		// Note that attribute 'data-foo-baz' will be converted into 'data-bar-baz'.
 *
 * 		[ /^data-custom$/, 'data-cke' ]
 * 		// Converts attribute 'data-custom' into 'data-cke'.
 * ]
 * ```
 *
 */

/**
 * @property {Object.<String, Function>} elements An object containing pairs of element selectors
 * and functions used upon element filtering and transformation.
 *
 * A selector can be either element name or one of following: `^`, `$`.
 *
 * `^` and `$` is to be applied on every filtered element. The first is applied before element specific filter,
 * and second is applied after element specific filter.
 *
 * Function can contain return statement:
 *
 * * If `false` is returned the element is removed.
 * * If another element is returned it overwrites the original element.
 *
 * Examples:
 *
 * ```javascript
 * elements: {
 * 		'^': function( element ) {
 * 			// Element transformation to be applied on every filtered element.
 * 			// This will be applied as the first filter.
 * 		},
 * 		div: function( element ) {
 * 			// Element transformation.
 * 		},
 * 		p: function() {
 * 			return false; // Removes each '<p>' element.
 * 		},
 * 		'$': function( element ) {
 * 			// Element transformation to be applied on every filtered element.
 * 			// This will be applied after other defined filters.
 * 		},
 * }
 * ```
 *
 */

/**
 * @property {Object.<String, Function>} attributes An object containing pairs of element attribute names
 * and functions used upon attribute filtering and transformation.
 *
 * Returning `false` removes attribute.
 *
 * Examples:
 *
 * ```javascript
 * attributes: {
 * 		'class': function( value, element ) {
 * 			if ( element.name === 'div' ) {
 * 				return value + ' cke_div' // Adds class 'cke_div' to every filtered div element.
 * 			}
 * 		},
 * 		id: function() {
 * 			return false; // Removes 'id' attribute from every filtered element.
 * 		}
 * }
 * ```
 *
 */

/**
 * @property {Function} text Function for text content transforming. Returned value replaces text.
 *
 * Examples:
 *
 * ```javascript
 * text: function( value, element ) {
 * 		return value.toLowerCase(); // Transforms each text into lower case.
 * }
 * ```
 *
 */

/**
 * @property {Function} comment Function for comments filtering and transforming. Returned value replaces comment text.
 * If `false` is returned comment is removed.
 *
 * Examples:
 *
 * ```javascript
 * comment: function( value, element ) {
 * 		return false; // Removes comment.
 * }
 * ```
 *
 */

/**
 * @property {Function} root Function for root element transforming.
 *
 * Examples:
 *
 * ```javascript
 * root: function( element ) {
 * 		element.children.push( someElement ); // Appends child to root element.
 * }
 * ```
 *
 */

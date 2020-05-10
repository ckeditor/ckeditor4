/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
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
 * It can be used with {@link CKEDITOR.htmlParser.filter} and {@link CKEDITOR.htmlParser.filter#addRules}.
 *
 * @class CKEDITOR.htmlParser.filterRulesDefinition
 * @abstract
 */

/**
 * @property {CKEDITOR.htmlParser.nameTransformRule[]} elementNames An array of rules for element names transformation.
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
 * @property {CKEDITOR.htmlParser.nameTransformRule[]} attributeNames An array of rules for attribute names transformation.
 * Every matching string from the first item will be converted into the second.
 *
 * Examples:
 *
 * ```javascript
 * attributeNames: [
 * 		[ 'data-foo', 'data-bar' ],
 * 		// Converts the string in the attribute name from 'data-foo' into 'data-bar'.
 * 		// Note that the 'data-foo-baz' attribute will be converted into 'data-bar-baz'.
 *
 * 		[ /^data-custom$/, 'data-cke' ]
 * 		// Converts the 'data-custom' attribute into 'data-cke'.
 * ]
 * ```
 *
 */

/**
 * @property {Object.<String, Function>} elements An object containing pairs of element selectors
 * and functions used upon element filtering and transformation.
 *
 * A selector can be either an element name or one of the following: `^`, `$`.
 *
 * `^` and `$` are to be applied on every filtered element. The first is applied before the element-specific filter,
 * and the second is applied after the element-specific filter.
 *
 * The function can contain a return statement:
 *
 * * If `false` is returned, the element is removed.
 * * If another element is returned, it overwrites the original element.
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
 * Returning `false` removes the attribute.
 *
 * Examples:
 *
 * ```javascript
 * attributes: {
 * 		'class': function( value, element ) {
 * 			if ( element.name === 'div' ) {
 * 				return value + ' cke_div' // Adds the 'cke_div' class to every filtered div element.
 * 			}
 * 		},
 * 		id: function() {
 * 			return false; // Removes the 'id' attribute from every filtered element.
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
 * If `false` is returned, the comment is removed.
 *
 * Examples:
 *
 * ```javascript
 * comment: function( value, element ) {
 * 		return false; // Removes the comment.
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
 * 		element.children.push( someElement ); // Appends a child to the root element.
 * }
 * ```
 *
 */

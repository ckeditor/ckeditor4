/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.htmlParser.nameTransformRule} class
 * that contains the definition of rule for filtering element names or attribute names. This file is for
 * documentation purposes only.
 */

/**
 * Abstract class describing the definition of {@link CKEDITOR.htmlParser.filterRulesDefinition} `elementNames` and `attributesNames` filtering rules.
 *
 * ```javascript
 *  var rule = [ /^div$/, 'p' ];
 * ```
 *
 * @class CKEDITOR.htmlParser.nameTransformRule
 * @abstract
 */

/**
 * @property {RegExp} 0 A regular expression to match the element name or attribute.
 */

/**
 * @property {String} 1 A string used to replace the match.
 */

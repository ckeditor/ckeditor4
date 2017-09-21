/**
 * @license Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.a11ychecker.quickFixes.get( { langCode: 'de',
		name: 'QuickFix',
		callback: function( QuickFix ) {
			/**
			 * Replaces provided element with element that a different tag name, preserving its children.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix
			 * @class ElementReplace
			 * @constructor
			 * @param {CKEDITOR.plugins.a11ychecker.Issue} issue
			 */
			function ElementReplace( issue ) {
				QuickFix.call( this, issue );
			}

			ElementReplace.prototype = new QuickFix();
			ElementReplace.prototype.constructor = ElementReplace;

			/**
			 * Returns the name of the tag that issue.element should be converted to.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix.ElementReplace
			 * @param {Object} formAttributes Form attributes from {@link #fix}.
			 * @returns {String}
			 */
			ElementReplace.prototype.getTargetName = function( formAttributes ) {
				return 'h1';
			};

			ElementReplace.prototype.display = function( form ) {
				form.setInputs( {} );
			};

			ElementReplace.prototype.fix = function( formAttributes, callback ) {
				var newElement = new CKEDITOR.dom.element( this.getTargetName( formAttributes ) );

				newElement.replace( this.issue.element );
				this.issue.element.moveChildren( newElement );

				this.issue.element = newElement;

				if ( callback ) {
					callback( this );
				}
			};

			ElementReplace.prototype.lang = {};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'de/ElementReplace', ElementReplace );
		}
	} );
}() );

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
			 * QuickFix renaming an attribute {@link #attributeName} to another name
			 * {@link #attributeTargetName}.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix
			 * @class AttributeRename
			 * @constructor
			 * @param {CKEDITOR.plugins.a11ychecker.Issue} issue Issue QuickFix is created for.
			 */
			function AttributeRename( issue ) {
				QuickFix.call( this, issue );
			}

			AttributeRename.prototype = new QuickFix();

			AttributeRename.prototype.constructor = AttributeRename;

			/**
			 * Name of the attribute to be renamed.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix.AttributeRename
			 */
			AttributeRename.prototype.attributeName = 'title';

			/**
			 * A desired name for the attribute.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix.AttributeRename
			 */
			AttributeRename.prototype.attributeTargetName = 'alt';

			/**
			 * Gets the proposed new value of the target attribute.
			 *
			 * @returns {String}
			*/
			AttributeRename.prototype.getProposedValue = function() {
				return this.issue.element.getAttribute( this.attributeName ) || '';
			};

			AttributeRename.prototype.display = function( form ) {
				form.setInputs( {
					value: {
						type: 'text',
						label: 'Value',
						value: this.getProposedValue()
					}
				} );
			};

			/**
			 * @param {Object} formAttributes Object containing serialized form inputs. See
			 * {@link CKEDITOR.plugins.a11ychecker.ViewerForm#serialize}.
			 * @param {Function} callback Function to be called when a fix was applied. Gets QuickFix object
			 * as a first parameter.
			 */
			AttributeRename.prototype.fix = function( formAttributes, callback ) {
				var issueElement = this.issue.element,
					desiredValue = formAttributes.value;

				// Set desired attribute value.
				issueElement.setAttribute( this.attributeTargetName, desiredValue );
				// Unset the old attribute.
				issueElement.removeAttribute( this.attributeName );

				if ( callback ) {
					callback( this );
				}
			};

			AttributeRename.prototype.lang = {};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'de/AttributeRename', AttributeRename );
		}
	} );
}() );

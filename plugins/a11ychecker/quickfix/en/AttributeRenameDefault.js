/**
 * @license Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.a11ychecker.quickFixes.get( { langCode: 'en',
		name: 'AttributeRename',
		callback: function( AttributeRename ) {
			/**
			 * QuickFix renaming an attribute {@link #attributeName} to another name
			 * {@link #attributeTargetName} using a proposed default value
			 * based on the value of {@link #attributeTargetName}.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix
			 * @class AttributeRenameDefault
			 * @constructor
			 * @param {CKEDITOR.plugins.a11ychecker.Issue} issue Issue QuickFix is created for.
			 */
			function AttributeRenameDefault( issue ) {
				AttributeRename.call( this, issue );
			}

			AttributeRenameDefault.prototype = new AttributeRename();

			AttributeRenameDefault.prototype.constructor = AttributeRenameDefault;

			AttributeRenameDefault.prototype.getProposedValue = function() {
				var element = this.issue.element;
				return element.getAttribute( this.attributeTargetName ) ||
					element.getAttribute( this.attributeName ) || '';
			};

			AttributeRenameDefault.prototype.lang = {};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'en/AttributeRenameDefault', AttributeRenameDefault );
		}
	} );
}() );

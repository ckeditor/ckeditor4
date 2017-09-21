/**
 * @license Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.a11ychecker.quickFixes.get( { langCode: 'nl',
		name: 'QuickFix',
		callback: function( QuickFix ) {

			var emptyWhitespaceRegExp = /^[\s\n\r]+$/g;

			/**
			 * QuickFix adding a caption in the `table` element.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix
			 * @class AddTableCaption
			 * @constructor
			 * @param {CKEDITOR.plugins.a11ychecker.Issue} issue Issue QuickFix is created for.
			 */
			function AddTableCaption( issue ) {
				QuickFix.call( this, issue );
			}

			AddTableCaption.prototype = new QuickFix();

			AddTableCaption.prototype.constructor = AddTableCaption;

			AddTableCaption.prototype.display = function( form ) {
				form.setInputs( {
					caption: {
						type: 'text',
						label: this.lang.captionLabel
					}
				} );
			};

			/**
			 * @param {Object} formAttributes Object containing serialized form inputs. See
			 * {@link CKEDITOR.plugins.a11ychecker.ViewerForm#serialize}.
			 * @param {Function} callback Function to be called when a fix was applied. Gets QuickFix object
			 * as a first parameter.
			 */
			AddTableCaption.prototype.fix = function( formAttributes, callback ) {
				var issueElement = this.issue.element,
					caption = issueElement.getDocument().createElement( 'caption' );

				caption.setHtml( formAttributes.caption );
				// Prepend the caption.
				issueElement.append( caption, true );

				if ( callback ) {
					callback( this );
				}
			};

			AddTableCaption.prototype.validate = function( formAttributes ) {
				var proposedCaption = formAttributes.caption,
					ret = [];

				// Test if the caption has only whitespaces.
				if ( !proposedCaption || proposedCaption.match( emptyWhitespaceRegExp ) ) {
					ret.push( this.lang.errorEmpty );
				}

				return ret;
			};

			AddTableCaption.prototype.lang = {"captionLabel":"Caption","errorEmpty":"Caption (bijschtift) tekst mag niet leeg zijn"};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'nl/AddTableCaption', AddTableCaption );
		}
	} );
}() );

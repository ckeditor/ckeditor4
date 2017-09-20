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
			 * QuickFix merging two or more sibling anchors with the same href.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix
			 * @class AnchorsMerge
			 * @constructor
			 * @param {CKEDITOR.plugins.a11ychecker.Issue} issue Issue QuickFix is created for.
			 */
			function AnchorsMerge( issue ) {
				QuickFix.call( this, issue );
			}

			AnchorsMerge.prototype = new QuickFix();

			AnchorsMerge.prototype.constructor = AnchorsMerge;

			/**
			 * @param {Object} formAttributes Object containing serialized form inputs. See
			 * {@link CKEDITOR.plugins.a11ychecker.ViewerForm#serialize}.
			 * @param {Function} callback Function to be called when a fix was applied. Gets QuickFix object
			 * as a first parameter.
			 */
			AnchorsMerge.prototype.fix = function( formAttributes, callback ) {
				var issueElement = this.issue.element,
					nextSibling = issueElement.getNext(),
					initialHref = issueElement.getAttribute( 'href' ),
					extraInnerHtml = '',
					isWhitespace = function( node ) {
						return node.type === CKEDITOR.NODE_TEXT && node.getText().match( /^[\s]*$/ );
					},
					iterationAllowed = function( node ) {
						if ( !node ) {
							return false;
						}

						// We only allow anchors that have the same href as the initial one
						return ( node.getName && node.getName() == 'a' && nextSibling.getAttribute( 'href' ) == initialHref ) ||
							isWhitespace( node ); // Or whitespace text nodes.
					},
					curNode;

				while ( iterationAllowed( nextSibling ) ) {
					curNode = nextSibling;

					// This html will be added later on to the first anchor.
					extraInnerHtml += isWhitespace( curNode ) ? curNode.getText() : curNode.getHtml();

					// Prepare nextSibling var for next iteration.
					nextSibling = curNode.getNext();

					// And we can remove element safely.
					curNode.remove();
				}

				// Adding extra html to first anchor.
				if ( extraInnerHtml ) {
					issueElement.setHtml( issueElement.getHtml() + extraInnerHtml );
				}

				if ( callback ) {
					callback( this );
				}
			};

			AnchorsMerge.prototype.lang = {};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'de/AnchorsMerge', AnchorsMerge );
		}
	} );
}() );

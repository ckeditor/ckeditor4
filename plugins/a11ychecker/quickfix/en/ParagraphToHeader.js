/**
 * @license Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.a11ychecker.quickFixes.get( { langCode: 'en',
		name: 'ElementReplace',
		callback: function( ElementReplace ) {
			/**
			 * Replaces provided element with element that a different tag name, preserving its children.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix
			 * @class ParagraphToHeader
			 * @constructor
			 * @param {CKEDITOR.plugins.a11ychecker.Issue} issue
			 */
			function ParagraphToHeader( issue ) {
				ElementReplace.call( this, issue );
			}

			ParagraphToHeader.prototype = new ElementReplace();
			ParagraphToHeader.prototype.constructor = ParagraphToHeader;

			ParagraphToHeader.prototype.getTargetName = function( formAttributes ) {
				return formAttributes.level;
			};

			ParagraphToHeader.prototype.display = function( form, editor ) {

				var levelDict = this._getFormHeaderLeves( editor );

				form.setInputs( {
					level: {
						type: 'select',
						label: this.lang.levelLabel,
						value: 'h' + this._getPreferredLevel( editor ),
						options: levelDict
					}
				} );
			};

			ParagraphToHeader.prototype.fix = function( formAttributes, callback ) {
				var that = this;
				ElementReplace.prototype.fix.call( this, formAttributes, function() {
					that._removeBoldTag();
					callback( that );
				} );
			};

			/**
			 * Determines preferred heading level for the header that should be cerated.
			 *
			 * @private
			 * @param {CKEDITOR.editor} editor
			 * @returns {Number} Number ranging from `1` to `6`.
			 */
			ParagraphToHeader.prototype._getPreferredLevel = function( editor ) {
				var ret = 1,
					editable = editor.editable(),
					headerTagRegExp = /^h[1-6]$/i,
					range = new CKEDITOR.dom.range( editable.getDocument() ),
					walker,
					prevElement;

				range.setStartAt( editable, CKEDITOR.POSITION_AFTER_START );
				range.setEndAt( this.issue.element, CKEDITOR.POSITION_BEFORE_START );
				walker = new CKEDITOR.dom.walker( range );

				while ( ( prevElement = walker.previous() ) ) {
					if ( prevElement.getName && prevElement.getName().match( headerTagRegExp ) ) {
						ret = Number( prevElement.getName()[ 1 ] ) + 1;
						break;
					}
				}

				// WE can't return a higher value than 7.
				return Math.min( ret, 6 );
			};

			/**
			 * This method check if issue element contains `<strong>` element only as a first and the only child.
			 * If so we'll remove it, but move its children to the `issue.element`.
			 */
			ParagraphToHeader.prototype._removeBoldTag = function() {
				var isElementEvaluator = function( el ) {
						return el.type === CKEDITOR.NODE_ELEMENT;
					},
					elem = this.issue.element,
					innerElement = elem.getFirst( isElementEvaluator ),
					// If first child element is at the same time last element child, then it means it has only this element.
					hasSingleElement = innerElement && innerElement.equals( elem.getLast( isElementEvaluator ) ),
					suspiciousTagNames = [ 'strong', 'b' ];

				if ( hasSingleElement && CKEDITOR.tools.indexOf( suspiciousTagNames, innerElement.getName() ) !== -1 ) {
					innerElement.moveChildren( elem );
					innerElement.remove();
				}
			};

			/**
			 * Returns minimal and maximal possible header levels for given editor.
			 *
			 * Result will be based on ACF and `config.format_tags`.
			 *
			 * @param {CKEDITOR.editor}
			 * @return {Object} Allowed header level boundaries.
			 * @return {Number} return.min Minimal allowed level.
			 * @return {Number} return.email Maximal allowed level.
			 */
			ParagraphToHeader.prototype._getPossibleLevels = function( editor ) {
				var tags = ( editor.config.format_tags || '' ).split( ';' ),
					ret = {
						min: 1,
						max: 6
					},
					i;

				// Filtering tags.
				for ( i = tags.length - 1; i >= 0; i-- ) {
					// If given tag is not header tag or if it's not allowed by the ACF.
					if ( !tags[ i ].match( /^h[1-6]$/i ) || !editor.filter.check( tags[ i ] ) ) {
						tags.splice( i, 1 );
					} else {
						tags[ i ] = Number( tags[ i ][ 1 ] );
					}
				}

				if ( tags.length ) {
					// Note if IE8 has to be supported we need to inline sorting here.
					tags.sort();

					ret.min = tags[ 0 ];
					ret.max = tags[ tags.length - 1 ];
				}

				return ret;
			};

			/**
			 * Returns options dictionary that should be put in form header level select.
			 *
			 * @param {CKEDITOR.editor} editor
			 */
			ParagraphToHeader.prototype._getFormHeaderLeves = function( editor ) {
				var dict = {},
					boundaries = this._getPossibleLevels( editor ),
					preferredLevel = this._getPreferredLevel( editor );

				for ( var i = boundaries.min; i <= boundaries.max; i++ ) {
					dict[ 'h' + i ] = 'H' + i;
				}

				if ( dict[ 'h' + preferredLevel ] ) {
					dict[ 'h' + preferredLevel ] += ( ' ' + this.lang.suggested );
				}

				return dict;
			};


			ParagraphToHeader.prototype.lang = {"levelLabel":"Header level","suggested":"(Suggested)"};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'en/ParagraphToHeader', ParagraphToHeader );
		}
	} );
}() );

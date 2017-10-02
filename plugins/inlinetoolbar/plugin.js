/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	/**
	 * A class that represents a inline toolbar capable of presenting defined
	 * menu buttons.
	 *
	 * @class
	 * @extends CKEDITOR.ui.balloonPanel
	 * @constructor Creates a command class instance.
	 * @since 4.8
	 * @param {CKEDITOR.editor} editor The editor instance for which the panel is created.
	 * @param {Object} definition An object containing the panel definition.
	 */
	CKEDITOR.ui.inlineToolbarView = function( editor, definition ) {
		CKEDITOR.ui.balloonPanel.call( this, editor, definition );
		this.listeners = [];
	};

	CKEDITOR.inlineToolbar = function( editor ) {
		this.inlineToolbar = new CKEDITOR.ui.inlineToolbarView( editor );
	};

	CKEDITOR.plugins.add( 'inlinetoolbar', {
		requires: 'balloonpanel',
		init: function() {
			CKEDITOR.ui.inlineToolbarView.prototype = CKEDITOR.tools.extend( {}, CKEDITOR.ui.balloonPanel.prototype );
			/**
			 * build inline toolbar DOM representation.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.build = function() {
				CKEDITOR.ui.balloonPanel.prototype.build.call( this );
				this.parts.title.remove();
				this.parts.close.remove();
			};

			/**
			 * Get all posbile toolbar aligments.
			 *
			 * @private
			 */
			CKEDITOR.ui.inlineToolbarView.prototype._getAlignments = function( elementRect, panelWidth, panelHeight ) {
				var filter = [ 'top hcenter', 'bottom hcenter' ],
					output = {},
					alignments = CKEDITOR.ui.balloonPanel.prototype._getAlignments.call( this, elementRect, panelWidth, panelHeight );
				for ( var a in alignments ) {
					if ( CKEDITOR.tools.indexOf( filter, a ) !== -1 ) {
						output[ a ] = alignments[ a ];
					}
				}
				return output;
			};

			/**
			 * Detach all listeners.
			 *
			 * @private
			 */
			CKEDITOR.ui.inlineToolbarView.prototype._detachListeners = function() {
				if ( this.listeners.length ) {
					CKEDITOR.tools.array.forEach( this.listeners, function( listener ) {
						listener.removeListener();
					} );
					this.listeners = [];
				}
			};

			/**
			 * Destroys the inline toolbar by removing it from DOM and purging
			 * all associated event listeners.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.destroy = function() {
				CKEDITOR.ui.balloonPanel.prototype.destroy.call( this );
				this._detachListeners();
			};

			/**
			 * Places the inline toolbar next to a specified element so the tip of the toolbar's triangle
			 * touches that element. Once the toolbar is attached it gains focus and attach DOM change listiners.
			 *
			 * @method attach
			 * @param {CKEDITOR.dom.element} element The element to which the panel is attached.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.create = function( element ) {
				this.attach( element );

				var that = this,
					editable = this.editor.editable();
				this._detachListeners();
				this.listeners = [];

				this.listeners.push( this.editor.on( 'resize', function() {
					that.attach( element, false );
				} ) );
				this.listeners.push( editable.attachListener( editable.getDocument(), 'scroll', function() {
					that.attach( element, false );
				} ) );
			};

			/**
			 * Hides the inline toolbar, detaches listners and moves the focus back to the editable.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.detach = function() {
				this._detachListeners();
				this.hide();
			};
		}
	} );
}() );

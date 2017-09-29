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
	};

	CKEDITOR.inlineToolbar = function( editor ) {
		this.inlineToolbar = new CKEDITOR.ui.inlineToolbarView( editor );
	};

	CKEDITOR.plugins.add( 'inlinetoolbar', {
		requires: 'balloonpanel',
		init: function( editor ) {
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
			CKEDITOR.ui.inlineToolbarView.prototype._detachListiners = function() {
				if ( this.listeners ) {
					this.editor.removeListener( 'resize', this.listeners.resize );
					this.listeners.scrollEvent.removeListener();
					this.listeners = null;
				}
			};

			/**
			 * Destroys the inline toolbar by removing it from DOM and purging
			 * all associated event listeners.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.destroy = function() {
				CKEDITOR.ui.balloonPanel.prototype.destroy.call( this );
				this._detachListiners();
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
				this._detachListiners();
				this.listeners = {
					resize: function() {
						that.attach( element, false );
					},
					scroll: function() {
						that.attach( element, false );
					}
				};

				this.editor.on( 'resize', this.listeners.resize );
				this.listeners.scrollEvent = editable.attachListener( editable.getDocument(), 'scroll', this.listeners.scroll );
			};

			/**
			 * Hides the inline toolbar, detaches listners and moves the focus back to the editable.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.detach = function() {
				this._detachListiners();
				this.hide();
			};

			function temporaryCode() {
				editor.addCommand( 'testInlineToolbar', {
					exec: function( editor ) {
						var img = editor.editable().findOne( 'img' );
						if ( img ) {
							var panel = new CKEDITOR.ui.inlineToolbarView( editor );
							panel.create( img );
						}
					}
				} );
				editor.ui.addButton( 'testInlineToolbar', {
					label: 'test inlinetoolbar',
					command: 'testInlineToolbar',
					toolbar: 'insert'
				} );
			}
			temporaryCode();
		}
	} );
}() );

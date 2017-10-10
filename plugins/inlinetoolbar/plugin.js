/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	/**
	 * Class representing view of inline toolbar.
	 *
	 * @class
	 * @extends CKEDITOR.ui.balloonPanel
	 * @constructor Creates an inline toolbar view instance.
	 * @since 4.8
	 * @param {CKEDITOR.editor} editor The editor instance for which the panel is created.
	 * @param {Object} definition An object containing the panel definition. See {@link CKEDITOR.ui.balloonPanel}
	 * docs for an example definition.
	 */
	CKEDITOR.ui.inlineToolbarView = function( editor, definition ) {
		definition = CKEDITOR.tools.extend( definition || {}, {
			width: 'auto',
			triangleWidth: 10,
			triangleHeight: 10
		} );
		CKEDITOR.ui.balloonPanel.call( this, editor, definition );
		this.listeners = [];
	};

		/**
		 * Listeners registered by this toolbar view.
		 *
		 * @private
		 */
		this._listeners = [];
	};

	CKEDITOR.plugins.add( 'inlinetoolbar', {
		requires: 'balloonpanel',
		onLoad: function() {
			CKEDITOR.document.appendStyleSheet( this.path + 'skins/' + CKEDITOR.skinName + '/inlinetoolbar.css' );
		},
		init: function() {
			CKEDITOR.ui.inlineToolbarView.prototype = CKEDITOR.tools.extend( {}, CKEDITOR.ui.balloonPanel.prototype );
			/**
			 * Build inline toolbar DOM representation.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.build = function() {
				CKEDITOR.ui.balloonPanel.prototype.build.call( this );
				this.parts.panel.addClass( 'cke_inlinetoolbar' );
				this.parts.title.remove();
				this.parts.close.remove();
				var output = [];
				for ( var menuItem in this.menuItems ) {
					this.menuItems[ menuItem ].render( this.editor, output );
				}
				this.parts.content.setHtml( output.join( '' ) );
			};

			CKEDITOR.ui.inlineToolbarView.prototype._getAlignments = function( elementRect, panelWidth, panelHeight ) {
				var filter = [ 'top hcenter', 'bottom hcenter' ],
					alignments = CKEDITOR.ui.balloonPanel.prototype._getAlignments.call( this, elementRect, panelWidth, panelHeight );
				for ( var a in alignments ) {
					if ( CKEDITOR.tools.indexOf( filter, a ) === -1 ) {
						delete alignments[ a ];
					}
				}
				return alignments;
			};

			/**
			 * Detaches all listeners.
			 *
			 * @private
			 */
			CKEDITOR.ui.inlineToolbarView.prototype._detachListeners = function() {
				if ( this._listeners.length ) {
					CKEDITOR.tools.array.forEach( this._listeners, function( listener ) {
						listener.removeListener();
					} );
					this._listeners = [];
				}
				this.menuItems = [];
			};

			CKEDITOR.ui.inlineToolbarView.prototype.destroy = function() {
				CKEDITOR.ui.balloonPanel.prototype.destroy.call( this );
				this._detachListeners();
			};

			/**
			 * Places the inline toolbar next to a specified element so the tip of the toolbar's triangle
			 * points to that element.
			 *
			 * @param {CKEDITOR.dom.element} element The element to which the panel is attached.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.create = function( element ) {
				this.build();
				this.attach( element );

				var that = this,
					editable = this.editor.editable();
				this._detachListeners();

				this._listeners.push( this.editor.on( 'resize', function() {
					that.attach( element, false );
				} ) );
				this._listeners.push( editable.attachListener( editable.getDocument(), 'scroll', function() {
					that.attach( element, false );
				} ) );
			};

			/**
			 * Hides the inline toolbar, detaches listeners and moves the focus back to the editable.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.detach = function() {
				this._detachListeners();
				this.hide();
			};

			/**
			 * Adds an item from the specified definition to the inline toolbar.
			 *
			 * @method
			 * @param {String} name The menu item name.
			 * @param {Object} definition The menu item definition.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.addMenuItem = function( name, definition ) {
				this.menuItems[ name ] = new CKEDITOR.ui.button( definition );
			};

			/**
			 * Adds one or more items from the specified definition object to the inline toolbar.
			 *
			 * @method
			 * @param {Object} definitions Object where keys are used as itemName and corresponding values as definition for a {@link #addMenuItem} call.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.addMenuItems = function( definitions ) {
				for ( var itemName in definitions ) {
					this.addMenuItem( itemName, definitions[ itemName ] );
				}
			};

			/**
			 * Retrieves a particular menu item definition from the inline toolbar.
			 *
			 * @method
			 * @param {String} name The name of the desired menu item.
			 * @returns {Object}
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.getMenuItem = function( name ) {
				return this.menuItems[ name ];
			};

			/**
			 * Removes a particular menu item definition from the inline toolbar.
			 *
			 * @method
			 * @param {String} name The name of the desired menu item.
			 * @returns {Object}
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.deleteMenuItem = function( name ) {
				if ( this.menuItems[ name ] ) {
					delete this.menuItems[ name ];
				}
			};
		}
	} );
}() );

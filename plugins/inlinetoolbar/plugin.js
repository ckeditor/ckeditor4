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
	 * @param {CKEDITOR.editor} editor The editor instance for which the toolbar is created.
	 * @param {Object} definition An object containing the toolbar definition. See {@link CKEDITOR.ui.balloonPanel}
	 * docs for an example definition.
	 */
	CKEDITOR.ui.inlineToolbarView = function( editor, definition ) {
		definition = CKEDITOR.tools.extend( definition || {}, {
			width: 'auto',
			triangleWidth: 10,
			triangleHeight: 10
		} );
		CKEDITOR.ui.balloonPanel.call( this, editor, definition );

		/**
		 * Listeners registered by this toolbar view.
		 *
		 * @private
		 */
		this._listeners = [];
	};

	/**
	 * Class representing instance of inline toolbar.
	 *
	 * @class
	 * @constructor Creates an inline toolbar instance.
	 * @since 4.8
	 * @param {CKEDITOR.editor} editor The editor instance for which the panel is created.
	 * @param {Object} definition An object containing the panel definition. See {@link CKEDITOR.ui.balloonPanel}
	 * docs for an example definition.
	 */
	CKEDITOR.ui.inlineToolbar = function( editor, definition ) {
		this._view = new CKEDITOR.ui.inlineToolbarView( editor, definition );

		/**
		 * Menu items added to inline toolbar
		 *
		 * @private
		 */
		this._items = [];
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
			};

			CKEDITOR.ui.inlineToolbarView.prototype.destroy = function() {
				CKEDITOR.ui.balloonPanel.prototype.destroy.call( this );
				this._detachListeners();
			};

			/**
			 * Create html representation of menu items in toolbar.
			 *
			 * @param items array of {CKEDITOR.ui.button/CKEDITOR.ui.richCombo} objects.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.renderItems = function( items ) {
				var output = [];
				for ( var menuItem in items ) {
					items[ menuItem ].render( this.editor, output );
				}
				this.parts.content.setHtml( output.join( '' ) );
			};

			/**
			 * Places the inline toolbar next to a specified element so the tip of the toolbar's triangle
			 * points to that element.
			 *
			 * @param {CKEDITOR.dom.element} element The element to which the panel is attached.
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.create = function( element ) {
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
			 * Render items and attach view to DOM element.
			 *
			 * @param {CKEDITOR.dom.element} element The element to which the panel is attached.
			 */
			CKEDITOR.ui.inlineToolbar.prototype.create = function( element ) {
				this._view.renderItems( this._items );
				this._view.create( element );
			};

			/**
			 * Adds an item to the inline toolbar.
			 *
			 * @param {String} name The menu item name.
			 * @param {Object} element instance of {CKEDITOR.ui.button/CKEDITOR.ui.richCombo}
			 */
			CKEDITOR.ui.inlineToolbar.prototype.addItem = function( name, element ) {
				this._items[ name ] = element;
			};

			/**
			 * Adds one or more items to the inline toolbar.
			 *
			 * @param {Object} elements Object where keys are used as itemName and corresponding values as definition for a {@link #addUIElement} call.
			 */
			CKEDITOR.ui.inlineToolbar.prototype.addItems = function( elements ) {
				for ( var itemName in elements ) {
					this.addItem( itemName, elements[ itemName ] );
				}
			};

			/**
			 * Retrieves a particular menu item definition from the inline toolbar.
			 *
			 * @param {String} name The name of the desired menu item.
			 * @returns {Object}
			 */
			CKEDITOR.ui.inlineToolbar.prototype.getItem = function( name ) {
				return this._items[ name ];
			};

			/**
			 * Removes a particular menu item definition from the inline toolbar.
			 *
			 * @param {String} name The name of the desired menu item.
			 * @returns {Object}
			 */
			CKEDITOR.ui.inlineToolbar.prototype.deleteItem = function( name ) {
				if ( this._items[ name ] ) {
					delete this._items[ name ];
				}
			};
			CKEDITOR.ui.inlineToolbar.prototype.destroy = function() {
				this._view.destroy();
			};
		}
	} );
}() );

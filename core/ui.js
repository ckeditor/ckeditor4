/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * Contains UI features related to an editor instance.
 * @constructor
 * @param {CKEDITOR.editor} editor The editor instance.
 * @example
 */
CKEDITOR.ui = function( editor ) {
	if ( editor.ui )
		return editor.ui;

	this.items = {};
	this.editor = editor;

	/**
	 * Object used to hold private stuff.
	 * @private
	 */
	this._ = {
		handlers: {}
	};

	return this;
};

// PACKAGER_RENAME( CKEDITOR.ui )

CKEDITOR.ui.prototype = {
	/**
	 * Adds a UI item to the items collection. These items can be later used in
	 * the interface.
	 * @param {String} name The UI item name.
	 * @param {Object} type The item type.
	 * @param {Object} definition The item definition. The properties of this
	 *		object depend on the item type.
	 * @example
	 * // Add a new button named "MyBold".
	 * editorInstance.ui.add( 'MyBold', CKEDITOR.UI_BUTTON,
	 *     {
	 *         label : 'My Bold',
	 *         command : 'bold'
	 *     });
	 */
	add: function( name, type, definition ) {
		// Compensate the unique name of this ui item to definition.
		definition.name = name.toLowerCase();

		var item = this.items[ name ] = {
			type: type,
			// The name of {@link CKEDITOR.command} which associate with this UI.
			command: definition.command || null,
			args: Array.prototype.slice.call( arguments, 2 )
		};

		CKEDITOR.tools.extend( item, definition );
	},

	/**
	 * Gets a UI object.
	 * @param {String} name The UI item hame.
	 * @example
	 */
	create: function( name ) {
		var item = this.items[ name ],
			handler = item && this._.handlers[ item.type ],
			command = item && item.command && this.editor.getCommand( item.command );

		var result = handler && handler.create.apply( this, item.args );

		// Add reference inside command object.
		if ( command )
			command.uiItems.push( result );

		if ( result && !result.type )
			result.type = item.type;

		return result;
	},

	/**
	 * Adds a handler for a UI item type. The handler is responsible for
	 * transforming UI item definitions in UI objects.
	 * @param {Object} type The item type.
	 * @param {Object} handler The handler definition.
	 * @example
	 */
	addHandler: function( type, handler ) {
		this._.handlers[ type ] = handler;
	},

	/**
	 * Returns the unique DOM element that represents one editor's UI part, as
	 * the editor UI is made completely decoupled from DOM (no DOM reference hold),
	 * this method is mainly used to retrieve the rendered DOM part by name.
	 *
	 * @param {String} name The space name.
	 * @returns {CKEDITOR.dom.element} The element that represents the space.
	 * @example
	 * // Hide the bottom space in the UI.
	 * var bottom = editor.ui.getSpace( 'bottom' );
	 * bottom.setStyle( 'display', 'none' );
	 */
	space: function( name ) {
		return CKEDITOR.document.getById( this.spaceId( name ) );
	},

	/**
	 * Generate the HTML ID from a specific UI space name.
	 */
	spaceId: function( name ) {
		return this.editor.id + '_' + name;
	}
};

CKEDITOR.event.implementOn( CKEDITOR.ui );

/**
 * (Virtual Class) Do not call this constructor. This class is not really part
 *		of the API. It just illustrates the features of hanlder objects to be
 *		passed to the {@link CKEDITOR.ui.prototype.addHandler} function.
 * @name CKEDITOR.ui.handlerDefinition
 * @constructor
 * @example
 */

/**
 * Transforms an item definition into an UI item object.
 * @name CKEDITOR.handlerDefinition.prototype.create
 * @function
 * @param {Object} definition The item definition.
 * @example
 * editorInstance.ui.addHandler( CKEDITOR.UI_BUTTON,
 *     {
 *         create : function( definition )
 *         {
 *             return new CKEDITOR.ui.button( definition );
 *         }
 *     });
 */

/**
 * Internal event fired when a new UI element is ready
 * @name CKEDITOR.ui#ready
 * @event
 * @param {Object} element The new element
 */

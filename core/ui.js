/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * Contains UI features related to an editor instance.
 *
 * @class
 * @mixins CKEDITOR.event
 * @constructor Creates a `ui` class instance.
 * @param {CKEDITOR.editor} editor The editor instance.
 */
CKEDITOR.ui = function( editor ) {
	if ( editor.ui )
		return editor.ui;

	this.items = {};
	this.instances = {};
	this.editor = editor;

	/**
	 * Object used to store private stuff.
	 *
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
	 *
	 *		// Add a new button named 'MyBold'.
	 *		editorInstance.ui.add( 'MyBold', CKEDITOR.UI_BUTTON, {
	 *			label: 'My Bold',
	 *			command: 'bold'
	 *		} );
	 *
	 * @param {String} name The UI item name.
	 * @param {Object} type The item type.
	 * @param {Object} definition The item definition. The properties of this
	 * object depend on the item type.
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
	 * Retrieves the created UI objects by name.
	 *
	 * @param {String} name The name of the UI definition.
	 */
	get: function( name ) {
		return this.instances[ name ];
	},

	/**
	 * Gets a UI object.
	 *
	 * @param {String} name The UI item name.
	 * @returns {Object} The UI element.
	 */
	create: function( name ) {
		var item = this.items[ name ],
			handler = item && this._.handlers[ item.type ],
			command = item && item.command && this.editor.getCommand( item.command );

		var result = handler && handler.create.apply( this, item.args );

		this.instances[ name ] = result;

		// Add reference inside command object.
		if ( command )
			command.uiItems.push( result );

		if ( result && !result.type )
			result.type = item.type;

		return result;
	},

	/**
	 * Adds a handler for a UI item type. The handler is responsible for
	 * transforming UI item definitions into UI objects.
	 *
	 * @param {Object} type The item type.
	 * @param {Object} handler The handler definition.
	 */
	addHandler: function( type, handler ) {
		this._.handlers[ type ] = handler;
	},

	/**
	 * Returns the unique DOM element that represents one editor's UI part, also known as "space".
	 * There are 3 main editor spaces available: `top`, `contents` and `bottom`
	 * and their availability depends on editor type.
	 *
	 *		// Hide the bottom space in the UI.
	 *		var bottom = editor.ui.space( 'bottom' );
	 *		bottom.setStyle( 'display', 'none' );
	 *
	 * @param {String} name The name of the space.
	 * @returns {CKEDITOR.dom.element} The element that represents the space.
	 */
	space: function( name ) {
		return CKEDITOR.document.getById( this.spaceId( name ) );
	},

	/**
	 * Returns the HTML ID for a specific UI space name.
	 *
	 * @param {String} name The name of the space.
	 * @returns {String} The ID of an element representing this space in the DOM.
	 */
	spaceId: function( name ) {
		return this.editor.id + '_' + name;
	}
};

CKEDITOR.event.implementOn( CKEDITOR.ui );

/**
 * Internal event fired when a new UI element is ready.
 *
 * @event ready
 * @param {Object} data The new UI element.
 */

/**
 * Virtual class which just illustrates the features of handler objects to be
 * passed to the {@link CKEDITOR.ui#addHandler} function.
 * This class is not really a part of the API, so do not call its constructor.
 *
 * @class CKEDITOR.ui.handlerDefinition
 */

/**
 * Transforms an item definition into a UI item object.
 *
 *		editorInstance.ui.addHandler( CKEDITOR.UI_BUTTON, {
 *			create: function( definition ) {
 *				return new CKEDITOR.ui.button( definition );
 *			}
 *		} );
 *
 * @method create
 * @param {Object} definition The item definition.
 * @returns {Object} The UI element.
 * @todo We lack the "UI element" abstract super class.
 */

/**
 * The element in the {@link CKEDITOR#document host page's document} that contains the editor content.
 * If the {@glink features/uitypes#fixed-user-interface fixed editor UI} is used, then it will be set to
 * `editor.ui.space( 'contents' )` &mdash; i.e. the `<div>` which contains the editor `<iframe>` (in case of classic editor)
 * or {@link CKEDITOR.editable} (in case of inline editor). Otherwise it is set to the {@link CKEDITOR.editable} itself.
 *
 * Use the position of this element if you need to position elements placed in the host page's document relatively to the
 * editor content.
 *
 *		var editor = CKEDITOR.instances.editor1;
 *		console.log( editor.ui.contentsElement.getName() ); // 'div'
 *
 * @since 4.5.0
 * @readonly
 * @property {CKEDITOR.dom.element} contentsElement
 */

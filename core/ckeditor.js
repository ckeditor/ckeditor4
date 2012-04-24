/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Contains the third and last part of the {@link CKEDITOR} object
 *		definition.
 */

// Remove the CKEDITOR.loadFullCore reference defined on ckeditor_basic.
delete CKEDITOR.loadFullCore;

/**
 * Holds references to all editor instances created. The name of the properties
 * in this object correspond to instance names, and their values contains the
 * {@link CKEDITOR.editor} object representing them.
 * @type {Object}
 * @example
 * alert( <b>CKEDITOR.instances</b>.editor1.name );  // "editor1"
 */
CKEDITOR.instances = {};

/**
 * The document of the window holding the CKEDITOR object.
 * @type {CKEDITOR.dom.document}
 * @example
 * alert( <b>CKEDITOR.document</b>.getBody().getName() );  // "body"
 */
CKEDITOR.document = new CKEDITOR.dom.document( document );

/**
 * Adds an editor instance to the global {@link CKEDITOR} object. This function
 * is available for internal use mainly.
 * @param {CKEDITOR.editor} editor The editor instance to be added.
 * @example
 */
CKEDITOR.add = (function() {
	var nameCounter = 0;

	function getNewName() {
		do {
			var name = 'editor' + ( ++nameCounter );
		}
		while ( CKEDITOR.instances[ name ] )

		return name;
	}

	return function( editor ) {
		editor.name = editor.name || getNewName();
		CKEDITOR.instances[ editor.name ] = editor;

		editor.on( 'focus', function() {
			if ( CKEDITOR.currentInstance != editor ) {
				CKEDITOR.currentInstance = editor;
				CKEDITOR.fire( 'currentInstance' );
			}
		});

		editor.on( 'blur', function() {
			if ( CKEDITOR.currentInstance == editor ) {
				CKEDITOR.currentInstance = null;
				CKEDITOR.fire( 'currentInstance' );
			}
		});

		CKEDITOR.fire( 'instance', null, editor );
	};
})();

/**
 * Removes an editor instance from the global {@link CKEDITOR} object. This function
 * is available for internal use only. External code must use {@link CKEDITOR.editor.prototype.destroy}.
 * @param {CKEDITOR.editor} editor The editor instance to be removed.
 * @example
 */
CKEDITOR.remove = function( editor ) {
	delete CKEDITOR.instances[ editor.name ];
};

(function() {
	var tpls = {};

	/**
	 * Add a named {@link CKEDITOR.template} instance to be reused among all editors,
	 * it will returns the existed one if template with same name is already
	 * defined, additionally fires the "template" event to allow template source customization.
	 *
	 * @param {String} name The name which identify one UI template.
	 * @param {String} source The source string for constructing this template.
	 * @return {CKEDITOR.template} The created template instance.
	 */
	CKEDITOR.addTemplate = function( name, source ) {
		var tpl = tpls[ name ];
		if ( tpl )
			return tpl;

		// Make it possible to customize the template through event.
		var params = { name: name, source: source };
		CKEDITOR.fire( 'template', params );

		return ( tpls[ name ] = new CKEDITOR.template( params.source ) );
	};

	/**
	 * Retrieve a defined template created with {@link CKEDITOR.addTemplate}.
	 * @param {String} name The template name.
	 */
	CKEDITOR.getTemplate = function( name ) {
		return tpls[ name ];
	};
})();

(function() {
	var styles = [];

	/**
	 * Append a trunk of css to be appended to the editor document.
	 * This method is mostly used by plugins to add custom styles to the editor
	 * document. For basic contents styling the contents.css file should be
	 * used instead.<br><br>
	 * <strong>Note:</strong> This function should be called before the
	 * creation of editor instances.
	 * @see CKEDITOR.config.contentsCss
	 * @param css {String} The style rules to be appended.
	 * @example
	 * // Add styles for all headings inside of editable contents.
	 * CKEDITOR.addCss( '.cke_editable h1,.cke_editable h2,.cke_editable h3 { border-bottom: 1px dotted red }' );
	 */
	CKEDITOR.addCss = function( css ) {
		styles.push( css );
	};

	/**
	 * Returns a string will all CSS rules passes to the {@link CKEDITOR.addCss} method.
	 * @return {String} A string containing CSS rules.
	 */
	CKEDITOR.getCss = function() {
		return styles.join( '\n' );
	};
})();

/**
 * Perform global clean up to free as much memory as possible
 * when there are no instances left
 */
CKEDITOR.on( 'instanceDestroyed', function() {
	if ( CKEDITOR.tools.isEmpty( this.instances ) )
		CKEDITOR.fire( 'reset' );
});

// Load the bootstrap script.
CKEDITOR.loader.load( '_bootstrap' ); // @Packager.RemoveLine

// Tri-state constants.
/**
 * Used to indicate the ON or ACTIVE state.
 * @constant
 * @example
 */
CKEDITOR.TRISTATE_ON = 1;

/**
 * Used to indicate the OFF or NON ACTIVE state.
 * @constant
 * @example
 */
CKEDITOR.TRISTATE_OFF = 2;

/**
 * Used to indicate DISABLED state.
 * @constant
 * @example
 */
CKEDITOR.TRISTATE_DISABLED = 0;

/**
 * The editor which is currently active (have user focus).
 * @name CKEDITOR.currentInstance
 * @type CKEDITOR.editor
 * @see CKEDITOR#currentInstance
 * @example
 * function showCurrentEditorName()
 * {
 *     if ( CKEDITOR.currentInstance )
 *         alert( CKEDITOR.currentInstance.name );
 *     else
 *         alert( 'Please focus an editor first.' );
 * }
 */

/**
 * Fired when the CKEDITOR.currentInstance object reference changes. This may
 * happen when setting the focus on different editor instances in the page.
 * @name CKEDITOR#currentInstance
 * @event
 * var editor;  // Variable to hold a reference to the current editor.
 * CKEDITOR.on( 'currentInstance' , function( e )
 *     {
 *         editor = CKEDITOR.currentInstance;
 *     });
 */

/**
 * Fired when the last instance has been destroyed. This event is used to perform
 * global memory clean up.
 * @name CKEDITOR#reset
 * @event
 */

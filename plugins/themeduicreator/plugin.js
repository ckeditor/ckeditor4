/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * The class name used to identify &lt;textarea&gt; elements to be replace
 * by CKEditor instances. Set it to empty/null to disable this feature.
 * @type String
 * @default 'ckeditor'
 * @example
 * <b>CKEDITOR.replaceClass</b> = 'rich_editor';
 */
CKEDITOR.replaceClass = 'ckeditor';

(function() {
	/**
	 * Replaces a &lt;textarea&gt; or a DOM element (DIV) with a CKEditor
	 * instance. For textareas, the initial value in the editor will be the
	 * textarea value. For DOM elements, their innerHTML will be used
	 * instead. We recommend using TEXTAREA and DIV elements only.
	 * @param {Object|String} elementOrIdOrName The DOM element (textarea), its
	 *		ID or name.
	 * @param {Object} [config] The specific configurations to apply to this
	 *		editor instance. Configurations set here will override global CKEditor
	 *		settings.
	 * @returns {CKEDITOR.editor} The editor instance created.
	 * @example
	 * &lt;textarea id="myfield" name="myfield"&gt;&lt:/textarea&gt;
	 * ...
	 * <b>CKEDITOR.replace( 'myfield' )</b>;
	 * @example
	 * var textarea = document.body.appendChild( document.createElement( 'textarea' ) );
	 * <b>CKEDITOR.replace( textarea )</b>;
	 */
	CKEDITOR.replace = function( elementOrIdOrName, config ) {
		var element = elementOrIdOrName;

		// If the DOM element hasn't been provided, look for it based on its id or name.
		if ( typeof element != 'object' ) {
			// Look for the element by id. We accept any kind of element here.
			element = document.getElementById( elementOrIdOrName );

			// Elements that should go into head are unacceptable (#6791).
			if ( element && element.tagName.toLowerCase() in { style:1,script:1,base:1,link:1,meta:1,title:1 } )
				element = null;

			// If not found, look for elements by name. In this case we accept only
			// textareas.
			if ( !element ) {
				var i = 0,
					textareasByName = document.getElementsByName( elementOrIdOrName );

				while ( ( element = textareasByName[ i++ ] ) && element.tagName.toLowerCase() != 'textarea' ) {
	/*jsl:pass*/
				}
			}

			if ( !element )
				throw '[CKEDITOR.editor.replace] The element with id or name "' + elementOrIdOrName + '" was not found.';
		}

		// Do not replace the textarea right now, just hide it. The effective
		// replacement will be done later in the editor creation lifecycle.
		element.style.visibility = 'hidden';

		// Create the editor instance.
		var editor = new CKEDITOR.editor( config );

		// Set the editor instance name. It'll be set at CKEDITOR.add if it
		// remain null here.
		editor.name = element.id || element.name;

		// Add this new editor to the CKEDITOR.instances collections.
		CKEDITOR.add( editor );

		function initElement() {
			editor.element = element = CKEDITOR.dom.element.get( element );
			editor.elementMode = CKEDITOR.ELEMENT_MODE_REPLACE;
		}

		// Initialize the "element" property only if CKEDITOR is fully loaded
		// (so CKEDITOR.dom.element is available).
		if ( CKEDITOR.status == 'loaded' )
			initElement();
		else
			CKEDITOR.on( 'loaded', initElement );

		// Once the editor is loaded, start the UI.
		editor.on( 'loaded', function() {
			loadTheme( editor );
		});

		return init( editor );
	};

	/**
	 * Creates a new editor instance inside a specific DOM element.
	 * @param {Object|String} elementOrId The DOM element or its ID.
	 * @param {Object} [config] The specific configurations to apply to this
	 *		editor instance. Configurations set here will override global CKEditor
	 *		settings.
	 * @param {String} [data] Since 3.3. Initial value for the instance.
	 * @returns {CKEDITOR.editor} The editor instance created.
	 * @example
	 * &lt;div id="editorSpace"&gt;&lt:/div&gt;
	 * ...
	 * <b>CKEDITOR.appendTo( 'editorSpace' )</b>;
	 */
	CKEDITOR.appendTo = function( elementOrId, config, data ) {
		// TODO
	};

	/**
	 * Replace all &lt;textarea&gt; elements available in the document with
	 * editor instances.
	 * @example
	 * // Replace all &lt;textarea&gt; elements in the page.
	 * CKEDITOR.replaceAll();
	 * @example
	 * // Replace all &lt;textarea class="myClassName"&gt; elements in the page.
	 * CKEDITOR.replaceAll( 'myClassName' );
	 * @example
	 * // Selectively replace &lt;textarea&gt; elements, based on custom assertions.
	 * CKEDITOR.replaceAll( function( textarea, config )
	 *     {
	 *         // Custom code to evaluate the replace, returning false
	 *         // if it must not be done.
	 *         // It also passes the "config" parameter, so the
	 *         // developer can customize the instance.
	 *     } );
	 */
	CKEDITOR.replaceAll = function() {
		var textareas = document.getElementsByTagName( 'textarea' );

		for ( var i = 0; i < textareas.length; i++ ) {
			var config = null,
				textarea = textareas[ i ];

			// The "name" and/or "id" attribute must exist.
			if ( !textarea.name && !textarea.id )
				continue;

			if ( typeof arguments[ 0 ] == 'string' ) {
				// The textarea class name could be passed as the function
				// parameter.

				var classRegex = new RegExp( '(?:^|\\s)' + arguments[ 0 ] + '(?:$|\\s)' );

				if ( !classRegex.test( textarea.className ) )
					continue;
			} else if ( typeof arguments[ 0 ] == 'function' ) {
				// An assertion function could be passed as the function parameter.
				// It must explicitly return "false" to ignore a specific <textarea>.
				config = {};
				if ( arguments[ 0 ]( textarea, config ) === false )
					continue;
			}

			this.replace( textarea, config );
		}
	};

	/**
	 * Manages themes registration and loading.
	 * @namespace
	 * @augments CKEDITOR.resourceManager
	 * @example
	 */
	CKEDITOR.themes = new CKEDITOR.resourceManager( '../themes/', 'theme' );

	function init( editor ) {
		if ( CKEDITOR.env.isCompatible ) {
			CKEDITOR.loadFullCore && CKEDITOR.loadFullCore();
			return false;
		}
		return editor;
	}

	function loadTheme( editor ) {
		var theme = editor.config.theme || 'default';
		CKEDITOR.themes.load( theme, function() {
			/**
			 * The theme used by this editor instance.
			 * @name CKEDITOR.editor.prototype.theme
			 * @type CKEDITOR.theme
			 * @example
			 * alert( editor.theme );  "http://example.com/ckeditor/themes/default/" (e.g.)
			 */
			var editorTheme = editor.theme = CKEDITOR.themes.get( theme );
			editorTheme.path = CKEDITOR.themes.getPath( theme );
			editorTheme.build( editor );

			if ( editor.config.autoUpdateElement )
				attachToForm( editor );
		});
	}

	function attachToForm( editor ) {
		var element = editor.element;

		// If are replacing a textarea, we must
		if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && element.is( 'textarea' ) ) {
			var form = element.$.form && new CKEDITOR.dom.element( element.$.form );
			if ( form ) {
				function onSubmit() {
					editor.updateElement();
				}
				form.on( 'submit', onSubmit );

				// Setup the submit function because it doesn't fire the
				// "submit" event.
				if ( !form.$.submit.nodeName && !form.$.submit.length ) {
					form.$.submit = CKEDITOR.tools.override( form.$.submit, function( originalSubmit ) {
						return function() {
							editor.updateElement();

							// For IE, the DOM submit function is not a
							// function, so we need thid check.
							if ( originalSubmit.apply )
								originalSubmit.apply( this, arguments );
							else
								originalSubmit();
						};
					});
				}

				// Remove 'submit' events registered on form element before destroying.(#3988)
				editor.on( 'destroy', function() {
					form.removeListener( 'submit', onSubmit );
				});
			}
		}
	}

	function onload() {
		// Replace all textareas with the default class name.
		if ( CKEDITOR.replaceClass )
			CKEDITOR.replaceAll( CKEDITOR.replaceClass );
	}

	if ( window.addEventListener )
		window.addEventListener( 'load', onload, false );
	else if ( window.attachEvent )
		window.attachEvent( 'onload', onload );
})();

/**
 * No element is linked to the editor instance.
 * @constant
 * @example
 */
CKEDITOR.ELEMENT_MODE_NONE = 0;

/**
 * The element is to be replaced by the editor instance.
 * @constant
 * @example
 */
CKEDITOR.ELEMENT_MODE_REPLACE = 1;

/**
 * The editor is to be created inside the element.
 * @constant
 * @example
 */
CKEDITOR.ELEMENT_MODE_APPENDTO = 2;

/**
 * The theme to be used to build the UI.
 * @CKEDITOR.config.theme
 * @type String
 * @default 'default'
 * @example
 * config.theme = 'default';
 */

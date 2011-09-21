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

			if ( editor.config.autoUpdateElement )
				attachToForm( editor );
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
	 * Returns the DOM element that represents a theme space. The default theme defines
	 * three spaces, namely "top", "contents" and "bottom", representing the main
	 * blocks that compose the editor interface.
	 * @param {String} spaceName The space name.
	 * @returns {CKEDITOR.dom.element} The element that represents the space.
	 * @example
	 * // Hide the bottom space in the UI.
	 * var bottom = editor.getUISpace( 'bottom' );
	 * bottom.setStyle( 'display', 'none' );
	 */
	CKEDITOR.editor.prototype.getUISpace = function( spaceName ) {
		var spacePrefix = 'cke_' + spaceName;
		var space = this._[ spacePrefix ] || ( this._[ spacePrefix ] = CKEDITOR.document.getById( spacePrefix + '_' + this.name ) );
		return space;
	};

	/**
	 * Resizes the editor interface.
	 * @param {Number|String} width The new width. It can be an pixels integer or a
	 *		CSS size value.
	 * @param {Number|String} height The new height. It can be an pixels integer or
	 *		a CSS size value.
	 * @param {Boolean} [isContentHeight] Indicates that the provided height is to
	 *		be applied to the editor contents space, not to the entire editor
	 *		interface. Defaults to false.
	 * @param {Boolean} [resizeInner] Indicates that the first inner interface
	 *		element must receive the size, not the outer element. The default theme
	 *		defines the interface inside a pair of span elements
	 *		(&lt;span&gt;&lt;span&gt;...&lt;/span&gt;&lt;/span&gt;). By default the
	 *		first span element receives the sizes. If this parameter is set to
	 *		true, the second span is sized instead.
	 * @example
	 * editor.resize( 900, 300 );
	 * @example
	 * editor.resize( '100%', 450, true );
	 */
	CKEDITOR.editor.prototype.resize = function( width, height, isContentHeight, resizeInner ) {
		var container = this.container,
			contents = CKEDITOR.document.getById( 'cke_contents_' + this.name ),
			contentsFrame = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement,
			outer = resizeInner ? container.getChild( 1 ) : container;

		// Set as border box width. (#5353)
		outer.setSize( 'width', width, true );

		// WebKit needs to refresh the iframe size to avoid rendering issues. (1/2) (#8348)
		contentsFrame && ( contentsFrame.style.width = '1%' );

		// Get the height delta between the outer table and the content area.
		// If we're setting the content area's height, then we don't need the delta.
		var delta = isContentHeight ? 0 : ( outer.$.offsetHeight || 0 ) - ( contents.$.clientHeight || 0 );
		contents.setStyle( 'height', Math.max( height - delta, 0 ) + 'px' );

		// WebKit needs to refresh the iframe size to avoid rendering issues. (2/2) (#8348)
		contentsFrame && ( contentsFrame.style.width = '100%' );

		// Emit a resize event.
		this.fire( 'resize' );
	};

	/**
	 * Gets the element that can be freely used to check the editor size. This method
	 * is mainly used by the resize plugin, which adds a UI handle that can be used
	 * to resize the editor.
	 * @param {Boolean} forContents Whether to return the "contents" part of the theme instead of the container.
	 * @returns {CKEDITOR.dom.element} The resizable element.
	 * @example
	 */
	CKEDITOR.editor.prototype.getResizable = function( forContents ) {
		return forContents ? CKEDITOR.document.getById( 'cke_contents_' + this.name ) : this.container;
	};

	function init( editor ) {
		if ( CKEDITOR.env.isCompatible ) {
			CKEDITOR.loadFullCore && CKEDITOR.loadFullCore();
			return false;
		}

		editor.on( 'destroy', destroy );

		return editor;
	}

	function destroy() {
		var editor = this,
			container = editor.container,
			element = editor.element;

		if ( container ) {
			container.clearCustomData();
			container.remove();
		}

		if ( element ) {
			element.clearCustomData();
			editor.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && element.show();
			delete editor.element;
		}
	}

	var hiddenSkins = {};

	function loadTheme( editor ) {
		var name = editor.name,
			element = editor.element,
			elementMode = editor.elementMode;

		// Get the HTML for the predefined spaces.
		var topHtml = editor.fire( 'uiSpace', { space: 'top', html: '' } ).html;
		var contentsHtml = editor.fire( 'uiSpace', { space: 'contents', html: '' } ).html;
		var bottomHtml = editor.fireOnce( 'uiSpace', { space: 'bottom', html: '' } ).html;

		var height = contentsHtml && editor.config.height;

		var tabIndex = editor.config.tabIndex || editor.element.getAttribute( 'tabindex' ) || 0;

		// The editor height is considered only if the contents space got filled.
		if ( !contentsHtml )
			height = 'auto';
		else if ( !isNaN( height ) )
			height += 'px';

		var style = '';
		var width = editor.config.width;

		if ( width ) {
			if ( !isNaN( width ) )
				width += 'px';

			style += 'width:{width};';
		}

		var hideSkin = '<style>.' + editor.skinClass + '{visibility:hidden;}</style>';
		if ( hiddenSkins[ editor.skinClass ] )
			hideSkin = '';
		else
			hiddenSkins[ editor.skinClass ] = 1;

		var template = editor.addTemplate( 'maincontainer', '<span' +
			' id="cke_{name}"' +
			' class="{skinClass} {id} cke_editor_{name}"' +
			' dir="{langDir}"' +
			' title="' + ( CKEDITOR.env.gecko ? ' ' : '' ) + '"' +
			' lang="{langCode}"' +
			( CKEDITOR.env.webkit ? ' tabindex="{tabIndex}"' : '' ) +
			' role="application"' +
			' aria-labelledby="cke_{name}_arialbl"' +
			( style ? ' style="' + style + '"' : '' ) +
			'>' +
			'<span id="cke_{name}_arialbl" class="cke_voice_label">' + editor.lang.editor + '</span>' +
			'<span class="' + CKEDITOR.env.cssClass + '" role="presentation">' +
				'<span class="cke_wrapper cke_{langDir}" role="presentation">' +
					'<table class="cke_editor" border="0" cellspacing="0" cellpadding="0" role="presentation"><tbody>' +
						'<tr' + ( topHtml ? '' : ' style="display:none"' ) + ' role="presentation"><td id="cke_top_{name}" class="cke_top" role="presentation">{topHtml}</td></tr>' +
						'<tr' + ( contentsHtml ? '' : ' style="display:none"' ) + ' role="presentation"><td id="cke_contents_{name}" class="cke_contents" style="height:{height}" role="presentation">{contentsHtml}</td></tr>' +
						'<tr' + ( bottomHtml ? '' : ' style="display:none"' ) + ' role="presentation"><td id="cke_bottom_{name}" class="cke_bottom" role="presentation">{bottomHtml}</td></tr>' +
					'</tbody></table>' +
					//Hide the container when loading skins, later restored by skin css.
							hideSkin +
				'</span>' +
			'</span>' +
			'</span>' );

		var container = CKEDITOR.dom.element.createFromHtml( template.output({
			id: editor.id,
			name: name,
			skinClass: editor.skinClass,
			langDir: editor.lang.dir,
			langCode: editor.langCode,
			tabIndex: tabIndex,
			topHtml: topHtml,
			contentsHtml: contentsHtml,
			bottomHtml: bottomHtml,
			height: height,
			width: width
		}));

		// TODO: Replace the following with direct element ID selector to support user customizations.
		container.getChild( [ 1, 0, 0, 0, 0 ] ).unselectable();
		container.getChild( [ 1, 0, 0, 0, 2 ] ).unselectable();

		if ( elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ) {
			element.hide();
			container.insertAfter( element );
		} else
			element.append( container );

		/**
		 * The DOM element that holds the main editor interface.
		 * @name CKEDITOR.editor.prototype.container
		 * @type CKEDITOR.dom.element
		 * @example
		 * var editor = CKEDITOR.instances.editor1;
		 * alert( <b>editor.container</b>.getName() );  "span"
		 */
		editor.container = container;

		// Disable browser context menu for editor's chrome.
		container.disableContextMenu();

		// Use a class to indicate that the current selection is in different direction than the UI.
		editor.on( 'contentDirChanged', function( evt ) {
			var func = ( editor.lang.dir != evt.data ? 'add' : 'remove' ) + 'Class';

			container.getChild( 1 )[ func ]( 'cke_mixed_dir_content' );

			// Put the mixed direction class on the respective element also for shared spaces.
			var toolbarSpace = this.sharedSpaces && this.sharedSpaces[ this.config.toolbarLocation ];
			toolbarSpace && toolbarSpace.getParent().getParent()[ func ]( 'cke_mixed_dir_content' );
		});

		editor.fireOnce( 'themeLoaded' );
		editor.fireOnce( 'uiReady' );
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
 * Fired after the editor instance is resized through
 * the {@link CKEDITOR.editor.prototype.resize} method.
 * @name CKEDITOR.editor#resize
 * @event
 */

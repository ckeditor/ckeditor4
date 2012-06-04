/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
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

		element = CKEDITOR.dom.element.get( element );
		// Do not replace the textarea right now, just hide it. The effective
		// replacement will be done later in the editor creation lifecycle.
		element.setStyle( 'visibility', 'hidden' );

		// Create the editor instance.
		var editor = new CKEDITOR.editor( config );

		// Set the editor instance name. It'll be set at CKEDITOR.add if it
		// remain null here.
		editor.name = element.getId() || element.getAttribute( 'name' );

		// Add this new editor to the CKEDITOR.instances collections.
		CKEDITOR.add( editor );

		editor.element = element;
		editor.elementMode = CKEDITOR.ELEMENT_MODE_REPLACE;

		// Once the editor is loaded, start the UI.
		editor.on( 'loaded', function() {
			loadTheme( editor );

			if ( editor.config.autoUpdateElement )
				attachToForm( editor );

			editor.setMode( editor.config.startupMode, function() {
				// Editor is completely loaded for interaction.
				editor.fireOnce( 'instanceReady' );
				CKEDITOR.fire( 'instanceReady', null, editor );

				// Clean on startup.
				editor.resetDirty();
			});

		});

		editor.on( 'destroy', destroy );
		return editor;
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
	 * Registers an editing mode. This function is to be used mainly by plugins.
	 * @param {String} mode The mode name.
	 * @param {Function} exec Function that perform the actual mode change.
	 * @example
	 */
	CKEDITOR.editor.prototype.addMode = function( mode, exec ) {
		( this._.modes || ( this._.modes = {} ) )[ mode ] = exec;
	};

	/**
	 * Change the editing mode of this editor instance.
	 * <strong>Note:</strong> The mode switch could be asynchronous depending on the mode provider,
	 * use the {@param callback} to hook subsequent code.
	 * @param {String} [newMode] If not specified the {@link CKEDITOR.config.startupMode} will be used.
	 * @param {Function} [callback] Optional callback function which invoked once the mode switch has succeeded.
	 * @example
	 * // Switch to "source" view.
	 * CKEDITOR.instances.editor1.setMode( 'source' );
	 * // Switch to "wysiwyg" and be noticed on completed.
	 * CKEDITOR.instances.editor1.setMode( 'wysiwyg', function(){ alert( 'wysiwyg mode loaded!' );} );
	 */
	CKEDITOR.editor.prototype.setMode = function( newMode, callback ) {
		var editor = this;

		var modes = this._.modes;

		// Mode loading quickly fails.
		if ( newMode == editor.mode || !modes || !modes[ newMode ] )
			return;

		editor.fire( 'beforeSetMode', newMode );

		if ( editor.mode ) {
			var isDirty = editor.checkDirty();

			editor._.previousMode = editor.mode;

			editor.fire( 'beforeModeUnload' );

			// Detach the current editable.
			editor.editable( 0 );

			editor.mode = '';
		}

		// Fire the mode handler.
		this._.modes[ newMode ]( function() {
			// Set the current mode.
			editor.mode = newMode;
			editor.fire( 'mode' );

			if ( isDirty !== undefined ) {
				// The editor data "may be dirty" after this point.
				editor.mayBeDirty = true;
				!isDirty && editor.resetDirty();
			}

			callback && callback.call( editor );
		});
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
			contents = this.ui.space( 'contents' ),
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
		return forContents ? this.ui.space( 'contents' ) : this.container;
	};

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

	var themedTpl = CKEDITOR.addTemplate( 'maincontainer', '<div' +
		' id="cke_{name}"' +
		' class="{id} cke cke_chrome cke_editor_{name}"' +
		' dir="{langDir}"' +
		' lang="{langCode}"' +
		' role="application"' +
		' aria-labelledby="cke_{name}_arialbl" {style}>' +
		'<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' +
		'<div class="' + CKEDITOR.env.cssClass + '" role="presentation">' +
			'<div class="cke_{langDir}" role="presentation">' +
				'<div class="cke_inner" role="presentation">' +
					'<div id="{topId}" class="cke_top"' +
					' role="presentation" style="height:auto">{topHtml}</div>' +
					'<div id="{contentId}" class="cke_contents"' +
					' role="presentation" style="height:{height}"></div>' +
					'<div id="{bottomId}" class="cke_bottom" role="presentation">{bottomHtml}</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'</div>' );


	function loadTheme( editor ) {
		var name = editor.name,
			element = editor.element,
			elementMode = editor.elementMode;

		// Get the HTML for the predefined spaces.
		var topHtml = editor.fire( 'uiSpace', { space: 'top', html: '' } ).html;
		var bottomHtml = editor.fireOnce( 'uiSpace', { space: 'bottom', html: '' } ).html;

		var height = editor.config.height;

		// The editor height is considered only if the contents space got filled.
		if ( !isNaN( height ) )
			height += 'px';

		var style = '';
		var width = editor.config.width;

		if ( !isNaN( width ) )
			style += 'width:' + width + 'px;';

		var container = CKEDITOR.dom.element.createFromHtml( themedTpl.output({
			id: editor.id,
			name: name,
			langDir: editor.lang.dir,
			langCode: editor.langCode,
			voiceLabel: editor.lang.editor,
			style: ( style ? ' style="' + style + '"' : '' ),
			height: height,
			topId: editor.ui.spaceId( 'top' ),
			topHtml: topHtml || '',
			contentId: editor.ui.spaceId( 'contents' ),
			bottomId: editor.ui.spaceId( 'bottom' ),
			bottomHtml: bottomHtml || ''
		}));

		var topSpace = editor.ui.space( 'top' ),
			bottomSpace = editor.ui.space( 'bottom' );

		topSpace && topSpace.unselectable();
		bottomSpace && bottomSpace.unselectable();

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

		// Redirect the focus into editor for webkit. (#5713)
		CKEDITOR.env.webkit && container.on( 'focus', function() {
			editor.focus();
		});

		// Use a class to indicate that the current selection is in different direction than the UI.
		editor.on( 'contentDirChanged', function( evt ) {
			var func = ( editor.lang.dir != evt.data ? 'add' : 'remove' ) + 'Class';

			container.getChild( 1 )[ func ]( 'cke_mixed_dir_content' );

			// Put the mixed direction class on the respective element also for shared spaces.
			var toolbarSpace = this.sharedSpaces && this.sharedSpaces[ this.config.toolbarLocation ];
			toolbarSpace && toolbarSpace.getParent().getParent()[ func ]( 'cke_mixed_dir_content' );
		});

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
							// function, so we need third check.
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

	// Replace all textareas with the default class name.
	CKEDITOR.domReady( function() {
		CKEDITOR.replaceClass && CKEDITOR.replaceAll( CKEDITOR.replaceClass )
	});
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
 * The current editing mode. An editing mode basically provides
 * different ways of editing or viewing the contents.
 * @nameCKEDITOR.editor.prototype.mode
 * @type String
 * @example
 * alert( CKEDITOR.instances.editor1.mode );  // "wysiwyg" (e.g.)
 */

/**
 * The mode to load at the editor startup. It depends on the plugins
 * loaded. By default, the "wysiwyg" and "source" modes are available.
 * @name CKEDITOR.config.startupMode
 * @type String
 * @default 'wysiwyg'
 * @example
 * config.startupMode = 'source';
 */
CKEDITOR.config.startupMode = 'wysiwyg';

/**
 * Fired after the editor instance is resized through
 * the {@link CKEDITOR.editor.prototype.resize} method.
 * @name CKEDITOR.editor#resize
 * @event
 */

/**
 * Event fired before changing the editing mode. See also CKEDITOR.editor#beforeSetMode and CKEDITOR.editor#mode
 * @name CKEDITOR.editor#beforeModeUnload
 * @event
 */

/**
 * Event fired before the editor mode is set. See also CKEDITOR.editor#mode and CKEDITOR.editor#beforeModeUnload
 * @name CKEDITOR.editor#beforeSetMode
 * @event
 * @since 3.5.3
 * @param {String} newMode The name of the mode which is about to be set.
 */

/**
 * Fired after setting the editing mode. See also CKEDITOR.editor#beforeSetMode and CKEDITOR.editor#beforeModeUnload
 * @name CKEDITOR.editor#mode
 * @event
 * @param {String} previousMode The previous mode of the editor.
 */

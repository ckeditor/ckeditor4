/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/** @class CKEDITOR */

/**
 * The class name used to identify `<textarea>` elements to be replaced
 * by CKEditor instances. Set it to empty/`null` to disable this feature.
 *
 *		CKEDITOR.replaceClass = 'rich_editor';
 *
 * @cfg {String} [replaceClass='ckeditor']
 */
CKEDITOR.replaceClass = 'ckeditor';

( function() {
	/**
	 * Replaces a `<textarea>` or a DOM element (`<div>`) with a CKEditor
	 * instance. For textareas, the initial value in the editor will be the
	 * textarea value. For DOM elements, their `innerHTML` will be used
	 * instead. It is recommended to use `<textarea>` and `<div>` elements only.
	 *
	 *		<textarea id="myfield" name="myfield"></textarea>
	 *		...
	 *		CKEDITOR.replace( 'myfield' );
	 *
	 *		var textarea = document.body.appendChild( document.createElement( 'textarea' ) );
	 *		CKEDITOR.replace( textarea );
	 *
	 * @param {Object/String} element The DOM element (textarea), its ID, or name.
	 * @param {Object} [config] The specific configuration to apply to this
	 * editor instance. Configuration set here will override the global CKEditor settings
	 * (see {@link CKEDITOR.config}).
	 * @returns {CKEDITOR.editor} The editor instance created.
	 */
	CKEDITOR.replace = function( element, config ) {
		return createInstance( element, config, null, CKEDITOR.ELEMENT_MODE_REPLACE );
	};

	/**
	 * Creates a new editor instance at the end of a specific DOM element.
	 *
	 *		<!DOCTYPE html>
	 * 		<html>
	 * 			<head>
	 * 				<meta charset="utf-8">
	 * 				<title>CKEditor</title>
	 * 				<!-- Make sure the path to CKEditor is correct. -->
	 *				<script src="/ckeditor/ckeditor.js"></script>
	 *			</head>
	 *			<body>
	 *				<div id="editorSpace"></div>
	 *				<script>
	 *					CKEDITOR.appendTo( 'editorSpace' );
	 *				</script>
	 *			</body>
	 *		</html>
	 *
	 * @param {Object/String} element The DOM element, its ID, or name.
	 * @param {Object} [config] The specific configuration to apply to this
	 * editor instance. Configuration set here will override the global CKEditor settings
	 * (see {@link CKEDITOR.config}).
	 * @param {String} [data] Since 3.3. Initial value for the instance.
	 * @returns {CKEDITOR.editor} The editor instance created.
	 */
	CKEDITOR.appendTo = function( element, config, data ) {
		return createInstance( element, config, data, CKEDITOR.ELEMENT_MODE_APPENDTO );
	};

	/**
	 * Replaces all `<textarea>` elements available in the document with
	 * editor instances.
	 *
	 *		// Replace all <textarea> elements in the page.
	 *		CKEDITOR.replaceAll();
	 *
	 *		// Replace all <textarea class="myClassName"> elements in the page.
	 *		CKEDITOR.replaceAll( 'myClassName' );
	 *
	 *		// Selectively replace <textarea> elements, based on a custom evaluation function.
	 *		CKEDITOR.replaceAll( function( textarea, config ) {
	 *			// A function that needs to be evaluated for the <textarea>
	 *			// to be replaced. It must explicitly return "false" to ignore a
	 *			// specific <textarea>.
	 *			// You can also customize the editor instance by having the function
	 *			// modify the "config" parameter.
	 *		} );
	 *
	 *		// Full page example where three <textarea> elements are replaced.
	 *		<!DOCTYPE html>
	 *		<html>
	 *			<head>
	 *				<meta charset="utf-8">
	 *				<title>CKEditor</title>
	 *				<!-- Make sure the path to CKEditor is correct. -->
	 *				<script src="/ckeditor/ckeditor.js"></script>
	 *			</head>
	 *			<body>
	 *				<textarea name="editor1"></textarea>
	 *				<textarea name="editor2"></textarea>
	 *				<textarea name="editor3"></textarea>
	 *				<script>
	 *					// Replace all three <textarea> elements above with CKEditor instances.
	 *					CKEDITOR.replaceAll();
	 *				</script>
	 *			</body>
	 *		</html>
	 *
	 * @param {String} [className] The `<textarea>` class name.
	 * @param {Function} [evaluator] An evaluation function that must return `true` for a `<textarea>`
	 * to be replaced with the editor. If the function returns `false`, the `<textarea>` element
	 * will not be replaced.
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
				// An evaluation function could be passed as the function parameter.
				// It must explicitly return "false" to ignore a specific <textarea>.
				config = {};
				if ( arguments[ 0 ]( textarea, config ) === false )
					continue;
			}

			this.replace( textarea, config );
		}
	};

	/** @class CKEDITOR.editor */

	/**
	 * Registers an editing mode. This function is to be used mainly by plugins.
	 *
	 * @param {String} mode The mode name.
	 * @param {Function} exec The function that performs the actual mode change.
	 */
	CKEDITOR.editor.prototype.addMode = function( mode, exec ) {
		( this._.modes || ( this._.modes = {} ) )[ mode ] = exec;
	};

	/**
	 * Changes the editing mode of this editor instance.
	 *
	 * **Note:** The mode switch could be asynchronous depending on the mode provider.
	 * Use the `callback` to hook subsequent code.
	 *
	 *		// Switch to "source" view.
	 *		CKEDITOR.instances.editor1.setMode( 'source' );
	 *		// Switch to "wysiwyg" view and be notified on completion.
	 *		CKEDITOR.instances.editor1.setMode( 'wysiwyg', function() { alert( 'wysiwyg mode loaded!' ); } );
	 *
	 * @param {String} [newMode] If not specified, the {@link CKEDITOR.config#startupMode} will be used.
	 * @param {Function} [callback] Optional callback function which is invoked once the mode switch has succeeded.
	 */
	CKEDITOR.editor.prototype.setMode = function( newMode, callback ) {
		var editor = this;

		var modes = this._.modes;

		// Mode loading quickly fails.
		if ( newMode == editor.mode || !modes || !modes[ newMode ] )
			return;

		editor.fire( 'beforeSetMode', newMode );

		if ( editor.mode ) {
			var isDirty = editor.checkDirty(),
				previousModeData = editor._.previousModeData,
				currentData,
				unlockSnapshot = 0;

			editor.fire( 'beforeModeUnload' );

			// Detach the current editable. While detaching editable will set
			// cached editor's data (with internal setData call). We use this
			// data below to avoid two getData() calls in a row.
			editor.editable( 0 );

			editor._.previousMode = editor.mode;
			// Get cached data, which was set while detaching editable.
			editor._.previousModeData = currentData = editor.getData( 1 );

			// If data has not been modified in the mode which we are currently leaving,
			// avoid making snapshot right after initializing new mode.
			// https://dev.ckeditor.com/ticket/5217#comment:20
			// Tested by:
			// 'test switch mode with unrecoreded, inner HTML specific content (boguses)'
			// 'test switch mode with unrecoreded, inner HTML specific content (boguses) plus changes in source mode'
			if ( editor.mode == 'source' && previousModeData == currentData ) {
				// We need to make sure that unlockSnapshot will update the last snapshot
				// (will not create new one) if lockSnapshot is not called on outdated snapshots stack.
				// Additionally, forceUpdate prevents from making content image now, which is useless
				// (because it equals editor data not inner HTML).
				editor.fire( 'lockSnapshot', { forceUpdate: true } );
				unlockSnapshot = 1;
			}

			// Clear up the mode space.
			editor.ui.space( 'contents' ).setHtml( '' );

			editor.mode = '';
		} else {
			editor._.previousModeData = editor.getData( 1 );
		}

		// Fire the mode handler.
		this._.modes[ newMode ]( function() {
			// Set the current mode.
			editor.mode = newMode;

			if ( isDirty !== undefined )
				!isDirty && editor.resetDirty();

			if ( unlockSnapshot )
				editor.fire( 'unlockSnapshot' );
			// Since snapshot made on dataReady (which normally catches changes done by setData)
			// won't work because editor.mode was not set yet (it's set in this function), we need
			// to make special snapshot for changes done in source mode here.
			else if ( newMode == 'wysiwyg' )
				editor.fire( 'saveSnapshot' );

			// Delay to avoid race conditions (setMode inside setMode).
			setTimeout( function() {
				if ( editor.isDestroyed() || editor.isDetached() ) {
					return;
				}
				editor.fire( 'mode' );
				callback && callback.call( editor );
			}, 0 );
		} );
	};

	/**
	 * Resizes the editor interface.
	 *
	 * **Note:** Since 4.14.1 this method accepts numeric or absolute CSS length units.
	 *
	 * ```javascript
	 *	editor.resize( 900, 300 );
	 *
	 *	editor.resize( '5in', 450, true );
	 * ```
	 *
	 * @param {Number/String} width The new width. It can be an integer denoting a value
	 * in pixels or a CSS size value with unit.
	 * @param {Number/String} height The new height. It can be an integer denoting a value
	 * in pixels or a CSS size value with unit.
	 * @param {Boolean} [isContentHeight] Indicates that the provided height is to
	 * be applied to the editor content area, and not to the entire editor
	 * interface. Defaults to `false`.
	 * @param {Boolean} [resizeInner] Indicates that it is the inner interface
	 * element that must be resized, not the outer element. The default theme
	 * defines the editor interface inside a pair of `<span>` elements
	 * (`<span><span>...</span></span>`). By default the first,
	 * outer `<span>` element receives the sizes. If this parameter is set to
	 * `true`, the second, inner `<span>` is resized instead.
	 */
	CKEDITOR.editor.prototype.resize = function( width, height, isContentHeight, resizeInner ) {
		var container = this.container,
			contents = this.ui.space( 'contents' ),
			contentsFrame = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement,
			outer;

		if ( resizeInner ) {
			outer = this.container.getFirst( function( node ) {
				return node.type == CKEDITOR.NODE_ELEMENT && node.hasClass( 'cke_inner' );
			} );
		} else {
			outer = container;
		}

		if ( width || width === 0 ) {
			width = convertCssUnitToPx( width );
		}

		// Set as border box width. (https://dev.ckeditor.com/ticket/5353)
		outer.setSize( 'width', width, true );

		// WebKit needs to refresh the iframe size to avoid rendering issues. (1/2) (https://dev.ckeditor.com/ticket/8348)
		contentsFrame && ( contentsFrame.style.width = '1%' );

		height = convertCssUnitToPx( height );

		// Get the height delta between the outer table and the content area.
		var contentsOuterDelta = ( outer.$.offsetHeight || 0 ) - ( contents.$.clientHeight || 0 ),

		// If we're setting the content area's height, then we don't need the delta.
			resultContentsHeight = Math.max( height - ( isContentHeight ? 0 : contentsOuterDelta ), 0 ),
			resultOuterHeight = ( isContentHeight ? height + contentsOuterDelta : height );

		contents.setStyle( 'height', CKEDITOR.tools.cssLength( resultContentsHeight ) );

		// WebKit needs to refresh the iframe size to avoid rendering issues. (2/2) (https://dev.ckeditor.com/ticket/8348)
		contentsFrame && ( contentsFrame.style.width = '100%' );

		// Emit a resize event.
		this.fire( 'resize', {
			outerHeight: resultOuterHeight,
			contentsHeight: resultContentsHeight,
			// Sometimes width is not provided.
			outerWidth: width || outer.getSize( 'width' )
		} );
	};

	/**
	 * Gets the element that can be used to check the editor size. This method
	 * is mainly used by the [Editor Resize](https://ckeditor.com/cke4/addon/resize) plugin, which adds
	 * a UI handle that can be used to resize the editor.
	 *
	 * @param {Boolean} forContents Whether to return the "contents" part of the theme instead of the container.
	 * @returns {CKEDITOR.dom.element} The resizable element.
	 */
	CKEDITOR.editor.prototype.getResizable = function( forContents ) {
		return forContents ? this.ui.space( 'contents' ) : this.container;
	};

	function convertCssUnitToPx( unit ) {
		return CKEDITOR.tools.convertToPx( CKEDITOR.tools.cssLength( unit ) );
	}

	function createInstance( element, config, data, mode ) {
		element = CKEDITOR.editor._getEditorElement( element );

		if ( !element ) {
			return null;
		}

		// Create the editor instance.
		var editor = new CKEDITOR.editor( config, element, mode );

		if ( mode == CKEDITOR.ELEMENT_MODE_REPLACE ) {
			// Do not replace the textarea right now, just hide it. The effective
			// replacement will be done later in the editor creation lifecycle.
			element.setStyle( 'visibility', 'hidden' );

			// https://dev.ckeditor.com/ticket/8031 Remember if textarea was required and remove the attribute.
			editor._.required = element.hasAttribute( 'required' );
			element.removeAttribute( 'required' );
		}

		data && editor.setData( data, null, true );

		// Once the editor is loaded, start the UI.
		editor.on( 'loaded', function() {
			if ( editor.isDestroyed() || editor.isDetached() ) {
				return;
			}

			loadTheme( editor );

			if ( mode == CKEDITOR.ELEMENT_MODE_REPLACE && editor.config.autoUpdateElement && element.$.form )
				editor._attachToForm();

			editor.setMode( editor.config.startupMode, function() {
				// Clean on startup.
				editor.resetDirty();

				// Editor is completely loaded for interaction.
				editor.status = 'ready';
				editor.fireOnce( 'instanceReady' );
				CKEDITOR.fire( 'instanceReady', null, editor );
			} );
		} );

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
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ) {
				element.show();
				if ( editor._.required )
					element.setAttribute( 'required', 'required' );
			}
			delete editor.element;
		}
	}

	function loadTheme( editor ) {
		var name = editor.name,
			element = editor.element,
			elementMode = editor.elementMode;

		// Get the HTML for the predefined spaces.
		var topHtml = editor.fire( 'uiSpace', { space: 'top', html: '' } ).html;
		var bottomHtml = editor.fire( 'uiSpace', { space: 'bottom', html: '' } ).html;

		var themedTpl = new CKEDITOR.template(
			'<{outerEl}' +
				' id="cke_{name}"' +
				' class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '" ' +
				' dir="{langDir}"' +
				' lang="{langCode}"' +
				' role="application"' +
				( editor.title ? ' aria-labelledby="cke_{name}_arialbl"' : '' ) +
				'>' +
				( editor.title ? '<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' : '' ) +
				'<{outerEl} class="cke_inner cke_reset" role="presentation">' +
					'{topHtml}' +
					'<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>' +
					'{bottomHtml}' +
				'</{outerEl}>' +
			'</{outerEl}>' );

		var container = CKEDITOR.dom.element.createFromHtml( themedTpl.output( {
			id: editor.id,
			name: name,
			langDir: editor.lang.dir,
			langCode: editor.langCode,
			voiceLabel: editor.title,
			topHtml: topHtml ? '<span id="' + editor.ui.spaceId( 'top' ) + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + topHtml + '</span>' : '',
			contentId: editor.ui.spaceId( 'contents' ),
			bottomHtml: bottomHtml ? '<span id="' + editor.ui.spaceId( 'bottom' ) + '" class="cke_bottom cke_reset_all" role="presentation">' + bottomHtml + '</span>' : '',
			outerEl: CKEDITOR.env.ie ? 'span' : 'div'	// https://dev.ckeditor.com/ticket/9571
		} ) );

		if ( elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ) {
			element.hide();
			container.insertAfter( element );
		} else {
			element.append( container );
		}

		editor.container = container;
		editor.ui.contentsElement = editor.ui.space( 'contents' );

		// Make top and bottom spaces unelectable, but not content space,
		// otherwise the editable area would be affected.
		topHtml && editor.ui.space( 'top' ).unselectable();
		bottomHtml && editor.ui.space( 'bottom' ).unselectable();

		var width = editor.config.width, height = editor.config.height;
		if ( width )
			container.setStyle( 'width', CKEDITOR.tools.cssLength( width ) );

		// The editor height is applied to the contents space.
		if ( height )
			editor.ui.space( 'contents' ).setStyle( 'height', CKEDITOR.tools.cssLength( height ) );

		// Disable browser context menu for editor's chrome.
		container.disableContextMenu();

		// Redirect the focus into editor for webkit. (https://dev.ckeditor.com/ticket/5713)
		CKEDITOR.env.webkit && container.on( 'focus', function() {
			editor.focus();
		} );

		editor.fireOnce( 'uiReady' );
	}

	// Replace all textareas with the default class name.
	CKEDITOR.domReady( function() {
		CKEDITOR.replaceClass && CKEDITOR.replaceAll( CKEDITOR.replaceClass );
	} );
} )();

/**
 * The current editing mode. An editing mode basically provides
 * different ways of editing or viewing the editor content.
 *
 *		alert( CKEDITOR.instances.editor1.mode ); // (e.g.) 'wysiwyg'
 *
 * @readonly
 * @property {String} mode
 */

/**
 * The mode to load at the editor startup. It depends on the plugins
 * loaded. By default, the `wysiwyg` and `source` modes are available.
 *
 *		config.startupMode = 'source';
 *
 * @cfg {String} [startupMode='wysiwyg']
 * @member CKEDITOR.config
 */
CKEDITOR.config.startupMode = 'wysiwyg';

/**
 * Fired after the editor instance is resized through
 * the {@link CKEDITOR.editor#method-resize CKEDITOR.resize} method.
 *
 * @event resize
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {Object} data Available since CKEditor 4.5.0.
 * @param {Number} data.outerHeight The height of the entire area that the editor covers.
 * @param {Number} data.contentsHeight Editable area height in pixels.
 * @param {Number} data.outerWidth The width of the entire area that the editor covers.
 */

/**
 * Fired before changing the editing mode. See also
 * {@link #beforeSetMode} and {@link #event-mode}.
 *
 * @event beforeModeUnload
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired before the editor mode is set. See also
 * {@link #event-mode} and {@link #beforeModeUnload}.
 *
 * @since 3.5.3
 * @event beforeSetMode
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} data The name of the mode which is about to be set.
 */

/**
 * Fired after setting the editing mode. See also {@link #beforeSetMode} and {@link #beforeModeUnload}
 *
 * @event mode
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired when the editor (replacing a `<textarea>` which has a `required` attribute) is empty during form submission.
 *
 * This event replaces native required fields validation that the browsers cannot
 * perform when CKEditor replaces `<textarea>` elements.
 *
 * You can cancel this event to prevent the page from submitting data.
 *
 *		editor.on( 'required', function( evt ) {
 *			alert( 'Article content is required.' );
 *			evt.cancel();
 *		} );
 *
 * @event required
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired when the UI space is created. This event allows to modify the top bar or the bottom bar with additional HTML.
 *
 * For example, it is used in the [Editor Resize](https://ckeditor.com/cke4/addon/resize) plugin
 * to add the HTML element used to resize the editor.
 *
 * @event uiSpace
 * @param {Object} data
 * @param {String} data.space The name of the {@link CKEDITOR.ui#space space} for which the event is fired.
 * @param {String} data.html HTML string which will be included in the given space.
 */

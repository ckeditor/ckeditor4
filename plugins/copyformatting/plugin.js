/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var indexOf = CKEDITOR.tools.indexOf,
		getMouseButton = CKEDITOR.tools.getMouseButton,
		// This flag prevents appending stylesheet more than once.
		stylesLoaded = false;

	// Searches for given node in given query. It also checks ancestors of elements in the range.
	function getNodeAndApplyCmd( range, query, cmd, stopOnFirst ) {
		var walker = new CKEDITOR.dom.walker( range ),
			currentNode;

		// Walker sometimes does not include all nodes (e.g. if the range is in the middle of text node).
		if ( ( currentNode = range.startContainer.getAscendant( query, true ) ||
			range.endContainer.getAscendant( query, true ) ) ) {
			cmd( currentNode );

			if ( stopOnFirst ) {
				return;
			}
		}

		while ( currentNode = walker.next() ) {
			currentNode = currentNode.getAscendant( query, true );

			if ( currentNode ) {
				cmd( currentNode );

				if ( stopOnFirst ) {
					return;
				}
			}
		}
	}

	// Checks if there is style for specified element in the given array.
	function checkForStyle( element, styles ) {
		// Some elements are treated interchangeably, e.g. lists.
		var stylesAlternatives = {
			ul: 'ol',
			ol: 'ul'
		};

		return indexOf( styles, function( style ) {
			return style.element === element || style.element === stylesAlternatives[ element ];
		} ) !== -1;
	}

	CKEDITOR.plugins.add( 'copyformatting', {
		lang: 'ar,az,bg,cs,da,de,el,en,en-au,eo,es-mx,et,eu,fa,fr,gl,hr,hu,it,ja,ko,ku,lv,nb,nl,oc,pl,pt,pt-br,ro,ru,sk,sq,sr,sr-latn,sv,tr,uk,vi,zh,zh-cn',
		icons: 'copyformatting',
		hidpi: true,

		init: function( editor ) {
			var plugin = CKEDITOR.plugins.copyformatting;

			plugin._addScreenReaderContainer();

			if ( !stylesLoaded ) {
				CKEDITOR.document.appendStyleSheet( this.path + 'styles/copyformatting.css' );
				stylesLoaded = true;
			}

			// Add copyformatting stylesheet.
			if ( editor.addContentsCss ) {
				editor.addContentsCss( this.path + 'styles/copyformatting.css' );
			}

			/**
			 * Current state of the Copy Formatting plugin in this editor instance.
			 *
			 * @since 4.6.0
			 * @property {CKEDITOR.plugins.copyformatting.state} copyFormatting
			 * @member CKEDITOR.editor
			 */
			editor.copyFormatting = new plugin.state( editor );

			editor.addCommand( 'copyFormatting', plugin.commands.copyFormatting );
			editor.addCommand( 'applyFormatting', plugin.commands.applyFormatting );

			editor.ui.addButton( 'CopyFormatting', {
				label: editor.lang.copyformatting.label,
				command: 'copyFormatting',
				toolbar: 'cleanup,0'
			} );

			editor.on( 'contentDom', function() {
				var cmd = editor.getCommand( 'copyFormatting' ),
					editable = editor.editable(),
					// Host element for apply formatting click. In case of classic element it needs to be entire
					// document, otherwise clicking in body margins would not trigger the event.
					// Editors with divarea plugin enabled should be treated like inline one – otherwise
					// clicking the whole document messes the focus.
					mouseupHost = editable.isInline() ? editable : editor.document,
					copyFormattingButton = editor.ui.get( 'CopyFormatting' ),
					copyFormattingButtonEl;

				editable.attachListener( mouseupHost, 'mouseup', function( evt ) {
					// Apply formatting only if any styles are copied (#2780, #2655, #2470).
					if ( getMouseButton( evt ) === CKEDITOR.MOUSE_BUTTON_LEFT && cmd.state === CKEDITOR.TRISTATE_ON ) {
						editor.execCommand( 'applyFormatting' );
					}
				} );

				editable.attachListener( CKEDITOR.document, 'mouseup', function( evt ) {
					if ( getMouseButton( evt ) === CKEDITOR.MOUSE_BUTTON_LEFT && cmd.state === CKEDITOR.TRISTATE_ON &&
						!editable.contains( evt.data.getTarget() ) ) {
						editor.execCommand( 'copyFormatting' );
					}
				} );

				if ( copyFormattingButton ) {
					copyFormattingButtonEl = CKEDITOR.document.getById( copyFormattingButton._.id );

					editable.attachListener( copyFormattingButtonEl, 'dblclick', function() {
						editor.execCommand( 'copyFormatting', { sticky: true } );
					} );

					editable.attachListener( copyFormattingButtonEl, 'mouseup', function( evt ) {
						evt.data.stopPropagation();
					} );
				}
			} );

			// Set customizable keystrokes.
			if ( editor.config.copyFormatting_keystrokeCopy ) {
				editor.setKeystroke( editor.config.copyFormatting_keystrokeCopy, 'copyFormatting' );
			}

			editor.on( 'key', function( evt ) {
				var cmd = editor.getCommand( 'copyFormatting' ),
					domEvent = evt.data.domEvent;

				// Esc should simply disable Copy Formatting. Make sure that getKeystroke is there, as some event stubs are missing it.
				if ( domEvent.getKeystroke && domEvent.getKeystroke() === 27 ) { // ESC
					if ( cmd.state === CKEDITOR.TRISTATE_ON ) {
						editor.execCommand( 'copyFormatting' );
					}
				}
			} );

			// Fetch the styles from element.
			editor.copyFormatting.on( 'extractFormatting', function( evt ) {
				var element = evt.data.element,
					style;

				// Stop at body and html in classic editors or at .cke_editable element in inline ones.
				if ( element.contains( editor.editable() ) || element.equals( editor.editable() ) ) {
					return evt.cancel();
				}

				style = plugin._convertElementToStyleDef( element );

				if ( !editor.copyFormatting.filter.check( new CKEDITOR.style( style ), true, true ) ) {
					return evt.cancel();
				}

				evt.data.styleDef = style;
			} );

			// Remove old styles from element.
			editor.copyFormatting.on( 'applyFormatting', function( evt ) {
				if ( evt.data.preventFormatStripping ) {
					return;
				}

				var range = evt.data.range,
					oldStyles = plugin._extractStylesFromRange( editor, range ),
					context = plugin._determineContext( range ),
					oldStyle,
					bkm,
					i;

				if ( !editor.copyFormatting._isContextAllowed( context ) ) {
					return;
				}

				for ( i = 0; i < oldStyles.length; i++ ) {
					oldStyle = oldStyles[ i ];

					// The bookmark is used to prevent the weird behavior of lists (e.g. not converting list type
					// while applying styles from bullet list to the numbered one). Restoring the selection to its
					// initial state after every change seems to do the trick.
					bkm = range.createBookmark();

					if ( indexOf( plugin.preservedElements, oldStyle.element ) === -1 ) {
						// In Safari we must remove styles exactly from the initial range.
						// Otherwise Safari is removing too much.
						if ( CKEDITOR.env.webkit && !CKEDITOR.env.chrome ) {
							oldStyles[ i ].removeFromRange( evt.data.range, evt.editor );
						} else {
							oldStyles[ i ].remove( evt.editor );
						}
					} else if ( checkForStyle( oldStyle.element, evt.data.styles ) ) {
						plugin._removeStylesFromElementInRange( range, oldStyle.element );
					}

					range.moveToBookmark( bkm );
				}
			} );

			// Apply new styles.
			editor.copyFormatting.on( 'applyFormatting', function( evt ) {
				var plugin = CKEDITOR.plugins.copyformatting,
					context = plugin._determineContext( evt.data.range );

				if ( context === 'list' && editor.copyFormatting._isContextAllowed( 'list' ) ) {
					plugin._applyStylesToListContext( evt.editor, evt.data.range, evt.data.styles );
				} else if ( context === 'table' && editor.copyFormatting._isContextAllowed( 'table' ) ) {
					plugin._applyStylesToTableContext( evt.editor, evt.data.range, evt.data.styles );
				} else if ( editor.copyFormatting._isContextAllowed( 'text' ) ) {
					plugin._applyStylesToTextContext( evt.editor, evt.data.range, evt.data.styles );
				}
			}, null, null, 999 );
		}
	} );

	/**
	 * Copy Formatting state object created for each CKEditor instance.
	 *
	 * @class CKEDITOR.plugins.copyformatting.state
	 * @mixins CKEDITOR.event
	 * @constructor Creates a new state object.
	 * @param {CKEDITOR.editor} editor
	 */
	function State( editor ) {
		/**
		 * Currently copied styles.
		 *
		 * @member CKEDITOR.plugins.copyformatting.state
		 * @property {CKEDITOR.style[]/null}
		 */
		this.styles = null;

		/**
		 * Indicates if the Copy Formatting plugin is in sticky mode.
		 *
		 * @member CKEDITOR.plugins.copyformatting.state
		 * @property {Boolean}
		 */
		this.sticky = false;

		/**
		 * Editor reference.
		 *
		 * @member CKEDITOR.plugins.copyformatting.state
		 * @property {CKEDITOR.editor}
		 */
		this.editor = editor;

		/**
		 * Filter used by the current Copy Formatting instance.
		 *
		 * @member CKEDITOR.plugins.copyformatting.state
		 * @property {CKEDITOR.filter}
		 */
		this.filter = new CKEDITOR.filter( editor, editor.config.copyFormatting_allowRules );

		if ( editor.config.copyFormatting_allowRules === true ) {
			this.filter.disabled = true;
		}

		if ( editor.config.copyFormatting_disallowRules ) {
			this.filter.disallow( editor.config.copyFormatting_disallowRules );
		}
	}

	/**
	 * Checks if copying and applying styles in the current context is possible.
	 * See {@link CKEDITOR.config#copyFormatting_allowedContexts} for the list of possible context values.
	 *
	 * @member CKEDITOR.plugins.copyformatting.state
	 * @param {String} testedContext Context name.
	 * @returns {Boolean} `true` if a given context is allowed in the current Copy Formatting instance.
	 * @private
	 */
	State.prototype._isContextAllowed = function( testedContext ) {
			var configValue = this.editor.config.copyFormatting_allowedContexts;

			return configValue === true || indexOf( configValue, testedContext ) !== -1;
		};

	CKEDITOR.event.implementOn( State.prototype );

	/**
	 * @since 4.6.0
	 * @singleton
	 * @class CKEDITOR.plugins.copyformatting
	 */
	CKEDITOR.plugins.copyformatting = {
		state: State,

		/**
		 * An array of block boundaries that should be always transformed into inline elements with  styles, e.g.
		 * `<div style="font-size: 24px;" class="important">` becomes `<span style="font-size: 24px;" class="important">`.
		 *
		 * @property {Array}
		 */
		inlineBoundary: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ],

		/**
		 * An array of attributes that should be excluded from extracted styles.
		 *
		 * @property {Array}
		 */
		excludedAttributes: [ 'id', 'style', 'href', 'data-cke-saved-href', 'dir' ],

		/**
		 * An array of elements that will be transformed into inline styles while
		 * applying formatting to the plain text context, e.g. trying to apply styles from the `<li>` element
		 * (`<li style="font-size: 24px;">`) to a regular paragraph will cause changing the `<li>` element
		 * into a corresponding `<span>` element (`<span style="font-size: 24px;">`).
		 *
		 * @property {Array}
		 */
		elementsForInlineTransform: [ 'li' ],

		/**
		 * An array of elements that will be excluded from the transformation while
		 * applying formatting to the plain text context.
		 *
		 * @property {Array}
		 */
		excludedElementsFromInlineTransform: [ 'table', 'thead', 'tbody', 'ul', 'ol' ],

		/**
		 * An array of attributes to be excluded while transforming styles from elements inside
		 * {@link CKEDITOR.plugins.copyformatting#elementsForInlineTransform} into `<span>` elements with styles
		 * (e.g. when applying these styles to text context).
		 *
		 * @property {Array}
		 */
		excludedAttributesFromInlineTransform: [ 'value', 'type' ],

		/**
		 * An array of elements which should not be deleted when removing old styles
		 * from the current selection. Instead the styles are stripped from the elements,
		 * preserving the elements themselves, e.g. `<ul style="font-size: 24px" class="important">`
		 * becomes `<ul>`.
		 *
		 * @property {Array}
		 */
		preservedElements: [ 'ul', 'ol', 'li', 'td', 'th', 'tr', 'thead', 'tbody', 'table' ],

		/**
		 * An array of elements on which extracting formatting should be stopped.
		 * If Copy Formatting reaches an element from the array, it ends going up the document tree
		 * and fetching the element parents' styles.
		 *
		 * @property {Array}
		 */
		breakOnElements: [ 'ul', 'ol', 'table' ],

		/**
		 * Stores the name of the command (if any) initially bound to the keystroke used for format applying
		 * ({@link CKEDITOR.config#copyFormatting_keystrokePaste}), to restore it after copy formatting
		 * is deactivated.
		 *
		 * @private
		 * @property {String}
		 */
		_initialKeystrokePasteCommand: null,

		commands: {
			copyFormatting: {
				exec: function( editor, data ) {
					var	cmd = this,
						plugin = CKEDITOR.plugins.copyformatting,
						copyFormatting = editor.copyFormatting,
						isFromKeystroke = data ? data.from == 'keystrokeHandler' : false,
						isSticky = data ? ( data.sticky || isFromKeystroke ) : false,
						cursorContainer = plugin._getCursorContainer( editor ),
						documentElement = CKEDITOR.document.getDocumentElement();

					if ( cmd.state === CKEDITOR.TRISTATE_ON ) {
						copyFormatting.styles = null;
						copyFormatting.sticky = false;

						cursorContainer.removeClass( 'cke_copyformatting_active' );
						documentElement.removeClass( 'cke_copyformatting_disabled' );
						documentElement.removeClass( 'cke_copyformatting_tableresize_cursor' );

						plugin._putScreenReaderMessage( editor, 'canceled' );
						plugin._detachPasteKeystrokeHandler( editor );

						return cmd.setState( CKEDITOR.TRISTATE_OFF );
					}

					copyFormatting.styles = plugin._extractStylesFromElement( editor,
						editor.elementPath().lastElement );

					cmd.setState( CKEDITOR.TRISTATE_ON );

					if ( !isFromKeystroke ) {
						cursorContainer.addClass( 'cke_copyformatting_active' );
						documentElement.addClass( 'cke_copyformatting_tableresize_cursor' );

						if ( editor.config.copyFormatting_outerCursor ) {
							documentElement.addClass( 'cke_copyformatting_disabled' );
						}
					}

					copyFormatting.sticky = isSticky;

					plugin._putScreenReaderMessage( editor, 'copied' );
					plugin._attachPasteKeystrokeHandler( editor );
				}
			},

			applyFormatting: {
				editorFocus: CKEDITOR.env.ie && !CKEDITOR.env.edge ? false : true,
				exec: function( editor, data ) {
					var cmd = editor.getCommand( 'copyFormatting' ),
						isFromKeystroke = data ? data.from == 'keystrokeHandler' : false,
						plugin = CKEDITOR.plugins.copyformatting,
						copyFormatting = editor.copyFormatting,
						cursorContainer = plugin._getCursorContainer( editor ),
						documentElement = CKEDITOR.document.getDocumentElement(),
						isApplied;

					if ( isFromKeystroke && !copyFormatting.styles ) {
						plugin._putScreenReaderMessage( editor, 'failed' );
						plugin._detachPasteKeystrokeHandler( editor );
						return false;
					}

					isApplied = plugin._applyFormat( editor, copyFormatting.styles );

					if ( !copyFormatting.sticky ) {
						copyFormatting.styles = null;

						cursorContainer.removeClass( 'cke_copyformatting_active' );
						documentElement.removeClass( 'cke_copyformatting_disabled' );
						documentElement.removeClass( 'cke_copyformatting_tableresize_cursor' );

						cmd.setState( CKEDITOR.TRISTATE_OFF );

						plugin._detachPasteKeystrokeHandler( editor );
					}

					plugin._putScreenReaderMessage( editor, isApplied ? 'applied' : 'canceled' );
				}
			}
		},

		/**
		 * Returns a container element where the mouse cursor should be overridden.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @return {CKEDITOR.dom.element} For inline editor, it is the editable itself and for classic editor
		 * it is the document element of the editor iframe.
		 * @private
		 */
		_getCursorContainer: function( editor ) {
			if ( editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE ) {
				return editor.editable();
			}

			return editor.editable().getParent();
		},

		/**
		 * Converts a given element into a style definition that could be used to create an instance of {@link CKEDITOR.style}.
		 *
		 * Note that all definitions have a `type` property set to {@link CKEDITOR#STYLE_INLINE}.
		 *
		 * @param {CKEDITOR.dom.element} element The element to be converted.
		 * @returns {Object} The style definition created from the element.
		 * @private
		 */
		_convertElementToStyleDef: function( element ) {
			var tools = CKEDITOR.tools,
				attributes = element.getAttributes( CKEDITOR.plugins.copyformatting.excludedAttributes ),
				styles = tools.parseCssText( element.getAttribute( 'style' ), true, true );

			return {
				element: element.getName(),
				type: CKEDITOR.STYLE_INLINE,
				attributes: attributes,
				styles: styles
			};
		},

		/**
		 * Extracts styles from the given element and its ancestors. This function walks up the document tree, starting from
		 * the given element, and ends on the editor's editable or when the element from
		 * {@link CKEDITOR.plugins.copyformatting#breakOnElements} is reached.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @param {CKEDITOR.dom.element} element The element whose styles should be extracted.
		 * @returns {CKEDITOR.style[]} An array containing all extracted styles.
		 * @private
		 */
		_extractStylesFromElement: function( editor, element ) {
			var eventData = {},
				styles = [];

			do {
				// Skip all non-elements and bookmarks.
				if ( element.type !== CKEDITOR.NODE_ELEMENT || element.hasAttribute( 'data-cke-bookmark' ) ) {
					continue;
				}

				eventData.element = element;

				if ( editor.copyFormatting.fire( 'extractFormatting', eventData, editor ) && eventData.styleDef ) {
					styles.push( new CKEDITOR.style( eventData.styleDef ) );
				}

				// Break on list root.
				if ( element.getName && indexOf( CKEDITOR.plugins.copyformatting.breakOnElements, element.getName() ) !== -1 ) {
					break;
				}
			} while ( ( element = element.getParent() ) && element.type === CKEDITOR.NODE_ELEMENT );

			return styles;
		},

		/**
		 * Extracts styles from the given range. This function finds all elements in the given range and then applies
		 * {@link CKEDITOR.plugins.copyformatting#_extractStylesFromElement} on them.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @param {CKEDITOR.dom.range} range The range that styles should be extracted from.
		 * @returns {CKEDITOR.style[]} An array containing all extracted styles.
		 * @private
		 * @todo Styles in the array returned by this method might be duplicated; it should be cleaned later on.
		 */
		_extractStylesFromRange: function( editor, range ) {
			var styles = [],
				walker = new CKEDITOR.dom.walker( range ),
				currentNode;

			while ( ( currentNode = walker.next() ) ) {
				styles = styles.concat(
					CKEDITOR.plugins.copyformatting._extractStylesFromElement( editor, currentNode ) );
			}

			return styles;
		},

		/**
		 * Removes all styles from the element in a given range without
		 * removing the element itself.
		 *
		 * @param {CKEDITOR.dom.range} range The range where the element
		 * should be found.
		 * @param {String} element The tag name of the element.
		 * @private
		 */
		_removeStylesFromElementInRange: function( range, element ) {
			// In case of lists, we want to remove styling only from the outer list.
			var stopOnFirst = indexOf( [ 'ol', 'ul', 'table' ], element ) !== -1,
				walker = new CKEDITOR.dom.walker( range ),
				currentNode;

			while ( ( currentNode = walker.next() ) ) {
				currentNode = currentNode.getAscendant( element, true );

				if ( currentNode ) {
					currentNode.removeAttributes( currentNode.getAttributes() );

					if ( stopOnFirst ) {
						return;
					}
				}
			}
		},

		/**
		 * Gets offsets as well as start and end containers for the selected word.
		 * It also handles cases like `lu<span style="color: #f00;">n</span>ar`.
		 *
		 * @param {CKEDITOR.dom.range} range Selected range.
		 * @returns {Object} return An object with the following properties:
		 * @returns {CKEDITOR.dom.element} return.startNode The node where the word's beginning is located.
		 * @returns {Number} return.startOffset The offset inside the `startNode` indicating the word's beginning.
		 * @returns {CKEDITOR.dom.element} return.endNode The node where the word's ending is located.
		 * @returns {Number} return.endOffset The offset inside the `endNode` indicating the word's ending.
		 * @private
		 */
		_getSelectedWordOffset: function( range ) {
			var regex = /\b\w+\b/ig,
				contents, match,
				node, startNode, endNode,
				startOffset, endOffset;

			node = startNode = endNode = range.startContainer;

			// Get sibling node, skipping the comments.
			function getSibling( node, isPrev ) {
				return node[ isPrev ? 'getPrevious' : 'getNext' ]( function( sibling ) {
					// We must skip all comments.
					return sibling.type !== CKEDITOR.NODE_COMMENT;
				} );
			}

			// Get node contents without tags.
			function getNodeContents( node ) {
				var html;

				// If the node is element, get its HTML and strip all tags and bookmarks
				// and then search for word boundaries. In node.getText tags are
				// replaced by spaces, which breaks getting the right offset.
				if ( node.type == CKEDITOR.NODE_ELEMENT ) {
					html = node.getHtml().replace( /<span.*?>&nbsp;<\/span>/g, '' );
					return html.replace( /<.*?>/g, '' );
				}

				return node.getText();
			}

			// Get the word beggining/ending from previous/next node with content (skipping empty nodes and bookmarks)
			function getSiblingNodeOffset( startNode, isPrev ) {
				var currentNode = startNode,
					regex = /\s/g,
					boundaryElements = [ 'p', 'br', 'ol', 'ul', 'li', 'td', 'th', 'div', 'caption', 'body' ],
					isBoundary = false,
					isParent = false,
					sibling, contents, match, offset;

				do {
					sibling = getSibling( currentNode, isPrev );

					// If there is no sibling, text is probably inside element, so get it
					// and then fetch its sibling.
					while ( !sibling && currentNode.getParent() ) {
						currentNode = currentNode.getParent();

						// Check if the parent is a boundary.
						if ( indexOf( boundaryElements, currentNode.getName() ) !== -1 ) {
							isBoundary = true;
							isParent = true;
							break;
						}

						sibling = getSibling( currentNode, isPrev );
					}

					// Check if the fetched element is not a boundary.
					if ( sibling && sibling.getName && indexOf( boundaryElements, sibling.getName() ) !== -1 ) {
						isBoundary = true;
						break;
					}

					currentNode = sibling;
				} while ( currentNode && currentNode.getStyle &&
					( currentNode.getStyle( 'display' ) == 'none' || !currentNode.getText() ) );

				if ( !currentNode ) {
					currentNode = startNode;
				}

				// If the node is an element, get its text child.
				// In case of searching for the next node and reaching boundary (which is not parent),
				// we must get the *last* text child.
				while ( currentNode.type !== CKEDITOR.NODE_TEXT ) {
					if ( isBoundary && !isPrev && !isParent ) {
						currentNode = currentNode.getChild( currentNode.getChildCount() - 1 );
					} else {
						currentNode = currentNode.getChild( 0 );
					}
				}

				contents = getNodeContents( currentNode );

				while ( ( match = regex.exec( contents ) ) != null ) {
					offset = match.index;

					if ( !isPrev ) {
						break;
					}
				}

				// There is no space in fetched node and it's not a boundary node,
				// so we must fetch one more node.
				if ( typeof offset !== 'number' && !isBoundary ) {
					return getSiblingNodeOffset( currentNode, isPrev );
				}

				// A little bit of math:
				// * if we are searching for the beginning of the word and the word
				// is located on the boundary of block element, set offset to 0.
				// * if we are searching for the ending of the word and the word
				// is located on the boundary of block element, set offset to
				// the last occurrence of non-word character or node's length.
				// * if we are searching for the beginning of the word, we must move the offset
				// one character to the right (the space is located just before the word).
				// * we must also ensure that the space is not located at the boundary of the node,
				// otherwise we must return next node with appropriate offset.
				if ( isBoundary ) {
					if ( isPrev ) {
						offset = 0;
					} else {
						regex = /([\.\b]*$)/;
						match = regex.exec( contents );

						offset = match ? match.index : contents.length;
					}
				} else if ( isPrev ) {
					offset += 1;

					if ( offset > contents.length ) {
						return getSiblingNodeOffset( currentNode );
					}
				}

				return {
					node: currentNode,
					offset: offset
				};
			}

			contents = getNodeContents( node );

			while ( ( match = regex.exec( contents ) ) != null ) {
				if ( match.index + match[ 0 ].length >= range.startOffset ) {
					startOffset = match.index;
					endOffset = match.index + match[ 0 ].length;

					// The word probably begins in previous node.
					if ( match.index === 0 ) {
						var startInfo = getSiblingNodeOffset( node, true );

						startNode = startInfo.node;
						startOffset = startInfo.offset;
					}

					// The word probably ends in next node.
					if ( endOffset >= contents.length ) {
						var endInfo = getSiblingNodeOffset( node );

						endNode = endInfo.node;
						endOffset = endInfo.offset;
					}

					return {
						startNode: startNode,
						startOffset: startOffset,
						endNode: endNode,
						endOffset: endOffset
					};
				}
			}

			return null;
		},

		/**
		 * Filters styles before applying them by using {@link CKEDITOR.filter}.
		 *
		 * @param {CKEDITOR.style[]} styles An array of styles to be filtered.
		 * @return {CKEDITOR.style[]} Filtered styles.
		 * @private
		 */
		_filterStyles: function( styles ) {
			var isEmpty = CKEDITOR.tools.isEmpty,
				filteredStyles = [],
				styleDef,
				i;

			for ( i = 0; i < styles.length; i++ ) {
				styleDef = styles[ i ]._.definition;

				// Change element's name to span in case of inline boundary elements.
				if ( CKEDITOR.tools.indexOf( CKEDITOR.plugins.copyformatting.inlineBoundary,
					styleDef.element ) !== -1 ) {
					styleDef.element = styles[ i ].element = 'span';
				}

				// We don't want to pick empty spans.
				if ( styleDef.element === 'span' && isEmpty( styleDef.attributes ) && isEmpty( styleDef.styles ) ) {
					continue;
				}

				filteredStyles.push( styles[ i ] );
			}

			return filteredStyles;
		},

		/**
		 * Determines the context of the given selection. See {@link CKEDITOR.config#copyFormatting_allowedContexts}
		 * for a list of possible context values.
		 *
		 * @param {CKEDITOR.dom.range} range The range that the context should be determined from.
		 * @returns {String}
		 * @private
		 */
		_determineContext: function( range ) {
			function detect( query ) {
				var walker = new CKEDITOR.dom.walker( range ),
					currentNode;

				// Walker sometimes does not include all nodes (e.g. if the range is in the middle of text node).
				if ( range.startContainer.getAscendant( query, true ) || range.endContainer.getAscendant( query, true ) ) {
					return true;
				}

				while ( ( currentNode = walker.next() ) ) {
					if ( currentNode.getAscendant( query, true ) ) {
						return true;
					}
				}
			}

			if ( detect( { ul: 1, ol: 1 } ) ) {
				return 'list';
			} else if ( detect( 'table' ) ) {
				return 'table';
			} else {
				return 'text';
			}
		},

		/**
		 * Applies styles inside the plain text context.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @param {CKEDITOR.dom.range} range The range that the context can be determined from.
		 * @param {CKEDITOR.style[]} styles The styles to be applied.
		 * @private
		 */
		_applyStylesToTextContext: function( editor, range, styles ) {
			var plugin = CKEDITOR.plugins.copyformatting,
				attrsToExclude = plugin.excludedAttributesFromInlineTransform,
				style,
				i,
				j;

			// We must select initial range in WebKit. Otherwise WebKit has problems with applying styles:
			// it collapses selection.
			if ( CKEDITOR.env.webkit && !CKEDITOR.env.chrome ) {
				editor.getSelection().selectRanges( [ range ] );
			}

			for ( i = 0; i < styles.length; i++ ) {
				style = styles[ i ];

				if ( indexOf( plugin.excludedElementsFromInlineTransform, style.element ) !== -1 ) {
					continue;
				}

				if ( indexOf( plugin.elementsForInlineTransform, style.element ) !== -1 ) {
					style.element = style._.definition.element = 'span';

					for ( j = 0; j < attrsToExclude.length; j++ ) {
						if ( style._.definition.attributes[ attrsToExclude[ j ] ] ) {
							delete style._.definition.attributes[ attrsToExclude[ j ] ];
						}
					}
				}

				style.apply( editor );
			}
		},

		/**
		 * Applies the list style inside the list context.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @param {CKEDITOR.dom.range} range The range where the styles should be applied.
		 * @param {CKEDITOR.style[]} styles The style to be applied.
		 * @private
		 */
		_applyStylesToListContext: function( editor, range, styles ) {
			var style,
				bkm,
				i;

			function applyToList( list, style ) {
				if ( list.getName() !== style.element ) {
					list.renameNode( style.element );
				}

				style.applyToObject( list );
			}

			for ( i = 0; i < styles.length; i++ ) {
				style = styles[ i ];

				// The bookmark is used to prevent the weird behavior of lists (e.g. not converting list type
				// while applying styles from bullet list to the numbered one). Restoring the selection to its
				// initial state after every change seems to do the trick.
				bkm = range.createBookmark();

				if ( style.element === 'ol' || style.element === 'ul' ) {
					getNodeAndApplyCmd( range, { ul: 1, ol: 1 }, function( currentNode ) {
						applyToList( currentNode, style );
					}, true );
				} else if ( style.element === 'li' ) {
					getNodeAndApplyCmd( range, 'li', function( currentNode ) {
						style.applyToObject( currentNode );
					} );
				} else {
					CKEDITOR.plugins.copyformatting._applyStylesToTextContext( editor, range, [ style ] );
				}

				range.moveToBookmark( bkm );
			}
		},

		/**
		 * Applies the table style inside the table context.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @param {CKEDITOR.dom.range} range The range where the styles should be applied.
		 * @param {CKEDITOR.style[]} styles The style to be applied.
		 * @private
		 */
		_applyStylesToTableContext: function( editor, range, styles ) {
			var style,
				bkm,
				i;

			function applyToTableCell( cell, style ) {
				if ( cell.getName() !== style.element ) {
					style = style.getDefinition();
					style.element = cell.getName();
					style = new CKEDITOR.style( style );
				}

				style.applyToObject( cell );
			}

			for ( i = 0; i < styles.length; i++ ) {
				style = styles[ i ];

				// The bookmark is used to prevent the weird behavior of tables (e.g. applying style to all cells
				// instead of just selected cell). Restoring the selection to its initial state after every change
				// seems to do the trick.
				bkm = range.createBookmark();

				if ( indexOf( [ 'table', 'tr' ], style.element ) !== -1 ) {
					getNodeAndApplyCmd( range, style.element, function( currentNode ) {
						style.applyToObject( currentNode );
					} );
				} else if ( indexOf( [ 'td', 'th' ], style.element ) !== -1 ) {
					getNodeAndApplyCmd( range, { td: 1, th: 1 }, function( currentNode ) {
						applyToTableCell( currentNode, style );
					} );
				} else if ( indexOf( [ 'thead', 'tbody' ], style.element ) !== -1 ) {
					getNodeAndApplyCmd( range, { thead: 1, tbody: 1 }, function( currentNode ) {
						applyToTableCell( currentNode, style );
					} );
				} else {
					CKEDITOR.plugins.copyformatting._applyStylesToTextContext( editor, range, [ style ] );
				}

				range.moveToBookmark( bkm );
			}
		},


		/**
		 * Initializes applying given styles to the currently selected content in the editor.
		 *
		 * The actual applying is performed inside event listeners for the
		 * {@link CKEDITOR.plugins.copyformatting.state#applyFormatting} event.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @param {CKEDITOR.style[]} newStyles An array of styles to be applied.
		 * @returns {Boolean} `false` if styles could not be applied, `true` otherwise.
		 * @private
		 */
		_applyFormat: function( editor, newStyles ) {
			var range = editor.getSelection().getRanges()[ 0 ],
				plugin = CKEDITOR.plugins.copyformatting,
				word,
				bkms,
				applyEvtData;

			if ( !range ) {
				return false;
			}

			if ( range.collapsed ) {
				// Create bookmarks only if range is collapsed – otherwise
				// it will break walker used in _extractStylesFromRange.
				bkms = editor.getSelection().createBookmarks();

				if ( !( word = plugin._getSelectedWordOffset( range ) ) ) {
					return;
				}

				range = editor.createRange();
				range.setStart( word.startNode, word.startOffset );
				range.setEnd( word.endNode, word.endOffset );
				range.select();
			}
			newStyles = plugin._filterStyles( newStyles );

			applyEvtData = { styles: newStyles, range: range, preventFormatStripping: false };

			// Now apply new styles.
			if ( !editor.copyFormatting.fire( 'applyFormatting', applyEvtData, editor ) ) {
				return false;
			}

			if ( bkms ) {
				editor.getSelection().selectBookmarks( bkms );
			}

			return true;
		},

		/**
		 * Puts a message solely for screen readers, meant to provide status updates for the Copy Formatting plugin.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @param {string} msg The name of the message in the language file.
		 * @private
		 */
		_putScreenReaderMessage: function( editor, msg ) {
			var container = this._getScreenReaderContainer();

			if ( container ) {
				container.setText( editor.lang.copyformatting.notification[ msg ] );
			}
		},

		/**
		 * Adds the screen reader messages wrapper. Multiple calls will create only one message container.
		 *
		 * @private
		 * @returns {CKEDITOR.dom.element} Inserted `aria-live` container.
		 */
		_addScreenReaderContainer: function() {
			if ( this._getScreenReaderContainer() ) {
				return this._getScreenReaderContainer();
			}

			if ( CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat ) {
				// Screen reader notifications are not supported on IE Quirks mode.
				return;
			}

			// We can't use aria-live together with .cke_screen_reader_only class. Based on JAWS it won't read
			// `aria-live` which has directly `position: absolute` assigned.
			// The trick was simply to put position absolute, and all the hiding CSS into a wrapper,
			// while content with `aria-live` attribute inside.
			var notificationTpl = '<div class="cke_screen_reader_only cke_copyformatting_notification">' +
						'<div aria-live="polite"></div>' +
					'</div>';

			return CKEDITOR.document.getBody().append( CKEDITOR.dom.element.createFromHtml( notificationTpl ) ).getChild( 0 );
		},


		/**
		 * Returns a screen reader messages wrapper.
		 *
		 * @private
		 * @returns
		 */
		_getScreenReaderContainer: function() {
			if ( CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat ) {
				// findOne is not supported on Quirks.
				return;
			}

			return CKEDITOR.document.getBody().findOne( '.cke_copyformatting_notification div[aria-live]' );
		},

		/**
		 * Attaches the paste keystroke handler to the given editor instance.
		 *
		 * @private
		 * @param {CKEDITOR.editor} editor
		 */
		_attachPasteKeystrokeHandler: function( editor ) {
			var keystrokePaste = editor.config.copyFormatting_keystrokePaste;

			if ( keystrokePaste ) {
				this._initialKeystrokePasteCommand = editor.keystrokeHandler.keystrokes[ keystrokePaste ];
				editor.setKeystroke( keystrokePaste, 'applyFormatting' );
			}
		},

		/**
		 * Detaches the paste keystroke handler from the given editor instance.
		 *
		 * @private
		 * @param {CKEDITOR.editor} editor
		 */
		_detachPasteKeystrokeHandler: function( editor ) {
			var keystrokePaste = editor.config.copyFormatting_keystrokePaste;

			if ( keystrokePaste ) {
				editor.setKeystroke( keystrokePaste, this._initialKeystrokePasteCommand || false );
			}
		}
	};

	/**
	 * Defines if the "disabled" cursor should be attached to the whole page
	 * when the Copy Formatting plugin is active.
	 *
	 * "Disabled" cursor indicates that Copy Formatting will not work in the place where the mouse cursor is placed.
	 *
	 *		config.copyFormatting_outerCursor = false;
	 *
	 * Read more in the {@glink features/copyformatting documentation}
	 * and see the {@glink examples/copyformatting example}.
	 *
	 * @since 4.6.0
	 * @cfg [copyFormatting_outerCursor=true]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_outerCursor = true;

	/**
	 * Defines rules for the elements from which the styles should be fetched. If set to `true`, it will disable
	 * filtering.
	 *
	 * This property is using Advanced Content Filter syntax. You can learn more about it in the
	 * [Content Filtering (ACF)](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_acf.html) documentation.
	 *
	 *		config.copyFormatting_allowRules = 'span(*)[*]{*}'; // Allows only spans.
	 *		config.copyFormatting_allowRules = true; // Disables filtering.
	 *
	 *
	 * Read more in the {@glink features/copyformatting documentation}
	 * and see the {@glink examples/copyformatting example}.
	 *
	 * @since 4.6.0
	 * @cfg [copyFormatting_allowRules='b; s; u; strong; span; p; div; table; thead; tbody; ' +
	 *	'tr; td; th; ol; ul; li; (*)[*]{*}']
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_allowRules = 'b s u i em strong span p div td th ol ul li(*)[*]{*}';

	/**
	 * Defines rules for the elements from which fetching styles is explicitly forbidden (eg. widgets).
	 *
	 * This property is using Advanced Content Filter syntax. You can learn more about it in the
	 * [Content Filtering (ACF)](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_acf.html) documentation.
	 *
	 *		config.copyFormatting_disallowRules = 'span(important)'; // Disallows spans with "important" class.
	 *
	 *
	 * Read more in the {@glink features/copyformatting documentation}
	 * and see the {@glink examples/copyformatting example}.
	 *
	 * @since 4.6.0
	 * @cfg [copyFormatting_disallowRules='*[data-cke-widget*,data-widget*,data-cke-realelement](cke_widget*)']
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_disallowRules = '*[data-cke-widget*,data-widget*,data-cke-realelement](cke_widget*)';

	/**
	 * Defines which contexts should be enabled in the Copy Formatting plugin. Available contexts are:
	 *
	 * * `'text'` &ndash; Plain text context.
	 * * `'list'` &ndash; List context.
	 * * `'table'` &ndash; Table context.
	 *
	 * Examples:
	 *
	 *		// Enables only plain text context.
	 *		config.copyFormatting_allowedContexts = [ 'text' ];
	 *
	 *		// If set to "true", enables all contexts.
	 *		config.copyFormatting_allowedContexts = true;
	 *
	 * Read more in the {@glink features/copyformatting documentation}
	 * and see the {@glink examples/copyformatting example}.
	 *
	 * @since 4.6.0
	 * @cfg {Boolean/String[]} [copyFormatting_allowedContexts=true]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_allowedContexts = true;

	/**
	 * Defines the keyboard shortcut for copying styles.
	 *
	 *		config.copyFormatting_keystrokeCopy = CKEDITOR.CTRL + CKEDITOR.SHIFT + 66; // Ctrl+Shift+B
	 *
	 * The keyboard shortcut can also be switched off:
	 *
	 *		config.copyFormatting_keystrokeCopy = false;
	 *
	 * Read more in the {@glink features/copyformatting documentation}
	 * and see the {@glink examples/copyformatting example}.
	 *
	 * @since 4.6.0
	 * @cfg {Number} [copyFormatting_keystrokeCopy=CKEDITOR.CTRL + CKEDITOR.SHIFT + 67]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_keystrokeCopy = CKEDITOR.CTRL + CKEDITOR.SHIFT + 67;

	/**
	 * Defines the keyboard shortcut for applying styles.
	 *
	 *		config.copyFormatting_keystrokePaste = CKEDITOR.CTRL + CKEDITOR.SHIFT + 77; // Ctrl+Shift+M
	 *
	 * The keyboard shortcut can also be switched off:
	 *
	 *		config.copyFormatting_keystrokePaste = false;
	 *
	 * Read more in the {@glink features/copyformatting documentation}
	 * and see the {@glink examples/copyformatting example}.
	 *
	 * @since 4.6.0
	 * @cfg {Number} [copyFormatting_keystrokePaste=CKEDITOR.CTRL + CKEDITOR.SHIFT + 86]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_keystrokePaste = CKEDITOR.CTRL + CKEDITOR.SHIFT + 86;

	/**
	 * Fired when the styles are being extracted from the element. This event is fired for each element separately.
	 * This event listener job is to extract inline styles from the element and modify them if needed.
	 *
	 *		editor.copyFormatting.on( 'extractFormatting', function( evt ) {
	 *			evt.data.styleDef.attributes.class = 'important';
	 *		} );
	 *
	 * This event can also be canceled to indicate that styles from the current element should not
	 * be extracted.
	 *
	 *		editor.copyFormatting.on( 'extractFormatting', function( evt ) {
	 *			if ( evt.data.element === 'div' ) {
	 *				evt.cancel();
	 *			}
	 *		} );
	 *
	 * This event has a default listener with a default priority of `10`.
	 * It extracts all styles from the element (from some of the attributes and from
	 * the element name) and puts them as an object into `evt.data.styleDef`.
	 *
	 * @event extractFormatting
	 * @member CKEDITOR.plugins.copyformatting.state
	 * @param {Object} data
	 * @param {CKEDITOR.dom.element} data.element The element whose styles should be fetched.
	 * @param {Object} data.styleDef Style definition extracted from the element.
	 */

	/**
	 * Fired when the copied styles are applied to the current selection position.
	 * This event listener job is to apply new styles.
	 *
	 *		editor.copyFormatting.on( 'applyFormatting', function( evt ) {
	 *			for ( var i = 0; i < evt.data.styles.length; i++ ) {
	 *				evt.data.styles[ i ].apply( evt.editor );
	 *			}
	 *		}, null, null, 999 );
	 *
	 * By default this event has two listeners: the first one with a default priority of `10`
	 * and the second with a priority of `999`.
	 * The first one removes all preexisting styles from the Copy Formatting destination.
	 * The second one applies all new styles to the current selection.
	 *
	 * @event applyFormatting
	 * @member CKEDITOR.plugins.copyformatting.state
	 * @param {Object} data
	 * @param {CKEDITOR.dom.range} data.range The range from the current selection where styling should be applied.
	 * @param {CKEDITOR.style[]} data.styles The styles to be applied.
	 * @param {Boolean} [data.preventFormatStripping=false] If set to `true`, it will prevent stripping styles from
	 * the Copy Formatting destination range.
	 */
} )();

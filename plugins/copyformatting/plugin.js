/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	var indexOf = CKEDITOR.tools.indexOf;

	// Detects if the left mouse button was pressed:
	// * In all browsers and IE 9+ we use event.button property with standard compliant values.
	// * In IE 8- we use event.button with IE's propertiary values.
	function detectLeftMouseButton( evt ) {
		var domEvent = evt.data.$;

		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
			return domEvent.button === 1;
		}

		return domEvent.button === 0;
	}

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
		lang: 'en',
		icons: 'copyformatting',
		hidpi: true,

		onLoad: function() {
			var doc = CKEDITOR.document,
				// We can't use aria-live together with .cke_screen_reader_only class. Based on JAWS it won't read
				// `aria-live` which has dirrectly `position: absolute` assigned.
				// The trick was simply to put position absolute, and all the hiding CSS into a wrapper,
				// while content with `aria-live` attribute inside.
				notificationTpl = '<div class="cke_screen_reader_only cke_copyformatting_notification">' +
						'<div aria-live="polite"></div>' +
					'</div>';

			doc.appendStyleSheet( this.path + 'styles/copyformatting.css' );
			doc.getBody().append( CKEDITOR.dom.element.createFromHtml( notificationTpl ) );
		},

		init: function( editor ) {
			var plugin = CKEDITOR.plugins.copyformatting;

			// Add copyformatting stylesheet.
			if ( editor.addContentsCss ) {
				editor.addContentsCss( this.path + 'styles/copyformatting.css' );
			}

			/**
			 * Object indicating the current state of Copy Formatting plugin
			 * in the specified editor.
			 *
			 * @mixins CKEDITOR.event
			 * @member CKEDITOR.editor
			 */
			editor.copyFormatting = {
				/**
				 * Currently copied styles.
				 *
				 * @member CKEDITOR.editor.copyFormatting
				 * @property {CKEDITOR.style[]/null}
				 */
				styles: null,

				/**
				 * Indicates if the Copy Formatting plugin is in sticky mode.
				 *
				 * @member CKEDITOR.editor.copyFormatting
				 * @property {Boolean}
				 */
				sticky: false,

				/**
				 * Reference to the editor.
				 *
				 * @member CKEDITOR.editor.copyFormatting
				 * @property {CKEDITOR.editor}
				 */
				editor: editor,

				/**
				 * Filter used by current's Copy Formatting instance.
				 *
				 * @member CKEDITOR.editor.copyFormatting
				 * @property {CKEDITOR.filter}
				 */
				filter: new CKEDITOR.filter( editor.config.copyFormatting_allowRules ),

				/**
				 * Checks if given context can be applied. For list of possible context values see
				 * `{@link CKEDITOR.config.copyFormatting_allowedContexts}`.
				 *
				 * @param {String} testedContext Context name.
				 * @returns {Boolean} `true` if given context can be used in given Copy Formatting instance.
				 * @private
				 */
				_isContextAllowed: function( testedContext ) {
					var configValue = this.editor.config.copyFormatting_allowedContexts;

					return configValue === true || indexOf( configValue, testedContext ) !== -1;
				}
			};

			if ( editor.config.copyFormatting_allowRules === true ) {
				editor.copyFormatting.filter.disabled = true;
			}

			CKEDITOR.event.implementOn( editor.copyFormatting );

			if ( editor.config.copyFormatting_disallowRules ) {
				editor.copyFormatting.filter.disallow( editor.config.copyFormatting_disallowRules );
			}

			editor.addCommand( 'copyFormatting', plugin.commands.copyFormatting );
			editor.addCommand( 'applyFormatting', plugin.commands.applyFormatting );

			editor.ui.addButton( 'CopyFormatting', {
				label: editor.lang.copyformatting.label,
				command: 'copyFormatting',
				toolbar: 'cleanup,0'
			} );

			editor.on( 'contentDom', function() {
				var editable = editor.editable(),
					// Host element for apply formatting clock. In case of classic element it needs to be entire
					// document, otherwise clicking in body margins would not trigger the event (#168).
					mouseupHost = editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE ? editable : editor.document,
					copyFormattingButton = editor.ui.get( 'CopyFormatting' ),
					copyFormattingButtonEl;

				editable.attachListener( mouseupHost, 'mouseup', function( evt ) {
					if ( detectLeftMouseButton( evt ) ) {
						editor.execCommand( 'applyFormatting' );
					}
				} );

				editable.attachListener( CKEDITOR.document, 'mouseup', function( evt ) {
					var cmd = editor.getCommand( 'copyFormatting' );

					if ( detectLeftMouseButton( evt ) && cmd.state === CKEDITOR.TRISTATE_ON &&
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

			// Set customizable keystrokes (#195).
			if ( editor.config.copyFormatting_keystrokeCopy ) {
				editor.setKeystroke( editor.config.copyFormatting_keystrokeCopy, 'copyFormatting' );
			}
			if ( editor.config.copyFormatting_keystrokePaste ) {
				editor.setKeystroke( editor.config.copyFormatting_keystrokePaste, 'applyFormatting' );
			}

			editor.on( 'key', function( evt ) {
				var cmd = editor.getCommand( 'copyFormatting' );

				if ( evt.data.domEvent.getKeystroke() === 27 ) { // ESC
					if ( cmd.state === CKEDITOR.TRISTATE_ON ) {
						editor.execCommand( 'copyFormatting' );
					}
				}
			} );

			// Fetch the styles from element.
			editor.copyFormatting.on( 'extractFormatting', function( evt ) {
				var element = evt.data.element,
					style,
					styleClone;

				// Stop at body and html in classic editors or at .cke_editable element in inline ones.
				if ( element.contains( editor.editable() ) || element.equals( editor.editable() ) ) {
					return evt.cancel();
				}

				style = plugin._convertElementToStyleDef( element );

				// Workaround for #13886.
				styleClone = CKEDITOR.tools.clone( style );
				if ( styleClone && CKEDITOR.tools.isEmpty( styleClone.styles ) ) {
					delete styleClone.styles;
				}

				if ( !editor.copyFormatting.filter.check( new CKEDITOR.style( styleClone ), true, true ) ) {
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
	 * @singleton
	 * @class CKEDITOR.plugins.copyformatting
	 */
	CKEDITOR.plugins.copyformatting = {
		/**
		 * Array of tag names that should limit inline styles extraction.
		 *
		 * @property {Array}
		 */
		inlineBoundary: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ],

		/**
		 * Array of attributes that should be excluded from extracted styles.
		 *
		 * @property {Array}
		 */
		excludedAttributes: [ 'id', 'style', 'href', 'data-cke-saved-href' ],

		/**
		 * Array of elements that will be transformed into inline styles while
		 * applying formatting to the plain text context.
		 *
		 * @property {Array}
		 */
		elementsForInlineTransform: [ 'li' ],

		/**
		 * Array of elements that will be excluded from transformation while
		 * applying formatting to the plain text context.
		 *
		 * @property {Array}
		 */
		excludedElementsFromInlineTransform: [ 'table', 'thead', 'tbody', 'ul', 'ol' ],

		/**
		 * Array of attributes to be excluded while transforming `li` styles
		 * into `span` styles (e.g. when applying that styles to text context).
		 *
		 * @property {Array}
		 */
		excludedAttributesFromInlineTransform: [ 'value', 'type' ],

		/**
		 * Array of elements which should not be deleted when deleting old styles
		 * from current selection. Instead the styles are stripped of the elements,
		 * preserving themselves.
		 *
		 * @property {Array}
		 */
		preservedElements: [ 'ul', 'ol', 'li', 'td', 'th', 'tr', 'thead', 'tbody', 'table' ],

		/**
		 * Array of elements on which extracting formatting should be stopped.
		 *
		 * @property {Array}
		 */
		breakOnElements: [ 'ul', 'ol', 'table' ],

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
				}
			},

			applyFormatting: {
				exec: function( editor, data ) {
					var cmd = editor.getCommand( 'copyFormatting' ),
						isFromKeystroke = data ? data.from == 'keystrokeHandler' : false,
						plugin = CKEDITOR.plugins.copyformatting,
						copyFormatting = editor.copyFormatting,
						cursorContainer = plugin._getCursorContainer( editor ),
						documentElement = CKEDITOR.document.getDocumentElement(),
						isApplied;

					if ( !isFromKeystroke && cmd.state !== CKEDITOR.TRISTATE_ON ) {
						return;
					} else if ( isFromKeystroke && !copyFormatting.styles ) {
						return plugin._putScreenReaderMessage( editor, 'failed' );
					}

					isApplied = plugin._applyFormat( editor, copyFormatting.styles );

					if ( !copyFormatting.sticky ) {
						copyFormatting.styles = null;

						cursorContainer.removeClass( 'cke_copyformatting_active' );
						documentElement.removeClass( 'cke_copyformatting_disabled' );
						documentElement.removeClass( 'cke_copyformatting_tableresize_cursor' );

						cmd.setState( CKEDITOR.TRISTATE_OFF );
					}

					plugin._putScreenReaderMessage( editor, isApplied ? 'applied' : 'canceled' );
				}
			}
		},

		/**
		 * Return a container element where the mouse cursor should be overriden.
		 *
		 * @param {CKEDITOR.editor} editor Editor's instance.
		 * @return {CKEDITOR.dom.element}
		 * @private
		 */
		_getCursorContainer: function( editor ) {
			// If editor is in inline mode, remove cursor directly from the editable area.
			// Otherwise remove it from the frame's documentElement.
			if ( editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE ) {
				return editor.editable();
			}

			return editor.editable().getParent();
		},

		/**
		 * Creates attributes dictionary for given element.
		 *
		 * @param {CKEDITOR.dom.element} element Element which attributes should be fetched.
		 * @param {Array} exclude Names of attributes to be excluded from dictionary.
		 * @param {Object} Object containing all element's attributes with their values.
		 * @private
		 */
		_getAttributes: function( element, exclude ) {
			var attributes = {},
				attrDefs = element.$.attributes;

			exclude = CKEDITOR.tools.isArray( exclude ) ? exclude : [];

			for ( var i = 0; i < attrDefs.length; i++ ) {
				if ( indexOf( exclude, attrDefs[ i ].name ) === -1 ) {
					attributes[ attrDefs[ i ].name ] = attrDefs[ i ].value;
				}
			}

			return attributes;
		},

		/**
		 * Converts given element into style definition.
		 *
		 * @param {CKEDITOR.dom.element} element Element to be converted.
		 * @returns {Object} Style definition created from the element.
		 * @private
		 */
		_convertElementToStyleDef: function( element ) {
			var tools = CKEDITOR.tools,
				attributes = CKEDITOR.plugins.copyformatting._getAttributes( element,
					CKEDITOR.plugins.copyformatting.excludedAttributes ),
				styles = tools.parseCssText( element.getAttribute( 'style' ), true, true );

			return {
				element: element.getName(),
				type: CKEDITOR.STYLE_INLINE,
				attributes: attributes,
				styles: styles
			};
		},

		/**
		 * Extract styles from given element and its ancestors.
		 *
		 * @param {CKEDITOR.editor} editor Editor's instance.
		 * @param {CKEDITOR.dom.element} element Element which styles should be extracted.
		 * @returns {CKEDITOR.style[]} The array containing all extracted styles.
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
		 * Extract styles from given range.
		 *
		 * @param {CKEDITOR.editor} editor Editor's instance.
		 * @param {CKEDITOR.dom.range} range Range from which styles should be extracted.
		 * @returns {CKEDITOR.style[]} The array containing all extracted styles.
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
		 * Removes all styles from the element in given range without
		 * removing the element itself.
		 *
		 * @param {CKEDITOR.dom.range} range Range in which the element
		 * should be found
		 * @param {String} element Element's tag name.
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
					currentNode.removeAttributes( CKEDITOR.plugins.copyformatting._getAttributes( currentNode ) );

					if ( stopOnFirst ) {
						return;
					}
				}
			}
		},

		/**
		 * Get offsets and start and end containers for selected word.
		 * It handles also cases like lu<span style="color: #f00;">n</span>ar.
		 *
		 * @param {CKEDITOR.dom.range} range Selected range.
		 * @returns {Object} Object with properties:
		 * @returns {CKEDITOR.dom.element} startNode Node in which the word's beginning is located.
		 * @returns {Number} startOffset Offset inside `startNode` indicating word's beginning.
		 * @returns {CKEDITOR.dom.element} endNode Node in which the word's ending is located.
		 * @returns {Number} endOffset Offset inside `endNode` indicating word's ending
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
					boundaryElements = [ 'p', 'br', 'ol', 'ul', 'li', 'td', 'div', 'caption', 'body' ],
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
				// the last occurence of non-word character or node's length.
				// * if we are searching for the beginning of the word, we must move the offset
				// one character to the right (the space is located just before the word).
				// * we must also ensure that the space is not located at the boundary of the node,
				// otherwise we must return next node with appropiate offset.
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
		 * Filter styles before applying.
		 *
		 * @param {CKEDITOR.styles[]} styles Array of styles to be filtered.
		 * @return {CKEDITOR.styles[]} Filtered styles.
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
		 * Determines context of the given selection. For list of possible context values see
		 * `{@link CKEDITOR.config.copyFormatting_allowedContexts}`.
		 *
		 * @param {CKEDITOR.dom.range} range The range that the context can be determined from.
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
		 * Apply styles inside plain text context.
		 *
		 * @param {CKEDITOR.editor} editor Editor's instance.
		 * @param {CKEDITOR.dom.range} range The range that the context can be determined from.
		 * @param {CKEDITOR.style[]} styles Styles to be applied.
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
		 * Apply list's style inside list context.
		 *
		 * @param {CKEDITOR.editor} editor Editor's instance.
		 * @param {CKEDITOR.dom.range} range The range in which styles should be applied.
		 * @param {CKEDITOR.style[]} styles Style to be applied.
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
		 * Apply table's style inside table context.
		 *
		 * @param {CKEDITOR.editor} editor Editor's instance.
		 * @param {CKEDITOR.dom.range} range The range in which styles should be applied.
		 * @param {CKEDITOR.style[]} styles Style to be applied.
		 * @private
		 */
		_applyStylesToTableContext: function( editor, range, styles ) {
			var style,
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
			}
		},


		/**
		 * Apply given styles to currently selected content in the editor.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @param {CKEDITOR.styles[]} newStyles Array of styles to be applied.
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
		 * Puts a message solely for screen readers, meant to provide status updates and so on.
		 *
		 * @param {CKEDITOR.editor} editor
		 * @param {string} msg Name of the message in the lang file.
		 * @private
		 */
		_putScreenReaderMessage: function( editor, msg ) {
			var container = CKEDITOR.document.getBody().findOne( '.cke_copyformatting_notification div[aria-live]' );

			container.setText( editor.lang.copyformatting.notification[ msg ] );
		}
	};

	/**
	 * Define if the "disabled" cursor should be attached to the whole page
	 * when the "Copy Formatting" is active.
	 *
	 *		config.copyFormatting_outerCursor = false;
	 *
	 * @cfg [copyFormatting_outerCursor=true]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_outerCursor = true;

	/**
	 * Defines rules for the elements from which styles should be fetched. If set to `true` will entirely disable
	 * skip filtering.
	 *
	 * This property is using ACF syntax, you can learn more about it in
	 * [Content Filtering Guide](http://docs.ckeditor.com/#!/guide/dev_acf).
	 *
	 *		config.copyFormatting_allowRules = 'span(*)[*]{*}'; // Allow only spans
	 *		config.copyFormatting_allowRules = true; // Disables filtering
	 *
	 * @cfg [copyFormatting_allowRules='b; s; u; strong; span; p; div; table; thead; tbody; ' +
	 *	'tr; td; th; ol; ul; li; (*)[*]{*}']
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_allowRules = 'b s u i em strong span p div td th ol ul li(*)[*]{*}';

	/**
	 * Defines rules for the elements from which fetching styles is explicitly forbidden (eg. widgets).
	 *
	 * This property is using ACF syntax, you can learn more about it in
	 * [Content Filtering Guide](http://docs.ckeditor.com/#!/guide/dev_acf).
	 *
	 *		config.copyFormatting_disallowRules = 'span(important)'; // Disallow spans with important class.
	 *
	 * @cfg [copyFormatting_disallowRules=]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_disallowRules = '*[data-cke-widget*,data-widget*,data-cke-realelement](cke_widget*)';

	/**
	 * Defines which contexts should be enabled in Copy Formatting plugin. Available contexts are:
	 * * `'text' – plain text context
	 * * `'list'` – list context
	 * * `'table'` – table context
	 *
	 *		// If one wants to enable only plain text context.
	 *		config.copyFormatting_allowedContexts = [ 'text' ];
	 *
	 *		// If set to true, will enable all contexts.
	 *		config.copyFormatting_allowedContexts = true;
	 *
	 * @cfg {Boolean/String[]} [copyFormatting_allowedContexts=true]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_allowedContexts = true;

	/**
	 * Defines keystroke for copying styles.
	 *
	 *		config.copyFormatting_keystrokeCopy = CKEDITOR.CTRL + CKEDITOR.SHIFT + 67; // Ctrl+Shift+C
	 *
	 * @cfg {Number} [copyFormatting_keystrokeCopy=CKEDITOR.CTRL + CKEDITOR.SHIFT + 67]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_keystrokeCopy = CKEDITOR.CTRL + CKEDITOR.SHIFT + 67;

	/**
	 * Defines keystroke for applying styles.
	 *
	 *		config.copyFormatting_keystrokePaste = CKEDITOR.CTRL + CKEDITOR.SHIFT + 86; // Ctrl+Shift+V
	 *
	 * @cfg {Number} [copyFormatting_keystrokePaste=CKEDITOR.CTRL + CKEDITOR.SHIFT + 86]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_keystrokePaste = CKEDITOR.CTRL + CKEDITOR.SHIFT + 86;

	/**
	 * Fired when the styles are being extracted from the element.
	 * This event listener job is to extract only needed styles and modify them if needed.
	 *
	 *		editor.copyFormatting.on( 'extractFormatting', function( evt ) {
	 *			evt.data.styleDef.attributes.class = 'important';
	 *		} );
	 *
	 * This event can albo be canceled to indicate that styles from current element should not
	 * be extracted.
	 *
	 *		editor.copyFormatting.on( 'extractFormatting', function( evt ) {
	 *			if ( evt.data.element === 'div' ) {
	 *				evt.cancel();
	 *			}
	 *		} );
	 *
	 * This event has a default listener with a default priority of `10`.
	 * It extracts all styles from element (from all attributes except `id` and from
	 * element's name) and put them as an object into `evt.data.styleDef`.
	 *
	 * @event extractFormatting
	 * @member CKEDITOR.editor.copyFormatting
	 * @param {Object} data
	 * @param {CKEDITOR.dom.element} data.element The element which styles should be fetched.
	 * @param {Object} data.styleDef Style's definition extracted from the element.
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
	 * By default this event has two listeners: the first one with default priority of `10`
	 * and the second with the priority of `999`.
	 * The first one removes all preexisting styles from Copy Formatting destination.
	 * The second one applies all new styles to the current selection.
	 *
	 * @event applyFormatting
	 * @member CKEDITOR.editor.copyFormatting
	 * @param {Object} data
	 * @param {CKEDITOR.dom.range} range Range from the current selection where styling should be applied.
	 * @param {CKEDITOR.style[]} styles Styles to be applied.
	 * @param {Boolean} [data.preventFormatStripping=false] If set to true, will prevent stripping styles from
	 * Copy Formatting destination range.
	 */
} )();

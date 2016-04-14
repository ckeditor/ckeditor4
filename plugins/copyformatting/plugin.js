/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

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

	var indexOf = CKEDITOR.tools.indexOf;

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
				editor: editor
			};
			CKEDITOR.event.implementOn( editor.copyFormatting );

			editor.addCommand( 'copyFormatting', plugin.commands.copyFormatting );
			editor.addCommand( 'applyFormatting', plugin.commands.applyFormatting );

			editor.ui.addButton( 'CopyFormatting', {
				label: editor.lang.copyformatting.label,
				command: 'copyFormatting',
				toolbar: 'cleanup,0'
			} );

			editor.on( 'contentDom', function() {
				var editable = editor.editable(),
					copyFormattingButton = editor.ui.get( 'CopyFormatting' ),
					copyFormattingButtonEl;

				editable.attachListener( editable, 'mouseup', function( evt ) {
					var editor = evt.editor || evt.sender.editor;

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

			editor.setKeystroke( [
				[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 67, 'copyFormatting' ], // Ctrl + Shift + C
				[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 86, 'applyFormatting' ] // Ctrl + Shift + v
			] );

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
				var element = evt.data.element;

				// Stop at body and html in classic editors or at .cke_editable element in inline ones.
				if ( element.contains( editor.editable() ) || element.equals( editor.editable() ) ) {
					return evt.cancel();
				}

				evt.data.styleDef = plugin._convertElementToStyleDef( element );
			} );

			// Remove old styles from element.
			editor.copyFormatting.on( 'applyFormatting', function( evt ) {
				if ( evt.data.preventFormatStripping ) {
					return;
				}

				var oldStyles = plugin._extractStylesFromRange( editor, evt.data.range ),
					i;

				for ( i = 0; i < oldStyles.length; i++ ) {
					if ( CKEDITOR.tools.indexOf( [ 'ul', 'ol', 'li' ], oldStyles[ i ].element ) === -1 ) {
						oldStyles[ i ].remove( evt.editor );
					}
				}
			} );

			// Apply new styles.
			editor.copyFormatting.on( 'applyFormatting', function( evt ) {
				var plugin = CKEDITOR.plugins.copyformatting,
					context = plugin._determineContext( evt.data.range );

				if ( context === 0 ) {
					plugin._applyStylesToTextContext( evt.editor, evt.data.range, evt.data.styles );
				} else {
					plugin._applyStylesToListContext( evt.editor, evt.data.range, evt.data.styles );
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

		commands: {
			copyFormatting: {
				exec: function( editor, data ) {
					var	cmd = this,
						plugin = CKEDITOR.plugins.copyformatting,
						copyFormatting = editor.copyFormatting,
						isFromKeystroke = data ? data.from == 'keystrokeHandler' : false,
						isSticky = data ? ( data.sticky || isFromKeystroke ) : false,
						cursorContainer = plugin._getCursorContainer( editor );

					if ( cmd.state === CKEDITOR.TRISTATE_ON ) {
						copyFormatting.styles = null;
						copyFormatting.sticky = false;

						cursorContainer.removeClass( 'cke_copyformatting_active' );
						CKEDITOR.document.getDocumentElement().removeClass( 'cke_copyformatting_disabled' );

						plugin._putScreenReaderMessage( editor, 'canceled' );

						return cmd.setState( CKEDITOR.TRISTATE_OFF );
					}

					copyFormatting.styles = plugin._extractStylesFromElement( editor,
						editor.elementPath().lastElement );

					cmd.setState( CKEDITOR.TRISTATE_ON );

					if ( !isFromKeystroke ) {
						cursorContainer.addClass( 'cke_copyformatting_active' );

						if ( editor.config.copyFormatting_outerCursor ) {
							CKEDITOR.document.getDocumentElement().addClass( 'cke_copyformatting_disabled' );
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
						CKEDITOR.document.getDocumentElement().removeClass( 'cke_copyformatting_disabled' );

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
				attributes = CKEDITOR.plugins.copyformatting._getAttributes( element, [ 'id', 'style' ] ),
				styles = tools.parseCssText( element.getAttribute( 'style' ), true, true );

			if ( element.getName() === 'a' ) {
				return;
			}

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
					boundaryElements = [ 'p', 'li', 'div', 'body' ],
					isBoundary = false,
					sibling, contents, match, offset;

				do {
					sibling = getSibling( currentNode, isPrev );

					// If there is no sibling, text is probably inside element, so get it
					// and then fetch its sibling.
					while ( !sibling && currentNode.getParent() ) {
						if ( indexOf( boundaryElements, currentNode.getParent().getName() ) !== -1 ) {
							isBoundary = true;
							break;
						}

						currentNode = currentNode.getParent();
						sibling = getSibling( currentNode, isPrev );
					}

					currentNode = sibling;
				} while ( currentNode && currentNode.getStyle &&
					( currentNode.getStyle( 'display' ) == 'none' || !currentNode.getText() ) );

				if ( !currentNode ) {
					currentNode = startNode;
				}

				// If the node is an element, get its text child.
				while ( currentNode.type !== CKEDITOR.NODE_TEXT ) {
					currentNode = currentNode.getChild( 0 );
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
		 * Determines context of the given selection. It can return:
		 * * `0` for text
		 * * `1` for lists
		 *
		 * @param {CKEDITOR.dom.range} range Range from which context
		 * should be determined.
		 * @returns {Number}
		 * @private
		 */
		_determineContext: function( range ) {
			var walker = new CKEDITOR.dom.walker( range ),
				currentNode;

			// Walker sometimes does not include all nodes (e.g. if the range is in the middle of text node).
			if ( range.startContainer.getAscendant( 'ul', true ) || range.startContainer.getAscendant( 'ol', true ) ) {
				return 1;
			}

			while ( ( currentNode = walker.next() ) ) {
				if ( currentNode.getAscendant( 'ul', true ) || currentNode.getAscendant( 'ol', true ) ) {
					return 1;
				}
			}

			return 0;
		},

		/**
		 * Apply styles inside plain text context.
		 *
		 * @param {CKEDITOR.editor} editor Editor's instance.
		 * @param {CKEDITOR.dom.range} range Range in which style
		 * should be applied.
		 * @param {CKEDITOR.style[]} styles Styles to be applied.
		 * @private
		 */
		_applyStylesToTextContext: function( editor, range, styles ) {
			var style,
				i;

			for ( i = 0; i < styles.length; i++ ) {
				style = styles[ i ];

				if ( style.element === 'ol' || style.element === 'ul' ) {
					continue;
				}

				if ( style.element === 'li' ) {
					style.element = style._.definition.element = 'span';
				}

				style.apply( editor );
			}
		},

		/**
		 * Apply list's style inside list context.
		 *
		 * @param {CKEDITOR.editor} editor Editor's instance.
		 * @param {CKEDITOR.dom.range} range Range in which style
		 * should be applied.
		 * @param {CKEDITOR.style[]} styles Style to be applied.
		 * @private
		 */
		_applyStylesToListContext: function( editor, range, styles ) {
			var walker = new CKEDITOR.dom.walker( range ),
				currentNode,
				style,
				i;

			function applyToList( list, style ) {
				if ( list.getName() !== style.element ) {
					list.renameNode( style.element );
				}

				style.applyToObject( list );
			}

			for ( i = 0; i < styles.length; i++ ) {
				style = styles[ i ];

				if ( style.element === 'ol' || style.element === 'ul' ) {
					// Walker sometimes does not include all nodes (e.g. if the range is in the middle of text node).
					if ( ( currentNode = range.startContainer.getAscendant( 'ul', true ) ||
						range.startContainer.getAscendant( 'ol', true ) ) ) {
						applyToList( currentNode, style );
					} else {
						while ( currentNode = walker.next() ) {
							currentNode = currentNode.getAscendant( 'ul', true ) ||
								currentNode.getAscendant( 'ol', true );

							if ( currentNode ) {
								applyToList( currentNode, style );
								break;
							}
						}
					}
				} else if ( style.element === 'li' ) {
					// Walker sometimes does not include all nodes (e.g. if the range is in the middle of text node).
					if ( ( currentNode = range.startContainer.getAscendant( 'li', true ) ) ) {
						style.applyToObject( currentNode );
					}

					while ( currentNode = walker.next() ) {
						currentNode = currentNode.getAscendant( 'li', true );

						if ( currentNode ) {
							style.applyToObject( currentNode );
						}
					}
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

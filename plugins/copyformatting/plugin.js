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

	function generateCursorCss( sizes ) {
		var css = [ 'cursor: ' ];

		function getCoords( multiplier, isSize ) {
			multiplier = isSize ? multiplier / 16 : multiplier;

			var coordX = 12 * multiplier,
				coordY = 1 * multiplier;

			return [ coordX, ' ', coordY ].join( '' );
		}

		// Generate styles for non-Webkit browsers.
		if ( !CKEDITOR.env.webkit ) {
			css.push( 'url(',
				CKEDITOR.env.hidpi ?
					CKEDITOR.getUrl( 'plugins/copyformatting/cursors/cursor-' + sizes[ 1 ] + 'x' + sizes[ 1 ] + '.png' ) :
					CKEDITOR.getUrl( 'plugins/copyformatting/cursors/cursor-' + sizes[ 0 ] + 'x' + sizes[ 0 ] + '.png' ),
				') ',
				getCoords( CKEDITOR.env.hidpi ? sizes[ 1 ] : sizes[ 0 ], true ),
				', auto;' );
		} else {
			var pixelRatio = 1;

			if ( CKEDITOR.document.getWindow().$.devicePixelRatio ) {
				pixelRatio = CKEDITOR.document.getWindow().$.devicePixelRatio;
			}

			// Generate imageset for Webkit browsers.
			css.push( '-webkit-image-set(' );
			for ( var i = 0; i < sizes.length; i++ ) {
				css.push( 'url(',
					CKEDITOR.getUrl( 'plugins/copyformatting/cursors/cursor-' + sizes[ i ] + 'x' + sizes[ i ] + '.png' ),
					') ' + ( sizes[ i ] / sizes[ 0 ] ) + 'x ' );

				if ( i < sizes.length - 1 ) {
					css.push( ', ' );
				}
			}
			css.push( ') ', getCoords( CKEDITOR.document.getWindow().$.devicePixelRatio ), ',auto;' );
		}

		return css.join( '' );
	}

	CKEDITOR.plugins.add( 'copyformatting', {
		lang: 'en',
		icons: 'copyformatting',
		hidpi: true,

		init: function( editor ) {
			var plugin = CKEDITOR.plugins.copyformatting,
				additionalCss = [
					'.cke_copyformatting_active, .cke_copyformatting_active a',
					'{',
					generateCursorCss( [ 16, 32, 64, 128, 256 ] ),
					'}'
				].join( '' );

			CKEDITOR.addCss( additionalCss );

			editor.addCommand( 'copyFormatting', plugin.commands.copyFormatting );
			editor.addCommand( 'applyFormatting', plugin.commands.applyFormatting );

			editor.ui.addButton( 'CopyFormatting', {
				label: editor.lang.copyformatting.label,
				command: 'copyFormatting',
				toolbar: 'cleanup,0'
			} );

			editor.on( 'contentDom', function() {
				var editable = editor.editable(),
					copyFormattingButton =  editor.ui.get( 'CopyFormatting' ),
					copyFormattingButtonEl;

				editable.attachListener( editable, 'mouseup', function( evt ) {
					var editor = evt.editor || evt.sender.editor;

					if ( detectLeftMouseButton( evt ) ) {
						editor.execCommand( 'applyFormatting' );
					}
				} );

				if ( copyFormattingButton ) {
					copyFormattingButtonEl = CKEDITOR.document.getById( copyFormattingButton._.id );

					editable.attachListener( copyFormattingButtonEl, 'dblclick', function() {
						editor.execCommand( 'copyFormatting', { sticky: true } );
					} );
				}
			} );

			editor.setKeystroke( [
				[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 67, 'copyFormatting' ], // Ctrl + Shift + C
				[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 86, 'applyFormatting' ] // Ctrl + Shift + v
			] );
		}
	} );

	CKEDITOR.plugins.copyformatting = {
		commands: {
			copyFormatting: {
				exec: function( editor, data ) {
					var	cmd = this,
						isFromKeystroke = data ? data.from == 'keystrokeHandler' : false,
						isSticky = data ? data.sticky : false;

					if ( !isFromKeystroke && cmd.state === CKEDITOR.TRISTATE_ON ) {
						cmd.styles = null;
						cmd.sticky = false;
						editor.editable().removeClass( 'cke_copyformatting_active' );
						return cmd.setState( CKEDITOR.TRISTATE_OFF );
					}

					cmd.styles = CKEDITOR.plugins.copyformatting._extractStylesFromElement( editor.elementPath().lastElement );

					if ( !isFromKeystroke ) {
						cmd.setState( CKEDITOR.TRISTATE_ON );
						editor.editable().addClass( 'cke_copyformatting_active' );
					}

					cmd.sticky = isSticky;
				}
			},

			applyFormatting: {
				exec: function( editor, data ) {
					var cmd = editor.getCommand( 'copyFormatting' ),
						isFromKeystroke = data ? data.from == 'keystrokeHandler' : false;

					if ( !isFromKeystroke && cmd.state !== CKEDITOR.TRISTATE_ON || !cmd.styles ) {
						return;
					}

					CKEDITOR.plugins.copyformatting._applyFormat( cmd.styles, editor );

					if ( !( cmd.sticky || isFromKeystroke ) ) {
						cmd.styles = null;
						editor.editable().removeClass( 'cke_copyformatting_active' );
						cmd.setState( CKEDITOR.TRISTATE_OFF );
					}
				}
			}
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
				if ( CKEDITOR.tools.indexOf( exclude, attrDefs[ i ].name ) === -1 ) {
					attributes[ attrDefs[ i ].name ] = attrDefs[ i ].value;
				}
			}

			return attributes;
		},

		/**
		 * Converts given element into `{@link CKEDITOR.style}` instance.
		 *
		 * @param {CKEDITOR.dom.element} element Element to be converted.
		 * @returns {CKEDITOR.style} Style created from the element.
		 * @private
		 */
		_convertElementToStyle: function( element ) {
			var attributes = {},
				styles = CKEDITOR.tools.parseCssText( CKEDITOR.tools.normalizeCssText( element.getAttribute( 'style' ), true ) ),
				// From which elements styles shouldn't be copied.
				elementsToExclude = [ 'p', 'div', 'body', 'html' ];

			if ( CKEDITOR.tools.indexOf( elementsToExclude, element.getName() ) !== -1 ) {
				return;
			}

			attributes = CKEDITOR.plugins.copyformatting._getAttributes( element, [ 'style' ] );

			return new CKEDITOR.style( {
				element: element.getName(),
				type: CKEDITOR.STYLE_INLINE,
				attributes: attributes,
				styles: styles
			} );
		},

		/**
		 * Extract styles from given element and its ancestors.
		 *
		 * @param {CKEDITOR.dom.element} element Element which styles should be extracted.
		 * @returns {CKEDITOR.style[]} The array containing all extracted styles.
		 * @private
		 */
		_extractStylesFromElement: function( element ) {
			var styles = [];

			do {
				// Skip all non-elements and bookmarks.
				if ( element.type !== CKEDITOR.NODE_ELEMENT || element.hasAttribute( 'data-cke-bookmark' ) ) {
					continue;
				}

				var style = CKEDITOR.plugins.copyformatting._convertElementToStyle( element );

				if ( style ) {
					styles.push( style );
				}
			} while ( ( element = element.getParent() ) && element.type === CKEDITOR.NODE_ELEMENT );

			return styles;
		},

		/**
		 * Extract styles from given range.
		 *
		 * @param {CKEDITOR.dom.range} range Range from which styles should be extracted.
		 * @returns {CKEDITOR.style[]} The array containing all extracted styles.
		 * @private
		 */
		_extractStylesFromRange: function( range ) {
			var styles = [],
				walker = new CKEDITOR.dom.walker( range ),
				currentNode;

			while ( ( currentNode = walker.next() ) ) {
				styles = styles.concat( CKEDITOR.plugins.copyformatting._extractStylesFromElement( currentNode ) );
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

			// Get node contents without tags.
			function getNodeContents( node ) {
				var html;

				// If the node is element, get its HTML and strip all tags and bookmarks
				// and then search for  word boundaries. In node.getText tags are
				// replaced by spaces, which breaks getting the right offset.
				if ( node.type == CKEDITOR.NODE_ELEMENT ) {
					html = node.getHtml().replace( /<span.*?>&nbsp;<\/span>/g, '' );
					return html.replace( /<.*?>/g, '' );
				}

				return node.getText();
			}

			// Get the word beggining/ending from previous/next node with content (skipping empty nodes and bookmarks)
			function getSiblingNodeOffset( startNode, isPrev ) {
				var getSibling = isPrev ? 'getPrevious' : 'getNext',
					currentNode = startNode,
					regex = /\s/g,
					boundaryElements = [ 'p', 'li', 'div', 'body' ],
					isBoundary = false,
					sibling, contents, match, offset;

				do {
					sibling = currentNode[ getSibling ]();

					// If there is no sibling, text is probably inside element, so get it
					// and then fetch its sibling.
					while ( !sibling && currentNode.getParent() ) {
						if ( CKEDITOR.tools.indexOf( boundaryElements, currentNode.getParent().getName() ) !== -1 ) {
							isBoundary = true;
							break;
						}

						currentNode = currentNode.getParent();
						sibling = currentNode[ getSibling ]();
					}

					currentNode = sibling;
				} while ( currentNode && currentNode.getStyle &&
					( currentNode.getStyle( 'display' ) == 'none' || !currentNode.getText() ) );

				if ( !currentNode ) {
					currentNode = startNode;
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
						regex = /\.([\b]*$)/;
						match = regex.exec( contents );

						offset = match ? match.index : contents.length;
					}
				} else if ( isPrev ) {
					offset += 1;

					if ( offset > contents.length - 1 ) {
						currentNode = currentNode.getNext();
						offset = 0;
					}
				}


				return {
					node: currentNode,
					offset: offset
				};
			}

			contents = node.getText();

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

					// The word probably ends in next node
					if ( endOffset == range.endOffset ) {
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
		 * Apply given styles to currently selected content in the editor.
		 *
		 * @param {CKEDITOR.styles[]} styles Array of styles to be applied.
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @private
		 */
		_applyFormat: function( styles, editor ) {
			var range = editor.getSelection().getRanges()[ 0 ],
				action = styles.length > 0 ? 'apply' : 'remove',
				plugin = CKEDITOR.plugins.copyformatting,
				bkms;

			if ( !range ) {
				return;
			}

			if ( range.collapsed ) {
				var newRange = editor.createRange(),
					word;

				// Create bookmarks only if range is collapsed – otherwise
				// it will break walker used in _extractStylesFromRange.
				bkms = editor.getSelection().createBookmarks();

				if ( !( word = plugin._getSelectedWordOffset( range ) ) ) {
					return;
				}

				newRange.setStart( word.startNode, word.startOffset );
				newRange.setEnd( word.endNode, word.endOffset );
				newRange.select();
			}

			// If styles array is empty, then remove all existing styles.
			if ( styles.length === 0 ) {
				styles = plugin._extractStylesFromRange( newRange || range );
			}

			for ( var i = 0; i < styles.length; i++ ) {
				styles[ i ][ action ]( editor );
			}

			if ( bkms ) {
				editor.getSelection().selectBookmarks( bkms );
			}
		}
	};
} )();

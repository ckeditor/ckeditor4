/* globals CKEDITOR */

( function() {
	var List, Style, filter,
		tools = CKEDITOR.tools,
		invalidTags = [
			'o:p',
			'xml',
			'script',
			'meta',
			'link'
		],
		links = {},
		inComment = 0;

	CKEDITOR.plugins.pastefromword = {};

	CKEDITOR.cleanWord = function( mswordHtml ) {

		// Sometimes Word malforms the comments.
		mswordHtml = mswordHtml.replace( /<!\[/g, '<!--[' ).replace( /\]>/g, ']-->' );

		var fragment = CKEDITOR.htmlParser.fragment.fromHtml( mswordHtml );

		filter = new CKEDITOR.htmlParser.filter( {
			root: function( element ) {
				// filterChildren() tells the filter to work only
				// on the element's current children.
				// This way one can modify the DOM without triggering
				// the filter for each new element.
				element.filterChildren( filter );
				List.createLists( element );
			},
			elementNames: [
				[ ( /^\?xml:namespace$/ ), '' ],
				[ /^v:shapetype/, '' ],
				[ new RegExp( invalidTags.join( '|' ) ), '' ] // Remove invalid tags.
			],
			// Each element is processed through the '^' function, then
			// any matching pattern and finally through the '$' function.
			elements: {
				'a': function( element ) {
					// Redundant anchor created by IE8.
					if ( element.attributes.name ) {
						if ( element.attributes.name == '_GoBack' ) {
							delete element.name;
							return;
						}

						// Garbage links that go nowhere.
						if ( element.attributes.name.match( /^OLE_LINK\d+$/ ) ) {
							delete element.name;
							return;
						}
					}

					if ( element.attributes.href && element.attributes.href.match( /#.+$/ ) ) {
						var name = element.attributes.href.match( /#(.+)$/ )[ 1 ];
						links[ name ] = element;
					}

					if ( element.attributes.name &&  links[ element.attributes.name ] ) {
						var link = links[ element.attributes.name ];
						link.attributes.href = link.attributes.href.replace( /.*#(.*)$/, '#$1' );
					}

				},
				'div': function( element ) {
					Style.createStyleStack( element, filter );
				},
				'img': function( element ) {
					var attributeStyleMap = {
						width: function( value ) {
							Style.setStyle( element, 'width', value + 'px' );
						},
						height: function( value ) {
							Style.setStyle( element, 'height', value + 'px' );
						}
					};

					Style.mapStyles( element, attributeStyleMap );

					if ( element.attributes.src && element.attributes.src.match( /^file:\/\// ) &&
						element.attributes.alt && element.attributes.alt.match( /^https?:\/\// ) ) {
						element.attributes.src = element.attributes.alt;
					}
				},
				'p': function( element ) {
					element.filterChildren( filter );

					if ( element.attributes.style && element.attributes.style.match( /display:\s*none/i ) ) {
						return false;
					}

					if ( List.thisIsAListItem( element ) ) {
						List.convertToFakeListItem( element );
					} else {
						// In IE list level information is stored in <p> elements inside <li> elements.
						var container = element.getAscendant( function( element ) {
								return element.name == 'ul' || element.name == 'ol';
							} ),
							style = tools.parseCssText( element.attributes.style );
						if ( container &&
							!container.attributes[ 'cke-list-level' ] &&
							style[ 'mso-list' ] &&
							style[ 'mso-list' ].match( /level/ ) ) {
							container.attributes[ 'cke-list-level' ] = style[ 'mso-list' ].match( /level(\d+)/ )[1];
						}
					}

					Style.createStyleStack( element, filter );
				},
				'pre': function( element ) {
					if ( List.thisIsAListItem( element ) ) List.convertToFakeListItem( element );

					Style.createStyleStack( element, filter );
				},
				'h1': function( element ) {
					if ( List.thisIsAListItem( element ) ) List.convertToFakeListItem( element );

					Style.createStyleStack( element, filter );
				},
				'font': function( element ) {
					if ( element.getHtml().match( /^\s*$/ ) ) {
						new CKEDITOR.htmlParser.text( ' ' ).insertAfter( element );
						return false;
					}

					createAttributeStack( element, filter );
				},
				'ul': function( element ) {
					// Edge case from 11683 - an unusual way to create a level 2 list.
					if ( element.parent.name == 'li' && tools.indexOf( element.parent.children, element ) === 0 ) {
						Style.setStyle( element.parent, 'list-style-type', 'none' );
					}

					List.dissolveList( element );
					return false;
				},
				'li': function( element ) {
					element.attributes.style = Style.normalizedStyles( element );

					Style.pushStylesLower( element );
				},
				'ol': function( element ) {
					// Fix edge-case where when a list skips a level in IE11, the <ol> element
					// is implicitly surrounded by a <li>.
					if ( element.parent.name == 'li' && tools.indexOf( element.parent.children, element ) === 0 ) {
						Style.setStyle( element.parent, 'list-style-type', 'none' );
					}

					List.dissolveList( element );
					return false;
				},
				'span': function( element ) {
					element.filterChildren( filter );

					element.attributes.style = Style.normalizedStyles( element );

					if ( !element.attributes.style ||
							// Remove garbage bookmarks that disrupt the content structure.
						element.attributes.style.match( /^mso\-bookmark:OLE_LINK\d+$/ ) ||
						element.getHtml().match( /^(\s|&nbsp;)+$/ ) ) {

						// replaceWithChildren doesn't work in filters.
						for ( var i = element.children.length - 1; i >= 0; i-- ) {
							element.children[ i ].insertAfter( element );
						}
						return false;
					}

					Style.createStyleStack( element, filter );
				},
				'table': function( element ) {
					element._tdBorders = {};
					element.filterChildren( filter );

					var borderStyle, occurences = 0;
					for ( var border in element._tdBorders ) {
						if ( element._tdBorders[ border ] > occurences ) {
							occurences = element._tdBorders[ border ];
							borderStyle = border;
						}
					}

					Style.setStyle( element, 'border', borderStyle );

				},
				'td': function( element ) {

					var ascendant = element.getAscendant( 'table' ),
						tdBorders =  ascendant._tdBorders,
						borderStyles = [ 'border', 'border-top', 'border-right', 'border-bottom', 'border-left' ],
						ascendantStyle = tools.parseCssText( ascendant.attributes.style );

					// Sometimes the background is set for the whole table - move it to individual cells.
					var background = ascendantStyle.background || ascendantStyle.BACKGROUND;
					if ( background ) {
						Style.setStyle( element, 'background', background, true );
					}

					var backgroundColor = ascendantStyle[ 'background-color' ] || ascendantStyle[ 'BACKGROUND-COLOR' ];
					if ( backgroundColor ) {
						Style.setStyle( element, 'background-color', backgroundColor, true );
					}

					var styles = tools.parseCssText( element.attributes.style );

					for ( var style in styles ) {
						var temp = styles[ style ];
						delete styles[ style ];
						styles[ style.toLowerCase() ] = temp;
					}

					// Count all border styles that occur in the table.
					for ( var i = 0; i < borderStyles.length; i++ ) {
						if ( styles[ borderStyles[ i ] ] ) {
							var key = styles[ borderStyles[ i ] ];
							tdBorders[ key ] = tdBorders[ key ] ? tdBorders[ key ] + 1 : 1;
						}
					}

					Style.pushStylesLower( element, {
						'background': true
					} );
				},
				'v:imagedata': remove,
				// This is how IE8 presents images.
				'v:shape': function( element ) {
					// In chrome a <v:shape> element may be followed by an <img> element with the same content.
					var duplicate = false;
					element.parent.getFirst( function( child ) {
						if ( child.name == 'img' &&
							child.attributes &&
							child.attributes[ 'v:shapes' ] == element.attributes.id ) {
							duplicate = true;
						}
					} );

					if ( duplicate ) return false;

					var src = '';
					element.forEach( function( child ) {
						if ( child.attributes && child.attributes.src ) {
							src = child.attributes.src;
						}
					}, CKEDITOR.NODE_ELEMENT, true );

					element.filterChildren( filter );

					element.name = 'img';
					element.attributes.src = element.attributes.src || src;

					delete element.attributes.type;
				}
			},
			attributes: {
				'style': function( styles, element ) {
					// Returning false deletes the attribute.
					return Style.normalizedStyles( element ) || false;
				},
				'class': function( classes ) {
					return falseIfEmpty( classes.replace( /msonormal|msolistparagraph\w*/ig, '' ) );
				},
				'cellspacing': remove,
				'cellpadding': remove,
				'border': remove,
				'valign': remove,
				'v:shapes': remove,
				'o:spid': remove
			},
			comment: function( element ) {
				if ( element.match( /\[if.* supportFields.*\]/ ) ) {
					inComment++;
				}
				if ( element == '[endif]' ) {
					inComment = inComment > 0 ? inComment - 1 : 0;
				}
				return false;
			},
			text: function( content ) {
				if ( inComment ) {
					return '';
				}
				return content.replace( /&nbsp;/g, ' ' );
			}
		} );

		var writer = new CKEDITOR.htmlParser.basicWriter();

		filter.applyTo( fragment );
		fragment.writeHtml( writer );

		return writer.getHtml();
	};

	CKEDITOR.plugins.pastefromword.styles = {
		setStyle: function( element, key, value, dontOverwrite ) {
			var styles = tools.parseCssText( element.attributes.style );

			if ( dontOverwrite && styles[ key ] ) {
				return;
			}

			if ( value === '' ) {
				delete styles[ key ];
			} else {
				styles[ key ] = value;
			}

			element.attributes.style = CKEDITOR.tools.writeCssText( styles );
		},

		// Map attributes to styles.
		mapStyles: function( element, attributeStyleMap ) {
			for ( var attribute in attributeStyleMap ) {
				if ( element.attributes[ attribute ] ) {
					if ( typeof attributeStyleMap[ attribute ] === 'function' ) {
						attributeStyleMap[ attribute ]( element.attributes[ attribute ] );
					} else {
						Style.setStyle( element, attributeStyleMap[ attribute ], element.attributes[ attribute ] );
					}
					delete element.attributes[ attribute ];
				}
			}
		},

		normalizedStyles: function( element ) {

			// Some styles and style values are redundant, so delete them.
			var resetStyles = [
					'background-color:transparent',
					'border-image:none',
					'color:windowtext',
					'direction:ltr',
					'mso-',
					'text-indent',
					'visibility:visible',
					'div:border:none' // This one stays because #6241
				],
				matchStyle = function() {
					var keys = [];
					for ( var i = 0; i < arguments.length; i++ ) {
						if ( arguments[ i ] ) {
							keys.push( arguments[ i ] );
						}
					}
					return tools.indexOf( resetStyles, keys.join( ':' ) ) !== -1;
				};

			var styles = tools.parseCssText( element.attributes.style );

			if ( element.name == 'cke:li' ) {
				// IE8 tries to emulate list indentation with a combination of
				// text-indent and left margin. Normalize this. Note that IE8 styles are uppercase.
				if ( styles[ 'TEXT-INDENT' ] && styles.MARGIN ) {
					element.attributes[ 'cke-indentation' ] = List.getElementIndentation( element );
					styles.MARGIN = styles.MARGIN.replace( /(([\w\.]+ ){3,3})[\d\.]+(\w+$)/, '$10$3' );
				}

			}

			var keys = tools.objectKeys( styles );

			for ( var i = 0; i < keys.length; i++ ) {
				var styleName = keys[ i ].toLowerCase(),
					styleValue = styles[ keys[ i ] ];

				if ( matchStyle( null, styleName, styleValue ) ||
					matchStyle( null, styleName.replace( /\-.*$/, '-' ) ) ||
					matchStyle( null, styleName ) ||
					matchStyle( element.name, styleName, styleValue ) ||
					matchStyle( element.name, styleName.replace( /\-.*$/, '-' ) ) ||
					matchStyle( element.name, styleName ) ||
					matchStyle( styleValue )
				) {
					delete styles[ keys[ i ] ];
				}
			}
			return CKEDITOR.tools.writeCssText( styles );
		},

		// Surround the element's children with a stack of spans,
		// each one having one style originally belonging to the element.
		createStyleStack: function( element, filter ) {
			var i,
				children = [];

			element.filterChildren( filter );

			// Store element's children somewhere else.
			for ( i = element.children.length - 1; i >= 0; i-- ) {
				children.unshift( element.children[ i ] );
				element.children[ i ].remove();
			}

			Style.sortStyles( element );

			// Create a stack of spans with each containing one style.
			var styles = tools.parseCssText( Style.normalizedStyles( element ) ),
				innermostElement = element,
				styleTopmost = element.name === 'span'; // Ensure that the root element retains at least one style.

			for ( var style in styles ) {
				if ( style.match( /margin|text\-align|width|border|padding/i ) ) {
					continue;
				}

				if ( styleTopmost ) {
					styleTopmost = false;
					continue;
				}

				var newElement = new CKEDITOR.htmlParser.element( 'span' );

				newElement.attributes.style = style + ':' + styles[ style ];

				innermostElement.add( newElement );
				innermostElement = newElement;

				delete styles[ style ];
			}

			if ( JSON.stringify( styles ) !== '{}' ) {
				element.attributes.style = CKEDITOR.tools.writeCssText( styles );
			} else {
				delete element.attributes.style;
			}

			// Add the stored children to the innermost span.
			for ( i = 0; i < children.length; i++ ) {
				innermostElement.add( children[ i ] );
			}
		},

		// Some styles need to be stacked in a particular order to work properly.
		sortStyles: function( element ) {
			var orderedStyles = [
					'border',
					'border-bottom',
					'font-size',
					'background'
				],
				style = tools.parseCssText( element.attributes.style ),
				keys = tools.objectKeys( style ),
				sortedKeys = [],
				nonSortedKeys = [];

			// Divide styles into sorted and non-sorted, because Array.prototype.sort()
			// requires a transitive relation.
			for ( var i = 0; i < keys.length; i++ ) {
				if ( tools.indexOf( orderedStyles, keys[ i ].toLowerCase() ) !== -1 ) {
					sortedKeys.push( keys[ i ] );
				} else {
					nonSortedKeys.push( keys[ i ] );
				}
			}

			// For styles in orderedStyles[] enforce the same order as in orderedStyles[].
			sortedKeys.sort( function( a, b ) {
				var aIndex = tools.indexOf( orderedStyles, a.toLowerCase() );
				var bIndex = tools.indexOf( orderedStyles, b.toLowerCase() );

				return aIndex - bIndex;
			} );

			keys = [].concat( sortedKeys, nonSortedKeys );

			var sortedStyles = {};

			for ( i = 0; i < keys.length; i++ ) {
				sortedStyles[ keys[ i ] ] = style[ keys[ i ] ];
			}

			element.attributes.style = CKEDITOR.tools.writeCssText( sortedStyles );
		},

		// Moves the element's styles lower in the DOM hierarchy.
		// Returns true on success.
		pushStylesLower: function( element, exceptions ) {
			if ( !element.attributes.style ||
				element.children.length === 0 ) {
				return false;
			}

			exceptions = exceptions || {};

			// Entries ending with a dash match styles that start with
			// the entry name, e.g. 'border-' matches 'border-style', 'border-color' etc.
			var retainedStyles = {
				'list-style-type': true,
				'width': true,
				'border': true,
				'border-': true
			};

			var styles = tools.parseCssText( element.attributes.style );

			for ( var style in styles ) {
				if ( style.toLowerCase() in retainedStyles ||
					retainedStyles [ style.toLowerCase().replace( /\-.*$/, '-' ) ] ||
					style.toLowerCase() in exceptions ) {
					continue;
				}

				var pushed = false;

				for ( var i = 0; i < element.children.length; i++ ) {
					var child = element.children[ i ];

					if ( child.type !== CKEDITOR.NODE_ELEMENT ) {
						continue;
					}

					pushed = true;

					Style.setStyle( child, style, styles[ style ] );
				}

				if ( pushed ) {
					delete styles[ style ];
				}
			}

			element.attributes.style = CKEDITOR.tools.writeCssText( styles );

			return true;
		}
	};
	Style = CKEDITOR.plugins.pastefromword.styles;

	CKEDITOR.plugins.pastefromword.lists = {
		thisIsAListItem: function( element ) {
			/*jshint -W024 */
			// Normally a style of the sort that looks like "mso-list: l0 level1 lfo1"
			// indicates a list element, but the same style may appear in a <p> that's within a <li>.
			if ( ( ( element.attributes.style && element.attributes.style.match( /mso\-list:\s?l\d/ ) ) &&
				element.parent.name !== 'li' ) ||
				element.attributes[ 'cke-dissolved' ] ||
				element.getHtml().match( /<!\-\-\[if !supportLists]\-\->/ ) ||
					// Flat, ordered lists are represented by paragraphs
					// who's text content roughly matches /(&nbsp;)*(.*?)(&nbsp;)+/
					// where the middle parentheses contain the symbol.
				element
					.getHtml()
					.match( /^( )*.*?[\.\)] ( ){2,666}/ )
			) {
				return true;
			}

			return false;
			/*jshint +W024 */
		},

		convertToFakeListItem: function( element ) {
			element.attributes[ 'cke-list-level' ] = element.attributes[ 'cke-list-level' ] ||
				+( ( element.attributes.style || '' ).match( /level(\d+)/ ) || [ '', 1 ] )[ 1 ];

			if ( !element.attributes[ 'cke-dissolved' ] ) {
				// The symbol is the first text node descendant
				// of the element that doesn't start with a whitespace character;
				var symbol;

				element.forEach( function( element ) {

					if ( !symbol && !element.value.match( /^ / ) ) {
						symbol = element.value;
					}
				}, CKEDITOR.NODE_TEXT );

				// Without a symbol this isn't really a list item.
				if ( typeof symbol == 'undefined' ) {
					return;
				}

				element.attributes[ 'cke-symbol' ] = symbol.replace( / .*$/, '' );

				List.removeSymbolText( element );
			}

			// Converting to a normal list item would implicitly wrap the element around an <ul>.
			element.name = 'cke:li';
		},

		convertToRealListItems: function( root ) {
			var listElements = [];
			// Select and clean up list elements.
			root.forEach( function( element ) {
				if ( element.name == 'cke:li' ) {
					element.name = 'li';

					//List.removeSymbolText( element );

					listElements.push( element );
				}
			}, CKEDITOR.NODE_ELEMENT, false );

			return listElements;
		},

		removeSymbolText: function( element ) { // ...from a list element.
			var removed,
				symbol = element.attributes[ 'cke-symbol' ];

			element.forEach( function( node ) {
				if ( !removed && node.value.match( symbol.replace( ')', '\\)' ).replace( '(', '' ) ) ) {

					node.value = node.value.replace( symbol, '' );

					if ( node.parent.getHtml().match( /^(\s|&nbsp;)*$/ ) ) {
						removed = node.parent !== element ? node.parent : null;
					}
				}
			}, CKEDITOR.NODE_TEXT );

			removed && removed.remove();
		},

		setListSymbol: function( list, symbol, level ) {
			level = level || 1;

			var style = tools.parseCssText( list.attributes.style );

			if ( list.name == 'ol' ) {
				if ( list.attributes.type || style[ 'list-style-type' ] ) return;

				var typeMap = {
					'[ivx]': 'lower-roman',
					'[IVX]': 'upper-roman',
					'[a-z]': 'lower-alpha',
					'[A-Z]': 'upper-alpha',
					'\\d': 'decimal'
				};

				for ( var type in typeMap ) {
					if ( symbol.match( new RegExp( type ) ) ) {
						style[ 'list-style-type' ] = typeMap[ type ];
						break;
					}
				}

				list.attributes[ 'cke-list-style-type' ] = style[ 'list-style-type' ];
			} else {
				var symbolMap = {
					'·': 'disc',
					'o': 'circle',
					'§': 'square' // In Word this is a square.
				};

				if ( !style[ 'list-style-type' ] && symbolMap[ symbol ] ) {
					style[ 'list-style-type' ] = symbolMap[ symbol ];
				}

			}

			List.setListSymbol.removeRedundancies( style, level );

			( list.attributes.style = CKEDITOR.tools.writeCssText( style ) ) || delete list.attributes.style;
		},

		setListStart: function( list ) {
			var symbols = [],
				offset = 0;

			for ( var i = 0; i < list.children.length; i++ ) {
				symbols.push( list.children[ i ].attributes[ 'cke-symbol' ] || '' );
			}

			// When a list starts with a sublist, use the next element as a start indicator.
			if ( !symbols[ 0 ] ) {
				offset++;
			}

			// Attribute set in setListSymbol()
			switch ( list.attributes[ 'cke-list-style-type' ] ) {
				case 'lower-roman':
				case 'upper-roman':
					list.attributes.start = List.toArabic( symbols[ offset ] ) - offset;
					break;
				case 'lower-alpha':
				case 'upper-alpha':
					list.attributes.start = ( symbols[offset] ).replace( /\W/g, '' ).toLowerCase().charCodeAt( 0 ) - 96 - offset;
					break;
				case 'decimal':
					list.attributes.start = ( parseInt( List.getSubsectionSymbol( symbols[ offset ] ), 10 ) - offset ) || 1;
					break;
			}

			if ( list.attributes.start == '1' ) {
				delete list.attributes.start;
			}

			delete list.attributes[ 'cke-list-style-type' ];
		},

		// Taking into account cases like "1.1.2." etc. - get the last element.
		getSubsectionSymbol: function( symbol ) {
			return ( symbol.match( /([\da-zA-Z]+).?$/ ) || [ 'placeholder', 1 ] )[ 1 ];
		},

		setListDir: function( list ) {
			var dirs = { ltr: 0, rtl: 0 };

			list.forEach( function( child ) {
				if ( child.name == 'li' ) {
					var dir = child.attributes.dir || child.attributes.DIR || '';
					if ( dir.toLowerCase() == 'rtl' ) {
						dirs.rtl++;
					} else {
						dirs.ltr++;
					}
				}
			}, CKEDITOR.ELEMENT_NODE );

			if ( dirs.rtl > dirs.ltr ) {
				list.attributes.dir = 'rtl';
			}
		},

		createList: function( element ) {
			// "o" symbolizes a circle in unordered lists.
			if ( ( element.attributes[ 'cke-symbol' ].match( /([\da-np-zA-NP-Z]).?/ ) || [] )[ 1 ] ) {
				return new CKEDITOR.htmlParser.element( 'ol' );
			}
			return new CKEDITOR.htmlParser.element( 'ul' );
		},

		createLists: function( root ) {
			var element, level, i, j,
				listElements = List.convertToRealListItems( root );

			if ( listElements.length === 0 ) {
				return;
			}

			// Chop data into continuous lists.
			var lists = List.groupLists( listElements );

			// Create nested list structures.
			for ( i = 0; i < lists.length; i++ ) {
				var list = lists[ i ],
					firstLevel1Element = list[ 0 ];

				// To determine the type of the top-level list a level 1 element is needed.
				for ( j = 0; j < list.length; j++ ) {
					if ( list[ j ].attributes[ 'cke-list-level' ] == 1 ) {
						firstLevel1Element = list[ j ];
						break;
					}
				}

				var	containerStack = [ List.createList( firstLevel1Element ) ],
					innermostContainer = containerStack[ 0 ],
					allContainers = [ containerStack[ 0 ] ];

				innermostContainer.insertBefore( list[ 0 ] );

				for ( j = 0; j < list.length; j++ ) {
					element = list[ j ];

					level = element.attributes[ 'cke-list-level' ];

					while ( level > containerStack.length ) {
						var content = List.createList( element );

						var children = innermostContainer.children;
						if ( children.length > 0 ) {
							children[ children.length - 1 ].add( content );
						} else {
							var container = new CKEDITOR.htmlParser.element( 'li', {
								style: 'list-style-type:none'
							} );
							container.add( content );
							innermostContainer.add( container );
						}

						containerStack.push( content );
						allContainers.push( content );
						innermostContainer = content;

						if ( level == containerStack.length ) {
							List.setListSymbol( content, element.attributes[ 'cke-symbol' ], level );
						}
					}

					while ( level < containerStack.length ) {
						containerStack.pop();
						innermostContainer = containerStack[ containerStack.length - 1 ];

						if ( level == containerStack.length ) {
							List.setListSymbol( innermostContainer, element.attributes[ 'cke-symbol' ], level );
						}
					}

					// For future reference this is where the list elements are actually put into the lists.
					element.remove();
					innermostContainer.add( element );
				}

				// Try to set the symbol for the root (level 1) list.
				var level1Symbol;
				if ( containerStack[ 0 ].children.length ) {
					level1Symbol = containerStack[ 0 ].children[ 0 ].attributes[ 'cke-symbol' ];

					if ( !level1Symbol && containerStack[ 0 ].children.length > 1 ) {
						level1Symbol = containerStack[0].children[1].attributes[ 'cke-symbol' ];
					}

					if ( level1Symbol ) {
						List.setListSymbol( containerStack[ 0 ], level1Symbol );
					}
				}

				// This can be done only after all the list elements are where they should be.
				for ( j = 0; j < allContainers.length; j++ ) {
					List.setListStart( allContainers[ j ] );
				}
			}

			// Final cleanup
			var tempAttributes = [
				'cke-list-level',
				'cke-symbol'
			];

			for ( i = 0; i < listElements.length; i++ ) {
				element = listElements[ i ];

				for ( j = 0; j < tempAttributes.length; j++ ) {
					delete element.attributes[ tempAttributes[ j ] ];
				}
			}
		},

		dissolveList: function( element ) {
			var i, children = [],
				deletedLists = [];

			element.forEach( function( child ) {
				if ( child.name == 'li' ) {
					var childChild = child.children[ 0 ];
					if ( childChild && childChild.name && childChild.attributes.style && childChild.attributes.style.match( /mso-list:/i ) ) {
						Style.pushStylesLower( child, { 'list-style-type': true, 'display': true } );

						var childStyle = tools.parseCssText( childChild.attributes.style, true );

						Style.setStyle( child, 'mso-list', childStyle[ 'mso-list' ], true );
						Style.setStyle( childChild, 'mso-list', '' );

						// If this style has a value it's usually "none". This marks such list elements for deletion.
						if ( childStyle.display || childStyle.DISPLAY ) {
							if ( childStyle.display ) {
								Style.setStyle( child, 'display', childStyle.display, true );
							} else {
								Style.setStyle( child, 'display', childStyle.DISPLAY, true );
							}
						}
					}

					if ( child.attributes.style && child.attributes.style.match( /mso-list:/i ) ) {
						child.name = 'p';

						child.attributes[ 'cke-dissolved' ] = true;

						children.push( child );
					}
				}

				if ( child.name == 'ul' || child.name == 'ol' ) {
					for ( var i = 0; i < child.children.length; i++ ) {
						if ( child.children[ i ].name == 'li' ) {
							var symbol,
								type = child.attributes.type,
								start = parseInt( child.attributes.start, 10 ) || 1;

							if ( !type ) {
								var style = tools.parseCssText( child.attributes.style );
								type = style[ 'list-style-type' ];
							}

							switch ( type ) {
								case 'disc':
									symbol = '·';
									break;
								case 'circle':
									symbol = 'o';
									break;
								case 'square':
									symbol = '§';
									break;
								case '1':
								case 'decimal':
									symbol = ( start + i ) + '.';
									break;
								case 'a':
								case 'lower-alpha':
									symbol = String.fromCharCode( 'a'.charCodeAt( 0 ) + start - 1 + i ) + '.';
									break;
								case 'A':
								case 'upper-alpha':
									symbol = String.fromCharCode( 'A'.charCodeAt( 0 ) + start - 1 + i ) + '.';
									break;
								case 'i':
								case 'lower-roman':
									symbol = toRoman( start + i ) + '.';
									break;
								case 'I':
								case 'upper-roman':
									symbol = toRoman( start + i ).toUpperCase() + '.';
									break;
								default:
									symbol = child.name == 'ul' ? '·' : ( start + i ) + '.';
							}

							child.children[ i ].attributes[ 'cke-symbol' ] = symbol;
						}
					}

					deletedLists.push( child );
				}
			}, CKEDITOR.NODE_ELEMENT, false );

			for ( i = children.length - 1; i >= 0; i-- ) {
				children[ i ].insertAfter( element );
			}
			for ( i = deletedLists.length - 1; i >= 0; i-- ) {
				delete deletedLists[ i ].name;
			}

			function toRoman( number ) {
				if ( number >= 50 ) return 'l' + toRoman( number - 50 );
				if ( number >= 40 ) return 'xl' + toRoman( number - 40 );
				if ( number >= 10 ) return 'x' + toRoman( number - 10 );
				if ( number == 9 ) return 'ix';
				if ( number >= 5 ) return 'v' + toRoman( number - 5 );
				if ( number == 4 ) return 'iv';
				if ( number >= 1 ) return 'i' + toRoman( number - 1 );
				return '';
			}
		},

		groupLists: function( listElements ) {
			// Chop data into continuous lists.
			var i, element,
				lists = [ [ listElements[ 0 ] ] ],
				lastList = lists[ 0 ];

			listElements[ 0 ].attributes[ 'cke-indentation' ] = listElements[ 0 ].attributes[ 'cke-indentation' ] || List.getElementIndentation( listElements[ 0 ] );

			for ( i = 1; i < listElements.length; i++ ) {
				element = listElements[ i ];
				var previous = listElements[ i - 1 ];

				if ( element.previous !== previous ) {

					List.correctListLevels( lastList );

					lists.push( lastList = [] );
				}
				element.attributes[ 'cke-indentation' ] = element.attributes[ 'cke-indentation' ] || List.getElementIndentation( element );

				lastList.push( element );
			}

			List.correctListLevels( lastList );

			return lists;
		},

		getElementIndentation: function( element ) {
			var style = tools.parseCssText( element.attributes.style );

			if ( style.margin || style.MARGIN ) {
				style.margin = style.margin || style.MARGIN;
				var fakeElement = {
					styles: {
						margin: style.margin
					}
				};
				CKEDITOR.filter.transformationsTools.splitMarginShorthand( fakeElement );
				style[ 'margin-left' ] = fakeElement.styles[ 'margin-left' ];
			}

			return parseInt( tools.convertToPx( style[ 'margin-left' ] || '0px' ), 10 );
		},

		correctListLevels: function( list ) {
			var i, j, leftAttrs, rightAttrs, needsCorrection,
				indentations = {};

			for ( i = 0; i < list.length; i++ ) {
				if ( list[ i ].attributes[ 'cke-dissolved' ] ) {
					continue;
				}

				indentations[ list[ i ].attributes[ 'cke-indentation' ] ] = true;
			}

			indentations = tools.objectKeys( indentations );

			for ( i = 0; i < indentations.length; i++ ) {
				indentations[ i ] = parseInt( indentations[ i ], 10 );
			}

			indentations.sort( function( a, b ) {
				return a - b;
			} );

			var levelDifference;
			if ( indentations.length == 1 ) {
				// If there is only one indentation assume the indent width is default - 0.5in.
				var indentation = indentations[ 0 ];
				delete indentations[ 0 ];
				indentations[ Math.floor( indentation / 48 - 0.5 ) ] = indentation;
				levelDifference = 48;
				needsCorrection = true;
			} else {
				var differences = {};

				for ( i = 1; i < indentations.length; i++ ) {
					var key = indentations[ i ] - indentations[ i - 1 ];
					differences[ key ] = differences[ key ] ? differences[ key ] + 1 : 1;
				}

				differences = tools.objectKeys( differences );

				for ( i = 0; i < differences.length; i++ ) {
					differences[ i ] = parseInt( differences[ i ], 10 );
				}

				differences.sort( function( a, b ) {
					return a - b;
				} );

				levelDifference = differences[ 0 ];
			}



			pairComparison:
			for ( i = 0; i < list.length; i++ ) {
				for ( j = 0; j < list.length; j++ ) {
					leftAttrs = list[ i ].attributes;
					rightAttrs = list[ j ].attributes;

					var levelDiff = parseInt( leftAttrs[ 'cke-list-level' ], 10 ) - parseInt( rightAttrs[ 'cke-list-level' ], 10 );
					var indentDiff = parseInt( leftAttrs[ 'cke-indentation' ], 10 ) - parseInt( rightAttrs[ 'cke-indentation' ], 10 );

					if ( Math.abs( indentDiff - levelDiff * levelDifference ) > levelDifference / 2 ) {
						needsCorrection = true;
						break pairComparison;
					}

					//if ( parseInt( leftAttrs[ 'cke-list-level' ] ) >= parseInt( rightAttrs[ 'cke-list-level' ] ) &&
					//	parseInt( leftAttrs[ 'cke-indentation' ] ) < parseInt( rightAttrs[ 'cke-indentation' ] ) ) {
					//	error = true;
					//	break pairComparison;
					//}
				}
			}

			// Corrects list levels if they don't match their indentations.
			if ( needsCorrection ) {
				for ( i = 0; i < list.length; i++ ) {
					if ( list[ i ].attributes[ 'cke-dissolved' ] ) {
						continue;
					}
					list[ i ].attributes[ 'cke-list-level' ] = tools.indexOf( indentations, parseInt( list[ i ].attributes[ 'cke-indentation' ], 10 ) ) + 1;
				}
			}
		},

		// Source: http://stackoverflow.com/a/17534350/3698944
		toArabic: function( symbol ) {
			if ( !symbol.match( /[ivxl]/i ) ) return 0;
			if ( symbol.match( /^l/i ) ) return 50 + List.toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^lx/i ) ) return 40 + List.toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^x/i ) ) return 10 + List.toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^ix/i ) ) return 9 + List.toArabic( symbol.slice( 2 ) );
			if ( symbol.match( /^v/i ) ) return 5 + List.toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^iv/i ) ) return 4 + List.toArabic( symbol.slice( 2 ) );
			if ( symbol.match( /^i/i ) ) return 1 + List.toArabic( symbol.slice( 1 ) );
			// Ignore other characters.
			return List.toArabic( symbol.slice( 1 ) );
		},

		indentationToLevel: function( indentation ) {
			return Math.max( Math.floor( indentation / 48 + 0.5 ), 1 );
		},
			}
		}
	};
	List = CKEDITOR.plugins.pastefromword.lists;

	// Expose this function since it's useful in other places.
	List.setListSymbol.removeRedundancies = function( style, level ) {
		// 'disc' and 'decimal' are the default styles in some cases - remove redundancy.
		if ( ( level === 1 && style[ 'list-style-type' ] === 'disc' ) || style[ 'list-style-type' ] === 'decimal' ) {
			delete style[ 'list-style-type' ];
		}
	};

	function falseIfEmpty( value ) {
		if ( value === '' ) {
			return false;
		}
		return value;
	}

	// Used when filtering attributes - returning false deletes the attribute.
	function remove() {
		return false;
	}

	// Same as createStyleStack, but instead of styles - stack attributes.
	function createAttributeStack( element, filter ) {
		var i,
			children = [];

		element.filterChildren( filter );

		// Store element's children somewhere else.
		for ( i = element.children.length - 1; i >= 0; i-- ) {
			children.unshift( element.children[ i ] );
			element.children[ i ].remove();
		}

		// Create a stack of spans with each containing one style.
		var attributes = element.attributes,
			innermostElement = element,
			topmost = true;

		for ( var attribute in attributes ) {

			if ( topmost ) {
				topmost = false;
				continue;
			}

			var newElement = new CKEDITOR.htmlParser.element( element.name );

			newElement.attributes[ attribute ] = attributes[ attribute ];

			innermostElement.add( newElement );
			innermostElement = newElement;

			delete attributes[ attribute ];
		}

		// Add the stored children to the innermost span.
		for ( i = 0; i < children.length; i++ ) {
			innermostElement.add( children[ i ] );
		}
	}

	var exportedFunctions = {
		createAttributeStack: createAttributeStack,
		createStyleStack: Style.createStyleStack,
		pushStylesLower: Style.pushStylesLower,
		setListSymbol: List.setListSymbol,
		removeSymbolText: List.removeSymbolText,
		sortStyles: Style.sortStyles,
		normalizedStyles: Style.normalizedStyles,
		setListStart: List.setListStart
	};

	for ( var exported in exportedFunctions ) {
		CKEDITOR.cleanWord[ exported ] = exportedFunctions[ exported ];
	}

} )();

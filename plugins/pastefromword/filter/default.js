/* globals CKEDITOR, CKEDITOR_MOCK */

( function( CKEDITOR ) {
	var tools = CKEDITOR.tools,
		invalidTags = [
		'o:p',
		'xml',
		'script',
		'meta',
		'link'
		],
		links = {},
		inComment = 0;

	CKEDITOR.cleanWord = function( mswordHtml ) {

		// Sometimes Word malforms the comments.
		mswordHtml = mswordHtml.replace( /<!\[/g, '<!--[' ).replace( /\]>/g, ']-->' );

		var fragment = CKEDITOR.htmlParser.fragment.fromHtml( mswordHtml );

		var filter = new CKEDITOR.htmlParser.filter( {
			root: function( element ) {
				// filterChildren() tells the filter to work only
				// on the element's current children.
				// This way one can modify the DOM without triggering
				// the filter for each new element.
				element.filterChildren( filter );
				createLists( element );
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
					createStyleStack( element, filter );
				},
				'img': function( element ) {
					var attributeStyleMap = {
						width: function( value ) {
							setStyle( element, 'width', value + 'px' );
						},
						height: function( value ) {
							setStyle( element, 'height', value + 'px' );
						}
					};

					mapStyles( element, attributeStyleMap );

					if ( element.attributes.src && element.attributes.src.match( /^file:\/\// ) &&
						element.attributes.alt && element.attributes.alt.match( /^https?:\/\// ) ) {
						element.attributes.src = element.attributes.alt;
					}
				},
				'p': function( element ) {
					element.filterChildren( filter );

					if ( thisIsAListItem( element ) ) {
						convertToFakeListItem( element );
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

					createStyleStack( element, filter );
				},
				'pre': function( element ) {
					if ( thisIsAListItem( element ) ) convertToFakeListItem( element );

					createStyleStack( element, filter );
				},
				'font': function( element ) {
					createAttributeStack( element, filter );
				},
				'ul': function( element ) {
					// Edge case from 11683 - an unusual way to create a level 2 list.
					if ( element.parent.name == 'li' && tools.indexOf( element.parent.children, element ) === 0 ) {
						setStyle( element.parent, 'list-style-type', 'none' );
					}

					element.filterChildren( filter );

					var style = tools.parseCssText( element.attributes.style );

					setSymbol.removeRedundancies( style, parseInt( element.attributes[ 'cke-list-level' ], 10 ) );

					element.attributes.style = CKEDITOR.tools.writeCssText( style );
				},
				'li': function( element ) {
					element.attributes.style = normalizedStyles( element );

					pushStylesLower( element );
				},
				'ol': function( element ) {
					// Fix edge-case where when a list skips a level in IE11, the <ol> element
					// is implicitly surrounded by a <li>.
					if ( element.parent.name == 'li' && tools.indexOf( element.parent.children, element ) === 0 ) {
						setStyle( element.parent, 'list-style-type', 'none' );
					}

					if ( element.attributes.start == '1' ) {
						delete element.attributes.start;
					}

					pushStylesLower( element );

					element.filterChildren( filter );

					var style = tools.parseCssText( element.attributes.style );

					setSymbol.removeRedundancies( style, parseInt( element.attributes[ 'cke-list-level' ], 10 ) );

					element.attributes.style = CKEDITOR.tools.writeCssText( style );
				},
				'span': function( element ) {
					element.filterChildren( filter );

					element.attributes.style = normalizedStyles( element );

					if ( !element.attributes.style ||
						// Remove garbage bookmarks that disrupt the content structure.
						element.attributes.style.match( /^mso\-bookmark:OLE_LINK\d+$/ ) ||
						element.getHtml().match( /^(\s|&nbsp;)+$/ ) ) {

						// replaceWithChildren doesn't work in filters.
						for ( var i = element.children.length - 1; i >= 0; i-- ) {
							element.children[ i].insertAfter( element );
						}
						return false;
					}

					createStyleStack( element, filter );
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

					setStyle( element, 'border', borderStyle );

				},
				'td': function( element ) {

					var tdBorders =  element.getAscendant( 'table' )._tdBorders,
						borderStyles = [ 'border', 'border-top', 'border-right', 'border-bottom', 'border-left' ];

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

					pushStylesLower( element, {
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
					return falseIfEmpty( normalizedStyles( element ) );
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

	function thisIsAListItem( element ) {
		/*jshint -W024 */
		// Normally a style of the sort that looks like "mso-list: l0 level1 lfo1"
		// indicates a list element, but the same style may appear in a <p> that's within a <li>.
		if ( ( ( element.attributes.style && element.attributes.style.match( /mso\-list:\s?l\d/ ) ) &&
			element.parent.name !== 'li' ) ||
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
	}

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

	function setStyle( element, key, value, dontOverwrite ) {
		var styles = tools.parseCssText( element.attributes.style );

		if ( dontOverwrite && styles[ key ] ) {
			return;
		}

		styles[ key ] = value;

		element.attributes.style = CKEDITOR.tools.writeCssText( styles );
	}

	// Map attributes to styles.
	function mapStyles( element, attributeStyleMap ) {
		for ( var attribute in attributeStyleMap ) {
			if ( element.attributes[ attribute ] ) {
				if ( typeof attributeStyleMap[ attribute ] === 'function' ) {
					attributeStyleMap[ attribute ]( element.attributes[ attribute ] );
				} else {
					setStyle( element, attributeStyleMap[ attribute ], element.attributes[ attribute ] );
				}
				delete element.attributes[ attribute ];
			}
		}
	}

	function normalizedStyles( element ) {
		// Some styles and style values are redundant, so delete them.
		var resetStyles = [
				'background:white',
				'background-color:transparent',
				'border-image:none',
				'line-height:normal',
				'color:black',
				'color:#000000',
				'color:rgb(0, 0, 0)',
				'color:windowtext',
				'font-size:medium',
				'font-style:normal',
				'font-weight:normal',
				'direction:ltr',
				'p:margin-top:1em',
				'p:margin-bottom:1em',
				'0in',
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

		// Various transformations specific to some elements (e.g. list items).
		switch ( element.name ) {
			case 'cke:li':
				// IE8 tries to emulate list indentation with a combination of
				// text-indent and left margin. Normalize this. Note that IE8 styles are uppercase.
				styles[ 'TEXT-INDENT' ] &&
				styles.MARGIN &&
				( styles.MARGIN = styles.MARGIN.replace( /(([\w\.]+ ){3,3})[\d\.]+(\w+$)/, '$10$3' ) );
				break;
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
	}

	function convertToFakeListItem( element ) {
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

		// Converting to a normal list item would implicitly wrap the element around an <ul>.
		element.name = 'cke:li';

		element.attributes[ 'cke-list-level' ] =  +( ( element.attributes.style || '' )
			.match( /level(\d+)/ ) || [ '', 1 ] )[ 1 ];
	}

	function removeListSymbol( element ) { // ...from the element's text content.
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
	}

	function setSymbol( list, symbol, level ) {
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

		setSymbol.removeRedundancies( style, level );

		( list.attributes.style = CKEDITOR.tools.writeCssText( style ) ) || delete list.attributes.style;
	}

	// Expose this function since it's useful in other places.
	setSymbol.removeRedundancies = function( style, level ) {
		// 'disc' and 'decimal' are the default styles in some cases - remove redundancy.
		if ( ( level === 1 && style[ 'list-style-type' ] === 'disc' ) || style[ 'list-style-type' ] === 'decimal' ) {
			delete style[ 'list-style-type' ];
		}
	};

	function setListStart( list ) {
		var symbols = [],
			offset = 0;

		for ( var i = 0; i < list.children.length; i++ ) {
			symbols.push( list.children[ i ].attributes[ 'cke-symbol' ] || '' );
		}

		// When a list starts with a sublist, use the next element as a start indicator.
		if ( !symbols[ 0 ] ) {
			offset++;
		}

		// Attribute set in setSymbol()
		switch ( list.attributes[ 'cke-list-style-type' ] ) {
			case 'lower-roman':
			case 'upper-roman':
				list.attributes.start = toArabic( symbols[ offset ] ) - offset;
				break;
			case 'lower-alpha':
			case 'upper-alpha':
				list.attributes.start = ( symbols[ offset ] ).toLowerCase().charCodeAt( 0 ) - 96 - offset;
				break;
			case 'decimal':
				list.attributes.start = ( parseInt( getSubsectionSymbol( symbols[ offset ] ) , 10 ) - offset ) || 1;
				break;
		}

		if ( list.attributes.start == '1' ) {
			delete list.attributes.start;
		}

		delete list.attributes[ 'cke-list-style-type' ];

		// Source: http://stackoverflow.com/a/17534350/3698944
		function toArabic( symbol ) {
			if ( !symbol.match( /[ivxl]/ ) ) return 0;
			if ( symbol.match( /^l/i ) ) return 50 + toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^lx/i ) ) return 40 + toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^x/i ) ) return 10 + toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^ix/i ) ) return 9 + toArabic( symbol.slice( 2 ) );
			if ( symbol.match( /^v/i ) ) return 5 + toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^iv/i ) ) return 4 + toArabic( symbol.slice( 2 ) );
			if ( symbol.match( /^i/i ) ) return 1 + toArabic( symbol.slice( 1 ) );
		}

		// Taking into account cases like "1.1.2." etc. - get the last element.
		function getSubsectionSymbol( symbol ) {
			return ( symbol.match( /([\da-zA-Z]+).?$/ ) || [ 'placeholder', 1 ] )[ 1 ];
		}
	}

	function createList( element ) {
		if ( ( element.attributes[ 'cke-symbol' ].match( /([\daiIA]).?/ ) || [] )[ 1 ] ) {
			return new CKEDITOR.htmlParser.element( 'ol' );
		}
		return new CKEDITOR.htmlParser.element( 'ul' );
	}

	function createLists( root ) {
		var element, level, i, j;
		var listElements = [];

		// Select and clean up list elements.
		root.forEach( function( element ) {
			if ( element.name == 'cke:li' ) {
				element.name = 'li';

				removeListSymbol( element );

				listElements.push( element );
			}
		}, CKEDITOR.NODE_ELEMENT, false );

		if ( listElements.length === 0 ) {
			return;
		}

		// Chop data into continuous lists.
		var lists = [ [ listElements[ 0 ] ] ];
		var lastList = lists[ 0 ];

		for ( i = 1; i < listElements.length; i++ ) {
			element = listElements[ i ];
			var previous = listElements[ i - 1 ];
			level = element.attributes[ 'cke-list-level' ];

			if ( element.previous !== previous ) {
				lists.push( lastList = [] );
			}

			lastList.push( element );
		}

		// Create nested list structures.
		for ( i = 0; i < lists.length; i++ ) {
			var list = lists[ i ],
				containerStack = [ createList( list[ 0 ] ) ],
				innermostContainer = containerStack[ 0 ],
				allContainers = [ containerStack[ 0 ] ];

			innermostContainer.insertBefore( list[ 0 ] );

			for ( j = 0; j < list.length; j++ ) {
				element = list[ j ];

				level = element.attributes[ 'cke-list-level' ];

				while ( level > containerStack.length ) {
					var content = createList( element );

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
						setSymbol( content, element.attributes[ 'cke-symbol' ], level );
					}
				}

				while ( level < containerStack.length ) {
					containerStack.pop();
					innermostContainer = containerStack[ containerStack.length - 1 ];

					if ( level == containerStack.length ) {
						setSymbol( innermostContainer, element.attributes[ 'cke-symbol' ], level );
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
					level1Symbol = containerStack[ 0 ].children[ 1 ].attributes[ 'cke-symbol' ];
				}

				if ( level1Symbol ) {
					setSymbol( containerStack[ 0 ], level1Symbol );
				}
			}

			// This can be done only after all the list elements are where they should be.
			for ( j = 0; j < allContainers.length; j++ ) {
				setListStart( allContainers[ j ] );
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
	}

	// Surround the element's children with a stack of spans,
	// each one having one style originally belonging to the element.
	function createStyleStack( element, filter ) {
		var i,
			children = [];

		element.filterChildren( filter );

		// Store element's children somewhere else.
		for ( i = element.children.length - 1; i >= 0; i-- ) {
			children.unshift( element.children[ i ] );
			element.children[ i ].remove();
		}

		sortStyles( element );

		// Create a stack of spans with each containing one style.
		var styles = tools.parseCssText( normalizedStyles( element ) ),
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

	// Some styles need to be stacked in a particular order to work properly.
	function sortStyles( element ) {
		var orderedStyles = [
			'border',
			'border-bottom',
			'font-size',
			'background'
		];

		var style = tools.parseCssText( element.attributes.style );

		var keys = tools.objectKeys( style );

		// For styles in orderedStyles[] enforce the same order as in orderedStyles[].
		keys.sort( function( a, b ) {
			var aIndex = tools.indexOf( orderedStyles, a.toLowerCase() );
			var bIndex = tools.indexOf( orderedStyles, b.toLowerCase() );

			if ( aIndex !== -1 && bIndex !== -1 ) {
				return aIndex - bIndex;
			} else {
				if ( a > b ) return 1;
				if ( a < b ) return -1;
				return 0;
			}
		} );

		var sortedStyles = {};

		for ( var i = 0; i < keys.length; i++ ) {
			sortedStyles[ keys[ i ] ] = style[ keys[ i ] ];
		}

		element.attributes.style = CKEDITOR.tools.writeCssText( sortedStyles );
	}

	// Moves the element's styles lower in the DOM hierarchy.
	// Returns true on success.
	function pushStylesLower( element, exceptions ) {
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

				setStyle( child, style, styles[ style ] );
			}

			if ( pushed ) {
				delete styles[ style ];
			}
		}

		element.attributes.style = CKEDITOR.tools.writeCssText( styles );

		return true;
	}

	var exportedFunctions = {
		createAttributeStack: createAttributeStack,
		createStyleStack: createStyleStack,
		pushStylesLower: pushStylesLower,
		setSymbol: setSymbol,
		removeListSymbol: removeListSymbol,
		sortStyles: sortStyles,
		normalizedStyles: normalizedStyles,
		setListStart: setListStart
	};

	for ( var exported in exportedFunctions ) {
		CKEDITOR.cleanWord[ exported ] = exportedFunctions[ exported ];
	}

} )( typeof CKEDITOR_MOCK !== 'undefined' ? CKEDITOR_MOCK : CKEDITOR ); // Testability, yeah!

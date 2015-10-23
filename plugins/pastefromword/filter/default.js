/* globals CKEDITOR, CKEDITOR_MOCK */

( function( CKEDITOR ) {
	var tools = CKEDITOR.tools;
	var invalidTags = [
		'o:p',
		'xml',
		'script',
		'meta',
		'link'
	];

	CKEDITOR.cleanWord = function( mswordHtml ) {

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
				[ new RegExp( invalidTags.join( '|' ) ), '' ] // Remove invalid tags.
			],
			// Each element is processed through the '^' function, then
			// any matching pattern and finally through the '$' function.
			elements: {
				'p': function( element ) {
					if ( thisIsAListItem( element ) ) convertToFakeListItem( element );

					createStyleStack( element, filter );
				},
				'ul': function( element ) {
					var style = tools.parseCssText( element.attributes.style );

					setSymbol.removeRedundancies( style, element.getAscendant( 'ul' ) ? 2 : 1 );

					element.attributes.style = CKEDITOR.tools.writeCssText( style );
				},
				'li': function( element ) {
					pushStylesLower( element );
				},
				'ol': function( element ) {
					pushStylesLower( element );

					var style = tools.parseCssText( element.attributes.style );

					setSymbol.removeRedundancies( style, element.getAscendant( 'ol' ) ? 2 : 1 );

					element.attributes.style = CKEDITOR.tools.writeCssText( style );
				},
				'font': function( element ) {
					element.name = 'span';

					// Either map the attribute name to a style, or supply a function that does all the work.
					var attributeStyleMap = {
						align: 'align',
						color: 'color',
						face: 'font-family',
						size: function( value ) {
							var sizes = [
								'x-small',
								'small',
								'medium',
								'large',
								'x-large',
								'xx-large'
							];
							setStyle( element, 'font-size', sizes[ +value - 1 ] );
						}
					};

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
				},
				'span': function( element ) {

					element.attributes.style = normalizedStyles( element );

					if ( !element.attributes.style ||
						element.getHtml().match( /^(\s|&nbsp;)+$/ ) ) {
						element.replaceWithChildren();
						return;
					}

					createStyleStack( element, filter );
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
				'align': function() {
					return false;
				}
			},
			comment: function() {
				return false;
			},
			text: function( content ) {
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
		if ( tools.checkIfAnyArrayItemMatches( ( element.attributes.class || '' ).split( ' ' ), /MsoListParagraph/ ) ||
			// Flat, ordered lists are represented by paragraphs
			// who's text content roughly matches /(&nbsp;)*(.*?)(&nbsp;)+/
			// where the middle parentheses contain the symbol.
			element
				.getHtml()
				.match( /^(&nbsp;)*.*?\.&nbsp;(&nbsp;){2,666}/ )
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

	function setStyle( element, key, value, dontOverwrite ) {
		var styles = tools.parseCssText( element.attributes.style );

		if ( dontOverwrite && styles[ key ] ) {
			return;
		}

		styles[ key ] = value;

		element.attributes.style = CKEDITOR.tools.writeCssText( styles );
	}

	function normalizedStyles( element ) {
		// Some styles and style values are redundant, so delete them.
		var resetStyles = [
			'background:white',
			'line-height:normal',
			'color:black',
			'color:#000000',
			'color:rgb(0, 0, 0)',
			'font-size:medium',
			'font-style:normal',
			'font-weight:normal',
			'direction:ltr',
			'p:margin-top:1em',
			'p:margin-bottom:1em'
		];
		var resetValues = [
			'0in'
		];

		var styles = tools.parseCssText( element.attributes.style );

		var keys = tools.objectKeys( styles );

		for ( var i = 0; i < keys.length; i++ ) {
			if ( keys[ i ].match( /^(mso\-|margin\-left|text\-indent)/ ) ||
				tools.indexOf( resetValues, styles[ keys[ i ] ] ) !== -1 ||
				tools.indexOf( resetStyles, keys[ i ] + ':' + styles[ keys[ i ] ] ) !== -1 ||
				tools.indexOf( resetStyles, element.name + ':' + keys[ i ] + ':' + styles[ keys[ i ] ] ) !== -1
			) {
				delete styles[ keys[ i ] ];
			}
		}

		return CKEDITOR.tools.writeCssText( styles );
	}

	function convertToFakeListItem( element ) {
		// Converting to a normal list item would implicitly wrap the element around an <ul>.
		element.name = 'cke:li';

		element.attributes[ 'cke-list-level' ] =  +( ( element.attributes.style || '' )
			.match( /level(\d+)/ ) || [ '', 1 ] )[ 1 ];

		// The symbol is the first text node descendant
		// of the element that doesn't start with an &nbsp;
		var symbol;

		element.forEach( function( element ) {
			if ( !symbol && !element.value.match( /^&nbsp;/ ) ) {
				symbol = element.value;
			}
		}, CKEDITOR.NODE_TEXT );

		element.attributes[ 'cke-symbol' ] = symbol.replace( /&nbsp;.*$/, '' );
	}

	function removeListSymbol( element ) { // ...from the element's text content.
		var removed,
			symbol = element.attributes[ 'cke-symbol' ];

		element.forEach( function( node ) {
			if ( !removed && node.value.match( symbol ) ) {

				node.value = node.value.replace( symbol, '' );

				if ( node.value.match( /^(\s|&nbsp;)*$/ ) ) {
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

			switch ( symbol ) {
				case 'a.':
				case 'b.':
					list.attributes.type = 'a';
					break;
				case 'A.':
				case 'B.':
					list.attributes.type = 'A';
					break;
				case 'i.':
				case 'ii.':
					list.attributes.type = 'i';
					break;
				case 'I.':
				case 'II.':
					list.attributes.type = 'I';
					break;
			}
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
		// 'disc' and 'decimal' are the default styles for level 1 lists - remove redundancy.
		if ( level === 1 &&
			( style[ 'list-style-type' ] === 'disc' || style[ 'list-style-type' ] === 'decimal' ) ) {
			delete style[ 'list-style-type' ];
		}
	};

	function createList( element ) {
		if ( ( element.attributes[ 'cke-symbol' ].match( /([\daiIA])\./ ) || [] )[ 1 ] ) {
			return new CKEDITOR.htmlParser.element( 'ol' );
		}
		return new CKEDITOR.htmlParser.element( 'ul' );
	}

	function createLists( root ) {
		var element, level, i, j;
		var listElements = [];

		// Select and clean up list elements.
		for ( i = 0; i < root.children.length; i++ ) {
			element = root.children[ i ];

			if ( element.name == 'cke:li' ) {
				element.name = 'li';

				removeListSymbol( element );

				listElements.push( element );
			}
		}

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
			var list = lists[ i ];
			var containerStack = [ createList( list[ 0 ] ) ];
			var innermostContainer = containerStack[ 0 ];

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
					innermostContainer = content;

					if ( level == containerStack.length ) {
						setSymbol( content, element.attributes[ 'cke-symbol' ] );
					}
				}

				while ( level < containerStack.length ) {
					containerStack.pop();
					innermostContainer = containerStack[ containerStack.length - 1 ];

					if ( level == containerStack.length ) {
						setSymbol( innermostContainer, element.attributes[ 'cke-symbol' ] );
					}
				}

				element.remove();
				innermostContainer.add( element );
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

		// Create a stack of spans with each containing one style.
		var styles = tools.parseCssText( normalizedStyles( element ) ),
			innermostElement = element;

		var keys = tools.objectKeys( styles );
		for ( i = 1; i < keys.length; i++ ) {

			// Don't stack block styles.
			if ( keys[ i ].match( /margin|text\-align/ ) ) {
				continue;
			}

			var newElement = new CKEDITOR.htmlParser.element( 'span' );

			newElement.attributes.style = keys[ i ] + ':' + styles[ keys[ i ] ];

			innermostElement.add( newElement );
			innermostElement = newElement;


			delete styles[ keys[ i ] ];
		}

		element.attributes.style = CKEDITOR.tools.writeCssText( styles );

		// Add the stored children to the innermost span.
		for ( i = 0; i < children.length; i++ ) {
			innermostElement.add( children[ i ] );
		}
	}

	// Moves the element's styles lower in the DOM hierarchy.
	// Returns true on success.
	function pushStylesLower( element ) {
		if ( !element.attributes.style ||
			element.children.length === 0 ) {
			return false;
		}

		var retainedStyles = {
			'list-style-type': true
		};

		var styles = tools.parseCssText( element.attributes.style );

		for ( var style in styles ) {
			if ( style in retainedStyles ) {
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
		createStyleStack: createStyleStack,
		pushStylesLower: pushStylesLower,
		setSymbol: setSymbol,
		removeListSymbol: removeListSymbol
	};

	for ( var exported in exportedFunctions ) {
		CKEDITOR.cleanWord[ exported ] = exportedFunctions[ exported ];
	}

} )( typeof CKEDITOR_MOCK !== 'undefined' ? CKEDITOR_MOCK : CKEDITOR ); // Testability, yeah!

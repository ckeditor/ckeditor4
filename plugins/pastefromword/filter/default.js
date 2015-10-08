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
				},
				'font': function( element ) {
					element.name = 'span';
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
				},
				'color': function( color, element ) {
					setStyle( element, 'color', color );
					return false;
				},
				'face': function( face, element ) {
					setStyle( element, 'font-family', face );
					return false;
				},
				'size': function() {
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
			( ( element
				.children[0] || {} )
				.value || '' )
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
			'color:black'
		];
		var resetValues = [
			'0in'
		];

		var styles = tools.parseCssText( element.attributes.style );

		var keys = tools.objectKeys( styles );

		for ( var i = 0; i < keys.length; i++ ) {
			if ( keys[ i ].match( /^(mso\-|margin\-left|text\-indent)/ ) ||
				tools.indexOf( resetValues, styles[ keys[ i ] ] ) !== -1 ||
				tools.indexOf( resetStyles, keys[ i ] + ':' + styles[ keys[ i ] ] ) !== -1
			) {
				delete styles[ keys[ i ] ];
			}
		}

		return CKEDITOR.tools.writeCssText( styles );
	}

	function convertToFakeListItem( element ) {
		// Converting to a normal list item would implicitly wrap the element around an <ul>.
		element.name = 'cke:li';

		element.attributes[ 'cke-list-level' ] = +( element.attributes.style || 'level1' ).match( /level(\d+)/ )[1];

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
		var symbol = element.attributes[ 'cke-symbol' ];

		element.forEach( function( element ) {
			if ( element.value.match( symbol ) ) {
				element.value = element.value.replace( symbol, '' );
				symbol = '';
			}
		}, CKEDITOR.NODE_TEXT );
	}

	function setSymbol( list, symbol ) {
		if ( list.name == 'ol' ) {
			if ( list.attributes.type ) return;

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
			var style = tools.parseCssText( list.attributes.style );
			var symbolMap = {
				/* '·': 'disc', // This is the default level one symbol. Omitted for clarity. */
				'o': 'circle',
				'§': 'square' // In Word this is a square.
			};

			if ( style[ 'list-style-type' ] || !symbolMap[ symbol ] ) return;

			style[ 'list-style-type' ] = symbolMap[ symbol ];

			list.attributes.style = CKEDITOR.tools.writeCssText( style );
		}
	}

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
} )( typeof CKEDITOR_MOCK !== 'undefined' ? CKEDITOR_MOCK : CKEDITOR ); // Testability, yeah!

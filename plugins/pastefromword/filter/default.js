

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

	// Dummy element used for fail-safe children access.
	var noop = {
		children: []
	};

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
				}
			},
			attributes: {
				'style': function( styles, element ) {
					// Returning false deletes the attribute.
					return falseIfEmpty( normalizedStyles( element ) );
				},
				'class': function( classes ) {
					return falseIfEmpty( classes.replace( /msonormal|msolistparagraph\w*/ig, '' ) );
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
			// that start with a symbol and a series of non-breaking spaces.
			( ( element
				.children[0] || noop )
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

	function normalizedStyles( element ) {
		var styles = tools.parseCssText( element.attributes.style );

		var keys = tools.objectKeys( styles );

		for ( var i = keys.length - 1; i >= 0; i-- ) {
			if ( keys[ i ].match( /^(mso\-|margin\-left|text\-indent)/ ) ) {
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
			if ( !symbol && !element.value.match(/^&nbsp;/) ) {
				symbol = element.value;
				//element.value = symbol.replace(/^.*?(&nbsp;)/, '$1');
			}
		}, CKEDITOR.NODE_TEXT );

		element.attributes[ 'cke-symbol' ] = symbol.replace( /&nbsp;.*$/, '' );
	}

	function removeListSymbol( element ) {
		var symbol = element.attributes[ 'cke-symbol' ];

		element.forEach( function( element ) {
			if ( element.value.match( symbol ) ) {
				element.value = element.value.replace( symbol, '' );
				symbol = '';
			}
		}, CKEDITOR.NODE_TEXT );
	}

	function createListWithSymbol( element ) {
		var symbol;

		if ( symbol = ( element.attributes[ 'cke-symbol' ].match( /([\daiIA])\./ ) || [] )[ 1 ] ) {
			return new CKEDITOR.htmlParser.element( 'ol', {
				type: symbol
			} );
		}

		return new CKEDITOR.htmlParser.element( 'ul', {
			style: 'list-style-type: ' + symbol
		} );
	}

	function createLists( root ) {
		var listElements = [];

		// Select and clean up list elements.
		for ( var i = 0; i < root.children.length; i++ ) {
			var element = root.children[ i ];

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
		var lists = [ [ listElements[0] ] ];
		var lastList = lists[ 0 ];

		for ( i = 1; i < listElements.length; i++ ) {
			element = listElements[ i ];
			var previous = listElements[ i - 1 ];
			var level = element.attributes[ 'cke-list-level' ];

			if ( element.previous !== previous ) {
				lists.push( lastList = [] );
			}

			lastList.push( element );
		}

		for ( i = 0; i < lists.length; i++ ) {
			var list = lists[ i ];
			var containerStack = [ createListWithSymbol( list[ 0 ] ) ];
			var innermostContainer = containerStack[ 0 ];

			innermostContainer.insertBefore( list[0] );

			for ( var j = 0; j < list.length; j++ ) {
				element = list[ j ];

				level = element.attributes[ 'cke-list-level' ];

				while ( level > containerStack.length ) {
					// Create a list nested in a list item
					var container = new CKEDITOR.htmlParser.element( 'li', {
						style: 'list-style-type:none'
					} );
					var content = createListWithSymbol( element );
					container.add( content );

					innermostContainer.add( container );

					containerStack.push( content );
					innermostContainer = content;
				}

				while ( level < containerStack.length ) {
					containerStack.pop();
					innermostContainer = containerStack[ containerStack.length - 1 ];
				}

				element.remove();
				innermostContainer.add( element );
			}
		}
	}
} )( typeof CKEDITOR_MOCK !== 'undefined' ? CKEDITOR_MOCK : CKEDITOR ); // Testability, yeah!

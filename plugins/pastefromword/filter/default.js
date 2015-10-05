

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
				'^': function( element ) {
					/*jshint -W024 */
					if ( tools.checkIfAnyArrayItemMatches( ( element.attributes.class || '' ).split( ' ' ), /MsoListParagraph/ ) ) {
						convertToCkeli( element );
					}
					/*jshint +W024 */
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

	function convertToCkeli( element ) {
		element.name = 'cke:li';
		element.attributes[ 'cke-list-level' ] = +element.attributes.style.match( /level(\d+)/ )[1];
	}

	function createLists( root ) {
		var listElements = [];

		// Select list elements.
		for ( var i = 0; i < root.children.length; i++ ) {
			var element = root.children[ i ];

			if ( element.name == 'cke:li' ) {
				element.name = 'li';
				listElements.push( element );
			}
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
			var containerStack = [ new CKEDITOR.htmlParser.element( 'ul', {} ) ];
			var innermostContainer = containerStack[ 0 ];

			innermostContainer.insertBefore( list[0] );

			for ( var j = 0; j < list.length; j++ ) {
				element = list[ j ];

				level = element.attributes[ 'cke-list-level' ];

				while ( level > containerStack.length ) {
					// Create a list nested in a list element
					var container = new CKEDITOR.htmlParser.element( 'li', {} );
					var content = new CKEDITOR.htmlParser.element( 'ul', {} );
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

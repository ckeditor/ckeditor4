/* bender-tags: editor,dom,range */

( function() {

	'use strict';

	var keys = [ 'width', 'height', 'top', 'bottom', 'left', 'right' ],
		body = CKEDITOR.document.getBody();

	function getHtmlForTest( tagName, innerText ) {
		return '<' + tagName + ' id="test" style="font-size:8px;font-family:Arial;">' + innerText + '</' + tagName + '>';
	}

	function getListToCompare( range ) {
		var nativeRange = new Range();

		nativeRange.setStart( range.startContainer.$, range.startOffset );
		nativeRange.setEnd( range.endContainer.$, range.endOffset );

		return nativeRange.getClientRects();
	}

	function setContainer( item, property ) {
		if ( item[ property ] && typeof item[ property ] === 'function' ) {
			item[ property ] = item[ property ]();
		}
	}

	// Asserts is for IE8, but it should pass on newer browsers.
	function assertFallback( selectionRect, elementRect ) {
		var allowedDifference;

		CKEDITOR.tools.array.forEach( keys, function( key ) {
			// Tested values on various browsers and those are lowest values, that should pass.
			switch ( key ) {
				case 'width':
				case 'right':
					allowedDifference = 3;
					break;

				case 'height':
					allowedDifference = 2;
					break;

				case 'top':
				case 'bottom':
					allowedDifference = 1;
					break;

				default:
					allowedDifference = 0;
			}

			assert.isTrue( Math.abs(
				selectionRect[ key ] - elementRect[ key ] ) <= allowedDifference,
				'Selection rect "' + key + '" shouldn\'t differ from element "' + key + '" more than ' + allowedDifference + ' px'
			);
		} );
	}

	// All newer browsers.
	function testAsserts( rectList, range ) {
		if ( !!CKEDITOR.document.$.getSelection ) {
			var listToCompare = getListToCompare( range );

			rectList.forEach( function( item, index ) {
				CKEDITOR.tools.array.forEach( keys, function( key ) {
					if ( typeof item[ key ] === 'number' ) {
						assert.areSame( item[ key ], listToCompare[ index ][ key ], 'Tested value of : ' + key );
					}
				} );
			} );
		}
	}

	function setupTest( html, testFallback, partial ) {
		var element,
			elementRect,
			range,
			rectList;

		body.appendHtml( html );

		element = body.findOne( '#test' );
		elementRect = element.getClientRect();

		range = new CKEDITOR.dom.range( CKEDITOR.document );

		var text = element.getChildren().getItem( 0 );

		if ( !partial ) {
			range.setStart( text, 0 );
			range.setEnd( text, text.getText().length );
		} else {
			setContainer( partial, 'startContainer' );
			setContainer( partial, 'endContainer' );

			range.setStart( partial.startContainer || text, partial.startOffset );
			range.setEnd( partial.endContainer || text, partial.endOffset );
		}

		rectList = range.getClientRects();

		if ( testFallback ) {
			assertFallback( rectList[ 0 ], elementRect );
		} else if ( !CKEDITOR.document.$.getSelection ) {
			assert.ignore();
		}

		testAsserts( rectList, range );
		element.remove();
	}

	var tests = {
		'test inline element': function() {
			setupTest( getHtmlForTest( 'span', 'test' ), true );
		},
		'test multi-line inline element': function() {
			setupTest( getHtmlForTest( 'span', 'test&#13;test' ), true );
		},
		'test block element': function() {
			setupTest( getHtmlForTest( 'span', 'test' ), true );
		},
		'test multi-line block element': function() {
			setupTest( getHtmlForTest( 'span', 'test&#13;test' ), true );
		},
		'test partial selection': function() {
			setupTest( getHtmlForTest( 'span', 'test' ), false, { startOffset: 1, endOffset: 2 } );
		},
		'test multi-line one line selected': function() {
			setupTest( getHtmlForTest( 'span', 'test&#13;test&#13;test' ), false, { startOffset: 5, endOffset: 9 } );
		},
		'test multi-line all lines partially selected': function() {
			setupTest( getHtmlForTest( 'span', 'test&#13;test&#13;test' ), false, { startOffset: 2, endOffset: 12 } );
		},
		'test multiple elements partial selection': function() {
			setupTest( getHtmlForTest( 'div',
				'<div><p>Test</p></div><div><p id="start_paragraph">test</p></div><div><p>test&#13;test&#13;test</p></div><div><p id="end_paragraph">test test</p></div>' ),
				false, {
				// Those elements aren't yet existing in DOM, just plain text, so I'm wrapping them in function bo get them later.
					startContainer:
						function() {
							return body.findOne( '#start_paragraph' ).getChildren().getItem( 0 );
						},
					endContainer:
						function() {
							return body.findOne( '#end_paragraph' ).getChildren().getItem( 0 );
						},
					startOffset: 2,
					endOffset: 4
				}
			);
		}
	};

	bender.test( tests );
} )();
g

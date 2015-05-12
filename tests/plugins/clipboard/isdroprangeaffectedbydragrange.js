/* bender-ckeditor-plugins: clipboard */

( function() {
	'use strict';
	var tcs = {};


	function splice( elem, idx, rem, s ) {
		return elem.slice( 0, idx ) + s + elem.slice( idx + Math.abs( rem ) );
	}

	function createSnippetOne( dr ) {
		var div = new CKEDITOR.dom.element( 'div' ),
			p = new CKEDITOR.dom.element( 'p' ),
			textNodes = [ 'KOT', 'ALA', 'MA' ];

		div.append( p );

		for ( var i = 0; i < textNodes.length; i++ ) {
			p.appendText( textNodes[ i ] );
		}

		var dragRange = new CKEDITOR.dom.range( p );
		dragRange.setStart( typeof dr.sc === 'number' ? p.getChild( dr.sc ) : p, dr.so );
		dragRange.setEnd( typeof dr.ec === 'number' ? p.getChild( dr.ec ) : p, dr.eo );

		return {
			root: p,
			dragRange: dragRange
		};
	}

	function createSnippetTwo() {
		var div = new CKEDITOR.dom.element( 'div' ),
			p = new CKEDITOR.dom.element( 'p' );

		div.append( p );
		p.appendText( 'KOTMA' );

		var dragRange = new CKEDITOR.dom.range( p );
		dragRange.setStart( p.getChild( 0 ), 1 );
		dragRange.setEnd( p.getChild( 0 ), 3 );

		return {
			root: p,
			dragRange: dragRange
		};
	}

	function createSnippetThree() {
		var p = CKEDITOR.dom.element.createFromHtml( '<div><p>FOO<b>BAR</b>D</p></div>' ).findOne( 'p' );

		var dragRange = new CKEDITOR.dom.range( p );
		dragRange.setStart( p.getChild( 0 ), 1 );
		dragRange.setEnd( p.findOne( 'b' ).getChild( 0 ), 1 );

		return {
			root: p,
			dragRange: dragRange
		};
	}

	// Creates drag range and all provided ranges on element
	// and execute callback provided as a last argument.
	function setupRanges( ranges, element, cb ) {
		var childrenCount = 0;

		for ( var i = 0; i < ranges.length; i++ ) {
			var dropRangeValue = ranges[ i ];

			if ( typeof dropRangeValue === 'string' || dropRangeValue === null ) {
				var dropRange = new CKEDITOR.dom.range( element );

				dropRange.setStart( element, i - childrenCount );
				dropRange.collapse( true );

				//var result = CKEDITOR.plugins.clipboard.isDropRangeAffectedByDragRange( dragRange, dropRange );

				cb( dropRange, dropRangeValue );

				//assert[ ( dropRangeValue === '+' ) ? 'isTrue' : 'isFalse' ]( result );
			} else {
				setupRanges( dropRangeValue, element.getChild( childrenCount++ ), cb  );
			}
		}
	}

	bender.editors = {
		normal: {
			name: 'normal',
			creator: 'replace',
			config: {
				allowedContent: true, // Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
				pasteFilter: null
			}
		}
	};

	( function() {
		//  " K O T " " A [L] A " " M A "
		// ^ ^ ^ ^ ^ ^ ^ ^   ^ ^ ^ ^ ^ ^ ^
		// - - - - - - - -   + + + - - - +
		var snippet = createSnippetOne( { sc: 1, so: 1, ec: 1, eo: 2 } ),
			dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '-', '-', '+', '+' ],
				'+',
				[ '-', '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, snippet.root, function( dropRange, dropRangeValue ) {
			CKEDITOR.tools.extend( tcs, createTestCase( snippet, dropRange, dropRangeValue ) );
		} );
	}() );

	( function() {
		//  " K O T " " [A L A] " " M A "
		// ^ ^ ^ ^ ^ ^ ^       ^ ^ ^ ^ ^ ^
		// - - - - - - -       ? + - - - +
		var snippet = createSnippetOne( { sc: 1, so: 0, ec: 1, eo: 3 } ),
			dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '-', null, null, '?' ],
				'+',
				[ '-', '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, snippet.root, function( dropRange, dropRangeValue ) {
			CKEDITOR.tools.extend( tcs, createTestCase( snippet, dropRange, dropRangeValue ) );
		} );
	}() );

	( function() {
		//  " K O T " " [A L A " ] " M A "
		// ^ ^ ^ ^ ^ ^ ^         ^  ^ ^ ^ ^
		// - - - - - - ?         +  - - - +
		var snippet = createSnippetOne( { sc: 1, so: 0, eo: 2 } ),
			dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '?', null, null, null ],
				'+',
				[ '-', '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, snippet.root, function( dropRange, dropRangeValue ) {
			CKEDITOR.tools.extend( tcs, createTestCase( snippet, dropRange, dropRangeValue ) );
		} );
	}() );

	( function() {
		//  " K O T " " [A L A " " ] M A "
		// ^ ^ ^ ^ ^ ^ ^           ^ ^ ^ ^
		// - - - - - - ?           ? ? ? +
		var snippet = createSnippetOne( { sc: 1, so: 0, ec: 2, eo: 0 } ),
			dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '?', null, null, null ],
				null,
				[ '?', '?', '?' ],
				'+'
			];

		setupRanges( dropRanges, snippet.root, function( dropRange, dropRangeValue ) {
			CKEDITOR.tools.extend( tcs, createTestCase( snippet, dropRange, dropRangeValue ) );
		} );
	}() );



	( function() {
		//  " K O T " [ " A L A " ] " M A "
		// ^ ^ ^ ^ ^  ^           ^  ^ ^ ^ ^
		// - - - - -  ?           +        +
		var snippet = createSnippetOne( { so: 1, eo: 2 } ),
			dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'?',
				[ null, null, null, null ],
				'+',
				[ null, null, null ],
				'+'
			];

		setupRanges( dropRanges, snippet.root, function( dropRange, dropRangeValue ) {
			CKEDITOR.tools.extend( tcs, createTestCase( snippet, dropRange, dropRangeValue ) );
		} );
	}() );

	( function() {
		//  " K O T " " A [L A " ] " M A "
		// ^ ^ ^ ^ ^ ^ ^  ^      ^  ^ ^ ^ ^
		// - - - - - - -  ?      +  - - - +
		var snippet = createSnippetOne( { sc: 1, so: 1, eo: 2 } ),
			dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '-', '?', null, null ],
				'+',
				[ '-', '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, snippet.root, function( dropRange, dropRangeValue ) {
			CKEDITOR.tools.extend( tcs, createTestCase( snippet, dropRange, dropRangeValue ) );
		} );
	}() );

	( function() {
		//  " K O T " " A [L A " " M] A "
		// ^ ^ ^ ^ ^ ^ ^  ^         ^  ^ ^
		// - - - - - - -  ?         +  + +
		var snippet = createSnippetOne( { sc: 1, so: 1, ec: 2, eo: 1 } ),
			dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '-', '?', null, null ],
				null,
				[ null, '+', '+' ],
				'+'
			];

		setupRanges( dropRanges, snippet.root, function( dropRange, dropRangeValue ) {
			CKEDITOR.tools.extend( tcs, createTestCase( snippet, dropRange, dropRangeValue ) );
		} );
	}() );

	( function() {
		//  " K [O T] M A "
		// ^ ^  ^   ^  ^ ^ ^
		// - -  ?   +  + + +
		var snippet = createSnippetTwo(),
			dropRanges = [
				'-',
				[ '-', '?', null, '+', '+', '+' ],
				'+'
			];

		setupRanges( dropRanges, snippet.root, function( dropRange, dropRangeValue ) {
			CKEDITOR.tools.extend( tcs, createTestCase( snippet, dropRange, dropRangeValue ) );
		} );
	}() );

	( function() {
		//  " F [O O " <b> " B] A R " </b> " D "
		// ^ ^  ^             ^  ^ ^ ^    ^ ^ ^ ^
		// - -  ?             +  + + +    + - - +
		var snippet = createSnippetThree(),
			dropRanges = [
				'-',
				[ '-', '-', null, null ],
				null,
				[
					null,
					[ null, '+', '+', '+' ],
					'+'
				],
				'+',
				[ '-', '-', '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, snippet.root, function( dropRange, dropRangeValue ) {
			CKEDITOR.tools.extend( tcs, createTestCase( snippet, dropRange, dropRangeValue ) );
		} );
	}() );

	bender.test( tcs );

	function createTestCase( snippet, dropRange, dropRangeValue ) {
		var testCases = {},
			dragRange = snippet.dragRange,
			element = snippet.root;

		if ( dropRangeValue === null ) {
			return testCases;
		}

		testCases[ prepareTestCaseName( element, dragRange, dropRange ) ] = function() {
			if ( dropRangeValue === '?' ) {
				assert.ignore();
			}

			var result = CKEDITOR.plugins.clipboard.isDropRangeAffectedByDragRange( dragRange, dropRange );

			if ( dropRangeValue === '+' ) {
				assert.isTrue( result );
			} else if ( dropRangeValue === '-' ) {
				assert.isFalse( result );
			}
		};

		return testCases;
	}

	function prepareTestCaseName( element, dragRange, dropRange ) {
		var testName = element.getOuterHtml ? element.getOuterHtml() : element.getText() + ': ';

		var dragStart = splice( dragRange.startContainer.getText(), dragRange.startOffset, 0, '[' );
		var dragEnd = splice( dragRange.endContainer.getText(), dragRange.endOffset, 0, ']' );

		testName = testName + ' ' + dragStart + ' ';
		testName = testName + ' ' + dragEnd + ' ';

		var drop;
		if ( dropRange.startContainer.type === CKEDITOR.NODE_ELEMENT ) {
			drop = 'element: ';
			var prev = dropRange.startContainer.getChild( dropRange.startOffset - 1 );
			drop = drop + ( prev ? prev.getText() : '' );

			drop = drop + '^';

			var next = dropRange.startContainer.getChild( dropRange.startOffset );
			drop = drop + ( next ? next.getText() : '' );
		} else {
			drop = 'text' + splice( dropRange.startContainer.getText(), dropRange.startOffset, 0, '^' );
		}

		return testName + ' ' + drop + ' ';
	}
}() );

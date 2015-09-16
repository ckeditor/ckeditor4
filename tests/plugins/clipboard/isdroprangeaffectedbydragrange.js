/* bender-ckeditor-plugins: clipboard */

( function() {
	'use strict';

	// HOW TO READ THESE TESTS:
	//
	// Tests are generally intended to check function `isDropRangeAffectedByDragRange`.
	// This method is called when internal drop occurs. During this operation there are created two bookmarks:
	// for `dragRange` and `dropRange`. The internal clipboard's function `internalDrop` needs to turn both ranges into
	// bookmarks what creates `span`s, so creating the first bookmark may affect the second range before it is created.
	// As a rescue comes `isDropRangeAffectedByDragRange` which catches such situations and let us handle it properly.

	// Test cases for this file are generated dynamically. It checks all possible `dropRange`s for specific `dragRange`.

	//  " F O " [" A L] "
	// ^ ^ ^ ^ ^       ^ ^
	// - - - - ?       + +

	// In situation above there are two text nodes located in parent node. First content is "FO" and the second one "AL".
	// Drag range start container is between these two text nodes and end container is located in the second text node
	// with offset set to 2.

	// There are seven possible `dropRange` locations each of them is marked with ^ character.
	// In the next line there is an information whether `dragRange` will affect `dropRange` (+). Won't affect (-) and whether
	// Such situation is unclear or is rather not reproducible (?) - this test will be ignored. If null provided then test won't
	// be generated at all.

	// Drag ranges and its results are described in a set of arrays. Above there is an example of situation described above.
	// 	var dropRanges = [
	// 		'-',					// before first text node
	// 		[ '-', '-', '-' ],		// inside first text node
	// 		'?',					// between two text nodes
	// 		[ null, null, '+' ],	// inside second text node
	// 		'+'						// after second text node
	// 	];

	var tcs = {};

	// Inserts "insertion" at index "idx" in "str".
	function splice( str, idx, insertion ) {
		return str.slice( 0, idx ) + insertion + str.slice( idx );
	}

	/*
	 * This is a generic function.
	 * Returns a nested element located in an element provided in the second argument by its address.
	 */
	function getByAddress( elementAddress, element ) {
		elementAddress = elementAddress.slice();

		var index;
		while ( typeof ( index = elementAddress.shift() ) === 'number' ) {
			element = element.getChildren().getItem( index );
		}

		return element;
	}

	function createSnippetOne( dropRangeDesc, dragRangeDesc ) {
		var element = new CKEDITOR.dom.element( 'p' ),
			textNodes = [ 'KOT', 'ALA', 'MA' ],
			tn;

		for ( var i = 0; i < textNodes.length; i++ ) {
			// Do not use appendText here because we do not want IE8 to do any optimisations
			// with the text nodes.
			tn = new CKEDITOR.dom.text( textNodes[ i ] );
			element.append( tn );
		}

		if ( element.getChildCount() != textNodes.length ) {
			throw new Error( 'Houston, we\'ve got a problem with adjacent text nodes' );
		}

		var dragRange = new CKEDITOR.dom.range( element );
		dragRange.setStart( typeof dragRangeDesc.sc === 'number' ? element.getChild( dragRangeDesc.sc ) : element, dragRangeDesc.so );
		dragRange.setEnd( typeof dragRangeDesc.ec === 'number' ? element.getChild( dragRangeDesc.ec ) : element, dragRangeDesc.eo );

		var dropRangeStartContainer = getByAddress( dropRangeDesc.sca, element );

		var dropRange = new CKEDITOR.dom.range( element );
		dropRange.setStart( dropRangeStartContainer, dropRangeDesc.so );
		dropRange.collapse( true );

		return {
			element: element,
			dragRange: dragRange,
			dropRange: dropRange
		};
	}

	function createSnippetTwo( dropRangeDesc ) {
		var element = new CKEDITOR.dom.element( 'p' );

		element.appendText( 'KOTMA' );

		var dragRange = new CKEDITOR.dom.range( element );
		dragRange.setStart( element.getChild( 0 ), 1 );
		dragRange.setEnd( element.getChild( 0 ), 3 );

		var dropRangeStartContainer = getByAddress( dropRangeDesc.sca, element );

		var dropRange = new CKEDITOR.dom.range( element );
		dropRange.setStart( dropRangeStartContainer, dropRangeDesc.so );
		dropRange.collapse( true );

		return {
			element: element,
			dragRange: dragRange,
			dropRange: dropRange
		};
	}

	function createSnippetThree( dropRangeDesc ) {
		var element = CKEDITOR.dom.element.createFromHtml( '<p>FOO<b>BAR</b>D</p>' );

		var dragRange = new CKEDITOR.dom.range( element );
		dragRange.setStart( element.getChild( 0 ), 1 );
		dragRange.setEnd( element.findOne( 'b' ).getChild( 0 ), 1 );

		var dropRangeStartContainer = getByAddress( dropRangeDesc.sca, element );

		var dropRange = new CKEDITOR.dom.range( element );
		dropRange.setStart( dropRangeStartContainer, dropRangeDesc.so );
		dropRange.collapse( true );

		return {
			element: element,
			dragRange: dragRange,
			dropRange: dropRange
		};
	}

	/*
	 * Creates drag range and all provided ranges on element
	 * and execute callback provided as a last argument.
	 */
	function setupRanges( ranges, snippetFactory, snippetArgs, dropContainerAddress, cb ) {
		var childrenCount = 0;

		// Parameter `dropContainerAddress` is optional.
		if ( !cb ) {
			cb = dropContainerAddress;
			dropContainerAddress = [];
		}

		// At the very beginning address is empty which points to a main element.
		dropContainerAddress = dropContainerAddress || [];

		for ( var i = 0; i < ranges.length; i++ ) {
			var dropRangeValue = ranges[ i ];

			if ( typeof dropRangeValue === 'string' || dropRangeValue === null ) {
				var dropContainerIndex = i - childrenCount;
				// Here we can call a `snippetFactory` with an address to element and index.
				// Property `sca` stands for Start Container Address.
				var snippet = snippetFactory( { sca: dropContainerAddress, so: dropContainerIndex }, snippetArgs );

				cb( dropRangeValue, snippet );
			} else {
				// This is a tricky part. We have to modify `marker` to point in which element we are currently on.
				// This variable works together with `dropRangeValue` one.
				// Marker is an address to element. It's constructed from array of indexes.
				// Same as `getAddress` method in `CKEDITOR.dom.element` instance.
				var marker = dropContainerAddress.slice();
				marker.push( childrenCount++ );

				setupRanges( dropRangeValue, snippetFactory, snippetArgs, marker, cb );
			}
		}
	}

	function prepareTestCaseName( suiteName, snippet ) {
		var element = snippet.element,
			dragRange = snippet.dragRange,
			dropRange = snippet.dropRange;

		var testName = element.getOuterHtml ? element.getOuterHtml() : element.getText() + ': ';

		var dragStart = splice( dragRange.startContainer.getText(), dragRange.startOffset, '[' );
		var dragEnd = splice( dragRange.endContainer.getText(), dragRange.endOffset, ']' );

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
			drop = 'text' + splice( dropRange.startContainer.getText(), dropRange.startOffset, '^' );
		}

		return suiteName + ' - ' + testName + ' ' + drop + ' ';
	}

	function createTestCase( suiteName, dropRangeValue, snippet ) {
		var testCases = {},
			dragRange = snippet.dragRange,
			dropRange = snippet.dropRange,
			element = snippet.element,
			testName = prepareTestCaseName( suiteName, snippet );

		if ( dropRangeValue === null ) {
			return testCases;
		}

		testCases[ testName ] = function() {
			var editor = bender.editors.normal,
				editable = editor.editable(),
				clipboard = CKEDITOR.plugins.clipboard,
				dataTransfer = bender.tools.mockNativeDataTransfer();

			dataTransfer.isEmpty = function() {
				return true;
			};

			if ( dropRangeValue === '?' ) {
				assert.ignore();
			}

			editable.setHtml( '<p>tmp</p>' );
			editable.append( element );

			// This function doesn't modify nothing.
			var result = clipboard.isDropRangeAffectedByDragRange( dragRange, dropRange );

			if ( dropRangeValue === '+' ) {
				assert.isTrue( result, 'isDropRAffectedByDragR returned true' );
			} else if ( dropRangeValue === '-' ) {
				assert.isFalse( result, 'isDropRAffectedByDragR returned false' );
			}

			// Should not throw. Then most likely it works (it has its own tests too of course).
			clipboard.internalDrop( dragRange, dropRange, dataTransfer, bender.editors.normal );
		};

		return testCases;
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

	// TC1.
	( function() {
		//  " K O T " " A [L] A " " M A "
		// ^ ^ ^ ^ ^ ^ ^ ^   ^ ^ ^ ^ ^ ^ ^
		// - - - - - - - -   + + + - - - +
		var dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '-', '-', '+', '+' ],
				'+',
				[ '-', '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, createSnippetOne, { sc: 1, so: 1, ec: 1, eo: 2 }, function( dropRange, snippet ) {
			CKEDITOR.tools.extend( tcs, createTestCase( 'tc1', dropRange, snippet ) );
		} );
	}() );

	// TC2.
	( function() {
		//  " K O T " " [A L A] " " M A "
		// ^ ^ ^ ^ ^ ^ ^       ^ ^ ^ ^ ^ ^
		// - - - - - - ?       + + - - - +
		//
		// The "?" case may be extremely tricky due to details of createBookmark()'s and insertNode()'s implementations.
		// Depending on where the bm spans will be inserted, the drop range may need a very special handling so it does not end
		// up inside drag range. insertNode() may split "ALA" on index `0` leaving "" and "ALA" or it may insert span
		// before that text node (what leaves drop range inside drag range!).
		// Given these doubts and very little chance of this case happening in real world, we ignore this TC.
		var dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '?', null, null, '+' ],
				'+',
				[ '-', '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, createSnippetOne, { sc: 1, so: 0, ec: 1, eo: 3 }, function( dropRange, snippet ) {
			CKEDITOR.tools.extend( tcs, createTestCase( 'tc2', dropRange, snippet ) );
		} );
	}() );

	// TC3.
	( function() {
		//  " K O T " " [A L A " ] " M A "
		// ^ ^ ^ ^ ^ ^ ^         ^  ^ ^ ^ ^
		// - - - - - - ?         +  - - - +
		//
		// See the comment in 2nd TC.
		var dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '?', null, null, null ],
				// See fixSplitNodesAfterDrop. It doesn't cover case like this one
				// because it isn't fully realistic, so it brokes the drag range and this tc fails.
				( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ? '?' : '+' ),
				[ '-', '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, createSnippetOne, { sc: 1, so: 0, eo: 2 }, function( dropRange, snippet ) {
			CKEDITOR.tools.extend( tcs, createTestCase( 'tc3', dropRange, snippet ) );
		} );
	}() );

	// TC4.
	( function() {
		//  " K O T " " [A L A " " ] M A "
		// ^ ^ ^ ^ ^ ^ ^            ^ ^ ^ ^
		// - - - - - - ?            ? + + +
		//
		// See the comment in 2nd TC.
		// As for "+" in "MA" - we do not know if drop range will affect drag range, but at the same time
		// we can be sure that drop bookmarks will not affect drag range, so we want the method to return `true`,
		// to force serving drop range first.
		var dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '?', null, null, null ],
				null,
				[ '?', '+', '+' ],
				'+'
			];

		setupRanges( dropRanges, createSnippetOne, { sc: 1, so: 0, ec: 2, eo: 0 }, function( dropRange, snippet ) {
			CKEDITOR.tools.extend( tcs, createTestCase( 'tc4', dropRange, snippet ) );
		} );
	}() );

	// TC5.
	( function() {
		//  " K O T " [ " A L A " ] " M A "
		// ^ ^ ^ ^ ^  ^           ^  ^ ^ ^ ^
		// - - - - -  ?           +  - - - +
		//
		// See the comment in 2nd TC.
		var dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'?',
				[ null, null, null, null ],
				'+',
				[ '-', '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, createSnippetOne, { so: 1, eo: 2 }, function( dropRange, snippet ) {
			CKEDITOR.tools.extend( tcs, createTestCase( 'tc5', dropRange, snippet ) );
		} );
	}() );

	// TC6.
	( function() {
		//  " K O T " " A [L A " ] " M A "
		// ^ ^ ^ ^ ^ ^ ^  ^      ^  ^ ^ ^ ^
		// - - - - - - -  -      +  - - - +
		var dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '-', '-', null, null ],
				'+',
				[ '-', '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, createSnippetOne, { sc: 1, so: 1, eo: 2 }, function( dropRange, snippet ) {
			CKEDITOR.tools.extend( tcs, createTestCase( 'tc6', dropRange, snippet ) );
		} );
	}() );

	// TC7.
	( function() {
		//  " K O T " " A [L A " " M] A "
		// ^ ^ ^ ^ ^ ^ ^  ^         ^  ^ ^
		// - - - - - - -  -         +  + +
		var dropRanges = [
				'-',
				[ '-', '-', '-', '-' ],
				'-',
				[ '-', '-', null, null ],
				null,
				[ null, '+', '+' ],
				'+'
			];

		setupRanges( dropRanges, createSnippetOne, { sc: 1, so: 1, ec: 2, eo: 1 }, function( dropRange, snippet ) {
			CKEDITOR.tools.extend( tcs, createTestCase( 'tc7', dropRange, snippet ) );
		} );
	}() );

	// TC8.
	( function() {
		//  " K [O T] M A "
		// ^ ^  ^   ^  ^ ^ ^
		// - -  -   +  + + +
		var dropRanges = [
				'-',
				[ '-', '-', null, '+', '+', '+' ],
				'+'
			];

		setupRanges( dropRanges, createSnippetTwo, undefined, function( dropRange, snippet ) {
			CKEDITOR.tools.extend( tcs, createTestCase( 'tc8', dropRange, snippet ) );
		} );
	}() );

	// TC9.
	( function() {
		//  " F [O O " <b> " B] A R " </b> " D "
		// ^ ^  ^             ^  ^ ^ ^    ^ ^ ^ ^
		// - -  -             +  + + +    + - - +
		var dropRanges = [
				'-',
				[ '-', '-', null, null ],
				null,
				[
					null,
					[ null, '+', '+', '+' ],
					'+'
				],
				'+',
				[ '-', '-' ],
				'+'
			];

		setupRanges( dropRanges, createSnippetThree, undefined, function( dropRange, snippet ) {
			CKEDITOR.tools.extend( tcs, createTestCase( 'tc9', dropRange, snippet ) );
		} );
	}() );

	bender.test( tcs );
}() );

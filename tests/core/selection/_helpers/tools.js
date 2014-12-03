/* global rangy */
/* exported testSelection, testSelectedElement, testSelectedText, testStartElement, assertSelectionsAreEqual */

var tools = bender.tools,
	doc = CKEDITOR.document;

/**
 *  Make document selection within the sandbox with specified range denote.
 * @param markup
 */
function makeSelection( markup ) {
	var container = doc.getById( 'sandbox' );
	return tools.setHtmlWithSelection( container, markup ).getRanges();
}

function makeRanges( markup ) {
	var container = doc.getById( 'sandbox' );
	return tools.setHtmlWithRange( container, markup );
}

/**
 * Test retrieve/select range in a row with the source range specified by the range denote.
 * @param markup {String}
 */
function testSelection( markup ) {
	// WebKit fails on batch running without this.
	CKEDITOR.env.webkit && doc.focus();

	var sourceRanges = makeRanges( markup );
	var domSel = rangy.getSelection();
	var i, range, length;

	// Clear out current selection.
	domSel.removeAllRanges();

	// Make the selection.
	for ( i = 0, range, length = sourceRanges.length; range = sourceRanges[ i ], i < length; i++ ) {
		domSel.addRange( convertRange( range ) );
	}

	/* Test selection::getRanges */
	var sel = doc.getSelection(), readRanges = sel.getRanges();
	for ( i = 0, length = readRanges.length; i < length; i++ )
		assert.isTrue( checkRangeEqual( readRanges[ i ], sourceRanges[ i ] ), 'get ranges result doesn\'t match original on selection: ' + markup );

	/* Test selection::selectRanges */
	sel.selectRanges( sourceRanges );

	// Retrieve the updated ranges after hand.
	var madeRanges = sel.getRanges();
	for ( i = 0; i < domSel.rangeCount; i++ )
		assert.isTrue( checkRangeEqual( sourceRanges[ i ], madeRanges[ i ] ), 'select ranges result doesn\'t match original on selection: ' + markup );
}

function testSelectedElement( markup, tag ) {
	makeSelection( markup );
	var sel = doc.getSelection(), selected = sel.getSelectedElement();
	assert.isTrue( selected && selected.is( tag ), 'selected element doesn\'t match on selection: ' + markup );
}

function testSelectedText( markup, text ) {
	makeSelection( markup );
	var sel = doc.getSelection(), selectedText = sel.getSelectedText();
	assert.areSame( text, selectedText, 'selected text doesn\'t match on selection: ' + markup );
}

function testStartElement( markup, tag ) {
	makeSelection( markup );
	var sel = doc.getSelection(), startElement = sel.getStartElement();
	assert.isTrue( startElement.is( tag ), 'start element doesn\'t match on selection: ' + markup );
}

/**
 * Convert between CKEDITOR.dom.range and Rangy range.
 * @param range {CKEDITOR.dom.range|Rangy range}
 */
function convertRange( range ) {
	var rng;

	if ( range instanceof CKEDITOR.dom.range ) {
		rng = rangy.createRange( range.document.$ );
		rng.setStart( range.startContainer.$, range.startOffset );
		rng.setEnd( range.endContainer.$, range.endOffset );
	} else {
		rng = new CKEDITOR.dom.range( new CKEDITOR.dom.document( range.getDocument() ) );
		rng.setStart( new CKEDITOR.dom.node( range.startContainer ), range.startOffset );
		rng.setEnd( new CKEDITOR.dom.node( range.endContainer ), range.endOffset );
	}

	return rng;
}

/**
 * Check the (visual) equivalence of  the specified two ranges,
 * two ranges are considered equivalent if they'll produce the same
 * selection, e.g. the following two ranges are considered as identical:
 * <code><p><strong>foo^</strong>bar</p></code>
 * <code><p><strong>foo</strong>^bar</p></code>
 *
 * @param {CKEDITOR.dom.range} one
 * @param {CKEDITOR.dom.range} theOther
 */
function checkRangeEqual( one, theOther ) {
	one = convertRange( one );
	theOther = convertRange( theOther );
	var $ = CKEDITOR.dom.node;

	var equals = true,
		walker = new CKEDITOR.dom.walker(),
		walkerRange = new CKEDITOR.dom.range(
		one instanceof CKEDITOR.dom.range ? one.document :
		new CKEDITOR.dom.document( one.getDocument() ) );

	// Check the measure range doesn't spans over actual content.
	walker.guard = function( node, isOut ) {
		if ( !isOut && node.type == CKEDITOR.NODE_ELEMENT )
				walker.currentElement = node;

		// Must not walk across block boundaries.
		if ( isOut && node.type == CKEDITOR.NODE_ELEMENT && node.isBlockBoundary() )
			equals = false;
		// Stop when we're encountering a text node (filler and empty text nodes are excluded)
		// or when we've already walked "through" an element.
		else if ( node.type == CKEDITOR.NODE_TEXT ?
			CKEDITOR.tools.trim( node.getText() ).length && node.getText() != '\u200B' :
			isOut && ( node.equals( walker.currentElement ) ) ) {
			equals = false;
		}
	};

	// Create a measuring range based on the comparison result
	// on the start point of the two ranges.
	var start = one.compareBoundaryPoints( 0, theOther );		/*Range.START_TO_START*/

	if ( start ) {
		walkerRange.setStart( $( start < 0 ? one.startContainer : theOther.startContainer ),
			start < 0 ? one.startOffset : theOther.startOffset );
		walkerRange.setEnd( $( start > 0 ? one.startContainer : theOther.startContainer ),
			start > 0 ? one.startOffset : theOther.startOffset );

		walker.range = walkerRange;
		walker.lastForward();
	}

	if ( equals && !( one.collapsed && theOther.collapsed ) ) {
		var end = one.compareBoundaryPoints( 2, theOther );	/*Range.END_TO_END*/

		if ( end ) {
			walkerRange.setStart( $( end < 0 ? one.endContainer : theOther.endContainer ),
				end < 0 ? one.endOffset : theOther.endOffset );
			walkerRange.setEnd( $( end > 0 ? one.endContainer : theOther.endContainer ),
				end > 0 ? one.endOffset : theOther.endOffset );

			walker.reset();
			delete walker.currentElement;
			walker.range = walkerRange;
			walker.lastForward();
		}
	}

	return equals;
}

function checkSelection( type, startElement, selectedElement, selectedText, ranges ) {
	type !== false && assert.areSame( type, this.getType(), 'check selection type failed' );
	startElement !== false && assert.areSame( startElement, this.getStartElement(), 'check selection start element failed' );
	selectedElement !== false && assert.areSame( selectedElement, this.getSelectedElement(), 'check selection selected element failed' );
	selectedText !== false && assert.areSame( selectedText, this.getSelectedText(), 'check selection selected text failed' );

	// Check through each range or only the range count.
	var selRanges = this.getRanges();
	if ( ranges.length ) {
		for ( var i = 0; i < selRanges.length; i++ )
			assert.isTrue( checkRangeEqual( ranges[ i ], selRanges[ i ] ), 'check selection range failed at position:' + i );
	} else if ( typeof ranges == 'number' ) {
		assert.areSame( ranges, selRanges.length, 'selection ranges count failed' );
	}
}

function assertSelectionsAreEqual( sel1, sel2 ) {
	checkSelection.call( sel1, sel2.getType(), sel2.getStartElement(),
		sel2.getSelectedElement(), sel2.getSelectedText(), sel2.getRanges() );
}

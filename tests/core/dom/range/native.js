( function() {
	'use strict';

	bender.test( {
		// #11586
		'test range.cloneContents does not split text nodes': function() {
			if ( typeof document.createRange != 'function' ) {
				assert.ignore();
			}

			var root = document.createElement( 'div' ),
				range = document.createRange();

			root.innerHTML = 'foo<b>bar</b>';

			var startContainer = root.firstChild,
				endContainer = root.lastChild.firstChild;

			range.setStart( startContainer, 2 ); // fo[o
			range.setEnd( endContainer, 1 ); // b]ar

			range.cloneContents();

			assert.areSame( 'foo', root.firstChild.nodeValue, 'startContainer was not split' );
			assert.areSame( 'bar', root.lastChild.firstChild.nodeValue, 'endContainer was not split' );
			assert.areSame( startContainer, range.startContainer, 'startContainer ref' );
			assert.areSame( endContainer, range.endContainer, 'endContainer ref' );
		},

		// #11586
		'test range.cloneContents does not affect selection': function() {
			if ( typeof document.createRange != 'function' ) {
				assert.ignore();
			}

			var root = document.createElement( 'div' ),
				range = document.createRange();

			document.body.appendChild( root );

			root.innerHTML = 'foo<b>bar</b>';

			var startContainer = root.firstChild,
				endContainer = root.lastChild.firstChild;

			range.setStart( startContainer, 2 ); // fo[o
			range.setEnd( endContainer, 1 ); // b]ar

			var sel = document.getSelection();
			sel.removeAllRanges();
			sel.addRange( range );

			range.cloneContents();

			assert.areSame( 1, sel.rangeCount, 'rangeCount' );
			range = sel.getRangeAt( 0 );

			assert.areSame( startContainer, range.startContainer, 'startContainer' );
			assert.areSame( 2, range.startOffset, 'startOffset' );
			assert.areSame( endContainer, range.endContainer, 'endContainer' );
			assert.areSame( 1, range.endOffset, 'endOffset' );
		}

		// Turns out that FF and Chrome clone the 0-length text node and IE does not.
		// 'test range.cloneContents - text boundary': function() {
		// 	if ( typeof document.createRange != 'function' ) {
		// 		assert.ignore();
		// 	}

		// 	var root = document.createElement( 'div' ),
		// 		range = document.createRange();

		// 	root.innerHTML = 'foo<b>bar</b>';

		// 	var startContainer = root.firstChild,
		// 		endContainer = root.lastChild.firstChild;

		// 	range.setStart( startContainer, 3 ); // foo[
		// 	range.setEnd( endContainer, 1 ); // b]ar

		// 	var clone = range.cloneContents(),
		// 		firstChild = clone.firstChild;

		// 	assert.areSame( CKEDITOR.NODE_TEXT, firstChild.nodeType, 'is text node' );
		// 	assert.areSame( '', firstChild.nodeValue, 'text node is empty' );
		// },
	} );
} )();
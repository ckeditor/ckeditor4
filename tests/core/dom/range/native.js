( function() {
	'use strict';

	bender.test( {
		// https://dev.ckeditor.com/ticket/11586
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

		// https://dev.ckeditor.com/ticket/11586
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
		},

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

		'test range.cloneContents clone empty boundary nodes': function() {
			if ( typeof document.createRange != 'function' ) {
				assert.ignore();
			}

			var root = document.createElement( 'div' ),
				range = document.createRange();

			root.innerHTML = 'x<h1></h1><p>foo</p><h2></h2>y';

			range.setStart( root.childNodes[ 1 ], 0 ); // <h1>[</h1>
			range.setEnd( root.childNodes[ 3 ], 0 ); // <h2>]</h2>

			var clone = range.cloneContents(),
				tmp = document.createElement( 'div' );

			tmp.appendChild( clone );

			assert.areSame( '<h1></h1><p>foo</p><h2></h2>', tmp.innerHTML );
		},

		'test range.extractContents clone empty boundary nodes': function() {
			if ( typeof document.createRange != 'function' ) {
				assert.ignore();
			}

			var root = document.createElement( 'div' ),
				range = document.createRange();

			root.innerHTML = 'x<h1></h1><p>foo</p><h2></h2>y';

			range.setStart( root.childNodes[ 1 ], 0 ); // <h1>[</h1>
			range.setEnd( root.childNodes[ 3 ], 0 ); // <h2>]</h2>

			var clone = range.extractContents(),
				tmp = document.createElement( 'div' );

			tmp.appendChild( clone );

			assert.areSame( '<h1></h1><p>foo</p><h2></h2>', tmp.innerHTML, 'extracted fragment' );
			assert.areSame( 'x<h1></h1><h2></h2>y', root.innerHTML, 'after extraction' );
			// <h1></h1>[]<h2></h2>
			assert.areSame( root, range.startContainer, 'startContainer' );
			assert.areSame( 2, range.startOffset, 'startOffset' );
		}
	} );
} )();

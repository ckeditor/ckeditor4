/* bender-tags: editor,unit,dom */

( function() {
	'use strict';

	var getOuterHtml = function( element ) {
			return bender.tools.fixHtml( element.getOuterHtml() );
		},
		$ = function( id ) {
			return CKEDITOR.document.getById( id );
		},
		$tn = function( tagName ) {
			return document.getElementsByTagName( tagName );
		},
		newNode = function( element ) {
			return new CKEDITOR.dom.node( element );
		},
		newElement = function( element, ownerDocument ) {
			return new CKEDITOR.dom.element( element, ownerDocument );
		},
		newComment = function( text ) {
			return newNode( document.createComment( text ) );
		},
		newTextNode = function( text ) {
			return newNode( document.createTextNode( text ) );
		},
		getNodeByTagName = function( tagName, i ) {
			return newNode( $tn( tagName )[ typeof i === 'undefined' ? 0 : i ] );
		},
		createGetIndexTest = function( test ) {
			var wrapper = newElement( 'div' ),
				token;

			test = test.split( ',' );

			while ( ( token = test.shift() ) ) {
				switch ( token ) {
					case 'etn':
					case 'tn':
						wrapper.append( newTextNode( token === 'tn' ? 'text' : '' ) );
						break;
					case 'el':
						wrapper.append( newElement( 'span' ) );
						break;
				}
			}

			return wrapper;
		};

	bender.test(
	{
		test_$: function() {
			var t = newTextNode( 'text' ),
				c = newComment( 'comment' ),
				e = newElement( 'span' );

			assert.isTrue( t instanceof CKEDITOR.dom.text, 'Should be an instanceof dom.text' );
			assert.isTrue( c instanceof CKEDITOR.dom.comment, 'Should be an instanceof dom.comment' );
			assert.isTrue( e instanceof CKEDITOR.dom.element, 'Should be an instanceof dom.element' );
		},

		test_getPosition1: function() {
			var node1 = getNodeByTagName( 'h1' );
			var node2 = getNodeByTagName( 'p' );

			assert.areSame( CKEDITOR.POSITION_PRECEDING, node1.getPosition( node2 ) );
		},

		test_getPosition2: function() {
			var node1 = getNodeByTagName( 'h1' );
			var node2 = getNodeByTagName( 'p' );

			assert.areSame( CKEDITOR.POSITION_FOLLOWING, node2.getPosition( node1 ) );
		},

		test_getPosition3: function() {
			var node1 = getNodeByTagName( 'p' );
			var node2 = getNodeByTagName( 'b' );

			assert.areSame( CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING, node1.getPosition( node2 ) );
		},

		test_getPosition4: function() {
			var node1 = getNodeByTagName( 'p' );
			var node2 = getNodeByTagName( 'b' );

			assert.areSame( CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING, node2.getPosition( node1 ) );
		},

		test_getPosition5: function() {
			var node1 = getNodeByTagName( 'div' );
			var node2 = getNodeByTagName( 'div' );

			assert.areSame( CKEDITOR.POSITION_IDENTICAL, node1.getPosition( node2 ) );
		},

		test_getPosition6: function() {
			var node1 = getNodeByTagName( 'h1' );
			var node2 = newNode( $tn( 'h1' )[ 0 ].firstChild );

			assert.areSame( CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING, node1.getPosition( node2 ) );
		},

		test_getPosition7: function() {
			var node1 = getNodeByTagName( 'h1' );
			var node2 = newNode( $tn( 'h1' )[ 0 ].firstChild );
			assert.areSame( CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING, node2.getPosition( node1 ) );
		},

		test_getPosition8: function() {
			var node1 = newNode( $tn( 'h1' )[ 0 ].firstChild );
			var node2 = newNode( $tn( 'b' )[ 0 ].firstChild );

			assert.areSame( CKEDITOR.POSITION_PRECEDING, node1.getPosition( node2 ) );
		},

		test_getPosition9: function() {
			var node1 = newNode( $tn( 'h1' )[ 0 ].firstChild );
			var node2 = newNode( $tn( 'b' )[ 0 ].firstChild );

			assert.areSame( CKEDITOR.POSITION_FOLLOWING, node2.getPosition( node1 ) );
		},

		test_getPosition10: function() {
			var node1 = newNode( $tn( 'b' )[ 0 ] );
			var node2 = newNode( $tn( 'i' )[ 0 ] );

			assert.areSame( CKEDITOR.POSITION_PRECEDING, node1.getPosition( node2 ) );
		},

		test_getPosition11: function() {
			var node1 = newNode( $tn( 'b' )[ 0 ] );
			var node2 = newNode( $tn( 'i' )[ 0 ] );

			assert.areSame( CKEDITOR.POSITION_FOLLOWING, node2.getPosition( node1 ) );
		},

		/**
		 *  Test 'preceding' position.
		 */
		test_getPosition_3240: function() {
			var node1 = newNode( $tn( 'b' )[ 0 ].firstChild );
			var node2 = newNode( $tn( 'span' )[ 0 ].firstChild );

			assert.areSame( CKEDITOR.POSITION_PRECEDING, node1.getPosition( node2 ) );
		},

		// Test get previous non-spaces node.
		test_getPrevious: function() {
			var element = $( 'append' );
			var span1 = newElement( 'span' );
			element.append( span1 );
			element.append( new CKEDITOR.dom.text( ' ' ) );
			var span2 = newElement( 'span' );
			element.append( span2 );
			var previous = span2.getPrevious( CKEDITOR.dom.walker.whitespaces( true ) );
			assert.areSame( span1.$, previous.$ );
		},

		test_getPrevious2: function() {
			var node = $( 'getNSN6' );
			assert.areSame( CKEDITOR.NODE_TEXT, node.getPrevious().type );
			assert.areSame( $( 'getNSN5' ), node.getPrevious( function( node ) {
				return node.type === CKEDITOR.NODE_ELEMENT;
			} ) );
		},

		// Test get next non-spaces node.
		test_getNext: function() {
			var element = $( 'append' );
			var span1 = newElement( 'span' );
			element.append( span1 );
			element.append( new CKEDITOR.dom.text( ' ' ) );
			var span2 = newElement( 'span' );
			element.append( span2 );
			var next = span1.getNext( CKEDITOR.dom.walker.whitespaces( true ) );
			assert.areSame( span2.$, next.$ );
		},

		test_getNext2: function() {
			var node = $( 'getNSN1' );
			assert.areSame( CKEDITOR.NODE_TEXT, node.getNext().type );
			assert.areSame( $( 'getNSN2' ), node.getNext( function( node ) {
				return node.type === CKEDITOR.NODE_ELEMENT;
			} ) );
		},

		'test isReadOnly - body is isReadOnly': function() {
			var target = $( 'editable' ),
			body = target.getParent();

			assert.isTrue( body.isReadOnly(), 'Body is not editable' );
		},

		'test isReadOnly - editable is not isReadOnly': function() {
			var target = $( 'editable' );

			assert.isFalse( target.isReadOnly(), 'Element specify itself as editable.' );
		},

		'test isReadOnly - contenteditable="false" is isReadOnly': function() {
			var target = $( 'editable' );
			target.setHtml( '<div contenteditable="false">foo</div>' );

			assert.isTrue( target.getFirst().isReadOnly(), 'Element specify itself as non-editable.' );
		},

		'test isReadOnly - contenteditable="false" child is isReadOnly': function() {
			var target = $( 'editable' );
			target.setHtml( '<div contenteditable="false"><p>foo</p></div>' );

			assert.isTrue( target.getChild( [ 0, 0 ] ).isReadOnly(), 'Element inheirit non-editable property from parent.' );
		},

		'test isReadOnly - nested editable is not isReadOnly': function() {
			var target = $( 'editable' );
			target.setHtml( '<div contenteditable="false"><p contenteditable="true"><span>foo</span></p></div>' );

			assert.isFalse( target.getChild( [ 0, 0, 0 ] ).isReadOnly(), 'Element inheirit editable property from parent.' );
		},

		'test isReadOnly - contenteditable="false" data-cke-editable="1" is not isReadOnly': function() {
			var target = $( 'editable' );
			target.setHtml( '<input type="text" contenteditable="false" data-cke-editable="1" />' );

			assert.isFalse( target.getFirst().isReadOnly(), 'Element marked as "cke-editable" is not ready-only.' );
		},

		'test isReadOnly - div is isReadOnly (attrs check)': function() {
			var el = newElement( 'div' );

			assert.isTrue( el.isReadOnly( 1 ) );
		},

		'test isReadOnly - div with data-cke-editable is not isReadOnly (attrs check)': function() {
			var el = newElement( 'div' );
			el.data( 'cke-editable', 1 );

			assert.isFalse( el.isReadOnly( 1 ) );
		},

		'test isReadOnly - div contenteditable="false" child is isReadOnly (attrs check)': function() {
			var el = newElement( 'div' );

			el.setHtml( '<div contenteditable="false"><p>foo</p></div>' );
			assert.isTrue( el.getChild( [ 0, 0 ] ).isReadOnly( 1 ) );
		},

		'test isReadOnly - div contenteditable="true" child is not isReadOnly (attrs check)': function() {
			var el = newElement( 'div' );

			el.setHtml( '<div contenteditable="true"><p>foo</p></div>' );
			assert.isFalse( el.getChild( [ 0, 0 ] ).isReadOnly( 1 ) );
		},

		// #13609, #13919
		'test isReadOnly - isContentEditable property access': function() {
			// Edge tends to break when accessing isContentEditable property in certain elements.
			// If this test causes refreshes/crashes the web page, then some new element is causing this issue.
			var blacklistedElems = {
					applet: 1 // applet displays a popup about Java at IE11.
				},
				elemName;

			// Test every element in DTD.
			for ( elemName in CKEDITOR.dtd ) {
				if ( elemName[ 0 ] !== '$' && !( elemName in blacklistedElems ) ) {
					new CKEDITOR.dom.element( elemName ).isReadOnly();
				}
			}

			// If it didn't crash, it's OK.
			assert.isTrue( true );
		},

		test_appendTo: function() {
			var p = newElement( 'p' ),
				t = newTextNode( 'text' ),
				c = newComment( 'comment' ),
				b = newElement( 'b' );

			t.appendTo( p );
			assert.areSame( CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING, t.getPosition( p ) );
			c.appendTo( p );
			assert.areSame( CKEDITOR.POSITION_FOLLOWING, c.getPosition( t ) );
			assert.areSame( CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING, c.getPosition( p ) );
			b.appendTo( p );
			assert.areSame( CKEDITOR.POSITION_FOLLOWING, b.getPosition( c ) );
			assert.areSame( CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING, b.getPosition( p ) );
		},

		test_clone1: function() {
			var a = $( 'clone1' );

			assert.areSame( '<p></p>', getOuterHtml( a.clone() ) );
			assert.areSame( '<p id="clone1"></p>', getOuterHtml( a.clone( false, true ) ) );

			assert.areSame( getOuterHtml( a ), getOuterHtml( a.clone( true, true ) ) );
			assert.areSame(
				'<p><b><i></i></b><br><span>ghi<!--jkl--></span></p>',
				getOuterHtml( a.clone( true, false ) )
			);
		},

		test_clone2: function() {
			var t = newTextNode( 'text' ),
				c = newComment( 'comment' );

			assert.areSame( 'text', t.clone().getText() );
			assert.areSame( '<!--comment-->', c.clone().getOuterHtml() );
		},

		test_clone3: function() {
			var a = $( 'clone1' );
			assert.areNotEqual( a.getUniqueId(), a.clone().getUniqueId() );
		},

		test_clone4: function() {
			var t = new CKEDITOR.dom.text( 'text' ),
				c = new CKEDITOR.dom.comment( 'comment' ),
				e = $( 'clone' );

			assert.isTrue( t.clone() instanceof CKEDITOR.dom.text );
			assert.isTrue( c.clone() instanceof CKEDITOR.dom.comment );
			assert.isTrue( e.clone() instanceof CKEDITOR.dom.element );
		},

		'test_clone td': function() {
			var td = newElement( 'td' );

			td.appendText( 'foo' );

			assert.areSame( '<td>foo</td>', getOuterHtml( td.clone( true ) ) );
		},


		'test_clone HTML5 figure': function() {
			var figure = newElement( 'figure' );

			assert.areSame( '<figure></figure>', getOuterHtml( figure.clone() ) );
		},

		'test_clone HTML5 div with figure': function() {
			var div = newElement( 'div' ),
				figure = newElement( 'figure' );

			div.append( figure );

			assert.areSame( '<div><figure></figure></div>', getOuterHtml( div.clone( true ) ) );
		},

		test_hasNext: function() {
			var node1 = getNodeByTagName( 'b' ),
				node2 = getNodeByTagName( 'i' );

			assert.isTrue( node1.hasNext() );
			assert.isFalse( node2.hasNext() );
		},

		test_hasPrevious: function() {
			var node1 = getNodeByTagName( 'b' ),
				node2 = getNodeByTagName( 'i' );

			assert.isFalse( node1.hasPrevious() );
			assert.isTrue( node2.hasPrevious() );
		},

		test_insertAfter1: function() {
			var c = newNode( $( 'insertAfter' ).$.firstChild ),
				t = newNode( $( 'insertAfter' ).$.lastChild ),
				e1 = newElement( 'i' ),
				e2 = newElement( 'b' );

			e1.insertAfter( c );
			e2.insertAfter( t );

			assert.areSame(
				'<div id="insertafter"><!--abc--><i></i>def<b></b></div>',
				getOuterHtml( $( 'insertAfter' ) )
			);
		},

		// test if other types of nodes can be inserted too
		test_insertAfter2: function() {
			var node = newNode( $( 'insertAfter' ).$.lastChild ),
				c = newComment( 'comment' ),
				t = newTextNode( 'text' );

			c.insertAfter( node );
			assert.areSame( c, node.getNext() );

			t.insertAfter( node );
			assert.areSame( t, node.getNext() );
		},

		test_insertBefore: function() {
			var c = newNode( $( 'insertBefore' ).$.firstChild ),
				t = newNode( $( 'insertBefore' ).$.lastChild ),
				e1 = newElement( 'i' ),
				e2 = newElement( 'b' );

			e1.insertBefore( c );
			e2.insertBefore( t );

			assert.areSame(
				'<div id="insertbefore"><i></i><!--abc--><b></b>def</div>',
				getOuterHtml( $( 'insertBefore' ) )
			);
		},

		// test if other types of nodes can be inserted too
		test_insertBefore2: function() {
			var node = newNode( $( 'insertBefore' ).$.firstChild ),
				c = newComment( 'comment' ),
				t = newTextNode( 'text' );

			c.insertBefore( node );
			assert.areSame( c, node.getPrevious() );

			t.insertBefore( node );
			assert.areSame( t, node.getPrevious() );
		},

		test_insertBeforeMe: function() {
			var node1 = newElement( 'span' ),
				node2 = $( 'insertBefore' );

			node2.insertBeforeMe( node1 );

			assert.areSame( node1.getNext(), node2 );
		},

		test_getAddress: function() {
			// slice (2) - removes body>div part
			var address1 = $( 'getAddress1' ).getAddress().slice( 2 ),
				address2 = $( 'getAddress2' ).getAddress().slice( 2 );

			assert.isTrue( CKEDITOR.tools.arrayCompare( address1, [ 4, 3, 2 ] ) );
			assert.isTrue( CKEDITOR.tools.arrayCompare( address2, [ 0, 0, 0, 0, 0 ] ) );

			// check detached trees (#8670 - test currently fails in IE7&8)
			/*
			var root = newElement( 'span' ),
				child1 = newElement( 'span' ),
				child2 = newElement( 'span' );

			child1.appendTo( root );
			child2.appendTo( root );

			assert.isTrue( CKEDITOR.tools.arrayCompare( child2.getAddress(), [ 1 ] ) );
			assert.isTrue( CKEDITOR.tools.arrayCompare( root.getAddress(), [ ] ) );
			*/
		},

		test_getDocument: function() {
			var doc = CKEDITOR.document,
				iframe = $( 'getDocument' ),
				docIframe = iframe.getFrameDocument();

			docIframe.write( '<script>parent.childContext = this;<\/script>' );

			assert.isTrue( doc.equals( getNodeByTagName( 'div' ).getDocument() ) );
			assert.isTrue( doc.equals( newElement( 'span' ).getDocument() ) );
			assert.isTrue( doc.equals( newTextNode( 'text' ).getDocument() ) );

			// test with element from an iframe context
			assert.isFalse( doc.equals( docIframe.getBody().getDocument() ) );
			assert.areSame( childContext.document, docIframe.$ ); // jshint ignore:line
		},

		'getIndex - single node': function() {
			var wrapper = createGetIndexTest( 'el' ),
				node = wrapper.getFirst();

			assert.areEqual( 0, node.getIndex() );
			assert.areEqual( 0, node.getIndex( true ) );
		},

		'getIndex - two elements': function() {
			var wrapper = createGetIndexTest( 'el,el' ),
				node2 = wrapper.getChild( 1 );

			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( 1, node2.getIndex( true ) );
		},

		'getIndex - element after text node': function() {
			var wrapper = createGetIndexTest( 'tn,el' ),
				node1 = wrapper.getChild( 0 ),
				node2 = wrapper.getChild( 1 );

			assert.areEqual( 0, node1.getIndex() );
			assert.areEqual( 0, node1.getIndex( true ) );
			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( 1, node2.getIndex( true ) );
		},

		'getIndex - element after empty text node1': function() {
			var wrapper = createGetIndexTest( 'etn,el' ),
				node1 = wrapper.getChild( 0 ),
				node2 = wrapper.getChild( 1 );

			assert.areEqual( 0, node1.getIndex() );
			assert.areEqual( -1, node1.getIndex( true ) );
			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( 0, node2.getIndex( true ) );
		},

		'getIndex - etn, tn, el': function() {
			var wrapper = createGetIndexTest( 'etn,tn,el' ),
				node1 = wrapper.getChild( 0 ),
				node2 = wrapper.getChild( 1 ),
				node3 = wrapper.getChild( 2 );

			assert.areEqual( 0, node1.getIndex() );
			assert.areEqual( 0, node1.getIndex( true ) );
			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( 0, node2.getIndex( true ) );
			assert.areEqual( 2, node3.getIndex() );
			assert.areEqual( 1, node3.getIndex( true ) );
		},

		'getIndex - tn, etn, el': function() {
			var wrapper = createGetIndexTest( 'tn,etn,el' ),
				node1 = wrapper.getChild( 0 ),
				node2 = wrapper.getChild( 1 ),
				node3 = wrapper.getChild( 2 );

			assert.areEqual( 0, node1.getIndex() );
			assert.areEqual( 0, node1.getIndex( true ) );
			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( 0, node2.getIndex( true ) );
			assert.areEqual( 2, node3.getIndex() );
			assert.areEqual( 1, node3.getIndex( true ) );
		},

		'getIndex - etn, etn, el': function() {
			var wrapper = createGetIndexTest( 'etn,etn,el' ),
				node1 = wrapper.getChild( 0 ),
				node2 = wrapper.getChild( 1 ),
				node3 = wrapper.getChild( 2 );

			assert.areEqual( 0, node1.getIndex() );
			assert.areEqual( -1, node1.getIndex( true ) );
			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( -1, node2.getIndex( true ) );
			assert.areEqual( 2, node3.getIndex() );
			assert.areEqual( 0, node3.getIndex( true ) );
		},

		'getIndex - etn, tn, etn, el': function() {
			var wrapper = createGetIndexTest( 'etn,tn,etn,el' ),
				node2 = wrapper.getChild( 1 ),
				node3 = wrapper.getChild( 2 ),
				node4 = wrapper.getChild( 3 );

			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( 0, node2.getIndex( true ) );
			assert.areEqual( 2, node3.getIndex() );
			assert.areEqual( 0, node3.getIndex( true ) );
			assert.areEqual( 3, node4.getIndex() );
			assert.areEqual( 1, node4.getIndex( true ) );
		},

		'getIndex - el, tn, el': function() {
			var wrapper = createGetIndexTest( 'el,tn,el' ),
				node1 = wrapper.getChild( 0 ),
				node2 = wrapper.getChild( 1 ),
				node3 = wrapper.getChild( 2 );

			assert.areEqual( 0, node1.getIndex() );
			assert.areEqual( 0, node1.getIndex( true ) );
			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( 1, node2.getIndex( true ) );
			assert.areEqual( 2, node3.getIndex() );
			assert.areEqual( 2, node3.getIndex( true ) );
		},

		'getIndex - el, etn, el': function() {
			var wrapper = createGetIndexTest( 'el,etn,el' ),
				node1 = wrapper.getChild( 0 ),
				node2 = wrapper.getChild( 1 ),
				node3 = wrapper.getChild( 2 );

			assert.areEqual( 0, node1.getIndex() );
			assert.areEqual( 0, node1.getIndex( true ) );
			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( -1, node2.getIndex( true ) );
			assert.areEqual( 2, node3.getIndex() );
			assert.areEqual( 1, node3.getIndex( true ) );
		},

		'getIndex - el, etn, tn, el': function() {
			var wrapper = createGetIndexTest( 'el,etn,tn,el' ),
				node2 = wrapper.getChild( 1 ),
				node3 = wrapper.getChild( 2 ),
				node4 = wrapper.getChild( 3 );

			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( 1, node2.getIndex( true ) );
			assert.areEqual( 2, node3.getIndex() );
			assert.areEqual( 1, node3.getIndex( true ) );
			assert.areEqual( 3, node4.getIndex() );
			assert.areEqual( 2, node4.getIndex( true ) );
		},

		'getIndex - el, tn, etn, el': function() {
			var wrapper = createGetIndexTest( 'el,tn,etn,el' ),
				node2 = wrapper.getChild( 1 ),
				node3 = wrapper.getChild( 2 ),
				node4 = wrapper.getChild( 3 );

			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( 1, node2.getIndex( true ) );
			assert.areEqual( 2, node3.getIndex() );
			assert.areEqual( 1, node3.getIndex( true ) );
			assert.areEqual( 3, node4.getIndex() );
			assert.areEqual( 2, node4.getIndex( true ) );
		},

		'getIndex - el, etn': function() {
			var wrapper = createGetIndexTest( 'el,etn' ),
				node1 = wrapper.getChild( 0 ),
				node2 = wrapper.getChild( 1 );

			assert.areEqual( 0, node1.getIndex() );
			assert.areEqual( 0, node1.getIndex( true ) );
			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( -1, node2.getIndex( true ) );
		},

		'getIndex - tn, el, etn': function() {
			var wrapper = createGetIndexTest( 'tn,el,etn' ),
				node3 = wrapper.getChild( 2 );

			assert.areEqual( 2, node3.getIndex() );
			assert.areEqual( -1, node3.getIndex( true ) );
		},

		'getIndex - tn, el, etn 2': function() {
			var wrapper = createGetIndexTest( 'tn,el,etn' ),
				node2 = wrapper.getChild( 1 ),
				node3 = wrapper.getChild( 2 );

			node2.setText( 's' );

			assert.areEqual( 2, node3.getIndex() );
			assert.areEqual( -1, node3.getIndex( true ) );
		},

		'getIndex - el, tn, etn, etn, etn, el': function() {
			var wrapper = createGetIndexTest( 'el,tn,etn,etn,etn,el' ),
				node2 = wrapper.getChild( 1 ),
				node4 = wrapper.getChild( 3 ),
				node5 = wrapper.getChild( 4 ),
				node6 = wrapper.getChild( 5 );

			assert.areEqual( 1, node2.getIndex() );
			assert.areEqual( 1, node2.getIndex( true ) );
			assert.areEqual( 3, node4.getIndex() );
			assert.areEqual( 1, node4.getIndex( true ) );
			assert.areEqual( 4, node5.getIndex() );
			assert.areEqual( 1, node5.getIndex( true ) );
			assert.areEqual( 5, node6.getIndex() );
			assert.areEqual( 2, node6.getIndex( true ) );
		},

		test_getNextSourceNode: function() {
			var node = $( 'getNSN1' );
			assert.areSame( CKEDITOR.NODE_TEXT, node.getNextSourceNode( true ).type );
			assert.areSame( $( 'getNSN2' ), node.getNextSourceNode( true, CKEDITOR.NODE_ELEMENT ) );
			assert.areSame( 'comment1', node.getNextSourceNode( true, CKEDITOR.NODE_COMMENT ).$.nodeValue );
			assert.isNull( node.getNextSourceNode( true, CKEDITOR.NODE_COMMENT, $( 'getNSN3' ) ) );
		},

		test_getPreviousSourceNode: function() {
			var node = $( 'getNSN6' );
			assert.areSame( CKEDITOR.NODE_TEXT, node.getPreviousSourceNode( true ).type );
			assert.areSame( $( 'getNSN5' ), node.getPreviousSourceNode( true, CKEDITOR.NODE_ELEMENT ) );
			assert.areSame( 'comment2', node.getPreviousSourceNode( true, CKEDITOR.NODE_COMMENT ).$.nodeValue );
			assert.isNull( node.getPreviousSourceNode( true, CKEDITOR.NODE_COMMENT, $( 'getNSN4' ) ) );
		},

		test_getParent: function() {
			var node = $( 'getNSN1' );
			assert.areSame( $( 'getNSN' ), node.getParent() );
			assert.isNull( newElement( document.body ).getParent().getParent() );
		},

		test_getParents: function() {
			var node = getNodeByTagName( 'div' );

			assert.areSame( 3, node.getParents().length );
			assert.areSame( node.getParents()[ 0 ], node.getParents( true )[ 2 ] );
		},

		test_getCommonAncestor: function() {
			assert.areSame( newElement( document.body ), $( 'getNSN1' ).getCommonAncestor( $( 'getAddress2' ) ) );
		},

		test_getAscendant: function() {
			var node = $( 'getNSN1' );

			assert.areSame( $( 'getNSN' ), node.getAscendant( 'div' ) );
			assert.areSame( newElement( document.body ), node.getAscendant( 'body' ) );
			assert.areSame( $( 'getNSN1' ), node.getAscendant( { div: 1, i: 1 }, true ) );
			assert.isNull( null, node.getAscendant( 'i' ) );
		},

		test_getAscendantFuncCheck_callsNumber: function() {
			var node = $( 'getAscendantFuncCheck' ),
				calls = 0;

			node.getAscendant( function() {
				calls++;
			}, true );

			assert.isTrue( calls > 0, 'Should be called at least once.' );
		},

		test_getAscendantFuncCheck_findFirstOne: function() {
			var node = $( 'getAscendantFuncCheck' ),
				found = node.getAscendant( function() {
					return true;
				}, true );

			assert.areSame( node, found, 'First one match.' );
		},

		test_getAscendantFuncCheck_findFirstAncestor: function() {
			var node = $( 'getAscendantFuncCheck' ),
				found = node.getAscendant( function() {
					return true;
				} );

			assert.areSame( node.getParent(), found, 'First ancestor match.' );
		},

		test_getAscendantFuncCheckFindNothing: function() {
			var node = $( 'getAscendantFuncCheck' ),
				found = node.getAscendant( function() {
					return false;
				} );

			assert.isNull( found, 'Nothing found.' );
		},

		test_getAscendantFuncCheck_findFirstWithClassDeep2: function() {
			var node = $( 'getAscendantFuncCheck' ),
				found = node.getAscendant( function( el ) {
					return el.hasClass( 'deep2' );
				}, true );

			assert.areSame( $( 'deep2' ), found, 'Found element which has class deep2' );
		},

		test_hasAscendant: function() {
			var node = $( 'getNSN1' );

			assert.isTrue( node.hasAscendant( 'div' ) );
			assert.isTrue( node.hasAscendant( 'html' ) );
			assert.isFalse( node.hasAscendant( 'p' ) );
			assert.isTrue( node.hasAscendant( 'i', true ) );
		},

		test_move: function() {
			var parent = $( 'move' ),
				node = $( 'move1' );

			node.move( parent );

			assert.areSame( 'move1', parent.$.childNodes[ parent.$.childNodes.length - 1 ].id );

			node.move( parent, true );

			assert.areSame( 'move1', parent.$.childNodes[ 0 ].id );
		},

		test_remove: function() {
			$( 'remove1' ).remove( true );
			assert.areSame( '<div id="remove"><i></i>text<!--comment--></div>', getOuterHtml( $( 'remove' ) ) );
			$( 'remove' ).remove();
			assert.areSame( null, document.getElementById( 'remove' ) );
		},

		test_replace: function() {
			$( 'replace1' ).replace( $( 'replace2' ) );

			assert.areSame( '<div id="replace">12<p id="replace1"></p>3</div>', getOuterHtml( $( 'replace' ) ) );
		},

		test_trim: function() {
			var node = $( 'trim' );
			node.trim();

			assert.areSame( 'text', node.$.innerHTML );
		}

	} );

}() );

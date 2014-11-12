/* bender-tags: editor,unit,dom */

( function() {
	'use strict';

	var doc = new CKEDITOR.dom.document( document );

	function assertNodesList( wanted, nodes ) {
		var simplifiedNodes = [];

		for ( var i = 0 ; i < nodes.length ; i++ )
			simplifiedNodes.push( nodes[ i ].type == CKEDITOR.NODE_TEXT ? nodes[ i ].getText() : ( '<' + nodes[ i ].getName() + '>' ) );

		assert.areSame( wanted.toString(), simplifiedNodes.toString() );
	}

	bender.test( {
		test_collapsed: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>Test</p>' );

			var range = new CKEDITOR.dom.range( doc );

			range.setStartAt( node.getFirst(), CKEDITOR.POSITION_AFTER_START );
			range.collapse( true );

			var walker = new CKEDITOR.dom.walker( range );

			assert.isNull( walker.next() );
		},

		test_next_1: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>This is <b>a <i>simple</i></b> test</p>' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( node );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.next() ) )
				nodes.push( node );

			assertNodesList( [ '<p>', 'This is ', '<b>', 'a ', '<i>', 'simple', ' test' ], nodes );
		},

		test_next_2: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>This is <b>a <i>simple</i></b> test</p>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( node.getFirst(), CKEDITOR.POSITION_AFTER_START );
			range.setEnd( node.getChild( [ 0, 1, 1, 0 ] ), 2 );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.next() ) )
				nodes.push( node );

			assertNodesList( [ 'This is ', '<b>', 'a ', '<i>', 'simple' ], nodes );
		},

		test_next_3: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>Test</p><h1>More</h1>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( node.getChild( 1 ), CKEDITOR.POSITION_BEFORE_START );
			range.setEndAt( node.getChild( 1 ), CKEDITOR.POSITION_AFTER_START );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.next() ) )
				nodes.push( node );

			assertNodesList( [ '<h1>' ], nodes );
		},

		test_next_4: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>Test</p><h1>More</h1>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( node.getChild( 0 ), CKEDITOR.POSITION_BEFORE_END );
			range.setEndAt( node.getChild( 0 ), CKEDITOR.POSITION_AFTER_END );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.next() ) )
				nodes.push( node );

			assertNodesList( [], nodes );
		},

		test_next_5: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>Test</p><h1>More</h1>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( node.getChild( 0 ), CKEDITOR.POSITION_BEFORE_END );
			range.setEndAt( node.getChild( 1 ), CKEDITOR.POSITION_AFTER_START );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.next() ) )
				nodes.push( node );

			assertNodesList( [ '<h1>' ], nodes );
		},

		test_next_6: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>Test</p><h1>More</h1>' );

			// <p>Test{</p><h1>}More</h1> - range anchors inside of the boundaries of text nodes.
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( node.getChild( [ 0, 0 ] ), CKEDITOR.POSITION_BEFORE_END );
			range.setEndAt( node.getChild( [ 1, 0 ] ), CKEDITOR.POSITION_AFTER_START );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.next() ) )
				nodes.push( node );

			assertNodesList( [ '<h1>' ], nodes );
		},

		test_next_7: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>Test</p><h1>More</h1>' );

			// <p>Test{</p><h1>}More</h1> - range anchors inside of the boundaries of text nodes.
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( node.getChild( [ 0, 0 ] ), CKEDITOR.POSITION_BEFORE_END );
			range.setEndAt( node.getChild( [ 1, 0 ] ), CKEDITOR.POSITION_AFTER_START );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.previous() ) )
				nodes.push( node );

			assertNodesList( [ '<p>' ], nodes );
		},

		test_previous_1: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>This is <b>a <i>simple</i></b> test</p>' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( node );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.previous() ) )
				nodes.push( node );

			assertNodesList( [ '<p>', ' test', '<b>', '<i>', 'simple', 'a ', 'This is ' ], nodes );
		},

		test_previous_2: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>This is <b>a <i>simple</i></b> test</p>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setEnd( node.getChild( [ 0, 0 ] ), 2 );
			range.setEnd( node.getChild( [ 0, 1, 1, 0 ] ), 2 );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.previous() ) )
				nodes.push( node );

			assertNodesList( [ 'simple', 'a ', 'This is ' ], nodes );
		},

		test_previous_3: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>Test</p><h1>More</h1>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( node.getChild( 1 ), CKEDITOR.POSITION_BEFORE_START );
			range.setEndAt( node.getChild( 1 ), CKEDITOR.POSITION_AFTER_START );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.previous() ) )
				nodes.push( node );

			assertNodesList( [ '' ], nodes );
		},

		test_previous_4: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>Test</p><h1>More</h1>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( node.getChild( 0 ), CKEDITOR.POSITION_BEFORE_END );
			range.setEndAt( node.getChild( 0 ), CKEDITOR.POSITION_AFTER_END );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.previous() ) )
				nodes.push( node );

			assertNodesList( [ '<p>' ], nodes );
		},

		test_previous_5: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>Test</p><h1>More</h1>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( node.getChild( 0 ), CKEDITOR.POSITION_BEFORE_END );
			range.setEndAt( node.getChild( 1 ), CKEDITOR.POSITION_AFTER_START );

			var walker = new CKEDITOR.dom.walker( range );

			var nodes = [];
			while ( ( node = walker.previous() ) )
				nodes.push( node );

			assertNodesList( [ '<p>' ], nodes );
		},

		/**
		 *  Test guard function is invoked on every move when iterating forward.
		 */
		test_guard_1: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>This is <b>a <i>simple</i></b> test</p>' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( node );

			var walker = new CKEDITOR.dom.walker( range );
			var nodes = [];

			walker.guard = function( node ) {
				nodes.push( node );
				return true;
			};

			while ( ( node = walker.next() ) ) {  }

			assertNodesList( [ '<p>', 'This is ', '<b>', 'a ', '<i>', 'simple', '<i>', '<b>', ' test' , '<p>' ], nodes );
		},

		/**
		 *  Test guard function is invoked on every move when iterating backward.
		 */
		test_guard_2: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>This is <b>a <i>simple</i></b> test</p>' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( node );

			var walker = new CKEDITOR.dom.walker( range );
			var nodes = [];

			walker.guard = function( node ) {
				nodes.push( node );
				return true;
			};

			while ( ( node = walker.previous() ) ) {  }

			assertNodesList( [ '<p>', ' test', '<b>', '<i>', 'simple', '<i>', 'a ', '<b>', 'This is ', '<p>' ], nodes );
		},

		test_guard_3: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>This is <b>a <i>simple</i></b> test</p>' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( node );

			var walker = new CKEDITOR.dom.walker( range );
			var nodes = [];

			walker.guard = function( node ) {
				nodes.push( node );
				return !( node.type == CKEDITOR.NODE_ELEMENT && node.is( 'i' ) ); // Stop on <i> element.
			};

			while ( ( node = walker.next() ) ) {  }

			assertNodesList( [ '<p>', 'This is ', '<b>', 'a ', '<i>' ], nodes );
		},

		/**
		 *  Test evaluator function is invoked on every  step when iterating backward.
		 */
		test_evaluator_1: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<p>This is <b>a <i>simple</i></b> test</p>' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( node );

			var walker = new CKEDITOR.dom.walker( range );
			var nodes = [];

			walker.evaluator = function( node ) {
				nodes.push( node );
				return true;
			};

			while ( ( node = walker.previous() ) ) {  }

			assertNodesList( [ '<p>', ' test', '<b>', '<i>', 'simple', 'a ', 'This is ' ], nodes );
		},
		/**
		 * Test walker stop at empty endContainer.
		 */
		test_stopGuard: function() {
			var node = doc.getById( 'playground' );
			node.setHtml( '<span></span>afterEnd' );
			var endContainer = node.getFirst();
			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( node );
			range.setEndAt( endContainer, CKEDITOR.POSITION_AFTER_START );

			var walker = new CKEDITOR.dom.walker( range );
			var nodes = [];

			walker.evaluator = function( node ) {
				nodes.push( node );
				return true;
			};

			while ( ( node = walker.next() ) ) {  }

			assertNodesList( [ '<span>' ], nodes );

		},

		'test walker.invisible() - br surrounded by text': function() {
			assert.isTrue( CKEDITOR.dom.walker.invisible()( doc.getById( 'brInText' ) ) );
		},

		'test walker.invisible() - bogus br': function() {
			assert.isTrue( CKEDITOR.dom.walker.invisible()( doc.getById( 'bogusBr' ) ) );
		},

		'test walker.invisible() - br followed by bogus br': function() {
			assert.isTrue( CKEDITOR.dom.walker.invisible()( doc.getById( 'brFollowedByBogus' ) ) );
		},

		'test walker.invisible() - bogus br following normal br': function() {
			assert.isTrue( CKEDITOR.dom.walker.invisible()( doc.getById( 'bogusBr2' ) ) );
		},

		'test walker.invisible() - nbsp': function() {
			assert.isFalse( CKEDITOR.dom.walker.invisible()( doc.getById( 'nbsp' ).getFirst() ) );
		},

		'test walker.invisible() - whitespaces in empty inline element surrounded by text': function() {
			assert.isTrue( CKEDITOR.dom.walker.invisible()( doc.getById( 'wsInline' ).getFirst() ) );
		},

		'test walker.invisible() - whitespaces in empty inline element surrounded by whitespaces': function() {
			// IE8 loses empty text nodes when parsing HTML.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
				assert.ignore();

			assert.isTrue( CKEDITOR.dom.walker.invisible()( doc.getById( 'wsInline2' ).getFirst() ) );
		},

		'test walker.invisible() - empty inline element': function() {
			assert.isTrue( CKEDITOR.dom.walker.invisible()( doc.getById( 'emptyInline' ) ) );
		},

		'test walker.invisible() - inline element containing whitespaces, surrounded by text': function() {
			assert.isFalse( CKEDITOR.dom.walker.invisible()( doc.getById( 'wsInline' ) ) );
		},

		'test walker.invisible() - inline element containing whitespaces, surrounded by whitespaces': function() {
			assert.isTrue( CKEDITOR.dom.walker.invisible()( doc.getById( 'wsInline2' ) ) );
		},

		'test walker.invisible() - non empty inline element': function() {
			assert.isFalse( CKEDITOR.dom.walker.invisible()( doc.getById( 'nonEmptyInline' ).getFirst() ) );
		},

		'test walker.invisible() - inline element containing a ZWS character': function() {
			assert.isTrue( CKEDITOR.dom.walker.invisible()( doc.getById( 'zwsInline' ) ) );
		},

		'test walker.invisible() - block with a bogus br only': function() {
			assert.isFalse( CKEDITOR.dom.walker.invisible()( doc.getById( 'filledBlock' ) ) );
		},

		'test walker.temp': function() {
			var isTemp = CKEDITOR.dom.walker.temp(),
				isNotTemp = CKEDITOR.dom.walker.temp( true );

			var node1 = new CKEDITOR.dom.text( 'foo' ),
				node2 = CKEDITOR.dom.element.createFromHtml( '<div data-cke-temp="1">foo</div>' ),
				node3 = node2.getFirst(),
				node4 = CKEDITOR.dom.element.createFromHtml( '<div>foo</div>' );

			assert.isFalse( isTemp( node1 ) );
			assert.isTrue( isTemp( node2 ) );
			assert.isTrue( isTemp( node3 ) );
			assert.isFalse( isTemp( node4 ) );

			assert.isTrue( isNotTemp( node1 ) );
			assert.isFalse( isNotTemp( node2 ) );
			assert.isFalse( isNotTemp( node3 ) );
			assert.isTrue( isNotTemp( node4 ) );
		},

		'test walker.ignored': function() {
			var isIgnored = CKEDITOR.dom.walker.ignored(),
				isNotIgnored = CKEDITOR.dom.walker.ignored( true );

			var node1 = new CKEDITOR.dom.text( 'foo' ),
				node2 = new CKEDITOR.dom.text( ' ' ),
				node3 = CKEDITOR.dom.element.createFromHtml( '<div data-cke-temp="1">foo</div>' ),
				node4 = CKEDITOR.dom.element.createFromHtml( '<span data-cke-bookmark="1">&nbsp;</span>' ),
				node5 = CKEDITOR.dom.element.createFromHtml( '<p>foo</p>' );

			assert.isFalse( isIgnored( node1 ) );
			assert.isTrue( isIgnored( node2 ) );
			assert.isTrue( isIgnored( node3 ) );
			assert.isTrue( isIgnored( node4 ) );
			assert.isFalse( isIgnored( node5 ) );

			assert.isTrue( isNotIgnored( node1 ) );
			assert.isFalse( isNotIgnored( node2 ) );
			assert.isFalse( isNotIgnored( node3 ) );
			assert.isFalse( isNotIgnored( node4 ) );
			assert.isTrue( isNotIgnored( node5 ) );
		},

		'test walker.editable': function() {
			var isEditable = CKEDITOR.dom.walker.editable(),
				isNotEditable = CKEDITOR.dom.walker.editable( true );

			var node1 = new CKEDITOR.dom.text( 'foo' ),
				node2 = new CKEDITOR.dom.text( ' ' ),
				node3 = CKEDITOR.dom.element.createFromHtml( '<div data-cke-temp="1">foo</div>' ),
				node4a = CKEDITOR.dom.element.createFromHtml( '<ul><li>foo</li></ul>' ),
				node4b = node4a.getFirst(),
				node5 = CKEDITOR.dom.element.createFromHtml( '<p>foo</p>' ),
				node6 = CKEDITOR.dom.element.createFromHtml( '<p contenteditable="false">foo</p>' ),
				node7 = CKEDITOR.dom.element.createFromHtml( '<span contenteditable="false">foo</span>' ),
				node8 = CKEDITOR.dom.element.createFromHtml( '<b>foo</b>' ),
				node9a = CKEDITOR.dom.element.createFromHtml( '<li></li>' ),
				node9b = CKEDITOR.dom.element.createFromHtml( '<p></p>' ),
				node10 = CKEDITOR.dom.element.createFromHtml( '<hr />' );

			assert.isTrue( isEditable( node1 ), 'text' );
			assert.isFalse( isEditable( node2 ), 'white space' );
			assert.isFalse( isEditable( node3 ), 'temp node' );
			assert.isFalse( isEditable( node4a ), 'ul' );
			assert.isFalse( isEditable( node4b ), 'non-empty li' );
			assert.isFalse( isEditable( node5 ), 'non-empty p' );
			assert.isTrue( isEditable( node6 ), 'non-editable block' );
			assert.isTrue( isEditable( node7 ), 'non-editable inline' );
			assert.isTrue( isEditable( node8 ), 'b' );
			assert.isTrue( isEditable( node10 ), 'hr' );
			// Empty blocks can be editable if br filler is not needed.
			assert.areSame( !CKEDITOR.env.needsBrFiller, isEditable( node9a ), 'empty li' );
			assert.areSame( !CKEDITOR.env.needsBrFiller, isEditable( node9b ), 'empty p' );

			assert.isFalse( isNotEditable( node1 ) );
			assert.isTrue( isNotEditable( node2 ) );
		},

		'test walker.bogus': function() {
			// TODO cover IEs with this test.
			if ( !CKEDITOR.env.needsBrFiller )
				assert.ignore();

			var isBogus = CKEDITOR.dom.walker.bogus(),
				isNotBogus = CKEDITOR.dom.walker.bogus( true );

			var node1 = CKEDITOR.dom.element.createFromHtml( '<div>foo</div>' ),
				node2 = CKEDITOR.dom.element.createFromHtml( '<p>f<span>oo</span></p>' ),
				node3 = new CKEDITOR.dom.element( 'p' ),
				node4 = CKEDITOR.dom.element.createFromHtml( '<p>foo<br>foo</p>' ),
				node5 = CKEDITOR.dom.element.createFromHtml( '<figure><figcaption>foo</figcaption></figure>' ),
				node5Target = node5.findOne( 'figcaption' ),
				body = CKEDITOR.document.getBody();

			// We need those elements in DOM because otherwise Webkit won't return
			// computed styles for them what will break element#isBlockBoundary.
			body.append( node1 );
			body.append( node2 );
			body.append( node3 );
			body.append( node4 );
			body.append( node5 );

			node1.appendBogus();
			node2.appendBogus();
			node3.appendBogus();
			node5Target.appendBogus();

			var bogus1 = node1.getBogus(),
				bogus2 = node2.getBogus(),
				bogus3 = node3.getBogus(),
				bogus5 = node5Target.getBogus();

			// Test whether used methods worked...
			assert.isTrue( !!bogus1, 'bogus 1 exists' );
			assert.isTrue( !!bogus2, 'bogus 2 exists' );
			assert.isTrue( !!bogus3, 'bogus 3 exists' );
			assert.isTrue( !!bogus5, 'bogus 5 exists' );

			assert.isTrue( isBogus( bogus1 ), 'case 1a' );
			assert.isTrue( isBogus( bogus2 ), 'case 2a' );
			assert.isTrue( isBogus( bogus3 ), 'case 3a' );
			assert.isTrue( isBogus( bogus5 ), 'case 4a' );
			assert.isFalse( isBogus( node1 ), 'case 5a' );
			assert.isFalse( isBogus( node4.findOne( 'br' ) ), 'case 6a' );

			assert.isFalse( isNotBogus( bogus1 ), 'case 1b' );
			assert.isFalse( isNotBogus( bogus2 ), 'case 2b' );
			assert.isFalse( isNotBogus( bogus3 ), 'case 3b' );
			assert.isFalse( isNotBogus( bogus5 ), 'case 4b' );
			assert.isTrue( isNotBogus( node1 ), 'case 5b' );
			assert.isTrue( isNotBogus( node4.findOne( 'br' ) ), 'case 6b' );
		},

		// TCs are defined in this file, because method is defined in walker.js.
		'test element#isBlockBoundary': function() {
			var doc = CKEDITOR.document;

			assert.isFalse( doc.getById( 'bbf1' ).isBlockBoundary(), 'floated block span' );
			assert.isFalse( doc.getById( 'bbf2' ).isBlockBoundary(), 'absolutely positioned span' );
			assert.isFalse( doc.getById( 'bbf3' ).isBlockBoundary(), 'inline-block span' );
			assert.isFalse( doc.getById( 'bbf4' ).isBlockBoundary(), 'normal span' );

			assert.isTrue( doc.getById( 'bbt1' ).isBlockBoundary(), 'block span' );
			assert.isTrue( doc.getById( 'bbt2' ).isBlockBoundary(), 'block' );
			assert.isTrue( doc.getById( 'bbt3' ).isBlockBoundary(), 'list item' );
			assert.isTrue( doc.getById( 'bbt4' ).isBlockBoundary(), 'floated block' );
		}
	} );
} )();
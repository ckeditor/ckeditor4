/* bender-tags: editor,unit,magicline */
/* bender-ckeditor-plugins: magicline */

( function() {
	'use strict';

	var	tablePlayGround = '<p>Before</p>\
			<!-- Comment goes here --> <!-- Another comment after white space -->\
			<table><tbody><tr><td id="cell">CKE^ditor</td></tr></tbody></table>\
			<!-- Comment goes here --> <!-- Another comment after white space -->\
			<p>After</p>',

		EDGE_TOP = 128,
		EDGE_BOTTOM = 64,
		EDGE_MIDDLE = 32,
		TYPE_EDGE = 16,
		TYPE_EXPAND = 8,
		LOOK_TOP = 4,
		LOOK_BOTTOM = 2,
		LOOK_NORMAL = 1,

		editor;

	function testEditor( tc, config, html, callback ) {
		if ( editor )
			editor.destroy();

		editor = new CKEDITOR.replace( 'editor', CKEDITOR.tools.extend( config,
			{
				autoParagraph : false,
				plugins : 'wysiwygarea,magicline,undo',
				allowedContent: true, // Disable filter.
				on :
				{
					instanceReady : function( event ) {
						var editable = editor.editable();

						// Set initial HTML.
						editable.setHtml( html );

						editable.setStyles(
							{
								padding : '0px',
								margin : '0px',
								'font-size' : '0px'		// Make BRs invisible
							} );

						tc.resume( function() {
								callback( editor, editable, editor.plugins.magicline.backdoor );
							} );
					}
				}
			} )
		);

		tc.wait();
	}

	function convertNbsp( text ) {
		return text.replace( /\u00A0/g, '&nbsp;' );
	}

	function htmlWithSelection( editor ) {
		return convertNbsp( bender.tools.getHtmlWithSelection( editor ) );
	}

	function compareObjects( object, reference ) {
		assert.isTrue( typeof object == 'object'
			&& typeof reference == 'object' );

		for ( var p in object ) {
			if ( typeof object[ p ] == 'object' )
				compareObjects( object[ p ], reference[ p ] );
			else
				assert.areEqual( reference[ p ], object[ p ] );
		}
	}

	bender.editor = {};

	bender.test(
	{
		_should : {
			ignore: CKEDITOR.env.ie ?
				{
					// We cannot test them in IE because document.elementFromPoint( x, y )
					// requires the document to be truly visible.
					// It means that if there's another element in the top document that
					// covers the iframe (e.g. test summary list), the method gives null.
					'synthetic triggerEdge' : true,
					'synthetic triggerEdge: BR between' : true,
					'synthetic triggerEdge: Text node between' : true,
					'synthetic triggerEdge: Element is first or last child' : true,
					'synthetic triggerExpand: Direct siblings with pointer in outer space' : true,
					'synthetic triggerExpand' : true,
					'synthetic triggerExpand: BR between' : true,
					'synthetic triggerExpand: Text node between' : true,
					'command: deep space access - with changes' : true
				}
				: null
		},

		// Simulate triggerEditable on a first and last element.
		'synthetic triggerEditable' : function() {
			testEditor( this, {},
				'<!-- Comment goes here --> <!-- Another comment after white space -->\
				<div id="up" style="height: 50px; background: green;">Up div</div>\
				<div id="bottom" style="height: 50px; background: orange;">Bottom div</div>\
				<!-- Comment goes here --> <!-- Another comment after white space -->',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 20,
								y : 20 		// Place mouse in the top of #up.
							}
						}, true ),
						trigger = backdoor.triggerEditable( that );

					assert.areEqual( 'up', trigger.lower.getId() );

					that.mouse.y = 90; 		// Place mouse in the bottom #bottom.
					trigger = backdoor.triggerEditable( that );

					assert.areEqual( 'bottom', trigger.upper.getId() );
				} );
		},

		// Simulate triggerEditable on a "first and last" element with BR as a sibling.
		'synthetic triggerEditable: BR above or below' : function() {
			testEditor( this, {},
				'<br/>\
				<div id="up" style="height: 50px; background: green;">Up div</div>\
				<div id="bottom" style="height: 50px; background: orange;">Bottom div</div>\
				<br/>',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 20,
								y : 20 		// Place mouse in the top of #up.
							}
						}, true ),
						trigger = backdoor.triggerEditable( that );

					assert.isNull( trigger );

					that.mouse.y = 90; 		// Place mouse in the bottom #bottom.
					trigger = backdoor.triggerEditable( that );

					assert.isNull( trigger );
				} );
		},

		// Simulate triggerEditable on a "first and last" element with text node as a sibling.
		'synthetic triggerEditable: Text above or below' : function() {
			testEditor( this, {},
				'Foo\
				<div id="up" style="height: 50px; background: green;">Up div</div>\
				<div id="bottom" style="height: 50px; background: orange;">Bottom div</div>\
				Bar',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 20,
								y : 20 		// Place mouse in the top of #up.
							}
						}, true ),
						trigger = backdoor.triggerEditable( that );

					assert.isNull( trigger );

					that.mouse.y = 90; 		// Place mouse in the bottom #bottom.
					trigger = backdoor.triggerEditable( that );

					assert.isNull( trigger );
				} );
		},

		// Simulate triggerEdge on a pair of elements.
		// Floats, comments and "empty" text nodes should be omitted.
		'synthetic triggerEdge' : function() {
			testEditor( this, {},
				'<div id="up" style="height: 50px; margin: 0 0 50px; background: green;">Up div</div>\
				<!-- Comment goes here --> <!-- Another comment after white space -->\
				<div id="floated" style="float: right; width: 50px; height: 50px; background: red;">I am floated</div>\
				<div id="bottom" style="height: 50px; background: orange;">Bottom div</div>',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 20,
								y : 40 		// Place mouse in the bottom of #up.
							},
							element : editable.getChild( [ 0 ] )	// Select #up
						}, true ),
						trigger = backdoor.triggerEdge( that );

					assert.areEqual( 'up', trigger.upper.getId() );
					assert.areEqual( 'bottom', trigger.lower.getId() );
				} );
		},

		// Simulate triggerEdge on a pair of elements with BR between.
		'synthetic triggerEdge: BR between' : function() {
			testEditor( this, {},
				'<div id="up" style="height: 50px; margin: 0 0 50px; background: green;">Up div</div>\
				<br/>\
				<div id="bottom" style="height: 50px; background: orange;">Bottom div</div>',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 20,
								y : 40 		// Place mouse in the bottom of #up.
							},
							element : editable.getChild( [ 0 ] )	// Select #up
						}, true ),
						trigger = backdoor.triggerEdge( that );

					assert.isNull( trigger );
				} );
		},

		// Simulate triggerEdge on a pair of elements with text node between.
		'synthetic triggerEdge: Text node between' : function() {
			testEditor( this, {},
				'<div id="up" style="height: 50px; margin: 0 0 50px; background: green;">Up div</div>\
				Text\
				<div id="bottom" style="height: 50px; background: orange;">Bottom div</div>',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 20,
								y : 40 		// Place mouse in the bottom of #up.
							},
							element : editable.getChild( [ 0 ] )	// Select #up
						}, true ),
						trigger = backdoor.triggerEdge( that );

					assert.isNull( trigger );
				} );
		},

		// Simulate triggerEdge on a pair of elements.
		'synthetic triggerEdge: Element is first or last child' : function() {
			testEditor( this, {},
				'<div id="container" style="padding: 50px; background: green;">\
					<!-- Comment goes here --> <!-- Another comment after white space -->\
					<div id="child" style="height: 50px; background: orange;">A child.</div>\
					<!-- Comment goes here --> <!-- Another comment after white space -->\
				</div>',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 60,		// Place mouse in the left of #child.
								y : 60 		// Place mouse in the top of #child.
							},
							element : editable.getChild( [ 0, 5 ] )	// Select #child
						}, true ),
						trigger = backdoor.triggerEdge( that );

					// Check the first-child feature.
					assert.areEqual( 'child', trigger.lower.getId() );
					assert.isNull( trigger.upper );

					that.mouse.y = 90; 		// Place mouse in the bottom of #child.
					trigger = backdoor.triggerEdge( that );

					// Check the last-child feature.
					assert.areEqual( 'child', trigger.upper.getId() );
					assert.isNull( trigger.lower );
				} );
		},

		// Simulate triggerExpand on a pair of elements.
		'synthetic triggerExpand' : function() {
			testEditor( this, {},
				'<div id="up" style="height: 50px; margin: 0 0 50px; background: green;">Up div</div>\
				<!-- Comment goes here --> <!-- Another comment after white space -->\
				<div id="floated" style="float: right">I am floated</div>\
				<div id="bottom" style="height: 50px; background: orange;">Bottom div</div>',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 20,
								y : 70		// Place mouse between #up and #bottom.
							},
							element : editable	// Select editable
						}, true ),
						trigger = backdoor.triggerExpand( that );

					assert.areEqual( 'up', trigger.upper.getId() );
					assert.areEqual( 'bottom', trigger.lower.getId() );
				} );
		},

		// Simulate triggerExpand on a pair of elements with BR between.
		'synthetic triggerExpand: BR between' : function() {
			testEditor( this, {},
				'<div id="up" style="height: 50px; margin: 0 0 50px; background: green;">Up div</div>\
				<br/>\
				<div id="bottom" style="height: 50px; background: orange;">Bottom div</div>',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 20,
								y : 70		// Place mouse between #up and #bottom.
							},
							element : editable	// Select editable
						}, true ),
						trigger = backdoor.triggerExpand( that );

					assert.isNull( trigger );
				} );
		},

		// Simulate triggerExpand on a pair of elements with BR between.
		'synthetic triggerExpand: Text node between' : function() {
			testEditor( this, {},
				'<div id="up" style="height: 50px; margin: 0 0 50px; background: green;">Up div</div>\
				Foo\
				<div id="bottom" style="height: 50px; background: orange;">Bottom div</div>',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 20,
								y : 70		// Place mouse between #up and #bottom.
							},
							element : editable	// Select editable
						}, true ),
						trigger = backdoor.triggerExpand( that );

					assert.isNull( trigger );
				} );
		},


		// Simulate triggerExpand on a pair of elements when elements are close and the pointer is outside.
		'synthetic triggerExpand: Direct siblings with pointer in outer space' : function() {
			testEditor( this, {},
				'<div id="up" style="height: 50px; width: 100px; background: green;">Up div</div>\
				<div id="bottom" style="height: 50px; width: 100px; background: orange;">Bottom div</div>',
				function( editor, editable, backdoor ) {
					var that = CKEDITOR.tools.extend( backdoor.that,
						{
							mouse :
							{
								x : 150,
								y : 55		// Place mouse between #up and #bottom.
							},
							element : editable	// Select editable
						}, true ),
						trigger = backdoor.triggerExpand( that );

					assert.areEqual( 'up', trigger.upper.getId() );
					assert.areEqual( 'bottom', trigger.lower.getId() );
				} );
		},

		// Checks if the line is being removed from editable on getData
		'getData box clearing' : function() {
			var str1 = '<div>CK</div>',
				str2 = '<div>Editor</div>';

			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					var dummy1 = CKEDITOR.dom.element.createFromHtml( str1, editor.document ),
						dummy2 = CKEDITOR.dom.element.createFromHtml( str2, editor.document );

					dummy1.appendTo( editable );
					dummy2.appendTo( editable );

					backdoor.that.trigger = new backdoor.boxTrigger( [ dummy1, dummy2, EDGE_MIDDLE, TYPE_EXPAND ] );
					backdoor.that.line.attach().place();

					assert.areEqual( str1 + str2, bender.tools.compatHtml( editor.getData() ) );
				} );
		},

		'get size' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					var div = CKEDITOR.dom.element.createFromHtml( '<div style="\
							width: 200px; height: 100px;\
							padding: 5px 10px 15px 20px;\
							margin: 2px 4px 8px 16px;\
							border-width: 3px 6px 9px 12px;\
							border-style: dashed;\
							border-color: orange;\
							background: pink;\
							">Foo<br>Bar</div>', editor.document ),
						stretcher = CKEDITOR.dom.element.createFromHtml( '<div style="height: 1000px;\
							width: 100px; background: violet;">Foo</div>', editor.document );

					stretcher.appendTo( editable );

					div.appendTo( editable );
					div.scrollIntoView();

					var size = backdoor.getSize( backdoor.that, div, true );
					delete size.ignoreScroll;

					compareObjects( size,
						{
							border : { bottom : 9, right : 6, left : 12, top : 3 },
							padding : { bottom : 15, right : 10, left : 20, top : 5 },
							margin : { bottom : 8, right : 4, left : 16, top : 2 },
							top : 1002,
							left : 16,
							outerWidth : 248,
							outerHeight : 132,
							height : 100,
							width : 200,
							bottom : 1134,
							right : 264
						} );
				} );
		},

		// Checks the correctness of the boxTrigger constructor and methods.
		'box trigger' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					var trigger = new backdoor.boxTrigger( [ null, null, EDGE_MIDDLE, TYPE_EXPAND ] );

					assert.isTrue( trigger.is( EDGE_MIDDLE )
						&& trigger.is( TYPE_EXPAND )
						&& trigger.is( LOOK_NORMAL ) );

					trigger.set( EDGE_BOTTOM, TYPE_EDGE, LOOK_TOP );

					assert.isTrue( trigger.is( EDGE_BOTTOM )
						&& trigger.is( TYPE_EDGE )
						&& trigger.is( LOOK_TOP ) );

					assert.isFalse( trigger.is( EDGE_MIDDLE )
						|| trigger.is( TYPE_EXPAND )
						|| trigger.is( LOOK_BOTTOM ) );
				} );
		},

		'get ascendant trigger' : function() {
			testEditor( this, {},
				tablePlayGround,
				function( editor, editable, backdoor ) {
					backdoor.that.element = editor.document.getById( 'cell' );
					assert.isTrue(
						backdoor.getAscendantTrigger(
							backdoor.that
						).is( 'table' ) );
				} );
		},

		'get non empty neighbour' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<u>Any</u> <b>CKSource previous</b>Foo\
						<!-- Comment -->foo<span>^Start</span>\
						<!-- Comment -->bar<i>CKSource next</i> <u>Any</u>' );

					var startU = editable.getChild( [ 0 ] ),
						startB = editable.getChild( [ 2 ] ),
						span = editable.getChild( [ 6 ] ),
						endI = editable.getChild( [ 10 ] ),
						endU = editable.getChild( [ 12 ] );

					assert.isNull( backdoor.getNonEmptyNeighbour( backdoor.that, startU, true ) );	// first U previous
					assert.isTrue( backdoor.getNonEmptyNeighbour( backdoor.that, startB, true ).is( 'u' ) );	// first B previous

					assert.areEqual( 'bar', backdoor.getNonEmptyNeighbour( backdoor.that, span ).getText() );	// Span next
					assert.areEqual( 'foo', backdoor.getNonEmptyNeighbour( backdoor.that, span, true ).getText() );	// Span previous

					assert.isTrue( backdoor.getNonEmptyNeighbour( backdoor.that, endI ).is( 'u' ) );	// Last I next
				} );
		},

		// Checks line (+ line children) recognition function
		'is line' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					var dummy1 = CKEDITOR.dom.element.createFromHtml( '<div>CK</div>', editor.document ),
						dummy2 = CKEDITOR.dom.element.createFromHtml( '<div>Editor</div>', editor.document );

					editable.setHtml( '' );
					dummy1.appendTo( editable );
					dummy2.appendTo( editable );

					backdoor.that.trigger = new backdoor.boxTrigger( [ dummy1, dummy2, EDGE_MIDDLE, TYPE_EXPAND, LOOK_NORMAL ] );
					backdoor.that.line.attach().place();

					assert.isTrue( backdoor.isLine( backdoor.that, editable.getChild( [ 0, 0 ] ) )  );	// The "line"
					assert.isTrue( backdoor.isLine( backdoor.that, editable.getChild( [ 0, 0, 2 ] ) ) );	// The triangle
				} );
		},

		'magicline removes itself on editor#getData without superfluous operations' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					var called = 0;

					editable.setHtml( '<p>data</p>' );

					// Mock editable#getData.
					editable.getData = function() {
						called += 1;
						// Execute original getData().
						return CKEDITOR.editable.prototype.getData.apply( this, arguments );
					};

					// Attach magicline using the backdoor.
					backdoor.that.line.attach();

					assert.areEqual( '<p>data</p>', bender.tools.compatHtml( editor.getData() ) );

					assert.areEqual( 1, called );
				} );
		},

		'magicline with editor.config.enterMode set to ENTER_P' : function() {
			testEditor( this,
				{
					enterMode : CKEDITOR.ENTER_P
				},
				'<p>Foo</p>',
				function( editor, editable, backdoor ) {
					var hr = CKEDITOR.dom.element.createFromHtml( '<hr>', backdoor.that.doc );
					hr.appendTo( editable );

					backdoor.that.element = hr;

					// Access focus space before HR.
					backdoor.accessFocusSpace( backdoor.that, function( accessNode ) {
							accessNode.insertBefore( hr );
						} );

					assert.areEqual( '<p>Foo</p><p>&nbsp;</p><hr />', bender.tools.compatHtml( convertNbsp( editor.getData() ) ) );
				} );
		},

		'magicline with editor.config.enterMode set to ENTER_DIV' : function() {
			testEditor( this,
				{
					enterMode : CKEDITOR.ENTER_DIV
				},
				'<div>Foo</div>',
				function( editor, editable, backdoor ) {
					var hr = CKEDITOR.dom.element.createFromHtml( '<hr>', backdoor.that.doc );
					hr.appendTo( editable );

					backdoor.that.element = hr;

					// Access focus space before HR.
					backdoor.accessFocusSpace( backdoor.that, function( accessNode ) {
							accessNode.insertBefore( hr );
						} );

					assert.areEqual( '<div>Foo</div><div>&nbsp;</div><hr />', bender.tools.compatHtml( convertNbsp( editor.getData() ) ) );
				} );
		},

		'magicline with editor.config.enterMode set to ENTER_BR' : function() {
			testEditor( this,
				{
					enterMode : CKEDITOR.ENTER_BR
				},
				'<hr />',
				function( editor, editable, backdoor ) {
					var hr = CKEDITOR.dom.element.createFromHtml( '<hr>', backdoor.that.doc );
					hr.appendTo( editable );

					backdoor.that.element = hr;

					// Access focus space before HR.
					backdoor.accessFocusSpace( backdoor.that, function( accessNode ) {
							accessNode.insertBefore( hr );
						} );

					assert.areEqual( '<hr />&nbsp;<hr />' , bender.tools.compatHtml( convertNbsp( editor.getData() ) ) );
				} );
		},

		'command: access space with empty editable' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					// Setup empty editable.
					bender.tools.setHtmlWithSelection( editor, '^' );

					editor.execCommand( 'accessPreviousSpace' );
					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( '^' , bender.tools.getHtmlWithSelection( editor ) );
				} );
		},

		'command: access space - neighbour trigger is first-child (accessible)' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, ' <div>Foo</div> <p>Ba^r</p> <div>Foo</div> ' );

					editor.execCommand( 'accessPreviousSpace' );
					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( '<div>Foo</div><p>Ba^r</p><div>Foo</div>',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space - neighbour trigger is first-child (inaccessible)' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, ' <hr /> <p>Ba^r</p>' );

					editor.execCommand( 'accessPreviousSpace' );

					assert.areEqual( '<p>^&nbsp;</p><hr /><p>Bar</p>',
						htmlWithSelection( editor ) );

					bender.tools.setHtmlWithSelection( editor, '<p>Ba^r</p> <hr /> ' );

					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( '<p>Bar</p><hr /><p>^&nbsp;</p>',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space - neighbour trigger has a sibling trigger (accessible)' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<div>A</div><!-- Comment --> <div>B</div> <p>Ba^r</p><div>C</div><!-- Comment --> <div>D</div> ' );

					editor.execCommand( 'accessPreviousSpace' );
					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( '<div>A</div><!-- Comment --><div>B</div><p>Ba^r</p><div>C</div><!-- Comment --><div>D</div>',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space - neighbour trigger has a sibling trigger (inaccessible)' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<hr /><!-- Comment --> <hr /> <p>Ba^r</p>' );

					editor.execCommand( 'accessPreviousSpace' );

					assert.areEqual( '<hr /><!-- Comment --><p>^&nbsp;</p><hr /><p>Bar</p>',
						htmlWithSelection( editor ) );

					bender.tools.setHtmlWithSelection( editor, '<p>Ba^r</p> <hr /><!-- Comment --> <hr /> ' );

					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( '<p>Bar</p><hr /><p>^&nbsp;</p><!-- Comment --><hr />',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space - go down inline elements when looking for neighbour' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<hr /><!-- Comment --> <hr /> <p><a href="#foo"><span><em>Ba^r</em></span></a></p>' );

					editor.execCommand( 'accessPreviousSpace' );

					assert.areEqual( '<hr /><!-- Comment --><p>^&nbsp;</p><hr /><p><a href="#foo"><span><em>Bar</em></span></a></p>',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space before - towards DOM root' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<div><p><span>Ba^r</span></p></div>' );

					editor.execCommand( 'accessPreviousSpace' );

					assert.areEqual( '<p>^&nbsp;</p><div><p><span>Bar</span></p></div>',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space after - towards DOM root' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<div><p><span>Ba^r</span></p></div>' );

					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( '<div><p><span>Bar</span></p></div><p>^&nbsp;</p>',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space before list' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<!-- Comment goes here --><ul><li>Foo</li><li>B^ar</li></ul>' );

					editor.execCommand( 'accessPreviousSpace' );

					assert.areEqual( '<!-- Comment goes here --><p>^&nbsp;</p><ul><li>Foo</li><li>Bar</li></ul>',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space after list' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<ul><li>Foo</li><li>B^ar</li></ul><!-- Comment goes here -->' );

					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( '<ul><li>Foo</li><li>Bar</li></ul><p>^&nbsp;</p><!-- Comment goes here -->',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space before table' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '\
						<!-- Comment goes here -->\
						<table><tbody><tr><td>CKE^ditor</td></tr></tbody></table>' );

					editor.execCommand( 'accessPreviousSpace' );

					assert.areEqual( '<!-- Comment goes here --><p>^&nbsp;</p><table><tbody><tr><td>CKEditor</td></tr></tbody></table>',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space after table' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '\
						<table><tbody><tr><td>CKE^ditor</td></tr></tbody></table>\
						<!-- Comment goes here -->' );

					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( '<table><tbody><tr><td>CKEditor</td></tr></tbody></table><p>^&nbsp;</p><!-- Comment goes here -->',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space before/after - check sibling' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, 'a<div><p><span>Ba^r</span></p></div>b' );

					editor.execCommand( 'accessPreviousSpace' );
					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( 'a<div><p><span>Ba^r</span></p></div>b',
						htmlWithSelection( editor ) );
				} );
		},

		'command: access space before/after - check sibling 2' : function() {
			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<hr />x<hr /><p>Ba^r</p><div>Foo</div>x' );

					editor.execCommand( 'accessPreviousSpace' );
					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( '<hr />x<hr /><p>Ba^r</p><div>Foo</div>x',
						htmlWithSelection( editor ) );
				} );
		},

		'command: deep space access - multiple commands in the same direction with undo' : function() {
			var that = this;

			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<table><tbody><tr><td><table><tbody><tr><td>Fo^o</td></tr></tbody></table></td></tr></tbody></table>' );

					editor.execCommand( 'accessPreviousSpace' );

					assert.areEqual( '<table><tbody><tr><td><p>^&nbsp;</p><table><tbody><tr><td>Foo</td></tr></tbody></table></td></tr></tbody></table>',
						htmlWithSelection( editor ) );

					editor.execCommand( 'accessPreviousSpace' );

					assert.areEqual( '<p>^&nbsp;</p><table><tbody><tr><td><table><tbody><tr><td>Foo</td></tr></tbody></table></td></tr></tbody></table>',
						htmlWithSelection( editor ) );

					editor.execCommand( 'undo' );

					assert.areEqual( '<table><tbody><tr><td><p>^&nbsp;</p><table><tbody><tr><td>Foo</td></tr></tbody></table></td></tr></tbody></table>',
						htmlWithSelection( editor ) );

					editor.execCommand( 'accessNextSpace' );

					assert.areEqual( '<table><tbody><tr><td><p>&nbsp;</p><table><tbody><tr><td>Foo</td></tr></tbody></table></td></tr></tbody></table><p>^&nbsp;</p>',
						htmlWithSelection( editor ) );

					editor.execCommand( 'undo' );

					assert.areEqual( '<table><tbody><tr><td><p>^&nbsp;</p><table><tbody><tr><td>Foo</td></tr></tbody></table></td></tr></tbody></table>',
						htmlWithSelection( editor ) );

					editor.execCommand( 'accessPreviousSpace' );

					assert.areEqual( '<p>^&nbsp;</p><table><tbody><tr><td><table><tbody><tr><td>Foo</td></tr></tbody></table></td></tr></tbody></table>',
						htmlWithSelection( editor ) );
				} );
		},

		'command: deep space access - with changes': function() {
			var that = this;

			testEditor( this, {},
				'',
				function( editor, editable, backdoor ) {
					bender.tools.setHtmlWithSelection( editor, '<table><tbody><tr><td><table><tbody><tr><td>Fo^o</td></tr></tbody></table></td></tr></tbody></table>' );

					editor.execCommand( 'accessPreviousSpace' );
					editor.insertText( 'Inserted' );

					assert.areEqual( '<table><tbody><tr><td><p>Inserted^&nbsp;</p><table><tbody><tr><td>Foo</td></tr></tbody></table></td></tr></tbody></table>',
						htmlWithSelection( editor ) );

					editor.execCommand( 'accessPreviousSpace' );

					assert.areEqual( '<p>^&nbsp;</p><table><tbody><tr><td><p>Inserted&nbsp;</p><table><tbody><tr><td>Foo</td></tr></tbody></table></td></tr></tbody></table>',
						htmlWithSelection( editor ) );
				} );
		}
	} );
} )();
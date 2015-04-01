/* bender-tags: editor,unit,dom */

( function() {
	'use strict';

	bender.test( {
		test_appendTo: function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document ),
				inner = new CKEDITOR.dom.element( 'b' );

			frag.append( inner );

			var container = CKEDITOR.document.getById( 'fragmentContainer1' );
			frag.appendTo( container );
			assert.isTrue( container.getLast().equals( inner ) );
		},

		test_append: function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document ),
				inner = new CKEDITOR.dom.element( 'b' );

			frag.append( inner );

			var container = CKEDITOR.document.getById( 'fragmentContainer3' );
			container.append( frag );
			assert.isTrue( container.getLast().equals( inner ) );
		},

		test_getFirst: function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document ),
				inner = new CKEDITOR.dom.element( 'b' );

			frag.append( inner );

			var first = frag.getFirst();
			assert.isTrue( first.equals( inner ) );
		},

		test_getLast: function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document ),
				inner = new CKEDITOR.dom.element( 'b' ), lastInner = inner.clone();

			frag.append( inner );
			frag.append( lastInner );

			var last = frag.getLast();
			assert.isTrue( last.equals( lastInner ) );
		},

		test_moveChildren: function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document ),
				inner1 = new CKEDITOR.dom.element( 'b' ),
				inner2 = new CKEDITOR.dom.element( 'i' );

			frag.append( inner1 );
			frag.append( inner2 );

			// Move to element
			var element = new CKEDITOR.dom.element( 'span' );
			frag.moveChildren( element, true );
			assert.isTrue( element.getFirst().equals( inner1 ) );
			assert.isTrue( element.getLast().equals( inner2 ) );
		},

		test_moveChildren2: function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document ),
				inner1 = new CKEDITOR.dom.element( 'b' ),
				inner2 = new CKEDITOR.dom.element( 'i' );

			frag.append( inner1 );
			frag.append( inner2 );

			// Move to fragment
			var anotherFrag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			frag.moveChildren( anotherFrag, true );
			assert.isTrue( anotherFrag.getFirst().equals( inner1 ) );
			assert.isTrue( anotherFrag.getLast().equals( inner2 ) );
		},

		test_appendText: function() {
			var element = new CKEDITOR.dom.element( 'script' );
			element.appendText( 'Test appendText' );
			assert.areEqual( 'Test appendText', element.$.text );
		},

		test_ltrim: CKEDITOR.env.ie ?
			function() {
				// IE dom operation will trim preceding empty text,
				// here we use 'splitText' way to create leading spaces
				// instead for testing.
				var emptyTextNode = CKEDITOR.document.createText( '@ \ttext\t ' ),
					frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

				frag.append( emptyTextNode );
				frag.getFirst().split( 1 );
				frag.getFirst().remove();
				frag.ltrim();

				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( 'text\t ', ct.getText() );
			} : function() {
				var element = CKEDITOR.dom.element.createFromHtml( '<div id="trimTarget">\t\ntext\t\n</div>' ),
					frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

				element.moveChildren( frag );
				frag.ltrim();

				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( 'text\t\n', ct.getText() );
			},

		test_rtrim: CKEDITOR.env.ie ?
			function() {
				var emptyTextNode = CKEDITOR.document.createText( '@ \ttext\t ' ),
					frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

				frag.append( emptyTextNode );
				frag.getFirst().split( 1 );
				frag.getFirst().remove();
				frag.rtrim();

				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( ' \ttext', ct.getText() );
			} : function() {
				var element = CKEDITOR.dom.element.createFromHtml( '<div id="trimTarget">\t\ntext\t\n</div>' ),
					frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

				element.moveChildren( frag );
				frag.rtrim();

				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( '\t\ntext', ct.getText() );
			},

		test_trim: CKEDITOR.env.ie ?
			function() {
				var emptyTextNode = CKEDITOR.document.createText( '@ \t\ntext\t\n ' ),
					frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

				frag.append( emptyTextNode );
				frag.getFirst().split( 1 );
				frag.getFirst().remove();
				frag.trim();

				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( 'text', ct.getText() );
			} : function() {
				var element = CKEDITOR.dom.element.createFromHtml( '<div id="trimTarget">\t\ntext\t\n</div>' ),
					frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

				element.moveChildren( frag );
				frag.trim();

				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( 'text', ct.getText() );
			},

		test_insertAfter: function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document ),
				inner = new CKEDITOR.dom.element( 'b' );

			frag.append( inner );

			var container = CKEDITOR.document.getById( 'fragmentContainer2' ),
				sibling = CKEDITOR.document.getById( 'fragmentSibling1' );

			frag.insertAfterNode( sibling );
			assert.isTrue( container.getLast().equals( inner ) );
		},

		test_getChildCount: function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document ),
				inner1 = new CKEDITOR.dom.element( 'b' ),
				inner2 = new CKEDITOR.dom.element( 'i' );

			frag.append( inner1 );
			frag.append( inner2 );

			assert.areEqual( 2, frag.getChildCount() );
		},

		test_getChild: function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document ),
				inner1 = new CKEDITOR.dom.element( 'b' ),
				inner2 = new CKEDITOR.dom.element( 'i' );

			frag.append( inner1 );
			frag.append( inner2 );

			assert.isTrue( inner2.equals( frag.getChild( 1 ) ) );
		},

		test_getChildren: function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document ),
				inner1 = new CKEDITOR.dom.element( 'b' ),
				inner2 = new CKEDITOR.dom.element( 'i' );

			frag.append( inner1 );
			frag.append( inner2 );

			var childNodesList = frag.getChildren();
			assert.areEqual( 2, childNodesList.count() );
			assert.isTrue( inner2.equals( childNodesList.getItem( 1 ) ) );
		},

		test_getDocument: function() {
			var doc = CKEDITOR.document,
				innerDoc = new CKEDITOR.dom.document( doc.getById( 'innerFrame' ).$.contentWindow.document ),
				frag1 = new CKEDITOR.dom.documentFragment( doc ),
				frag2 = new CKEDITOR.dom.documentFragment( innerDoc );

			assert.isTrue( doc.equals( frag1.getDocument() ) );
			assert.isTrue( innerDoc.equals( frag2.getDocument() ) );
		},

		'test getHtml': function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

			CKEDITOR.dom.element.createFromHtml( '<b>foo</b>' ).appendTo( frag );
			CKEDITOR.dom.element.createFromHtml( '<i>bar</i>' ).appendTo( frag );

			assert.areSame( '<b>foo</b><i>bar</i>', bender.tools.fixHtml( frag.getHtml(), 1, 1 ), 'HTML of documentFragment' );
		},

		// #13101
		'test getHtml with html5': function() {
			// IE8 only.
			if ( !CKEDITOR.env.ie || CKEDITOR.env.version > 8 )
				assert.ignore();

			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

			CKEDITOR.dom.element.createFromHtml( '<figure>foo</figure>' ).appendTo( frag );

			assert.areSame( '<figure>foo</figure>', frag.getHtml() );
		},

		'test clone': function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

			CKEDITOR.dom.element.createFromHtml( '<b>foo</b>' ).appendTo( frag );
			CKEDITOR.dom.element.createFromHtml( '<i>bar</i>' ).appendTo( frag );

			var clone = frag.clone();

			assert.areSame( CKEDITOR.NODE_DOCUMENT_FRAGMENT, clone.type );
			assert.areSame( 0, clone.getChildCount() );
		},

		'test clone with children': function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

			CKEDITOR.dom.element.createFromHtml( '<b>foo</b>' ).appendTo( frag );
			CKEDITOR.dom.element.createFromHtml( '<i id="bar">bar</i>' ).appendTo( frag );

			var clone = frag.clone( 1 );

			assert.areSame( 2, clone.getChildCount() );
			assert.areSame( '<b>foo</b>', bender.tools.fixHtml( clone.getChild( 0 ).getOuterHtml() ) );
			assert.areSame( '<i>bar</i>', bender.tools.fixHtml( clone.getChild( 1 ).getOuterHtml() ) );
		},

		'test clone with children and ids': function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

			CKEDITOR.dom.element.createFromHtml( '<b id="foo">foo</b>' ).appendTo( frag );

			var clone = frag.clone( 1, 1 );

			assert.areSame( 1, clone.getChildCount() );
			assert.areSame( '<b id="foo">foo</b>', bender.tools.fixHtml( clone.getChild( 0 ).getOuterHtml() ) );
		},

		'test clone with html5': function() {
			var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

			CKEDITOR.dom.element.createFromHtml( '<figure>foo</figure>' ).appendTo( frag );

			var clone = frag.clone( 1 );

			assert.areSame( 1, clone.getChildCount() );
			assert.areSame( '<figure>foo</figure>', bender.tools.fixHtml( clone.getChild( 0 ).getOuterHtml() ) );
		}
	} );
} )();

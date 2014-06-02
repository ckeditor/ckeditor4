/* bender-tags: editor,unit,dom */

bender.test(
{
		test_appendTo : function() {
			var frag =
					new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			var inner =
					new CKEDITOR.dom.element( 'b' );
			frag.append( inner );
			var container = CKEDITOR.document.getById( 'fragmentContainer1' );
			frag.appendTo( container );
			assert.isTrue( container.getLast().equals( inner ) );
		},

		test_append : function() {
			var frag =
					new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			var inner =
					new CKEDITOR.dom.element( 'b' );
			frag.append( inner );
			var container = CKEDITOR.document.getById( 'fragmentContainer3' );
			container.append( frag );
			assert.isTrue( container.getLast().equals( inner ) );
		},

		test_getFirst : function() {
			var frag =
					new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			var inner =
					new CKEDITOR.dom.element( 'b' );
			frag.append( inner );
			var first = frag.getFirst();
			assert.isTrue( first.equals( inner ) );
		},

		test_getLast : function() {
			var frag =
					new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			var inner =
					new CKEDITOR.dom.element( 'b' ), lastInner = inner.clone();
			frag.append( inner );
			frag.append( lastInner );
			var last = frag.getLast();
			assert.isTrue( last.equals( lastInner ) );
		},

		test_moveChildren : function() {
			var frag =
					new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			var inner1 = new CKEDITOR.dom.element( 'b' ),
			inner2 = new CKEDITOR.dom.element( 'i' );
			frag.append( inner1 );
			frag.append( inner2 );

			// Move to element
			var element = new CKEDITOR.dom.element( 'span' );
			frag.moveChildren( element, true );
			assert.isTrue( element.getFirst().equals( inner1 ) );
			assert.isTrue( element.getLast().equals( inner2 ) );
		},

		test_moveChildren2 : function() {
			var frag =
					new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			var inner1 = new CKEDITOR.dom.element( 'b' ),
				inner2 = new CKEDITOR.dom.element( 'i' );
			frag.append( inner1 );
			frag.append( inner2 );

			// Move to fragment
			var anotherFrag = new CKEDITOR.dom.documentFragment(
				CKEDITOR.document );
			frag.moveChildren( anotherFrag, true );
			assert.isTrue( anotherFrag.getFirst().equals( inner1 ) );
			assert.isTrue( anotherFrag.getLast().equals( inner2 ) );
		},

		test_appendText : function() {
			var element = new CKEDITOR.dom.element( 'script' );
			element.appendText( 'Test appendText' );
			assert.areEqual( 'Test appendText', element.$.text );
		},

		test_ltrim: CKEDITOR.env.ie ?
			function() {
				// IE dom operation will trim preceding empty text,
				// here we use 'splitText' way to create leading spaces
				// instead for testing.
				var emptyTextNode = CKEDITOR.document.createText( '@ \ttext\t ' );
				var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );
				frag.append( emptyTextNode );
				frag.getFirst().split( 1 );
				frag.getFirst().remove();
				frag.ltrim();
				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( 'text\t ', ct.getText() );
			} :
			function() {
				var element = CKEDITOR.dom.element.createFromHtml(
					'<div id="trimTarget">\t\ntext\t\n</div>'
				);
				var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );
				element.moveChildren( frag );
				frag.ltrim();
				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( 'text\t\n', ct.getText() );
			},

		test_rtrim: CKEDITOR.env.ie ?
			function() {
				var emptyTextNode = CKEDITOR.document.createText( '@ \ttext\t ' );
				var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );
				frag.append( emptyTextNode );
				frag.getFirst().split( 1 );
				frag.getFirst().remove();
				frag.rtrim();
				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( ' \ttext', ct.getText() );
			} :
			function() {
				var element = CKEDITOR.dom.element.createFromHtml(
					'<div id="trimTarget">\t\ntext\t\n</div>'
				);
				var frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );
				element.moveChildren( frag );
				frag.rtrim();
				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );

				assert.areSame( '\t\ntext', ct.getText() );
			},

		test_trim: CKEDITOR.env.ie ?
			function() {
				var emptyTextNode = CKEDITOR.document.createText( '@ \t\ntext\t\n ' );
				var frag =
						new CKEDITOR.dom.documentFragment( CKEDITOR.document );
				frag.append( emptyTextNode );
				frag.getFirst().split( 1 );
				frag.getFirst().remove();
				frag.trim();
				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( 'text', ct.getText() );
			} :
			function() {
				var element = CKEDITOR.dom.element.createFromHtml(
					'<div id="trimTarget">\t\ntext\t\n</div>'
				);
				var frag =
						new CKEDITOR.dom.documentFragment( CKEDITOR.document );
				element.moveChildren( frag );
				frag.trim();
				var ct = new CKEDITOR.dom.element( 'div' );
				ct.append( frag );
				assert.areSame( 'text', ct.getText() );
			},

		test_insertAfter : function() {
			var frag =
					new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			var inner = new CKEDITOR.dom.element( 'b' );
			frag.append( inner );
			var container = CKEDITOR.document.getById( 'fragmentContainer2' );
			var sibling = CKEDITOR.document.getById( 'fragmentSibling1' );
			frag.insertAfterNode( sibling );
			assert.isTrue( container.getLast().equals( inner ) );
		},

		test_getChildCount : function() {
			var frag =
					new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			var inner1 = new CKEDITOR.dom.element( 'b' ),
				inner2 = new CKEDITOR.dom.element( 'i' );
			frag.append( inner1 );
			frag.append( inner2 );

			assert.areEqual( 2, frag.getChildCount() );
		},

		test_getChild : function() {
			var frag =
					new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			var inner1 = new CKEDITOR.dom.element( 'b' ),
				inner2 = new CKEDITOR.dom.element( 'i' );
			frag.append( inner1 );
			frag.append( inner2 );

			assert.isTrue( inner2.equals( frag.getChild( 1 ) ) );
		},

		test_getChildren : function() {
			var frag =
					new CKEDITOR.dom.documentFragment( CKEDITOR.document );
			var inner1 = new CKEDITOR.dom.element( 'b' ),
				inner2 = new CKEDITOR.dom.element( 'i' );
			frag.append( inner1 );
			frag.append( inner2 );

			var childNodesList = frag.getChildren();
			assert.areEqual( 2, childNodesList.count() );
			assert.isTrue( inner2.equals( childNodesList.getItem( 1 ) ) );
		},

		test_getDocument: function() {
			var doc = CKEDITOR.document,
				innerDoc = new CKEDITOR.dom.document(
					doc.getById( 'innerFrame' ).$.contentWindow.document );
			var frag1 = new CKEDITOR.dom.documentFragment( doc ),
				frag2 = new CKEDITOR.dom.documentFragment( innerDoc );

			assert.isTrue( doc.equals( frag1.getDocument() ) );
			assert.isTrue( innerDoc.equals( frag2.getDocument() ) );
		}
} );
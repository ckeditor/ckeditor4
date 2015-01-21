/* bender-tags: editor,unit,dom */
/* global appendDomObjectTests, YUI */

var getInnerHtml = bender.tools.getInnerHtml,
	getOuterHtml = function( element ) {
		return bender.tools.fixHtml( element.getOuterHtml() );
	},
	doc = CKEDITOR.document,
	newElement = function( element, ownerDocument ) {
		return new CKEDITOR.dom.element( element, ownerDocument );
	};

bender.test( appendDomObjectTests(
	function( id ) {
		return new CKEDITOR.dom.element( document.getElementById( id ) );
	},
	{
		test_$: function() {
			var element = newElement( document.getElementById( 'test1' ) );
			assert.areSame( document.getElementById( 'test1' ), element.$ );
		},

		test_getId1: function() {
			var element = newElement( document.getElementById( 'test1' ) );
			assert.areEqual( 'test1', element.getId() );
		},

		test_getId2: function() {
			// Used body to ommit head element when searching, because YUI add div to it.
			// See http://yuilibrary.com/forum-archive/forum/viewtopic.php@f=18&t=12285.html
			var element = newElement( document.body.getElementsByTagName( 'div' )[ 0 ] );
			assert.isNull( element.getId() );
		},

		test_getNameAtt1: function() {
			var element = newElement( document.getElementsByName( 'named1' )[ 0 ] );
			assert.areEqual( 'named1', element.getNameAtt() );
		},

		test_getNameAtt2: function() {
			var element = newElement( document.getElementById( 'test1' ) );
			assert.isNull( element.getNameAtt() );
		},

		test_getName: function() {
			var element = newElement( document.getElementById( 'test1' ) );
			assert.areEqual( 'textarea', element.getName(), 'First call' );
			assert.areEqual( 'textarea', element.getName(), 'Second call' );
		},

		test_hide: function() {
			var nativeElement = document.getElementById( 'test1' );
			nativeElement.style.display = '';

			var element = newElement( nativeElement );
			element.hide();

			assert.areEqual( 'none', nativeElement.style.display );
		},

		test_show: function() {
			var nativeElement = document.getElementById( 'test1' );
			nativeElement.style.display = '';

			var element = newElement( nativeElement );
			element.show();

			assert.areEqual( '', nativeElement.style.display );
		},

		test_createFromHtml: function() {
			var element = CKEDITOR.dom.element.createFromHtml( '<p>My test</p>' );
			assert.areEqual( 'p', element.getName(), 'element name doesn\'t match' );
			assert.areEqual( 'My test', element.$.innerHTML, 'the innerHTML doesn\'t match' );
		},

		test_createFromHtml2: function() {
			var element = CKEDITOR.dom.element.createFromHtml( '<div><x:x><p>Test</p></div>' );
			assert.areNotEqual( 'Test', element.getChild( 0, 0 ).innerHTML );
		},

		'test createFromHtml HTML5 element': function() {
			var element = CKEDITOR.dom.element.createFromHtml( '<figure>foo</figure>' );
			assert.areSame( 'figure', element.getName( 'figure' ) );
		},

		test_append1: function() {
			var element = newElement( document.getElementById( 'append' ) );
			element.append( newElement( 'b' ) );
			assert.areEqual( 'b', document.getElementById( 'append' ).firstChild.nodeName.toLowerCase() );
		},

		test_append2: function() {
			var element = newElement( document.getElementById( 'append' ) );
			element.append( 'i' );
			assert.areEqual( 'i', document.getElementById( 'append' ).lastChild.nodeName.toLowerCase() );
		},

		test_appendText1: function() {
			var element = newElement( document.getElementById( 'append' ) );
			element.setHtml( '' );
			element.appendText( 'Test appendText' );
			assert.areEqual( 'Test appendText', document.getElementById( 'append' ).innerHTML );
		},

		test_appendText2: function() {
			var element = newElement( 'script' );
			element.appendText( 'Test appendText' );
			assert.areEqual( 'Test appendText', element.$.text );
		},

		test_setHtml: function() {
			var element = newElement( document.getElementById( 'append' ) );
			element.setHtml( '<b>Test</b>' );
			assert.areEqual( '<b>test</b>', document.getElementById( 'append' ).innerHTML.toLowerCase(), 'First call doesn\'t match' );
			element.setHtml( 'Another test' );
			assert.areEqual( 'Another test', document.getElementById( 'append' ).innerHTML, 'Second call doesn\'t match' );
		},

		'test setHtml with HTML5 tags': function() {
			var element = CKEDITOR.document.createElement( 'div' );
			element.setHtml( '<figure>foo</figure>' );

			assert.isMatching( /^<figure>foo<\/figure>$/i, element.getHtml() );
		},

		test_getDocument1: function() {
			var element = newElement( 'div' );
			assert.areSame( document, element.getDocument().$, 'First call' );
			assert.areSame( document, element.getDocument().$, 'Second call' );
		},

		test_getDocument2: function() {
			var element = newElement( document.body );
			assert.areSame( document, element.getDocument().$, 'First call' );
			assert.areSame( document, element.getDocument().$, 'Second call' );
		},

		test_getFirst1: function() {
			var element = newElement( document.getElementById( 'append' ) );
			element.setHtml( '<b>Test</b>' );
			var first = element.getFirst();
			assert.areSame( 'b', first.getName() );
		},

		test_getFirst2: function() {
			var element = newElement( document.getElementById( 'append' ) );
			element.setHtml( 'Test' );
			var first = element.getFirst();
			assert.areSame( 'Test', first.$.nodeValue );
		},

		test_getFirst3: function() {
			var element = newElement( document.getElementById( 'append' ) );
			element.setHtml( '' );
			var first = element.getFirst();
			assert.isNull( first );
		},

		test_setAttribute1: function() {
			var element = newElement( document.getElementById( 'test1' ) );
			element.setAttribute( 'class', 'Test' );

			assert.areSame( 'Test', document.getElementById( 'test1' ).className );
		},

		test_setAttribute2: function() {
			var element = newElement( document.getElementById( 'test1' ) );
			element.setAttribute( 'style', 'position: absolute;' );

			assert.areEqual( 'position: absolute;', bender.tools.getAttribute( element, 'style' ) );
		},

		test_setAttribute3: function() {
			var element = newElement( document.getElementById( 'test1' ) );
			element.setAttribute( 'name', 'TestName' );

			assert.areEqual( 'TestName', document.getElementById( 'test1' ).name );
		},

		test_setAttribute4: function() {
			var element = newElement( document.getElementById( 'test1' ) );
			element.setAttribute( 'rows', 5 );

			assert.areEqual( 5, document.getElementById( 'test1' ).rows );
		},

		test_setAttributes: function() {
			var element = newElement( document.getElementById( 'test2' ) );
			element.setAttributes( {
				'class': 'Test',
				style: 'position: absolute;',
				name: 'TestName',
				rows: 5
			} );

			assert.areSame( 'Test', document.getElementById( 'test1' ).className, 'class is wrong' );
			assert.areEqual( 'position: absolute;', bender.tools.getAttribute( element, 'style' ), 'style is wrong' );
			assert.areEqual( 'TestName', document.getElementById( 'test1' ).name, 'name is wrong' );
			assert.areEqual( 5, document.getElementById( 'test1' ).rows, 'rows is wrong' );
		},

		test_setStyle1: function() {
			var element = newElement( document.getElementById( 'setStyle' ) );
			element.setStyle( 'position', 'absolute' );

			assert.areEqual( 'absolute', document.getElementById( 'setStyle' ).style.position );
		},

		test_setStyle2: function() {
			var element = newElement( document.getElementById( 'setStyle' ) );
			element.setStyle( 'float', 'right' );

			assert.areEqual( 'right', element.getStyle( 'float' ) );

			var div = new CKEDITOR.dom.element( 'div' );
			div.setStyle( 'float', 'left' );
			assert.areSame( 'float', div.getAttribute( 'style' ).split( ':' )[ 0 ].toLowerCase() );
		},

		test_setStyles: function() {
			var element = newElement( document.getElementById( 'setStyle' ) );
			element.setStyles( {
				position: 'absolute',
				'float': 'right'
			} );

			assert.areEqual( 'absolute', document.getElementById( 'setStyle' ).style.position );
			assert.areEqual( 'right', element.getStyle( 'float' ) );
		},

		test_setText1: function() {
			var element = newElement( document.getElementById( 'setText' ) );
			element.setText( 'A & B' );
			assert.areSame( 'A &amp; B', document.getElementById( 'setText' ).innerHTML );
		},

		test_setText2: function() {
			var element = newElement( document.getElementById( 'setText' ) );
			element.setText( 'C & D' );
			assert.areSame( 'C &amp; D', document.getElementById( 'setText' ).innerHTML );
		},

		test_addClass1: function() {
			var element = newElement( 'div' );
			element.addClass( 'classA' );
			assert.areSame( 'classA', element.$.className );
		},

		test_addClass2: function() {
			var element = newElement( 'div' );
			element.addClass( 'classA' );
			element.addClass( 'classA' );
			assert.areSame( 'classA', element.$.className );
		},

		test_addClass3: function() {
			var element = newElement( 'div' );
			element.addClass( 'classA' );
			element.addClass( 'classB' );
			element.addClass( 'classC' );
			assert.areSame( 'classA classB classC', element.$.className );
		},

		test_addClass4: function() {
			var element = newElement( 'div' );
			element.addClass( 'classA' );
			element.addClass( 'classB' );
			element.addClass( 'classC' );
			element.addClass( 'classA' );
			element.addClass( 'classB' );
			element.addClass( 'classC' );
			assert.areSame( 'classA classB classC', element.$.className );
		},

		test_removeClass1: function() {
			document.getElementById( 'removeClass' ).innerHTML = '';

			var element = CKEDITOR.dom.element.createFromHtml( '<div class="classA"></div>' );
			element.appendTo( newElement( document.getElementById( 'removeClass' ) ) );

			assert.areSame( '<div class="classa"></div>', getInnerHtml( 'removeClass' ) );
			element.removeClass( 'classA' );
			assert.areSame( '<div></div>', getInnerHtml( 'removeClass' ) );
		},

		test_removeClass2: function() {
			document.getElementById( 'removeClass' ).innerHTML = '';

			var element = CKEDITOR.dom.element.createFromHtml( '<div class="classA classB classC classD"></div>' );
			element.appendTo( newElement( document.getElementById( 'removeClass' ) ) );

			assert.areSame( '<div class="classa classb classc classd"></div>', getInnerHtml( 'removeClass' ) );
			element.removeClass( 'classA' );
			assert.areSame( '<div class="classb classc classd"></div>', getInnerHtml( 'removeClass' ) );
			element.removeClass( 'classC' );
			assert.areSame( '<div class="classb classd"></div>', getInnerHtml( 'removeClass' ) );
			element.removeClass( 'classD' );
			assert.areSame( '<div class="classb"></div>', getInnerHtml( 'removeClass' ) );
			element.removeClass( 'classB' );
			assert.areSame( '<div></div>', getInnerHtml( 'removeClass' ) );
		},

		test_removeClass3: function() {
			document.getElementById( 'removeClass' ).innerHTML = '';

			var element = CKEDITOR.dom.element.createFromHtml( '<div class="classA classB"></div>' );
			element.appendTo( newElement( document.getElementById( 'removeClass' ) ) );

			assert.areSame( '<div class="classa classb"></div>', getInnerHtml( 'removeClass' ) );
			element.removeClass( 'classXXX' );
			assert.areSame( '<div class="classa classb"></div>', getInnerHtml( 'removeClass' ) );
			element.removeClass( 'classB' );
			assert.areSame( '<div class="classa"></div>', getInnerHtml( 'removeClass' ) );
			element.removeClass( 'classYYY' );
			assert.areSame( '<div class="classa"></div>', getInnerHtml( 'removeClass' ) );
		},

		test_removeAttribute1: function() {
			document.getElementById( 'removeClass' ).innerHTML = '';

			var element = CKEDITOR.dom.element.createFromHtml( '<div class="classA"></div>' );
			element.appendTo( newElement( document.getElementById( 'removeClass' ) ) );

			element.removeAttribute( 'class' );
			assert.areSame( '<div></div>', getInnerHtml( 'removeClass' ) );
		},

		test_removeAttribute2: function() {
			document.getElementById( 'removeClass' ).innerHTML = '';

			var element = CKEDITOR.dom.element.createFromHtml( '<div style="position:absolute"></div>' );
			element.appendTo( newElement( document.getElementById( 'removeClass' ) ) );

			element.removeAttribute( 'style' );
			assert.areSame( '<div></div>', getInnerHtml( 'removeClass' ) );
		},

		test_removeAttribute3: function() {
			document.getElementById( 'removeClass' ).innerHTML = '';

			var element = CKEDITOR.dom.element.createFromHtml( '<div title="Test"></div>' );
			element.appendTo( newElement( document.getElementById( 'removeClass' ) ) );

			element.removeAttribute( 'title' );
			assert.areSame( '<div></div>', getInnerHtml( 'removeClass' ) );
		},

		test_remove: function() {
			var element = newElement( document.getElementById( 'removeInner' ) );
			element.remove();

			assert.areSame( '', getInnerHtml( 'removeOuter' ) );
		},

		test_getAttribute_tabindex1: function() {
			var element = newElement( document.getElementById( 'tabIndex10' ) );
			assert.areEqual( 10, bender.tools.getAttribute( element, 'tabindex' ) );
		},

		test_getAttribute_tabindex2: function() {
			var element = newElement( document.getElementById( 'tabIndexDef' ) );
			assert.isNull( bender.tools.getAttribute( element, 'tabindex' ) );
		},

		test_getAttribute_tabindex3: function() {
			var element = newElement( document.getElementById( 'tabIndexInputDef' ) );
			assert.isNull( bender.tools.getAttribute( element, 'tabindex' ) );
		},

		test_getAttribute_tabindex4: function() {
			var element = newElement( document.getElementById( 'tabIndexInput20' ) );
			assert.areEqual( 20, bender.tools.getAttribute( element, 'tabindex' ) );
		},

		test_getAttribute_tabindex5: function() {
			var element = newElement( document.getElementById( 'tabIndexScriptDef' ) );
			assert.areEqual( null, bender.tools.getAttribute( element, 'tabindex' ) );
		},

		/**
		 * Test set and retrieve 'checked' attribute value. (#4527)
		 */
		test_getAttribute_checked: function() {
			var unchecked1 = new CKEDITOR.dom.element.createFromHtml( '<input type="checkbox" />' ),
				checked1 = new CKEDITOR.dom.element.createFromHtml( '<input type="checkbox" checked="checked" />' ),
				checked2 = new CKEDITOR.dom.element( 'input' );

			checked2.setAttribute( 'type', 'checkbox' );
			checked2.setAttribute( 'checked', 'checked' );
			assert.isTrue( !unchecked1.getAttribute( 'checked' ) );
			assert.areSame( 'checked', checked1.getAttribute( 'checked' ) );
			assert.areSame( 'checked', checked2.getAttribute( 'checked' ) );
		},

		test_getAttribute_contenteditable: function() {
			var body = CKEDITOR.document.getBody();
			var element = body.append( CKEDITOR.dom.element.createFromHtml( '<div contenteditable="true"></div>' ) );
			assert.areEqual( 'true', element.getAttribute( 'contenteditable' ) );
			element = body.append( CKEDITOR.dom.element.createFromHtml( '<div contenteditable="false"></div>' ) );
			assert.areEqual( 'false', element.getAttribute( 'contenteditable' ) );
			element = body.append( CKEDITOR.dom.element.createFromHtml( '<div></div>' ) );
			assert.areEqual( null, element.getAttribute( 'contenteditable' ) );
		},

		/**
		 *  Test getAttribute and getAttribute will ingore  '_cke_expando' attribute.
		 */
		/*test_getAttribute_ignoreExpandoAttributes: function()
		{
			var element = newElement( document.getElementById( 'testExpandoAttributes' ) );

			assert.areEqual( 1, bender.tools.getAttribute( element, 'tabindex' ), 'tabindex is wrong' );
			element.removeAttribute( 'tabindex' );

			assert.areEqual( 'hasExpando', bender.tools.getAttribute( element, 'class' ), 'class is wrong' );
			element.removeAttribute( 'class' );

			assert.areEqual( 'float: right;', bender.tools.getAttribute( element, 'style' ) );

			element.removeAttribute( 'style' );
			element.removeAttribute( 'id' );
			assert.isFalse( element.hasAttributes(), 'hasAttributes should be false' );
		},*/

		test_getTabIndex1: function() {
			var element = newElement( document.getElementById( 'tabIndex10' ) );
			assert.areSame( 10, element.getTabIndex() );
		},

		test_getTabIndex2: function() {
			var element = newElement( document.getElementById( 'tabIndexDef' ) );
			assert.areSame( -1, element.getTabIndex() );
		},

		test_getTabIndex3: function() {
			var element = newElement( document.getElementById( 'tabIndexInputDef' ) );
			assert.areSame( 0, element.getTabIndex() );
		},

		test_getTabIndex4: function() {
			var element = newElement( document.getElementById( 'tabIndexInput20' ) );
			assert.areSame( 20, element.getTabIndex() );
		},

		test_getTabIndex5: function() {
			var element = newElement( document.getElementById( 'tabIndexScriptDef' ) );
			assert.areSame( -1, element.getTabIndex() );
		},

		test_getText1: function() {
			var element = newElement( document.getElementById( 'getText' ) );

			// IE gives us a different result, which is ok for us (see code comments).
			if ( CKEDITOR.env.ie && document.documentMode <= 8 )
				assert.areSame( 'Some \nsample text for testing', element.getText().replace( /\r\n|\r/g, '\n' ) );
			else
				assert.areSame( 'Some  sample text    for    testing', element.getText() );
		},

		test_getText2: function() {
			var element = newElement( document.getElementById( 'getText2' ).getElementsByTagName( 'b' )[ 0 ] );
			assert.areSame( ' ', element.getText() );
		},

		test_getText3: function() {
			var element = newElement( document.getElementById( 'getText3' ) );

			// IE gives us a different result, which is ok for us (see code comments).
			if ( CKEDITOR.env.ie && document.documentMode <= 8 )
				assert.areSame( 'A B', element.getText() );
			else
				assert.areSame( 'A\nB', element.getText().replace( /\r\n|\r/g, '\n' ) );
		},

		test_hasAttributes1: function() {
			var element = newElement( document.getElementsByTagName( 'big' )[ 0 ] );
			assert.isFalse( element.hasAttributes() );
		},

		test_hasAttributes2: function() {
			var element = newElement( document.getElementsByTagName( 'small' )[ 0 ] );
			assert.isTrue( element.hasAttributes() );
		},

		test_hasAttribute: function() {
			var td = newElement( document.getElementById( 'td1' ) );

			assert.isTrue( td.hasAttribute( 'id' ), 'id' );
			assert.isTrue( td.hasAttribute( 'class' ), 'class' );
			assert.isFalse( td.hasAttribute( 'style' ), 'style' );

			// On IE td element contains colspan and rowspan attributes even
			// if they are not defined by user. For this attributes 'specified' is false.
			assert.isFalse( td.hasAttribute( 'colspan' ), 'colspan' );
			assert.isFalse( td.hasAttribute( 'rowspan' ), 'rowspan' );
		},

		// Test for 2 IE bugs:
		// - value attribute is never specified even if it exists.
		// - input attributes needs to be checked different way than other attributes.
		test_hasAttribute_input: function() {
			var inputWithAttrs = newElement( document.getElementById( 'inputWithAttrs' ) ),
				inputWithoutAttrs = newElement( document.getElementById( 'inputWithoutAttrs' ) ),
				checkboxWithAttrs = newElement( document.getElementById( 'checkboxWithAttrs' ) ),
				checkboxWithoutAttrs = newElement( document.getElementById( 'checkboxWithoutAttrs' ) );

			assert.isTrue( inputWithAttrs.hasAttribute( 'value' ), 'inputWithValue value' );
			assert.isTrue( inputWithAttrs.hasAttribute( 'class' ), 'inputWithValue class' );

			assert.isFalse( inputWithoutAttrs.hasAttribute( 'value' ), 'inputWithNoValue value' );
			assert.isFalse( inputWithoutAttrs.hasAttribute( 'class' ), 'inputWithNoValue class' );

			assert.isTrue( checkboxWithAttrs.hasAttribute( 'value' ), 'checkboxWithAttrs value' );
			assert.isTrue( checkboxWithAttrs.hasAttribute( 'class' ), 'checkboxWithAttrs class' );
			assert.isTrue( checkboxWithAttrs.hasAttribute( 'checked' ), 'checkboxWithAttrs checked' );

			assert.isFalse( checkboxWithoutAttrs.hasAttribute( 'value' ), 'checkboxWithoutAttrs value' );
			assert.isFalse( checkboxWithoutAttrs.hasAttribute( 'class' ), 'checkboxWithoutAttrs class' );
			assert.isFalse( checkboxWithoutAttrs.hasAttribute( 'checked' ), 'checkboxWithoutAttrs checked' );
		},


		test_getDocumentPosition: function() {
			// Assign the page location of the element.
			YUI().use( 'dom-screen', 'node', function( Y ) {
				resume( function() {
					Y.one( '#DocPositionTarget' ).setXY( [ 350, 450 ] );
					var pos = CKEDITOR.document.getById( 'DocPositionTarget' ).getDocumentPosition(),
						x = Math.round( pos.x ),
						y = Math.round( pos.y ),
						accOffset = 1;

					assert.isNumberInRange( x, 350 - accOffset, 350 + accOffset, 'Position coordinates:x(350) relative to document doesn\'t match ' + x + ' with offset ' + accOffset + '.' );
					assert.isNumberInRange( y, 450 - accOffset, 450 + accOffset, 'Position coordinates:y(450) relative to document doesn\'t match ' + y + 'with offset ' + accOffset + '.' );
				} );
			} );

			wait();
		},

		'test getDocumentPosition with document scrolled': function() {
			var scrolledElement = CKEDITOR.document.findOne( '#scrolled' );

			// Scroll the window.
			scrolledElement.focus();

			var scrolledElementPosition = scrolledElement.getDocumentPosition();

			assert.isNumberInRange(
				scrolledElementPosition.x, 3498, 3502,
				'Horizontal position read correctly.'
			);
			assert.isNumberInRange(
				scrolledElementPosition.y, 2998, 3002,
				'Vertical position read correctly.'
			);
		},

		// Test get last non-spaces child node.
		test_getLast: function() {
			var element = newElement( document.getElementById( 'append' ) );
			var span1 = newElement( 'span' );
			element.append( span1 );
			element.append( new CKEDITOR.dom.text( ' ' ) );
			element.append( new CKEDITOR.dom.text( ' ' ) );
			var last = element.getLast( CKEDITOR.dom.walker.whitespaces( true ) );
			assert.areSame( span1.$, last.$ );
		},

		// Test 'display:none' and 'visibity:hidden' elements.
		test_invisible: function() {
			assert.isFalse( doc.getById( 'invisible1' ).isVisible() );
			assert.isFalse( doc.getById( 'invisible2' ).isVisible() );
		},

		// #7070
		test_getBogus: function() {
			// Test padding block bogus BR for non-IEs.
			if ( CKEDITOR.env.ie )
				assert.ignore();

			assert.isFalse( !!doc.getById( 'bogus_tc0' ).getBogus() );
			assert.isTrue( !!doc.getById( 'bogus_tc1' ).getBogus() );
			assert.isTrue( !!doc.getById( 'bogus_tc2' ).getBogus() );
			assert.isTrue( !!doc.getById( 'bogus_tc3' ).getBogus() );
			assert.isFalse( !!doc.getById( 'bogus_tc4' ).getBogus() );
			assert.isTrue( !!doc.getById( 'bogus_tc5' ).getBogus() );
		},

		test_appendHtml: function() {
			var element = doc.getById( 'appendHtml' );

			element.appendHtml( '<i>text</i>test' );

			assert.areEqual( '<div id="appendhtml"><i>text</i>test</div>', getOuterHtml( element ) );
		},

		test_breakParent: function() {
			var parent = doc.getById( 'breakParent' ).getFirst(),
				element = parent.getFirst().getNext();

			element.breakParent( parent );

			assert.areEqual( '<i>text1</i><b>text2</b><i>text3</i>', getInnerHtml( 'breakParent' ) );
		},

		test_contains: function() {
			var body = CKEDITOR.document.getBody(),
				parent = doc.getById( 'contains' ),
				el = doc.getById( 'contains1' ),
				text = el.getFirst();

			assert.isTrue( body.contains( parent ) );
			assert.isTrue( body.contains( el ) );
			assert.isTrue( parent.contains( el ) );
			assert.isTrue( el.contains( text ) );

			assert.isFalse( parent.contains( body ) );
			assert.isFalse( el.contains( parent ) );

			var el2 = CKEDITOR.dom.element.createFromHtml( '<span>foo</span>' );
			parent.append( el2 );
			assert.isTrue( body.contains( el2.getFirst() ) );
		},

		test_getChildren: function() {
			var element = doc.getById( 'getChildren' );
			assert.areEqual( 3, element.getChildren().count() );
		},

		test_getComputedStyle: function() {
			var element = doc.getById( 'getChildren' );
			assert.areEqual( 'block', element.getComputedStyle( 'display' ) );
			assert.areEqual( 'inline', element.getFirst().getComputedStyle( 'display' ) );
		},

		test_getElementsByTag: function() {
			var element = doc.getById( 'getChildren' ),
				elements = element.getElementsByTag( 'b' );

			assert.areEqual( 1, elements.count() );
			assert.areEqual( 'b', elements.getItem( 0 ).getName() );
		},

		test_isIdentical: function() {
				// <b name="a" class="test">tessst</b>
			var element1 = doc.getById( 'isIdentical' ).getFirst(),
				// <b class="test" name="a"></b>
				element2 = element1.getNext(),
				// <b class="test"></b>
				element3 = element2.getNext(),
				// <b>tessst</b>
				element4 = element3.getNext(),
				// <b _moz_dirty="" class="test"></b>
				element5 = element4.getNext(),
				// <b class="test" data-cke-expando=53></b>
				element6 = element5.getNext();

			assert.isTrue( element1.isIdentical( element2 ), 'different attrs order' );
			assert.isTrue( element2.isIdentical( element1 ), 'different attrs order 2' );
			assert.isFalse( element1.isIdentical( element3 ), 'more attrs in "this"' );
			assert.isFalse( element3.isIdentical( element1 ), 'more attrs in passed element' );
			assert.isFalse( element4.isIdentical( element1 ), 'no attrs in "this"' );
			assert.isFalse( element1.isIdentical( element4 ), 'no attrs in passed element' );

			if ( CKEDITOR.env.gecko ) {
				assert.isTrue( element5.isIdentical( element3 ), 'ignore _moz_dirty' );
				assert.isTrue( element3.isIdentical( element5 ), 'ignore _moz_dirty 2' );
				assert.isFalse( element4.isIdentical( element5 ), 'ignore _moz_dirty 3' );
				assert.isFalse( element2.isIdentical( element5 ), 'ignore _moz_dirty 4' );
				assert.isFalse( element5.isIdentical( element2 ), 'ignore _moz_dirty 5' );
			}

			if ( CKEDITOR.env.ie ) {
				assert.isTrue( element6.isIdentical( element3 ), 'ignore expando' );
				assert.isTrue( element3.isIdentical( element6 ), 'ignore expando' );
			}
		},

		test_isIdentical2: function() {
				// <b style="color: red; width: 10px">a</b>
			var element1 = doc.getById( 'isIdentical2' ).getFirst(),
				// <b style="width:10px;color:red;">a</b>
				element2 = element1.getNext(),
				element3 = new CKEDITOR.dom.element( 'b' ),
				element4 = new CKEDITOR.dom.element( 'b' );

			element3.setStyle( 'color', 'red' );
			element3.setStyle( 'width', '10px' );
			element4.setStyle( 'width', '10px' );
			element4.setStyle( 'color', 'red' );

			assert.isTrue( element1.isIdentical( element2 ), 'different styles formatting' );
			assert.isTrue( element3.isIdentical( element4 ), 'different styles order' );
			assert.isTrue( element1.isIdentical( element4 ), 'different styles order & formatting' );

			element4.setStyle( 'width', '10em' );
			assert.isFalse( element3.isIdentical( element4 ), 'different styles' );
		},

		'test isIdentical ignore child nodes': function() {
			var el1 = CKEDITOR.dom.element.createFromHtml( '<b class="foo" style="color: red; width: 10px">foo</b>' ),
				el2 = el1.clone();

			el1.append( CKEDITOR.dom.element.createFromHtml( '<span>foo</span>' ) );
			el2.append( CKEDITOR.dom.element.createFromHtml( '<i>bar</i>' ) );
			assert.isTrue( el1.isIdentical( el2 ) );
		},

		test_isEmptyInlineRemoveable: function() {
			var element1 = doc.getById( 'isEmptyInlineRemoveable' ).getFirst(),
				element2 = element1.getNext(),
				element3 = element2.getNext();

			assert.isTrue( element1.isEmptyInlineRemoveable() );
			assert.isFalse( element2.isEmptyInlineRemoveable() );
			assert.isFalse( element3.isEmptyInlineRemoveable() );
		},

		test_moveChildren: function() {
			var element1 = doc.getById( 'moveChildren1' ),
				element2 = doc.getById( 'moveChildren2' );

			element1.moveChildren( element2 );

			assert.areEqual( 2, element2.getChildren().count() );
		},

		test_mergeSiblings: function() {
			var element = doc.getById( 'mergeSiblings' ).getFirst();

			element.mergeSiblings( false );
			assert.areEqual( '<b>text1text2</b>', bender.tools.fixHtml( doc.getById( 'mergeSiblings' ).getHtml() ) );
		},

		test_removeAttributes: function() {
			var element = doc.getById( 'removeAttributes' );

			element.removeAttributes( [ 'id', 'class' ] );

			assert.isFalse( element.hasAttribute( 'id' ) );
			assert.isFalse( element.hasAttribute( 'class' ) );
			assert.areEqual( 'test2', element.getAttribute( 'title' ) );
		},

		test_removeStyle: function() {
			var element = doc.getById( 'removeStyle' );

			element.removeStyle( 'display' );

			assert.isTrue( element.hasAttribute( 'style' ) );
			assert.areEqual( 'red', element.getStyle( 'color' ) );

			element.removeStyle( 'color' );

			assert.isFalse( element.hasAttribute( 'style' ) );
			assert.areEqual( '', element.getStyle( 'color' ) );
		},

		test_getPositionedAncestor: function() {
			var element = doc.getById( 'getPositionedAncestor' );

			assert.areEqual( element.getParent().getParent(), element.getPositionedAncestor() );
		},

		test_getFrameDocument: function() {
			var frame = doc.getById( 'getFrameDocument' );

			assert.isTrue( frame.getFrameDocument() instanceof CKEDITOR.dom.document );
		},

		test_copyAttributes: function() {
			var element1 = doc.getById( 'copyAttributes1' ),
				element2 = doc.getById( 'copyAttributes2' );

			element1.copyAttributes( element2, { id: 1 } );

			assert.areEqual( 'copyAttributes2', element2.getId() );
			assert.areEqual( 'a', element2.getAttribute( 'title' ) );
		},

		// Because on IE td element contains colspan and rowspan attributes
		// even if they are not defined explicit we need to test if copyAttributes
		// check if attribute is specified properly.
		test_copyAttributes_td: function() {
			var td1 = doc.getById( 'td1' ),
				td2 = doc.getById( 'td2' );

			td1.copyAttributes( td2, { id: 1 } );

			assert.areSame( '<td class="test" id="td2">b</td>', getOuterHtml( td2 ) );

		},

		/**
		 * Test copy the 'checked' attribute. (#4527)
		 */
		test_copyAttributes_checked: function() {
			var original1 = new CKEDITOR.dom.element.createFromHtml( '<input type="checkbox" checked="checked" />' ),
				original2 = new CKEDITOR.dom.element( 'input' ),
				clone1 = new CKEDITOR.dom.element( 'input' ),
				clone2 = new CKEDITOR.dom.element( 'input' );

			original2.setAttribute( 'type', 'checkbox' );
			original2.setAttribute( 'checked', 'checked' );
			original1.copyAttributes( clone1 );
			original2.copyAttributes( clone2 );
			assert.areSame( 'checked', clone1.getAttribute( 'checked' ) );
			assert.areSame( 'checked', clone2.getAttribute( 'checked' ) );
		},

		test_renameNode: function() {
			var element = doc.getById( 'renameNode' );

			element.renameNode( 'p' );

			// Check precisely (#8663).
			assert.areEqual( 'p', element.getName(), 'getName()' );
			assert.areSame( 'p', element.$.tagName.toLowerCase(), '$.tagName' );

			assert.areEqual( 2, element.getChildCount() );
		},

		test_renameNode_8663: function() {
			var element = doc.getById( 'renameNode2' );

			assert.areEqual( 'div', element.getName(), 'Before rename' );
			element.renameNode( 'p' );
			assert.areEqual( 'p', element.getName(), 'After rename' );
		},

		test_getDirection: function() {
			assert.areEqual( 'rtl', doc.getById( 'getDirection' ).getDirection() );
		},

		test_data: function() {
			var element = doc.getById( 'data' );
			assert.areEqual( 'testing', element.data( 'test' ) );
			element.data( 'test', false );
			assert.isNull( element.data( 'test' ) );
		},

		// Test when element to compare has more attributes .
		test_element_identical: function() {
			var element1 = CKEDITOR.dom.element.createFromHtml( '<span class="foo"></span>' ),
				element2 = CKEDITOR.dom.element.createFromHtml( '<span class="foo"></span>' );

			assert.isTrue( element1.isIdentical( element2 ) );
		},

		// #8527
		'test empty anchor editable': function() {
			assert.isFalse( doc.getById( 'empty_anchor_1' ).isEditable() );
			assert.isFalse( doc.getById( 'empty_anchor_2' ).isEditable() );
			assert.isTrue( doc.getById( 'text_anchor_1' ).isEditable() );
			assert.isTrue( doc.getById( 'text_anchor_2' ).isEditable() );
		},

		test_is: function() {
			var element = newElement( 'p' );

			assert.isTrue( element.is( 'p' ) );
			assert.isTrue( element.is( { p: 1 } ) );
			assert.isTrue( element.is( { a: 1, p: 1 } ) );
			assert.isTrue( element.is( 'a', 'b', 'p' ) );

			assert.isFalse( element.is( 'a' ) );
			assert.isFalse( element.is( { p: 0 } ) );
		},

		'test find': function() {
			var el = doc.getById( 'find1' );

			var els = el.find( '.findRoot i, .findRoot .find1' );

			assert.areSame( 3, els.count(), 'Element <i>Y</i> should not be returned' );
			for ( var i = 0; i < els.count(); ++i )
				assert.areSame( 'X', els.getItem( i ).getHtml(), 'Element <i>Y</i> should not be returned' );

			assert.areSame( 'find1', el.$.id, 'Root\'s id has not been changed' );

			el.removeAttribute( 'id' );

			els = el.find( '.findRoot i' );
			assert.areSame( 2, els.count(), 'Element <i>Y</i> should not be returned' );

			assert.isFalse( el.hasAttribute( 'id' ), 'Element#find cleans after itself' );

			assert.areSame( 0, el.find( '#find-foo-foo' ).count(), 'Empty list' );
		},

		'test findOne': function() {
			var el = doc.getById( 'find2' );

			var found = el.findOne( 'i' );

			assert.isInstanceOf( CKEDITOR.dom.element, found );
			assert.areSame( 'X', found.getHtml() );

			found = el.findOne( '.findRoot .findRoot' );

			assert.isNull( found, 'Selector is contextualized' );
		},

		recordNodes: function( callback ) {
			var tokens = [],
				text;

			return {
				tokens: tokens,
				fn: function( node ) {
					if ( node.type == CKEDITOR.NODE_ELEMENT )
						tokens.push( node.getName() );
					else if ( node.type == CKEDITOR.NODE_TEXT ) {
						// Remove the tabs and new lines.
						text = CKEDITOR.tools.trim( node.getText() );
						if ( text )
							tokens.push( '#' + text );
					} else {
						tokens.push( 'not implemented type' );
					}

					if ( callback )
						return callback( node );
				}
			};
		},

		'test forEach': function() {
			var el = doc.getById( 'forEach_1' ),
				recorder = this.recordNodes();

			el.forEach( recorder.fn );
			assert.areSame( 'div,p,#a,i,#b,#c,div,h1,#d,h2,#e,b,#f', recorder.tokens.join( ',' ) );
		},

		'test forEach - only elements': function() {
			var el = doc.getById( 'forEach_1' ),
				recorder = this.recordNodes();

			el.forEach( recorder.fn, CKEDITOR.NODE_ELEMENT );
			assert.areSame( 'div,p,i,div,h1,h2,b', recorder.tokens.join( ',' ) );
		},

		'test forEach - only text': function() {
			var el = doc.getById( 'forEach_1' ),
				recorder = this.recordNodes();

			el.forEach( recorder.fn, CKEDITOR.NODE_TEXT );
			assert.areSame( '#a,#b,#c,#d,#e,#f', recorder.tokens.join( ',' ) );
		},

		'test forEach - stop condition': function() {
			var el = doc.getById( 'forEach_1' ),
				recorder = this.recordNodes( function( node ) {
					// Return false for <i> and <h2>.
					return !( node.type == CKEDITOR.NODE_ELEMENT && node.is( { i: 1, h2: 1 } ) );
				} );

			el.forEach( recorder.fn );
			assert.areSame( 'div,p,#a,i,#c,div,h1,#d,h2', recorder.tokens.join( ',' ) );
		},

		'test forEach - only elements & skip root': function() {
			var el = doc.getById( 'forEach_1' ),
				recorder = this.recordNodes();

			el.forEach( recorder.fn, CKEDITOR.NODE_ELEMENT, true );
			assert.areSame( 'p,i,div,h1,h2,b', recorder.tokens.join( ',' ) );
		}
	}
) );
/* bender-tags: editor,unit,dom */

bender.test( appendDomObjectTests(
	function( id ) {
		if ( id === 'domObjectTest1' )
			return new CKEDITOR.dom.document( document );

		// return different (fake) document for other ids
		return new CKEDITOR.dom.document( {} );
	},
	{
		test_$ : function() {
			var doc = new CKEDITOR.dom.document( document );
			assert.areSame( document, doc.$ );
		},

		test_appendStyleSheet : function() {
			var cssUrl = CKEDITOR.basePath + 'tests/_assets/sample.css';

			var doc = new CKEDITOR.dom.document( document );
			doc.appendStyleSheet( cssUrl );

			var links = document.getElementsByTagName( 'link' );
			var succeed = false;
			for ( var i = 0 ; i < links.length ; i++ ) {
				if ( links[ i ].href == cssUrl ) {
					succeed = true;
					break;
				}
			}

			assert.isTrue( succeed, 'The link element was not found' );
		},

		test_equals1 : function() {
			// Actually checks the real need for equals().
			var doc1 = new CKEDITOR.dom.document( document );
			assert.isFalse( doc1 == document );
		},

		test_equals2 : function() {
			// Actually checks the real need for equals().
			var doc1 = new CKEDITOR.dom.document( document );
			var doc2 = new CKEDITOR.dom.document( document );
			assert.isFalse( doc1 == doc2, 'doc1 == doc2' );
		},

		test_equals3 : function() {
			var doc1 = new CKEDITOR.dom.document( document );
			var doc2 = new CKEDITOR.dom.document( document );
			assert.isTrue( doc1.equals( doc2 ), 'doc1.equals( doc2 )' );
			assert.isTrue( doc2.equals( doc1 ), 'doc2.equals( doc1 )' );
		},

		test_getById1 : function() {
			var doc = new CKEDITOR.dom.document( document );
			var element = doc.getById( 'test1' );
			assert.areSame( document.getElementById( 'test1' ), element.$ );
		},

		test_getById2 : function() {
			var doc = new CKEDITOR.dom.document( document );
			var element = doc.getById( 'test_invalid' );
			assert.isNull( element );
		},

		test_getHead : function() {
			var doc = new CKEDITOR.dom.document( document );
			assert.areSame( document.getElementsByTagName( 'head' )[ 0 ], doc.getHead().$ );
		},

		test_getBody : function() {
			var doc = new CKEDITOR.dom.document( document );
			assert.areSame( document.body, doc.getBody().$, '1st call failed' );
			assert.areSame( document.body, doc.getBody().$, '2nd call failed' );
		},
		test_createText : function() {
			var doc = new CKEDITOR.dom.document( document ), contentText = 'text content';
			var textNode = doc.createText( contentText );
			assert.areSame( contentText, textNode.getText(),
				'Create text node content doesn\'t match.' );
		},

// 		test_getByAddress1 : function()
// 		{
// 			var doc = new CKEDITOR.dom.document( document );
// 			var node = doc.getByAddress( [ 1, 1, 0, 1, 0, 0 ] );
// 			assert.areSame( 'target', node.getText(),
// 				'Addressing target doesn\'t match.' );
// 		},

		test_getElementsByTag : function() {
			var nodeList = new CKEDITOR.dom.document( document ).getElementsByTag( 'span' ),
				results = [];
			for ( var i = 0; i < nodeList.count(); i++ ) {
				results.push( nodeList.getItem( i ).$ );
			}
			arrayAssert.itemsAreEqual( results, document.getElementsByTagName( 'span' ) );
		},

		'test find': function() {
			var doc = CKEDITOR.document,
				els = doc.find( '#find b>i' );

			assert.areSame( 2, els.count() );
			assert.areSame( 'x', els.getItem( 0 ).getHtml() );
			assert.areSame( 'x', els.getItem( 1 ).getHtml() );

			els = doc.find( '#find b.find1' );

			assert.areSame( 1, els.count() );

			els = doc.find( 'xyz' );

			assert.areSame( 0, els.count() );
		},

		'test findOne': function() {
			var doc = CKEDITOR.document,
				found = doc.findOne( '#find .find1' );

			assert.isInstanceOf( CKEDITOR.dom.element, found );
			assert.areSame( 'i', found.getName() );

			var found = doc.findOne( 'xyz' );

			assert.isNull( found );
		},

		'test _getHtml5ShivFrag': function() {
			// IE8 only.
			if ( !CKEDITOR.env.ie || CKEDITOR.env.version > 8 )
				assert.ignore();

			var $frag = CKEDITOR.document._getHtml5ShivFrag();

			var div = new CKEDITOR.dom.element( 'div' );
			div.$.appendChild( $frag );

			assert.areSame( 1, div.find( 'abbr' ).count(), 'First edge element' );
			assert.areSame( 1, div.find( 'video' ).count(), 'Second edge element' );

			assert.areSame( $frag, CKEDITOR.document._getHtml5ShivFrag(), 'Document fragment is cached' );
		}
	}
) );
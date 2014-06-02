/* bender-tags: editor,unit */

'use strict';

function writeHtml( fragment ) {
	var writer = new CKEDITOR.htmlParser.basicWriter();

	fragment.writeChildrenHtml( writer );
	return writer.getHtml( true );
}

function fromHtml( html, ctx ) {
	return CKEDITOR.htmlParser.fragment.fromHtml( html, ctx );
}

function record( callback ) {
	var tokens = [];
	return {
		tokens: tokens,
		fn: function( node ) {
			if ( node.type == CKEDITOR.NODE_ELEMENT )
				tokens.push( node.name );
			else if ( node.type == CKEDITOR.NODE_TEXT )
				tokens.push( '#' + node.value );
			else if ( node.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT )
				tokens.push( 'docfrag' );
			else
				tokens.push( 'not implemented type' );

			if ( callback )
				return callback( node );
		}
	}
}

var assertItems = arrayAssert.itemsAreEqual;

bender.test( {
	'test forEach': function() {
		var fragment = fromHtml( '<p>text1<b>text2<br>text3</b>text4<hr>text5</p>' ),
			rec = record();

		fragment.forEach( rec.fn );
		assertItems( [ 'docfrag', 'p', '#text1', 'b', '#text2', 'br', '#text3', '#text4', 'hr', '#text5' ],
			rec.tokens, 'First forEach().' );

		rec = record();

		fragment.forEach( rec.fn );
		assertItems( [ 'docfrag', 'p', '#text1', 'b', '#text2', 'br', '#text3', '#text4', 'hr', '#text5' ],
			rec.tokens, 'Second forEach() gives the same result.' );
	},

	'test forEach on text nodes': function() {
		var fragment = fromHtml( '<p>text1<b>text2</b>text3</p>' ),
			rec = record();

		fragment.forEach( rec.fn, CKEDITOR.NODE_TEXT );
		assertItems( [ '#text1', '#text2', '#text3' ], rec.tokens, 'Only text nodes.' );
	},

	'test forEach on elements': function() {
		var fragment = fromHtml( '<p>text1<b>te<i>x</i>t2</b>text3</p>' ),
			rec = record();

		fragment.forEach( rec.fn, CKEDITOR.NODE_ELEMENT );
		assertItems( [ 'p', 'b', 'i' ], rec.tokens, 'Only elements.' );
	},

	'test forEach with elements\'s name modifier': function() {
		var fragment = fromHtml( '<p>text1<b>text2</b>text3</p>' ),
			rec = record( function( element ) {
				element.name = 'x';
			} );

		fragment.forEach( rec.fn, CKEDITOR.NODE_ELEMENT );
		assertItems( [ 'p', 'b' ], rec.tokens );
		assert.areEqual( '<x>text1<x>text2</x>text3</x>', writeHtml( fragment ) );
	},

	'test forEach on elements - skip root': function() {
		var fragment = fromHtml( 'text1<b>te<i>x</i>t2</b>text3', 'p' ), // -> <p>text1...text3</p>
			rec = record();

		fragment.forEach( rec.fn, CKEDITOR.NODE_ELEMENT, true );
		assertItems( [ 'b', 'i' ], rec.tokens, 'Only elements, no root.' );
	},

	'test forEach - skip root': function() {
		var fragment = fromHtml( 'text1<b>text2</b>text3', 'p' ), // -> <p>text1...text3</p>
			rec = record();

		fragment.forEach( rec.fn, false, true );
		assertItems( [ '#text1', 'b', '#text2', '#text3' ], rec.tokens );
	},

	'test forEach - stop on false': function() {
		var fragment = fromHtml( '<p>text0<b>text1</b><i><b>text2<u>text3</u></b>text4</i></p>' ),
			rec = record( function( node ) {
				if ( node.type == CKEDITOR.NODE_ELEMENT && node.name == 'b' )
					return false;
			} );

		fragment.forEach( rec.fn );

		assertItems( [ 'docfrag', 'p', '#text0', 'b', 'i', 'b', '#text4' ], rec.tokens );
	}
} );
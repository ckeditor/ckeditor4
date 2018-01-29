/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var tests = {
		'test paragraphs': function() {
			var body = CKEDITOR.document.getBody(),
				p,
				range,
				rectList;

			function getListToCompare( range ) {
				var nativeRange = new Range();
				nativeRange.setStart( range.startContainer.$, range.startOffset );
				nativeRange.setEnd( range.endContainer.$, range.endOffset );
				return nativeRange.getClientRects();
			}

			body.appendHtml( '<div id="test"><p>TEXT</p></div>' );
			p = body.findOne( '#test' ).findOne( 'p' );

			range = new CKEDITOR.dom.range( CKEDITOR.document );
			range.setStart( p , 0 );
			range.setEnd( p , 1 );

			rectList = range.getClientRects();

			// This assert is for IE8, but it should pass on newer browsers.
			var keys = [ 'width', 'height', 'top', 'bottom', 'left', 'right' ];
			CKEDITOR.tools.array.forEach( keys, function( key ) {
				assert.isTrue( rectList[ 0 ][ key ] >= 0 );
			} );

			// All other browsers.
			if ( CKEDITOR.document.$.getSelection !== undefined ) {
				var listToCompare = getListToCompare( range );
				rectList.forEach( function( item, index ) {
					for ( var key in item ) {
						if ( typeof item[ key ] === 'number' ) {
							assert.isTrue( item[ key ] === listToCompare[ index ][ key ] );
						}
					}
				} );
			}
		}
	};

	bender.test( tests );
} )();

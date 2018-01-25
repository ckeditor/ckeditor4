/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	bender.editor = {};

	var tests = {
		'test paragraphs': function() {
			var bot = this.editorBot,
			editor = this.editor;

			bot.setHtmlWithSelection( '<div><p>[TEXT]</p></div>' );

			function getRectList( context ) {
				var selection = context.editor.getSelection(),
					ranges = selection.getRanges();
				return ranges[0].getClientRects();
			}

			function getListToCompare( context ) {
				var sel = context.editor.document.$.getSelection(),
					range = sel.getRangeAt( 0 );
				return range.getClientRects();
			}
			var rectList = getRectList( this );

			// This assert is for IE8, but it should pass on newer browsers.
			var keys = [ 'width', 'height', 'top', 'bottom', 'left', 'right' ];
			CKEDITOR.tools.array.forEach( keys, function( key ) {
				assert.isTrue( rectList[ 0 ][ key ] > 0 );
			} );

			// All other browsers.
			if ( editor.document.$.getSelection !== undefined ) {
				var listToCompare = getListToCompare( this );

				rectList.forEach( function( item, index ) {
					for ( var key in item ) {
						assert.isTrue( item[ key ] === listToCompare[ index ][ key ] );
					}
				} );
			}
		}

	};

	bender.test( tests );
} )();

/* bender-tags: editor,dom,range, 1925, 1930 */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'classic'
		}
	};

	var tests = {
		// Testing for #1930.
		'test collapsed selection on element': function( editor, bot ) {
			bot.setHtmlWithSelection(
				'<p>This is paragraph for testing purposes.</p>'
			);
			var range = editor.createRange(),
				element = editor.editable().getFirst(),
				listOfKeys = [ 'bottom', 'height', 'left', 'right', 'top', 'width' ],
				rects;

			element.setStyles( {
				'font-family': 'sans-serif',
				'font-size': '13px',
				'margin': 0
			} );

			bot.editor.editable().setStyle( 'line-height', 1.6 );
			range.setStart( element, CKEDITOR.POSITION_AFTER_START );
			rects = range.getClientRects( true );

			// The correctness of returned rects are tested within the other test cases, and rects from a text element will be different for each browsers,
			// so assert only if returned rect have positive values except for width.
			assert.isTrue( !!rects && !!rects[ 0 ] );
			CKEDITOR.tools.array.forEach( listOfKeys, function( key ) {
				if ( key === 'width' ) {
					assert.isTrue( rects[ 0 ][ key ] === 0, 'Rect[ ' + key + ' ]' );
				} else {
					assert.isTrue( rects[ 0 ][ key ] > 0, 'Rect[ ' + key + ' ]'  );
				}
			} );
		},

		// Testing for #1925.
		'test collapsed selection on end of line': function( editor, bot ) {
			if ( !( CKEDITOR.env.ie && ( CKEDITOR.env.version in { 9: '', 10: '' } ) ) ) {
				assert.ignore();
			}

			bot.setHtmlWithSelection(
				'<p style="font-family:Sans-Serif;font-size:13px;line-height:1.6;margin:0">This is paragraph for testing purposes.^</p>'
			);

			var expectedRect = {
					bottom: 41,
					height: 21,
					left: 242,
					right: 242,
					top: 20,
					width: 0
				},
				rects = editor.getSelection().getRanges()[ 0 ].getClientRects(),
				key;
			for ( key in expectedRect ) {
				assert.isNumberInRange( expectedRect[ key ], rects[ 0 ][ key ], rects[ 0 ][ key ] + 0.25, 'Rects[ 0 ].' + key );
			}
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();

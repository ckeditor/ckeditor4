/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'classic'
		},
		inline: {
			creator: 'inline',
			name: 'inline'
		}
	};

	var tests = {
		'test absolute rect': function( editor, bot ) {
			var offset = {
				// Editor has different position when test is run alone and when it's run with other tests. Need to include differences.
					x: editor.container.getClientRect().left - ( editor.name === 'inline' ? 40 : 19 ),
					y: editor.container.getClientRect().top - ( editor.name === 'inline' ? 56 : 19 )
				},
				expected = {
					0: {
						x: 40 + offset.x,
						y: 40 + offset.y,
						width: 163,
						height: 61,
						top: 40 + offset.y,
						right: 203 + offset.x,
						bottom: 101 + offset.y,
						left: 40 + offset.x
					}
				},
				rects,
				range,
				img,
				actual;

			if ( CKEDITOR.env.ie ) {
				delete expected[ 0 ].x;
				delete expected[ 0 ].y;
			}
			bot.setHtmlWithSelection( CKEDITOR.document.findOne( '#image' ).$.outerHTML );

			// Edge returns different rect.height without changing line-height.
			bot.editor.editable().setStyle( 'line-height', '0' );

			range = new CKEDITOR.dom.range( bot.editor.document );
			img = bot.editor.editable().findOne( 'img' );

			range.setStart( img.getParent(), 0 );
			range.setEnd( img.getParent(), 1 );

			rects = range.getClientRects( true );

			for ( var index in expected ) {

				for ( var rectKey in expected[ index ] ) {
					actual = rects[ index ][ rectKey ];

					if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {

						if ( rectKey === 'width' || rectKey === 'right' ) {
							actual = Math.floor( actual * 10 ) / 10;

						} else if ( rectKey === 'height' || rectKey === 'top' ) {
							continue;
						}
					}
					assert.areEqual( expected[ index ][ rectKey ], actual, 'rect[' + index + '].' + rectKey );
				}
			}
		},

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
					assert.isTrue( rects[ 0 ][ key ] === 0 );
				} else {
					assert.isTrue( rects[ 0 ][ key ] > 0 );
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
					bottom: 61,
					height: 21,
					left: 262,
					right: 262,
					top: 40,
					width: 0
				},
				rects = editor.getSelection().getRanges()[ 0 ].getClientRects( true ),
				key;

			for ( key in expectedRect ) {
				assert.isNumberInRange( expectedRect[ key ], rects[ 0 ][ key ], rects[ 0 ][ key ] + 0.25, 'Rects[ 0 ].' + key );
			}
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();

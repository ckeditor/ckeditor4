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
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();

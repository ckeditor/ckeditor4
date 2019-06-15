/* bender-tags: editor,dom,range */
/* bender-include: ../../../plugins/uploadfile/_helpers/waitForImage.js */
/* global waitForImage */
/* bender-ckeditor-plugins: toolbar */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'classic',
			// Toolbar height affects absolute rects in built classic editor, this should make it consistent (#2092).
			config: {
				toolbar: [ '' ]
			}
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
					x: editor.container.getClientRect( true ).left - ( editor.name === 'inline' ? 40 : 19 ),
					y: editor.container.getClientRect( true ).top - ( editor.name === 'inline' ? 56 : 19 )
				},
				inline = editor.name === 'inline',
				expected = {
					0: {
						x: 40 + offset.x,
						y: ( inline ? 40 : 49 ) + offset.y,
						width: 163,
						height: 61,
						top: ( inline ? 40 : 49 ) + offset.y,
						right: 203 + offset.x,
						bottom: ( inline ? 101 : 110 ) + offset.y,
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

			waitForImage( img, function() {
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
						} else if ( bender.tools.env.mobile ) {
							actual = Math.round( actual );
						}
						assert.areEqual( expected[ index ][ rectKey ], actual, 'rect[' + index + '].' + rectKey );
					}
				}
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();

/* bender-tags: editor, tools */
/* bender-ckeditor-plugins: toolbar */

( function() {
	'use strict';
	bender.editors = {
		inline: {
			name: 'inline',
			creator: 'inline'
		},
		classic: {
			name: 'classic',
			// Toolbar height affects absolute rects in built classic editor, this should make it consistent (#2092).
			config: {
				toolbar: [ '' ]
			}
		}
	};

	var tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), {
		tearDown: function() {
			window.scrollBy( 0, -window.scrollY );
		},
		'test getting absolute rect': function( editor ) {
			var container = CKEDITOR.document.findOne( '#test_container_' + editor.name ).getClientRect( true ),
				offset = {
					x: container.left - 99,
					y: container.top - 99
				},
				inline = editor.name === 'inline' ? 0 : 9,
				rect = {
					bottom: 10,
					height: 10,
					left: 0,
					right: 10,
					top: 0,
					width: 10,
					x: 0,
					y: 0
				},
				absoluteRect = CKEDITOR.tools.getAbsoluteRectPosition( editor.window, rect ),
				key,
				expected;

			if ( CKEDITOR.env.ie ) {
				delete rect.x;
				delete rect.y;
			}
			assertRect( editor.name === 'classic', 0 );

			window.scrollBy( 0, 100 );

			absoluteRect = CKEDITOR.tools.getAbsoluteRectPosition( editor.window, rect );
			assertRect( editor.name === 'classic', 100 );

			function assertRect( classic, scroll ) {
				// `getAbsoluteRectPosition` on classic editor adds its parent offset position which is also affected by scroll
				// we need to include that in our test so inline and classic have different expected results.
				for ( key in rect ) {
					if ( key in { left: '', right: '', x: '' } ) {
						expected = rect[ key ] + ( classic ? 100 + offset.x : 0 );
					} else if ( key in { top: '', bottom: '', y: '' } ) {
						expected = rect[ key ] + ( classic ? 100 + offset.y : scroll ) + inline;
					} else {
						expected = rect[ key ];
					}
					assert.areEqual( expected, absoluteRect[ key ], 'Rect[ ' + key + ' ]' );
				}
			}
		}
	} );

	bender.test( tests );
} )();

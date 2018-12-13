/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2,toolbar */

( function() {
	'use strict';

	bender.editors = {
		limitedSize: {
			config: {
				image2_maxSize: {
					width: 350,
					height: 350
				}
			}
		},
		naturalSize: {
			config: {
				image2_maxSize: {
					width: 'naturalWidth',
					height: 'naturalHeight'
				}
			}
		}
	};

	var tests = {
		//2672
		'test resize close to minimum size': assertResize( {
			data: {
				screenX: 40,
				screenY: 15
			},
			expected: {
				width: 40,
				height: 15
			}
		} ),

		//2672
		'test resize lower than minimum size': assertResize( {
			data: {
				screenX: 14,
				screenY: 14
			},
			expected: {
				width: null,
				height: null
			}
		} ),

		//2048
		'test resize close to maximum size': assertResize( {
			limitedSize: {
				data: {
					screenX: 350,
					screenY: 131
				},
				expected: {
					width: 350,
					height: 131
				}
			},
			naturalSize: {
				data: {
					screenX: 163,
					screenY: 61
				},
				expected: {
					width: 163,
					height: 61
				}
			}
		} ),

		//2048
		'test resize above maximum size': assertResize( {
			limitedSize: {
				data: {
					screenX: 351,
					screenY: 132
				},
				expected: {
					width: null,
					height: null
				}
			},
			naturalSize: {
				data: {
					screenX: 165,
					screenY: 65
				},
				expected: {
					width: null,
					height: null
				}
			}
		} )
	};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );

	function assertResize( options ) {
		return function( editor, bot ) {
			bot.setData( '<img src="%BASE_PATH%/_assets/logo.png">', function() {
				editor.widgets.instances[ editor.widgets._.nextId - 1 ].resizer.fire( 'mousedown', {
					$: {
						screenX: 163,
						screenY: 61
					}
				} );

				var doc = CKEDITOR.document,
					image = editor.editable().findOne( 'img' ),
					data = options[ editor.name ] ? options[ editor.name ].data : options.data,
					expected = options[ editor.name ] ? options[ editor.name ].expected : options.expected,
					actual;

				doc.fire( 'mousemove', {
					$: data
				} );

				doc.fire( 'mouseup' );

				actual = {
					width: image.getAttribute( 'width' ),
					height: image.getAttribute( 'height' )
				};

				assert.isTrue( CKEDITOR.tools.objectCompare( actual, expected ) );
			} );
		};
	}
} )();

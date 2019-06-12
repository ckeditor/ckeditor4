/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2,toolbar */
/* bender-include: %BASE_PATH%/plugins/uploadfile/_helpers/waitForImage.js */
/* global waitForImage */

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
					width: 'natural',
					height: 'natural'
				}
			}
		}
	};

	var tests = {
		// (#2672)
		'test resize close to minimum size': testResize( {
			data: {
				screenX: 40,
				screenY: 15
			},
			expected: {
				width: 40,
				height: 15
			}
		} ),

		// (#2672)
		'test resize lower than minimum size': testResize( {
			data: {
				screenX: 14,
				screenY: 14
			},
			expected: {
				width: null,
				height: null
			}
		} ),

		// (#2048)
		'test resize close to maximum size': testResize( {
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

		// (#2048)
		'test resize above maximum size': testResize( {
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

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests ) );

	function testResize( options ) {
		return function( editor, bot ) {
			bot.setData( '<img src="%BASE_PATH%/_assets/logo.png">', function() {
				var image = editor.editable().findOne( 'img' );

				waitForImage( image, function() {
					editor.widgets.instances[ editor.widgets._.nextId - 1 ].resizer.fire( 'mousedown', {
						$: {
							screenX: 163,
							screenY: 61
						}
					} );

					var doc = CKEDITOR.document,
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
			} );
		};
	}
} )();

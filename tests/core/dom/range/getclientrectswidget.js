/* bender-tags: editor,dom,range */
/* bender-ckeditor-plugins: image2,toolbar,placeholder */

( function() {
	'use strict';

	if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
		bender.ignore();
	}

	bender.editors = {
		classic: {
			name: 'classic',
			config: {
				allowedContent: true
			}
		},
		inline: {
			name: 'inline',
			creator: 'inline'
		}
	};

	var tests = {
		'test one widget rect': function( editor, bot ) {
			assertWidgetsRects( editor, bot, {
				widgetsCount: 1,
				absolute: false,
				captioned: false,
				inline: false
			} );
		},
		'test two widgets rects': function( editor, bot ) {
			assertWidgetsRects( editor, bot, {
				widgetsCount: 2,
				absolute: false,
				captioned: false,
				inline: false
			} );
		},
		'test three widgets rects': function( editor, bot ) {
			assertWidgetsRects( editor, bot, {
				widgetsCount: 3,
				absolute: false,
				captioned: false,
				inline: false
			} );
		},
		'test one widget absolute rect': function( editor, bot ) {
			assertWidgetsRects( editor, bot, {
				widgetsCount: 1,
				absolute: true,
				captioned: false,
				inline: false
			} );
		},
		'test two widgets absolute rect': function( editor, bot ) {
			assertWidgetsRects( editor, bot, {
				widgetsCount: 2,
				absolute: true,
				captioned: false,
				inline: false
			} );
		},
		'test one inline widget rect': function( editor, bot ) {
			assertWidgetsRects( editor, bot, {
				widgetsCount: 1,
				absolute: false,
				captioned: false,
				inline: true
			} );
		},
		'test two inline widgets rects': function( editor, bot ) {
			assertWidgetsRects( editor, bot, {
				widgetsCount: 2,
				absolute: false,
				captioned: false,
				inline: true
			} );
		},
		'test one inline widget absolute rect': function( editor, bot ) {
			assertWidgetsRects( editor, bot, {
				widgetsCount: 1,
				absolute: true,
				captioned: false,
				inline: true
			} );
		},
		'test captioned widget with nested inline rect': function( editor, bot ) {
			assertWidgetsRects( editor, bot, {
				widgetsCount: 1,
				absolute: false,
				captioned: true,
				inline: true
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );

	function assertWidgetsRects( editor, bot, config ) {
		var widgetsCount = config.widgetsCount,
			absolute = config.absolute,
			captioned = config.captioned,
			inline = config.inline,
			widgetText;

		if ( widgetsCount > 1 && CKEDITOR.env.ie ) {
			// IE and Edge returns another rect for parent object more than one widget is selected.
			assert.ignore();
		}

		if ( !captioned && !inline ) {
			widgetText = '<img alt="x" id="x" src="../../../_assets/lena.jpg" />';
		} else if ( captioned && !inline ) {
			widgetText = '<figure class="image"><img alt="x" id="x" src="../../../_assets/lena.jpg" /><figcaption>caption</figcaption></figure>';
		} else if ( captioned && inline ) {
			widgetText = '<figure class="image"><img alt="x" id="x" src="../../../_assets/lena.jpg" /><figcaption>caption[[inline]]</figcaption></figure>';
		} else {
			widgetText = '[[inline]]';
		}

		var data = '';

		for ( var i = widgetsCount; i > 0; i-- ) {
			data += widgetText;
		}

		if ( captioned && inline ) {
			widgetsCount *= 2;
		}

		bot.setData( data, function() {
			var range = editor.createRange(),
				rangeContainer = editor.editable().findOne( '[data-widget]' ).getParent().getParent(),
				rects,
				widgetElements,
				caption;

			range.setStart( rangeContainer, 0 );
			range.setEnd( rangeContainer, rangeContainer.getChildCount() );

			rects = range.getClientRects( absolute );
			assert.areEqual( widgetsCount, rects.length, 'Rect count' );

			widgetElements = editor.editable().find( '[data-widget]' );
			CKEDITOR.tools.array.forEach( widgetElements.toArray(), function( item, index ) {
				var rect = item.getClientRect( absolute ),
					rectFound;

				// Rects order isn't guaranteed so we need to iterate over all rects.
				for ( i = rects.length; i >= 0; i-- ) {
					rectFound = CKEDITOR.tools.objectCompare( rects[ i - 1 ], rect );
					if ( rectFound ) {
						break;
					}
				}
				assert.isTrue( rectFound, 'Rect[ ' + index + ' ]' );

				if ( captioned && item.getName() === 'figure' ) {
					caption = item.findOne( 'figcaption' );
					range.setStart( caption, 0 );
					range.setEnd( caption, caption.getChildCount() );
					rects = range.getClientRects();

					assert.areEqual( inline ? 2 : 1, rects.length, 'Caption rects legth' );

					if ( inline ) {
						assert.isTrue( CKEDITOR.tools.objectCompare(
							caption.findOne( '.cke_widget_element' ).getClientRect( absolute ), rects[ rects.length - 1 ]
						), 'Inline widget in caption rect' );
					}
				}
			} );
		} );
	}
} )();

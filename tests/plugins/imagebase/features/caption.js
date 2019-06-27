/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: imagebase,toolbar,easyimage */
/* bender-include: ../../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editors = {
		classic: {},

		divarea: {
			config: {
				extraPlugins: 'divarea'
			}
		},

		inline: {
			creator: 'inline'
		}
	};

	function addTestWidget( editor ) {
		if ( editor.widgets.registered.testWidget ) {
			return;
		}

		var plugin = CKEDITOR.plugins.imagebase;

		plugin.addImageWidget( editor, 'testWidget', plugin.addFeature( editor, 'caption', {} ) );
	}

	function getFixture( name ) {
		return CKEDITOR.document.getById( name ).getHtml();
	}

	function assertVisibility( caption, isVisible, msg, callback ) {
		assert[ 'is' + ( isVisible ? 'False' : 'True' ) ]( !!caption.data( 'cke-caption-hidden' ), msg );

		if ( callback ) {
			callback();
		}
	}

	/* Simulate focusing and blurring image widget with caption, asserting caption visibility
	 * during each step.
	 *
	 * @param {Object} options
	 * @param {String} options.fixture Fixture's id.
	 * @param {Boolean} options.initial Caption visibility at the start of the test.
	 * @param {Boolean} options.focus Caption visibility after calling focus function.
	 * @param {Boolean} options.blur Caption visibility after calling blur function.
	 * @param {Function} [options.onInit] Callback to run at the beginning of the test.
	 * @param {Function} [options.onFocus] Callback to run after focus function.
	 * @param {Function} [options.onBlur] Callback to run after blur function.
	 * @param {Function} [options.customFocus] Function to be called instead of default focus function.
	 * @param {Function} [options.customBlur] Function to be called instead of default blur function.
	 */
	function createToggleTest( options ) {
		return function( editor, bot ) {
			addTestWidget( editor );

			// Make sure the editor is focused, otherwise Edge/IE11 will throw Permission Denied error.
			editor.focus();

			bot.setData( getFixture( options.fixture ), function() {
				var widget = widgetTestsTools.getWidgetByDOMOffset( editor, 0 ),
					caption = widget.parts.caption,
					focusTrap = editor.editable().findOne( 'p' ).getChild( 0 ),
					range = editor.createRange();

				assertVisibility( caption, options.initial, 'caption visibility (initial)' );

				if ( options.onInit ) {
					options.onInit( widget );
				}

				if ( options.customFocus ) {
					options.customFocus( widget );
				} else {
					widget.focus();
				}

				assertVisibility( caption, options.focus, 'caption visibility (focus)' );

				if ( options.onFocus ) {
					options.onFocus( widget );
				}

				if ( options.customBlur ) {
					options.customBlur.call( this, widget );
				} else {
					range.setStart( focusTrap, 1 );
					range.collapse();
					range.select();
				}

				assertVisibility( caption, options.blur, 'caption visibility (blur)' );

				if ( options.onBlur ) {
					options.onBlur( widget );
				}
			} );
		};
	}

	/* Simulate focusing and blurring group of image widgets with captions, asserting caption visibility
	 * during each step. Assertions are made for every widget in the group.
	 *
	 * @param {Object} options
	 * @param {String} options.fixture Fixture's id.
	 * @param {Number} options.widgetsCount Number of widgets to test.
	 * @param {Boolean} options.initial Caption visibility at the start of the test.
	 * @param {Boolean} options.focus Caption visibility after calling focus function.
	 */
	function createMultipleToggleTest( options ) {
		return function( editor, bot ) {
			addTestWidget( editor );

			function assertMultipleVisibility( widgets, expected, msg, callback, i ) {
				var widget;

				i = i || 0;

				widget = widgets[ i ];
				assertVisibility( widget.parts.caption, expected[ i ], 'caption#' + i + ' visibility (' + msg + ')',
					function() {
						if ( i === widgets.length - 1 ) {
							if ( callback ) {
								callback();
							}

							return;
						}

						assertMultipleVisibility( widgets, expected, msg, callback, ++i );
					} );
			}

			function assertOnFocus( widgets, expected, i ) {
				var widget;

				i = i || 0;

				widget = widgets[ i ];

				setTimeout( function() {
					resume( function() {
						assertMultipleVisibility( widgets, expected[ i ], 'focus widget#' + i, function() {
							if ( i === widgets.length - 1 ) {
								return;
							}
							assertOnFocus( widgets, expected, ++i );
						} );
					} );
				}, 50 );

				widget.focus();
				wait();
			}

			bot.setData( getFixture( options.fixture ), function() {
				var widgets = bender.tools.objToArray( editor.widgets.instances ).slice( 0, options.widgetsCount );

				assertMultipleVisibility( widgets, options.initial, 'initial' );
				assertOnFocus( widgets, options.focus );
			} );
		};
	}

	function fillInCaption( widget, content ) {
		var range = widget.editor.createRange();

		setTimeout( function() {
			resume( function() {
				widget.editables.caption.setData( content );
			} );
		}, 50 );

		// Simulate user clicking inside the caption.
		range.setStart( widget.parts.caption.getChild( 0 ), 1 );
		range.collapse();
		range.select();

		widget.parts.caption.focus();
		wait();
	}

	function assertPlaceholder( widget, isVisible ) {
		var placeholder = widget.parts.caption.data( 'cke-caption-placeholder' );

		assert[ 'is' + ( isVisible ? 'True' : 'False' ) ]( !!placeholder, 'Placeholder visibility' );

		if ( isVisible ) {
			assert.areSame( widget.editor.lang.imagebase.captionPlaceholder, placeholder, 'Placeholder value' );
		}
	}

	// Blurs the editor, by putting focus in an element outside of the editor.
	// Resumes asserting, when the options.blurHost is blurred.
	// Note that it calls wait(), so no code after this function is executed.
	function blurEditor( options ) {
		var focusHost = CKEDITOR.document.getById( 'focusHost' ),
			blurHost = options.blurHost;

		// Normally we'd listen to focusHost#focus event, but it happens **before** blur, which might handle
		// this case.
		blurHost.once( 'blur', function() {
			resume( function() {
				options.assert();
			} );
		}, null, null, 9999 );

		// Enforce focus event to be called asynchronously on all browsers.
		setTimeout( function() {
			focusHost.focus();
		}, 0 );

		wait();
	}

	var tests = {

		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
		},

		'test upcasting widget without figcaption element': function( editor, bot ) {
			addTestWidget( editor );

			widgetTestsTools.assertWidget( {
				count: 1,
				widgetOffset: 0,
				nameCreated: 'testWidget',
				html: getFixture( 'upcastWithoutCaptionTest' ),
				bot: bot,

				assertCreated: function( widget ) {
					var figcaptions = widget.element.find( 'figcaption' );

					assert.areSame( 1, figcaptions.count(), 'captions count' );
					assert.isTrue( figcaptions.getItem( 0 ).equals( widget.parts.caption ),
						'Widget caption part element' );
					assert.isTrue( CKEDITOR.plugins.widget.isDomNestedEditable( widget.parts.caption ),
						'Caption is nested editable' );
				}
			} );
		},

		'test toggling caption (one widget with empty caption)': createToggleTest( {
			fixture: 'toggleOneEmpty',
			initial: false,
			focus: true,
			blur: false
		} ),

		'test toggling caption (one widget with non-empty caption)': createToggleTest( {
			fixture: 'toggleOne',
			initial: true,
			focus: true,
			blur: true
		} ),

		'test toggling caption (one widget with empty caption that gets filled)': createToggleTest( {
			fixture: 'toggleOneEmpty',
			initial: false,
			focus: true,
			blur: true,

			onFocus: function( widget ) {
				assertPlaceholder( widget, true );
				fillInCaption( widget, 'Test' );
			}
		} ),

		'test toggling caption (one widget with non-empty caption that gets emptied)': createToggleTest( {
			fixture: 'toggleOne',
			initial: true,
			focus: true,
			blur: false,

			onFocus: function( widget ) {
				assertPlaceholder( widget, false );
				fillInCaption( widget, '' );
			}
		} ),

		'test toggling caption (one widget with non-empty caption that gets emptied; focus in caption)': createToggleTest( {
			fixture: 'toggleOne',
			initial: true,
			focus: true,
			blur: false,

			customFocus: function( widget ) {
				widget.editables.caption.focus();
			},

			onFocus: function( widget ) {
				assertPlaceholder( widget, false );
				fillInCaption( widget, '' );
			}
		} ),

		'test toggling captions (two widgets with empty captions)': createMultipleToggleTest( {
			fixture: 'toggleTwoEmpty',
			widgetsCount: 2,
			initial: [ false, false ],
			focus: [
				[ true, false ],
				[ false, true ]
			]
		} ),

		'test toggling captions (two widgets with non-empty captions)': createMultipleToggleTest( {
			fixture: 'toggleTwo',
			widgetsCount: 2,
			initial: [ true, true ],
			focus: [
				[ true, true ],
				[ true, true ]
			]
		} ),

		'remove widget before changing selection': createToggleTest( {
			fixture: 'toggleOne',
			initial: true,
			focus: true,
			blur: true,

			onFocus: function( widget ) {
				widget.wrapper.remove();
			}
		} ),

		'test placeholder visibility (widget with empty caption)': createToggleTest( {
			fixture: 'toggleOneEmpty',
			initial: false,
			focus: true,
			blur: false,

			onInit: function( widget ) {
				assertPlaceholder( widget, false );
			},

			onFocus: function( widget ) {
				assertPlaceholder( widget, true );
			},

			onBlur: function( widget ) {
				assertPlaceholder( widget, false );
			}
		} ),

		'test placeholder visibility (widget with non-empty caption)': createToggleTest( {
			fixture: 'toggleOne',
			initial: true,
			focus: true,
			blur: true,

			onInit: function( widget ) {
				assertPlaceholder( widget, false );
			},

			onFocus: function( widget ) {
				assertPlaceholder( widget, false );
			},

			onBlur: function( widget ) {
				assertPlaceholder( widget, false );
			}
		} ),

		'test blurring editor hides visible, empty caption (widget focused)': createToggleTest( {
			fixture: 'toggleOneEmpty',
			initial: false,
			focus: true,
			blur: false,

			customBlur: function( widget ) {
				widget.focus();

				blurEditor( {
					assert: function() {
						assertVisibility( widget.parts.caption, false, 'Caption visibility' );
					},
					blurHost: widget
				} );
			}
		} ),

		'test blurring editor hides visible, empty caption (caption focused)': createToggleTest( {
			fixture: 'toggleOneEmpty',
			initial: false,
			focus: true,
			blur: false,

			customBlur: function( widget ) {
				widget.parts.caption.focus();

				blurEditor( {
					assert: function() {
						assertVisibility( widget.parts.caption, false, 'Caption visibility' );
					},
					// In case of blurring from caption, the host must be editor as blur for caption
					// itself is fired before blurring listener.
					blurHost: widget.editor
				} );
			}
		} ),

		// (#1592)
		'test toggling active caption': createToggleTest( {
			fixture: 'toggleActive',
			initial: true,
			focus: true,
			blur: false
		} ),

		'test blurring editor does not hide the caption': createToggleTest( {
			fixture: 'toggleOne',
			initial: true,
			focus: true,
			blur: true,

			customBlur: function( widget ) {
				widget.focus();

				blurEditor( {
					assert: function() {
						assertVisibility( widget.parts.caption, true, 'Caption visibility' );
					},
					blurHost: widget
				} );
			}
		} ),

		'test caption placeholder is not outputted': createToggleTest( {
			fixture: 'toggleOneEmpty',
			focus: true,

			onFocus: function( widget ) {
				assert.isNotMatching( /Enter image caption/, widget.editor.getData() );
			}
		} ),

		// (#1776)
		'test empty caption placeholder is hidden when blurred': function( editor, bot ) {
			addTestWidget( editor );

			// Make sure the editor is focused, otherwise Edge/IE11 will throw Permission Denied error.
			editor.focus();

			bot.setData( getFixture( 'blurEmpty' ), function() {
				var widgets = bender.tools.objToArray( editor.widgets.instances ).slice( 0, 2 ),
					emptyCaptionWidget = widgets[ 0 ],
					widgetWithCaption = widgets[ 1 ];

				widgetWithCaption.focus();
				emptyCaptionWidget.focus();

				blurEditor( {
					assert: function() {
						assert.areEqual( 'true', emptyCaptionWidget.parts.caption.data( 'cke-caption-hidden' ) );
					},
					blurHost: emptyCaptionWidget
				} );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	tests[ 'test integration with ACF' ] = function() {
		bender.editorBot.create( {
			name: 'acf_integration',
			config: {
				disallowedContent: 'figcaption'
			}
		}, function( bot ) {
			var editor = bot.editor;

			addTestWidget( editor );

			bot.setData( getFixture( 'toggleOneEmpty' ), function() {
				assert.isFalse( !!widgetTestsTools.getWidgetByDOMOffset( editor, 0 ).parts.caption, 'Caption presence' );
			} );
		} );
	};

	bender.test( tests );
} )();

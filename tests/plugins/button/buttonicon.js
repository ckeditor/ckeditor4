/* bender-tags: editor */
/* bender-ckeditor-plugins: button,toolbar */

( function() {
	'use strict';

	var editorCounter = 0,
		originalBasePath = null,
		isDev = CKEDITOR.version === '%VERSION%',
		isHidpi,
		tests;

	function createIconTests( testsObj, tests ) {
		CKEDITOR.tools.array.forEach( tests, function( test ) {
			testsObj[ test.name ] = function() {
				if ( test.ignore ) {
					// On a build version icons sprite image is loaded before any test code is execute so we are not able
					// to emulate `CKEDITOR.env.hidpi` to force different icons loading. Due to this behaviour some tests
					// needs to be ignored in build version.
					assert.ignore();
				} else {
					CKEDITOR.env.hidpi = test.name.indexOf( 'hidpi' ) !== -1;
					assertIcon( test.config, test.button, test.iconPath, test.iconName );
				}
			};
		} );
	}

	function assertIcon( editorConfig, btnName, iconPath, iconName ) {
		editorCounter++;
		bender.editorBot.create( {
			name: 'editor' + editorCounter,
			config: editorConfig
		}, function( bot ) {
			var btn = bot.editor.ui.get( btnName ),
				btnEl = CKEDITOR.document.getById( btn._.id ),
				btnCss = CKEDITOR.tools.parseCssText( btnEl.findOne( '.cke_button_icon' ).getAttribute( 'style' ), true );

			if ( iconPath === undefined ) {
				// Standard icon should be checked.
				if ( isDev ) {
					var iconFileName = ( iconName || btnName ).toLowerCase(),
						hidpi = CKEDITOR.env.hidpi ? 'hidpi\\/' : '';

					iconPath = new RegExp( 'plugins\\/' + iconFileName + '\\/icons\\/' + hidpi + iconFileName + '\\.png', 'gi' );
				} else {
					// In build version all standard icons are inside 'icons.png' sprite.
					iconPath = CKEDITOR.env.hidpi ? /plugins\/icons_hidpi\.png/gi : /plugins\/icons\.png/gi;
				}
			}

			assert.isMatching( iconPath, btnCss[ 'background-image' ] );
		} );
	}

	tests = {
		init: function() {
			isHidpi = CKEDITOR.env.hidpi;
		},

		tearDown: function() {
			// Restore global values modified by tests.
			CKEDITOR.env.hidpi = isHidpi;
			if ( originalBasePath ) {
				CKEDITOR.basePath = originalBasePath;
				originalBasePath = null;
			}
		}
	};

	createIconTests( tests, [
		{
			name: 'test default button icon',
			button: 'Link',
			config: {
				extraPlugins: 'link'
			},
			ignore: !isDev && CKEDITOR.env.hidpi
		}, {
			name: 'test default button icon (hidpi)',
			button: 'Find',
			config: {
				extraPlugins: 'find'
			},
			ignore: !isDev && !CKEDITOR.env.hidpi
		}, {
			name: 'test overwriting default button icon',
			button: 'Replace',
			iconPath: /tests\/_assets\/sample_icon\.png/gi,
			config: {
				extraPlugins: 'find',
				toolbar: [ [ 'Replace' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						var editor = evt.editor;
						editor.ui.addButton( 'Replace', {
							label: editor.lang.find.replace,
							command: 'replace',
							icon: 'tests/_assets/sample_icon.png'
						} );
					}
				}
			}
		}, {
			name: 'test overwriting default button icon (hidpi)',
			button: 'Replace',
			iconPath: /tests\/_assets\/sample_icon\.hidpi\.png/gi,
			config: {
				extraPlugins: 'find',
				toolbar: [ [ 'Replace' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						var editor = evt.editor;
						editor.ui.addButton( 'Replace', {
							label: editor.lang.find.replace,
							command: 'replace',
							iconHiDpi: 'tests/_assets/sample_icon.hidpi.png'
						} );
					}
				}
			}
		}, {
			name: 'test button icon from different plugin',
			button: 'custom_btn1',
			iconName: 'about',
			config: {
				extraPlugins: 'about',
				toolbar: [ [ 'custom_btn1' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						evt.editor.ui.addButton( 'custom_btn1', {
							icon: 'about'
						} );
					}
				}
			},
			ignore: !isDev && CKEDITOR.env.hidpi
		}, {
			name: 'test button icon from different plugin (hidpi)',
			button: 'custom_btn2',
			iconName: 'blockquote',
			config: {
				extraPlugins: 'blockquote',
				toolbar: [ [ 'custom_btn2' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						evt.editor.ui.addButton( 'custom_btn2', {
							icon: 'blockquote'
						} );
					}
				}
			},
			ignore: !isDev && !CKEDITOR.env.hidpi
		}, {
			name: 'test custom button icon',
			button: 'custom_btn3',
			iconPath: /tests\/_assets\/sample_icon\.png/gi,
			config: {
				toolbar: [ [ 'custom_btn3' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						evt.editor.ui.addButton( 'custom_btn3', {
							icon: 'tests/_assets/sample_icon.png'
						} );
					}
				}
			}
		}, {
			name: 'test custom button icon (hidpi)',
			button: 'custom_btn4',
			iconPath: /tests\/_assets\/sample_icon\.hidpi\.png/gi,
			config: {
				toolbar: [ [ 'custom_btn4' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						evt.editor.ui.addButton( 'custom_btn4', {
							iconHiDpi: 'tests/_assets/sample_icon.hidpi.png'
						} );
					}
				}
			}
		}, {
			name: 'test custom button icon-only (hidpi)',
			button: 'custom_btn5',
			iconPath: /tests\/_assets\/sample_icon\.png/gi,
			config: {
				toolbar: [ [ 'custom_btn5' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						evt.editor.ui.addButton( 'custom_btn5', {
							icon: 'tests/_assets/sample_icon.png'
						} );
					}
				}
			}
		}, {
			name: 'test custom button icon with different basepath',
			button: 'custom_btn6',
			iconPath: /different\/basepath\/assets\/icons\.sample\.png/gi,
			config: {
				toolbar: [ [ 'custom_btn6' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						originalBasePath = CKEDITOR.basePath;
						CKEDITOR.basePath = '/different/basepath/';
						evt.editor.ui.addButton( 'custom_btn6', {
							icon: 'assets/icons.sample.png'
						} );
					}
				}
			}
		}, {
			name: 'test custom button icon with different basepath (hidpi)',
			button: 'custom_btn7',
			iconPath: /different\/basepath\/assets\/hidpi\/icons\.sample\.png/gi,
			config: {
				toolbar: [ [ 'custom_btn7' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						originalBasePath = CKEDITOR.basePath;
						CKEDITOR.basePath = '/different/basepath/';
						evt.editor.ui.addButton( 'custom_btn7', {
							icon: 'assets/hidpi/icons.sample.png'
						} );
					}
				}
			}
		}, {
			name: 'test custom button icon with different basepath trailing slash',
			button: 'custom_btn8',
			iconPath: /['|"|(]\/assets\/icons\.sample\.png/gi,
			config: {
				toolbar: [ [ 'custom_btn8' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						originalBasePath = CKEDITOR.basePath;
						CKEDITOR.basePath = '/different/basepath/';
						evt.editor.ui.addButton( 'custom_btn8', {
							icon: '/assets/icons.sample.png'
						} );
					}
				}
			}
		}, {
			name: 'test custom button icon with different basepath trailing slash (hidpi)',
			button: 'custom_btn9',
			iconPath: /['|"|(]\/assets\/hidpi\/icons\.sample\.png/gi,
			config: {
				toolbar: [ [ 'custom_btn9' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						originalBasePath = CKEDITOR.basePath;
						CKEDITOR.basePath = '/different/basepath/';
						evt.editor.ui.addButton( 'custom_btn9', {
							icon: '/assets/hidpi/icons.sample.png'
						} );
					}
				}
			}
		}
	] );

	bender.test( tests );
} )();

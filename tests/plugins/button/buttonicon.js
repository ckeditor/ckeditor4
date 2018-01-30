/* bender-tags: editor */
/* bender-ckeditor-plugins: button,toolbar */

var editorCounter = 0,
	originalBasePath = null,
	isHidpi;

function resolutionStandard() {
	CKEDITOR.env.hidpi = false;
}

function resolutionHidpi() {
	CKEDITOR.env.hidpi = true;
}

function assertIcon( editorConfig, btnName, iconPath ) {
	editorCounter++;
	bender.editorBot.create( {
		name: 'editor' + editorCounter,
		config: editorConfig
	}, function( bot ) {
		var btn = bot.editor.ui.get( btnName ),
			btnEl = CKEDITOR.document.getById( btn._.id ),
			btnCss = CKEDITOR.tools.parseCssText( btnEl.findOne( '.cke_button_icon' ).getAttribute( 'style' ) );

		assert.isMatching( iconPath, btnCss[ 'background-image' ] );
	} );
}

bender.test( {
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
	},

	'test default button icon': function() {
		resolutionStandard();
		assertIcon(
			{ extraPlugins: 'link' },
			'Link',
			/plugins\/link\/icons\/link\.png/gi
		);
	},

	'test default button icon (hidpi)': function() {
		resolutionHidpi();
		assertIcon(
			{ extraPlugins: 'find' },
			'Find',
			/plugins\/find\/icons\/hidpi\/find\.png/gi
		);
	},

	'test button icon from different plugin': function() {
		resolutionStandard();
		assertIcon( {
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
			'custom_btn1',
			/plugins\/about\/icons\/about\.png/gi
		);
	},

	'test button icon from different plugin (hidpi)': function() {
		resolutionHidpi();
		assertIcon( {
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
			'custom_btn2',
			/plugins\/blockquote\/icons\/hidpi\/blockquote\.png/gi
		);
	},

	'test custom button icon': function() {
		resolutionStandard();
		assertIcon( {
				toolbar: [ [ 'custom_btn3' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						evt.editor.ui.addButton( 'custom_btn3', {
							icon: '/assets/icons.sample.png'
						} );
					}
				}
			},
			'custom_btn3',
			/assets\/icons\.sample\.png/gi
		);
	},

	'test custom button icon (hidpi)': function() {
		resolutionHidpi();
		assertIcon( {
				toolbar: [ [ 'custom_btn4' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						evt.editor.ui.addButton( 'custom_btn4', {
							iconHidpi: '/assets/hidpi/icons.sample.png'
						} );
					}
				}
			},
			'custom_btn4',
			/assets\/hidpi\/icons\.sample\.png/gi
		);
	},

	'test custom button icon-only (hidpi)': function() {
		resolutionHidpi();
		assertIcon( {
				toolbar: [ [ 'custom_btn5' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						evt.editor.ui.addButton( 'custom_btn5', {
							icon: '/assets/icons.sample.png'
						} );
					}
				}
			},
			'custom_btn5',
			/assets\/icons\.sample\.png/gi
		);
	},

	'test custom button icon with different basepath': function() {
		resolutionStandard();
		assertIcon( {
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
			},
			'custom_btn6',
			/different\/basepath\/assets\/icons\.sample\.png/gi
		);
	},

	'test custom button icon with different basepath (hidpi)': function() {
		resolutionHidpi();
		assertIcon( {
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
			},
			'custom_btn7',
			/different\/basepath\/assets\/hidpi\/icons\.sample\.png/gi
		);
	},

	'test custom button icon with different basepath trailing slash': function() {
		resolutionStandard();
		assertIcon( {
				toolbar: [ [ 'custom_btn6' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						originalBasePath = CKEDITOR.basePath;
						CKEDITOR.basePath = '/different/basepath/';
						evt.editor.ui.addButton( 'custom_btn6', {
							icon: '/assets/icons.sample.png'
						} );
					}
				}
			},
			'custom_btn6',
			/assets\/icons\.sample\.png/gi
		);
	},

	'test custom button icon with different basepath trailing slash (hidpi)': function() {
		resolutionHidpi();
		assertIcon( {
				toolbar: [ [ 'custom_btn7' ] ],
				on: {
					pluginsLoaded: function( evt ) {
						originalBasePath = CKEDITOR.basePath;
						CKEDITOR.basePath = '/different/basepath/';
						evt.editor.ui.addButton( 'custom_btn7', {
							icon: '/assets/hidpi/icons.sample.png'
						} );
					}
				}
			},
			'custom_btn7',
			/assets\/hidpi\/icons\.sample\.png/gi
		);
	}
} );

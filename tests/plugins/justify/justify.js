/* bender-tags: editor */
/* bender-ckeditor-plugins: justify,image,toolbar */
/* bender-ui: collapsed */

( function() {

	'use strict';

	bender.editor = {
		config: { enterMode: CKEDITOR.ENTER_P },
		allowedForTests: 'img[align];span[contenteditable]'
	};

	var tests = {
		init: function() {
			CKEDITOR.addCss( '.usecomputedstatetest { text-align: right;}' +
				'.usecomputedstatetestdir { direction: rtl; }' );
		},

		'test alignment command on selected image': function() {
			var bot = this.editorBot;
			bot.setHtmlWithSelection( '<p>[<img src="http://tests/404" style="float:left;"/>]</p>' );

			// Check commands state, center/justify should be disabled at this point.
			return assertCommandState( 1, 2, 0, 0, bot )
				.then( function() {
					// Remove the existing image alignment.
					bot.execCommand( 'justifyleft' );
					assert.areSame( '<p><img src="http://tests/404" /></p>', bot.getData( true ) );
					// Align image right.
					bot.execCommand( 'justifyright' );
					assert.areSame( '<p><img src="http://tests/404" style="float:right;" /></p>', bot.getData( true ) );

					// Align image left again.
					bot.execCommand( 'justifyleft' );
					assert.areSame( '<p><img src="http://tests/404" style="float:left;" /></p>', bot.getData( true ) );
				} );
		},

		'test alignment command on selected image (align attribute)': function() {
			var bot = this.editorBot;
			bot.setHtmlWithSelection( '<p>[<img src="http://tests/404" align="left"/>]</p>' );
			// Check commands state, center/justify should be disabled at this point.
			return assertCommandState( 1, 2, 0, 0, bot )
				.then( function() {
					// Remove the existing image alignment.
					bot.execCommand( 'justifyleft' );
					assert.areSame( '<p><img src="http://tests/404" /></p>', bot.getData( true ) );

					// Align image right.
					bot.execCommand( 'justifyright' );
					assert.areSame( '<p><img src="http://tests/404" style="float:right;" /></p>', bot.getData( true ) );
				} );
		},

		// Justify should align paragraph.
		'test alignment command on paragraph': function() {
			this.editorBot.setHtmlWithSelection( '<p>[<img src="http://tests/404"/>bar]</p>' );

			// Check commands state, all commands should be enabled, left should be turned on.
			return assertCommandState( 1, 2, 2, 2, this.editorBot )
				.then( function( bot ) {
					// Align paragraph right;
					bot.execCommand( 'justifyright' );
					assert.areSame( '<p style="text-align:right;"><img src="http://tests/404" />bar</p>', bot.getData( true ) );

					// Align paragraph left;
					bot.execCommand( 'justifyleft' );
					assert.areSame( '<p><img src="http://tests/404" />bar</p>', bot.getData( true ) );

					// Align paragraph center;
					bot.execCommand( 'justifycenter' );
					assert.areSame( '<p style="text-align:center;"><img src="http://tests/404" />bar</p>', bot.getData( true ) );

					// Align paragraph justify
					bot.execCommand( 'justifyblock' );
					assert.areSame( '<p style="text-align:justify;"><img src="http://tests/404" />bar</p>', bot.getData( true ) );
				} );
		},

		'test alignment commands with justifyClasses': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_classes',
					config: {
						justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
						plugins: 'justify,toolbar',
						extraAllowedContent: 'img[src]',
						contentsCss: '%TEST_DIR%/_assets/styles.css'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>[<img src="http://tests/404"/>bar]</p>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					// Align paragraph right;
					bot.execCommand( 'justifyright' );
					assert.areSame( '<p class="alignright"><img src="http://tests/404" />bar</p>', bot.getData( true ) );
					return assertCommandState( 2, 1, 2, 2, bot );
				} )
				.then( function( bot ) {
					// Align paragraph center;
					bot.execCommand( 'justifycenter' );
					assert.areSame( '<p class="aligncenter"><img src="http://tests/404" />bar</p>', bot.getData( true ) );
					return assertCommandState( 2, 2, 1, 2, bot );
				} )
				.then( function( bot ) {
					// Align paragraph left;
					bot.execCommand( 'justifyleft' );
					assert.areSame( '<p><img src="http://tests/404" />bar</p>', bot.getData( true ) );
					return assertCommandState( 1, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					// Align paragraph justify
					bot.execCommand( 'justifyblock' );
					assert.areSame( '<p class="alignjustify"><img src="http://tests/404" />bar</p>', bot.getData( true ) );
					return assertCommandState( 2, 2, 2, 1, bot );
				} );
		},

		'test alignment commands with justifyClasses - one disallowed': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_classes2',
					config: {
						justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
						plugins: 'justify,toolbar',
						// Note: alignRight is not allowed.
						allowedContent: 'p(alignLeft,alignCenter,alignJustify); img[src]',
						contentsCss: '%TEST_DIR%/_assets/styles.css'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>[<img src="http://tests/404"/>bar]</p>' );
					return assertCommandState( 1, 0, 2, 2, bot );
				} )
				.then( function( bot ) {
					// Align paragraph right;
					bot.execCommand( 'justifyright' );
					assert.areSame( '<p><img src="http://tests/404" />bar</p>', bot.getData( true ) );
					// Check commands state, left should be turned on, right disabled and the rest off.
					return assertCommandState( 1, 0, 2, 2, bot );
				} )
				.then( function( bot ) {
					// Align paragraph center;
					bot.execCommand( 'justifycenter' );
					assert.areSame( '<p class="aligncenter"><img src="http://tests/404" />bar</p>', bot.getData( true ) );
					// Check commands state, left should be turned on, right disabled and the rest off.
					return assertCommandState( 2, 0, 1, 2, bot );
				} );
		},

		'test alignment commands in br mode': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_enter_br',
					config: {
						plugins: 'justify,toolbar',
						enterMode: CKEDITOR.ENTER_BR
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( 'foo^bar<br />bom' );
					return assertCommandState( 2, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					// Align paragraph right;
					bot.execCommand( 'justifyright' );
					assert.areSame( '<div style="text-align:right;">foobar</div>bom', bot.getData( true ) );
					return assertCommandState( 2, 1, 2, 2, bot );
				} )
				.then( function( bot ) {
					// Align paragraph center;
					bot.execCommand( 'justifyleft' );
					assert.areSame( '<div>foobar</div>bom', bot.getData( true ) );
					return assertCommandState( 1, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					assert.isTrue( bot.editor.filter.check( 'div{text-align}' ), 'Check whether justify allows div in br mode' );
				} );
		},

		'test alignment commands in div mode and with justifyClasses': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_enter_div',
					config: {
						plugins: 'justify,toolbar',
						enterMode: CKEDITOR.ENTER_DIV,
						justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
						contentsCss: '%TEST_DIR%/_assets/styles.css'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<div>foo^bar</div>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					// Align paragraph right;
					bot.execCommand( 'justifyright' );
					assert.areSame( '<div class="alignright">foobar</div>', bot.getData( true ) );
					return assertCommandState( 2, 1, 2, 2, bot );
				} )
				.then( function( bot ) {
					// Align paragraph left;
					bot.execCommand( 'justifyleft' );
					assert.areSame( '<div>foobar</div>', bot.getData( true ) );
					return assertCommandState( 1, 2, 2, 2, bot );
				} );
		},

		'test justify on selection containing non-editable inline': function() {
			var bot = this.editorBot;
			bot.setHtmlWithSelection( '[<p>xxx<span contenteditable="false">foo</span>zzz</p>]' );
			bot.execCommand( 'justifyright' );
			assert.areSame( '<p style="text-align:right;">xxx<span contenteditable="false">foo</span>zzz</p>', bot.getData( true ) );

			bot.setHtmlWithSelection( '[<p><span contenteditable="false">foo</span></p>]' );
			bot.execCommand( 'justifyright' );
			assert.areSame( '<p style="text-align:right;"><span contenteditable="false">foo</span></p>', bot.getData( true ) );
		},

		// (#455)
		'test alignment on disabled elements paragraph': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_p_1',
					config: {
						plugins: 'justify,toolbar,wysiwygarea',
						allowedContent: 'p ul{text-align};li;'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>Foo</p><ul><li>on^e</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 0, 0, 0, 0, bot );
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>Fo^o</p><ul><li>one</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} );
		},

		// (#455)
		'test alignment on disabled elements paragraph (class)': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_p_1_class',
					config: {
						plugins: 'justify,toolbar,wysiwygarea',
						allowedContent: 'p ul(align*);li;',
						justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
						contentsCss: '%TEST_DIR%/_assets/styles.css'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>Foo</p><ul><li>on^e</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 0, 0, 0, 0, bot );
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>Fo^o</p><ul><li>one</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} );
		},

		// (#455)
		'test alignment on disabled elements div mode': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_div_1',
					creator: 'inline',
					config: {
						plugins: 'justify,toolbar,divarea',
						allowedContent: 'div ul{text-align};li;',
						enterMode: CKEDITOR.ENTER_DIV
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<div>Foo</div><ul><li>on^e</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 0, 0, 0, 0, bot );
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<div>F^oo</div><ul><li>one</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} );
		},

		// (#455)
		'test alignment on disabled elements div mode (class)': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_div_1_class',
					creator: 'inline',
					config: {
						plugins: 'justify,toolbar,divarea',
						allowedContent: 'div ul(align*);li;',
						justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
						enterMode: CKEDITOR.ENTER_DIV
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<div>Foo</div><ul><li>on^e</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 0, 0, 0, 0, bot );
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<div>F^oo</div><ul><li>one</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} );
		},

		// (#455)
		'test alignment on disabled elements br mode': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_br_1',
					config: {
						plugins: 'justify,toolbar,divarea',
						allowedContent: 'div ul{text-align};li;',
						enterMode: CKEDITOR.ENTER_BR
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( 'foo<ul><li>on^e</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 0, 0, 0, 0, bot );
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( 'f^oo<ul><li>one</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 2, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					bot.execCommand( 'justifyblock' );
					return assertCommandState( 2, 2, 2, 1, bot );
				} )
				.then( function( bot ) {
					assert.isInnerHtmlMatching( '<div style="text-align:justify;">foo</div><ul><li>one</li><li>two</li><li>three</li></ul>', bot.getData( true ) );
				} );
		},

		// (#455)
		'test alignment on disabled elements br mode (class)': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_br_1_class',
					config: {
						plugins: 'justify,toolbar,divarea',
						allowedContent: 'div ul(align*);li;',
						justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
						enterMode: CKEDITOR.ENTER_BR
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( 'foo<ul><li>on^e</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 0, 0, 0, 0, bot );
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( 'f^oo<ul><li>one</li><li>two</li><li>three</li></ul>' );
					return assertCommandState( 2, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					bot.execCommand( 'justifyblock' );
					return assertCommandState( 2, 2, 2, 1, bot );
				} )
				.then( function( bot ) {
					assert.isInnerHtmlMatching( '<div class="alignJustify">foo</div><ul><li>one</li><li>two</li><li>three</li></ul>', bot.getData() );
				} );
		},

		// (#455)
		'test alignment on multi-element non-collapsed selection': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_p_2',
					config: {
						plugins: 'justify,toolbar,wysiwygarea',
						allowedContent: 'p ul{text-align};li;'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>F[oo</p><ul><li>one</li><li>two</li><li>three</li></ul><p>B]ar</p>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					bot.execCommand( 'justifycenter' );
					return assertCommandState( 2, 2, 1, 2, bot );
				} )
				.then( function( bot ) {
					assert.areSame( '<p style="text-align:center;">foo</p><ul><li>one</li><li>two</li><li>three</li></ul><p style="text-align:center;">bar</p>', bot.getData( true ) );
				} );
		},

		// (#455)
		'test alignment on multi-element non-collapsed selection (class)': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_p_2_class',
					config: {
						plugins: 'justify,toolbar,wysiwygarea',
						justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
						contentsCss: '%TEST_DIR%/_assets/styles.css',
						allowedContent: 'p ul(align*);li;'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>f[oo</p><ul><li>one</li><li>two</li><li>three</li></ul><p>b]ar</p>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					bot.execCommand( 'justifycenter' );
					return assertCommandState( 2, 2, 1, 2, bot );
				} )
				.then( function( bot ) {
					assert.areSame( '<p class="alignCenter">foo</p><ul><li>one</li><li>two</li><li>three</li></ul><p class="alignCenter">bar</p>', bot.getData() );
				} );
		},

		// (#455)
		'test alignment on multi-element with disallowContent': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_p_3',
					config: {
						allowedContent: {
							$1: {
								elements: CKEDITOR.dtd,
								attributes: true,
								styles: true,
								classes: true
							}
						},
						disallowedContent: 'h1{text-align}'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>fo[o</p><h1>bar</h1><p>foooos</p><h1>b]az</p>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					bot.execCommand( 'justifyright' );
					return assertCommandState( 2, 1, 2, 2, bot );
				} )
				.then( function( bot ) {
					assert.areSame( '<p style="text-align:right;">foo</p><h1>bar</h1><p style="text-align:right;">foooos</p><h1>baz</h1>', bot.getData( true ) );
				} );
		},

		// (#455)
		'test alignment on multi-element with disallowContent (class)': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_p_3_class',
					config: {
						allowedContent: {
							$1: {
								elements: CKEDITOR.dtd,
								attributes: true,
								styles: true,
								classes: true
							}
						},
						disallowedContent: 'h1(align*){text-align}',
						justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
						contentsCss: '%TEST_DIR%/_assets/styles.css'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>fo[o</p><h1>bar</h1><p>foooos</p><h1>b]az</p>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					bot.execCommand( 'justifyright' );
					return assertCommandState( 2, 1, 2, 2, bot );
				} )
				.then( function( bot ) {
					assert.areSame( '<p class="alignRight">foo</p><h1>bar</h1><p class="alignRight">foooos</p><h1>baz</h1>', bot.getData() );
				} );
		},

		// (#455)
		'test alignment div-type editor': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_div_2',
					creator: 'inline',
					config: {
						allowedContent: {
							$1: {
								elements: CKEDITOR.dtd,
								attributes: true,
								styles: true,
								classes: true
							}
						},
						disallowedContent: 'h1{text-align}'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>f[oo</p><h1>bar</h1><p>ba]z</p>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					bot.execCommand( 'justifycenter' );
					return assertCommandState( 2, 2, 1, 2, bot );
				} )
				.then( function( bot ) {
					assert.areSame( '<p style="text-align:center;">foo</p><h1>bar</h1><p style="text-align:center;">baz</p>', bot.getData( true ) );
				} );
		},

		// (#455)
		'test alignment div-type editor (class)': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_div_2_class',
					creator: 'inline',
					config: {
						allowedContent: {
							$1: {
								elements: CKEDITOR.dtd,
								attributes: true,
								styles: true,
								classes: true
							}
						},
						disallowedContent: 'h1{text-align}(align*)',
						justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
						contentsCss: '_assets/styles.css'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>f[oo</p><h1>bar</h1><p>ba]z</p>' );
					return assertCommandState( 1, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					bot.execCommand( 'justifycenter' );
					return assertCommandState( 2, 2, 1, 2, bot );
				} )
				.then( function( bot ) {
					assert.areSame( '<p class="alignCenter">foo</p><h1>bar</h1><p class="alignCenter">baz</p>', bot.getData() );
				} );
		},

		// (#455)
		'test alignment on disabled elements block type under editable': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_div_3',
					config: {
						plugins: 'justify,toolbar,divarea',
						allowedContent: 'div{text-align};ul li;',
						enterMode: CKEDITOR.ENTER_BR
					}
				} )
				.then( function( bot ) {
					var editable = bot.editor.editable();
					var range = new CKEDITOR.dom.range( editable );

					bot.setHtmlWithSelection( 'Foo<br /><ul><li>one</li><li>two</li><li>three</li></ul>' );
					// Selection in such way to have sure that `ul` is set up as start and end node.
					range.selectNodeContents( editable.findOne( 'ul' ) );
					range.select();
					return assertCommandState( 0, 0, 0, 0, bot );
				} );
		},

		// (#1479)
		'test alignment on styled elements in br mode': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_br_2',
					config: {
						plugins: 'justify,toolbar',
						enterMode: CKEDITOR.ENTER_BR
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<span class="marker">[Foo bar baz]</span>' );
					return assertCommandState( 2, 2, 2, 2, bot );
				} )
				.then( function( bot ) {
					bot.execCommand( 'justifycenter' );
					return assertCommandState( 2, 2, 1, 2, bot );
				} )
				.then( function( bot ) {
					assert.isInnerHtmlMatching( '<div style="text-align:center"><span class="marker">Foo bar baz</span></div>', bot.getData(), { fixStyles: true } );
				} );
		},

		// (#4989)
		'test justify buttons states in the editor with config.useComputedState set to default value': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_useComputedState_default',
					config: {
						extraAllowedContent: 'p(usecomputedstatetest)',
						plugins: 'justify,toolbar'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p class="usecomputedstatetest">[Foo bar baz]</p>' );

					return assertCommandState( CKEDITOR.TRISTATE_OFF, CKEDITOR.TRISTATE_ON, CKEDITOR.TRISTATE_OFF,
						CKEDITOR.TRISTATE_OFF, bot );
				} );
		},

		// (#4989)
		'test justify buttons states in the editor with config.useComputedState set to true': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_useComputedState_true',
					config: {
						extraAllowedContent: 'p(usecomputedstatetest)',
						plugins: 'justify,toolbar',
						useComputedState: true
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p class="usecomputedstatetest">[Foo bar baz]</p>' );

					return assertCommandState( CKEDITOR.TRISTATE_OFF, CKEDITOR.TRISTATE_ON, CKEDITOR.TRISTATE_OFF,
						CKEDITOR.TRISTATE_OFF, bot );
				} );
		},

		// (#4989)
		'test justify buttons states in the editor with config.useComputedState set to false': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_useComputedState_false',
					config: {
						extraAllowedContent: 'p(usecomputedstatetest)',
						plugins: 'justify,toolbar',
						useComputedState: false
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p class="usecomputedstatetest">[Foo bar baz]</p>' );

					return assertCommandState( CKEDITOR.TRISTATE_OFF, CKEDITOR.TRISTATE_OFF, CKEDITOR.TRISTATE_OFF,
						CKEDITOR.TRISTATE_OFF, bot );
				} );
		},

		// (#4989)
		'test justify buttons states in the editor with config.useComputedState set to default value (direction style)': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_useComputedStateDir_default',
					config: {
						extraAllowedContent: 'p(usecomputedstatetestdir)',
						plugins: 'justify,toolbar'
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p class="usecomputedstatetestdir">[Foo bar baz]</p>' );

					return assertCommandState( CKEDITOR.TRISTATE_OFF, CKEDITOR.TRISTATE_ON, CKEDITOR.TRISTATE_OFF,
						CKEDITOR.TRISTATE_OFF, bot );
				} );
		},

		// (#4989)
		'test justify buttons states in the editor with config.useComputedState set to true (direction style)': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_useComputedStateDir_true',
					config: {
						extraAllowedContent: 'p(usecomputedstatetestdir)',
						plugins: 'justify,toolbar',
						useComputedState: true
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p class="usecomputedstatetestdir">[Foo bar baz]</p>' );

					return assertCommandState( CKEDITOR.TRISTATE_OFF, CKEDITOR.TRISTATE_ON, CKEDITOR.TRISTATE_OFF,
						CKEDITOR.TRISTATE_OFF, bot );
				} );
		},

		// (#4989)
		'test justify buttons states in the editor with config.useComputedState set to false (direction style)': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_useComputedStateDir_false',
					config: {
						extraAllowedContent: 'p(usecomputedstatetestdir)',
						plugins: 'justify,toolbar',
						useComputedState: false
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p class="usecomputedstatetestdir">[Foo bar baz]</p>' );

					return assertCommandState( CKEDITOR.TRISTATE_OFF, CKEDITOR.TRISTATE_OFF, CKEDITOR.TRISTATE_OFF,
						CKEDITOR.TRISTATE_OFF, bot );
				} );
		}
	};

	tests = bender.tools.createAsyncTests( tests );

	bender.test( tests );

	function assertCommandState( left, right, center, justify, bot ) {
		return new CKEDITOR.tools.promise( function( resolve, reject ) {
			var editor = bot.editor;

			CKEDITOR.tools.setTimeout( function() {
				var leftCmd = editor.getCommand( 'justifyleft' ),
					rightCmd = editor.getCommand( 'justifyright' ),
					centerCmd = editor.getCommand( 'justifycenter' ),
					justifyCmd = editor.getCommand( 'justifyblock' );
				try {
					assert.areSame( left, leftCmd.state, 'leftCmd.state' );
					assert.areSame( right, rightCmd.state, 'rightCmd.state' );
					assert.areSame( center, centerCmd.state, 'centerCmd.state' );
					assert.areSame( justify, justifyCmd.state, 'justifyCmd.state' );

					resolve( bot );
				} catch ( e ) {
					reject( e );
				}
			}, 0, this );
		} );
	}

} )();

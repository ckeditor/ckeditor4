/* bender-tags: editor */
/* bender-ckeditor-plugins: justify,image,toolbar */

bender.editor = {
	config: { enterMode: CKEDITOR.ENTER_P },
	allowedForTests: 'img[align];span[contenteditable]'
};

bender.test(
{
	assertCommandState: function( left, right, center, justify, editor ) {
		editor = editor || this.editor;

		var leftCmd = editor.getCommand( 'justifyleft' );
		var rightCmd = editor.getCommand( 'justifyright' );
		var centerCmd = editor.getCommand( 'justifycenter' );
		var justifyCmd = editor.getCommand( 'justifyblock' );

		assert.areSame( left, leftCmd.state, 'leftCmd.state' );
		assert.areSame( right, rightCmd.state, 'rightCmd.state' );
		assert.areSame( center, centerCmd.state, 'centerCmd.state' );
		assert.areSame( justify, justifyCmd.state, 'justifyCmd.state' );
	},

	// Justify should align selected image.
	'test aligment command on selected image': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>[<img src="http://tests/404" style="float:left;"/>]</p>' );

		// Check commands state, center/justify should be disabled at this point.
		this.assertCommandState( 1, 2, 0, 0 );

		// Remove the existing image alignment.
		bot.execCommand( 'justifyleft' );
		assert.areSame( '<p><img src="http://tests/404" /></p>', bot.getData( true ) );

		// Align image right.
		bot.execCommand( 'justifyright' );
		assert.areSame( '<p><img src="http://tests/404" style="float:right;" /></p>', bot.getData( true ) );

		// Align image left again.
		bot.execCommand( 'justifyleft' );
		assert.areSame( '<p><img src="http://tests/404" style="float:left;" /></p>', bot.getData( true ) );
	},

	'test aligment command on selected image (align attribute)': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>[<img src="http://tests/404" align="left"/>]</p>' );

		// Check commands state, center/justify should be disabled at this point.
		this.assertCommandState( 1, 2, 0, 0 );

		// Remove the existing image alignment.
		bot.execCommand( 'justifyleft' );
		assert.areSame( '<p><img src="http://tests/404" /></p>', bot.getData( true ) );

		// Align image right.
		bot.execCommand( 'justifyright' );
		assert.areSame( '<p><img src="http://tests/404" style="float:right;" /></p>', bot.getData( true ) );
	},

	// Justify should align paragraph.
	'test aligment command on paragraph': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>[<img src="http://tests/404"/>bar]</p>' );

		// Check commands state, all commands should be enabled, left should be turned on.
		this.assertCommandState( 1, 2, 2, 2 );

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
	},

	'test alignment commands with justifyClasses': function() {
		var tc = this;

		bender.editorBot.create( {
			name: 'editor_classes',
			config: {
				justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
				plugins: 'justify,toolbar',
				extraAllowedContent: 'img[src]',
				contentsCss: '_assets/styles.css'
			}
		}, function( bot ) {
			var editor = bot.editor;

			bot.setHtmlWithSelection( '<p>[<img src="http://tests/404"/>bar]</p>' );

			// Check commands state, all commands should be enabled, left should be turned on.
			tc.assertCommandState( 1, 2, 2, 2, editor );

			// Align paragraph right;
			bot.execCommand( 'justifyright' );
			assert.areSame( '<p class="alignright"><img src="http://tests/404" />bar</p>', bot.getData( true ) );

			// Right on.
			tc.assertCommandState( 2, 1, 2, 2, editor );

			// Align paragraph center;
			bot.execCommand( 'justifycenter' );
			assert.areSame( '<p class="aligncenter"><img src="http://tests/404" />bar</p>', bot.getData( true ) );

			// Center on.
			tc.assertCommandState( 2, 2, 1, 2, editor );

			// Align paragraph left;
			bot.execCommand( 'justifyleft' );
			assert.areSame( '<p><img src="http://tests/404" />bar</p>', bot.getData( true ) );

			// Left on.
			tc.assertCommandState( 1, 2, 2, 2, editor );

			// Align paragraph justify
			bot.execCommand( 'justifyblock' );
			assert.areSame( '<p class="alignjustify"><img src="http://tests/404" />bar</p>', bot.getData( true ) );

			// Justify on.
			tc.assertCommandState( 2, 2, 2, 1, editor );
		} );
	},

	'test alignment commands with justifyClasses - one disallowed': function() {
		var tc = this;

		bender.editorBot.create( {
			name: 'editor_classes2',
			config: {
				justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
				plugins: 'justify,toolbar',
				// Note: alignRight is not allowed.
				allowedContent: 'p(alignLeft,alignCenter,alignJustify); img[src]',
				contentsCss: '_assets/styles.css'
			}
		}, function( bot ) {
			var editor = bot.editor;

			bot.setHtmlWithSelection( '<p>[<img src="http://tests/404"/>bar]</p>' );

			// Check commands state, left should be turned on, right disabled and the rest off.
			tc.assertCommandState( 1, 0, 2, 2, editor );

			// Align paragraph right;
			bot.execCommand( 'justifyright' );
			assert.areSame( '<p><img src="http://tests/404" />bar</p>', bot.getData( true ) );

			// Check commands state, left should be turned on, right disabled and the rest off.
			tc.assertCommandState( 1, 0, 2, 2, editor );

			// Align paragraph center;
			bot.execCommand( 'justifycenter' );
			assert.areSame( '<p class="aligncenter"><img src="http://tests/404" />bar</p>', bot.getData( true ) );

			// Check commands state, left should be turned on, right disabled and the rest off.
			tc.assertCommandState( 2, 0, 1, 2, editor );
		} );
	},

	'test alignment commands in br mode': function() {
		var tc = this;

		bender.editorBot.create( {
			name: 'editor_enter_br',
			config: {
				plugins: 'justify,toolbar',
				enterMode: CKEDITOR.ENTER_BR
			}
		}, function( bot ) {
			var editor = bot.editor;

			bot.setHtmlWithSelection( 'foo^bar<br />bom' );

			// None on.
			tc.assertCommandState( 2, 2, 2, 2, editor );

			// Align paragraph right;
			bot.execCommand( 'justifyright' );
			assert.areSame( '<div style="text-align:right;">foobar</div>bom', bot.getData( true ) );

			// Right on.
			tc.assertCommandState( 2, 1, 2, 2, editor );

			// Align paragraph center;
			bot.execCommand( 'justifyleft' );
			assert.areSame( '<div>foobar</div>bom', bot.getData( true ) );

			// None on.
			tc.assertCommandState( 1, 2, 2, 2, editor );

			assert.isTrue( editor.filter.check( 'div{text-align}' ), 'Check whether justify allows div in br mode' );
		} );
	},

	'test alignment commands in div mode and with justifyClasses': function() {
		var tc = this;

		bender.editorBot.create( {
			name: 'editor_enter_div',
			config: {
				plugins: 'justify,toolbar',
				enterMode: CKEDITOR.ENTER_DIV,
				justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
				contentsCss: '_assets/styles.css'
			}
		}, function( bot ) {
			var editor = bot.editor;

			bot.setHtmlWithSelection( '<div>foo^bar</div>' );

			// None on.
			tc.assertCommandState( 1, 2, 2, 2, editor );

			// Align paragraph right;
			bot.execCommand( 'justifyright' );
			assert.areSame( '<div class="alignright">foobar</div>', bot.getData( true ) );

			// Right on.
			tc.assertCommandState( 2, 1, 2, 2, editor );

			// Align paragraph center;
			bot.execCommand( 'justifyleft' );
			assert.areSame( '<div>foobar</div>', bot.getData( true ) );

			// None on.
			tc.assertCommandState( 1, 2, 2, 2, editor );
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

	// #455
	'test alignment on disabled elements paragraph': function() {
		var	tc = this;
		bender.editorBot.create( {
			name: 'editor_p_1',
			config: {
				plugins: 'justify,toolbar,wysiwygarea',
				allowedContent: 'p ul{text-align};li;'
			}
		}, function( bot ) {
			var editor = bot.editor;
			bot.setHtmlWithSelection( '<p>Foo</p><ul><li>on^e</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 0,0,0,0, editor );

			bot.setHtmlWithSelection( '<p>Fo^o</p><ul><li>one</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 1,2,2,2, editor );
		} );
	},

	// #455
	'test alignment on disabled elements paragraph (class)': function() {
		var	tc = this;
		bender.editorBot.create( {
			name: 'editor_p_1_class',
			config: {
				plugins: 'justify,toolbar,wysiwygarea',
				allowedContent: 'p ul(align*);li;',
				justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
				contentsCss: '_assets/styles.css'
			}
		}, function( bot ) {
			var editor = bot.editor;
			bot.setHtmlWithSelection( '<p>Foo</p><ul><li>on^e</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 0,0,0,0, editor );

			bot.setHtmlWithSelection( '<p>Fo^o</p><ul><li>one</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 1,2,2,2, editor );
		} );
	},

	// #455
	'test alignment on disabled elements div mode': function() {
		var tc = this;
		bender.editorBot.create( {
			name: 'editor_div_1',
			creator: 'inline',
			config: {
				plugins: 'justify,toolbar,divarea',
				allowedContent: 'div ul{text-align};li;',
				enterMode: CKEDITOR.ENTER_DIV
			}
		}, function( bot ) {
			var editor = bot.editor;
			bot.setHtmlWithSelection( '<div>Foo</div><ul><li>on^e</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 0,0,0,0, editor );

			bot.setHtmlWithSelection( '<div>F^oo</div><ul><li>one</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 1,2,2,2, editor );
		} );
	},

	// #455
	'test alignment on disabled elements div mode (class)': function() {
		var tc = this;
		bender.editorBot.create( {
			name: 'editor_div_1_class',
			creator: 'inline',
			config: {
				plugins: 'justify,toolbar,divarea',
				allowedContent: 'div ul(align*);li;',
				justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
				enterMode: CKEDITOR.ENTER_DIV
			}
		}, function( bot ) {
			var editor = bot.editor;
			bot.setHtmlWithSelection( '<div>Foo</div><ul><li>on^e</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 0,0,0,0, editor );

			bot.setHtmlWithSelection( '<div>F^oo</div><ul><li>one</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 1,2,2,2, editor );
		} );
	},

	// #455
	'test alignment on disabled elements br mode': function() {
		var tc = this;
		bender.editorBot.create( {
			name: 'editor_br_1',
			config: {
				plugins: 'justify,toolbar,divarea',
				allowedContent: 'div ul{text-align};li;',
				enterMode: CKEDITOR.ENTER_BR
			}
		}, function( bot ) {
			var editor = bot.editor;

			bot.setHtmlWithSelection( 'foo<ul><li>on^e</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 0,0,0,0, editor );

			bot.setHtmlWithSelection( 'f^oo<ul><li>one</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 2,2,2,2, editor );

			bot.execCommand( 'justifyblock' );
			tc.assertCommandState( 2,2,2,1, editor );

			assert.isInnerHtmlMatching( '<div style="text-align:justify;">foo</div><ul><li>one</li><li>two</li><li>three</li></ul>', bot.getData( true ) );
		} );
	},

	// #455
	'test alignment on disabled elements br mode (class)': function() {
		var tc = this;
		bender.editorBot.create( {
			name: 'editor_br_1_class',
			config: {
				plugins: 'justify,toolbar,divarea',
				allowedContent: 'div ul(align*);li;',
				justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
				enterMode: CKEDITOR.ENTER_BR
			}
		}, function( bot ) {
			var editor = bot.editor;
			bot.setHtmlWithSelection( 'foo<ul><li>on^e</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 0,0,0,0, editor );

			bot.setHtmlWithSelection( 'f^oo<ul><li>one</li><li>two</li><li>three</li></ul>' );
			tc.assertCommandState( 2,2,2,2, editor );

			bot.execCommand( 'justifyblock' );
			tc.assertCommandState( 2,2,2,1, editor );

			assert.isInnerHtmlMatching( '<div class="alignJustify">foo</div><ul><li>one</li><li>two</li><li>three</li></ul>', bot.getData() );
		} );
	},

	// #455
	'test alignment on multi-element non-collapsed selection': function() {
		var tc = this;
		bender.editorBot.create( {
			name: 'editor_p_2',
			config: {
				plugins: 'justify,toolbar,wysiwygarea',
				allowedContent: 'p ul{text-align};li;'
			}
		}, function( bot ) {
			var editor = bot.editor;

			bot.setHtmlWithSelection( '<p>F[oo</p><ul><li>one</li><li>two</li><li>three</li></ul><p>B]ar</p>' );
			tc.assertCommandState( 1,2,2,2, editor );

			bot.execCommand( 'justifycenter' );
			tc.assertCommandState( 2,2,1,2, editor );

			assert.areSame( '<p style="text-align:center;">foo</p><ul><li>one</li><li>two</li><li>three</li></ul><p style="text-align:center;">bar</p>', bot.getData( true ) );
		} );
	},

	// #455
	'test alignment on multi-element non-collapsed selection (class)': function() {
		var tc = this;
		bender.editorBot.create( {
			name: 'editor_p_2_class',
			config: {
				plugins: 'justify,toolbar,wysiwygarea',
				justifyClasses: [ 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify' ],
				contentsCss: '_assets/styles.css',
				allowedContent: 'p ul(align*);li;'
			}
		}, function( bot ) {
			var editor = bot.editor;

			bot.setHtmlWithSelection( '<p>f[oo</p><ul><li>one</li><li>two</li><li>three</li></ul><p>b]ar</p>' );
			tc.assertCommandState( 1,2,2,2, editor );

			bot.execCommand( 'justifycenter' );
			tc.assertCommandState( 2,2,1,2, editor );

			assert.areSame( '<p class="alignCenter">foo</p><ul><li>one</li><li>two</li><li>three</li></ul><p class="alignCenter">bar</p>', bot.getData() );
		} );
	},

	// #455
	'test alignment on multi-element with disallowContent': function() {
		var tc = this;
		bender.editorBot.create( {
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
		}, function( bot ) {
			var editor = bot.editor;

			bot.setHtmlWithSelection( '<p>fo[o</p><h1>bar</h1><p>foooos</p><h1>b]az</p>' );
			tc.assertCommandState( 1,2,2,2, editor );

			bot.execCommand( 'justifyright' );
			tc.assertCommandState( 2,1,2,2, editor );

			assert.areSame( '<p style="text-align:right;">foo</p><h1>bar</h1><p style="text-align:right;">foooos</p><h1>baz</h1>', bot.getData( true ) );
		} );
	},

	// #455
	'test alignment on multi-element with disallowContent (class)': function() {
		var tc = this;
		bender.editorBot.create( {
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
				contentsCss: '_assets/styles.css'
			}
		}, function( bot ) {
			var editor = bot.editor;

			bot.setHtmlWithSelection( '<p>fo[o</p><h1>bar</h1><p>foooos</p><h1>b]az</p>' );
			tc.assertCommandState( 1,2,2,2, editor );

			bot.execCommand( 'justifyright' );
			tc.assertCommandState( 2,1,2,2, editor );

			assert.areSame( '<p class="alignRight">foo</p><h1>bar</h1><p class="alignRight">foooos</p><h1>baz</h1>', bot.getData() );
		} );
	},

	// #455
	'test alignment div-type editor': function() {
		var tc = this;
		bender.editorBot.create( {
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
		}, function( bot ) {
			var editor = bot.editor;
			bot.setHtmlWithSelection( '<p>f[oo</p><h1>bar</h1><p>ba]z</p>' );
			tc.assertCommandState( 1,2,2,2, editor );

			bot.execCommand( 'justifycenter' );
			tc.assertCommandState( 2,2,1,2, editor );

			assert.areSame( '<p style="text-align:center;">foo</p><h1>bar</h1><p style="text-align:center;">baz</p>', bot.getData( true ) );
		} );
	},

	// #455
	'test alignment div-type editor (class)': function() {
		var tc = this;
		bender.editorBot.create( {
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
		}, function( bot ) {
			var editor = bot.editor;
			bot.setHtmlWithSelection( '<p>f[oo</p><h1>bar</h1><p>ba]z</p>' );
			tc.assertCommandState( 1,2,2,2, editor );

			bot.execCommand( 'justifycenter' );
			tc.assertCommandState( 2,2,1,2, editor );

			assert.areSame( '<p class="alignCenter">foo</p><h1>bar</h1><p class="alignCenter">baz</p>', bot.getData() );
		} );
	},

	// #455
	'test alignment on disabled elements block type under editable': function() {
		var	tc = this;
		bender.editorBot.create( {
			name: 'editor_div_3',
			config: {
				plugins: 'justify,toolbar,divarea',
				allowedContent: 'div{text-align};ul li;',
				enterMode: CKEDITOR.ENTER_BR
			}
		}, function( bot ) {
			var editor = bot.editor;
			bot.setData( 'Foo<br /><ul><li>one</li><li>two</li><li>three</li></ul>', function() {
				var editable = editor.editable();
				var range = new CKEDITOR.dom.range( editable );
				// Selection in such way to have sure that `ul` is set up as start and end node.
				range.selectNodeContents( editable.findOne( 'ul' ) );
				range.select();
				tc.assertCommandState( 0,0,0,0, editor );
			} );
		} );
	}
} );

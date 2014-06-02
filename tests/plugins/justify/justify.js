/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: justify,image,toolbar */

bender.editor = {
	config: { enterMode: CKEDITOR.ENTER_P },
	allowedForTests: 'img[align];span[contenteditable]'
};

bender.test(
{
	assertCommandState : function( left, right, center, justify, editor ) {
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
	'test aligment command on selected image' : function() {
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

	'test aligment command on selected image (align attribute)' : function() {
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
	'test aligment command on paragraph' : function() {
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
	}
} );
/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: bidi,justify,indent,table,div,toolbar */

bender.editor = { config : { enterMode : CKEDITOR.ENTER_P } };

bender.test(
{
	'test apply RTL' : function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<p>foo<br />bar</p><p>baz</p>]' );
		bot.execCommand( 'bidirtl' );
		assert.areSame( '<p dir="rtl">foo<br />bar</p><p dir="rtl">baz</p>', bot.getData( false, true ) );
	},

	'test apply RTL (list)' : function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<ul><li>item1</li><li>item2</li></ul>]' );
		bot.execCommand( 'bidirtl' );
		assert.areSame( '<ul dir="rtl"><li>item1</li><li>item2</li></ul>', bot.getData( false, true ) );
	},

	'test apply RTL (table)' : function() {
		var bot = this.editorBot;
		bender.tools.testInputOut( 'apply_rtl_table', function( source, expected ) {
			bot.setHtmlWithSelection( source );
			bot.execCommand( 'bidirtl' );
			assert.areSame( bender.tools.compatHtml( expected ), bot.getData( false, true ) );
		} );
	},

	'test apply LTR (table cell)' : function() {
		var bot = this.editorBot;
		bender.tools.testInputOut( 'apply_ltr_table', function( source, expected ) {
			bot.setHtmlWithSelection( source );
			bot.execCommand( 'bidiltr' );
			assert.areSame( bender.tools.compatHtml( expected ), bot.getData( false, true ) );
		} );
	},

	'test apply direction mirror contents style' : function() {
		var ed = this.editor, bot = this.editorBot;
		bender.tools.testInputOut( 'apply_dir_mirror', function( source, expected ) {
			bot.setHtmlWithSelection( source );

			var evtDir;
			ed.on( 'dirChanged', function( evt ) {
				evtDir = evt.data.dir;
			} );

			bot.execCommand( 'bidirtl' );
			assert.areSame( 'rtl', evtDir, 'check editor#dirChanged event fired on bidi command call' );
			assert.areSame( bender.tools.compatHtml( expected ), bot.getData( true ),
				'indentation/alignment styles should be mirrored on bidi commands' );
		} );
	},

	'test apply direction mirror contents style (2)': function() {
		var ed = this.editor, bot = this.editorBot;
		bender.tools.testInputOut( 'apply_dir_mirror_2', function( source, expected ) {
			bot.setHtmlWithSelection( source );

			var evtDir;
			ed.on( 'dirChanged', function( evt ) {
				evtDir = evt.data.dir;
			} );

			var div = ed.editable().getFirst();
			div.setAttribute( 'dir', 'ltr' );
			assert.areSame( 'ltr', evtDir, 'check editor#dirChanged event fired on dom element attr change.' );
			assert.areSame( bender.tools.compatHtml( expected ), bot.getData( true ),
				'indentation/alignment styles should be mirrored on "dir" attribute change from parent' );
		} );
	}
} );
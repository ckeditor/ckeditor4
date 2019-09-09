/* bender-tags: editor */
/* bender-ckeditor-plugins: list,justify,bidi,table,forms,toolbar */

// Use two editor instances as there are some issues on Edge 16+ when single instance is used.
bender.editors = {
	editor1: {
		config: {
			enterMode: CKEDITOR.ENTER_P
		},
		allowedForTests: 'li{margin-right}[type]; ul[lang]; ol{font-size}; dl dt dd'
	},
	editor2: {
		config: {
			enterMode: CKEDITOR.ENTER_P
		},
		allowedForTests: 'li{margin-right}[type]; ul[lang]; ol{font-size}; dl dt dd'
	}
};

bender.test( {
	supportForSelectFullList: function( editor ) {
		// With full selection, it will break inline in old IEs.
		return !( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE &&
			CKEDITOR.env.ie && CKEDITOR.env.version < 9 );
	},

	// Test list creation.
	'test apply list': function() {
		var bot = this.editorBots.editor1;

		bot.setHtmlWithSelection( '[<p>foo<br />bar</p><p>baz</p>]' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ol><li>foo</li><li>bar</li><li>baz</li></ol>', bot.getData( false, true ) );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<ul><li>foo</li><li>bar</li><li>baz</li></ul>', bot.getData( false, true ) );
	},

	// https://dev.ckeditor.com/ticket/3940
	'test create list in table': function() {
		var bot = this.editorBots.editor1;
		bender.tools.testInputOut( 'create_list_table', function( input, expected ) {
			bot.setHtmlWithSelection( input );
			bot.execCommand( 'numberedlist' );
			assert.areSame( bender.tools.compatHtml( expected ), bot.getData( false, true ) );
		} );
	},

	'test apply list ( with justify style)': function() {
		var bot = this.editorBots.editor1;

		bot.setHtmlWithSelection( '<p>[foo</p><p style="text-align:center;">bar</p><p style="text-align:right;">baz]</p>' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ol><li>foo</li><li style="text-align:center;">bar</li><li style="text-align:right;">baz</li></ol>', bot.getData( true ) );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<ul><li>foo</li><li style="text-align:center;">bar</li><li style="text-align:right;">baz</li></ul>', bot.getData( true ) );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<p>foo</p><p style="text-align:center;">bar</p><p style="text-align:right;">baz</p>', bot.getData( true ) );
	},

	'test apply list (with text direction)': function() {
		// Selection of rtl elements in IE8 is broken. Tested selection can't be achieved.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
			assert.ignore();
		}

		var bot = this.editorBots.editor1;

		bot.setHtmlWithSelection( '[<p dir="rtl">foo</p><p dir="rtl">bar</p><p dir="rtl">baz</p>]' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ol dir="rtl"><li>foo</li><li>bar</li><li>baz</li></ol>', bot.getData( true ) );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<ul dir="rtl"><li>foo</li><li>bar</li><li>baz</li></ul>', bot.getData( true ) );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<p dir="rtl">foo</p><p dir="rtl">bar</p><p dir="rtl">baz</p>', bot.getData( true ) );
	},

	// https://dev.ckeditor.com/ticket/7657
	'test apply list (with block styles)': function() {
		// Selection of rtl elements in IE8 is broken. Tested selection can't be achieved.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
			assert.ignore();
		}

		var bot = this.editorBots.editor1;

		bot.setHtmlWithSelection( '[<p dir="rtl">Item 1</p><p dir="rtl" style="margin-right: 40px;">Item 2</p><p dir="rtl" style="margin-right: 80px;">Item 3</p>]' );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<ul dir="rtl"><li>item 1</li><li style="margin-right:40px;">item 2</li><li style="margin-right:80px;">item 3</li></ul>', bot.getData( true ) );
	},

	// Test list removal.
	'test remove list': function() {
		var bot = this.editorBots.editor1;

		bot.setHtmlWithSelection( '<ol><li>^text</li></ol>' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<p>text</p>', bot.getData( false, true ) );

		// With full selection, it will break inline in old IEs.
		if ( this.supportForSelectFullList( bot.editor ) ) {
			bot.setHtmlWithSelection( '[<ol><li>text</li></ol>]' );
			bot.execCommand( 'numberedlist' );
			assert.areSame( '<p>text</p>', bot.getData( false, true ) );
		}

		// With nested list.
		bot.setHtmlWithSelection( '<ul><li>a<ol><li>^b<ul><li>c</li></ul></li></ol></li></ul>' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ul><li>a</li></ul><p>b</p><ul><li>c</li></ul>', bot.getData( false, true ) );
	},

	// (https://dev.ckeditor.com/ticket/6715)
	'test remove list (inside table)': function() {
		var bot = this.editorBots.editor1;
		bot.setHtmlWithSelection( '<table><tr><td><ol><li>[item 1</li><li>item 2]</li></ol></td></tr></table>' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<table><tbody><tr><td><p>item 1</p><p>item 2</p></td></tr></tbody></table>', bot.getData( false, true ) );
	},

	// (https://dev.ckeditor.com/ticket/7645)
	'test remove list (with input)': function() {
		var bot = this.editorBots.editor1;
		bot.setHtmlWithSelection( '<ol><li><input name="name" type="checkbox">[item1</li><li>item2]</li></ol>' );
		bot.execCommand( 'numberedlist' );
		assert.isMatching( /<p><input name="name" type="checkbox" (value="on" )?\/>item1<\/p><p>item2<\/p>/, bot.getData( true ) );
	},

	/**
	 *  Test merge newlist with previous list. (https://dev.ckeditor.com/ticket/3820)
	 */
	'test create list with merge': function() {
		var bot = this.editorBots.editor2;
		bot.setHtmlWithSelection( '<ul><li>bullet line 1</li><li>bullet line 2</li></ul><p>^second line</p>' );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<ul><li>bullet line 1</li><li>bullet line 2</li><li>second line</li></ul>', bot.getData( 1 ) );
	},

	/**
	 * Test switch list type with custom bullet attributes. (https://dev.ckeditor.com/ticket/4950)
	 */
	'test switch list type (with custom bullet)': function() {
		var bot = this.editorBots.editor2;
		bot.setHtmlWithSelection( '<ol><li type="square">[item1</li><li type="square">item2</li><li type="square">item3]</li></ol> ' );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<ul><li type="square">item1</li><li type="square">item2</li><li type="square">item3</li></ul>', bot.getData( 1 ) );
	},

	// https://dev.ckeditor.com/ticket/7290
	'test switch list type (inside definition list)': function() {
		var bot = this.editorBots.editor2;
		bender.tools.testInputOut( 'switch_list_dl', function( source, expected ) {
			bot.setHtmlWithSelection( source );
			bot.execCommand( 'numberedlist' );
			assert.areSame( bender.tools.compatHtml( expected ), bot.getData( false, true ) );

		} );
	},

	// https://dev.ckeditor.com/ticket/6059
	'test switch list type keeps text direction': function() {
		var bot = this.editorBots.editor2;
		bot.setHtmlWithSelection( '[<ol dir="rtl" lang="en"><li>line 1</li><li>line 2</li></ol>]' );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<ul dir="rtl" lang="en"><li>line 1</li><li>line 2</li></ul>', bot.getData( true ) );
	},

	// https://dev.ckeditor.com/ticket/8997
	'test change list type keep styles on sub list': function() {
		var bot = this.editorBots.editor2;

		if ( !this.supportForSelectFullList( bot.editor ) ) {
			assert.ignore();
		}
		bot.setHtmlWithSelection( '[<ul style="font-size:16px;"><li>foo<ul style="font-size:22px;"><li>bar</li></ul></li></ul>]' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ol style="font-size:16px;"><li>foo<ol style="font-size:22px;"><li>bar</li></ol></li></ol>', bot.getData( true ) );
	},

	'test create list with merge below (with direction)': function() {
		var bot = this.editorBots.editor2;

		// LTR
		bot.setHtmlWithSelection( '<p>^ltr</p><ol dir="rtl"><li>rtl</li></ol>' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ol dir="rtl"><li dir="ltr">ltr</li><li>rtl</li></ol>', bot.getData( false, true ) );

		// RTL
		bot.setHtmlWithSelection( '<p dir="rtl">^rtl</p><ol><li>ltr</li></ol>' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ol><li dir="rtl">rtl</li><li>ltr</li></ol>', bot.getData( false, true ) );
	},

	'test create list with merge above (with direction)': function() {
		var bot = this.editorBots.editor2;

		bot.setHtmlWithSelection( '<ol dir="rtl"><li>rtl</li></ol><p>^ltr</p>' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ol dir="rtl"><li>rtl</li><li dir="ltr">ltr</li></ol>', bot.getData( false, true ) );

		// RTL
		bot.setHtmlWithSelection( '<ol><li>ltr</li></ol><p dir="rtl">^rtl</p>' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ol><li>ltr</li><li dir="rtl">rtl</li></ol>', bot.getData( false, true ) );

		// LTR
		bot.setHtmlWithSelection( '<ol dir="rtl"><li>rtl</li></ol><p dir="ltr">^ltr</p>' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ol dir="rtl"><li>rtl</li><li dir="ltr">ltr</li></ol>', bot.getData( true ) );

	},

	'test single list type active inside of nested list': function() {
		var bot = this.editorBots.editor2, ed = bot.editor;
		bot.setHtmlWithSelection( '<ol><li>item1<ul><li>^item2</li></ul></li></ol>' );
		var nList = ed.getCommand( 'numberedlist' ), bList = ed.getCommand( 'bulletedlist' );
		assert.areSame( CKEDITOR.TRISTATE_OFF, nList.state, 'check numbered list inactive' );
		assert.areSame( CKEDITOR.TRISTATE_ON, bList.state, 'check bulleted list active' );

	},

	'test inactive when list is out of block limit': function() {
		var bot = this.editorBots.editor2, ed = bot.editor;
		bot.setHtmlWithSelection( '<ul><li><table><tr><td>^foo</td></tr></table></li></ul>' );
		var bList = ed.getCommand( 'bulletedlist' );
		assert.areSame( CKEDITOR.TRISTATE_OFF, bList.state, 'check numbered list inactive' );
	},

	// #2721
	'test sublist order after removing higher order sublist': function() {
		var bot = this.editorBots.editor1,
			editor = bot.editor;

		bot.setHtmlWithSelection( '<ol><li>test<ol><li>^<ol><li>a</li><li>b</li><li>c</li></ol></li></ol></li></ol>' );
		editor.fire( 'key', {
			domEvent: new CKEDITOR.dom.event( { keyCode: 8 } )
		} );

		assert.areSame( '<ol><li>test<ol><li>a</li><li>b</li><li>c</li></ol></li></ol>', bender.tools.compatHtml( editor.getData() ) );
	}
} );

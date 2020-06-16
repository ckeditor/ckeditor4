/* bender-tags: editor */
/* bender-ckeditor-remove-plugins: tableselection */

bender.editor = {
	config: {
		autoParagraph: false,
		allowedContent: true
	}
};

var DEL = 46,
	BACKSPACE = 8;

bender.test( {
	assertKeystroke: function( key, keyModifiers, input, output, msg ) {
		var ed = this.editor, bot = this.editorBot;

		bot.setHtmlWithSelection( input );

		var match = output.match( /\((no change|not handled)\)/ );
		output = match ? ed.dataProcessor.toDataFormat( input ) : output;

		var keyHandled = true;
		ed.on( 'key', function() {
			keyHandled = false;
		}, false, false, 1000 );

		ed.editable().fire( 'keydown', new CKEDITOR.dom.event( {
			keyCode: key,
			ctrlKey: keyModifiers & CKEDITOR.CTRL,
			shiftKey: keyModifiers & CKEDITOR.SHIFT
		} ) );

		// Assert Key blocked.
		var notHandled = match && match[ 1 ] == 'not handled';
		assert[ notHandled ? 'isFalse' : 'isTrue' ](
			keyHandled,
			msg + ' - ' + ( notHandled ? 'keystroke should be left unhandled' : 'keystroke should be handled' )
		);

		assert.areSame( output, bender.tools.getHtmlWithSelection( ed ), msg );
	},

	'test handle del/backspace at the boundary of table cell': function() {
		this.assertKeystroke( DEL, 0,
		'<table><tbody><tr><td>foo^</td><td>bar</td></tr></tbody></table>' ,
		'<table><tbody><tr><td>foo^</td><td>bar</td></tr></tbody></table>', 'del doesn\'t change the selection' );

		this.assertKeystroke( DEL, 0,
		'<table><tbody><tr><td>foo</td><td>bar^</td></tr></tbody></table>text' ,
		'<table><tbody><tr><td>foo</td><td>bar</td></tr></tbody></table>^text', 'del moves selection after the table' );

		this.assertKeystroke( BACKSPACE, 0,
		'<table><tbody><tr><td>foo</td><td>^bar</td></tr></tbody></table>' ,
		'<table><tbody><tr><td>foo</td><td>^bar</td></tr></tbody></table>', 'backspace del doesn\'t change the selection' );

		this.assertKeystroke( DEL, 0,
		'<table><tbody><tr><td>^foo</td><td>bar</td></tr></tbody></table>' ,
		'(not handled)', 'del not handled' );

		this.assertKeystroke( BACKSPACE, 0,
		'<table><tbody><tr><td>foo^</td><td>bar</td></tr></tbody></table>' ,
		'(not handled)', 'backspace not handled' );

		// Make sure that the modifiers are ignored.
		// https://dev.ckeditor.com/ticket/11861#comment:13

		this.assertKeystroke( DEL, CKEDITOR.SHIFT,
		'<table><tbody><tr><td>foo^</td><td>bar</td></tr></tbody></table>' ,
		'<table><tbody><tr><td>foo^</td><td>bar</td></tr></tbody></table>', 'del doesn\'t change the selection - SHIFT' );

		this.assertKeystroke( BACKSPACE, CKEDITOR.CTRL,
		'<table><tbody><tr><td>foo</td><td>^bar</td></tr></tbody></table>' ,
		'<table><tbody><tr><td>foo</td><td>^bar</td></tr></tbody></table>', 'backspace del doesn\'t change the selection - CTRL' );
	},

	'test handle del with full table content selected': function() {
		// Table cell text selected.
		this.assertKeystroke( DEL, 0,
		'<table><tbody><tr><td>[foo]</td></tr></tbody></table>' ,
		'^', 'table a1' );
		this.assertKeystroke( DEL, 0,
		'<table><tbody><tr><td>[foo</td><td>bar]</td></tr></tbody></table>' ,
		'^', 'table a2' );
		this.assertKeystroke( DEL, 0,
		'<table><tbody><tr><td>[foo</td></tr><tr><td>bar]</td></tr></tbody></table>' ,
		'^', 'table a3' );
		this.assertKeystroke( DEL, 0,
		'<table><tbody><tr><td>[foo</td></tr><tr><td>bar]</td></tr></tbody></table>' ,
		'^', 'table a4' );

		// Text selection enclosed in text block and inlines.
		this.assertKeystroke( DEL, 0,
		'<table><tbody><tr><td><p>[foo]</p></td></tr></tbody></table>' ,
		'^', 'table b1' );
		this.assertKeystroke( DEL, 0,
		'<table><tbody><tr><td><p><b><i>[foo]</i></b></p></td></tr></tbody></table>' ,
		'^', 'table b2' );

		// Adverse tests.
		this.assertKeystroke( DEL, 0,
		'<table><tbody><tr><td>[foo]bar</td></tr></tbody></table>' ,
		'(not handled)', 'table r1' );

		// Make sure that the modifiers are ignored.
		// https://dev.ckeditor.com/ticket/11861#comment:13
		this.assertKeystroke( DEL, CKEDITOR.CTRL,
		'<table><tbody><tr><td>[foo]</td></tr></tbody></table>' ,
		'^', 'table a1 - CTRL' );
	},

	'test handle del with full list content selected': function() {
		// List item text selected.
		this.assertKeystroke( DEL, 0, '<ul><li>[foo]</li></ul>' , '^', 'list a1' );
		this.assertKeystroke( DEL, 0, '<ul><li>[foo</li><li>bar]</li></ul>' , '^', 'list a2' );
		this.assertKeystroke( DEL, 0, '<ul><li>[foo</li><li>bar]</li></ul>' , '^', 'list a3' );

		// Text selection enclosed in text block and inlines.
		this.assertKeystroke( DEL, 0, '<ul><li><p>[foo</p></li><li><p>bar]</p></li></ul>' , '^', 'list b1' );
		this.assertKeystroke( DEL, 0, '<ul><li><p><b><i>[foo]</i></b></p></li></ul>' , '^', 'list b2' );

		// Adverse tests.
		this.assertKeystroke( DEL, 0, '<ul><li><img />[foo]</li></ul>' , '(not handled)', 'list r1' );

		// Make sure that the modifiers are ignored.
		// https://dev.ckeditor.com/ticket/11861#comment:13
		this.assertKeystroke( DEL, CKEDITOR.CTRL, '<ul><li>[foo]</li></ul>' , '^', 'list a1 - CTRL' );
	},

	// https://dev.ckeditor.com/ticket/10646
	'test handle del with full nested list content selected': function() {
		// A content in a parent list: before selected.
		this.assertKeystroke( DEL, 0, '<ul><li>x<ul><li>[foo]</li></ul></li></ul>', '<ul><li>x^</li></ul>', 'list 1' );

		// A content in a parent list: after selected.
		this.assertKeystroke( DEL, 0, '<ul><li><ul><li>[foo]</li></ul>x</li></ul>', '<ul><li>^x</li></ul>', 'list 2' );

		// No content in a parent list.
		this.assertKeystroke( DEL, 0, '<ul><li><ul><li>[foo]</li></ul></li></ul>', '^', 'list 3' );
	},

	// https://dev.ckeditor.com/ticket/10646
	'test handle del with full nested table content selected': function() {
		// A content in a parent table: before selected.
		this.assertKeystroke( DEL, 0, '<table><tbody><tr><td>x<table><tbody><tr><td>[foo]</td></tr></tbody></table></td></tr></tbody></table>',
			'<table><tbody><tr><td>x^</td></tr></tbody></table>', 'table 1' );

		// A content in a parent table: after selected.
		this.assertKeystroke( DEL, 0, '<table><tbody><tr><td><table><tbody><tr><td>[foo]</td></tr></tbody></table>x</td></tr></tbody></table>',
			'<table><tbody><tr><td>^x</td></tr></tbody></table>', 'table 2' );

		// No content in a parent table.
		this.assertKeystroke( DEL, 0, '<table><tbody><tr><td><table><tbody><tr><td>[foo]</td></tr></tbody></table></td></tr></tbody></table>',
			'^', 'table 3' );
	},

	// https://dev.ckeditor.com/ticket/10646
	'test handle del with full nested table content selected within a list': function() {
		// A content in a parent list: before selected.
		this.assertKeystroke( DEL, 0, '<ul><li>x<table><tbody><tr><td>[foo]</td></tr></tbody></table></li></ul>',
			'<ul><li>x^</li></ul>', 'table 1' );

		// A content in a parent list: after selected.
		this.assertKeystroke( DEL, 0, '<ul><li><table><tbody><tr><td>[foo]</td></tr></tbody></table>x</li></ul>',
			'<ul><li>^x</li></ul>', 'table 2' );

		// No content in a parent list.
		this.assertKeystroke( DEL, 0, '<ul><li><table><tbody><tr><td>[foo]</td></tr></tbody></table></li></ul>',
			'^', 'table 3' );
	},

	// https://dev.ckeditor.com/ticket/13096
	'test deleting text without selection with DEL key': function() {
		var editor = this.editor,
			bot = this.editorBot;
		editor.focus();

		bot.setHtmlWithSelection( '<p>^Foo</p>' );
		editor.getSelection().removeAllRanges();
		editor.fire( 'key', {
			domEvent: {
				getKey: function() {
					return DEL;
				}
			}
		} );
		assert.pass();
	},

	'test deleting text without selection with BACKSPACE key': function() {
		var editor = this.editor,
			bot = this.editorBot;

		editor.focus();
		bot.setHtmlWithSelection( '<p>^Foo</p>' );
		editor.getSelection().removeAllRanges();
		editor.fire( 'key', {
			domEvent: {
				getKey: function() {
					return BACKSPACE;
				}
			}
		} );
		assert.pass();
	}

} );

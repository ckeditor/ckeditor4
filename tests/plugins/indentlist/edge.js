/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: list,indentlist */

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P,
		allowedContent: true, // Disable filter.
		removePlugins: 'indentblock' // For the build mode.
	}
};

var tests = {};

// #12141
// { indentBlock: false, hasParagraph: false, caretAtFirst: true }
addTests( 'test indent does nothing when items are not wrapped in paragraph and caret is in the first one', 'indent', [
	[ '<ul><li>f^oo</li><li>bar</li></ul>', '<ul><li>foo</li><li>bar</li></ul>' ]
] );

// #12141
// { indentBlock: false, hasParagraph: false, caretAtFirst: false }
addTests( 'test indent does not remove second list item when items are not wrapped in paragraph and caret is in the second one', 'indent', [
	[ '<ul><li>foo</li><li>b^ar</li></ul>', '<ul><li>foo<ul><li>bar</li></ul></li></ul>' ]
] );

// #12141
// { indentBlock: false, hasParagraph: true, caretAtFirst: true }
addTests( 'test indent does not make changes when items are wrapped in paragraph and caret is in the first one', 'indent', [
	[ '<ul><li><p>f^oo</p></li><li><p>bar</p></li></ul>', '<ul><li><p>foo</p></li><li><p>bar</p></li></ul>' ]
] );

// #12141
// { indentBlock: false, hasParagraph: true, caretAtFirst: false }
addTests( 'test indent nests list when items are wrapped in paragraph and caret is in the second one', 'indent', [
	[ '<ul><li><p>foo</p></li><li><p>b^ar</p></li></ul>', '<ul><li><p>foo</p><ul><li><p>bar</p></li></ul></li></ul>' ]
] );

// ### Finished adding tests.

function addTests( title, command, testsToAdd ) {
	for ( var i = 0 ; i < testsToAdd.length ; i++ ) {
		var testTitle = title + ( testsToAdd.length > 1 ? ' [' + i + ']' : '' );
		add( testTitle, command, testsToAdd[ i ][ 0 ], testsToAdd[ i ][ 1 ] );
	}

	function add( title, command, input, output ) {
		tests[ testTitle ] = function() {
			var bot = this.editorBot;
			bot.setHtmlWithSelection( input );
			bot.execCommand( command );
			assert.areSame( output, bot.getData( true, true ) );
		};
	}
}

bender.test( tests );
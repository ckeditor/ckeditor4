/* bender-tags: editor */
/* bender-ckeditor-plugins: entities, enterkey */

var INITIALCONTENT_P = '<p><b><i>foo^</i></b></p>',
	INITIALCONTENT_DIV = '<div><b><i>foo^</i></b></div>',
	INITIALCONTENT_BR = '<b><i>foo^</i></b>',
	KEY_BACKSPACE = 8

bender.editors = {
	editorP: {
		name: 'editorP',
		config: {
			enterMode: CKEDITOR.ENTER_P,
			allowedContent: true,
		},
	},

	editorDiv: {
		name: 'editorDiv',
		config: {
			enterMode: CKEDITOR.ENTER_DIV,
			allowedContent: true,
		},
	},

	editorBr: {
		name: 'editorBr',
		config: {
			enterMode: CKEDITOR.ENTER_BR,
			allowedContent: true,
		},
	},
};

bender.test( {
	_should: {
		ignore: {
			// Backspace is not handled by the editor itself in BR mode, so it cannot be simulated
			'test enter key twice then select backspace with BR mode': true
		}
	},

	// https://github.com/ckeditor/ckeditor4/issues/4626: Selecting an empty line after pressing enter twice loses the formatting
	'test enter key twice then select empty line with P mode': doubleEnter( 'editorP', INITIALCONTENT_P, selectElement( secondLineInBlockMode ), '<p><b><i>foo</i></b></p><p><b><i>bar</i></b></p><p>&nbsp;</p>' ),
	'test enter key twice then select empty line with DIV mode': doubleEnter( 'editorDiv', INITIALCONTENT_DIV, selectElement( secondLineInBlockMode ), '<div><b><i>foo</i></b></div><div><b><i>bar</i></b></div><div>&nbsp;</div>' ),
	'test enter key twice then select empty line with BR mode': doubleEnter( 'editorBr', INITIALCONTENT_BR, selectElement( secondLineInBrMode ), '<b><i>foo<br />bar</i></b><br />&nbsp;' ),
	'test enter key twice then select backspace with P mode': doubleEnter( 'editorP', INITIALCONTENT_P, pressBackspace( ), '<p><b><i>foo</i></b></p><p><b><i>bar</i></b></p>' ),
	'test enter key twice then select backspace with DIV mode': doubleEnter( 'editorDiv', INITIALCONTENT_DIV, pressBackspace( ), '<div><b><i>foo</i></b></div><div><b><i>bar</i></b></div>' ),
	'test enter key twice then select backspace with BR mode': doubleEnter( 'editorBr', INITIALCONTENT_BR, pressBackspace( ), '<b><i>foo<br />bar</i></b>' ),
} );

function doubleEnter( editorName, initialContent, afterDoubleEnter, expectedContent ) {
	return function() {
		// The bogus should be in the right place for empty lines, otherwise the selection will be
		// outside the formatted range.
		var bot = this.editorBots[ editorName ],
			editor = bot.editor;

		bot.setHtmlWithSelection( initialContent );
		bot.execCommand( 'enter' );
		bot.execCommand( 'enter' );

		afterDoubleEnter( editor );

		editor.insertText( 'bar' );

		assert.areSame(
			expectedContent,
			bot.getData( false, true )
		);
	};
}

function secondLineInBlockMode( editable ) {
	// Using block enter mode, second child is the second line
	return editable.getChild( 1 );
}

function secondLineInBrMode( editable ) {
	// Using BR enter mode, third child inside <b><i> is the second line [ #text, <br />, #text, <br /> #text ]
	return editable.getChild( 0 ).getChild( 0 ).getChild( 2 );
}

function selectElement( elementSelector ) {
	return function( editor ) {
		var selectionAtTheEndOfEmptyLine = new CKEDITOR.dom.range(
			editor.document
		);

		selectionAtTheEndOfEmptyLine.moveToElementEditablePosition(
			elementSelector( editor.editable() ),
			true
		);
		editor.getSelection().selectRanges( [ selectionAtTheEndOfEmptyLine ] );
	};
}

function pressBackspace( ) {
	return function( editor ) {
		editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: KEY_BACKSPACE } ) );
	};
}

/* bender-tags: editor,unit */

CKEDITOR.replaceClass = 'ckeditor';
bender.editor = true;

var keyCombo1 = CKEDITOR.CTRL + 10,
	keyCombo2 = CKEDITOR.ALT + 20,
	command1 = 'command#1',
	command2 = 'command#2';

function clearStrokes( keystrokes ) {
	delete keystrokes[ keyCombo1 ];
	delete keystrokes[ keyCombo2 ];
}

bender.test(
{
	'test keystroke assignment': function() {
		var editor = this.editor,
			keystrokes = editor.keystrokeHandler.keystrokes;

		clearStrokes( keystrokes );

		editor.setKeystroke( keyCombo1, command1 );
		assert.areEqual( command1, keystrokes[ keyCombo1 ] );
	},

	'test keystroke array assignment': function() {
		var editor = this.editor,
			keystrokes = editor.keystrokeHandler.keystrokes;

		clearStrokes( keystrokes );

		editor.setKeystroke(
		[
			[ keyCombo1, command1 ],
			[ keyCombo2, command2 ]
		] );

		assert.areEqual( command1, keystrokes[ keyCombo1 ] );
		assert.areEqual( command2, keystrokes[ keyCombo2 ] );
	},

	'test editor#key event': function() {
		var fired = 0,
			evtData = null;

		this.editor.on( 'key', function( evt ) {
			fired += 1;
			evtData = evt.data;
		} );

		this.editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
			keyCode: 66,
			ctrlKey: true,
			shiftKey: true
		} ) );

		assert.areSame( 1, fired, 'editor#key has been fired once' );
		assert.areSame( CKEDITOR.CTRL + CKEDITOR.SHIFT + 66, evtData.keyCode, 'keyCode' );
		assert.isInstanceOf( CKEDITOR.dom.event, evtData.domEvent, 'domEvent' );
		assert.areSame( 66, evtData.domEvent.getKey(), 'domEvent.getKey()' );
	}
} );
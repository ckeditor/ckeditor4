/* bender-tags: editor */

CKEDITOR.replaceClass = 'ckeditor';
bender.editor = true;

var keyCombo1 = CKEDITOR.CTRL + 10,
	keyCombo2 = CKEDITOR.ALT + 20,
	keyCombo3 = CKEDITOR.SHIFT + CKEDITOR.ALT + 30,
	command1 = 'command#1',
	command2 = 'command#2',
	command3 = 'command#3WithCapitalLetters';


bender.test(
{
	setUp: function() {
		var keystrokes = this.editor.keystrokeHandler.keystrokes,
			commands = this.editor.commands;

		delete keystrokes[ keyCombo1 ];
		delete keystrokes[ keyCombo2 ];
		delete commands[ command1 ];
		delete commands[ command2 ];

		this.editor.addCommand( 'command_with_keystrokes', {
			exec: function() {}
		} );

		this.editor.addCommand( 'command_with_fake_keystrokes', {
			exec: function() {},
			fakeKeystroke: 77
		} );

		this.editor.setKeystroke( 75, 'command_with_keystrokes' );
		this.editor.setKeystroke( 76, 'command_with_keystrokes' );

		this.editor.addCommand( 'command_without_keystrokes', {
			exec: function() {}
		} );
	},

	'test getCommandKeystroke': function() {
		assert.isNull( this.editor.getCommandKeystroke( 'command_without_keystrokes' ), 'Command without keystroke' );
		assert.areEqual( 75, this.editor.getCommandKeystroke( 'command_with_keystrokes' ), 'Command with keystroke.' );
	},

	// (#2493)
	'test getCommandKeystroke multiple keystrokes': function() {
		arrayAssert.isEmpty( this.editor.getCommandKeystroke( 'command_without_keystrokes', true ), 'Command without keystrokes.' );
		arrayAssert.itemsAreEqual( [ 75, 76 ], this.editor.getCommandKeystroke( 'command_with_keystrokes', true ), 'Command with keystrokes.' );
	},

	'test getCommandKeystroke in commands with fake keystrokes': function() {
		assert.areSame( 77, this.editor.getCommandKeystroke( 'command_with_fake_keystrokes' ), 'Single keystroke result.' );

		// (#2493)
		var ret = this.editor.getCommandKeystroke( 'command_with_fake_keystrokes', true );
		assert.isInstanceOf( Array, ret, 'Return type.' );
		arrayAssert.itemsAreEqual( [ 77 ], ret, 'Multiple keystrokes result.' );
	},

	'test keystroke assignment': function() {
		var editor = this.editor,
			keystrokes = editor.keystrokeHandler.keystrokes,
			keystroke;

		editor.addCommand( command1, {} );
		editor.setKeystroke( keyCombo1, command1 );

		assert.areEqual( command1, keystrokes[ keyCombo1 ] );

		// Get by command instance.
		keystroke = editor.getCommandKeystroke( editor.getCommand( command1 ) );
		assert.areEqual( keyCombo1, keystroke, 'Keystrokes should be equal (command).' );

		// Get by command name.
		keystroke = editor.getCommandKeystroke( command1 );
		assert.areEqual( keyCombo1, keystroke, 'Keystrokes should be equal (command name).' );
	},

	'test keystroke array assignment': function() {
		var editor = this.editor,
			keystrokes = editor.keystrokeHandler.keystrokes,
			keystroke1,
			keystroke2;

		editor.addCommand( command1, {} );
		editor.addCommand( command2, {} );

		editor.setKeystroke(
		[
			[ keyCombo1, command1 ],
			[ keyCombo2, command2 ]
		] );

		assert.areEqual( command1, keystrokes[ keyCombo1 ] );
		assert.areEqual( command2, keystrokes[ keyCombo2 ] );

		// Get by command instance.
		keystroke1 = editor.getCommandKeystroke( editor.getCommand( command1 ) );
		keystroke2 = editor.getCommandKeystroke( editor.getCommand( command2 ) );
		assert.areEqual( keyCombo1, keystroke1, 'Keystrokes should be equal (command).' );
		assert.areEqual( keyCombo2, keystroke2, 'Keystrokes should be equal (command).' );

		// Get by command name.
		keystroke1 = editor.getCommandKeystroke( command1 );
		keystroke2 = editor.getCommandKeystroke( command2 );
		assert.areEqual( keyCombo1, keystroke1, 'Keystrokes should be equal (command name).' );
		assert.areEqual( keyCombo2, keystroke2, 'Keystrokes should be equal (command name).' );
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
	},

	'test editor#getCommandKeystroke with empty name': function() {
		var editor = this.editor;
		assert.isNull( editor.getCommandKeystroke( '' ), 'Returned keystroke.' );
	},

	// #523
	'test keystroke with capital letters': function() {
		var editor = this.editor,
			keystrokes = editor.keystrokeHandler.keystrokes,
			keystroke;

		editor.addCommand( command3, {} );
		editor.setKeystroke( keyCombo3, command3 );

		assert.areEqual( command3, keystrokes[ keyCombo3 ] );

		// Get by command instance.
		keystroke = editor.getCommandKeystroke( editor.getCommand( command3 ) );
		assert.areEqual( keyCombo3, keystroke, 'Keystrokes should be equal (command).' );

		// Get by command name.
		keystroke = editor.getCommandKeystroke( command3 );
		assert.areEqual( keyCombo3, keystroke, 'Keystrokes should be equal (command name).' );
	}

} );

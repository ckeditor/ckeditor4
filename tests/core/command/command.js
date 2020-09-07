/* bender-tags: editor */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: basicstyles,bidi,blockquote,button,clipboard,colorbutton,dialog,div,docprops,elementspath,find,flash,font,format,forms,horizontalrule,iframe,iframedialog,image,indent,justify,link,list,listblock,maximize,newpage,pagebreak,pastefromword,pastetext,placeholder,preview,print,removeformat,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,table,templates,toolbar,uicolor,undo */
// jscs:enable maximumLineLength

// This list of commands are to be maintained whenever new commands are added.
var READ_ONLY_CMDS = [
	'a11yHelp', 'autogrow', 'about', 'contextMenu', 'copy', 'elementsPathFocus', 'find', 'maximize',
	'preview', 'print', 'showblocks', 'showborders', 'source', 'toolbarCollapse', 'toolbarFocus', 'selectAll', 'exportPdf'
];

function assertCommand( editor, cmd, commandDefinition ) {
	// Register command from command instance.
	editor.addCommand( 'cmd1', cmd );

	// Register command from command definition.
	editor.addCommand( 'cmd2', commandDefinition );

	// Registered command should be same as the command that was passed as definition.
	assert.areSame( editor.getCommand( 'cmd1' ), cmd );

	// Registered command should't be same to another command with same definition.
	assert.areNotSame( editor.getCommand( 'cmd2' ), cmd );
}

bender.editor = true;

bender.test( {
	checkAllCmds: function( fn ) {
		var cmd, cmds = this.editor.commands;
		for ( var name in cmds ) {
			cmd = cmds[ name ];
			fn( cmd, name );
		}
	},

	'test "contextSensitive" property': function() {
		var ed = this.editor;
		var cmd = ed.addCommand( 'test_context_sensitive', {
			contextSensitive: true,
			refresh: function( editor, path ) {
				assert.isTrue( path.lastElement.is( 'strong' ) );
				this.setState( CKEDITOR.TRISTATE_ON );
			}
		} );

		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p><strong>^</strong></p>' );
		assert.areSame( cmd.state, CKEDITOR.TRISTATE_ON );

		// We don't want this to be executed in successive tests
		// since they use the same editor (https://dev.ckeditor.com/ticket/9848).
		delete ed.commands.test_context_sensitive;
	},

	// https://dev.ckeditor.com/ticket/8342
	'test command states with readonly editor': function() {
		var bot = this.editorBot, editor = bot.editor;
		editor.setReadOnly( true );
		bot.setHtmlWithSelection( '<p>[foo]</p>' );

		this.checkAllCmds( function( cmd, name ) {
			if ( cmd.state != CKEDITOR.TRISTATE_DISABLED && CKEDITOR.tools.indexOf( READ_ONLY_CMDS, name ) == -1 )
				assert.fail( 'command: ' + name + ' should be disabled in readonly' );
		} );

		assert.isTrue( true );
		editor.setReadOnly( false );
	},

	'test command states in details>summary': function() {
		// <summary> is blocklimit (can't be split) and doesn't accept block content.
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<details><summary>foo^bar</summary></details>' );

		this.checkAllCmds( function( cmd, name ) {
			if ( cmd.state != CKEDITOR.TRISTATE_DISABLED && cmd.context in CKEDITOR.dtd.$block )
				assert.fail( 'command: ' + name + ' should be disabled inside of summary' );
		} );

		assert.isTrue( true );
	},

	'test command state integration with ACF - custom config': function() {
		var cmd1, cmd2, cmd3, cmd4,
			exec1 = 0,
			exec2 = 0,
			changedState1 = [];

		bender.editorBot.create( {
			name: 'test_editor_acf',
			config: {
				allowedContent: 'p b i',
				on: {
					loaded: function( evt ) {
						var editor = evt.editor;

						resume( function() {
							cmd1 = editor.addCommand( 'acftest1', {
								exec: function() {
									exec1++;
								},
								requiredContent: 'b'
							} );
							cmd2 = editor.addCommand( 'acftest2', {
								exec: function() {
									exec2++;
								},
								requiredContent: 'x'
							} );
							cmd3 = editor.addCommand( 'acftest3', {
								exec: function() {},
								requiredContent: 'i'
							} );

							// Overwrite the enable, disable, setState methods, to count how many times command was updated.
							var oldEnable = cmd1.enable,
								oldDisable = cmd1.disable,
								oldSetState = cmd1.setState;
							cmd1.enable = function() {
								changedState1.push( 'enable' );
								oldEnable.call( this );
							};
							cmd1.disable = function() {
								changedState1.push( 'disable' );
								oldDisable.call( this );
							};
							cmd1.setState = function( newState ) {
								changedState1.push( 'setState' );
								oldSetState.call( this, newState );
							};

							assert.areSame( CKEDITOR.TRISTATE_DISABLED, cmd1.state, 'initial cmd1.state' );
							assert.areSame( CKEDITOR.TRISTATE_DISABLED, cmd2.state, 'initial cmd2.state' );
							assert.areSame( CKEDITOR.TRISTATE_DISABLED, cmd3.state, 'initial cmd3.state' );

							cmd3.enable();
							assert.areSame( CKEDITOR.TRISTATE_OFF, cmd3.state, 'after enable() cmd3.state' );

							wait();
						} );

						// Add with low priority, so mode listener which refreshes commands
						// is executed first.
						editor.on( 'mode', function() {
							// Cache states now, because resume() executes listener with a delay ;|.
							var st1 = cmd1.state,
								st2 = cmd2.state,
								st3 = cmd3.state;

							// https://dev.ckeditor.com/ticket/10103 Before this test was created commands were refreshed on #mode, but not on #instanceReady.
							// So cmd4 wouldn't be refreshed because this listener will be executed after that
							// refreshing commands.
							cmd4 = editor.addCommand( 'acftest4', {
								exec: function() {}
							} );

							resume( function() {
								// https://dev.ckeditor.com/ticket/10249 Commands should be updated on first 'mode' event, so they are ready
								// on 'instanceReady'.
								assert.areSame( CKEDITOR.TRISTATE_OFF, st1, 'first "mode" cmd1.state' );
								assert.areSame( CKEDITOR.TRISTATE_DISABLED, st2, 'first "mode" cmd2.state' );
								assert.areSame( CKEDITOR.TRISTATE_OFF, st3, 'first "mode" cmd3.state' );

								wait();
							} );
						}, null, null, 100 );
					}
				}
			}
		}, function( bot ) {
			var editor = bot.editor;

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd1.state, 'ready cmd1.state' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cmd2.state, 'ready cmd2.state' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd3.state, 'ready cmd3.state' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd4.state, 'ready cmd4.state' );
			// Note: enable() executes setState(), so both should be logged.
			assert.areSame( 'enable,setState', changedState1.join( ',' ), 'cmd1.state was changed once during initialization' );

			cmd1.refresh( editor, editor.elementPath() );
			cmd2.refresh( editor, editor.elementPath() );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd1.state, 'refreshed cmd1.state' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cmd2.state, 'refreshed cmd2.state' );

			assert.isTrue( cmd1.exec() );
			assert.isFalse( cmd2.exec() );

			assert.areSame( 1, exec1 );
			assert.areSame( 0, exec2 );

			cmd2.enable();
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cmd2.state, 'after enable() cmd2.state' );
			cmd2.disable();
			cmd2.enable();
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cmd2.state, 'after disable()&enable() cmd2.state' );

			cmd1.disable();
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cmd1.state, 'after disable() cmd1.state' );
			cmd1.enable();
			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd1.state, 'after enable() cmd1.state' );

			var cmd5 = editor.addCommand( 'acftest5', {
				exec: function() {}
			} );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd5.state, 'command added after instanceReady is refreshed automatically' );
		} );
	},

	'test command state integration with ACF - default config': function() {
		bender.editorBot.create( {
			name: 'test_editor_acf2'
		}, function( bot ) {
			var editor = bot.editor,
				cmd1, cmd2,
				exec1 = 0,
				exec2 = 0;

			cmd1 = editor.addCommand( 'acftest1', {
				exec: function() {
					exec1++;
				},
				requiredContent: 'p',
				allowedContent: 'b'
			} );
			cmd2 = editor.addCommand( 'acftest2', {
				exec: function() {
					exec2++;
				},
				requiredContent: 'i',
				allowedContent: 'i'
			} );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd1.state, 'initial cmd1.state' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd2.state, 'initial cmd2.state' );

			cmd1.refresh( editor, editor.elementPath() );
			cmd2.refresh( editor, editor.elementPath() );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd1.state, 'refreshed cmd1.state' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd2.state, 'refreshed cmd2.state' );

			assert.isTrue( cmd1.exec() );
			assert.isTrue( cmd2.exec() );

			assert.areSame( 1, exec1 );
			assert.areSame( 1, exec2 );

			assert.isTrue( editor.filter.check( 'b' ) );
			assert.isTrue( editor.filter.check( 'i' ) );

			cmd1.disable();
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cmd1.state, 'after disable() cmd1.state' );
			cmd1.enable();
			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd1.state, 'after enable() cmd1.state' );
		} );
	},

	'test checkAllowed': function() {
		var editor = this.editor,
			cmd = editor.addCommand( 'testCheckAllowed', {
				exec: function() {},
				requiredContent: 'foo[tca]'
			} );

		assert.isFalse( cmd.checkAllowed(), 'is not allowed' );

		editor.filter.allow( 'foo[tca]' );

		assert.isFalse( cmd.checkAllowed(), 'is not allowed - cache' );
		assert.isTrue( cmd.checkAllowed( true ), 'is allowed - no cache' );
	},

	// https://dev.ckeditor.com/ticket/13548
	'test copy command not disabled after clicking on elements path': function() {
		if ( !CKEDITOR.env.ie ) {
			assert.ignore();
			return;
		}

		var editor = this.editor,
			cmd = editor.getCommand( 'copy' );

		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p><strong>test^</strong></p>' );

		editor.once( 'selectionChange', function() {
			resume( function() {
				assert.areNotSame( cmd.state, CKEDITOR.TRISTATE_DISABLED );
			} );
		} );
		editor._.elementsPath.onClick( 0 );

		wait();
	},

	// https://dev.ckeditor.com/ticket/13548
	'test cut command not disabled after clicking on elements path': function() {
		if ( !CKEDITOR.env.ie ) {
			assert.ignore();
			return;
		}

		var editor = this.editor,
			cmd = editor.getCommand( 'cut' );

		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p><strong>test^</strong></p>' );

		editor.once( 'selectionChange', function() {
			resume( function() {
				assert.areNotSame( cmd.state, CKEDITOR.TRISTATE_DISABLED );
			} );
		} );
		editor._.elementsPath.onClick( 0 );

		wait();
	},

	// (#1582)
	'test addCommand from command instance': function() {
		var editor = this.editor,
			styleDefinition = {
				element: 'span',
				attributes: {
					bar: 'foo'
				}
			},
			style = new CKEDITOR.style( styleDefinition ),
			commandDefinition = new CKEDITOR.styleCommand( style ),
			cmd = new CKEDITOR.command( editor, commandDefinition );

		assertCommand( editor, cmd, commandDefinition );
	},

	// (#1582)
	'test addCommand from command subclass': function() {
		var editor = this.editor,
			styleDefinition = {
				element: 'span',
				attributes: {
					bar: 'foo'
				}
			},
			subCommand = CKEDITOR.tools.createClass( { base: CKEDITOR.command } ),
			style = new CKEDITOR.style( styleDefinition ),
			commandDefinition = new CKEDITOR.styleCommand( style ),
			cmd = new subCommand( editor, commandDefinition );

		assertCommand( editor, cmd, commandDefinition );
	}
} );

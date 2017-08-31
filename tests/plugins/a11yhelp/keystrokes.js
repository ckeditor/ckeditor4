/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: a11yhelp,dialog*/

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		setUp: function() {
			if ( CKEDITOR.plugins.a11yhelp._keyMap ) {
				CKEDITOR.plugins.a11yhelp._keyMap = undefined;
			}
		},

		_registerCommand: function( commandName, commandDefinition, keystroke ) {
			var editor = this.editor;

			if ( !commandDefinition ) {
				commandDefinition = {
					exec: function() {},
					label: 'Test Label.'
				};
			}

			if ( !keystroke ) {
				keystroke = CKEDITOR.ALT + 65; // Alt + A
			}

			if ( !editor.getCommand( commandName ) ) {
				editor.addCommand( commandName, commandDefinition );
				editor.setKeystroke( keystroke, commandName );
			}
		},

		_createEditor: function( config, fn ) {
			if ( bender.editor ) {
				bender.editor.destroy();
			}

			var tc = this;

			bender.editorBot.create( { config: config }, function( bot ) {
				bender.editor = tc.editor = bot.editor;
				tc.editorBot = bot;
				fn.call( tc );
			} );
		},

		'test representKeystroke': function() {
			this._createEditor( {}, function() {
				var editor = this.editor;
				assert.areSame( '<kbd><kbd>Alt</kbd>+<kbd>0</kbd></kbd>', CKEDITOR.plugins.a11yhelp.representKeystroke( editor, CKEDITOR.ALT + 48 ) );
			} );
		},

		'test visible label': function() {
			this._createEditor( {}, function() {
				var bot = this.editorBot;
				this._registerCommand( 'customCommand' );

				bot.dialog( 'keystrokesTab', function( dialog ) {
						var dialogHtml = dialog.definition.contents[ 1 ].elements[ 0 ].html;
						assert.areNotSame( -1, dialogHtml.indexOf( '<td>Test Label.</td><td><kbd><kbd>Alt</kbd>+<kbd>A</kbd></kbd></td>' ) );
						dialog.hide();
					} );
			} );
		},

		'test visible key description': function() {
			this._createEditor( {}, function() {
				var bot = this.editorBot,
					commandDefinition = {
						exec: function() {},
						label: 'Another Command',
						keystrokeDescription: '<kbd><kbd>Shift</kbd>+<kbd>A</kbd></kbd> Additional info.',
						getLabel: function() {
							return 'Modified label';
						}
					},
					keystroke = CKEDITOR.SHIFT + 65; // Shift + A

				this._registerCommand( 'customCommand' );
				this._registerCommand( 'anotherCommand', commandDefinition, keystroke );

				bot.dialog( 'keystrokesTab', function( dialog ) {
					wait( function() {
						var dialogHtml = dialog.definition.contents[ 1 ].elements[ 0 ].html;
						assert.areNotSame( -1, dialogHtml.indexOf( '<td>Modified label</td><td><kbd><kbd>Shift</kbd>+<kbd>A</kbd></kbd> Additional info.</td>' ) );
						dialog.hide();
					}, 20 );
				} );
			} );
		},

		'test visible key description (inline editor)': function() {
			this._createEditor( { creator: 'inline' }, function() {
				var bot = this.editorBot,
					commandDefinition = {
						exec: function() {},
						label: 'Another Command',
						keystrokeDescription: '<kbd><kbd>Shift</kbd>+<kbd>A</kbd></kbd> Additional info.',
						getLabel: function() {
							return 'Modified label';
						}
					},
					keystroke = CKEDITOR.SHIFT + 65; // Shift + A

				this._registerCommand( 'customCommand' );
				this._registerCommand( 'anotherCommand', commandDefinition, keystroke );

				bot.dialog( 'keystrokesTab', function( dialog ) {
					wait( function() {
						var dialogHtml = dialog.definition.contents[ 1 ].elements[ 0 ].html;
						assert.areNotSame( -1, dialogHtml.indexOf( '<td>Modified label</td><td><kbd><kbd>Shift</kbd>+<kbd>A</kbd></kbd> Additional info.</td>' ) );
						dialog.hide();
					}, 20 );
				} );
			} );
		},

		'test modified key description': function() {
			this._createEditor( {}, function() {
				var bot = this.editorBot,
					commandDefinition = {
						exec: function() {},
						label: 'Another Command',
						keystrokeDescription: 'Additional info.',
						getKeystrokeDescription: function() {
							return '<kbd><kbd>Shift</kbd>+<kbd>A</kbd></kbd>Modified key description';
						}
					},
				keystroke = CKEDITOR.SHIFT + 65; // Shift + A

				this._registerCommand( 'customCommand' );
				this._registerCommand( 'anotherCommand', commandDefinition, keystroke );

				bot.dialog( 'keystrokesTab', function( dialog ) {
					wait( function() {
						var dialogHtml = dialog.definition.contents[ 1 ].elements[ 0 ].html;
						assert.areNotSame( -1, dialogHtml.indexOf( '<td>Another Command</td><td><kbd><kbd>Shift</kbd>+<kbd>A</kbd></kbd>Modified key description</td>' ) );
						dialog.hide();
					}, 20 );
				} );
			} );
		},

		'test for private property _keyMap': function() {
			this._createEditor( {}, function() {
				var editor = this.editor,
					lang = editor.lang.a11yhelp,
					coreLang = editor.lang.common.keyboard,
					keyMap,
					referenceKeyMap;

				keyMap = CKEDITOR.plugins.a11yhelp._createKeyMap( editor );

				referenceKeyMap = {
					8: coreLang[ 8 ],
					9: lang.tab,
					13: coreLang[ 13 ],
					16: coreLang[ 16 ],
					17: coreLang[ 17 ],
					18: coreLang[ 18 ],
					19: lang.pause,
					20: lang.capslock,
					27: lang.escape,
					33: lang.pageUp,
					34: lang.pageDown,
					35: coreLang[ 35 ],
					36: coreLang[ 36 ],
					37: lang.leftArrow,
					38: lang.upArrow,
					39: lang.rightArrow,
					40: lang.downArrow,
					45: lang.insert,
					46: coreLang[ 46 ],
					91: lang.leftWindowKey,
					92: lang.rightWindowKey,
					93: lang.selectKey,
					96: lang.numpad0,
					97: lang.numpad1,
					98: lang.numpad2,
					99: lang.numpad3,
					100: lang.numpad4,
					101: lang.numpad5,
					102: lang.numpad6,
					103: lang.numpad7,
					104: lang.numpad8,
					105: lang.numpad9,
					106: lang.multiply,
					107: lang.add,
					109: lang.subtract,
					110: lang.decimalPoint,
					111: lang.divide,
					112: lang.f1,
					113: lang.f2,
					114: lang.f3,
					115: lang.f4,
					116: lang.f5,
					117: lang.f6,
					118: lang.f7,
					119: lang.f8,
					120: lang.f9,
					121: lang.f10,
					122: lang.f11,
					123: lang.f12,
					144: lang.numLock,
					145: lang.scrollLock,
					186: lang.semiColon,
					187: lang.equalSign,
					188: lang.comma,
					189: lang.dash,
					190: lang.period,
					191: lang.forwardSlash,
					192: lang.graveAccent,
					219: lang.openBracket,
					220: lang.backSlash,
					221: lang.closeBracket,
					222: lang.singleQuote
				};
				referenceKeyMap[ CKEDITOR.ALT ] = coreLang[ 18 ];
				referenceKeyMap[ CKEDITOR.SHIFT ] = coreLang[ 16 ];
				referenceKeyMap[ CKEDITOR.CTRL ] = CKEDITOR.env.mac ? coreLang[ 224 ] : coreLang[ 17 ];

				assert.isTrue( CKEDITOR.tools.objectCompare( referenceKeyMap, keyMap ) );
			} );
		},

		'test _keyMap supports multilang': function() {
			var that = this;

			this._createEditor( { language: 'en' }, function() {
				var editor = this.editor,
					keyMap;

				keyMap = CKEDITOR.plugins.a11yhelp._createKeyMap( editor );

				assert.areSame( 'Ctrl', keyMap[ CKEDITOR.CTRL ], 'Ctrl key label' );

				// Test multilang support.
				that._createEditor( { language: 'de' }, function() {
					var germanKeyMap = CKEDITOR.plugins.a11yhelp._createKeyMap( that.editor );

					assert.areSame( 'Strg', germanKeyMap[ CKEDITOR.CTRL ], 'Ctrl key label' );
				} );
			} );
		}
	} );
} )();

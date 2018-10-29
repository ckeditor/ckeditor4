/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard,contextmenu */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test opening context menu color': function() {
			var ed1 = this.editor,
				bot1 = this.editorBot;

			ed1.focus();
			bot1.contextmenu( function( menu1 ) {
				// Check DOM focus and virtual editor focus.
				assert.areSame( menu1._.panel._.iframe, CKEDITOR.document.getActive(), 'check DOM focus inside of panel' );
				assert.isTrue( ed1.focusManager.hasFocus, 'editor1 focused on menu open' );

				bender.editorBot.create( {
					name: 'editor2'
				}, function( bot2 ) {
					var ed2 = bot2.editor;

					bot2.contextmenu( function( menu2 ) {
						// Check DOM focus and virtual editor focus.
						assert.areSame( menu2._.panel._.iframe, CKEDITOR.document.getActive(), 'check DOM focus inside of panel' );
						assert.isFalse( ed1.focusManager.hasFocus, 'editor1 loose focus on menu open' );
						assert.isTrue( ed2.focusManager.hasFocus, 'editor2 focused on menu open' );
					} );
				} );
			} );
		},

		'test opening context menu default config': function() {
			bender.editorBot.create( {
				name: 'editor_nocontextmenu1'
			}, function( bot ) {
				bot.editor.contextMenu.show = sinon.spy();
				bot.editor.focus();
				bot.editor.contextMenu.open( bot.editor.editable() );

				assert.isTrue( bot.editor.contextMenu.show.called );
			} );
		},

		'test opening disabled context menu': function() {
			bender.editorBot.create( {
					name: 'editor_nocontextmenu2',
					config: {
						enableContextMenu: false
					}
				}, function( bot ) {
				bot.editor.contextMenu.show = sinon.spy();
				bot.editor.focus();
				bot.editor.contextMenu.open( bot.editor.editable() );

				assert.isFalse( bot.editor.contextMenu.show.called );
			} );
		},

		'#9706: test opening contextmenu in editable that does not autoparagraph': function() {
			bender.editorBot.create( {
				name: 'editor3',
				creator: 'inline'
			}, function( bot ) {
				bot.setHtmlWithSelection( '<strong>[aaa]</strong> bbb' );

				bot.contextmenu( function() {
					assert.isTrue( true, 'Context menu was opened' );
				} );
			} );
		},

		'#11306: test fake selection in Webkit/Blink on Mac when non-editable element': function() {
			if ( !( CKEDITOR.env.mac && CKEDITOR.env.webkit ) )
				assert.ignore();

			var html = '<div contenteditable="false">' +
				'<strong id="a">a</strong>' +
				'<div id="b" contenteditable="true">b</div>' +
			'</div>';

			bender.editorBot.create( {
				name: 'editor4',
				config: {
					allowedContent: true
				}
			}, function( bot ) {
				bot.setData( html, function() {
					var editor = bot.editor,
						editable = editor.editable(),
						doc = editor.document,

						nonEditable = doc.getById( 'a' ),
						nestedEditable = doc.getById( 'b' ),
						preventDefaultCalled = 0;

					// https://dev.ckeditor.com/ticket/13910
					editor.focus();

					editable.fire( 'contextmenu', new CKEDITOR.dom.event( {
						target: nonEditable.$,
						preventDefault: function() {
							++preventDefaultCalled;
						}
					} ) );

					assert.areSame( 1, preventDefaultCalled, 'PreventDefault was called' );
					assert.isTrue( !!editor.getSelection().isFake, 'Fake selection is set' );

					editor.getSelection().reset();

					editable.fire( 'contextmenu', new CKEDITOR.dom.event( {
						target: nestedEditable.$,
						preventDefault: function() {
							++preventDefaultCalled;
						}
					} ) );

					assert.areSame( 2, preventDefaultCalled, 'PreventDefault called once again' );
					assert.isFalse( !!editor.getSelection().isFake, 'Fake selection is not set for nested editables' );
				} );
			} );
		},

		// (#1181)
		'test open context menu when no selection in the editor': function() {
			bender.editorBot.create( {
				name: 'editor_noselection'
			}, function( bot ) {
				var editor = bot.editor;

				editor.contextMenu.show = sinon.spy();

				editor.getSelection().removeAllRanges();
				editor.contextMenu.open( editor.editable() );

				assert.isFalse( editor.contextMenu.show.called );
			} );
		},

		// (#2202)
		'test context menu custom panel css styles': function() {
			var customStyle = '/css/custom.css';

			bender.editorBot.create( {
				name: 'editor_styles',
				config: {
					contextmenu_contentsCss: customStyle
				}
			}, function( bot ) {
				assert.areEqual( customStyle, bot.editor.contextMenu._.panelDefinition.css );
			} );
		}
	} );
} )();

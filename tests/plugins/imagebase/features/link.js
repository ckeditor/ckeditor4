/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: imagebase,link,toolbar,contextmenu,easyimage */
/* bender-include: ../../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editors = {
		classic: {},

		divarea: {
			config: {
				extraPlugins: 'divarea'
			}
		},

		inline: {
			creator: 'inline'
		}
	};

	function addTestWidget( editor ) {
		if ( editor.widgets.registered.testWidget ) {
			return;
		}

		var plugin = CKEDITOR.plugins.imagebase;

		plugin.addImageWidget( editor, 'testWidget', plugin.addFeature( editor, 'link', {} ) );
	}

	function assertAttributes( editor, linkElement, linkData ) {
		var attributes = CKEDITOR.plugins.link.getLinkAttributes( editor, linkData ),
			attribute;

		for ( attribute in attributes.set ) {
			assert.areSame( attributes.set[ attribute ], linkElement.getAttribute( attribute ),
				'Link has proper value for ' + attribute + ' attribute' );
		}

		CKEDITOR.tools.array.forEach( attributes.removed, function( attribute ) {
			assert.isFalse( linkElement.hasAttribute( attribute ), 'Link does not have ' + attribute + ' attribute' );
		} );
	}

	function assertLinkWidgetStatus( options ) {
		var editor = options.editor,
			linkCmd = editor.getCommand( 'link' ),
			unlinkCmd = editor.getCommand( 'unlink' ),
			widget = options.widget || widgetTestsTools.getWidgetByDOMOffset( editor, 0 );

		widget.focus();

		assert.areSame( options.linkCount, widget.element.find( 'a' ).count(), 'There is only one link element inside widget' );
		assert.areSame( options.linkCmdState, linkCmd.state, 'Link command state' );
		assert.areSame( options.unlinkCmdState, unlinkCmd.state, 'Unlink command state' );

		return widget;
	}

	function assertLinkWidget( options ) {
		var widget;

		CKEDITOR.tools.extend( options, {
			linkCount: 1,
			linkCmdState: CKEDITOR.TRISTATE_OFF,
			unlinkCmdState: CKEDITOR.TRISTATE_OFF
		} );
		widget = assertLinkWidgetStatus( options );

		assert.isObject( widget.parts.link, 'Widget has link part' );
		objectAssert.areDeepEqual( options.data, widget.data.link, 'Widget has correct link data' );
		assertAttributes( options.editor, widget.parts.link, options.data );
	}

	function assertUnlinkWidget( options ) {
		var widget;

		CKEDITOR.tools.extend( options, {
			linkCount: 0,
			linkCmdState: CKEDITOR.TRISTATE_OFF,
			unlinkCmdState: CKEDITOR.TRISTATE_DISABLED
		} );
		widget = assertLinkWidgetStatus( options );

		assert.isNull( widget.parts.link, 'Widget does not have link part' );
		assert.isUndefined( widget.data.link, 'Widget does not have link data' );
	}

	function testLinkCommand( options ) {
		var bot = options.bot,
			editor = bot.editor,
			linkCmd = editor.getCommand( 'link' ),
			unlinkCmd = editor.getCommand( 'unlink' ),
			linkCmdState = typeof options.linkCmdState === 'number' ? options.linkCmdState : CKEDITOR.TRISTATE_OFF,
			unlinkCmdState = typeof options.unlinkCmdState === 'number' ? options.unlinkCmdState :
				CKEDITOR.TRISTATE_DISABLED;

		bot.setData( options.html, function() {
			var widget = widgetTestsTools.getWidgetByDOMOffset( editor, 0 );

			editor.once( 'dialogShow', function( evt ) {
				resume( function() {
					var dialog = evt.data;

					options.dialogCallback( dialog, widget );
				} );
			} );

			widget.focus();

			assert.areSame( linkCmdState, linkCmd.state, 'Link command state' );
			assert.areSame( unlinkCmdState, unlinkCmd.state, 'Unlink command state' );

			editor.execCommand( 'link' );
			wait();
		} );
	}

	function testUnlinkCommand( options ) {
		var bot = options.bot,
			editor = bot.editor,
			linkCmd = editor.getCommand( 'link' ),
			unlinkCmd = editor.getCommand( 'unlink' ),
			linkCmdState = typeof options.linkCmdState === 'number' ? options.linkCmdState : CKEDITOR.TRISTATE_OFF,
			unlinkCmdState = typeof options.unlinkCmdState === 'number' ? options.unlinkCmdState :
				CKEDITOR.TRISTATE_OFF;

		bot.setData( options.html, function() {
			var widget = widgetTestsTools.getWidgetByDOMOffset( editor, 0 );

			editor.once( 'afterCommandExec', function( evt ) {
				resume( function() {
					options.callback( evt, widget );
				} );
			} );

			widget.focus();

			assert.areSame( linkCmdState, linkCmd.state, 'Link command state' );
			assert.areSame( unlinkCmdState, unlinkCmd.state, 'Unlink command state' );

			editor.execCommand( 'unlink' );
			wait();
		} );
	}

	function testLinkOptionInContextMenu( editor, bot, data, testCase, cb ) {
		addTestWidget( editor );
		bot.setData( data, function() {
			var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

			widget.focus();
			editor.contextMenu.open( editor.editable() );
			var itemsExist = 0;
			for ( var i = 0; i < editor.contextMenu.items.length; ++i ) {
				if ( testCase( editor, i ) ) {
					itemsExist += 1;
				}
			}

			editor.contextMenu.hide();

			cb( itemsExist );
		} );
	}

	var tests = {

		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
		},

		'test adding image widget with link feature': function( editor ) {
			var expectedParts = {
				caption: 'figcaption',
				image: 'img',
				link: 'a'
			};

			addTestWidget( editor );

			objectAssert.ownsKeys( [ 'testWidget' ], editor.widgets.registered );
			objectAssert.areDeepEqual( expectedParts, editor.widgets.registered.testWidget.parts );

		},

		'test upcasting image widget with link': function( editor, bot ) {
			addTestWidget( editor );

			widgetTestsTools.assertWidget( {
				count: 1,
				widgetOffset: 0,
				nameCreated: 'testWidget',
				html: CKEDITOR.document.getById( 'upcastTest' ).getHtml(),
				bot: bot,
				assertCreated: function( widget ) {
					assertLinkWidget( {
						widget: widget,
						editor: editor,
						url: 'foo',
						data: {
							type: 'url',
							url: {
								protocol: 'http://',
								url: 'foo'
							}
						}
					} );
				}
			} );
		},

		'test upcasting image widget with https link': function( editor, bot ) {
			addTestWidget( editor );

			widgetTestsTools.assertWidget( {
				count: 1,
				widgetOffset: 0,
				nameCreated: 'testWidget',
				html: CKEDITOR.document.getById( 'upcastTestHttps' ).getHtml(),
				bot: bot,
				assertCreated: function( widget ) {
					assertLinkWidget( {
						widget: widget,
						editor: editor,
						url: 'foo',
						data: {
							type: 'url',
							url: {
								protocol: 'https://',
								url: 'img'
							}
						}
					} );
				}
			} );
		},

		'test add link to existing image widget': function( editor, bot ) {
			// (#3147)
			if ( CKEDITOR.env.ie && CKEDITOR.env.version === 11 ) {
				assert.ignore();
			}

			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<figure><img src="%BASE_PATH%_assets/logo.png"></figure>',
				url: 'x',
				dialogCallback: function( dialog, widget ) {
					var data = {};

					dialog.setValueOf( 'info', 'url', 'x' );
					dialog.getButton( 'ok' ).click();

					dialog.commitContent( data );

					assertLinkWidget( {
						widget: widget,
						editor: editor,
						data: data
					} );
				}
			} );
		},

		'test edit link in existing image widget': function( editor, bot ) {
			// (#3147)
			if ( CKEDITOR.env.ie && CKEDITOR.env.version === 11 ) {
				assert.ignore();
			}

			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<figure><a href="http://foo"><img src="%BASE_PATH%_assets/logo.png"></a></figure>',
				unlinkCmdState: CKEDITOR.TRISTATE_OFF,
				dialogCallback: function( dialog, widget ) {
					var data = {};

					assert.areSame( 'foo', dialog.getValueOf( 'info', 'url' ),
						'Dialog contains correct URL' );

					dialog.setValueOf( 'info', 'url', 'x' );
					dialog.getButton( 'ok' ).click();

					dialog.commitContent( data );

					assertLinkWidget( {
						widget: widget,
						editor: editor,
						data: data
					} );
				}
			} );
		},

		'test add link with attribute to existing image widget': function( editor, bot ) {
			// (#3147)
			if ( CKEDITOR.env.ie && CKEDITOR.env.version === 11 ) {
				assert.ignore();
			}

			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<figure><img src="%BASE_PATH%_assets/logo.png"></figure>',
				url: 'x',
				dialogCallback: function( dialog, widget ) {
					var data = {};

					dialog.setValueOf( 'info', 'url', 'x' );
					dialog.setValueOf( 'target', 'linkTargetType', '_blank' );
					dialog.getButton( 'ok' ).click();

					dialog.commitContent( data );

					assertLinkWidget( {
						widget: widget,
						editor: editor,
						data: data
					} );
				}
			} );
		},

		'test edit link attribute in existing image widget': function( editor, bot ) {
			// (#3147)
			if ( CKEDITOR.env.ie && CKEDITOR.env.version === 11 ) {
				assert.ignore();
			}

			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<figure><a href="http://foo" target="_blank"><img src="%BASE_PATH%_assets/logo.png"></a></figure>',
				unlinkCmdState: CKEDITOR.TRISTATE_OFF,
				dialogCallback: function( dialog, widget ) {
					var data = {};

					assert.areSame( 'foo', dialog.getValueOf( 'info', 'url' ),
						'Dialog contains correct URL' );

					dialog.setValueOf( 'info', 'url', 'x' );
					dialog.setValueOf( 'target', 'linkTargetType', 'popup' );
					dialog.getButton( 'ok' ).click();

					dialog.commitContent( data );

					assertLinkWidget( {
						widget: widget,
						editor: editor,
						data: data
					} );
				}
			} );
		},

		'test remove link attribute in existing image widget': function( editor, bot ) {
			// (#3147)
			if ( CKEDITOR.env.ie && CKEDITOR.env.version === 11 ) {
				assert.ignore();
			}

			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<figure><a href="http://foo" target="_blank"><img src="%BASE_PATH%_assets/logo.png"></a></figure>',
				unlinkCmdState: CKEDITOR.TRISTATE_OFF,
				dialogCallback: function( dialog, widget ) {
					var data = {};

					assert.areSame( 'foo', dialog.getValueOf( 'info', 'url' ),
						'Dialog contains correct URL' );

					dialog.setValueOf( 'info', 'url', 'x' );
					dialog.setValueOf( 'target', 'linkTargetType', 'notSet' );
					dialog.getButton( 'ok' ).click();

					dialog.commitContent( data );

					assertLinkWidget( {
						widget: widget,
						editor: editor,
						data: data
					} );
				}
			} );
		},

		'test dialog ok listener is deleted when closing the dialog': function( editor, bot ) {
			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<p>test</p><figure><img src="%BASE_PATH%_assets/logo.png"></figure>',
				dialogCallback: function( dialog ) {
					var paragraph = editor.editable().findOne( 'p' ).getChild( 0 ),
						range = editor.createRange();

					editor.once( 'dialogShow', function() {
						resume( function() {
							dialog.setValueOf( 'info', 'url', 'x' );
							dialog.getButton( 'ok' ).click();

							assert.areSame( 1, editor.editable().find( 'p > a' ).count(), 'Link is correctly added' );
						} );
					} );

					dialog.getButton( 'cancel' ).click();

					range.setStart( paragraph, 1 );
					range.setEnd( paragraph, 3 );
					range.select();
					editor.execCommand( 'link' );
					wait();
				}
			} );
		},

		'test unlink image widget': function( editor, bot ) {
			addTestWidget( editor );

			testUnlinkCommand( {
				bot: bot,
				html: '<figure><a href="http://foo"><img src="%BASE_PATH%_assets/logo.png"></a></figure>',

				callback: function( evt, widget ) {
					assertUnlinkWidget( {
						widget: widget,
						editor: editor
					} );
				}
			} );
		},

		// #tp3298
		'test calling setData after unlink keeps correct data.link': function( editor, bot ) {
			addTestWidget( editor );

			testUnlinkCommand( {
				bot: bot,
				html: '<figure><a href="http://foo"><img src="%BASE_PATH%_assets/logo.png"></a></figure>',

				callback: function( evt, widget ) {
					widget.once( 'data', function( evt ) {
						resume( function() {
							assert.isUndefined( evt.data.link, 'link data type' );
						} );
					} );

					widget.setData( 'test', '' );
					wait();
				}
			} );
		},

		'test link option in context menu': function( editor, bot ) {
			testLinkOptionInContextMenu( editor, bot, '<figure><a href="http://foo"><img src="%BASE_PATH%_assets/logo.png"></a></figure>', function( editor, index ) {
				return editor.contextMenu.items[ index ].command == 'link';
			}, function( itemsExist ) {
				assert.areSame( 1, itemsExist, 'there is one link item in context menu' );
			} );
		},
		'test unlink option in context menu': function( editor, bot ) {
			testLinkOptionInContextMenu( editor, bot, '<figure><a href="http://foo"><img src="%BASE_PATH%_assets/logo.png"></a></figure>', function( editor, index ) {
				return editor.contextMenu.items[ index ].command == 'unlink';
			}, function( itemsExist ) {
				assert.areSame( 1, itemsExist, 'there is one unlink item in context menu' );
			} );
		},
		'test no link option in context menu': function( editor, bot ) {
			testLinkOptionInContextMenu( editor, bot, '<figure><img src="%BASE_PATH%_assets/logo.png"></figure>', function( editor, index ) {
				return editor.contextMenu.items[ index ].command == 'unlink' || editor.contextMenu.items[ index ].command == 'link';
			}, function( itemsExist ) {
				assert.areSame( 0, itemsExist, 'there is one link item in context menu' );
			} );
		}
	};

	// We have to run tests in isolation when using IE browsers (#1552) and EDGE (#1686).
	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests, CKEDITOR.env.ie );
	bender.test( tests );
} )();

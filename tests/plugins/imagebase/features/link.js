/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: imagebase,link,toolbar */
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

	function assertLinkWidgetStatus( options, linkCount, linkCmdState, unlinkCmdState ) {
		var editor = options.editor,
			linkCmd = editor.getCommand( 'link' ),
			unlinkCmd = editor.getCommand( 'unlink' ),
			widget = options.widget || widgetTestsTools.getWidgetByDOMOffset( editor, 0 );

		widget.focus();

		assert.areSame( linkCount, widget.element.find( 'a' ).count(), 'There is only one link element inside widget' );
		assert.areSame( linkCmdState, linkCmd.state, 'Link command state' );
		assert.areSame( unlinkCmdState, unlinkCmd.state, 'Unlink command state' );

		return widget;
	}

	function assertLinkWidget( options ) {
		var widget = assertLinkWidgetStatus( options, 1, CKEDITOR.TRISTATE_OFF, CKEDITOR.TRISTATE_OFF );

		assert.isObject( widget.parts.link, 'Widget has link part' );
		objectAssert.areDeepEqual( options.data, widget.data.link, 'Widget has correct link data' );
		assertAttributes( options.editor, widget.parts.link, options.data );
	}

	function assertUnlinkWidget( options ) {
		var widget = assertLinkWidgetStatus( options, 0, CKEDITOR.TRISTATE_OFF, CKEDITOR.TRISTATE_DISABLED );

		assert.isNull( widget.parts.link, 'Widget does not have link part' );
		assert.isNull( widget.data.link, 'Widget does not have link data' );
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

	var tests = {
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

		'test add link to existing image widget': function( editor, bot ) {
			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<figure><img src="http://foo"></figure>',
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
			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<figure><a href="http://foo"><img src="http://foo"></a></figure>',
				initialUrl: 'foo',
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
			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<figure><img src="http://foo"></figure>',
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
			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<figure><a href="http://foo" target="_blank"><img src="http://foo"></a></figure>',
				initialUrl: 'foo',
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
			addTestWidget( editor );

			testLinkCommand( {
				bot: bot,
				html: '<figure><a href="http://foo" target="_blank"><img src="http://foo"></a></figure>',
				initialUrl: 'foo',
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
				html: '<p>test</p><figure><img src="http://foo"></figure>',
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
				html: '<figure><a href="http://foo"><img src="http://foo"></a></figure>',

				callback: function( evt, widget ) {
					assertUnlinkWidget( {
						widget: widget,
						editor: editor
					} );
				}
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();

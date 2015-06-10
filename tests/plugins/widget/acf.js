/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,toolbar,clipboard */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			on: {
				instanceReady: function( evt ) {
					evt.editor.dataProcessor.writer.sortAttributes = 1;
				}
			}
		}
	};

	var obj2Array = widgetTestsTools.obj2Array;

	bender.test( {
		'test widget without buttons should not be added to ACF': function() {
			bender.editorBot.create( {
				name: 'basic1',
				startupData: '<p><b data-widget="test1">foo</b><i data-widget="test2" foo="1">bar</i>' +
					'<s class="test3">bim</s><u data-widget="test2">bom</u></p>',
				config: {
					removePlugins: 'basicstyles',
					on: {
						widgetDefinition: function( evt ) {
							if ( evt.data.name == 'test2' )
								evt.data.allowedContent = 'i[!data-widget,foo]';
						},

						pluginsLoaded: function( evt ) {
							evt.editor.widgets.add( 'test1', {
								allowedContent: 'b[!data-widget]'
							} );
							evt.editor.widgets.add( 'test2', {} );
							evt.editor.widgets.add( 'test3', {
								allowedContent: 's(test3)',
								upcast: function( el ) {
									return el.name == 's';
								}
							} );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;

				assert.areSame( 0, obj2Array( editor.widgets.instances ).length );
				assert.areSame( '<p>foobarbimbom</p>', editor.getData() );
			} );
		},

		'test widget with buttons registration during start': function() {
			CKEDITOR.plugins.add( 'basic2', {
				init: function( editor ) {
					editor.widgets.add( 'test1', {
						button: 'Test1',
						allowedContent: 'b[!data-widget]'
					} );
					editor.widgets.add( 'test2', {
						button: 'Test2'
					} );
					editor.widgets.add( 'test3', {
						button: 'Test3',
						allowedContent: 's(test3)',
						upcast: function( el ) {
							return el.name == 's';
						}
					} );
					editor.widgets.add( 'test4', {
						button: 'Test4',
						allowedContent: 'u[!data-widget]'
					} );
				}
			} );

			bender.editorBot.create( {
				name: 'basic2',
				startupData: '<p><b data-widget="test1">foo</b><i data-widget="test2" foo="1">bar</i>' +
					'<s class="test3">bim</s><u data-widget="test2">bom</u></p>',
				config: {
					removeButtons: 'Test4',
					extraPlugins: 'basic2',
					removePlugins: 'basicstyles',
					on: {
						widgetDefinition: function( evt ) {
							if ( evt.data.name == 'test2' )
								evt.data.allowedContent = 'i[!data-widget,foo]';
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;

				assert.areSame( 3, obj2Array( editor.widgets.instances ).length );
				assert.areSame( '<p><b data-widget="test1">foo</b><i data-widget="test2" foo="1">bar</i><s class="test3">bim</s>bom</p>', editor.getData() );
			} );
		},

		'test widget registration during start - custom ACF settings': function() {
			CKEDITOR.plugins.add( 'basic3', {
				init: function( editor ) {
					editor.widgets.add( 'test1a', {
						requiredContent: 'b[data-widget]'
					} );
					editor.widgets.add( 'test2a', {
						requiredContent: 'i[data-widget]'
					} );
					editor.widgets.add( 'test1b', {
						button: 'Test1b',
						requiredContent: 'u[data-widget]'
					} );
					editor.widgets.add( 'test2b', {
						button: 'Test2b',
						requiredContent: 's[data-widget]'
					} );
				}
			} );

			bender.editorBot.create( {
				name: 'basic3',
				startupData: '<p><b data-widget="test1a">fooa</b><i data-widget="test2a">bara</i>' +
					'<u data-widget="test1b">foob</u><s data-widget="test2b">barb</s></p>',
				config: {
					extraPlugins: 'basic3',
					removePlugins: 'basicstyles',
					allowedContent: 'b u; i s[data-widget]'
				}
			}, function( bot ) {
				var editor = bot.editor;

				assert.areSame( 2, obj2Array( editor.widgets.instances ).length );
				assert.areSame( '<p><b>fooa</b><i data-widget="test2a">bara</i><u>foob</u><s data-widget="test2b">barb</s></p>', editor.getData() );

				assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'test1a' ).state, 'test1a is disabled' );
				assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'test2a' ).state, 'test2a is enabled' );

				assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'test1b' ).state, 'test1b is disabled' );
				assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'test2b' ).state, 'test2b is enabled' );
			} );
		},

		'test widgets pasting': function() {
			CKEDITOR.plugins.add( 'pasting1', {
				init: function( editor ) {
					editor.widgets.add( 'pasting1', {
						button: 'pasting1',
						allowedContent: 's[!data-widget]; u(!pasting1)'
					} );
				}
			} );

			bender.editorBot.create( {
				name: 'pasting1',
				config: {
					// Allow extra spans so widget wrapper is excepted by ACF.
					// Otherwiser ACF will fully unwrap widget reducing test coverage.
					extraAllowedContent: 'span',
					extraPlugins: 'pasting1'
				}
			}, function( bot ) {
				var editor = bot.editor;

				bot.setData( '<p><s data-widget="pasting1"><u class="pasting1">foo</u>bar</s>bom</p>', function() {
					obj2Array( editor.widgets.instances )[ 0 ].setData( 'a', 'b' );

					var html = editor.editable().getHtml();

					editor.once( 'afterPaste', function() {
						resume( function() {
							var instances = obj2Array( editor.widgets.instances );
							assert.areSame( 1, obj2Array( editor.widgets.instances ).length, 'one widget is initialized after paste' );
							assert.areSame( 'b', instances[ 0 ].data.a, 'data is preserved' );
							assert.areSame( '<p><s data-widget="pasting1"><u class="pasting1">foo</u>bar</s>bom</p>', editor.getData() );
						} );
					} );

					editor.setData( '', function() {
						editor.execCommand( 'paste', html );
					} );

					wait();
				} );
			} );
		}
	} );
} )();
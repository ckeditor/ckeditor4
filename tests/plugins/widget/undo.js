/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,undo,dialog,basicstyles,clipboard */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	var widgetDefinition1 = {
			template: '<div data-widget="test1" id="w1">Y<p class="e">Z</p></div>',
			editables: {
				foo: '.e'
			}
		},
		widgetData1 = '<p id="p1">X</p><div data-widget="test1" id="w1">Y<p class="e">Z</p></div>',
		widgetDefinition2 = {
			defaults: {
				value1: 'x'
			},
			template: '<div data-widget="test2" id="w1">Y</div>',
			dialog: 'test2',
			data: function() {
				this.element.data( 'value1', this.data.value1 );
			}
		},
		widgetData2 = '<p id="p1">X</p><div data-widget="test2" id="w1">Y</div>';

	bender.editor = {
		config: {
			allowedContent: true,
			on: {
				instanceReady: function( evt ) {
					evt.editor.dataProcessor.writer.sortAttributes = 1;

					evt.editor.widgets.add( 'test1', widgetDefinition1 );
					evt.editor.widgets.add( 'test2', widgetDefinition2 );

					CKEDITOR.dialog.add( 'test2', function() {
						return {
							title: 'Test2',
							contents: [
								{
									id: 'info',
									elements: [
										{
											id: 'value1',
											type: 'text',
											label: 'Value 1',
											setup: function( widget ) {
												this.setValue( widget.data.value1 );
											},
											commit: function( widget ) {
												widget.setData( 'value1', this.getValue() );
											}
										}
									]
								}
							]
						};
					} );
				}
			}
		}
	};

	var obj2Array = widgetTestsTools.obj2Array,
		getWidgetById = widgetTestsTools.getWidgetById;

	function assertCommands( editor, expectActiveUndo, expectActiveRedo, msg ) {
		msg += ' - ';

		assert.areSame( expectActiveUndo ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, msg + 'undo' );
		assert.areSame( expectActiveRedo ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'redo' ).state, msg + 'redo' );
	}

	bender.test( {
		'test clean snapshots stack after data loading': function() {
			bender.editorBot.create( {
				name: 'test_data_loading',
				startupData: widgetData1,
				config: {
					allowedContent: true,
					on: {
						pluginsLoaded: function( evt ) {
							evt.editor.widgets.add( 'test1', widgetDefinition1 );
						}
					}
				}
			}, function( bot ) {
				assertCommands( bot.editor, false, false, 'on load' );
			} );
		},

		'test clean snapshots stack after focusing widget': function() {
			var editor = this.editor;

			this.editorBot.setData( widgetData1, function() {
				var widget = getWidgetById( editor, 'w1' );

				editor.resetUndo();

				widget.focus();
				assertCommands( editor, false, false, 'after focus' );

				editor.getSelection().selectElement( editor.document.getById( 'p1' ) );
				assertCommands( editor, false, false, 'after blur' );
			} );
		},

		'test clean snapshots stack after focusing nested editable': function() {
			var editor = this.editor;

			this.editorBot.setData( widgetData1, function() {
				var widget = getWidgetById( editor, 'w1' ),
					eFoo = widget.editables.foo,
					range = editor.createRange();

				editor.resetUndo();

				eFoo.focus();
				range.setStart( eFoo, 0 );
				range.collapse( 1 );
				range.select();
				assertCommands( editor, false, false, 'after focus' );

				editor.getSelection().selectElement( editor.document.getById( 'p1' ) );
				assertCommands( editor, false, false, 'after blur' );
			} );
		},

		'test widgets reinitialized on undo&redo': function() {
			var editor = this.editor;

			this.editorBot.setData( widgetData1, function() {
				editor.resetUndo();
				editor.focus();
				editor.getSelection().selectElement( editor.document.getById( 'p1' ) );

				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget on data ready' );

				editor.execCommand( 'bold' );
				assertCommands( editor, true, false, 'after bold' );

				editor.execCommand( 'undo' );
				assertCommands( editor, false, true, 'after undo' );
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after undo' );
				assert.isTrue( !!getWidgetById( editor, 'w1' ), 'widget lives after undo' );

				editor.execCommand( 'redo' );
				assertCommands( editor, true, false, 'after redo' );
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after redo' );
				assert.isTrue( !!getWidgetById( editor, 'w1' ), 'widget lives after redo' );
			} );
		},

		'test widget inserting by a command - no dialog': function() {
			var editor = this.editor;

			this.editorBot.setData( '', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>X^X</p>' );

				editor.resetUndo();

				editor.execCommand( 'test1' );
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after insert' );
				assertCommands( editor, true, false, 'after insert' );

				editor.execCommand( 'undo' );
				assert.areSame( 0, obj2Array( editor.widgets.instances ).length, '0 widgets after undo' );
				assertCommands( editor, false, true, 'after undo' );

				editor.execCommand( 'redo' );
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after redo' );
				assertCommands( editor, true, false, 'after redo' );
			} );
		},

		'test widget inserting by a command - using dialog': function() {
			var editor = this.editor;

			this.editorBot.setData( '', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>X^X</p>' );

				editor.resetUndo();

				editor.once( 'dialogShow', function( evt ) {
					var dialog = evt.data;
					setTimeout( function() {
						dialog.setValueOf( 'info', 'value1', 'newfoo' );
						dialog.getButton( 'ok' ).click();
					}, 50 );
				} );

				editor.once( 'dialogHide', function() {
					resume( function() {
						assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after insert' );
						assert.areSame( 'newfoo', getWidgetById( editor, 'w1' ).data.value1, 'set value' );
						assertCommands( editor, true, false, 'after insert' );

						editor.execCommand( 'undo' );
						assert.areSame( 0, obj2Array( editor.widgets.instances ).length, '0 widgets after undo' );
						assertCommands( editor, false, true, 'after undo' );

						editor.execCommand( 'redo' );
						assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after redo' );
						assert.areSame( 'newfoo', getWidgetById( editor, 'w1' ).data.value1, 'redone to set value' );
						assertCommands( editor, true, false, 'after redo' );
					} );
				} );

				wait( function() {
					editor.execCommand( 'test2' );
				} );
			} );
		},

		'test widget editing': function() {
			var editor = this.editor;

			this.editorBot.setData( widgetData2, function() {
				editor.resetUndo();
				getWidgetById( editor, 'w1' ).focus();

				editor.once( 'dialogShow', function( evt ) {
					var dialog = evt.data;
					setTimeout( function() {
						dialog.setValueOf( 'info', 'value1', 'newfoo' );
						dialog.getButton( 'ok' ).click();
					}, 50 );
				} );

				editor.once( 'dialogHide', function() {
					resume( function() {
						assert.areSame( 'newfoo', getWidgetById( editor, 'w1' ).data.value1, 'value has been changed' );
						assertCommands( editor, true, false, 'after edit' );

						editor.execCommand( 'undo' );
						assert.areSame( 'x', getWidgetById( editor, 'w1' ).data.value1, 'value change has been undone' );
						assertCommands( editor, false, true, 'after undo' );

						editor.execCommand( 'redo' );
						assert.areSame( 'newfoo', getWidgetById( editor, 'w1' ).data.value1, 'value change has been redone' );
						assertCommands( editor, true, false, 'after redo' );
					} );
				} );

				wait( function() {
					editor.execCommand( 'test2' );
				} );
			} );
		},

		'test widget pasting': function() {
			var editor = this.editor;

			this.editorBot.setData( widgetData1, function() {
				editor.resetUndo();
				editor.focus();

				var range = editor.createRange();
				range.setStartAt( editor.document.getById( 'p1' ), CKEDITOR.POSITION_AFTER_START );
				range.collapse( true );
				range.select();

				editor.once( 'afterPaste', function() {
					resume( function() {
						assert.areSame( 2, obj2Array( editor.widgets.instances ).length, 'widget was pasted and initialized' );
						assertCommands( editor, true, false, 'after pasting' );

						editor.execCommand( 'undo' );
						assert.areSame( 1, obj2Array( editor.widgets.instances ).length, 'one widget after undo' );
						assertCommands( editor, false, true, 'after undo' );

						editor.execCommand( 'redo' );
						assert.areSame( 2, obj2Array( editor.widgets.instances ).length, 'two widgets after redo' );
						assertCommands( editor, true, false, 'after redo' );
					} );
				}, null, null, 9999 );

				wait( function() {
					editor.execCommand( 'paste', getWidgetById( editor, 'w1' ).wrapper.getOuterHtml() );
				} );
			} );
		},

		'test widget cutting': function() {
			var editor = this.editor;

			this.editorBot.setData( widgetData1, function() {
				var widget = getWidgetById( editor, 'w1' );
				editor.resetUndo();

				widget.focus();

				// Fire CTRL+X.
				widget.fire( 'key', { keyCode: CKEDITOR.CTRL + 88 } );

				wait( function() {
					assert.areSame( 0, obj2Array( editor.widgets.instances ).length, 'widget was cut' );
					assertCommands( editor, true, false, 'after cutting' );

					editor.execCommand( 'undo' );
					assert.areSame( 1, obj2Array( editor.widgets.instances ).length, 'one widget after undo' );
					assertCommands( editor, false, true, 'after undo' );

					editor.execCommand( 'redo' );
					assert.areSame( 0, obj2Array( editor.widgets.instances ).length, '0 widgets after redo' );
					assertCommands( editor, true, false, 'after redo' );
				}, 110 );
			} );
		},

		'test d&d inline widget': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="p1">x<span data-widget="test1" id="w1">Y</span>x</p>', function() {
				editor.resetUndo();
				editor.focus();

				var range = editor.createRange();
				range.setStartAt( editor.document.getById( 'p1' ), CKEDITOR.POSITION_AFTER_START );
				range.collapse( true );
				range.select();

				editor.once( 'afterPaste', function() {
					resume( function() {
						assert.areSame( 1, obj2Array( editor.widgets.instances ).length, 'widget was moved' );
						assert.areSame( '<p id="p1"><span data-widget="test1" id="w1">Y</span>xx</p>', editor.getData() );
						assertCommands( editor, true, false, 'after d&d' );

						editor.execCommand( 'undo' );
						assert.areSame( 1, obj2Array( editor.widgets.instances ).length, 'one widget after undo' );
						assert.areSame( '<p id="p1">x<span data-widget="test1" id="w1">Y</span>x</p>', editor.getData() );
						assertCommands( editor, false, true, 'after undo' );

						editor.execCommand( 'redo' );
						assert.areSame( 1, obj2Array( editor.widgets.instances ).length, 'one widgets after redo' );
						assert.areSame( '<p id="p1"><span data-widget="test1" id="w1">Y</span>xx</p>', editor.getData() );
						assertCommands( editor, true, false, 'after redo' );
					} );
				} );

				// Ensure async.
				wait( function() {
					var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor ),
						evt = bender.tools.mockDropEvent();

					evt.setTarget( editor.document.findOne( 'img.cke_widget_drag_handler' ) );
					dropTarget.fire( 'dragstart', evt );

					// Use a realistic drop target for drop.
					evt.setTarget( range.startContainer );
					evt.testRange = range;
					dropTarget.fire( 'drop', evt );

					evt.setTarget( editor.document.findOne( 'img.cke_widget_drag_handler' ) );
					evt.testRange = undefined;
					dropTarget.fire( 'dragend', evt );
				} );
			} );
		},

		'test d&d block widget': function() {
			var editor = this.editor;

			// Override Finder's getRange to force a place for the
			// widget to be dropped.
			var revert = bender.tools.replaceMethod( CKEDITOR.plugins.lineutils.finder.prototype, 'getRange', function() {
				var range = editor.createRange();

				range.moveToPosition( editor.document.getById( 'a' ), CKEDITOR.POSITION_BEFORE_START );

				return range;
			} );

			this.editorBot.setData( '<p id="a">x</p><div data-widget="test1" id="w1">Y<p class="e">Z</p></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					img = widget.dragHandlerContainer.findOne( 'img' );

				editor.resetUndo();
				editor.focus();

				editor.once( 'afterPaste', function() {
					resume( function() {
						assert.areSame( 1, obj2Array( editor.widgets.instances ).length, 'widget was moved' );
						assert.areSame( '<div data-widget="test1" id="w1">Y<p class="e">Z</p></div><p id="a">x</p>', editor.getData() );
						assertCommands( editor, true, false, 'after d&d' );

						editor.execCommand( 'undo' );
						assert.areSame( 1, obj2Array( editor.widgets.instances ).length, 'one widget after undo' );
						assert.areSame( '<p id="a">x</p><div data-widget="test1" id="w1">Y<p class="e">Z</p></div>', editor.getData() );
						assertCommands( editor, false, true, 'after undo' );

						editor.execCommand( 'redo' );
						assert.areSame( 1, obj2Array( editor.widgets.instances ).length, 'one widgets after redo' );
						assert.areSame( '<div data-widget="test1" id="w1">Y<p class="e">Z</p></div><p id="a">x</p>', editor.getData() );
						assertCommands( editor, true, false, 'after redo' );
					} );
				} );

				// Ensure async.
				wait( function() {
					try {
						// Simulate widget drag.
						img.fire( 'mousedown' );

						// Create dummy line and pretend it's visible to cheat drop listener
						// making if feel that there's a place for the widget to be dropped.
						editor.widgets.liner.showLine( editor.widgets.liner.addLine() );

						// Simulate widget drop.
						editor.document.fire( 'mouseup' );
					} catch ( e ) {
						throw e;
					} finally {
						revert();
					}
				} );
			} );
		},

		'test widget deleting': function() {
			var editor = this.editor;

			this.editorBot.setData( widgetData1, function() {
				var widget = getWidgetById( editor, 'w1' );
				editor.resetUndo();

				widget.focus();

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46 } ) );
				editor.widgets.checkWidgets();

				assert.areSame( 0, obj2Array( editor.widgets.instances ).length, 'widget was deleted' );
				assertCommands( editor, true, false, 'after deleting' );

				editor.execCommand( 'undo' );
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, 'one widget after undo' );
				assertCommands( editor, false, true, 'after undo' );

				editor.execCommand( 'redo' );
				assert.areSame( 0, obj2Array( editor.widgets.instances ).length, '0 widgets after redo' );
				assertCommands( editor, true, false, 'after redo' );
			} );
		}
	} );
} )();
/* bender-tags: balloontoolbar,context */
/* bender-ckeditor-plugins: balloontoolbar,button,widget */
/* bender-include: ../../widget/_helpers/tools.js, _helpers/tools.js */
/* global widgetTestsTools, contextTools */

( function() {
	'use strict';

	var getWidgetById = widgetTestsTools.getWidgetById,
		getContextStub = contextTools._getContextStub;

	function dragstart( editor, evt, widget ) {
		var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor );

		// Use realistic target which is the drag handler.
		evt.setTarget( widget.dragHandlerContainer.findOne( 'img' ) );

		dropTarget.fire( 'dragstart', evt );
	}

	function drop( editor, evt, dropRange ) {
		var dropTarget = editor.document;

		// If drop range is known use a realistic target. If no, then use a mock.
		if ( dropRange ) {
			evt.setTarget( dropRange.startContainer );
		} else {
			evt.setTarget( new CKEDITOR.dom.text( 'targetMock' ) );
		}

		dropTarget.fire( 'drop', evt );
	}

	function dragend( editor, evt, widget ) {
		var dropTarget = editor.document;

		// Use realistic target which is the drag handler.
		evt.setTarget( widget.dragHandlerContainer.findOne( 'img' ) );

		dropTarget.fire( 'dragend', evt );
	}

	bender.editor = {
		config: {
			allowedContent: true,
			on: {
				instanceReady: function( evt ) {
					evt.editor.dataProcessor.writer.sortAttributes = 1;
					evt.editor.widgets.add( 'testwidget', {} );
				}
			}
		}
	};

	bender.test( {
		init: function() {
			// Add command which is only active when widget is selected so its state after drop could be asserted.
			this.editor.addCommand( 'testcommand', {
				startDisabled: true,
				contextSensitive: true,
				exec: function() { },
				refresh: function( editor ) {
					var widget = editor.widgets.focused;
					widget && widget.name === 'testwidget' ? this.setState( CKEDITOR.TRISTATE_ON ) : this.setState( CKEDITOR.TRISTATE_DISABLED );
				}
			} );

			this.editor.ui.addButton( 'testcommandButton', {
				command: 'testcommand'
			} );

			this.editor.ui.addButton( 'buttonWithoutCommand', {
				name: 'buttonWithoutCommand'
			} );
		},

		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'balloontoolbar' );

			this.editor.getCommand( 'testcommand' ).setState( CKEDITOR.TRISTATE_DISABLED );
		},

		tearDown: function() {
			this.editor.balloonToolbars._clear();
			CKEDITOR.plugins.clipboard.resetDragDataTransfer();
		},


		'test balloontoolbar visibility and command state after drop - inline widget': function() {
			var editor = this.editor,
				context = getContextStub( editor, [ 'testwidget' ], 'testcommandButton,buttonWithoutCommand' );

			assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'testcommand' ).state, 'command is disabled' );

			this.editorBot.setData( '<p class="x">foo</p><p>x<span data-widget="testwidget" id="w1">foo</span>x</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = { data: bender.tools.mockDropEvent() },
					range = editor.createRange();

				editor.focus();

				bender.tools.resumeAfter( editor, 'afterPaste', function() {
					assert.areSame( '<p class="x">f<span data-widget="testwidget" id="w1">foo</span>oo</p><p>xx</p>', editor.getData() );
					contextTools._assertToolbarVisible( true, context );
					assert.areSame( CKEDITOR.TRISTATE_ON, editor.getCommand( 'testcommand' ).state, 'command is on' );
				} );

				// Ensure async.
				wait( function() {
					dragstart( editor, evt.data, widget );

					CKEDITOR.plugins.clipboard.initDragDataTransfer( evt );
					evt.data.dataTransfer.setData( 'cke/widget-id', widget.id );

					range.setStart( editor.document.findOne( '.x' ).getFirst(), 1 );
					range.collapse( true );
					evt.data.testRange = range;

					drop( editor, evt.data, range );

					dragend( editor, evt.data, widget );
				} );
			} );
		},

		'test balloontoolbar visibility and command state after drop - block widget': function() {
			var editor = this.editor,
				context = getContextStub( editor, [ 'testwidget' ], 'testcommandButton,buttonWithoutCommand' ),
				revert;

			assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'testcommand' ).state, 'command is disabled' );

			// Override Finder's getRange to force a place for the widget to be dropped.
			revert = bender.tools.replaceMethod( CKEDITOR.plugins.lineutils.finder.prototype, 'getRange', function() {
				var range = editor.createRange();

				range.moveToPosition( editor.document.getById( 'a' ), CKEDITOR.POSITION_BEFORE_START );

				return range;
			} );

			this.editorBot.setData( '<p id="a">foo</p><div data-widget="testwidget" id="w1">bar</div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					img = widget.dragHandlerContainer.findOne( 'img' );

				editor.focus();

				try {
					img.fire( 'mousedown', {
						$: {
							button: 0
						}
					} );

					// Create dummy line and pretend it's visible to cheat drop listener
					// making if feel that there's a place for the widget to be dropped.
					editor.widgets.liner.showLine( editor.widgets.liner.addLine() );

					// Mouseup needs target so tableselection `evt.data.getTarget().getName` check inside
					// its `fakeSelectionMouseHandler` method does not throw an error (#1614).
					editor.document.fire( 'mouseup', new CKEDITOR.dom.event( { target: img } ) );

					assert.areSame( widget, editor.widgets.focused, 'widget focused after mouseup' );

					bender.tools.resumeAfter( editor, 'afterPaste', function() {
						assert.areSame( '<div data-widget="testwidget" id="w1">bar</div><p id="a">foo</p>', editor.getData(), 'Widget moved on drop.' );
						contextTools._assertToolbarVisible( true, context );
						assert.areSame( CKEDITOR.TRISTATE_ON, editor.getCommand( 'testcommand' ).state, 'command is on' );
					} );

					wait();
				} catch ( e ) {
					throw e;
				} finally {
					revert();
				}
			} );
		}
	} );
} )();

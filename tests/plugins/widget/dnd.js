/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,undo,clipboard */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools, lineutilsTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true,
			on: {
				instanceReady: function( evt ) {
					evt.editor.dataProcessor.writer.sortAttributes = 1;

					evt.editor.widgets.add( 'testwidget', {} );

					evt.editor.widgets.add( 'testwidget2', {
						editables: {
							n1: {
								selector: '.n1',
								allowedContent: 'p;blockquote(testwidget3)'
							},
							n2: {
								selector: '.n2',
								allowedContent: 'p;blockquote'
							}
						}
					} );

					evt.editor.widgets.add( 'testwidget3', {
						requiredContent: 'blockquote(testwidget3)'
					} );

					evt.editor.widgets.add( 'testwidget4', {
						editables: {
							n1: '.n1'
						}
					} );
				}
			}
		}
	};

	var getWidgetById = widgetTestsTools.getWidgetById,
		assertRelations = lineutilsTestsTools.assertRelations;

	function dragstart( editor, evt, widget ) {
		var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor );

		// Use realistic target which is the drag handler.
		evt.setTarget( widget.dragHandlerContainer.findOne( 'img' ) );

		dropTarget.fire( 'dragstart', evt );
	}

	function drop( editor, evt, dropRange ) {
		var dropTarget = CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? editor.editable() : editor.document;

		// If drop range is known use a realistic target. If no, then use a mock.
		if ( dropRange ) {
			evt.setTarget( dropRange.startContainer );
		} else {
			evt.setTarget( new CKEDITOR.dom.text( 'targetMock' ) );
		}

		dropTarget.fire( 'drop', evt );
	}

	function dragend( editor, evt, widget ) {
		var dropTarget = CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? editor.editable() : editor.document;

		// Use realistic target which is the drag handler.
		evt.setTarget( widget.dragHandlerContainer.findOne( 'img' ) );

		dropTarget.fire( 'dragend', evt );
	}

	bender.test( {
		tearDown: function() {
			CKEDITOR.plugins.clipboard.resetDragDataTransfer();
		},

		'test handler - block widget': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="testwidget" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				var handlerContainer = widget.dragHandlerContainer,
					handler = handlerContainer.findOne( 'img' );

				assert.isTrue( !!handlerContainer, 'drag handler container was set' );
				assert.areSame( widget.wrapper, handlerContainer.getParent() );
				assert.isTrue( handlerContainer.hasClass( 'cke_widget_drag_handler_container' ) );
				assert.isFalse( handler.hasAttribute( 'draggable' ) );
				assert.isTrue( handler.hasClass( 'cke_widget_drag_handler' ) );
				assert.isTrue( handler.hasAttribute( 'data-cke-widget-drag-handler' ) );
			} );
		},

		'test handler - inline widget': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">bar</span></p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				var handlerContainer = widget.dragHandlerContainer,
					handler = handlerContainer.findOne( 'img' );

				assert.isTrue( !!handlerContainer, 'drag handler container was set' );
				assert.areSame( widget.wrapper, handlerContainer.getParent() );
				assert.isTrue( handlerContainer.hasClass( 'cke_widget_drag_handler_container' ) );
				assert.areSame( 'true', handler.getAttribute( 'draggable' ) );
				assert.isTrue( handler.hasClass( 'cke_widget_drag_handler' ) );
				assert.isTrue( handler.hasAttribute( 'data-cke-widget-drag-handler' ) );
			} );
		},

		'test handler - positioning': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="testwidget" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					handlerContainer = widget.dragHandlerContainer;

				widget.wrapper.fire( 'mouseenter' );

				assert.areNotEqual( '', handlerContainer.getStyle( 'top' ), 'Handler should have top style.' );
				assert.areNotEqual( '', handlerContainer.getStyle( 'left' ), 'Handler should have left style.' );
			} );
		},

		'test handler - positioning on setData after delay': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="testwidget" id="w1">foo</p>', function() {
				wait( function() {
					var widget = getWidgetById( editor, 'w1' ),
						handlerContainer = widget.dragHandlerContainer;

					widget.setData( 'foo', 'bar' );

					assert.areNotEqual( '', handlerContainer.getStyle( 'top' ), 'Handler should have top style.' );
					assert.areNotEqual( '', handlerContainer.getStyle( 'left' ), 'Handler should have left style.' );
				}, 100 );
			} );
		},

		// Regression test for #11177, #11001.
		'test handler - initial position': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="testwidget" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					handlerContainer = widget.dragHandlerContainer;

				assert.areEqual( '', handlerContainer.getStyle( 'top' ), 'Handler should not have top style precalculated.' );
				assert.areEqual( '', handlerContainer.getStyle( 'left' ), 'Handler should not have top style precalculated.' );
			} );
		},

		'test widget.updateDragHandlerPosition - snapshot locking': function() {
			var editor = this.editor,
				snapshotLockCalled = 0,
				snapshotUnlockCalled = 0,
				setStylesCalled = 0;

			this.editorBot.setData( '<p data-widget="testwidget" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				editor.on( 'lockSnapshot', function() {
					snapshotLockCalled++;
				} );
				editor.on( 'unlockSnapshot', function() {
					snapshotUnlockCalled++;
				} );
				widget.dragHandlerContainer.setStyles = function() {
					setStylesCalled++;
				};

				widget.updateDragHandlerPosition();
				assert.areEqual( 1, snapshotLockCalled, 'lockSnapshot should be fired exactly once' );
				assert.areEqual( 1, snapshotUnlockCalled, 'unlockSnapshot should be fired exactly once' );
				assert.areEqual( 1, setStylesCalled, 'setStyles should be called exactly once' );

				// Now call it again, snapshot still should be locked only once.
				widget.updateDragHandlerPosition();
				assert.areEqual( 1, snapshotLockCalled, 'lockSnapshot should not be fired' );
				assert.areEqual( 1, snapshotUnlockCalled, 'unlockSnapshot should not be fired' );
				assert.areEqual( 1, setStylesCalled, 'setStyles should not be called' );
			} );
		},

		'test widget.updateDragHandlerPosition - editor dirty state': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="testwidget" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' );
				editor.resetDirty();
				widget.updateDragHandlerPosition();
				assert.isFalse( editor.checkDirty(), 'Editor should not be marked as dirty' );
			} );
		},

		// Regression test for http://dev.ckeditor.com/ticket/11177#comment:22
		'test handler - is repositioned on #data and mouseenter after widget reinitialization': function() {
			var editor = this.editor,
				updated = 0;

			this.editorBot.setData( '<p data-widget="testwidget" id="w1">foo</p>', function() {
				// We need to remove data-cke-expando to remove event listeners on IE8.
				editor.editable().setHtml( editor.editable().getHtml().replace( / data-cke-expando="?\d+"?/gi, '' ) );
				editor.widgets.checkWidgets();

				wait( function() {
					var widget = getWidgetById( editor, 'w1' );

					widget.dragHandlerContainer.setStyles = function( styles ) {
						// Be a little bit more precise - data may trigger other setStyles calls too.
						if ( styles.top && styles.left )
							updated++;
					};

					widget.setData( 'foo', 'bar' );
					assert.areEqual( 1, updated, 'position has been updated on widget#data' );

					delete widget._.dragHandlerOffset; // Drop cache.
					widget.wrapper.fire( 'mouseenter' );
					assert.areEqual( 2, updated, 'position has been updated on wrapper#mouseenter' );
				}, 100 );
			} );
		},

		'test dragstart': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = bender.tools.mockDropEvent();

				editor.focus();

				evt.setTarget( widget.dragHandlerContainer.findOne( 'img' ) );

				bender.tools.resumeAfter( editor, 'dragstart', function( evt ) {
					var dataTransfer = evt.data.dataTransfer,
						id = dataTransfer.getData( 'cke/widget-id' );

					assert.isNumber( id, 'Id should be a number.' );
					assert.areSame( id, getWidgetById( editor, 'w1' ).id, 'Id should match.' );
					assert.areSame( CKEDITOR.DATA_TRANSFER_INTERNAL, dataTransfer.getTransferType( editor ), 'Source editor should equal this.editor' );
				} );

				dragstart( editor, evt, widget );

				wait();
			} );
		},

		'test drop - no widget id': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = bender.tools.mockDropEvent(),
					widgetWasDestroyed = 0;

				widget.on( 'destroy', function() {
					widgetWasDestroyed += 1;
				} );

				dragstart( editor, evt, widget );

				drop( editor, evt );

				dragend( editor, evt, widget );

				assert.areSame( '<p><span data-widget="testwidget" id="w1">foo</span></p>', editor.getData() );
				assert.areSame( 0, widgetWasDestroyed, 'Original widget should not be destroyed' );
			} );
		},

		'test drop - not internal drop': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = { data: bender.tools.mockDropEvent() },
					widgetWasDestroyed = 0;

				widget.on( 'destroy', function() {
					widgetWasDestroyed += 1;
				} );

				CKEDITOR.plugins.clipboard.initDragDataTransfer( evt );
				evt.data.dataTransfer.setData( 'cke/widget-id', getWidgetById( editor, 'w1' ).id );

				drop( editor, evt.data );

				assert.areSame( '<p><span data-widget="testwidget" id="w1">foo</span></p>', editor.getData() );
				assert.areSame( 0, widgetWasDestroyed, 'Original widget should not be destroyed' );
			} );
		},

		'test drop - cross-editor drop': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p class="x">foo</p><p><b>x<span data-widget="testwidget" id="w1">foo</span>x</b></p>', function() {
				var evt = { data: bender.tools.mockDropEvent() },
					range = editor.createRange(),
					dropCalled = false,
					dropNotCancelled = false;

				CKEDITOR.plugins.clipboard.initDragDataTransfer( evt );
				evt.data.dataTransfer.setData( 'cke/widget-id', getWidgetById( editor, 'w1' ).id );

				// Not really a cross-editor drop. We're just making it appear so.
				evt.data.dataTransfer.sourceEditor = {};

				range.setStart( editor.document.findOne( '.x' ).getFirst(), 1 );
				range.collapse( true );
				evt.data.testRange = range;

				editor.once( 'drop', function() {
					dropCalled = true;
				}, null, null, 1 );

				editor.once( 'drop', function() {
					dropNotCancelled = true;
				}, null, null, 999 );

				drop( editor, evt.data, range );

				assert.areSame( true, dropCalled, 'the drop event should have been called' );
				assert.areSame( false, dropNotCancelled, 'the drop event should have been cancelled' );
			} );
		},

		'test drop - wrong widget id': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = { data: bender.tools.mockDropEvent() },
					widgetWasDestroyed = 0;

				editor.focus();

				widget.on( 'destroy', function() {
					widgetWasDestroyed += 1;
				} );

				CKEDITOR.plugins.clipboard.initDragDataTransfer( evt );
				evt.data.dataTransfer.setData( 'cke/widget-id', -1 );

				dragstart( editor, evt.data, widget );

				drop( editor, evt.data );

				dragend( editor, evt.data, widget );

				wait( function() {
					assert.areSame( '<p><span data-widget="testwidget" id="w1">foo</span></p>', editor.getData() );
					assert.areSame( 0, widgetWasDestroyed, 'Original widget should not be destroyed' );
				}, 10 );
			} );
		},

		'test drop - successful drag and drop': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p class="x">foo</p><p>x<span data-widget="testwidget" id="w1">foo</span>x</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = { data: bender.tools.mockDropEvent() },
					range = editor.createRange(),
					widgetWasDestroyedCounter = sinon.spy(),
					widgetCreatedCounter = sinon.spy(),
					pasteCounter = sinon.spy(),
					dragstartCounter = sinon.spy(),
					dragendCounter = sinon.spy(),
					dropCounter = sinon.spy();

				widget.on( 'destroy', widgetWasDestroyedCounter );

				editor.focus();

				editor.widgets.on( 'instanceCreated', widgetCreatedCounter );

				editor.on( 'paste', pasteCounter );
				editor.on( 'dragstart', dragstartCounter );
				editor.on( 'dragend', dragendCounter );
				editor.on( 'drop', dropCounter );

				bender.tools.resumeAfter( editor, 'afterPaste', function() {
					assert.isTrue( pasteCounter.calledOnce, 'paste called once' );
					assert.isTrue( dragstartCounter.calledOnce, 'dragstart called once' );
					assert.isTrue( dragendCounter.calledOnce, 'dragend called once' );
					assert.isTrue( dropCounter.calledOnce, 'drop called once' );
					assert.isTrue( widgetWasDestroyedCounter.calledOnce, 'original widget was destroyed' );
					assert.areSame( '<p class="x">f<span data-widget="testwidget" id="w1">foo</span>oo</p><p>xx</p>', editor.getData() );
					assert.isTrue( widgetCreatedCounter.calledOnce, 'new widget was created' );
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

		'test drop widget with formating': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p class="x">foo</p><p><b>x<span data-widget="testwidget" id="w1">foo</span>x</b></p>', function() {
				var evt = { data: bender.tools.mockDropEvent() },
					range = editor.createRange();

				editor.focus();

				bender.tools.resumeAfter( editor, 'afterPaste', function() {
					assert.areSame( '<p class="x">f<b><span data-widget="testwidget" id="w1">foo</span></b>oo</p><p><b>xx</b></p>', editor.getData() );
				} );

				// Ensure async.
				wait( function() {
					var widget = getWidgetById( editor, 'w1' );

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

		'test drag and drop - block widget': function() {
			var editor = this.editor,
				pasteCounter = sinon.spy(),
				dragstartCounter = sinon.spy(),
				dragendCounter = sinon.spy(),
				dropCounter = sinon.spy();

			editor.on( 'paste', pasteCounter );
			editor.on( 'dragstart', dragstartCounter );
			editor.on( 'dragend', dragendCounter );
			editor.on( 'drop', dropCounter );

			// Override Finder's getRange to force a place for the
			// widget to be dropped.
			var revert = bender.tools.replaceMethod( CKEDITOR.plugins.lineutils.finder.prototype, 'getRange', function() {
				var range = editor.createRange();

				range.moveToPosition( editor.document.getById( 'a' ), CKEDITOR.POSITION_BEFORE_START );

				return range;
			} );

			this.editorBot.setData( '<p id="a">foo</p><div data-widget="testwidget" id="w1">bar</div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					img = widget.dragHandlerContainer.findOne( 'img' );

				editor.focus();

				try {
					// Testing if widget is selected is meaningful only if it is not selected at the beginning. (#13129)
					assert.isNull( editor.widgets.focused, 'widget not focused before mousedown' );

					img.fire( 'mousedown' );

					// Create dummy line and pretend it's visible to cheat drop listener
					// making if feel that there's a place for the widget to be dropped.
					editor.widgets.liner.showLine( editor.widgets.liner.addLine() );

					editor.document.fire( 'mouseup' );

					assert.areSame( widget, editor.widgets.focused, 'widget focused after mouseup' );

					bender.tools.resumeAfter( editor, 'afterPaste', function() {
						assert.isTrue( pasteCounter.calledOnce, 'paste called once' );
						assert.isTrue( dragstartCounter.calledOnce, 'dragstart called once' );
						assert.isTrue( dragendCounter.calledOnce, 'dragend called once' );
						assert.isTrue( dropCounter.calledOnce, 'drop called once' );
						assert.areSame( '<div data-widget="testwidget" id="w1">bar</div><p id="a">foo</p>', editor.getData(), 'Widget moved on drop.' );

						// Check if widget is still selected after undo. (#13129)
						editor.execCommand( 'undo' );
						assert.areSame( getWidgetById( editor, 'w1' ), editor.widgets.focused, 'widget focused after undo' );
					} );

					wait();
				} catch ( e ) {
					throw e;
				} finally {
					revert();
				}
			} );
		},

		'test drag and drop - block widget into widget in nested editable': function() {
			var editor = this.editor,
				html = '<div data-widget="testwidget4" id="w4">' +
					'<div class="n1">' +
						'<div data-widget="testwidget4" id="w4a">' +
							'<div class="n1">' +
								'<p>x</p>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>';

			this.editorBot.setData( html, function() {
				var repo = editor.widgets,
					finder = repo.finder;

				repo._.draggedWidget = getWidgetById( editor, 'w4' );
				finder.greedySearch();

				assertRelations( editor, finder, '|<div data-widget="testwidget4" id="w4"><div class="n1"><div data-widget="testwidget4" id="w4a"><div class="n1"><p>x</p></div></div></div></div>|' );
			} );
		},

		'test drag and drop - block widget into nested editable (ACF)': function() {
			var editor = this.editor,
				html = '<div data-widget="testwidget2">' +
					'<div class="n1">' +
						'<p>x</p>' +
					'</div>' +
					'<div class="n2">' +
						'<p>y</p>' +
					'</div>' +
				'</div>' +
				'<blockquote data-widget="testwidget3" class="testwidget3" id="w3">testwidget3</blockquote>';

			this.editorBot.setData( html, function() {
				var widget = getWidgetById( editor, 'w3' ),
					repo = editor.widgets,
					finder = repo.finder;

				// Detach dragged widget from DOM to make assertion simpler.
				widget.wrapper.remove();
				repo._.draggedWidget = widget;
				finder.greedySearch();

				assertRelations( editor, finder, '|<div data-widget="testwidget2"><div class="n1">|<p>x</p>|</div><div class="n2"><p>y</p></div></div>|' );
			} );
		},

		'test drag and drop - block widget into nested editable (ACF) - no filter': function() {
			var editor = this.editor,
				html = '<div data-widget="testwidget4">' +
					'<div class="n1">' +
						'<p>x</p>' +
					'</div>' +
				'</div>' +
				'<blockquote data-widget="testwidget3" class="testwidget3" id="w3">testwidget3</blockquote>';

			this.editorBot.setData( html, function() {
				var widget = getWidgetById( editor, 'w3' ),
					repo = editor.widgets,
					finder = repo.finder;

				// Detach dragged widget from DOM to make assertion simpler.
				widget.wrapper.remove();
				repo._.draggedWidget = widget;
				finder.greedySearch();

				assertRelations( editor, finder, '|<div data-widget="testwidget4"><div class="n1">|<p>x</p>|</div></div>|' );
			} );
		},

		'test drag and drop - block widget into nested editable (ACF) - self-drop': function() {
			var editor = this.editor,
				html = '<div data-widget="testwidget4" id="w4">' +
					'<div class="n1">' +
						'<p>x</p>' +
					'</div>' +
				'</div>';

			this.editorBot.setData( html, function() {
				var repo = editor.widgets,
					finder = repo.finder;

				repo._.draggedWidget = getWidgetById( editor, 'w4' );
				finder.greedySearch();

				assertRelations( editor, finder, '|<div data-widget="testwidget4" id="w4"><div class="n1"><p>x</p></div></div>|' );
			} );
		}
	} );
} )();

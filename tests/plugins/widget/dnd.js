/* bender-tags: editor,unit,widgetcore */
/* bender-ckeditor-plugins: widget,undo,clipboard */

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

	var fixHtml = widgetTestsTools.fixHtml,
		getWidgetById = widgetTestsTools.getWidgetById,
		assertRelations = lineutilsTestsTools.assertRelations;

	function dropEvent( data, range ) {
		var evt = new CKEDITOR.dom.event( {
			dataTransfer: {
				getData: function( type ) {
					assert.areSame( 'text', type, 'retrieved data type' );
					return data;
				}
			}
		} );

		evt.testRange = range;

		return evt;
	}

	function dragstart( editor, evt ) {
		var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor );

		dropTarget.fire( 'dragstart', evt );
	}

	function drop( editor, evt ) {
		var dropTarget = CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? editor.editable() : editor.document;

		dropTarget.fire( 'drop', evt );
	}

	function dragend( editor, evt ) {
		var dropTarget = CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? editor.editable() : editor.document;

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

				dragstart( editor, evt );

				var dataTransfer = CKEDITOR.plugins.clipboard.initDragDataTransfer( { data: evt  } ),
					id = dataTransfer.getData( 'cke/widget-id' );

				assert.isNumber( id, 'Id should be a number.' );
				assert.areSame( id, getWidgetById( editor, 'w1' ).id, 'Id should match.' );
				assert.areSame( CKEDITOR.DATA_TRANSFER_INTERNAL, dataTransfer.getTransferType( editor ), 'Source editor should equal this.editor' );
			} );
		},

		'test drop - no widget id': function() {
			var editor = this.editor,
				widgets = editor.widgets;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = bender.tools.mockDropEvent(),
					widgetWasDestroyed = 0;

				widget.on( 'destroy', function() {
					widgetWasDestroyed += 1;
				} );

				dragstart( editor, evt );

				drop( editor, evt );

				dragend( editor, evt );

				assert.areSame( '<p><span data-widget="testwidget" id="w1">foo</span></p>', editor.getData() );
				assert.areSame( 0, widgetWasDestroyed, 'Original widget should not be destroyed' );
			} );
		},

		'test drop - not internal drop': function() {
			var editor = this.editor,
				widgets = editor.widgets;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = bender.tools.mockDropEvent(),
					widgetWasDestroyed = 0;

				widget.on( 'destroy', function() {
					widgetWasDestroyed += 1;
				} );

				var dataTransfer = CKEDITOR.plugins.clipboard.initDragDataTransfer( { data: evt } );
				dataTransfer.setData( 'cke/widget-id', getWidgetById( editor, 'w1' ).id );

				drop( editor, evt );

				dragend( editor, evt );

				assert.areSame( '<p><span data-widget="testwidget" id="w1">foo</span></p>', editor.getData() );
				assert.areSame( 0, widgetWasDestroyed, 'Original widget should not be destroyed' );
			} );
		},

		'test drop - wrong widget id': function() {
			var editor = this.editor,
				widgets = editor.widgets;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = bender.tools.mockDropEvent(),
					widgetWasDestroyed = 0;

				widget.on( 'destroy', function() {
					widgetWasDestroyed += 1;
				} );

				var dataTransfer = CKEDITOR.plugins.clipboard.initDragDataTransfer( { data: evt } );
				dataTransfer.setData( 'cke/widget-id', -1 );

				dragstart( editor, evt );

				drop( editor, evt );

				dragend( editor, evt );

				assert.areSame( '<p><span data-widget="testwidget" id="w1">foo</span></p>', editor.getData() );
				assert.areSame( 0, widgetWasDestroyed, 'Original widget should not be destroyed' );
			} );
		},

		'test drop - successful drag and drop': function() {
			var editor = this.editor,
				widgets = editor.widgets;

			this.editorBot.setData( '<p class="x">foo</p><p>x<span data-widget="testwidget" id="w1">foo</span>x</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = bender.tools.mockDropEvent(),
					range = editor.createRange(),
					widgetWasDestroyed = 0;

				widget.on( 'destroy', function() {
					widgetWasDestroyed += 1;
				} );

				editor.focus();

				editor.on( 'afterPaste', function() {
					resume( function() {
						assert.areSame( 1, widgetWasDestroyed, 'original widget was destroyed' );
						assert.areSame( '<p class="x">f<span data-widget="testwidget" id="w1">foo</span>oo</p><p>xx</p>', editor.getData() );
						assert.areNotSame( widget.id, getWidgetById( editor, 'w1' ).id, 'new widet was created' );
					} );
				} );

				// Ensure async.
				wait( function() {
					dragstart( editor, evt );

					var dataTransfer = CKEDITOR.plugins.clipboard.initDragDataTransfer( { data: evt } );
					dataTransfer.setData( 'cke/widget-id', getWidgetById( editor, 'w1' ).id );

					range.setStart( editor.document.findOne( '.x' ).getFirst(), 1 );
					range.collapse( true );
					evt.testRange = range;

					drop( editor, evt );

					dragend( editor, evt );
				} );
			} );
		},

		'test drag and drop - block widget': function() {
			var editor = this.editor;

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
					img.fire( 'mousedown' );

					assert.isFalse( !!editor.getSelection().isFake, 'widget was not focused on mousedown' );

					// Create dummy line and pretend it's visible to cheat drop listener
					// making if feel that there's a place for the widget to be dropped.
					editor.widgets.liner.showLine( editor.widgets.liner.addLine() );

					editor.document.fire( 'mouseup' );

					assert.isTrue( !!editor.getSelection().isFake, 'widget was focused on mouseup' );

					assert.areSame( '<div data-widget="testwidget" id="w1">bar</div><p id="a">foo</p>', editor.getData(), 'Widget moved on drop.' );
				} catch ( e ) {
					throw e;
				} finally {
					revert();
				}
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
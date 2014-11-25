/* bender-tags: editor,unit,widgetcore */
/* bender-ckeditor-plugins: widget,undo,clipboard */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

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

	var getWidgetById = widgetTestsTools.getWidgetById;

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

	bender.test( {
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
					dataTransfer = [];

				widget.dragHandlerContainer.findOne( 'img' ).fire( 'dragstart', new CKEDITOR.dom.event( {
					dataTransfer: {
						setData: function( type, data ) {
							dataTransfer.push( { type: type, data: data } );
						}
					}
				} ) );

				assert.areSame( 1, dataTransfer.length );

				dataTransfer = dataTransfer[ 0 ];
				assert.areSame( 'text', dataTransfer.type );

				var data = JSON.parse( dataTransfer.data );
				assert.areSame( 'cke-widget', data.type, 'data.type' );
				assert.areSame( editor.name, data.editor, 'data.editor' );
				assert.areSame( widget.id, data.id, 'data.id' );
			} );
		},

		'test drop - no data': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				editor.document.fire( 'drop', dropEvent( null ) );

				assert.areSame( '<p><span data-widget="testwidget" id="w1">foo</span></p>', editor.getData() );
			} );
		},

		'test drop - not a JSON data': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				editor.document.fire( 'drop', dropEvent( '0123abcd' ) );

				assert.areSame( '<p><span data-widget="testwidget" id="w1">foo</span></p>', editor.getData() );
			} );
		},

		'test drop - not a widget data': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				editor.document.fire( 'drop', dropEvent( JSON.stringify( { type: 'foo', editor: editor.name, id: widget.id } ) ) );

				assert.areSame( '<p><span data-widget="testwidget" id="w1">foo</span></p>', editor.getData() );
			} );
		},

		// Eg. editor from different frame.
		'test drop - dragging from non-existing editor': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
				editor.document.fire( 'drop', dropEvent( JSON.stringify( { type: 'cke-widget', editor: 'othereditor', id: 999 } ) ) );

				assert.areSame( '<p><span data-widget="testwidget" id="w1">foo</span></p>', editor.getData() );
			} );
		},

		'test drop - dragging from other editor': function() {
			var editor1 = this.editor,
				bot1 = this.editorBot;

			bender.editorBot.create( {
				name: 'test_editor2',
				config: {
					allowedContent: true,
					on: {
						pluginsLoaded: function( evt ) {
							evt.editor.dataProcessor.writer.sortAttributes = 1;
							evt.editor.widgets.add( 'testwidget', {} );
						}
					}
				},
				startupData: '<p id="x2">foo</p><p><span data-widget="testwidget" id="w2">foo</span></p>'
			}, function( bot2 ) {
				var editor2Widget = getWidgetById( bot2.editor, 'w2' );

				assert.isTrue( !!editor2Widget, 'widget was initialized in second editor' );

				bot1.setData( '<p id="x1">foo</p><p><span data-widget="testwidget" id="w1">foo</span></p>', function() {
					editor1.document.fire( 'drop', dropEvent( JSON.stringify(
						{ type: 'cke-widget', editor: 'test_editor2', id: editor2Widget.id }
					) ) );

					assert.areSame( '<p id="x1">foo</p><p><span data-widget="testwidget" id="w1">foo</span></p>', editor1.getData() );
					assert.areSame( '<p id="x2">foo</p><p><span data-widget="testwidget" id="w2">foo</span></p>', bot2.editor.getData() );
				} );
			} );
		},

		'test drop - dragging within one editor': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p class="x">foo</p><p>x<span data-widget="testwidget" id="w1">foo</span>x</p>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					range = editor.createRange(),
					widget1WasDestroyed = 0;

				editor.focus();

				range.setStart( editor.document.findOne( '.x' ).getFirst(), 1 );
				range.collapse( true );

				widget1.on( 'destroy', function() {
					widget1WasDestroyed += 1;
				} );

				editor.on( 'afterPaste', function() {
					resume( function() {
						assert.areSame( 1, widget1WasDestroyed, 'original widget was destroyed' );
						assert.areSame( '<p class="x">f<span data-widget="testwidget" id="w1">foo</span>oo</p><p>xx</p>', editor.getData() );
						assert.areNotSame( widget1.id, getWidgetById( editor, 'w1' ).id, 'new widet was created' );
					} );
				} );

				// Ensure async.
				wait( function() {
					var dropContainer = CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? editor.editable() : editor.document;

					dropContainer.fire( 'drop', dropEvent(
						JSON.stringify( { type: 'cke-widget', editor: editor.name, id: widget1.id } ),
						range
					) );
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
		}
	} );
} )();
/* bender-tags: editor,unit,widgetcore */
/* bender-ckeditor-plugins: widget,undo,clipboard */

( function() {
	'use strict';

	var fixHtml = widgetTestsTools.fixHtml,
		obj2Array = widgetTestsTools.obj2Array,
		getWidgetById = widgetTestsTools.getWidgetById;

	var widgetData =
		'<div data-widget="testcontainer" id="wp-x">' +
			'<div class="ned">' +
				'<h1 data-widget="test1" id="wn-x-0">foo</h1>' +
				'<p id="p-x">bar</p>' +
				'<p class="test1" id="wn-x-1">foo</p>' +
			'</div>' +
		'</div>';

	// Returns widgetData template repeated given times with replaced
	// unique ids like wn-0-1 and wp-0 (x gets replaced) and separated from each other with <p>xxx</p>.
	function generateWidgetsData( howMany ) {
		var html = [];
		for ( var i = 0; i < howMany; ++i )
			html.push( widgetData.replace( /w([pn])-x/g, 'w$1-' + i ).replace( /p-x/g, 'p-' + i ) );

		return html.join( '<p>xxx</p>' );
	}

	function assertWidget( editor, id, widgetName, elementName, msg ) {
		var widget = getWidgetById( editor, id );

		assert.isNotNull( widget, msg );
		assert.areSame( widgetName, widget.name, msg + ' - widget name' );
		assert.areSame( elementName, widget.element.getName(), msg + ' - element name' );
	}

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				editor: {
					name: 'editor1',
					creator: 'inline', // Speed.
					config: {
						allowedContent: true
					}
				},
			}, function( editors, bots ) {
				var name, editor;

				for ( name in editors ) {
					editor = editors[ name ];
					editor.dataProcessor.writer.sortAttributes = 1;
					editor.widgets.add( 'testcontainer', {
						editables: {
							ned: '.ned'
						}
					} );
					editor.widgets.add( 'test1', {
						upcast: function( el ) {
							return el.hasClass( 'test1' );
						}
					} );
				}

				that.editorBots = bots;
				that.editors = editors;
				that.callback();
			} );
		},

		'test init nested widgets on editor.setData': function() {
			var editor = this.editors.editor,
				instances = 0;

			var listener = editor.widgets.on( 'instanceCreated', function() {
				instances += 1;
			} );

			this.editorBots.editor.setData( generateWidgetsData( 2 ), function() {
				listener.removeListener();

				assert.areSame( 6, instances, '6 instances were created' );
				assertWidget( editor, 'wp-0', 'testcontainer', 'div', 'container widget 0' );
				assertWidget( editor, 'wp-1', 'testcontainer', 'div', 'container widget 1' );
				assertWidget( editor, 'wn-0-0', 'test1', 'h1', 'nested 0,0 widget' );
				assertWidget( editor, 'wn-0-1', 'test1', 'p', 'nested 0,1 widget' );
				assertWidget( editor, 'wn-1-0', 'test1', 'h1', 'nested 1,0 widget' );
				assertWidget( editor, 'wn-1-1', 'test1', 'p', 'nested 1,1 widget' );
			} );
		},

		'test init nested widgets on nestedEditable.setData': function() {
			var editor = this.editors.editor;

			this.editorBots.editor.setData( generateWidgetsData( 2 ), function() {
				var widget = getWidgetById( editor, 'wp-0' ),
					instances = 0;

				var listener = editor.widgets.on( 'instanceCreated', function() {
					instances += 1;
				} );

				widget.editables.ned.setData( '<h2 class="test1" id="wx">foo</h2>' );

				listener.removeListener();
				assert.areSame( 1, instances, 'one insantance created' );
				assertWidget( editor, 'wx', 'test1', 'h2', 'instance' );
			} );
		},

		'test init nested widgets when pasting widget with nested widgets': function() {
			var editor = this.editors.editor;

			this.editorBots.editor.setData( '<p id="pasteTarget">foo</p>' + generateWidgetsData( 2 ), function() {
				var widget = getWidgetById( editor, 'wp-0' ),
					widgetHtml = widget.wrapper.getHtml();

				assert.areSame( 6, obj2Array( editor.widgets.instances ).length, '6 after setData' );
				widget.wrapper.remove();

				editor.widgets.checkWidgets();
				assert.areSame( 3, obj2Array( editor.widgets.instances ).length, '3 widgets before paste' );

				var range = editor.createRange(),
					nestedEditable = getWidgetById( editor, 'wp-1' ).editables.ned;

				// Set the selection inside editable <p> in 2nd widget's nested editable.
				nestedEditable.focus();
				range.setStartAt( nestedEditable.findOne( '#p-1' ), CKEDITOR.POSITION_AFTER_START );
				range.select();

				editor.once( 'afterPaste', function() {
					resume( function() {
						assert.areSame( 6, obj2Array( editor.widgets.instances ).length, '6 after paste' );
						assertWidget( editor, 'wp-0', 'testcontainer', 'div', 'container widget 0' );
						assertWidget( editor, 'wn-0-0', 'test1', 'h1', 'nested 0,0 widget' );
						assertWidget( editor, 'wn-0-1', 'test1', 'p', 'nested 0,1 widget' );
					} );
				} );

				// Ensure async.
				wait( function() {
					editor.execCommand( 'paste', widgetHtml );
				} );
			} );
		},

		'test init nested widgets when pasting into nested editable': function() {
			var editor = this.editors.editor;

			this.editorBots.editor.setData( generateWidgetsData( 2 ), function() {
				var widget = getWidgetById( editor, 'wp-0' ),
					widgetHtml = widget.wrapper.getHtml();

				assert.areSame( 6, obj2Array( editor.widgets.instances ).length, '6 after setData' );
				widget.wrapper.remove();

				editor.widgets.checkWidgets();
				assert.areSame( 3, obj2Array( editor.widgets.instances ).length, '3 widgets before paste' );

				var range = editor.createRange();
				getWidgetById( editor, 'wp-1' ).editables.ned.focus();
				range.setStartAt( editor.document.getById( 'p-1' ), CKEDITOR.POSITION_AFTER_START );
				range.select();

				editor.once( 'afterPaste', function() {
					resume( function() {
						assert.areSame( 6, obj2Array( editor.widgets.instances ).length, '6 after paste' );
						assertWidget( editor, 'wp-0', 'testcontainer', 'div', 'container widget 0' );
						assertWidget( editor, 'wn-0-0', 'test1', 'h1', 'nested 0,0 widget' );
						assertWidget( editor, 'wn-0-1', 'test1', 'p', 'nested 0,1 widget' );

						assert.isTrue( getWidgetById( editor, 'wp-1' ).editables.ned.contains( getWidgetById( editor, 'wp-0' ).wrapper ),
							'verify that we pasted in the right place' );
					} );
				} );

				// Ensure async.
				wait( function() {
					editor.execCommand( 'paste', widgetHtml );
				} );
			} );
		},

		'test undo state after editor.setData': function() {
			var editor = this.editors.editor,
				undo = editor.getCommand( 'undo' );

			this.editorBots.editor.setHtmlWithSelection( '<p>^foo</p>' );
			editor.focus();
			editor.resetUndo();

			this.editorBots.editor.setData( generateWidgetsData( 1 ), function() {
				// Wait some additional time to include any asynchronous
				// effects of setting data.
				wait( function() {
					// Catch every yet unsaved changes.
					editor.fire( 'saveSnapshot' );

					assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'undoable after set data' );
					assertWidget( editor, 'wp-0', 'testcontainer', 'div', 'container widget 0' );
					assertWidget( editor, 'wn-0-0', 'test1', 'h1', 'nested 0,0 widget' );

					editor.execCommand( 'undo' );

					assert.areSame( '<p>foo</p>', editor.getData(), 'data after undo' );
					assert.areSame( 0, obj2Array( editor.widgets.instances ).length, '0 widgets after undo' );
				}, 50 );
			} );
		},

		'test widgets reinitialized after undo/redo': function() {
			var editor = this.editors.editor,
				undo = editor.getCommand( 'undo' ),
				redo = editor.getCommand( 'redo' );

			this.editorBots.editor.setData( generateWidgetsData( 1 ), function() {
				editor.resetUndo();
				editor.fire( 'saveSnapshot' );

				editor.editable().setHtml( '<p>foo</p>' );
				editor.widgets.checkWidgets();
				editor.fire( 'saveSnapshot' );

				assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'undoable after editable.setHtml' );
				assert.areSame( 0, obj2Array( editor.widgets.instances ).length, '0 widgets after undo' );

				editor.execCommand( 'undo' );
				editor.widgets.checkWidgets();

				assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'undo disabled after undoing' );
				assert.areSame( CKEDITOR.TRISTATE_OFF, redo.state, 'redoable after undoing' );
				assert.areSame( 3, obj2Array( editor.widgets.instances ).length, '3 widgets after undo' );

				editor.execCommand( 'redo' );
				editor.widgets.checkWidgets();

				assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'undoable after redoing' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo disabled after redoing' );
				assert.areSame( 0, obj2Array( editor.widgets.instances ).length, '0 widgets after redo' );
			} );
		},

		// #12022
		'test drag handler is created for every widget': function() {
			var editor = this.editors.editor;

			this.editorBots.editor.setData( generateWidgetsData( 1 ), function() {
				var w1 = getWidgetById( editor, 'wp-0' ),
					wn1 = getWidgetById( editor, 'wn-0-0' ),
					wn2 = getWidgetById( editor, 'wn-0-1' );

				assert.areSame( w1.wrapper, w1.dragHandlerContainer.getParent(), 'main widget\'s drag handler is directly in the wrapper' );
				assert.areSame( wn1.wrapper, wn1.dragHandlerContainer.getParent(), '1st nested widget\'s drag handler is directly in the wrapper' );
				assert.areSame( wn2.wrapper, wn2.dragHandlerContainer.getParent(), '2nd nested widget\'s drag handler is directly in the wrapper' );
			} );
		}

	} );
} )();
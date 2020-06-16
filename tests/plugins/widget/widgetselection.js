/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,undo,sourcearea */
/* bender-ckeditor-remove-plugins: tableselection */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	var getWidgetById = widgetTestsTools.getWidgetById;

	function clickElement( editor, element, callback, noMouseup ) {
		editor.document.fire( 'mousedown', new CKEDITOR.dom.event( { target: element.$ } ) );
		!noMouseup && editor.document.fire( 'mouseup', new CKEDITOR.dom.event( {} ) );

		wait( function() {
			callback();
		}, 10 );
	}

	function clickWidget( editor, widget, callback ) {
		clickElement( editor, widget.element, callback );
	}

	function listen( editor, widgets ) {
		var that = {
			listeners: [],

			reset: function() {
				CKEDITOR.tools.extend( that, {
					selection: null,
					selectedWidget: null,
					selectionChange: 0,
					repoWidgetsFocused: [],
					repoWidgetsBlurred: [],
					widgetsFocused: [],
					widgetsBlurred: [],
					widgetsSelected: [],
					widgetsDeselected: [],
					widgetFocusedOnSelectionChange: null
				}, true );
			},

			removeListeners: function() {
				var listener;

				while ( ( listener = that.listeners.pop() ) )
					listener.removeListener();
			}
		};


		that.listeners.push( editor.on( 'selectionChange', function( evt ) {
			that.selectionChange++;
			that.selection = evt.data.selection;
			that.widgetFocusedOnSelectionChange = editor.widgets.focused;
		} ) );

		that.listeners.push( editor.widgets.on( 'widgetFocused', function( evt ) {
			that.repoWidgetsFocused.push( evt.data.widget );
		} ) );

		that.listeners.push( editor.widgets.on( 'widgetBlurred', function( evt ) {
			that.repoWidgetsBlurred.push( evt.data.widget );
		} ) );

		for ( var i = 0; i < widgets.length; ++i )
			addWidgetListeners( that, widgets[ i ] );

		that.reset();
		return that;
	}

	function addWidgetListeners( that, widget ) {
		that.listeners.push( widget.on( 'focus', function() {
			that.widgetsFocused.push( widget );
		} ) );
		that.listeners.push( widget.on( 'blur', function() {
			that.widgetsBlurred.push( widget );
		} ) );
		that.listeners.push( widget.on( 'select', function() {
			that.widgetsSelected.push( widget );
		} ) );
		that.listeners.push( widget.on( 'deselect', function() {
			that.widgetsDeselected.push( widget );
		} ) );
	}

	function assertHasBeenFocused( editor, widget ) {
		assert.areSame( widget, editor.widgets.focused, 'widgets.focused' );
		assert.isTrue( widget.wrapper.hasClass( 'cke_widget_focused' ), 'wrapper has cke_widget_focused class' );
		assertHasBeenSelected( editor, widget );
	}

	function assertHasBeenSelected( editor, widget ) {
		arrayAssert.contains( widget, editor.widgets.selected, 'widgets.selected' );
		assert.isTrue( widget.wrapper.hasClass( 'cke_widget_selected' ), 'wrapper has cke_widget_selected class' );
	}

	function assertHasBeenBlurred( editor, widget, noFocusedCheck ) {
		if ( !noFocusedCheck )
			assert.isNull( editor.widgets.focused, 'widgets.focused' );
		assert.isFalse( widget.wrapper.hasClass( 'cke_widget_focused' ), 'wrapper does not have cke_widget_focused class' );
		assertHasBeenDeselected( editor, widget );
	}

	function assertHasBeenDeselected( editor, widget ) {
		arrayAssert.doesNotContain( widget, editor.widgets.selected, 'widgets.selected' );
		assert.isFalse( widget.wrapper.hasClass( 'cke_widget_selected' ), 'wrapper does not have cke_widget_selected class' );
	}

	function assertFakeSelection( selection, element ) {
		assert.isTrue( !!selection.isFake, 'sel.fake' );
		assert.areSame( element, selection.getSelectedElement(), 'selected element when focusing widget' );
	}

	function assertNoFakeSelection( selection, element ) {
		assert.isFalse( !!selection.isFake, 'sel.fake' );
		assert.areNotSame( element, selection.getSelectedElement(), 'selected element when focusing widget' );
	}

	function assertWidgetsEvents( result, expectedFocused, expectedSelected, expectedBlurred, expectedDeselected ) {
		// Stupid arrayAssert does not log helpful message, so help him by checking lengths separately.
		assert.areSame( expectedFocused.length, result.widgetsFocused.length, 'widget.focus length' );
		assert.areSame( expectedSelected.length, result.widgetsSelected.length, 'widget.select length' );
		assert.areSame( expectedBlurred.length, result.widgetsBlurred.length, 'widget.blur length' );
		assert.areSame( expectedDeselected.length, result.widgetsDeselected.length, 'widget.deselect length' );

		arrayAssert.itemsAreSame( expectedFocused.sort( compareWidgets ),
			result.widgetsFocused.slice( 0 ).sort( compareWidgets ), 'widget.focus' );
		arrayAssert.itemsAreSame( expectedSelected.sort( compareWidgets ),
			result.widgetsSelected.slice( 0 ).sort( compareWidgets ), 'widget.select' );
		arrayAssert.itemsAreSame( expectedBlurred.sort( compareWidgets ),
			result.widgetsBlurred.slice( 0 ).sort( compareWidgets ), 'widget.blur' );
		arrayAssert.itemsAreSame( expectedDeselected.sort( compareWidgets ),
			result.widgetsDeselected.slice( 0 ).sort( compareWidgets ), 'widget.deselect' );
	}

	function assertRepoEvents( result, expectedFocused, expectedBlurred ) {
		// Stupid arrayAssert does not log helpful message, so help him by checking lengths separately.
		assert.areSame( expectedFocused.length, result.repoWidgetsFocused.length, 'repo.widgetFocused length' );
		arrayAssert.itemsAreSame( expectedFocused, result.repoWidgetsFocused, 'repo.widgetFocused' );

		assert.areSame( expectedBlurred.length, result.repoWidgetsBlurred.length, 'repo.widgetBlurred length' );
		arrayAssert.itemsAreSame( expectedBlurred, result.repoWidgetsBlurred, 'repo.widgetBlurred' );
	}

	function compareWidgets( wa, wb ) {
		return wa.id - wb.id;
	}

	var multipleWidgetsTpl =
		'<p>0</p>' + // Will grab initial selection.
		'<p id="p1">A</p><div data-widget="testfocus{num}" id="w1">foo</div>' +
		'<p id="p2">B</p><div data-widget="testfocus{num}" id="w2">bar</div>' +
		'<p id="p3">C</p><div data-widget="testfocus{num}" id="w3">bom</div>' +
		'<p id="p4">D</p>';

	bender.test( {
		'test focusing widget': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'testfocus1', {} );
			editor.focus();

			bot.setData( '<p id="a">foo</p><div data-widget="testfocus1" id="x">bar</div><div data-widget="testfocus1">bom</div>', function() {
				editor.getSelection().selectElement( editor.document.getById( 'a' ) );

				var widget = getWidgetById( editor, 'x' ),
					result = listen( editor, [ widget ] );

				widget.focus();

				result.removeListeners();

				assert.areSame( 1, result.selectionChange, 'selectionChange has been fired once when focusing widget' );
				assertFakeSelection( result.selection, widget.wrapper );
				assert.areSame( widget, result.widgetFocusedOnSelectionChange, 'widget was already focused on selectionChange' );

				assertRepoEvents( result, [ widget ], [] );

				assertHasBeenFocused( editor, widget );
				assertWidgetsEvents( result, [ widget ], [ widget ], [], [] );

				result = listen( editor, [ widget ] );

				bot.setData( '<p>foo</p>', function() {
					result.removeListeners();

					// Events should not be fired because on dataReady widgets are already offline.
					assertRepoEvents( result, [], [] );
					assertWidgetsEvents( result, [], [], [], [] );

					assert.isNull( editor.widgets.focused, 'widgets.focused after set data' );
					assert.areSame( 0, editor.widgets.selected.length, 'widgets.selected after set data' );
					assert.isFalse( !!result.widgetFocusedOnSelectionChange, 'widget was already blurred on selectionChange' );
				} );
			} );
		},

		'test blurring widget': function() {
			var editor = this.editor;

			editor.widgets.add( 'testfocus2', {} );
			editor.focus();

			this.editorBot.setData( '<p id="a">foo</p><div data-widget="testfocus2" id="x">bar</div><div data-widget="testfocus2">bom</div>', function() {
				var widget = getWidgetById( editor, 'x' );

				widget.focus();

				var result = listen( editor, [ widget ] );

				editor.getSelection().selectElement( editor.document.getById( 'a' ) );

				result.removeListeners();

				assert.areSame( 1, result.selectionChange, 'selectionChange has been fired once when blurring widget' );
				assertNoFakeSelection( result.selection, widget.wrapper );
				assert.isFalse( !!result.widgetFocusedOnSelectionChange, 'widget was already blurred on selectionChange' );

				assertRepoEvents( result, [], [ widget ] );

				assertHasBeenBlurred( editor, widget );
				assertWidgetsEvents( result, [], [], [ widget ], [ widget ] );
			} );
		},

		'test focusing 2 widgets in a row': function() {
			var editor = this.editor;

			editor.widgets.add( 'testfocus3', {} );
			editor.focus();

			this.editorBot.setData( '<div data-widget="testfocus3" id="x">bar</div><div data-widget="testfocus3" id="y">bom</div>', function() {
				var widgetX = getWidgetById( editor, 'x' ),
					widgetY = getWidgetById( editor, 'y' );

				widgetX.focus();

				var result = listen( editor, [ widgetX, widgetY ] );

				widgetY.focus();

				result.removeListeners();

				assert.areSame( 1, result.selectionChange, 'selectionChange has been fired once' );
				assertFakeSelection( result.selection, widgetY.wrapper );
				assert.areSame( widgetY, result.widgetFocusedOnSelectionChange, 'widget was already focused on selectionChange' );

				assertRepoEvents( result, [ widgetY ], [ widgetX ] );

				assertHasBeenBlurred( editor, widgetX, true );
				assertHasBeenFocused( editor, widgetY );
				assertWidgetsEvents( result, [ widgetY ], [ widgetY ], [ widgetX ], [ widgetX ] );
			} );
		},

		'test widgets in selection': function() {
			var editor = this.editor;

			editor.widgets.add( 'testfocus4', {} );
			editor.focus();

			this.editorBot.setData( multipleWidgetsTpl.replace( /\{num\}/g, '4' ), function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					widget2 = getWidgetById( editor, 'w2' ),
					widget3 = getWidgetById( editor, 'w3' ),
					doc = editor.document;

				var result = listen( editor, [ widget1, widget2, widget3 ] );

				// Select [A w1 B w2 C] w3 D.
				var range = editor.createRange();
				range.setStart( doc.getById( 'p1' ), 0 );
				range.setEnd( doc.getById( 'p3' ), 1 );
				range.select();

				result.removeListeners();

				assert.areSame( 1, result.selectionChange, 'selectionChange has been fired once' );
				assertHasBeenSelected( editor, widget1 );
				assertHasBeenSelected( editor, widget2 );
				assertRepoEvents( result, [], [] );
				assertWidgetsEvents( result, [], [ widget1, widget2 ], [], [] );

				result = listen( editor, [ widget1, widget2, widget3 ] );

				// Select A w1 [B w2 C w3 D].
				range.setStart( doc.getById( 'p2' ), 0 );
				range.setEnd( doc.getById( 'p4' ), 1 );
				range.select();

				result.removeListeners();

				assert.areSame( 1, result.selectionChange, 'selectionChange has been fired once' );
				assertHasBeenDeselected( editor, widget1 );
				assertHasBeenSelected( editor, widget3 );
				assertRepoEvents( result, [], [] );
				assertWidgetsEvents( result, [], [ widget3 ], [], [ widget1 ] );
			} );
		},

		'test focusing by click': function() {
			var editor = this.editor;

			editor.widgets.add( 'testfocus3', {} );
			editor.focus();

			this.editorBot.setData( '<p id="a">foo</p><div data-widget="testfocus3" id="x">bar</div><div data-widget="testfocus3" id="y">bom</div>', function() {
				var widgetX = getWidgetById( editor, 'x' ),
					widgetY = getWidgetById( editor, 'y' );

				editor.getSelection().selectElement( editor.document.getById( 'a' ) );

				var result = listen( editor, [ widgetX, widgetY ] );

				clickWidget( editor, widgetX, function() {
					result.removeListeners();

					assert.areSame( 1, result.selectionChange, 'selectionChange has been fired once' );
					assertFakeSelection( result.selection, widgetX.wrapper );
					assert.areSame( widgetX, result.widgetFocusedOnSelectionChange, 'widget was already focused on selectionChange' );

					assertRepoEvents( result, [ widgetX ], [] );

					assertHasBeenFocused( editor, widgetX );
					assertWidgetsEvents( result, [ widgetX ], [ widgetX ], [], [] );
				} );
			} );
		},

		'test focus editor when focusing widget by click': function() {
			var editor = this.editor;

			editor.widgets.add( 'testfocus4', {} );

			// Blur editor.
			CKEDITOR.document.getById( 'input' ).focus();

			this.editorBot.setData( '<p>foo</p><div data-widget="testfocus4" id="x">bar</div>', function() {
				// We need to wait for focusManager.
				wait( function() {
					var widget = getWidgetById( editor, 'x' );

					assert.isFalse( editor.focusManager.hasFocus, 'editor is blurred' );

					var result = listen( editor, [ widget ] );

					clickWidget( editor, widget, function() {
						result.removeListeners();

						assert.isTrue( result.selectionChange >= 1, 'selectionChange has been fired at least once' );
						assertFakeSelection( result.selection, widget.wrapper );
						assert.areSame( widget, result.widgetFocusedOnSelectionChange, 'widget was already focused on selectionChange' );

						assertRepoEvents( result, [ widget ], [] );

						assertHasBeenFocused( editor, widget );
						assertWidgetsEvents( result, [ widget ], [ widget ], [], [] );

						wait( function() {
							assert.isTrue( editor.focusManager.hasFocus, 'editor is focused' );
							assert.areSame( widget, editor.widgets.focused, 'widget is focused after editor gets focus' );
						}, 50 );
					} );
				}, 200 );
			} );
		},

		'test focus editor when focusing widget by method': function() {
			var editor = this.editor;

			editor.widgets.add( 'testfocus5', {} );

			// Blur editor.
			CKEDITOR.document.getById( 'input' ).focus();

			this.editorBot.setData( '<p>foo</p><div data-widget="testfocus5" id="x">bar</div>', function() {
				// We need to wait for focusManager.
				wait( function() {
					var widget = getWidgetById( editor, 'x' );

					assert.isFalse( editor.focusManager.hasFocus, 'editor is blurred' );

					var result = listen( editor, [ widget ] );

					widget.focus();

					result.removeListeners();

					assert.isTrue( result.selectionChange >= 1, 'selectionChange has been fired at least once' );
					assertFakeSelection( result.selection, widget.wrapper );
					assert.areSame( widget, result.widgetFocusedOnSelectionChange, 'widget was already focused on selectionChange' );

					assertRepoEvents( result, [ widget ], [] );

					assertHasBeenFocused( editor, widget );
					assertWidgetsEvents( result, [ widget ], [ widget ], [], [] );

					wait( function() {
						assert.isTrue( editor.focusManager.hasFocus, 'editor is focused' );
						assert.areSame( widget, editor.widgets.focused, 'widget is focused after editor gets focus' );
					}, 50 );
				}, 200 );
			} );
		},

		'test blur widget when editor blurs': function() {
			var editor = this.editor;

			editor.widgets.add( 'testfocus6', {} );

			this.editorBot.setData( '<p>foo</p><div data-widget="testfocus6" id="x">bar</div>', function() {
				var widget = getWidgetById( editor, 'x' );

				editor.focus();

				assert.isTrue( editor.focusManager.hasFocus, 'editor is focused' );

				widget.focus();

				assert.areSame( widget, editor.widgets.focused, 'widget is focused' );

				var result = listen( editor, [ widget ] );

				// Blur editor.
				CKEDITOR.document.getById( 'input' ).focus();

				wait( function() {
					result.removeListeners();

					assert.areSame( 0, result.selectionChange, 'selectionChange has not been fired' );
					assertFakeSelection( editor.getSelection(), widget.wrapper );
					assert.isFalse( !!result.widgetFocusedOnSelectionChange, 'widget was already blurred on selectionChange' );

					assertRepoEvents( result, [], [ widget ] );

					assert.isNull( editor.widgets.focused, 'widgets.focused' );
					assert.isFalse( widget.wrapper.hasClass( 'cke_widget_focused' ), 'wrapper does not have cke_widget_focused class' );
					assertWidgetsEvents( result, [], [], [ widget ], [] );

					assert.isFalse( editor.focusManager.hasFocus, 'editor is focused' );
				}, 200 );
			} );
		},

		'test clicking nested editable does not focus widget': function() {
			var editor = this.editor;

			editor.widgets.add( 'testfocus7', {
				editables: {
					foo: '#foo'
				}
			} );
			editor.focus();

			this.editorBot.setData( '<p id="a">foo</p><div data-widget="testfocus7" id="x">bar<div id="foo">bar</div></div>', function() {
				var widget = getWidgetById( editor, 'x' );
				editor.getSelection().selectElement( editor.document.getById( 'a' ) );

				var result = listen( editor, [ widget ] );

				// Nothing should happen...
				clickElement( editor, widget.editables.foo, function() {
					result.removeListeners();

					assert.areSame( 0, result.selectionChange, 'selectionChange has not been fired' );
					assertNoFakeSelection( editor.getSelection(), widget.wrapper );

					assertRepoEvents( result, [], [] );

					assertWidgetsEvents( result, [], [], [], [] );
				} );
			} );
		},

		'test mousedown on drag handler does not focus inline widget': function() {
			var editor = this.editor;

			editor.widgets.add( 'testfocus8', {
			} );
			editor.focus();

			this.editorBot.setData( '<p id="a">foo</p><p><span data-widget="testfocus8" id="x">bar</span></p>', function() {
				var widget = getWidgetById( editor, 'x' );
				editor.getSelection().selectElement( editor.document.getById( 'a' ) );

				var result = listen( editor, [ widget ] );

				// Nothing should happen...
				// Note: only mousedown is fired in D&D case.
				clickElement( editor, widget.dragHandlerContainer.findOne( 'img' ), function() {
					result.removeListeners();

					assert.areSame( 0, result.selectionChange, 'selectionChange has not been fired' );
					assertNoFakeSelection( editor.getSelection(), widget.wrapper );

					assertRepoEvents( result, [], [] );

					assertWidgetsEvents( result, [], [], [], [] );
				}, true );
			} );
		},

		// (#3352)
		'test refreshing selected widgets on key event': function() {
			var editor = this.editor;

			editor.widgets.add( 'testkeyrefresh', {} );
			editor.focus();

			this.editorBot.setData( '<p>foo</p><p><span data-widget="testkeyrefresh" id="x">bar</span></p><p>baz</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					range = editor.createRange(),
					domEvent = new CKEDITOR.dom.event( { keyCode: 65 } );

				range.selectNodeContents( editor.editable() );
				range.select();

				// This line ensures that without update on key event,
				// collection of selected widgets will be empty.
				editor.widgets.selected = [];

				setTimeout( function() {
					resume( function() {
						arrayAssert.itemsAreSame( [ widget ], editor.widgets.selected );
					} );
				}, 11 );

				editor.fire( 'key', { domEvent: domEvent } );
				wait();
			} );
		},

		// (#3704)
		'test integration of refreshing selected widgets on key event with source mode': function() {
			var editor = this.editor;

			editor.setMode( 'source', function() {
				resume( sourceCallback );
			} );
			wait();

			function sourceCallback() {
				var domEvent = new CKEDITOR.dom.event( { keyCode: 65 } ),
					stub = stubFire( editor );

				setTimeout( function() {
					resume( function() {
						editor.widgets.fire = stub.originalFire;

						assert.areSame( 0, stub.callCount(), 'Widget selection is not checked in source mode' );

						editor.setMode( 'wysiwyg', function() {
							resume( wysiwygCallback );
						} );
						wait();
					} );
				}, 50 );

				editor.fire( 'key', { domEvent: domEvent } );
				wait();
			}

			function wysiwygCallback() {
				var domEvent = new CKEDITOR.dom.event( { keyCode: 65 } ),
					stub = stubFire( editor );

				setTimeout( function() {
					resume( function() {
						editor.widgets.fire = stub.originalFire;

						assert.areSame( 1, stub.callCount(), 'Widget selection is checked on key in WYSIWYG mode' );
					} );
				}, 50 );

				editor.fire( 'key', { domEvent: domEvent } );
				wait();
			}

			function stubFire( editor ) {
				var originalFire = editor.widgets.fire,
					callCount = 0,
					stub = function( event ) {
						if ( event === 'checkSelection' ) {
							++callCount;
						}
					};

				editor.widgets.fire = stub;

				return {
					originalFire: originalFire,
					callCount: function() {
						return callCount;
					}
				};
			}
		}
	} );
} )();

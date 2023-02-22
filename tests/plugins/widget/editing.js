/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,dialog */
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

					evt.editor.widgets.add( 'test1', {
						template: '<div>foo</div>',
						dialog: 'widgettest1'
					} );

					evt.editor.widgets.add( 'test2', {
					} );

					CKEDITOR.dialog.add( 'widgettest1', function() {
						return {
							title: 'Test1',
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
										},
										{
											id: 'value2',
											type: 'text',
											label: 'Value 2',
											setup: function( widget ) {
												this.setValue( widget.data.value2 );
											},
											commit: function( widget ) {
												widget.setData( 'value2', this.getValue() );
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

	var fixHtml = widgetTestsTools.fixHtml,
		getWidgetById = widgetTestsTools.getWidgetById,
		replaceMethod = bender.tools.replaceMethod;

	bender.test( {
		'test edit method': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					openedDialog,
					retVal;

				var revert = replaceMethod( editor, 'openDialog', function( dialogName ) {
					openedDialog = dialogName;
				} );

				retVal = widget.edit();

				revert();

				assert.areSame( 'widgettest1', openedDialog );
				assert.isTrue( retVal, 'widget.edit() return value' );
			} );
		},

		'test edit method with no default dialog name': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test2" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					openedDialog = null,
					retVal;

				var revert = replaceMethod( editor, 'openDialog', function( dialogName ) {
					openedDialog = dialogName;
				} );

				retVal = widget.edit();

				revert();

				assert.isNull( openedDialog );
				assert.isFalse( retVal, 'widget.edit() return value' );
			} );
		},

		'test setting dialog name in edit event': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					openedDialog = null;

				var revert = replaceMethod( editor, 'openDialog', function( dialogName ) {
					openedDialog = dialogName;
				} );

				widget.once( 'edit', function( evt ) {
					evt.data.dialog = 'foofoo';
				} );

				widget.edit();

				revert();

				assert.areSame( 'foofoo', openedDialog );
			} );
		},

		'test cancelling dialog opening by cancelling event': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					openedDialog = null;

				var revert = replaceMethod( editor, 'openDialog', function( dialogName ) {
					openedDialog = dialogName;
				} );

				widget.once( 'edit', function( evt ) {
					evt.cancel();
				} );

				widget.edit();

				revert();

				assert.isNull( openedDialog );
			} );
		},

		'test cancelling doubleclick when widget.edit() returns true': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					widgetElement = editor.document.getById( 'x' ),
					retVal;

				// Doubleclick should be canceled if widget.edit() returns true.
				widget.edit = function() {
					return true;
				};

				retVal = editor.fire( 'doubleclick', { element: widgetElement } );

				assert.isFalse( retVal, 'editor#doubleclick should be canceled' );

				// Now opposite situation.
				widget.edit = function() {
					return false;
				};

				retVal = editor.fire( 'doubleclick', { element: widgetElement } );

				assert.isTrue( retVal !== false, 'editor#doubleclick should not be canceled' );
			} );
		},

		'test setting up data in dialog': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					value1,
					value2;

				widget.setData( {
					value1: 'foo',
					value2: 'bar'
				} );

				editor.once( 'dialogShow', function( evt ) {
					var dialog = evt.data;

					value1 = dialog.getValueOf( 'info', 'value1' );
					value2 = dialog.getValueOf( 'info', 'value2' );

					setTimeout( function() {
						dialog.hide();
					}, 50 );
				} );

				editor.once( 'dialogHide', function() {
					resume( function() {
						assert.areSame( 'foo', value1 );
						assert.areSame( 'bar', value2 );
					} );
				} );

				wait( function() {
					widget.edit();
				} );
			} );
		},

		'test saving dialog data': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					onData = 0;

				widget.setData( {
					value1: 'foo',
					value2: 'bar'
				} );

				widget.on( 'data', function() {
					onData += 1;
				} );

				editor.once( 'dialogShow', function( evt ) {
					var dialog = evt.data;

					dialog.setValueOf( 'info', 'value1', 'newfoo' );
					dialog.setValueOf( 'info', 'value2', 'newbar' );

					setTimeout( function() {
						dialog.getButton( 'ok' ).click();
					}, 50 );
				} );

				editor.once( 'dialogHide', function() {
					resume( function() {
						assert.areSame( 'newfoo', widget.data.value1 );
						assert.areSame( 'newbar', widget.data.value2 );
						assert.areSame( 1, onData, 'Updating two fields result in one data event' );
					} );
				} );

				wait( function() {
					widget.edit();
				} );
			} );
		},

		'test saving dialog data with no changes': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					onData = 0;

				widget.setData( {
					value1: 'foo',
					value2: 'bar'
				} );

				widget.on( 'data', function() {
					onData += 1;
				} );

				editor.once( 'dialogShow', function( evt ) {
					var dialog = evt.data;

					setTimeout( function() {
						dialog.getButton( 'ok' ).click();
					}, 50 );
				} );

				editor.once( 'dialogHide', function() {
					resume( function() {
						assert.areSame( 'foo', widget.data.value1 );
						assert.areSame( 'bar', widget.data.value2 );
						assert.areSame( 0, onData );
					} );
				} );

				wait( function() {
					widget.edit();
				} );
			} );
		},

		'test dialog event': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					dialogEventData, value1;

				widget.setData( 'value1', 'foofoo' );

				widget.on( 'dialog', function( evt ) {
					dialogEventData = evt.data;

					evt.cancel();
				} );

				editor.once( 'dialogShow', function( evt ) {
					var dialog = evt.data;

					value1 = dialog.getValueOf( 'info', 'value1' );

					setTimeout( function() {
						dialog.hide();
					}, 50 );
				} );

				editor.once( 'dialogHide', function() {
					resume( function() {
						assert.areNotSame( 'foofoo', value1, 'Cancelled dialog event prevented from default data loading' );
						assert.isInstanceOf( CKEDITOR.dialog, dialogEventData, 'evt.data' );
					} );
				} );

				wait( function() {
					widget.edit();
				} );
			} );
		},

		'test enter triggering edit': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' );

				widget.on( 'edit', function( evt ) {
					assert.isTrue( true );
					evt.cancel();
				} );

				widget.focus();

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) );
			} );
		},

		'test doubleclick triggering edit': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' );

				widget.on( 'edit', function( evt ) {
					assert.isTrue( true );
					evt.cancel();
				} );

				widget.focus();

				editor.fire( 'doubleclick', { element: editor.document.getById( 'x' ) } );
			} );
		},

		'test creating widget using command': function() {
			var editor = this.editor,
				editFired = 0,
				dialog = bender.tools.mockDialog();

			this.editorBot.setData( '<p>FooBar</p>', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>Foo^Bar</p>' );

				editor.widgets.add( 'testcommand1', {
					dialog: 'testcommand1',
					defaults: {
						foo: 'abc'
					},
					template: '<div data-widget="testcommand1" id="w1">{foo}</div>',
					init: function() {
						this.on( 'edit', function( evt ) {
							editFired += 1;
							evt.data.dialog = null;

							// Mock opening and closing a dialog.
							this.fire( 'dialog', dialog );
							dialog.show();
							dialog.ok();
						}, null, null, 9999 );
					}
				} );

				editor.execCommand( 'testcommand1' );

				var widget = getWidgetById( editor, 'w1' );
				assert.isTrue( !!widget, 'Widget was created' );
				assert.areSame( '<p>Foo</p><div data-widget="testcommand1" id="w1">abc</div><p>Bar</p>', fixHtml( editor.getData() ), 'Data' );
				assert.areSame( 1, editFired, 'Widget.edit was called' );
				assert.areSame( widget, editor.widgets.focused, 'Created widget is focused' );
			} );
		},

		'test creating without a dialog': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p></p>', function() {
				// Force selection in Chrome (#5385).
				if ( CKEDITOR.env.chrome && editor.getSelection().getType() === CKEDITOR.SELECTION_NONE ) {
					var range = editor.createRange();

					range.selectNodeContents( editor.editable() );
					range.select();
				}

				editor.widgets.add( 'insertingwithoutdialog', {
					// No dialog defined.
					template: '<b>foo</b>'
				} );

				editor.focus();
				editor.execCommand( 'insertingwithoutdialog' );

				assert.areSame( '<p><b>foo</b></p>', editor.getData() );
			} );
		},

		'test creating with canceled edit': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>x</p>', function() {
				editor.widgets.add( 'insertingwithcancel', {
					dialog: 'foo',
					template: '<b>foo</b>',
					init: function() {
						this.on( 'edit', function( evt ) {
							evt.cancel();
						} );
					}
				} );

				editor.focus();
				editor.execCommand( 'insertingwithcancel' );

				assert.areSame( '<p>x</p>', editor.getData(), 'widget should not be inserted because edit was canceled' );
			} );
		},

		// (#3261)
		'test widget document': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>x</p>', function() {
				editor.widgets.add( 'insertingdocument', {
					dialog: 'foo',
					template: '<b>foo</b>',
					init: function() {
						assert.isTrue( this.wrapper.getDocument().equals( editor.document ) );
					}
				} );

				editor.focus();
				editor.execCommand( 'insertingdocument' );
			} );
		},

		'test creating widget using command - no data-cke-widget attribute in template': function() {
			var editor = this.editor,
				editFired = 0;

			this.editorBot.setData( '<p>FooBar</p>', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>Foo^Bar</p>' );

				editor.widgets.add( 'testcommand2', {
					defaults: {
						foo: 'abc'
					},
					template: '<div id="w1">{foo}</div>',
					init: function() {
						this.on( 'edit', function() {
							editFired += 1;
						}, null, null, 999 );
					}
				} );

				editor.execCommand( 'testcommand2' );

				var widget = getWidgetById( editor, 'w1' );
				assert.isTrue( !!widget, 'Widget was created' );
				assert.areSame( 'testcommand2', widget.element.getAttribute( 'data-widget' ), 'Widget element has data-cke-widget attr' );
				assert.areSame( '<p>Foo</p><div id="w1">abc</div><p>Bar</p>', editor.getData(), 'Data' );
				assert.areSame( 1, editFired, 'Widget.edit was called' );
			} );
		},

		'test creating widget using command - DOM fixing': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>FooBar</p>', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>Foo^Bar</p>' );

				editor.widgets.add( 'testcommand3', {
					inline: false,
					template: '<span data-widget="testcommand3" id="w1">foo</span>',
					init: function() {}
				} );

				editor.execCommand( 'testcommand3' );

				assert.isTrue( !!getWidgetById( editor, 'w1' ), 'Widget was created' );
				assert.areSame( '<p>Foo</p><span data-widget="testcommand3" id="w1">foo</span><p>Bar</p>', fixHtml( editor.getData() ), 'Data' );
			} );
		},

		'test creating widget using command - postponed ready event': function() {
			var editor = this.editor,
				readyFired = 0,
				readyFiredBeforeHide,
				widgetWasAttached,
				widget;

			this.editorBot.setData( '<p>FooBar</p>', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>Foo^Bar</p>' );

				editor.widgets.on( 'instanceCreated', function( evt ) {
					widget = evt.data;

					widget.on( 'ready', function() {
						readyFired += 1;
					} );
				} );

				editor.once( 'dialogShow', function( evt ) {
					readyFiredBeforeHide = readyFired;
					widgetWasAttached = editor.editable().contains( widget.wrapper );

					setTimeout( function() {
						evt.data.getButton( 'ok' ).click();
					}, 50 );
				} );

				editor.once( 'dialogHide', function() {
					resume( function() {
						assert.areSame( 0, readyFiredBeforeHide, 'ready was not fired before closing dialog' );
						assert.isFalse( widgetWasAttached, 'widget was not attached to DOM before closing dialog' );
						assert.areSame( 1, readyFired, 'ready event is fired' );
						assert.isTrue( editor.editable().contains( widget.wrapper ), 'widegt is attached to DOM' );
					} );
				} );

				wait( function() {
					editor.execCommand( 'test1' );
				} );
			} );
		},

		'test widget is transformed during its creation - transformation is made immediately': function() {
			var editor = this.editor,
				widgetA,
				widgetB;

			editor.widgets.add( 'testcommand4a', {
				template: '<span id="w1">foo</span>',
				data: function() {
					// Control whether test case works correctly.
					assert.isFalse( editor.editable().contains( this.element ), 'widget has not been inserted yet' );

					widgetA = this;
					editor.widgets.destroy( this );

					var newElement = new CKEDITOR.dom.element( 'b', editor.document );
					newElement.replace( this.element );
					newElement.append( this.element );

					editor.widgets.initOn( newElement, 'testcommand4b' );
				}
			} );
			editor.widgets.add( 'testcommand4b', {} );

			this.editorBot.setData( '<p>FooBar</p>', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>Foo^Bar</p>' );

				editor.execCommand( 'testcommand4a' );

				widgetB = getWidgetById( editor, 'w1' );
				assert.isTrue( !!widgetB, 'widget was inserted' );
				assert.areSame( 'testcommand4b', widgetB.name, 'widget was transformed' );
				assert.areNotSame( widgetA.id, widgetB.id, 'transformed widget has a new id' );
				assert.areSame( 'b', widgetB.element.getName() );
				assert.areSame( '<p>Foo<b><span id="w1">foo</span></b>Bar</p>', editor.getData() );
			} );
		},

		'test widget is transformed during its creation - transformation is made on dialog close': function() {
			var editor = this.editor,
				editFired = 0,
				widgetA,
				widgetB,
				dialog = bender.tools.mockDialog();

			editor.widgets.add( 'testcommand5a', {
				dialog: 'foo',
				template: '<span id="w1">foo</span>',

				init: function() {
					this.on( 'edit', function( evt ) {
						editFired += 1;
						evt.data.dialog = null;

						// Mock opening and closing a dialog.
						this.fire( 'dialog', dialog );
						dialog.show();

						// Fire data which would be fired when closing dialog.
						this.fire( 'data' );
						dialog.ok();
					}, null, null, 9999 );
				},

				data: function() {
					// Trigger transformation after closing dialog.
					if ( editFired === 0 )
						return;

					// Control whether test case works correctly.
					assert.isFalse( editor.editable().contains( this.element ), 'widget has not been inserted yet' );

					widgetA = this;
					editor.widgets.destroy( this );

					var newElement = new CKEDITOR.dom.element( 'b', editor.document );
					newElement.replace( this.element );
					newElement.append( this.element );

					editor.widgets.initOn( newElement, 'testcommand5b' );
				}
			} );
			editor.widgets.add( 'testcommand5b', {} );

			this.editorBot.setData( '<p>FooBar</p>', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>Foo^Bar</p>' );

				editor.execCommand( 'testcommand5a' );

				assert.areSame( 1, editFired, 'edit was fired' );

				widgetB = getWidgetById( editor, 'w1' );
				assert.isTrue( !!widgetB, 'widget was inserted' );
				assert.areSame( 'testcommand5b', widgetB.name, 'widget was transformed' );
				assert.areNotSame( widgetA.id, widgetB.id, 'transformed widget has a new id' );
				assert.areSame( 'b', widgetB.element.getName() );
				assert.areSame( '<p>Foo<b><span id="w1">foo</span></b>Bar</p>', editor.getData() );
			} );
		},

		'test editing widget using command': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w1" data-widget="test1">X</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					editFired = 0;

				widget.focus();

				widget.once( 'edit', function( evt ) {
					editFired += 1;
					evt.cancel();
				} );

				editor.execCommand( 'test1' );

				assert.areSame( 1, editFired, 'Widget.edit was called' );
			} );
		},

		'test cancelling cancel widget dialog does not destroy widget (https://dev.ckeditor.com/ticket/13158).': function() {
			var editor = this.editor,
				originalConfirm = window.confirm;

			// Setup.
			window.confirm = function() {
				return false;
			};

			this.editorBot.setData( '<p>foo</p>', function() {
				editor.once( 'dialogShow', function( evt ) {
					var spy = sinon.stub( editor.widgets, 'destroy' ),
						dialog = evt.data;

					dialog.once( 'cancel', function() {
						resume( function() {
							assert.isFalse( spy.called );

							// Teardown.
							window.confirm = function() {
								return true;
							};
							dialog.getButton( 'cancel' ).click();
							window.confirm = originalConfirm;
						} );
					} );

					// We have to wait here because of this:
					// https://github.com/cksource/ckeditor-dev/blob/4fbe94b5fb4be9b1d440462cbc8f0c75e00350a5/plugins/dialog/plugin.js#L910
					setTimeout( function() {
						dialog.getContentElement( 'info', 'value1' ).setValue( 'bar' );
						dialog.getButton( 'cancel' ).click();
					}, 200 );
				} );

				editor.execCommand( 'test1' );
				wait();
			} );
		}
	} );
} )();

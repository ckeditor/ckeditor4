/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */
/* bender-include: _helpers/tools.js */
/* global dialogTools */

( function() {
	'use strict';

	var dialogDefinitions = {
		testDialog1: {
			title: 'Test Dialog 1',
			contents: [
				{
					id: 'info',
					label: 'Test',
					elements: [
						{
							type: 'text',
							id: 'foo',
							label: 'bar'
						}
					]
				}
			]
		},
		testGetModel: {
			title: 'Test getModel',
			contents: [
				{
					id: 'info',
					label: 'Test',
					elements: []
				}
			],
			getModel: sinon.stub().returns( new CKEDITOR.dom.element( 'span' ) )
		},
		testGetMode: {
			title: 'Test getMode',
			contents: [
				{
					id: 'info',
					label: 'Test',
					elements: []
				}
			],
			getMode: sinon.stub().returns( 1 ) // Editing mode.
		},
		testDialogDefinitionEvent: {
			title: 'Test dialogDefinition event',
			contents: [
				{
					id: 'info',
					label: 'Test',
					elements: []
				}
			],
			getModel: sinon.stub().returns( new CKEDITOR.dom.element( 'span' ) )
		}
	};

	CKEDITOR.on( 'instanceLoaded', function( evt ) {
		CKEDITOR.dialog.add( 'testDialog1', function() {
			return dialogDefinitions.testDialog1;
		} );
		CKEDITOR.dialog.add( 'testDialog2', '%TEST_DIR%_assets/testdialog.js' );
		CKEDITOR.dialog.add( 'testGetModel', function() {
			return dialogDefinitions.testGetModel;
		} );
		CKEDITOR.dialog.add( 'testGetMode', function() {
			return dialogDefinitions.testGetMode;
		} );
		CKEDITOR.dialog.add( 'testDialogDefinitionEvent', function() {
			return dialogDefinitions.testDialogDefinitionEvent;
		} );

		evt.editor.addCommand( 'testDialog1', new CKEDITOR.dialogCommand( 'testDialog1' ) );
		evt.editor.addCommand( 'testDialog2', new CKEDITOR.dialogCommand( 'testDialog2' ) );
		evt.editor.addCommand( 'testGetModel', new CKEDITOR.dialogCommand( 'testGetModel' ) );
		evt.editor.addCommand( 'testGetMode', new CKEDITOR.dialogCommand( 'testGetMode' ) );
		evt.editor.addCommand( 'testDialogDefinitionEvent', new CKEDITOR.dialogCommand( 'testDialogDefinitionEvent' ) );
	} );

	bender.editor = {};

	bender.test( {
		tearDown: dialogTools.closeAllDialogs,

		// (#4262)
		'test stylesLoaded is not polluting global context': function() {
			assert.isUndefined( window.stylesLoaded );
		},

		'test open dialog from local': function() {
			var ed = this.editor, tc = this;
			ed.openDialog( 'testDialog1', function( dialog ) {
				tc.resume( function() {
					assert.isNotNull( dialog );

					wait( function() {
						dialog.getButton( 'cancel' ).click();
					}, 100 );
				} );
			} );
			tc.wait();
		},

		'test open dialog from url': function() {
			var ed = this.editor, tc = this;
			ed.openDialog( 'testDialog2', function( dialog ) {
				tc.resume( function() {
					assert.isNotNull( dialog );

					wait( function() {
						dialog.getButton( 'cancel' ).click();
					}, 100 );
				} );
			} );
			tc.wait();
		},

		// (#2423)
		'test open dialog forces model': function() {
			var tc = this,
				editor = this.editor,
				editorBot = this.editorBot,
				model = {};

			editor.openDialog( 'testGetModel', function( dialog1 ) {
				assert.areSame( model, dialog1.getModel() );

				dialog1.hide();

				editorBot.dialog( 'testGetModel', function( dialog2 ) {
					assert.areNotSame( model, dialog2.getModel() );
				} );
			}, model );

			tc.wait();
		},

		// Code of this test is poor (checking isVisible and operations on DOM), but that's caused
		// by very closed and poor dialog API.
		'test dialog\'s field are disabled when not allowed': function() {
			var ed = this.editor;

			CKEDITOR.dialog.add( 'testDialog3', function() {
				return {
					title: 'Test Dialog 3',
					contents: [
						{
							id: 'tab1',
							label: 'Test 1',
							elements: [
								{
									type: 'text',
									id: 'foo',
									label: 'foo',
									requiredContent: 'p'
								},
								{
									type: 'text',
									id: 'bar',
									label: 'bar',
									requiredContent: 'x'
								}
							]
						},
						{
							id: 'tab2',
							label: 'Test 2',
							elements: [
								// vbox shouldn't be count as visible uielement,
								// so entire tab2 should be hidden.
								{
									type: 'vbox',
									children: [
										{
											type: 'text',
											id: 'bom',
											label: 'bom',
											requiredContent: 'y'
										}
									]
								}
							]
						},
						{
							id: 'tab3',
							label: 'Test 3',
							elements: [
								{
									type: 'text',
									id: 'bim',
									label: 'bim'
								}
							]
						}
					]
				};
			} );

			ed.openDialog( 'testDialog3', function( dialog ) {
				setTimeout( function() {
					resume( function() {
						// Tab 2 has no visible elements, so it should be hidden.
						assert.areSame( 2, dialog.getPageCount() );
						assert.isTrue( dialog.parts.tabs.getChild( 0 ).isVisible() );
						assert.isFalse( dialog.parts.tabs.getChild( 1 ).isVisible() );
						assert.isTrue( dialog.parts.tabs.getChild( 2 ).isVisible() );

						assert.isTrue( dialog.getContentElement( 'tab1', 'foo' ).getInputElement().isVisible() );
						assert.isFalse( dialog.getContentElement( 'tab1', 'bar' ).getInputElement().isVisible() );
						assert.isFalse( dialog.getContentElement( 'tab2', 'bom' ).getInputElement().isVisible() );

						// Element tab2:bom should be still invisible after switching to second tab.
						dialog.selectPage( 'tab2' );
						assert.isFalse( dialog.getContentElement( 'tab2', 'bom' ).getInputElement().isVisible() );

						dialog.selectPage( 'tab3' );
						assert.isTrue( dialog.getContentElement( 'tab3', 'bim' ).getInputElement().isVisible() );

						wait( function() {
							dialog.getButton( 'cancel' ).click();
						}, 100 );
					} );
				}, 200 );
			} );
			wait();
		},

		// Code of this test is poor (checking isVisible and operations on DOM), but that's caused
		// by very closed and poor dialog API.
		// https://dev.ckeditor.com/ticket/12546
		'test dialog\'s HTML field always count as allowed field unless requiredContent is specified': function() {
			var ed = this.editor;

			CKEDITOR.dialog.add( 'testDialog4', function() {
				return {
					title: 'Test Dialog 4',
					contents: [
						{
							id: 'tab1',
							label: 'Test 1',
							elements: [
								{
									type: 'html',
									id: 'field1',
									html: 'foo'
								}
							]
						},
						{
							id: 'tab2a',
							label: 'Test 2a',
							elements: [
								{
									type: 'html',
									id: 'field2a',
									html: 'foo',
									requiredContent: 'x'
								}
							]
						},
						{
							id: 'tab2b',
							label: 'Test 2b',
							elements: [
								{
									type: 'html',
									id: 'field2b',
									html: 'foo',
									requiredContent: 'p'
								}
							]
						},
						{
							id: 'tab3',
							label: 'Test 3',
							requiredContent: 'y',
							elements: [
								{
									type: 'html',
									id: 'field3',
									html: 'foo'
								}
							]
						}
					]
				};
			} );

			ed.openDialog( 'testDialog4', function( dialog ) {
				setTimeout( function() {
					resume( function() {
						assert.areSame( 2, dialog.getPageCount() );
						assert.isTrue( dialog.parts.tabs.getChild( 0 ).isVisible(), 'tab1' );
						// Tab 2a is hidden.
						assert.isFalse( dialog.parts.tabs.getChild( 1 ).isVisible(), 'tab2a' );
						assert.isTrue( dialog.parts.tabs.getChild( 2 ).isVisible(), 'tab2b' );
						// Tab 3 wasn't created at all.
						assert.isNull( dialog.parts.tabs.getChild( 3 ), 'tab3' );

						assert.isTrue( dialog.getContentElement( 'tab1', 'field1' ).getInputElement().isVisible(), 'field1' );

						dialog.selectPage( 'tab2b' );
						assert.isTrue( dialog.getContentElement( 'tab2b', 'field2b' ).getInputElement().isVisible(), 'field2b' );

						wait( function() {
							dialog.getButton( 'cancel' ).click();
						}, 100 );
					} );
				}, 200 );
			} );
			wait();
		},

		'test dialog is triggered on doubleclick': function() {
			var editor = this.editor,
			openedDialog = null,
			revert = bender.tools.replaceMethod( editor, 'openDialog', function( name ) {
				openedDialog = name;
			} );

			editor.fire( 'doubleclick', { element: editor.editable() } );

			assert.isNull( openedDialog, 'dialog was not opened' );

			editor.once( 'doubleclick', function( evt ) {
				evt.data.dialog = 'testdoubleclick';
			} );

			editor.fire( 'doubleclick', { element: editor.editable() } );

			assert.areSame( 'testdoubleclick', openedDialog, 'dialog was opened on doubleclick' );

			revert();
		},

		'test dialog setState': function() {
			var stateEventFired = 0,
			editor = this.editor;

			CKEDITOR.dialog.add( 'testDialog5', function() {
				return {
					title: 'Test Dialog 5',
					contents: [
						{
							id: 'tab1',
							label: 'Test 1',
							elements: [
								{
									type: 'text',
									id: 'foo',
									label: 'foo',
									requiredContent: 'p'
								}
							]
						}
					]
				};
			} );

			editor.addCommand( 'testDialog5', new CKEDITOR.dialogCommand( 'testDialog5' ) );

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;

				resume( function() {
					assert.isTrue( dialog.getButton( 'ok' ).isEnabled(), 'OK button is enabled.' );
					assert.isUndefined( dialog.parts.spinner, 'By default dialog has no spinner' );
					assert.areSame( CKEDITOR.DIALOG_STATE_IDLE, dialog.state, 'Default dialog state' );

					var stateListener = dialog.on( 'state', function( evt ) {
						try {
							assert.areSame( CKEDITOR.DIALOG_STATE_BUSY, dialog.state, 'New dialog state' );
							assert.isFalse( dialog.getButton( 'ok' ).isEnabled(), 'OK button is disabled' );
							assert.isObject( dialog.parts.spinner, 'Dialog has a spinner element' );

							++stateEventFired;
						} catch ( e ) {
							evt.removeListener();
							throw e;
						}
					} );

					// Change dialog's state and assert related properties.
					dialog.setState( CKEDITOR.DIALOG_STATE_BUSY );

					// Remove the listener because the dialog will be reopened and those assertions would be invalid.
					stateListener.removeListener();

					assert.areSame( 1, stateEventFired, 'State event has been fired' );

					dialog.hide();

					// Call the dialog again to tell what happens to the state and the UI once reopened.
					editor.execCommand( 'testDialog5' );

					editor.once( 'dialogShow', function( evt ) {
						var dialog = evt.data;

						resume( function() {
							assert.areSame( CKEDITOR.DIALOG_STATE_IDLE, dialog.state, 'Default dialog state after re–open' );
							assert.isTrue( dialog.getButton( 'ok' ).isEnabled(), 'OK button is enabled after re–open' );
							assert.isObject( dialog.parts.spinner, 'Dialog has been given a spinner before' );
						} );
					} );

					wait();
				} );
			} );

			editor.execCommand( 'testDialog5' );

			wait();
		},

		// (#4888)
		'test dialog setState does not throw when dialog has no Ok button': function() {
			var editor = this.editor,
				errorOccured = false;

			CKEDITOR.dialog.add( 'testDialogSetStateNoOk', function() {
				return {
					title: 'Test Dialog setState No Ok',
					contents: [
						{
							id: 'tab1',
							label: 'Test 1',
							elements: [
								{
									type: 'text',
									id: 'foo',
									label: 'foo',
									requiredContent: 'p'
								}
							]
						}
					],
					buttons: []
				};
			} );

			editor.addCommand( 'testDialogSetStateNoOk', new CKEDITOR.dialogCommand( 'testDialogSetStateNoOk' ) );

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;

				resume( function() {
					try {
						dialog.setState( CKEDITOR.DIALOG_STATE_BUSY );
					} catch ( err ) {
						errorOccured = true;
					}

					assert.areSame( CKEDITOR.DIALOG_STATE_BUSY, dialog.state, 'Correct dialog state – BUSY' );

					// These tries are separate to catch issues with setting and unsetting busy state.
					try {
						dialog.setState( CKEDITOR.DIALOG_STATE_IDLE );
					} catch ( err ) {
						errorOccured = true;
					}

					assert.areSame( CKEDITOR.DIALOG_STATE_IDLE, dialog.state, 'Correct dialog state – IDLE' );
					assert.isFalse( errorOccured, 'No error occured' );
				} );
			} );

			editor.execCommand( 'testDialogSetStateNoOk' );

			wait();
		},

		// #830
		'test dialog opens tab defined in tabId as default': function() {
			var editor = this.editor;

			CKEDITOR.dialog.add( 'testDialog6', function() {
				return {
					title: 'Test dialog 6',
					contents: [
						{
							id: 'tab1',
							label: 'Tab one',
							elements: [
								{
									type: 'html',
									id: 'field11',
									html: 'foo'
								}
							]
						},
						{
							id: 'tab2',
							label: 'Tab two',
							elements: [
								{
									type: 'html',
									id: 'field21',
									html: 'bar'
								}
							]
						}
					]
				};
			} );

			editor.addCommand( 'testDialog6', new CKEDITOR.dialogCommand( 'testDialog6', {
				tabId: 'tab2'
			} ) );


			editor.once( 'dialogShow', function( evt ) {
				resume( function() {
					var dialog = evt.data;
					assert.areSame( 'tab2', dialog._.currentTabId );
				} );
			} );

			editor.execCommand( 'testDialog6' );
			wait();
		},

		// (#2423)
		'test dialog has getModel() method by default': function() {
			this.editorBot.dialog( 'testDialog1', function( dialog ) {
				assert.isNull( dialog.getModel( this.editor ) );
			} );
		},

		// (#2423)
		'test dialog definition allows for overwriting returned model': function() {
			this.editorBot.dialog( 'testGetModel', function( dialog ) {
				// Get model may be called during the initialization, that's not a concern of this TC.
				dialogDefinitions.testGetModel.getModel.reset();

				var ret = dialog.getModel( this.editor );

				sinon.assert.calledOnce( dialogDefinitions.testGetModel.getModel );
				sinon.assert.calledWithExactly( dialogDefinitions.testGetModel.getModel, this.editor );

				assert.isInstanceOf( CKEDITOR.dom.element, ret, 'Return value type.' );
				assert.areSame( 'span', ret.getName(), 'Returned tag name.' );
			} );
		},

		// (#2423)
		'test dialog definition allows for overwriting getMode': function() {
			this.editorBot.dialog( 'testGetMode', function( dialog ) {
				// Get model may be called during the initialization, that's not a concern of this TC.
				dialogDefinitions.testGetModel.getModel.reset();

				var ret = dialog.getMode( this.editor );

				sinon.assert.calledOnce( dialogDefinitions.testGetMode.getMode );
				sinon.assert.calledWithExactly( dialogDefinitions.testGetMode.getMode, this.editor );

				assert.areEqual( CKEDITOR.dialog.EDITING_MODE, ret );
			} );
		},

		// (#2423)
		'test dialog.getMode': function() {
			this.editorBot.dialog( 'testDialog1', function( dialog ) {
				assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode() );
			} );
		},

		// (#2423)
		'test dialog.getMode with dettached DOM model': function() {
			this.editorBot.dialog( 'testGetModel', function( dialog ) {
				assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode() );
			} );
		},

		// (#2423)
		'test dialog.getMode with attached DOM element model': function() {
			this.editorBot.setHtmlWithSelection( '<p><em>[foo]</em></p>' );

			this.editorBot.dialog( 'testGetModel', function( dialog ) {
				// Use element that is truly attached in DOM.
				var getModelStub = sinon.stub( dialog, 'getModel' ).returns( this.editor.editable().findOne( 'em' ) ),
					ret = dialog.getMode();

				getModelStub.restore();

				assert.areEqual( CKEDITOR.dialog.EDITING_MODE, ret );
			} );
		},

		// (#2423)
		'test dialog.getMode with attached DOM text node model': function() {
			this.editorBot.setHtmlWithSelection( '<p>{foo}</p>' );

			this.editorBot.dialog( 'testGetModel', function( dialog ) {
				var getModelStub = sinon.stub( dialog, 'getModel' ).returns( this.editor.editable().findOne( 'p' ).getFirst() ),
					ret = dialog.getMode();

				getModelStub.restore();

				assert.areEqual( CKEDITOR.dialog.EDITING_MODE, ret );
			} );
		},

		// (#2423)
		'test dialog dialogDefinition event data': function() {
			var stub = sinon.stub();

			CKEDITOR.once( 'dialogDefinition', stub );

			this.editorBot.dialog( 'testDialogDefinitionEvent', function() {
				assert.areSame( 1, stub.callCount, 'Event call count' );

				sinon.assert.calledWith( stub, sinon.match.has( 'data', {
					name: 'testDialogDefinitionEvent',
					dialog: CKEDITOR.dialog.getCurrent(),
					definition: sinon.match.instanceOf( Object )
				} ) );
			} );
		},

		// (#3638)
		'test updating current dialog after closing the dialog opened twice': function() {
			var editorBot = this.editorBot;

			editorBot.dialog( 'testDialog1', function() {
				editorBot.dialog( 'testDialog1', function( dialog ) {
					dialog.getButton( 'cancel' ).click();

					assert.isNull( CKEDITOR.dialog.getCurrent(), 'There is no current dialog' );
				} );
			} );
		}
	} );

} )();

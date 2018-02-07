/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: balloontoolbar,button,toolbar,dialog,wysiwygarea,basicstyles */

( function() {
	'use strict';

	bender.editor = {
		name: 'classic',
		startupData: '<p>Hello world</p>',
		config: {
			balloontoolbarIgnoreConfirm: true
		}
	};

	var okSpy = sinon.spy();
	var cancelSpy = sinon.spy();

	bender.test( {
		init: function() {
			CKEDITOR.dialog.add( 'testdialog', function() {
				var dialogDefinition = {
					title: 'Test dialog',
					contents: [
						{
							id: 'tab1',
							label: 'Test Label 1',
							title: 'Test Title 1',
							elements: [
								{
									type: 'vbox',
									align: 'right',
									width: '200px',
									children: [
										{
											type: 'text',
											id: 'name',
											label: 'Name'
										},
										{
											type: 'text',
											id: 'age',
											label: 'Age'
										}
									]
								}
							]
						},
						{
							id: 'tab2',
							label: 'Test Label 2',
							title: 'Test Title 2',
							elements: [
								{
									type: 'vbox',
									align: 'right',
									width: '200px',
									children: [
										{
											type: 'text',
											id: 'sex',
											label: 'Sex'
										},
										{
											type: 'text',
											id: 'nationality',
											label: 'Nationality'
										}
									]
								}
							]
						}
					],
					onOk: okSpy,
					onCancel: cancelSpy,
					buttons: [
						CKEDITOR.dialog.okButton,
						CKEDITOR.dialog.cancelButton
					]
				};

				return dialogDefinition;
			} );
		},

		tearDown: function() {
			var editor = this.editor;
			editor.balloonToolbars._clear();
		},

		'open and close dialog in ballootoolbar': function() {
			var editor = this.editor;
			editor.ui.addButton( 'testbutton', {
				label: 'Test',
				command: 'test'
			} );

			editor.addCommand( 'test', {
				exec: function( editor ) {
					editor.balloonToolbars._contexts[ 0 ].openDialog( 'testdialog' );
				}
			} );

			editor.balloonToolbars.create( {
				buttons: 'testbutton',
				cssSelector: 'p'
			} );

			editor.once( 'afterCommandExec', function( evt ) {
				if ( evt.data.name !== 'test' ) {
					return;
				}
				resume( function() {
					var toolbar = evt.editor.balloonToolbars._contexts[0].toolbar;
					objectAssert.ownsKey( 'testdialog', toolbar._items, 'Testdialog is currently toolbar.' );
					assert.isInstanceOf( CKEDITOR.dialog, toolbar._items.testdialog, 'Testdialog is CKEDITOR.dialog instance.' );
					assert.isTrue( toolbar._view.parts.content.getHtml().indexOf( 'Test dialog' ) !== -1, 'There is title "Test dialog" in current toolbar view.' );
					wait( function() {
						editor.balloonToolbars._contexts[ 0 ].closeDialog();

						var toolbar = evt.editor.balloonToolbars._contexts[ 0 ].toolbar;
						objectAssert.ownsKey( 'testbutton', toolbar._items, 'There is testbutton in active toolbar.' );
					}, 101 );
				} );
			} );

			editor.execCommand( 'test' );
			wait();

		},

		'dialog\'s ok button check in balloontoolbar': function() {
			var editor = this.editor;

			var context = new CKEDITOR.plugins.balloontoolbar.context( editor, {} );
			context.show( editor.editable().findOne( 'p' ) );

			context.openDialog( 'testdialog' );
			wait( function() {
				var dialog = context.toolbar._items.testdialog;
				dialog.click( 'ok' );
				sinon.assert.calledOnce( okSpy );
				okSpy.reset();
				objectAssert.ownsNoKeys( context.toolbar._items, 'After pressing OK, dialog should be removed.' );
				assert.areSame( '', context.toolbar._view.parts.content.getHtml(), 'Toolbar content with dialog was cleard out.' );
			}, 101 );

		},

		'dialog\'s cancel button check in balloontoolbar': function() {
			var editor = this.editor;

			var context = new CKEDITOR.plugins.balloontoolbar.context( editor, {} );
			context.show( editor.editable().findOne( 'p' ) );

			context.openDialog( 'testdialog' );
			wait( function() {
				var dialog = context.toolbar._items.testdialog;
				dialog.click( 'cancel' );
				sinon.assert.calledOnce( cancelSpy );
				cancelSpy.reset();
				objectAssert.ownsNoKeys( context.toolbar._items, 'After pressing OK, dialog should be removed.' );
				assert.areSame( '', context.toolbar._view.parts.content.getHtml(), 'Toolbar content with dialog was cleard out.' );
			}, 101 );

		},

		'dialog\'s callback method': function() {
			var editor = this.editor;
			var callback = sinon.spy();
			var context = new CKEDITOR.plugins.balloontoolbar.context( editor, {} );
			context.show( editor.editable().findOne( 'p' ) );

			context.openDialog( 'testdialog', callback );

			sinon.assert.calledOnce( callback );
			sinon.assert.calledWith( callback, context.toolbar._items.testdialog );
			assert.pass( 'Correct assert is above, this one is only for bender.' );
			wait( function() {
				context.closeDialog();
			}, 101 );
		},

		'dialog automatically close on editor\'s blur': function() {
			var editor = this.editor;
			editor.ui.addButton( 'testbutton', {
				label: 'Test button',
				command: 'testcommand'
			} );

			editor.addCommand( 'testcommand', {
				exec: function() {}
			} );

			editor.balloonToolbars.create( {
				buttons: 'testbutton',
				cssSelector: 'p'
			} );
			var context = editor.balloonToolbars._contexts[ 0 ];
			context.show( editor.editable().findOne( 'p' ) );
			context.openDialog( 'testdialog' );
			editor.once( 'blur', function() {
				resume( function() {
					assert.isUndefined( editor.balloonToolbars._contexts[ 0 ].toolbar._items.testdialog, 'Testdialog is not in toolabr.' );
				} );
			}, null, null, 10000 );

			objectAssert.ownsKey( 'testdialog', context.toolbar._items, 'Testdialog is currently displayed in toolabr.' );
			wait( function() {
				editor.fire( 'blur' );
				wait();
			}, 101 );
		},

		'open dialog in toolbar from file': function() {
			var editor = this.editor;
			var domain = window.location.toString().match( /((https?:)?\/\/)?[a-zA-z0-9\-.:]+/ )[ 0 ];
			var context = new CKEDITOR.plugins.balloontoolbar.context( editor, {} );

			CKEDITOR.dialog.add( 'testdialog2', domain + '/tests/plugins/balloontoolbar/_assets/testdialog2.js' );

			editor.once( 'dialogShow', function( evt ) {
				resume( function() {
					assert.areSame( 'testdialog2', evt.data.getName(), 'Opened dialog has name "testdialog2"' );
					context.closeDialog();
				} );
			} );

			context.show( editor.editable().findOne( 'p' ) );

			context.openDialog( 'testdialog2' );
			wait();
		}

	} );
} )();

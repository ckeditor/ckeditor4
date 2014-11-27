/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialog */

CKEDITOR.on( 'instanceLoaded', function() {
	CKEDITOR.dialog.add( 'testDialog1', function() {
		return {
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
		};
	} );
	CKEDITOR.dialog.add( 'testDialog2', '%TEST_DIR%_assets/testdialog.js' );
} );

bender.editor = {};

bender.test( {
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
	// #12546
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
	}
} );

//]]>
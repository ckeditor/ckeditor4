/* bender-tags: editor, splitbutton */
/* bender-ckeditor-plugins: toolbar, splitbutton, basicstyles */
( function() {
	'use strict';

	bender.editors = {
		splitButtonAsPlugin: {
			config: {
				on: {
					pluginsLoaded: function( evt ) {
						var editor = evt.editor,
							counter = {
								faceClick: 0,
								itemClick: 0
							},
							items = [ {
								command: 'bold',
								icon: 'bold',
								'default': true
							}, {
								command: 'italic',
								icon: 'italic'
							}, {
								command: 'underline',
								icon: 'underline'
							}, {
								command: 'strike',
								icon: 'strike'
							}, {
								command: 'subscript',
								icon: 'subscript'
							} ];

						editor.ui.add( 'teststylesplit', CKEDITOR.UI_SPLITBUTTON, {
							items: items
						} );

						editor.ui.add( 'staticface', CKEDITOR.UI_SPLITBUTTON, {
							face: {
								command: 'bold',
								icon: 'bold'
							},
							items: items
						} );

						editor.ui.add( 'customclick', CKEDITOR.UI_SPLITBUTTON, {
							face: {
								icon: 'underline',
								click: function() {
									counter.faceClick++;
									return counter;
								}
							},
							onMenu: function() {
								var activeItems = {};
								for ( var key in this.items ) {
									activeItems[ key ] = ( counter.itemClick % 2 ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_ON;
								}
								return activeItems;
							},
							items: [ {
								icon: 'superscript',
								onClick: function() {
									counter.itemClick++;
								}
							} ]
						} );

						addCustomCommand( editor );

						editor.ui.add( 'commanddata', CKEDITOR.UI_SPLITBUTTON, {
							items: [ {
								icon: 'superscript',
								command: 'customcommand',
								commandData: { foo: 'foo' }
							} ]
						} );
					}
				}
			}
		},
		splitButtonFromToolbar: {
			config: ( function() {
				var counter = {
						faceClick: 0,
						itemClick: 0
					},
					items = [ 'Bold' , 'Italic', 'Underline', 'Strike', 'Subscript' ];

				return {
					on: {
						pluginsLoaded: function( evt ) {
							addCustomCommand( evt.editor );
						}
					},
					toolbar: [ [ {
						type: 'splitbutton',
						name: 'teststylesplit',
						items: items
					}, {
						type: 'splitbutton',
						name: 'staticface',
						face: 'Bold',
						items: items
					}, {
						type: 'splitbutton',
						name: 'customclick',
						face: {
							icon: 'underline',
							click: function() {
								counter.faceClick++;
								return counter;
							}
						},
						onMenu: function() {
							var activeItems = {};
							for ( var key in this.items ) {
								activeItems[ key ] = ( counter.itemClick % 2 ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_ON;
							}
							return activeItems;
						},
						items: [ {
							icon: 'superscript',
							onClick: function() {
								counter.itemClick++;
							}
						} ]
					}, {
						type: 'splitbutton',
						name: 'commanddata',
						items: [ {
							icon: 'superscript',
							command: 'customcommand',
							commandData: { foo: 'foo' }
						} ]
					} ] ]
				};
			} )()
		}
	};

	var tests = {
		tearDown: function() {
			// When using bender.tools.createTestsForEditors tearDown doesn't have refference to editor.
			for ( var key in this.editors ) {
				this.editors[ key ].editable().setHtml( '<p></p>' );
			}
		},
		'test split button rendered in toolbar': function( editor ) {
			var splitButton = editor.ui.get( 'teststylesplit' ),
				arrow = CKEDITOR.document.getById( splitButton._.id ),
				children = arrow.getParent().getChildren(),
				cls,
				cl,
				i,
				item,
				items = {},
				key;

			// Test if split button is rendered in toolbar.
			assert.isTrue( arrow.getParent().getParent().hasClass( 'cke_toolgroup' ) );

			// Test if each of split button items are represented by buttons in toolbar.
			for ( i = 0; i < children.count(); i++ ) {
				item = children.getItem( i );
				cls = item.getAttribute( 'class' ).split( ' ' )[ 1 ],
				cl = cls.substring( 12, cls.length );
				items[ cl ] = cl;
			}
			for ( key in splitButton.items ) {
				key = key.substring( 0, key.length - 1 );
				assert.isTrue( key in items );
			}
		},
		'test state of split button buttons': function( editor ) {
			var splitButton = editor.ui.get( 'teststylesplit' ),
				arrow = CKEDITOR.document.getById( splitButton._.id ),
				splitButtonElement = arrow.getParent(),
				buttons = splitButtonElement.getChildren(),
				button,
				key,
				command;

			selectBeginningOfEditable( editor );

			for ( key in splitButton.items ) {
				command = editor.getCommand( splitButton.items[ key ].command );
				button = splitButtonElement.findOne( '.cke_button__' + command.name );
				// Test initial state of buttons and commands.
				assert.isTrue( button.hasClass( 'cke_button_off' ), 'Button should be in `off` state' );
				assert.isTrue( command.state == CKEDITOR.TRISTATE_OFF, 'Command state should be 2' );

				// Test visibility of button in toolbar.
				if ( key === 'bold0' ) {
					assert.isTrue( CKEDITOR.tools.objectCompare( button, getAndAssertVisibleButtons( buttons )[ 0 ] ), 'Button should be visible' );
				} else {
					assert.isFalse( CKEDITOR.tools.objectCompare( button, getAndAssertVisibleButtons( buttons )[ 0 ] ), 'Button should be hidden' );
				}

				splitButton.click( editor );
				splitButton._.menu.show( CKEDITOR.document.getById( splitButton._.id ), 4 );

				// Test menu button state before executing command.
				assertMenuButtonsState( editor );

				editor.execCommand( command.name );

				// Test button and menu button state and visibility after executing command.
				assert.isTrue( CKEDITOR.tools.objectCompare( button, getAndAssertVisibleButtons( buttons )[ 0 ] ), 'Button should be visible' );
				assert.isTrue( button.hasClass( 'cke_button_on' ), 'Button should be in `on` state' );

				assertMenuButtonsState( editor );
			}
		},
		'test static face': function( editor ) {
			// Face should be allways visible
			var splitButton = editor.ui.get( 'staticface' ),
				arrow = CKEDITOR.document.getById( splitButton._.id ),
				face = CKEDITOR.document.getById( splitButton.face._.id ),
				splitButtonElement = arrow.getParent(),
				buttons = splitButtonElement.getChildren().toArray(),
				key;

			selectBeginningOfEditable( editor );

			// Split button with static face should have only two buttons, face and arrow.
			assert.areEqual( buttons.length, 2 );
			assert.areEqual( buttons[ 0 ].getAttribute( 'id' ), splitButton.face._.id );
			assert.areEqual( buttons[ 1 ].getAttribute( 'id' ), splitButton._.id );

			// Test state of face.
			assert.isTrue( face.hasClass( 'cke_button_off' ), 'Button should be in `off` state' );
			editor.execCommand( splitButton.face.command );
			assert.isFalse( face.hasClass( 'cke_button_off' ), 'Button should be in `on` state' );

			editor.execCommand( splitButton.face.command );

			for ( key in splitButton.buttons ) {
				var item = splitButton.buttons[ key ];

				if ( item.command != 'bold' ) {
					editor.execCommand( item.command );
					assert.isTrue( face.hasClass( 'cke_button_off' ), 'Button should be in `off` state' );
				}
			}
		},
		'test custom click, commandless items and onMenu': function( editor ) {
			var splitButton = editor.ui.get( 'customclick' ),
				// arrow = CKEDITOR.document.getById( splitButton._.id ),
				face = CKEDITOR.document.getById( splitButton.face._.id ),
				counter = splitButton.face.click(),
				i;

			// Once we retrieved counter object, lets reset it.
			counter.faceClick = 0;

			for ( i = 1; i < 5; i++ ) {
				if ( CKEDITOR.env.ie ) {
					face.$.onmouseup();
				} else {
					face.$.click();
				}
				assert.areEqual( i, counter.faceClick );
			}

			for ( i = 0; i < 5; i++ ) {
				editor.once( 'menuShow', function() {
					var menu = this.ui.instances.customclick._.menu,
						menuButton = menu._.element.findOne( '.' + menu.items[ 0 ].className ),
						expectedClass = ( i % 2 ) ? 'cke_menubutton_off' : 'cke_menubutton_on';
					assert.isTrue( menuButton.hasClass( expectedClass, 'Command state is 1, menuButton should have class `' + expectedClass + '`.' ) );
					assert.areEqual( counter.itemClick, i );
					if ( CKEDITOR.env.ie ) {
						menuButton.$.onmouseup();
					} else {
						menuButton.$.click();
					}
				} );
				splitButton.click( editor );
				splitButton._.menu.show( CKEDITOR.document.getById( splitButton._.id ), 4 );
			}
		},
		'test custom command data': function( editor ) {
			var splitButton = editor.ui.get( 'commanddata' ),
				arrow = CKEDITOR.document.getById( splitButton._.id ),
				splitButtonElement = arrow.getParent(),
				button = splitButtonElement.getFirst();

			editor.execCommand( 'customcommand' );
			assert.areSame( editor.editable().getHtml().toLowerCase(), '<p>bar</p>' );

			if ( CKEDITOR.env.ie ) {
				button.$.onmouseup();
			} else {
				button.$.click();
			}
			assert.areSame( editor.editable().getHtml().toLowerCase(), '<p>foo</p>' );
		}
	};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );

	function getAndAssertVisibleButtons( buttons ) {
		var visibleButtons = CKEDITOR.tools.array.filter( buttons.toArray(), function( item, index ) {
			// Don't return last button which is an arrow.
			if ( index === buttons.count() - 1 ) {
				return false;
			}
			return item.getStyle( 'display' ) !== 'none';
		} );

		assert.areEqual( visibleButtons.length, 1, 'There should be only one visible button' );
		return visibleButtons;
	}

	function assertMenuButtonsState( editor ) {
		editor.once( 'menuShow', function( evt ) {
			var editor = evt.editor,
				menu = editor.ui.instances.teststylesplit._.menu,
				command,
				item,
				key,
				menuButton;

			for ( key in menu.items ) {
				item = menu.items[ key ];
				command = editor.getCommand( item.command );
				menuButton = menu._.element.findOne( '.' + item.className );

				switch ( command.state ) {
					case 1:
						assert.isTrue( menuButton.hasClass( 'cke_menubutton_on', 'Command state is 1, menuButton should have class `cke_menubutton_on`.' ) );
						break;

					case 2:
						assert.isTrue( menuButton.hasClass( 'cke_menubutton_off', 'Command state is 1, menuButton should have class `cke_menubutton_off`.' ) );
						break;
				}
			}
		} );
	}

	function selectBeginningOfEditable( editor ) {
		var range = editor.createRange(),
			editable = editor.editable();
		range.setStart( editable.getFirst(), 0 );
		editor.getSelection().selectRanges( [ range ] );
	}

	function addCustomCommand( editor ) {
		editor.addCommand( 'customcommand', {
			exec: function( editor, data ) {
				var text;
				if ( data && data.foo ) {
					text = data.foo;
				} else {
					text = 'bar';
				}
				editor.editable().setHtml( '<p>' + text + '</p>' );
			}
		} );
	}
} )();

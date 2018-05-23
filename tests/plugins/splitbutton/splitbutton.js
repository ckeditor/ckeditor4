/* bender-tags: editor, splitbutton */
/* bender-ckeditor-plugins: toolbar, splitbutton, basicstyles */
( function() {
	'use strict';

	bender.editor = {
		config: {
			on: {
				pluginsLoaded: function( evt ) {
					var editor = evt.editor,
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
						}, {
							command: 'superscript',
							icon: 'superscript'
						} ];

					editor.ui.add( 'teststylesplit', CKEDITOR.UI_SPLITBUTTON, {
						label: 'Basic Styles',
						items: items
					} );

					editor.ui.add( 'staticface', CKEDITOR.UI_SPLITBUTTON, {
						label: 'Basic Styles',
						face: {
							command: 'bold',
							icon: 'bold'
						},
						items: items
					} );
				}
			}
		}
	};

	bender.test( {
		tearDown: function() {
			this.editor.editable().setHtml( '' );
		},
		'test split button rendered in toolbar': function() {
			var splitButton = this.editor.ui.get( 'teststylesplit' ),
				arrow = CKEDITOR.document.getById( splitButton._.id ),
				children = arrow.getParent().$.childNodes,
				cl,
				i,
				item,
				items = {},
				key;

			// Test if split button is rendered in toolbar.
			assert.isTrue( arrow.getParent().getParent().hasClass( 'cke_toolgroup' ) );

			// Test if each of split button items are represented by buttons in toolbar.
			for ( i = 0; i < children.length; i++ ) {
				item = children[ i ];
				cl = item.classList[ 1 ].substring( 12, item.classList[ 1 ].length );
				items[ cl ] = cl;
			}
			for ( key in splitButton.items ) {
				key = key.substring( 0, key.length - 1 );
				assert.isTrue( key in items );
			}
		},
		'test state of split button buttons': function() {
			var splitButton = this.editor.ui.get( 'teststylesplit' ),
				arrow = CKEDITOR.document.getById( splitButton._.id ),
				splitButtonElement = arrow.getParent(),
				buttons = splitButtonElement.getChildren(),
				button,
				key,
				command;

			selectBeginningOfEditable( this.editor );

			for ( key in splitButton.items ) {
				command = this.editor.getCommand( splitButton.items[ key ].command );
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

				splitButton.click( this.editor );
				splitButton._.menu.show( CKEDITOR.document.getById( splitButton._.id ), 4 );

				// Test menu button state before executing command.
				assertMenuButtonsState( this.editor );

				this.editor.execCommand( command.name );

				// Test button and menu button state and visibility after executing command.
				assert.isTrue( CKEDITOR.tools.objectCompare( button, getAndAssertVisibleButtons( buttons )[ 0 ] ), 'Button should be visible' );
				assert.isTrue( button.hasClass( 'cke_button_on' ), 'Button should be in `on` state' );

				assertMenuButtonsState( this.editor );
			}
		},
		'test static face': function() {
			// Face should be allways visible
			var splitButton = this.editor.ui.get( 'staticface' ),
				arrow = CKEDITOR.document.getById( splitButton._.id ),
				face = CKEDITOR.document.getById( splitButton.face._.id ),
				splitButtonElement = arrow.getParent(),
				buttons = splitButtonElement.getChildren().toArray(),
				key;

			selectBeginningOfEditable( this.editor );

			// Split button with static face should have only two buttons, face and arrow.
			assert.areEqual( buttons.length, 2 );
			assert.areEqual( buttons[ 0 ].getAttribute( 'id' ), splitButton.face._.id );
			assert.areEqual( buttons[ 1 ].getAttribute( 'id' ), splitButton._.id );

			// Test state of face.
			assert.isTrue( face.hasClass( 'cke_button_off' ), 'Button should be in `off` state' );
			this.editor.execCommand( splitButton.face.command );
			assert.isFalse( face.hasClass( 'cke_button_off' ), 'Button should be in `on` state' );

			this.editor.execCommand( splitButton.face.command );

			for ( key in splitButton.buttons ) {
				var item = splitButton.buttons[ key ];

				if ( item.command != 'bold' ) {
					this.editor.execCommand( item.command );
					assert.isTrue( face.hasClass( 'cke_button_off' ), 'Button should be in `off` state' );
				}
			}
		}
	} );

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
		range.setStart( editable, 0 );
		editor.getSelection().selectRanges( [ range ] );
	}

} )();

/* bender-tags: editor, splitbutton */
/* bender-ckeditor-plugins: toolbar, splitbutton, basicstyles */
( function() {
	'use strict';

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

	bender.editor = {
		config: {
			on: {
				pluginsLoaded: function( evt ) {
					var editor = evt.editor;
					editor.ui.add( 'teststylesplit', CKEDITOR.UI_SPLITBUTTON, {
						label: 'Basic Styles',
						items: [ {
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
						} ]
					} );
				}
			}
		}
	};

	bender.test( {
		'test splitbutton rendered in toolbar': function() {
			var splitButton = this.editor.ui.get( 'teststylesplit' ),
				arrow = CKEDITOR.document.getById( splitButton._.id ),
				children = arrow.getParent().$.childNodes,
				cl,
				i,
				item,
				items = {},
				key;

			// Test if splitbutton is rendered in toolbar.
			assert.isTrue( arrow.getParent().getParent().hasClass( 'cke_toolgroup' ) );

			// Test if each of splitbutton items are represented by buttons in toolbar
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
		'test state of splitbutton buttons': function() {
			var splitButton = this.editor.ui.get( 'teststylesplit' ),
				arrow = CKEDITOR.document.getById( splitButton._.id ),
				splitButtonElement = arrow.getParent(),
				button,
				key,
				command;

			for ( key in splitButton.items ) {
				command = this.editor.getCommand( splitButton.items[ key ].command );
				button = splitButtonElement.findOne( '.cke_button__' + command.name );
				assert.isTrue( button.hasClass( 'cke_button_off' ), 'Button should be in `off` state' );
				assert.isTrue( command.state == CKEDITOR.TRISTATE_OFF, 'Command state should be 2' );
				splitButton.click( this.editor );
				splitButton._.menu.show( CKEDITOR.document.getById( splitButton._.id ), 4 );

				assertMenuButtonsState( this.editor );

				this.editor.execCommand( command.name );
				assert.isTrue( button.hasClass( 'cke_button_on' ), 'Button should be in `on` state' );

				assertMenuButtonsState( this.editor );
			}
		}
	} );

} )();

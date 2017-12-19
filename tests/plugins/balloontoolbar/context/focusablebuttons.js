/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: balloontoolbar, basicstyles, button, toolbar */

( function() {
	'use strict';

	bender.editor = {
		startupData: '<p>Hello <strong>world</strong>.</p>',
		config: {
			extraAllowedContent: 'strong em'
		}
	};

	bender.test( {
		'test if balloon toolbar elements are registered as focusable': function() {
			var editor = this.editor,
				toolbar = new CKEDITOR.ui.balloonToolbar( editor ),
				oldFocusables;

			toolbar.addItem( 'Bold', new CKEDITOR.ui.button( {
				label: 'Bold',
				command: 'bold'
			} ) );

			oldFocusables = CKEDITOR.tools.objectKeys( toolbar._view.focusables );
			toolbar.attach( editor.editable().findOne( 'strong' ) );
			assert.isFalse( CKEDITOR.tools.arrayCompare( oldFocusables, CKEDITOR.tools.objectKeys( toolbar._view.focusables ) ),
				'With new button, its element should appear in focusables' );


			oldFocusables = CKEDITOR.tools.objectKeys( toolbar._view.focusables );
			toolbar.deleteItem( 'Bold' );
			assert.isFalse( CKEDITOR.tools.arrayCompare( oldFocusables, CKEDITOR.tools.objectKeys( toolbar._view.focusables ) ),
				'With removing button, its element should be removed from focusables' );

			toolbar.destroy();
		},

		'test focusing toolbar doesn\'t blur editor': function() {
			var editor = this.editor,
				context = editor.balloonToolbars.create( {
					buttons: 'Bold,Italic',
					cssSelector: 'strong'
				} ),
				blurSpy = sinon.spy(),
				boldButton;

			editor.focus();
			editor.on( 'blur', blurSpy, null, null, 10000 );

			context.show( editor.editable().findOne( 'strong' ) );
			boldButton = context.toolbar._view.parts.content.findOne( '#' + context.toolbar._items.Bold._.id );

			boldButton.once( 'focus', function() {
				// Blur is delayed a little bit, that's why, it's necessary to wait more than this delay to check result.
				// https://github.com/ckeditor/ckeditor-dev/blob/230f715926634e4056a87a572c94707c4190921c/core/focusmanager.js#L72
				setTimeout( function() {
					resume( function() {
						assert.isFalse( blurSpy.called, 'Editor should remain focused, when balloontoolbar is focused.' );
						context.destroy();
					} );
				}, 210 );
			} );

			setTimeout( function() {
				boldButton.focus();
			}, 0 );
			wait();
		},

		'test destroying toolbar will unregister focusables': function() {
			var editor = this.editor,
				context = editor.balloonToolbars.create( {
					buttons: 'Bold,Italic',
					cssSelector: 'strong'
				} ),
				focusables,
				buttonList = [];

			editor.focus();
			context.show( editor.editable().findOne( 'strong' ) );
			context.destroy();

			focusables = context.toolbar._view.focusables;
			// Create list of buttons element in balloontoolbar.
			for ( var id in focusables ) {
				if ( focusables.hasOwnProperty( id ) ) {
					if ( focusables[ id ].getId() ) {
						buttonList.push( id );
					}
				}
			}

			arrayAssert.isEmpty( buttonList, 'Balloontoolbar should be empty' );
		}
	} );

} )();

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

	// Looks for a key of an element in a given dictionary.
	// @param {Object.<string, CKEDITOR.dom.element>} dict
	// @param {CKEDITOR.dom.element} needle
	// @returns {string/undefined}
	function indexOfElement( dict, needle ) {
		return CKEDITOR.tools.array.filter( CKEDITOR.tools.object.keys( dict ), function( key ) {
			return needle.equals( dict[ key ] );
		} )[ 0 ];
	}

	bender.test( {
		'test if balloon toolbar elements are registered as focusable': function() {
			var editor = this.editor,
				toolbar = new CKEDITOR.ui.balloonToolbar( editor ),
				focusables,
				boldButton;

			toolbar.addItem( 'Bold', new CKEDITOR.ui.button( {
				label: 'Bold',
				command: 'bold'
			} ) );

			toolbar.attach( editor.editable().findOne( 'strong' ) );
			boldButton = toolbar._view.parts.panel.findOne( '.cke_button__bold' );
			focusables = toolbar._view.focusables;

			assert.isNotUndefined( -1, indexOfElement( focusables, boldButton ), 'Button is contained in focusable list' );

			toolbar.deleteItem( 'Bold' );
			assert.isUndefined( indexOfElement( focusables, boldButton ), 'Button was removed from focusable list' );

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
				// https://github.com/ckeditor/ckeditor4/blob/230f715926634e4056a87a572c94707c4190921c/core/focusmanager.js#L72
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
				buttonList = [],
				focusables;

			editor.focus();
			context.show( editor.editable().findOne( 'strong' ) );
			context.destroy();

			focusables = context.toolbar._view.focusables;

			// Create list of buttons element in balloontoolbar.
			for ( var id in focusables ) {
				if ( focusables[ id ].getName() == 'a' ) {
					buttonList.push( focusables[ id ] );
				}
			}

			arrayAssert.isEmpty( buttonList, 'Focusable list should be empty' );
		}
	} );

} )();

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
		'test check if balloon toolbar elements are registered as focusable': function() {
			var editor = this.editor,
				toolbar = new CKEDITOR.ui.balloonToolbar( editor ),
				before,
				afterAdding,
				afterDeleting;

			toolbar.addItem( 'Bold', new CKEDITOR.ui.button( {
				label: 'Bold',
				command: 'bold'
			} ) );

			before = CKEDITOR.tools.objectKeys( toolbar._view.focusables );

			toolbar.attach( editor.editable().findOne( 'strong' ) );
			afterAdding = CKEDITOR.tools.objectKeys( toolbar._view.focusables );

			toolbar.deleteItem( 'Bold' );
			afterDeleting = CKEDITOR.tools.objectKeys( toolbar._view.focusables );

			assert.isFalse( CKEDITOR.tools.arrayCompare( before, afterAdding ), 'After adding new button, there should appear new focusables.' );
			assert.isFalse( CKEDITOR.tools.arrayCompare( afterAdding, afterDeleting ), 'After removing button, there should be removed focusables.' );
			assert.isTrue( CKEDITOR.tools.arrayCompare( before, afterDeleting ), 'After adding and then removing button, focusables should be the same.' );
			toolbar.destroy();
		},

		'test focusing toolbar doesn\'t blur editor': function() {
			var editor = this.editor,
				context = editor.balloonToolbars.create( {
					buttons: 'Bold,Italic',
					cssSelector: 'strong'
				} ),
				blurSpy = sinon.spy();

			editor.focus();
			editor.on( 'blur', blurSpy, null, null, 10000 );

			context.show( editor.editable().findOne( 'strong' ) );
			context.toolbar._view._focusablesItems[ 0 ].once( 'focus', function() {
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
				context.toolbar._view._focusablesItems[ 0 ].focus();
			}, 0 );
			wait();
		},

		'test destroying toolbar will unregister focusables': function() {
			var editor = this.editor,
				context = editor.balloonToolbars.create( {
					buttons: 'Bold,Italic',
					cssSelector: 'strong'
				} );

			editor.focus();
			context.show( editor.editable().findOne( 'strong' ) );

			arrayAssert.isNotEmpty( context.toolbar._view._focusablesItems );

			context.destroy();
			arrayAssert.isEmpty( context.toolbar._view._focusablesItems );
		}
	} );

} )();

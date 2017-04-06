/* bender-tags: editor,unit */

bender.editor = true;

CKEDITOR.focusManager._.blurDelay = 50;

bender.test( {
	'test #focus': function() {
		var focusManager = this.editor.focusManager;

		// Give focus to set currentActive athen blur editor.
		this.editor.focus();
		CKEDITOR.document.getById( 'focusable' ).focus();

		wait( function() {
			assert.isFalse( focusManager.hasFocus, 'editor is not focused' );

			var initialActive = focusManager.currentActive;
			focusManager.focus();

			assert.isTrue( focusManager.hasFocus, 'editor is focused' );
			assert.areSame( initialActive, focusManager.currentActive, 'currentActive has not been modified' );
		}, 60 );
	},

	'test #focus with argument': function() {
		var focusManager = this.editor.focusManager;

		// Test overriding while editor already has focus.
		this.editor.focus();

		focusManager.focus( CKEDITOR.document.getById( 'someInput' ) );

		assert.isTrue( focusManager.hasFocus, 'editor is focused' );
		assert.areSame( CKEDITOR.document.getById( 'someInput' ), focusManager.currentActive, 'currentActive has been set' );

		// Clean up - reset focusManager completely.
		focusManager.blur( true );
		CKEDITOR.document.getById( 'focusable' ).focus();
		assert.isFalse( focusManager.hasFocus, 'editor lost focus' );
	},

	'test #focus stops #blur': function() {
		var focusManager = this.editor.focusManager;

		this.editor.focus();
		assert.isTrue( focusManager.hasFocus, 'editor is focused' );

		focusManager.blur();
		wait( function() {
			focusManager.focus();

			wait( function() {
				assert.isTrue( focusManager.hasFocus, 'editor is still focused' );
			}, 50 );
		}, 10 );
	},

	// #16935
	'test blur editor in source mode': function() {
		if ( !CKEDITOR.env.chrome ) {
			assert.ignore();
		}

		bender.editorBot.create( {
			name: 'test_editor_source',
			config: {
				plugins: 'sourcearea',
				startupMode: 'source'
			}
		}, function( bot ) {
			// Super mega ugly hack to test async error:
			// 1. Listener for global error event is created, which forces the test to fail.
			// 2. At the same time setTimeout is set to resonably long time to be sure that
			// if error was going to throw, it had been already thrown. This timeout forces test to pass.
			var timer;

			function errorHandler( evt ) {
				resume( function() {
					if ( evt.data.$.message.indexOf( 'Cannot read property \'$\'' ) !== -1 ) {
						clearTimeout( timer );
						assert.fail( 'Error was thrown' );
					}
				} );
			}

			CKEDITOR.document.getWindow().once( 'error',  errorHandler );

			timer = setTimeout( function() {
				resume( function() {
					CKEDITOR.document.getWindow().removeListener( 'error', errorHandler );

					assert.pass( 'Error was not thrown' );
				} );
			}, 200 );

			bot.editor.focus();
			CKEDITOR.document.getById( 'focusable' ).focus();

			wait();
		} );
	}
} );

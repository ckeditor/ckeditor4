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
	}
} );
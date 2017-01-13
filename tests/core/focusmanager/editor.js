/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: floatingspace,toolbar,about,format */

CKEDITOR.focusManager._.blurDelay = 0;

bender.editor = {
	startupData: 'foo'
};

bender.test( {
	assertFocus: function( truly ) {

		var ed = this.editor,
			fm = this.editor.focusManager;

		assert[ truly === false ? 'isFalse' : 'isTrue' ]( fm.hasFocus, 'check focusManager.hasFocus' );
		assert[ truly === false ? 'isFalse' : 'isTrue' ]( ed.container.hasClass( 'cke_focus' ), ' editor container receives focused class name.' );
	},

	'test editor focus - editable focused': function() {
		var bot = this.editorBot;
		bot.focus( function() {
			this.assertFocus();
		} );
	},

	'test editor blur - focus move out of editor': function() {
		var tc = this;
		var outer = CKEDITOR.document.getById( 'focusable' );
		bender.tools.focus( outer, function() {
			tc.assertFocus( false );
		} );
	},

	'test editor focus - combo opened': function() {
		var bot = this.editorBot;
		bot.combo( 'Format', function( combo ) {
			this.assertFocus();
			combo._.panel.hide();
		} );
	},

	'test editor focus - dialog opened': function() {
		var bot = this.editorBot;
		bot.dialog( 'about', function( dialog ) {
			this.assertFocus();
			dialog.hide();
		} );
	},

	'test editor focus - toolbar focused': function() {
		var bot = this.editorBot;
		bot.execCommand( 'toolbarFocus' );

		// IEs move focus asynchronously in some cases...
		wait( function() {
			this.assertFocus();
		}, 100 );
	},

	// #11647
	'test inheriting the initial focus': function() {
		var el = CKEDITOR.document.createElement( 'div' );
		CKEDITOR.document.getBody().append( el );
		el.setAttribute( 'contenteditable', true );
		el.focus();

		var editor = CKEDITOR.inline( el ),
			focusWasFired = 0;

		editor.on( 'focus', function() {
			focusWasFired += 1;
		} );

		editor.on( 'instanceReady', function() {
			resume( function() {
				assert.isTrue( editor.focusManager.hasFocus, 'hasFocus after init' );
				assert.areSame( editor.editable(), editor.focusManager.currentActive, 'currentActive after init' );
				assert.areSame( 1, focusWasFired, 'focus event was fired once' );

				editor.on( 'blur', function() {
					resume( function() {
						assert.isFalse( editor.focusManager.hasFocus, 'hasFocus after destroy' );
						editor.destroy();
					} );
				} );

				CKEDITOR.document.getById( 'focusable' ).focus();
				wait();
			} );
		} );

		wait();
	},

	// #13446
	'test cleaning up selection on blur (inline editor)': function() {
		if ( !CKEDITOR.env.chrome ) {
			assert.ignore();
		}

		var el = CKEDITOR.document.createElement( 'div' );
		CKEDITOR.document.getBody().append( el );
		el.setAttribute( 'contenteditable', true );

		var editor = CKEDITOR.inline( el );

		editor.on( 'instanceReady', function() {
			resume( function() {
				editor.on( 'blur', function() {
					resume( function() {
						assert.areSame( 'None', editor.getSelection().getNative().type );
					} );
				} );

				CKEDITOR.document.getById( 'focusable' ).focus();
				wait();
			} );
		} );

		el.focus();
		wait();
	},

	// #13446
	'test preserving selection on blur (classic editor)': function() {
		if ( !CKEDITOR.env.chrome ) {
			assert.ignore();
		}

		var editor = this.editor;

		editor.focus();

		bender.tools.focus( CKEDITOR.document.getById( 'focusable' ), function() {
			// Chrome doesn't reset selection after blurring [contenteditable=true],
			// however is not troublesome for classic editor (because the focus is moved
			// outside the whole editor's window), so it should be left untouched there.
			assert.areSame( 'Caret', editor.getSelection().getNative().type );
		} );
	}

} );

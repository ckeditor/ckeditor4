/* bender-tags: editor */
/* bender-ckeditor-plugins: format,toolbar */

bender.editor = true;

bender.test( {
	'test apply format style': function() {
		var bot = this.editorBot, ed = this.editor;
		bot.setHtmlWithSelection( '<p>^foo</p>' );
		var name = 'Format', combo = ed.ui.get( name );
		assert.areSame( CKEDITOR.TRISTATE_OFF, combo._.state, 'check state OFF' );
		bot.combo( name, function( combo ) {
			assert.areSame( CKEDITOR.TRISTATE_ON, combo._.state, 'check state ON when opened' );
			combo.onClick( 'h1' );
			assert.areSame( '<h1>^foo</h1>', bot.htmlWithSelection(), 'applied h1 block style' );
		} );
	},

	'test format style not in context': function() {
		// TODO: IE throws selection inside of form legend.
		if ( CKEDITOR.env.ie )
			assert.ignore();

		var bot = this.editorBot, ed = this.editor;
		bot.setHtmlWithSelection( '<fieldset><legend>^foo</legend><form>bar</form></fieldset>' );
		var name = 'Format', combo = ed.ui.get( name );
		assert.areSame( CKEDITOR.TRISTATE_DISABLED, combo._.state, 'check state disabled when not in context' );
	},

	// Drop-down format menu should not be toggleable (#584).
	'test apply format style to preformated text': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<h1>f^oo</h1>' );

		// Preserved h1 block style.
		bot.combo( 'Format', function( combo ) {
			combo.onClick( 'h1' );
			assert.areSame( '<h1>f^oo</h1>', bot.htmlWithSelection() );
		} );
	}

} );

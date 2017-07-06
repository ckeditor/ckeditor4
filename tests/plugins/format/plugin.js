/* bender-tags: editor,unit */
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

	// Drop down format menu should not have possibility to toggle option (#584).
	'test apply format style twice': function() {
		var bot = this.editorBot,
			editor = this.editor,
			name = 'Format',
			combo = editor.ui.get( name );

		bot.setHtmlWithSelection( '<p>^foo</p>' );
		// apply format 1st time
		assert.areSame( CKEDITOR.TRISTATE_OFF, combo._.state, 'check state OFF' );
		bot.combo( name, function( combo ) {
			assert.areSame( CKEDITOR.TRISTATE_ON, combo._.state, 'check state ON when opened' );
			combo.onClick( 'h1' );
			assert.areSame( '<h1>^foo</h1>', bot.htmlWithSelection(), 'applied h1 block style' );
			// apply format 2nd time
			bot.combo( name, function( combo ) {
				assert.areSame( CKEDITOR.TRISTATE_ON, combo._.state, 'check state ON when opened' );
				combo.onClick( 'h1' );
				assert.areSame( '<h1>^foo</h1>', bot.htmlWithSelection(), 'applied h1 block style' );
			} );
		} );
	}

} );

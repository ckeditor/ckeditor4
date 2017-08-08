/* bender-tags: editor */
/* bender-ckeditor-plugins: format,toolbar */

bender.editor = true;

function assertComboValue( editor, comboName, expectedValue ) {
	var combo = editor.ui.get( comboName );

	assert.areSame( expectedValue, combo.getValue(), 'Combo ' + comboName + ' has appropriate value' );
}

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

	// #525
	'test multiple same formatted blocks': function() {
		var editor = this.editor;

		bender.tools.selection.setWithHtml( editor, '<h3>Hea{ding</h3><h3>Hea}ding</h3>' );
		assertComboValue( editor, 'Format', 'h3' );
	},

	// #525
	'test multiple different formatted blocks': function() {
		var editor = this.editor;

		bender.tools.selection.setWithHtml( editor, '<h3>Hea{ding</h3><address>Addr}ess</address>' );
		assertComboValue( editor, 'Format', '' );
	},

	// #525
	'test nested formatted blocks': function() {
		var editor = this.editor;

		bender.tools.selection.setWithHtml( editor, '<div>foo<address>b{a}r</address></div>' );
		assertComboValue( editor, 'Format', 'address' );
	}
} );

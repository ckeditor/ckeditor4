/* bender-tags: editor */
/* bender-ckeditor-plugins: format,toolbar */

bender.editor = {
	creator: 'inline',
	config: {
		allowedContent: true
	}
};

bender.test( {
	'test selecting first few words, toggle combo and getting selected html': function() {
		var bot = this.editorBot, editor = this.editor;
		bot.setData( '<p><u>Bring rich editor features to your <b>products</b> and <b>websites</b>!</u></p>', function() {
			var text = editor.editable().getFirst().getFirst().getFirst(),
				range = editor.createRange();
			range.setStart( text, 0 );
			range.setEnd( text, 26 );
			range.select();
			assert.areSame( 'Bring rich editor features', range.cloneContents().getHtml() );
			assert.areSame( '<u>Bring rich editor features</u>', editor.getSelectedHtml( true ) );
			bot.combo( 'Format', function() {
				editor.focus();
				assert.areSame( 'Bring rich editor features', range.cloneContents().getHtml() );
				assert.areSame( '<u>Bring rich editor features</u>', editor.getSelectedHtml( true ) );
				editor.destroy();
			} );
		} );
	}
} );

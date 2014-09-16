/* bender-tags: editor,unit,autoparagraphing */
/* bender-ckeditor-plugins: entities */

bender.test(
{
	createEditor : function( config, fn ) {
		if ( bender.editor )
			bender.editor.destroy();

		var tc = this;
		bender.editorBot.create( { config : config }, function( bot ) {
			bender.editor = tc.editor = bot.editor;
			tc.editorBot = bot;
			fn.call( tc );
		} );
	},

	'test ignoreEmptyParagraph(true)' : function() {
		this.createEditor( { ignoreEmptyParagraph : false }, function() {
			   this.editor.focus();
			   assert.areSame( '<p>&nbsp;</p>', this.editorBot.getData( false, true ) );
		   } );
	},

	'test ignoreEmptyParagraph(false)' : function() {
		this.createEditor( { entities: false, ignoreEmptyParagraph: true }, function() {
			   assert.areSame( '', this.editorBot.getData() );
		   } );
	}
} );
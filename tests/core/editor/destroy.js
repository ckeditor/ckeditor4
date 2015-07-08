/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,button,stylescombo */

bender.editor = true;

bender.test(
{
	'test destroy editor with rich combo panel opened': function() {
		var bot = this.editorBot, editor = this.editor;
		bot.combo( 'Styles', function( combo ) {
			var panelEl = combo._.panel.element;
			editor.destroy();
			assert.isFalse( CKEDITOR.document.getBody().contains( panelEl ) );

			// #4552: Do that one more time.
			bender.editorBot.create( {}, function( bot ) {
				this.wait( function() {
					bot.combo( 'Styles', function( combo ) {
						var panelEl = combo._.panel.element;

						bot.editor.destroy();
						assert.isFalse( CKEDITOR.document.getBody().contains( panelEl ) );
					} );
				}, 0 );
			} );

		} );
	},

	// #13385.
	'test getSnapshot returns empty string after editor destroyed': function() {
		bender.editorBot.create( {}, function( bot ) {
			this.wait( function() {
				var editor = bot.editor;
				editor.destroy();
				assert.areSame( '', editor.getSnapshot() );
			}, 0 );
		} );
	}
} );

/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: richcombo,format,stylescombo,font,toolbar */

function combos( editor ) {
	var items = editor.ui.items,
		item,
		combos = [];

	for( var i in items ) {
		item = items[ i ];
		if ( item.type == CKEDITOR.UI_RICHCOMBO )
			combos.push( editor.ui.get( i ) );
	}
	return combos;
}

bender.test( {
	'test rich combos state when editor is readonly' : function() {
		bender.editorBot.create( {
			name: 'readonly',
			config: {
				readOnly: true
			}
		}, function( bot ) {
			bot.setHtmlWithSelection( '<p>^foo</p>' );
			var combos = this.combos( bot.editor ),
				combo;

			for ( var i in combos ) {
				combo = combos[ i ];
				if ( !combo.readOnly )
					assert.areSame( CKEDITOR.TRISTATE_DISABLED, combo._.state );
			}
		} );
	},

	// #11793
	'test clicking while editor is blurred': function() {
		bender.editorBot.create( {
			name: 'blurred'
		}, function( bot ) {
			bot.combo( 'Styles', function( combo ) {
				assert.areSame( CKEDITOR.TRISTATE_ON, combo._.state );
			} );
		} );
	}
} );
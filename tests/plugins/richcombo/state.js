/* bender-tags: editor */
/* bender-ckeditor-plugins: richcombo,format,stylescombo,font,toolbar */

bender.test( {
	'test rich combos state when editor is readonly': function() {
		bender.editorBot.create( {
			name: 'readonly',
			config: {
				readOnly: true
			}
		}, function( bot ) {
			bot.setHtmlWithSelection( '<p>^foo</p>' );

			var editor = bot.editor,
				items = editor.ui.items,
				item,
				combos = [],
				combo,
				i;

			for ( i in items ) {
				item = items[ i ];
				if ( item.type == CKEDITOR.UI_RICHCOMBO )
					combos.push( editor.ui.get( i ) );
			}

			for ( i in combos ) {
				combo = combos[ i ];
				if ( !combo.readOnly )
					assert.areSame( CKEDITOR.TRISTATE_DISABLED, combo._.state );
			}
		} );
	},

	// https://dev.ckeditor.com/ticket/11793
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

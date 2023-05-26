/* bender-tags: editor */
/* bender-ckeditor-plugins: stylescombo,toolbar */

function getLangAttributeFromPanelElements( listBlock ) {
	var els = listBlock.element.find( 'a' ),
		ret = [],
		el,
		attr;

	for ( var i = 0; i < els.count(); ++i ) {
		el = els.getItem( i ),
		attr = el.getAttribute( 'lang' );

		if ( attr !== undefined ) {
			ret.push( attr );
		}
	}

	return ret;
}

bender.test( {
	'test adds lang attribute to Styles combo box item': function() {
		bender.editorBot.create( {
			name: 'cb_1',
			config: {
				stylesSet: [
					{ name: 'testName1', element: 'strong', language: 'pl' },
					{ name: 'testName2', element: 'strong', language: 'en' },
					{ name: 'testName3', element: 'strong', language: 'de' }
				]
			}
		}, function( bot ) {
			var editor = bot.editor,
				stylesCombo = editor.ui.get( 'Styles' );

			stylesCombo.createPanel( editor );

			var lang = getLangAttributeFromPanelElements( stylesCombo._.list );

			assert.areSame( 'pl', lang[ 0 ] );
			assert.areSame( 'en', lang[ 1 ] );
			assert.areSame( 'de', lang[ 2 ] );
		} );
	},

	'test skips adding lang attribute to the Styles combo box item if it is not defined': function() {
		bender.editorBot.create( {
			name: 'cb_2',
			config: {
				language: 'en',
				stylesSet: [
					{ name: 'testName1', element: 'strong' }
				]
			}
		}, function( bot ) {
			var editor = bot.editor,
				stylesCombo = editor.ui.get( 'Styles' );

			stylesCombo.createPanel( editor );

			var lang = getLangAttributeFromPanelElements( stylesCombo._.list );

			assert.isNull( lang[ 0 ] );
		} );
	}
} );

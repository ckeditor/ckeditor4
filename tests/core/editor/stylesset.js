/* bender-tags: editor,unit */

bender.test( {
	'test default styles set setting': function() {
		bender.editorBot.create( {
			name: 'editor_default_styles'
		}, function( bot ) {
			bot.editor.getStylesSet( function( defs ) {
				assert.isNotNull( defs, 'Default styles should be loaded' );
			} );
		} );
	},

	'test no styles set': function() {
		bender.editorBot.create( {
			name: 'editor_no_styles',
			config: {
				stylesSet: false
			}
		}, function( bot ) {
			bot.editor.getStylesSet( function( defs ) {
				assert.isNull( defs );
			} );
		} );
	},

	'test direct styles set setting': function() {
		var stylesCount = 0;

		bender.editorBot.create( {
			name: 'editor_direct_styles',
			config: {
				stylesSet: [
					{ name: 'Italic Title',		element: 'h2', styles: { 'font-style': 'italic' } },
					{ name: 'Big',				element: 'big' }
				],
				on: {
					stylesSet: function( evt ) {
						stylesCount += evt.data.styles.length;
					}
				}
			}
		}, function( bot ) {
			var executed = false;

			bot.editor.getStylesSet( function( defs ) {
				assert.areSame( 'Italic Title', defs[ 0 ].name );
				assert.areSame( 'Big', defs[ 1 ].name );
				executed = true;
			} );

			assert.isTrue( executed, 'getStylesSet was executed synchronously' );
			assert.areSame( 2, stylesCount, 'stylesSet was fired with two styles' );
		} );
	},

	'test external styles set setting': function() {
		var stylesCount = 0;

		bender.editorBot.create( {
			name: 'editor_external_styles',
			config: {
				stylesSet: 'external:%BASE_PATH%_assets/custom_styles.js',
				on: {
					stylesSet: function( evt ) {
						stylesCount += evt.data.styles.length;
					}
				}
			}
		}, function( bot ) {
			var executed = false;

			bot.editor.getStylesSet( function( defs ) {
				assert.areSame( 'Italic Title', defs[ 0 ].name );
				assert.areSame( 'Big', defs[ 1 ].name );
				executed = true;
			} );

			assert.isTrue( executed, 'getStylesSet was executed synchronously' );
			assert.areSame( 2, stylesCount, 'stylesSet was fired with two styles' );
		} );
	}
} );
/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: sharedspace,toolbar */

( function() {
	'use strict';

	function assertEditor( editor ) {
		assert.isTrue( !!CKEDITOR.document.getById( editor.name + '_top' ).getChildCount(), 'toolbar was created' );
		assert.isMatching(
			/^<h2 style="font-style: ?italic;?">Foo<\/h2><p><big>Bar<\/big><strong>Bom<\/strong><\/p>$/,
			bender.tools.compatHtml( editor.getData() ),
			'data was not filtered - ACF was properly configured'
		);
		assert.isTrue( editor.filter.check( 'h2{font-style}' ), 'styles were loaded' );
		assert.isTrue( editor.filter.check( 'strong' ), 'basicstyles were loaded' );
	}

	bender.test( {
		'test themed creator': function() {
			bender.editorBot.create( {
				name: 'editor_test1',
				config: {
					extraPlugins: 'stylescombo,basicstyles',
					// Reuse custom styles from core/editor/styleset.js TC.
					stylesSet: 'external:%BASE_PATH%_assets/custom_styles.js',
					sharedSpaces: {
						top: 'editor_test1_top'
					}
				}
			}, function( bot ) {
				assertEditor( bot.editor );
			} );
		},

		'test inline creator': function() {
			bender.editorBot.create( {
				name: 'editor_test2',
				creator: 'inline',
				config: {
					extraPlugins: 'stylescombo,basicstyles',
					// Reuse custom styles from core/editor/styleset.js TC.
					stylesSet: 'external:%BASE_PATH%_assets/custom_styles.js',
					sharedSpaces: {
						top: 'editor_test2_top'
					}
				}
			}, function( bot ) {
				assertEditor( bot.editor );
			} );
		},

		'test themed creator_dom_element': function() {
			bender.editorBot.create( {
				name: 'editor_test3',
				config: {
					extraPlugins: 'stylescombo,basicstyles',
					// Reuse custom styles from core/editor/styleset.js TC.
					stylesSet: 'external:%BASE_PATH%_assets/custom_styles.js',
					sharedSpaces: {
						top: document.getElementById( 'editor_test3_top' )
					}
				}
			}, function( bot ) {
				assertEditor( bot.editor );
			} );
		}
	} );
} )();
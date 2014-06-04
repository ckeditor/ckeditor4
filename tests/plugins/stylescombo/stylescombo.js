/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: richcombo,format,stylescombo,font,toolbar */

bender.editor = {
	config: {
		stylesSet: 'tester'
	}
};

var tags = [ 'h1', 'span' ],	// Generate both block and inline styles.
	testStyles = [],
	blockNames = [],
	inlineNames = [],
	isBlock, name, i;

// Prepare some block and inline styles to be set.
for ( i = 0 ; i < 100 ; i++ ) {
	name = 'style#' + i;
	isBlock = Math.random() > 0.5;

	testStyles.push( { name: name, element: isBlock ? 'h1' : 'span', styles: {
		'background-color': isBlock ? 'red' : 'green'
	} } );

	// Store style names in order for further check.
	( isBlock ? blockNames : inlineNames ).push( name );
}

// Set prepared stylesSet.
CKEDITOR.stylesSet.add( 'tester', testStyles );

bender.test( {
	'test display order of a custom styleSet': function() {
		var editor = this.editor,
			stylesCombo = editor.ui.get( 'Styles' );

		stylesCombo.createPanel( editor );

		var items = stylesCombo._.items,
			keys = [],
			i = 0;

		// Fetch keys only.
		for ( keys[ i++ ] in items );

		assert.areEqual( testStyles.length, keys.length, 'A number of styles matches.' )
		arrayAssert.itemsAreSame( blockNames.concat( inlineNames ), keys, 'Styles are in ascending order, grouped.' );
	},

	'test external styles are registerd in ACF': function() {
		bender.editorBot.create( {
			name: 'editor_external_styles',
			config: {
				// Reuse custom styles from core/editor/styleset.js TC.
				stylesSet: 'external:%BASE_PATH%_assets/custom_styles.js'
			}
		}, function( bot ) {
			assert.areSame( '<h2 style="font-style:italic">A</h2><p>X<big>Y</big>Z</p>',
				bot.editor.dataProcessor.toHtml( '<h2 style="font-style:italic">A</h2><p>X<big>Y</big>Z</p>' ) );
		} );
	}
} );
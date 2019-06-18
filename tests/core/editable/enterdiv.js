/* bender-tags: editor */

bender.editors = {
	classic: {
		config: {
			enterMode: CKEDITOR.ENTER_DIV
		}
	},
	divarea: {
		config: {
			enterMode: CKEDITOR.ENTER_DIV,
			extraPlugins: 'divarea'
		}
	}
};

var tests = {
	// (#2751)
	'insert div': testInsertHtml( '<div>foo</div>' ),

	// (#2751)
	'insert div wrapped in another div': testInsertHtml( '<div><div>foo</div></div>' ),

	// (#2751)
	'insert two divs': testInsertHtml( '<div>foo</div><div>bar</div>' ),

	// (#2751)
	'insert two divs wrapped in another div': testInsertHtml( '<div><div>foo</div><div>bar</div></div>' )
};

tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

bender.test( tests );

function testInsertHtml( htmlString ) {
	return function( editor, bot ) {
		bot.setData( '', function() {
			editor.insertHtml( htmlString );
			assert.areSame( htmlString, editor.getData() );
		} );
	};
}

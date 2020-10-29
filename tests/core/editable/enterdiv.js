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
	'test insert div': testInsertHtml( '<div>foo</div>' ),

	// (#2751)
	'test insert div wrapped in another div': testInsertHtml( '<div><div>foo</div></div>' ),

	// (#2751)
	'test insert two divs': testInsertHtml( '<div>foo</div><div>bar</div>' ),

	// (#2751)
	'test insert two divs wrapped in another div': testInsertHtml( '<div><div>foo</div><div>bar</div></div>' )
};

tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

// (#4301)
tests[ 'test multiple paste into empty editor' ] = function() {
	bender.editorBot.create( {
		name: 'multiple_paste',
		config: {
			enterMode: CKEDITOR.ENTER_DIV
		}
	}, function( bot ) {
		var html = 'Lorem ipsum',
			editor = bot.editor;

		editor.insertHtml( html );
		editor.insertHtml( html );

		assert.areSame( '<div>' + html + html + '</div>', editor.getData() );
	} );
};

bender.test( tests );

function testInsertHtml( htmlString ) {
	return function( editor, bot ) {
		bot.setData( '', function() {
			editor.insertHtml( htmlString );
			assert.areSame( htmlString, editor.getData() );
		} );
	};
}

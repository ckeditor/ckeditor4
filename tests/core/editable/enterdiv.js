/* bender-tags: editor */

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_DIV
	}
};

var tests = {
	// 2751
	'insert div': testInsertHtml( '<div>foo</div>' ),

	// 2751
	'insert two divs': testInsertHtml( '<div>foo</div><div>bar</div>' )
};

bender.test( tests );

function testInsertHtml( htmlString ) {
	return function() {
		this.editorBot.setData( '', function() {
			var editor = this.editor;

			editor.insertHtml( htmlString );
			assert.areSame( htmlString, editor.getData() );
		} );
	};
}

/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,enterkey,blockquote,toolbar */
/* bender-ckeditor-remove-plugins: basicstyles */

bender.editor = {
	config : { enterMode : CKEDITOR.ENTER_P, fillEmptyBlocks : false },
	allowedForTests: 'i b'
};

bender.test(
{
	// Executes ENTER on input, type some text and check output.
	doTest : function( input, output ) {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor,  input );
		editor.execCommand( 'enter' );
		assert.areSame( output, bender.tools.getHtmlWithSelection( editor ) );
	},

	test_empty : function() {
		this.doTest( '<p>foo</p><blockquote><p>^</p></blockquote>', '<p>foo</p><p>^</p>' );
	},

	test_startWithText : function() {
		this.doTest( '<blockquote><p>^Some text</p></blockquote>', '<blockquote><p></p><p>^Some text</p></blockquote>' );
	},

	test_endWithText : function() {
		this.doTest( '<blockquote><p>Some text^</p></blockquote>', '<blockquote><p>Some text</p><p>^</p></blockquote>' );
	},

	test_emptyMiddle : function() {
		this.doTest( '<blockquote><p>Line1</p><p>^</p><p>Line 2</p></blockquote>', '<blockquote><p>Line1</p></blockquote><p>^</p><blockquote><p>Line 2</p></blockquote>' );
	},

	test_middleOfText : function() {
		this.doTest( '<blockquote><p>Some^text</p></blockquote>', '<blockquote><p>Some</p><p>^text</p></blockquote>' );
	},

	test_start : function() {
		this.doTest( '<blockquote><p>^</p><p>Some text</p></blockquote>', '<p>^</p><blockquote><p>Some text</p></blockquote>' );
	},

	test_end : function() {
		this.doTest( '<blockquote><p>Some text</p><p>^</p></blockquote>', '<blockquote><p>Some text</p></blockquote><p>^</p>' );
	},

	test_startWithSpaces : function() {
		this.doTest( '<blockquote>   \n<p>^</p><p>Some text</p>\n   </blockquote>', '<p>^</p><blockquote><p>Some text</p></blockquote>' );
	},

	test_endWithSpaces : function() {
		this.doTest( '<blockquote>   \n<p>Some text</p><p>^</p>\n   </blockquote>', '<blockquote><p>Some text</p></blockquote><p>^</p>' );
	},

	test_startWithStyles : function() {
		this.doTest( '<blockquote><p><b><i>^</i></b></p><p>Some text</p></blockquote>', '<p><b><i>^</i></b></p><blockquote><p>Some text</p></blockquote>' );
	},

	test_endWithStyles: function() {
		this.doTest( '<blockquote><p>Some text</p><p><b><i>^</i></b></p></blockquote>', '<blockquote><p>Some text</p></blockquote><p><b><i>^</i></b></p>' );
	}
} );
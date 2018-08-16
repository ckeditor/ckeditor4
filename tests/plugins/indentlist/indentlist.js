/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,indentlist,list,wysiwygarea */
/* bender-ui: collapsed */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test indention keeps proper list tags': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<ul><li>foo</li><li>bar<ol><li>111</li></ol><li>[222</li><li>333]</li></li><li>baz</li></ul>' );
			bot.execCommand( 'indent' );

			assert.beautified.html( '<ul><li>foo</li><li>bar<ol><li>111</li><li>222</li><li>333</li></ol></li><li>baz</li></ul>', bot.getData() );
		},

		'test outdent and indent get proper list tags': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<ol><li>foo</li><li>bar<ul><li>111</li><li>2^22</li><li>333</li></ul></li><li>baz</li></ol>' );

			bot.execCommand( 'outdent' );
			assert.beautified.html( '<ol><li>foo</li><li>bar<ul><li>111</li></ul></li><li>222<ul><li>333</li></ul></li><li>baz</li></ol>', bot.getData() );

			bot.execCommand( 'indent' );
			assert.beautified.html( '<ol><li>foo</li><li>bar<ul><li>111</li><li>222<ul><li>333</li></ul></li></ul></li><li>baz</li></ol>', bot.getData() );
		}
	} );
} )();

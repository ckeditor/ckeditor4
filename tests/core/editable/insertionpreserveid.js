/* bender-tags: editor,unit,insertion */

(function() {
	'use strict';

	bender.editors = {
		paragraph: {
			name: "classic",
			config: {
				allowedContent: "span em u p[id](*){*}",
				enterMode: CKEDITOR.ENTER_P
			}
		},
		divarea: {
			name: "divarea",
			config: {
				allowedContent: "span em u div[id](*){*}",
				enterMode: CKEDITOR.ENTER_DIV
			}
		}
	};

	bender.test({
		'test insert nothing into inline element with id': function() {
			var editor = this.editors.paragraph,
				bot = this.editorBots.paragraph;
			bot.setHtmlWithSelection( '<p style="text-align: right"><span class="marker" id="abc">te^st</span></p>' );
			editor.insertText( '' );
			assert.areSame( '<p style="text-align: right"><span class="marker" id="abc">test</span></p>', bot.getData() );
		},

		'test insert text into multiple inline element with ids': function() {
			var editor = this.editors.paragraph,
				bot = this.editorBots.paragraph;
			bot.setHtmlWithSelection( '<p style="text-align: right"><span class="marker" id="abc"><em id="def"><u id="ghj">te^st</u></em></span></p>' );
			editor.insertText( 'foo' );
			assert.areSame( '<p style="text-align: right"><span class="marker" id="abc"><em id="def"><u id="ghj">tefoost</u></em></span></p>', bot.getData() );
		},

		'test insert multiline text into element with id': function() {
			var editor = this.editors.paragraph,
				bot = this.editorBots.paragraph;
			bot.setHtmlWithSelection( '<p><span class="marker" id="abc">te^st</span></p>' );
			// insertText has 'feature' when double \n treat as separate paragraphs text.
			editor.insertText( 'foo\n\nbar' );
			assert.areSame( '<p><span class="marker" id="abc">te</span></p>'+
							'<p><span class="marker">foo</span></p>'+
							'<p><span class="marker">bar</span></p>'+
							'<p><span class="marker">st</span></p>', bot.getData() );
		},

		'test insert text into inline element with id div mode': function() {
			var editor = this.editors.divarea,
				bot = this.editorBots.divarea;
			bot.setHtmlWithSelection( '<div><span class="marker" id="abc"><em id="xyz">te^st</em></span></div>' );
			editor.insertText( '789' );
			assert.areSame( '<div><span class="marker" id="abc"><em id="xyz">te789st</em></span></div>', bot.getData() );
		},

		'test insert nothing into inline element with id div mode': function() {
			var editor = this.editors.divarea,
				bot = this.editorBots.divarea;
			bot.setHtmlWithSelection( '<div style="text-align: right"><span class="marker" id="abc"><em>te^st</em></span></div>' );
			editor.insertText( '' );
			assert.areSame( '<div style="text-align: right"><span class="marker" id="abc"><em>test</em></span></div>', bot.getData() );
		}
	});
}());

/* bender-tags: editor,unit,insertion */

(function() {
	'use strict';

	bender.editors = {
		paragraph: {
			name: "classic",
			config: {
				allowedContent: "span p[id](*){*}",
				enterMode: CKEDITOR.ENTER_P
			}
		},
		divarea: {
			name: "divarea",
			config: {
				allowedContent: "span div[id](*){*}",
				enterMode: CKEDITOR.ENTER_DIV
			}
		}
	};

	bender.test({

		'test insert nothing into inline element with id': function() {
			var editor = this.editors.paragraph,
				bot = this.editorBots.paragraph;

			bot.setHtmlWithSelection( '<p style="text-align:right"><span class="marker" id="abc">te^st</span></p>' );
			editor.insertText( '' );
			assert.areSame( '<p style="text-align:right"><span class="marker" id="abc">test</span></p>', bot.getData() );


		},

		'test insert text into multiple inline element with ids': function() {
			var editor = this.editors.paragraph,
				bot = this.editorBots.paragraph;

			bot.setHtmlWithSelection( '<p style="text-align:right"><span class="marker" id="abc"><span id="def"><span id="ghj">te^st</span></span></span></p>' );
			editor.insertText( 'foo' );
			assert.areSame( '<p style="text-align:right"><span class="marker" id="abc"><span id="def"><span id="ghj">tefoost</span></span></span></p>', bot.getData() );


		},

		'test insert text into inline element with id div mode': function() {
			var editor = this.editors.divarea,
				bot = this.editorBots.divarea;

			bot.setHtmlWithSelection( '<div><span class="marker" id="abc">te^st</span></div>' );
			editor.insertText( '789' );
			assert.areSame( '<div><span class="marker" id="abc">te789st</span></div>', bot.getData() );
		},

		'test insert nothing into inline element with id div mode': function() {
			var editor = this.editors.divarea,
				bot = this.editorBots.divarea;

			bot.setHtmlWithSelection( '<div style="text-align:right"><span class="marker" id="abc">te^st</span></div>' );
			editor.insertText( '' );
			assert.areSame( '<div style="text-align:right"><span class="marker" id="abc">test</span></div>', bot.getData() );
		}


	});


}());

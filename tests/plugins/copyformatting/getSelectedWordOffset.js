/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
( function() {
	'use strict';

	var plugin;

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		setUp: function() {
			plugin = CKEDITOR.plugins.copyformatting;
		},

		'test getSelectedWordOffset (word inside text node)': function() {
			var word, range;

			this.editor.focus();
			bender.tools.selection.setWithHtml( this.editor, '<p>Get th{}is word</p>' );

			word = plugin._getSelectedWordOffset( this.editor.getSelection().getRanges()[ 0 ] );

			range = this.editor.createRange();
			range.setStart( word.startNode, word.startOffset );
			range.setEnd( word.endNode, word.endOffset );
			range.select();

			assert.areSame( 'this', range.extractContents().getHtml() )
		},

		'test getSelectedWordOffset (word inside element)': function() {
			var word, range;

			this.editor.focus();
			bender.tools.selection.setWithHtml( this.editor, '<p>Get <span style="font-weight: bold">th{}is</span> word</p>' );

			word = plugin._getSelectedWordOffset( this.editor.getSelection().getRanges()[ 0 ] );

			range = this.editor.createRange();
			range.setStart( word.startNode, word.startOffset );
			range.setEnd( word.endNode, word.endOffset );
			range.select();

			assert.areSame( 'this', range.extractContents().getHtml() )
		},

		'test getSelectedWordOffset (word splitted between element and text node)': function() {
			var word, range;

			this.editor.focus();
			bender.tools.selection.setWithHtml( this.editor, '<p>Get <span style="font-weight: bold;">th</span>{}is word</p>' );

			word = plugin._getSelectedWordOffset( this.editor.getSelection().getRanges()[ 0 ] );

			range = this.editor.createRange();
			range.setStart( word.startNode, word.startOffset );
			range.setEnd( word.endNode, word.endOffset );
			range.select();

			assert.areSame( '<span style="font-weight: bold;">th</span>is', range.extractContents().getHtml() )
		},

		'test getSelectedWordOffset (word splitted between elements)': function() {
			var word, range;

			this.editor.focus();
			bender.tools.selection.setWithHtml( this.editor, '<p>Get <span style="font-weight: bold;">th{</span><b>}is</b> word</p>' );

			word = plugin._getSelectedWordOffset( this.editor.getSelection().getRanges()[ 0 ] );

			range = this.editor.createRange();
			range.setStart( word.startNode, word.startOffset );
			range.setEnd( word.endNode, word.endOffset );
			range.select();

			assert.areSame( 'this', range.extractContents().getHtml() )
		}
	} );
}() );

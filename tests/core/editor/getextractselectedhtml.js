/* bender-tags: editor,unit */

'use strict';

bender.editor = {
	creator: 'inline',
	config: {
		allowedContent: true
	}
};

bender.test( {
	'test getSelectedHtml': function() {
		var editor = this.editor;
		bender.tools.selection.setWithHtml( editor, '<p>fo{ob}ar</p>' );

		var frag = editor.getSelectedHtml();

		assert.isInstanceOf( CKEDITOR.dom.documentFragment, frag );
		assert.areSame( 'ob', frag.getHtml() );
	},

	'test getSelectedHtml with toString option': function() {
		var editor = this.editor;
		bender.tools.selection.setWithHtml( editor, '<p>fo{ob}ar</p>' );

		assert.areSame( 'ob', editor.getSelectedHtml( true ) );
	},

	'test extractSelectedHtml': function() {
		var editor = this.editor;
		bender.tools.selection.setWithHtml( editor, '<p>fo{ob}ar</p>' );

		// We need to precisely check if selection was set, because
		// after the selected part of the DOM is extracted browser would
		// make a similar selection in similar place. This way we're distinguishing who made it.
		sinon.spy( CKEDITOR.dom.selection.prototype, 'selectRanges' );

		var frag = editor.extractSelectedHtml(),
			selectionWasSetOnce = CKEDITOR.dom.selection.prototype.selectRanges.calledOnce;

		CKEDITOR.dom.selection.prototype.selectRanges.restore();

		assert.areSame( 'ob', frag.getHtml(), 'extracted HTML' );
		assert.isTrue( selectionWasSetOnce, 'new selection has been set' );
		assert.isInnerHtmlMatching( '<p>fo^ar@</p>', bender.tools.selection.getWithHtml( editor ),
			{ compareSelection: true, normalizeSelection: true }, 'contents of the editor' );
	},

	'test extractSelectedHtml with toString option': function() {
		var editor = this.editor;
		bender.tools.selection.setWithHtml( editor, '<p>fo{ob}ar</p>' );

		assert.areSame( 'ob', editor.extractSelectedHtml( true ) );
		assert.isInnerHtmlMatching( '<p>fo^ar@</p>', bender.tools.selection.getWithHtml( editor ),
			{ compareSelection: true, normalizeSelection: true }, 'contents of the editor' );
	}
} );
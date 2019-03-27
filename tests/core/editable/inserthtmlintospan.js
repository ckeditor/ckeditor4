/* bender-tags: editor,insertion */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true,
			autoParagraph: false
		}
	};

	bender.test( {
		// (#2813)
		'test insertHtml when selection ends at the end of span': assertInsertHtml( '<span>foo{bar}</span>', '<span>foo</span><div>div</div>' ),
		// (#2813)
		'test insertHtml when selection starts at the beginning of span': assertInsertHtml( '<span>{foo}bar</span>', '<div>div</div><span>bar</span>' ),
		// (#2813)
		'test insertHtml when selection covers span': assertInsertHtml( '<span>{foobar}</span>', '<div>div</div>' )
	} );

	function assertInsertHtml( initial, expected ) {
		return function() {
			var editor = this.editorBot.editor;

			bender.tools.selection.setWithHtml( editor, initial );

			editor.insertHtml( '<div>div</div>' );

			assert.areSame( expected, editor.editable().getHtml().toLowerCase().replace( /(<br>|\s)/g, '' ) );
		};
	}
} )();

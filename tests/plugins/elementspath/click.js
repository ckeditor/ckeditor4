/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: elementspath */

( function() {
	'use strict';

	// Elements path feature is only available in themed UI creators.
	bender.editor = { creator: 'replace' };

	bender.test( {

		fixHtml: bender.tools.fixHtml,

		assertHtmlEqual: function( expected, actual ) {
			// Note: assertion removes brs from actual results (FF issue).
			assert.areEqual( this.fixHtml( expected ), this.fixHtml( actual ).replace( /<br\s*\/\>/g, '' ) );
		},

		'test function availability': function() {
			assert.isInstanceOf( Function, this.editor._.elementsPath.onClick );
		},

		'test clicking typical strong element': function() {
			var bot = this.editorBot,
				editor = this.editor,
				expectedHtml = '<p><strong>[test]</strong></p>';

			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version > 8 ) || CKEDITOR.env.gecko || CKEDITOR.env.chrome )
				// IE9 and higher, selectes elements rather than text.
				expectedHtml = '<p>[<strong>test</strong>]</p>';

			bot.setHtmlWithSelection( '<p><strong>te^st</strong></p>' );

			// Invoke click() on <strong /> representation in elements path.
			bot.editor._.elementsPath.onClick( 0 );
			var curRange = editor.getSelection().getRanges()[ 0 ];

			this.assertHtmlEqual( expectedHtml, bender.tools.getHtmlWithRanges( editor.document.getBody(), new CKEDITOR.dom.rangeList( [ curRange ] )  ) );
		},

		'test clicking contenteditable strong element': function() {
			var bot = this.editorBot,
				editor = this.editor,
				// We expect that textnode of contenteditable element will be selected.
				expectedHtml = '<div contenteditable="false"><figure><figcaption contenteditable="true" id="sel_caption">[roll out of saturn v on launch pad]</figcaption></figure></div>';

			bot.setHtmlWithSelection( bender.tools.getValueAsHtml( 'testClickingContentEditableSource' ) );

			// Invoke click() on <figcaption> representation in elements path.
			bot.editor._.elementsPath.onClick( 0 );
			var curRange = editor.getSelection().getRanges()[ 0 ];

			this.assertHtmlEqual( expectedHtml, bender.tools.getHtmlWithRanges( editor.document.getBody(), new CKEDITOR.dom.rangeList( [ curRange ] )  ) );
		}
	} );
} )();
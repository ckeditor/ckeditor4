/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea, toolbar */
( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		// (#4659)
		'test --!> is treated as valid comment end tag': function() {
			var element = new CKEDITOR.htmlParser.fragment.fromHtml( '<!----!><strong>Test</strong>-->' ),
				htmlWriter = new CKEDITOR.htmlParser.basicWriter(),
				expected = '<!----><strong>Test</strong>-->';

			element.writeHtml( htmlWriter );

			bender.assert.beautified.html( expected, htmlWriter.getHtml(), {
				sortAttributes: true,
				message: 'HTML output'
			} );
		},

		// (#4659)
		'test --!> with {cke_protected} is treated as valid comment end tag': function() {
			var element = new CKEDITOR.htmlParser.fragment.fromHtml( '<!--{cke {cke_protected}_protected} --!><p>Foo bar</p> -->' ),
				htmlWriter = new CKEDITOR.htmlParser.basicWriter(),
				expected = '<!--{cke {cke_protected}_protected} --><p>Foo bar</p>-->';

			element.writeHtml( htmlWriter );

			bender.assert.beautified.html( expected, htmlWriter.getHtml(), {
				sortAttributes: true,
				message: 'HTML output'
			} );
		}
	} );
}() );

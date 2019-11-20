/* bender-tags: editor,pastetools */
/* bender-ckeditor-plugins: wysiwygarea,pastetools,font,toolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			removePlugins: 'pastefromword,pastefromlibreoffice,pastefromgdocs',
			allowedContent: true
		}
	};

	var commonFilter;

	CKEDITOR.scriptLoader.load( CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js', function() {
		commonFilter = CKEDITOR.plugins.pastetools.createFilter( {
			rules: [
				// Implement general rules to filter all children in provided tree.
				function( html, editor, filter ) {
					return {
						root: function( element ) {
							element.filterChildren( filter );
						},
						elements: {
							'$': function( element ) {
								element.filterChildren( element );
							}
						}
					};
				},
				CKEDITOR.plugins.pastetools.filters.common.rules
			]
		} );
	} );

	function assertCommonFilter( editor, input, expected ) {
		// Can't use bender.tools.testInputOut as it normalizes an input html
		var actualOutput = commonFilter( input, editor );

		assert.beautified.html( expected, actualOutput );
	}

	bender.test( {
		'tests common filter should remove apple spaces': function() {
			assertCommonFilter(
				this.editor,
				'<p>foo<span class="Apple-converted-space">\u00A0</span>bar</p>',
				'<p>foo bar</p>'
			);
		},

		'test common filter should remove superflous styles': function() {
			var input = '<p style="' +
				'background-color: transparent;' +
				'background: transparent;' +
				'background-color: none;' +
				'background: none;' +
				'background-position: initial initial;' +
				'background-repeat: initial initial;' +
				'caret-color;' +
				'font-family: -webkit-standard;' +
				'font-variant-caps;' +
				'letter-spacing: normal;' +
				'orphans: auto;' +
				'widows: auto;' +
				'text-transform: none;' +
				'word-spacing: 0px;' +
				'-webkit-text-size-adjust: auto;' +
				'-webkit-text-stroke-width: 0px;' +
				'text-indent: 0px;' +
				'margin-bottom: 0in' +
			'" >foo bar</p>';

			assertCommonFilter(
				this.editor,
				input,
				'<p>foo bar</p>'
			);
		},

		'test common filter should replace font-face if there is matching one': function() {
			assertCommonFilter(
				this.editor,
				'<font face="Verdana,sans-serif">foo</font>',
				'<font face="Verdana, Geneva, sans-serif">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="Trebuchet MS,sans-serif">foo</font>',
				'<font face="Trebuchet MS, Helvetica, sans-serif">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="Times New Roman">foo</font>',
				'<font face="Times New Roman, Times, serif">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="Tahoma,sans-serif">foo</font>',
				'<font face="Tahoma, Geneva, sans-serif">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="Lucida Sans Unicode">foo</font>',
				'<font face="Lucida Sans Unicode, Lucida Grande, sans-serif">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="Georgia,serif">foo</font>',
				'<font face="Georgia, serif">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="Courier New,monospace">foo</font>',
				'<font face="Courier New, Courier, monospace">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="Comic Sans MS,cursive">foo</font>',
				'<font face="Comic Sans MS, cursive">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="Arial,sans-serif">foo</font>',
				'<font face="Arial, Helvetica, sans-serif">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="Arial">foo</font>',
				'<font face="Arial, Helvetica, sans-serif">foo</font>'
			);
		},

		'test common filter should remain font-face if there is no matching one': function() {
			assertCommonFilter(
				this.editor,
				'<font face="bar">foo</font>',
				'<font face="bar">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="arial">foo</font>',
				'<font face="arial">foo</font>'
			);

			assertCommonFilter(
				this.editor,
				'<font face="Roboto">foo</font>',
				'<font face="Roboto">foo</font>'
			);
		}
	} );
} )();

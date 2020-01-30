/* bender-tags: editor,pastetools */
/* bender-ckeditor-plugins: wysiwygarea,pastetools,font,toolbar */
/* bender-include: ../_helpers/ptTools.js */
/* global ptTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			removePlugins: 'pastefromword,pastefromlibreoffice,pastefromgdocs',
			allowedContent: true
		}
	};

	var tests = {
		'tests common filter should remove apple spaces': function() {
			var editor = this.editor,
				filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js';

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.plugins.pastetools.filters.common.rules' )
				.then( extendFilterRules )
				.then( assertFilter( {
					editor: editor,
					input: '<p>foo<span class="Apple-converted-space">\u00A0</span>bar</p>',
					expected: '<p>foo bar</p>'
				} ) );
		},

		'test common filter should remove superfluous styles': function() {
			var editor = this.editor,
				filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js',
				input = '<p style="' +
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

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.plugins.pastetools.filters.common.rules' )
				.then( extendFilterRules )
				.then( assertFilter( {
					editor: editor,
					input: input,
					expected: '<p>foo bar</p>'
				} ) );
		},

		'test common filter should replace font-face if there is matching one': function() {
			var editor = this.editor,
				filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js';

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.plugins.pastetools.filters.common.rules' )
				.then( extendFilterRules )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Verdana,sans-serif">foo</font>',
					expected: '<font face="Verdana, Geneva, sans-serif">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Trebuchet MS,sans-serif">foo</font>',
					expected: '<font face="Trebuchet MS, Helvetica, sans-serif">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Times New Roman">foo</font>',
					expected: '<font face="Times New Roman, Times, serif">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Tahoma,sans-serif">foo</font>',
					expected: '<font face="Tahoma, Geneva, sans-serif">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Lucida Sans Unicode">foo</font>',
					expected: '<font face="Lucida Sans Unicode, Lucida Grande, sans-serif">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Georgia,serif">foo</font>',
					expected: '<font face="Georgia, serif">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Courier New,monospace">foo</font>',
					expected: '<font face="Courier New, Courier, monospace">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Comic Sans MS,cursive">foo</font>',
					expected: '<font face="Comic Sans MS, cursive">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Arial,sans-serif">foo</font>',
					expected: '<font face="Arial, Helvetica, sans-serif">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Arial">foo</font>',
					expected: '<font face="Arial, Helvetica, sans-serif">foo</font>'
				} ) );
		},

		'test common filter should remain font-face if there is no matching one': function() {
			var editor = this.editor,
				filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js';

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.plugins.pastetools.filters.common.rules' )
				.then( extendFilterRules )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="bar">foo</font>',
					expected: '<font face="bar">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="arial">foo</font>',
					expected: '<font face="arial">foo</font>'
				} ) )
				.then( assertFilter( {
					editor: editor,
					input: '<font face="Roboto">foo</font>',
					expected: '<font face="Roboto">foo</font>'
				} ) );
		}
	};

	tests = bender.tools.createAsyncTests( tests );
	bender.test( tests );

	function extendFilterRules( rules ) {
		return CKEDITOR.plugins.pastetools.createFilter( {
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
				rules
			]
		} );
	}

	function assertFilter( options ) {
		return function( filter ) {
			var editor = options.editor,
				input = options.input,
				expected = options.expected;

			// Can't use bender.tools.testInputOut as it normalizes an input html
			var actualOutput = filter( input, editor );

			assert.beautified.html( expected, actualOutput );

			return filter;
		};
	}
} )();

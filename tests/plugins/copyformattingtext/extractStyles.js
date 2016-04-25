/* bender-tags: copyformattingtext */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting, copyformattingtext */
/* bender-include: ../copyformatting/_helpers/tools.js */
/* bender-include: _helpers/tools.js */
/* global testExtractingFormatting */

( function() {
	'use strict';

	var styleAttr = 'text-decoration: underline;font-style: italic;',
		tests;

	bender.editors = {
		classic: {
			config: {
				allowedContent: true
			}
		},

		inline: {
			creator: 'inline',
			config: {
				allowedContent: true
			}
		}
	};

	tests = {
		'test extract style from mapped semantic element': function( editor, bot ) {
			testExtractingFormatting( editor, bot, '<s>strikethrough</s>', {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract style from mapped semantic element with attributes': function( editor, bot ) {
			testExtractingFormatting( editor, bot,
				'<strong class="important" title="Neil Armstrong">Neil Armstrong</strong>', {
				element: 'strong',
				attributes: {
					'class': 'important',
					title: 'Neil Armstrong'
				},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract style from span with [style] attribute': function( editor, bot ) {
			testExtractingFormatting( editor, bot, '<span style="' + styleAttr + '">Test</span>', {
				element: 'span',
				attributes: {},
				styles: CKEDITOR.tools.parseCssText( styleAttr, true, true ),
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract preexisting styles (without computed styles)': function( editor, bot ) {
			testExtractingFormatting( editor, bot, '<span style="' + styleAttr + '">Test</span>', {
				element: 'span',
				attributes: {},
				styles: CKEDITOR.tools.parseCssText( styleAttr, true, true ),
				type: CKEDITOR.STYLE_INLINE
			}, null, { oldStyles: true } );
		},

		'test extract style from mapped semantic element (with custom computed styles)': function( editor, bot ) {
			testExtractingFormatting( editor, bot, '<s>strikethrough</s>', {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, [
				'background-color',
				'position'
			] );
		},

		'test extract styles (without computed styles)': function( editor, bot ) {
			testExtractingFormatting( editor, bot, '<span style="' + styleAttr + '">Test</span>', {
				element: 'span',
				attributes: {},
				styles: CKEDITOR.tools.parseCssText( styleAttr, true, true ),
				type: CKEDITOR.STYLE_INLINE
			}, false );
		},

		'test extract styles from list item': function( editor, bot ) {
			testExtractingFormatting( editor, bot, '<li>strikethrough</li>', {
				element: 'li',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, editor.config.copyformatting_listsComputedStyles );
		},

		'test extract styles from ul element': function( editor, bot ) {
			testExtractingFormatting( editor, bot, '<ul><li></li></ul>', {
				element: 'ul',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract styles from ol element': function( editor, bot ) {
			testExtractingFormatting( editor, bot, '<ol><li></li></ol>', {
				element: 'ol',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract styles from td element': function( editor, bot ) {
			testExtractingFormatting( editor, bot, '<table><tr><td></td></tr></table>', {
				element: 'td',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, editor.config.copyformatting_tableComputedStyles );
		}

	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
}() );


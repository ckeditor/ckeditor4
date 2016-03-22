/* bender-tags: copyformattingtext */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting, copyformattingtext */
/* bender-include: ../copyformatting/_helpers/tools.js */
/* bender-include: _helpers/tools.js */
/* global testExtractingFormatting */

( function() {
	'use strict';

	var styleAttr = 'text-decoration: underline;font-weight: bold;color: #f00;',
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
				styles: CKEDITOR.tools.parseCssText( CKEDITOR.tools.normalizeCssText( styleAttr, true ) ),
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract preexisting styles (without computed styles)': function( editor, bot ) {
			testExtractingFormatting( editor, bot, '<span style="' + styleAttr + '">Test</span>', {
				element: 'span',
				attributes: {},
				styles: CKEDITOR.tools.parseCssText( CKEDITOR.tools.normalizeCssText( styleAttr, true ) ),
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
		}

	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
}() );


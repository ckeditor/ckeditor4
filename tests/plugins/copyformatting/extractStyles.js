/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js */
/* global testConvertingStyles */

( function() {
	'use strict';

	var styleAttr = 'text-decoration: underline;font-weight: bold;color: #f00;';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		'test extract style from mapped semantic element': function() {
			testConvertingStyles( '<s>strikethrough</s>', {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract style from mapped semantic element with attributes': function() {
			testConvertingStyles( '<strong class="important" title="Neil Armstrong">Neil Armstrong</strong>', {
				element: 'strong',
				attributes: {
					'class': 'important',
					title: 'Neil Armstrong'
				},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract style from span with [style] attribute': function() {
			testConvertingStyles( '<span style="' + styleAttr + '">Test</span>', {
				element: 'span',
				attributes: {},
				styles: CKEDITOR.tools.parseCssText( CKEDITOR.tools.normalizeCssText( styleAttr, true ) ),
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract style from span with [id] attribute': function() {
			testConvertingStyles( '<span id="test-id" style="' + styleAttr + '">Test</span>', {
				element: 'span',
				attributes: {},
				styles: CKEDITOR.tools.parseCssText( CKEDITOR.tools.normalizeCssText( styleAttr, true ) ),
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract style from link': function() {
			var element = CKEDITOR.dom.element.createFromHtml( '<a href="http://cksource.com">Test</a>' ),
				style = CKEDITOR.plugins.copyformatting._convertElementToStyle( element );

			assert.isUndefined( style, 'Return value' );
		},

		'test extract styles from nested elements': function() {
			var element = CKEDITOR.dom.element.createFromHtml( '<strong class="important" ' +
					'title="Neil Armstrong"><span style="' + styleAttr + '"><s>Neil Armstrong</s></span></strong>' ),
				styles = CKEDITOR.plugins.copyformatting._extractStylesFromElement( element.findOne( 's' ) );

			assert.isArray( styles );
			assert.areSame( 3, styles.length );

			objectAssert.areDeepEqual( {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, styles[ 0 ]._.definition );

			objectAssert.areDeepEqual( {
				element: 'span',
				attributes: {},
				styles: CKEDITOR.tools.parseCssText( CKEDITOR.tools.normalizeCssText( styleAttr, true ) ),
				type: CKEDITOR.STYLE_INLINE
			}, styles[ 1 ]._.definition );

			objectAssert.areDeepEqual( {
				element: 'strong',
				attributes: {
					'class': 'important',
					title: 'Neil Armstrong'
				},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, styles[ 2 ]._.definition );
		}
	} );
}() );

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

		'test excluding attributes': function() {
			testConvertingStyles( '<span href="http://ckeditor.com" data-cke-saved-href="http://ckeditor.com" ' +
				'style="' + styleAttr + '" dir="ltr">Test</span>', {
				element: 'span',
				attributes: {},
				styles: CKEDITOR.tools.parseCssText( CKEDITOR.tools.normalizeCssText( styleAttr, true ) ),
				type: CKEDITOR.STYLE_INLINE
			} );
		},

		'test extract style from skipped elements': function() {
			var elements = [
					CKEDITOR.dom.element.createFromHtml( '<img src="http://xxx">' ),
					CKEDITOR.dom.element.createFromHtml( '<iframe src="http://xxx">' ),
					CKEDITOR.dom.element.createFromHtml( '<input type="text">' ),
					CKEDITOR.dom.element.createFromHtml( '<textarea>Test</textarea>' ),
					CKEDITOR.dom.element.createFromHtml( '<button>Test</button>' ),
					CKEDITOR.dom.element.createFromHtml( '<span data-cke-realelement>Test</span>' ),
					CKEDITOR.dom.element.createFromHtml( '<span data-cke-widget-id="0">Test</span>' ),
					CKEDITOR.dom.element.createFromHtml( '<a href="http://cksource.com">Test</a>' ),
					CKEDITOR.dom.element.createFromHtml( '<table></table>' )
				],
				style,
				i;

			for ( i = 0; i < elements.length; i++ ) {
				style = CKEDITOR.plugins.copyformatting._extractStylesFromElement( this.editor, elements[ i ] );

				objectAssert.areDeepEqual( [], style, 'Return value' );
			}
		},

		'test extract styles from nested elements': function() {
			var element = CKEDITOR.dom.element.createFromHtml( '<strong class="important" ' +
					'title="Neil Armstrong"><span style="' + styleAttr + '"><s>Neil Armstrong</s></span></strong>' ),
				styles = CKEDITOR.plugins.copyformatting._extractStylesFromElement( this.editor, element.findOne( 's' ) );

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
		},

		'test extract styles from nested lists': function() {
			var element = CKEDITOR.dom.element.createFromHtml( '<ol><li><ul><li>Test</li></ul></li></ol>' ),
				styles = CKEDITOR.plugins.copyformatting._extractStylesFromElement( this.editor, element.findOne( 'ul li' ) );

			assert.isArray( styles );
			assert.areSame( 2, styles.length );

			objectAssert.areDeepEqual( {
				element: 'li',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, styles[ 0 ]._.definition );

			objectAssert.areDeepEqual( {
				element: 'ul',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, styles[ 1 ]._.definition );
		}
	} );
}() );

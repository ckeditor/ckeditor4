/* bender-tags: clipboard,pastefromword */
/* bender-include: ../../pastefromword/generated/_helpers/promisePasteEvent.js,../../pastefromword/generated/_helpers/assertWordFilter.js,../../pastefromword/generated/_helpers/createTestCase.js */
/* bender-include: ../../pastefromword/generated/_helpers/createTestSuite.js,../../pastefromword/generated/_helpers/pfwTools.js */
/* global createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: {
			language: 'en',
			plugins: [
				'pastefromgdocs',
				'ajax',
				'basicstyles',
				'bidi',
				'font',
				'link',
				'toolbar',
				'colorbutton',
				'image',
				'list',
				'liststyle',
				'sourcearea',
				'format',
				'justify',
				'table',
				'tableresize',
				'tabletools',
				'indent',
				'indentblock',
				'div',
				'dialog',
				'pagebreak'
			],
			disallowedContent: '*[data-cke-*];'
		}
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'safari',
			'ie11',
			'edge'
		],
		wordVersions: [
			'gdocs'
		],
		tests: {
			Basic: true,
			BasicCKE5: true,
			NestedOrderedLists: true,
			NestedUnorderedLists: true
		},

		customFilters: [
			new CKEDITOR.htmlParser.filter( {
				attributes: {
					href: function( value ) {
						return value.replace( /\/$/, '' );
					},

					style: function( value ) {
						return value.replace( /['"]/gi, '&quot;' );
					}
				},
				elements: {
					br: function() {
						return false;
					},

					p: function sortStyles( element ) {
						if ( element.children.length === 0 || isBogus( element.children ) ) {
							return false;
						}

						function isBogus( children ) {
							var child = children[ 0 ],
								emptySpaceRegex = /^(\s+|&nbsp;)$/;

							if ( children.length > 1 ) {
								return false;
							}

							return child.name === 'br' || emptySpaceRegex.test( child.value );
						}
					}
				}
			} )
		],

		// Ignored due to lack of support for older IE browsers and mobiles (#3451).
		ignoreAll: CKEDITOR.env.ie && CKEDITOR.env.version < 11 || bender.tools.env.mobile,
		testData: {
			_should: {
				ignore: {
					'test Basic gdocs chrome': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test Basic gdocs firefox': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test Basic gdocs safari': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test Basic gdocs edge': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test Basic gdocs ie11': !CKEDITOR.env.ie || CKEDITOR.env.version > 11,
					'test BasicCKE5 gdocs chrome': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test BasicCKE5 gdocs firefox': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test BasicCKE5 gdocs safari': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test BasicCKE5 gdocs edge': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test BasicCKE5 gdocs ie11': !CKEDITOR.env.ie || CKEDITOR.env.version > 11
				}
			}
		}
	} ) );
} )();

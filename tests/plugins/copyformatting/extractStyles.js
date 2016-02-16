/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
( function() {
	'use strict';

	var plugin;

	// Based on http://yuilibrary.com/yui/docs/api/files/test_js_ObjectAssert.js.html#l12.
	objectAssert.areDeepEqual = function( expected, actual, message ) {
		var expectedKeys = YUITest.Object.keys( expected ),
			actualKeys = YUITest.Object.keys( actual ),
			areEqual = YUITest.ObjectAssert.areEqual;

		YUITest.Assert._increment();

		// First check keys array length.
		if ( expectedKeys.length != actualKeys.length ) {
			YUITest.Assert.fail( YUITest.Assert._formatMessage( message,
				'Object should have ' + expectedKeys.length + ' keys but has ' + actualKeys.length ) );
		}

		// Then check values.
		for ( var name in expected ) {
			if ( expected.hasOwnProperty( name ) ) {
				if ( typeof expected[ name ] === 'object' ) {
					areEqual( expected[ name ], actual[ name ] );
				}
				else if ( expected[ name ] !== actual[ name ] ) {
					throw new YUITest.ComparisonFailure( YUITest.Assert._formatMessage( message,
						'Values should be equal for property ' + name ), expected[ name ], actual[ name ] );
				}
			}
		}
	};

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		setUp: function() {
			plugin = CKEDITOR.plugins.copyformatting;
		},

		'test extract style from mapped semantic element': function() {
			var element = CKEDITOR.dom.element.createFromHtml( '<s>strikethrough</s>' ),
				style = plugin._convertElementToStyle( element );

			objectAssert.areDeepEqual( {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, style._.definition );
		},

		'test extract style from mapped semantic element with attributes': function() {
			var element = CKEDITOR.dom.element.createFromHtml( '<strong class="important" ' +
				'title="Neil Armstrong">Neil Armstrong</strong>' ),
				style = plugin._convertElementToStyle( element );

			objectAssert.areDeepEqual( {
				element: 'strong',
				attributes: {
					'class': 'important',
					title: 'Neil Armstrong'
				},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, style._.definition );
		},

		'test extract style from span with [style] attribute': function() {
			var styleAttr = 'text-decoration: underline;font-weight: bold;color: #f00;',
				element = CKEDITOR.dom.element.createFromHtml( '<span style="' + styleAttr + '">Test</span>' ),
				style = plugin._convertElementToStyle( element );

			objectAssert.areDeepEqual( {
				element: 'span',
				attributes: {},
				styles: CKEDITOR.tools.parseCssText( CKEDITOR.tools.normalizeCssText( styleAttr, true ) ),
				type: CKEDITOR.STYLE_INLINE
			}, style._.definition );
		},

		'test extract styles from nested elements': function() {
			var styleAttr = 'text-decoration: underline;font-weight: bold;color: #f00;',
				element = CKEDITOR.dom.element.createFromHtml( '<strong class="important" ' +
					'title="Neil Armstrong"><span style="' + styleAttr + '"><s>Neil Armstrong</s></span></strong>' ),
				styles = plugin._extractStylesFromElement( element.findOne( 's' ) );

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

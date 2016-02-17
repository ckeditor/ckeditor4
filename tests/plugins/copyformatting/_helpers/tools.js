'use strict';

// Based on http://yuilibrary.com/yui/docs/api/files/test_js_ObjectAssert.js.html#l12.
YUITest.ObjectAssert.areDeepEqual = function( expected, actual, message ) {
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

function testAttributes( element, expected, exclude ) {
	var attributes;

	element = new CKEDITOR.dom.element( document.getElementsByTagName( element )[ 0 ] );
	attributes = CKEDITOR.plugins.copyformatting._getAttributes( element, exclude );

	assert.isObject( attributes );
	objectAssert.areEqual( expected, attributes );
}

function testGettingWordOffset( editor, htmlWithSelection, expected ) {
	var word, range, contents;

	bender.tools.selection.setWithHtml( editor, htmlWithSelection );

	word = CKEDITOR.plugins.copyformatting._getSelectedWordOffset( editor.getSelection().getRanges()[ 0 ] );

	range = editor.createRange();
	range.setStart( word.startNode, word.startOffset );
	range.setEnd( word.endNode, word.endOffset );
	range.select();

	// Strip all HTML tags from range's content and compare only fetched text.
	contents = range.extractContents().getHtml().replace( /<.*?>/g, '' );

	assert.areSame( expected, contents );
}

function testApplyingFormat( editor, htmlWithSelection, expectedContent, styles ) {
	var range, applied, i;

	bender.tools.selection.setWithHtml( editor, htmlWithSelection );
	CKEDITOR.plugins.copyformatting._applyFormat( styles, editor );

	range = editor.getSelection().getRanges()[ 0 ];
	range.shrink( CKEDITOR.SHRINK_TEXT );
	for ( i = applied = 0; i < styles.length; i++ ) {
		if ( styles[ i ].checkActive( range.startPath(), editor ) ) {
			++applied;
		}
	}

	assert.areSame( styles.length, applied );
	// Content is now placed inside the element of the first applied style.
	assert.areSame( expectedContent, editor.editable().findOne( styles[ 0 ].element ).getHtml() );
}

function testConvertingStyles( elementHtml, expectedStyles ) {
	var element = CKEDITOR.dom.element.createFromHtml( elementHtml ),
		style = CKEDITOR.plugins.copyformatting._convertElementToStyle( element );

	objectAssert.areDeepEqual( expectedStyles, style._.definition );
}

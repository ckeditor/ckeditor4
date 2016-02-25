/* exported testAttributes, testGettingWordOffset, testApplyingFormat, testConvertingStyles, assertCopyFormattingState,
	assertApplyFormattingState, testCopyFormattingFlow
 */

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

function assertCopyFormattingState( editor, expectedStyles, additionalData ) {
	var cmd = editor.getCommand( 'copyFormatting' );

	if ( !additionalData || additionalData.sticky ) {
		assert.areSame( CKEDITOR.TRISTATE_ON, cmd.state, 'Button is active' );
		assert.isTrue( editor.editable().hasClass( 'cke_copyformatting_active' ),
			'Editable area has class indicating that Copy Formatting is active' );
	} else if ( additionalData.from == 'keystrokeHandler' ) {
		assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state, 'Button is not active (keystroke)' );
		assert.isFalse( editor.editable().hasClass( 'cke_copyformatting_active' ),
			'Editable area does not have class indicating that Copy Formatting is active' );
	}

	assert.isArray( cmd.styles, 'Styles are stored in the array' );
	assert.areSame( 1, cmd.styles.length, 'There are correct amount of styles' );

	for ( var i = 0; i < expectedStyles.length; i++ ) {
		assert.isInstanceOf( CKEDITOR.style, cmd.styles[ i ], 'Style #' + i + ' is an instanceof CKEDITOR.style' );
		objectAssert.areDeepEqual( expectedStyles[ i ], cmd.styles[ i ]._.definition, 'Style # ' + i +
			' has correct definition' );
	}
}

function assertApplyFormattingState( editor, expectedStyles, styledElement, additionalData ) {
	var cmd = editor.getCommand( 'copyFormatting' ),
		path = new CKEDITOR.dom.elementPath( styledElement, editor.editable() );

	if ( !additionalData ) {
		assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state, 'Button is not active' );
		assert.isNull( cmd.styles, 'Styles are removed from store' );
		assert.isFalse( editor.editable().hasClass( 'cke_copyformatting_active' ),
			'Editable area does not have class indicating that Copy Formatting is active' );

	} else if ( additionalData.from === 'keystrokeHandler' ) {
		assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state, 'Button is not active' );
		assert.isArray( cmd.styles, 'Styles are not removed from store' );
		assert.isFalse( editor.editable().hasClass( 'cke_copyformatting_active' ),
			'Editable area does not have class indicating that Copy Formatting is active' );

	} else if ( additionalData.sticky ) {
		assert.areSame( CKEDITOR.TRISTATE_ON, cmd.state, 'Button is active' );
		assert.isArray( cmd.styles, 'Styles are not removed from store' );
		assert.isTrue( editor.editable().hasClass( 'cke_copyformatting_active' ),
			'Editable area does not have class indicating that Copy Formatting is active' );
	}

	for ( var i = 0; i < expectedStyles.length; i++ ) {
		assert.isTrue( expectedStyles[ i ].checkActive( path, editor ), 'Style #' + i + ' is correctly applied' );
	}
}

function testCopyFormattingFlow( editor, htmlWithSelection, expectedStyles, rangeInfo, additionalData ) {
	var cmd = editor.getCommand( 'copyFormatting' ),
		styles, element, range;

	bender.tools.selection.setWithHtml( editor, htmlWithSelection );

	editor.execCommand( 'copyFormatting', additionalData );

	assertCopyFormattingState( editor, expectedStyles, additionalData );

	styles = cmd.styles;

	// Select text node inside element (as the text is selected when element is clicked).
	element = editor.editable().findOne( rangeInfo.elementName ).getChild( 0 );
	range = editor.createRange();
	range.setStart( element, rangeInfo.startOffset );
	range.setEnd( element, rangeInfo.endOffset );

	if ( rangeInfo.collapsed ) {
		range.collapse();
	}

	range.select();

	editor.execCommand( 'applyFormatting', additionalData );

	assertApplyFormattingState( editor, styles, element, additionalData );

	// Reset command to inital state.
	if ( cmd.state === CKEDITOR.TRISTATE_ON || cmd.styles ) {
		cmd.styles = null;
		cmd.sticky = false;
		cmd.setState( CKEDITOR.TRISTATE_OFF );
	}
}

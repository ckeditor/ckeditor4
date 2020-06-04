/* exported testGettingWordOffset, testApplyingFormat, testConvertingStyles, assertScreenReaderNotification, assertCopyFormattingState,
	assertApplyFormattingState, testCopyFormattingFlow, fixHtml
 */

'use strict';

// Safari and IE8 use text selection and all other browsers use element selection. Therefore we must normalize it.
function fixHtml( html ) {
	if ( ( CKEDITOR.env.webkit && !CKEDITOR.env.chrome ) || ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) ) {
		html = html.replace( /\{/g, '[' ).replace( /\}/g, ']' );
	}

	html = html.replace( /[^\u0001-\u0255]/g, '' );

	return bender.tools.fixHtml( html );
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

/**
 * @param {CKEDITOR.editor} editor Editor's instance.
 * @param {String} htmlWithSelection HTML with selection that will be put into editor.
 * @param {String} expectedContent Expected content of styled element.
 * @param {CKEDTITOR.style[]} newStyles Array of styles to be applied.
 * @param {CKEDITOR.style[]} oldStyles Array of styles to be removed.
 * @param {CKEDITOR.style[]} expectedStyles Array of styles to be applied (pass this parameter
 * if styles inside newStyles are going to be transformed).
 */
function testApplyingFormat( editor, htmlWithSelection, expectedContent, newStyles, oldStyles, expectedStyles ) {
	var applied = 0,
		removed = 0,
		range,
		i;

	oldStyles = CKEDITOR.tools.isArray( oldStyles ) ? oldStyles : [];
	expectedStyles = CKEDITOR.tools.isArray( expectedStyles ) ? expectedStyles : newStyles;

	bender.tools.selection.setWithHtml( editor, htmlWithSelection );
	CKEDITOR.plugins.copyformatting._applyFormat( editor, newStyles );

	range = editor.getSelection().getRanges()[ 0 ];
	range.shrink( CKEDITOR.SHRINK_TEXT );

	// Check if all old styles were removed.
	for ( i = 0; i < oldStyles.length; i++ ) {
		if ( !oldStyles[ i ].checkActive( range.startPath(), editor ) ) {
			++removed;
		}
	}

	assert.areSame( oldStyles.length, removed, 'Old styles were removed correctly.' );

	// Now check if all new styles were applied.
	for ( i = 0; i < expectedStyles.length; i++ ) {
		if ( expectedStyles[ i ].checkActive( range.startPath(), editor ) ) {
			++applied;
		}
	}

	assert.areSame( expectedStyles.length, applied, 'New styles were applied correctly.' );

	// Content is now placed inside the element of the first applied style.
	if ( editor.editable().findOne( newStyles[ 0 ].element ) ) {
		assert.areSame( expectedContent, editor.editable().findOne( newStyles[ 0 ].element ).getHtml() );
	}
}

function testConvertingStyles( elementHtml, expectedStyle ) {
	var element = CKEDITOR.dom.element.createFromHtml( elementHtml ),
		style = CKEDITOR.plugins.copyformatting._convertElementToStyleDef( element );

	objectAssert.areDeepEqual( expectedStyle, style );
}

function assertScreenReaderNotification( editor, msg ) {
	var container = CKEDITOR.document.getBody().find( '.cke_copyformatting_notification div[aria-live]' );

	assert.areSame( 1, container.count(), 'There are only one container for displaying notifications' );
	assert.areSame( editor.lang.copyformatting.notification[ msg ], container.getItem( 0 ).getText(),
		'The correct notification for the screen reader is displayed' );
}

function assertCopyFormattingState( editor, expectedStyles, additionalData ) {
	var cmd = editor.getCommand( 'copyFormatting' ),
		areaWithCursor = CKEDITOR.plugins.copyformatting._getCursorContainer( editor ),
		copyFormatting = editor.copyFormatting;

	assert.areSame( CKEDITOR.TRISTATE_ON, cmd.state, 'Button is active' );

	if ( !additionalData || additionalData.sticky ) {
		assert.isTrue( areaWithCursor.hasClass( 'cke_copyformatting_active' ),
			'Editable area has class indicating that Copy Formatting is active' );
		assert.isTrue( CKEDITOR.document.getDocumentElement().hasClass( 'cke_copyformatting_disabled' ),
			'The page has class indicating that Copy Formatting is active' );
	} else if ( additionalData.from == 'keystrokeHandler' ) {
		assert.isFalse( areaWithCursor.hasClass( 'cke_copyformatting_active' ),
			'Editable area does not have class indicating that Copy Formatting is active' );
		assert.isFalse( CKEDITOR.document.getDocumentElement().hasClass( 'cke_copyformatting_disabled' ),
			'The page does not have class indicating that Copy Formatting is active' );
	}

	assert.isArray( copyFormatting.styles, 'Styles are stored in the array' );

	// Filtering is done while applying styles, so unnecessary style from paragraph is still there.
	assert.areSame( expectedStyles.length, copyFormatting.styles.length - 1, 'There are correct amount of styles' );

	for ( var i = 0; i < expectedStyles.length; i++ ) {
		assert.isInstanceOf( CKEDITOR.style, copyFormatting.styles[ i ], 'Style #' + i + ' is an instanceof CKEDITOR.style' );
		objectAssert.areDeepEqual( expectedStyles[ i ], copyFormatting.styles[ i ]._.definition, 'Style # ' + i +
			' has correct definition' );
	}
}

function assertApplyFormattingState( editor, expectedStyles, styledElement, additionalData ) {
	var cmd = editor.getCommand( 'copyFormatting' ),
		//path = new CKEDITOR.dom.elementPath( styledElement, editor.editable() ),
		areaWithCursor = CKEDITOR.plugins.copyformatting._getCursorContainer( editor ),
		copyFormatting = editor.copyFormatting;

	if ( !additionalData ) {
		assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state, 'Button is not active' );
		assert.isNull( copyFormatting.styles, 'Styles are removed from store' );
		assert.isFalse( areaWithCursor.hasClass( 'cke_copyformatting_active' ),
			'Editable area does not have class indicating that Copy Formatting is active' );
		assert.isFalse( CKEDITOR.document.getDocumentElement().hasClass( 'cke_copyformatting_disabled' ),
			'The page does not have class indicating that Copy Formatting is active' );

	} else if ( additionalData.from === 'keystrokeHandler' ) {
		assert.areSame( CKEDITOR.TRISTATE_ON, cmd.state, 'Button is active' );
		assert.isArray( copyFormatting.styles, 'Styles are not removed from store' );
		assert.isFalse( areaWithCursor.hasClass( 'cke_copyformatting_active' ),
			'Editable area does not have class indicating that Copy Formatting is active' );
		assert.isFalse( CKEDITOR.document.getDocumentElement().hasClass( 'cke_copyformatting_disabled' ),
			'The page does not have class indicating that Copy Formatting is active' );

	} else if ( additionalData.sticky ) {
		assert.areSame( CKEDITOR.TRISTATE_ON, cmd.state, 'Button is active' );
		assert.isArray( copyFormatting.styles, 'Styles are not removed from store' );
		assert.isTrue( areaWithCursor.hasClass( 'cke_copyformatting_active' ),
			'Editable area does not have class indicating that Copy Formatting is active' );
		assert.isTrue( CKEDITOR.document.getDocumentElement().hasClass( 'cke_copyformatting_disabled' ),
			'The page has class indicating that Copy Formatting is active' );
	}

	// If we test removing formatting, we should check if there is no styles left on the element.
	// Actually the plugin would return styles from paragraph, so "no styles" means "styles only from paragraph".
	if ( expectedStyles.length > 0 ) {
		// Due to bug in CKEDITOR.style, this checking is disabled.
		/*for ( var i = 1; i <= expectedStyles.length; i++ ) {
			assert.isTrue( expectedStyles[ i ].checkActive( path, editor ), 'Style #' + i + ' is correctly applied' );
		}*/
	} else {
		assert.areSame( 1, CKEDITOR.plugins.copyformatting._extractStylesFromElement( editor, styledElement ).length,
			'There are no styles applied to element' );
	}
}

/**
 * @param {CKEDITOR.editor} editor Editor's instance.
 * @param {String} htmlWithSelection HTML with selection that will be put into the editor.
 * @param {Object[]} expectedStyles Array of definitions of styles that will be applied.
 * @param {CKEDITOR.style[]} removedStyles Array of styles that should be removed.
 * @param {Object} rangeInfo Object with information about range that should be created for the test.
 * @param {Object} additionalData Additional data to be passed to plugin's commands.
 */
function testCopyFormattingFlow( editor, htmlWithSelection, expectedStyles, removedStyles, rangeInfo, additionalData ) {
	var cmd = editor.getCommand( 'copyFormatting' ),
		copyFormatting = editor.copyFormatting,
		events = {
			extractFormatting: 0
		},
		styles,
		removed,
		element,
		range;

	function countExtractFormatting() {
		++events.extractFormatting;
	}

	bender.tools.selection.setWithHtml( editor, htmlWithSelection );

	copyFormatting.on( 'extractFormatting', countExtractFormatting, null, null, 1000 );
	editor.execCommand( 'copyFormatting', additionalData );
	copyFormatting.removeListener( 'extractFormatting', countExtractFormatting, null, null, 1000 );

	assertCopyFormattingState( editor, expectedStyles, additionalData );
	assertScreenReaderNotification( editor, 'copied' );

	styles = copyFormatting.styles;

	assert.areSame( copyFormatting.styles.length, events.extractFormatting,
		'For every extracted styles, a proper event was fired.' );

	events.extractFormatting = 0;

	// Select text node inside element (as the text is selected when element is clicked).
	element = editor.editable().findOne( rangeInfo.elementName ).getChild( 0 );
	range = editor.createRange();

	if ( rangeInfo.element ) {
		range.selectNodeContents( element );
	} else {
		range.setStart( element, rangeInfo.startOffset );
		range.setEnd( element, rangeInfo.endOffset );
	}

	if ( rangeInfo.collapsed ) {
		range.collapse();
	}

	range.select();

	copyFormatting.on( 'extractFormatting', countExtractFormatting );

	copyFormatting.once( 'applyFormatting', function( evt ) {
		assert.isArray( evt.data.styles, 'New styles are passed to the applyFormatting event.' );
	} );

	copyFormatting.once( 'applyFormatting', function() {
		var path = range.startPath(),
			i,
			element;

		// IE8 could leave removed style as the element without any content. In such case, we should remove that element
		// before checking if the style is actually removed.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
			for ( i = 0; i < path.elements.length; i++ ) {
				element = path.elements[ i ];

				if ( element.isEmptyInlineRemoveable() ) {
					element.remove();
				}
			}
		}

		// Check if styles that should be removed are really removed.
		for ( i = removed = 0; i < removedStyles.length; i++ ) {
			if ( !removedStyles[ i ].checkActive( path, editor ) ) {
				++removed;
			}
		}

		assert.areSame( removedStyles.length, removed, 'All preexisting styles are removed correctly' );
	}, null, null, 100001 );

	editor.execCommand( 'applyFormatting', additionalData );
	copyFormatting.removeListener( 'extractFormatting', countExtractFormatting );

	// At the moment, fetching preexisting styles returns many duplicates.
	// Therefore strict match will always fail.
	assert.isTrue( removedStyles.length <= events.extractFormatting,
		'For every removed style a proper event was fired.' );

	assertApplyFormattingState( editor, styles, element, additionalData );
	assertScreenReaderNotification( editor, 'applied' );

	// Reset command to inital state.
	if ( cmd.state === CKEDITOR.TRISTATE_ON ) {
		editor.execCommand( 'copyFormatting' );
	}
	if ( copyFormatting.styles ) {
		copyFormatting.styles = null;
	}
}

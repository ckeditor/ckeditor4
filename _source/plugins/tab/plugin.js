/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var meta = {
		editorFocus: false,
		modes: { wysiwyg:1,source:1 }
	};

	var blurCommand = {
		exec: function( editor ) {
			editor.container.focusNext( true, editor.tabIndex );
		}
	};

	var blurBackCommand = {
		exec: function( editor ) {
			editor.container.focusPrevious( true, editor.tabIndex );
		}
	};

	CKEDITOR.plugins.add( 'tab', {
		requires: [ 'keystrokes' ],

		init: function( editor ) {
			var tabSpaces = editor.config.tabSpaces || 0,
				tabText = '';

			while ( tabSpaces-- )
				tabText += '\xa0';

			if ( tabText ) {
				editor.on( 'key', function( ev ) {
					if ( ev.data.keyCode == 9 ) // TAB
					{
						editor.insertHtml( tabText );
						ev.cancel();
					}
				});
			}

			if ( CKEDITOR.env.webkit || CKEDITOR.env.gecko ) {
				editor.on( 'key', function( ev ) {
					var keyCode = ev.data.keyCode;

					if ( keyCode == 9 && !tabText ) // TAB
					{
						ev.cancel();
						editor.execCommand( 'blur' );
					}

					if ( keyCode == ( CKEDITOR.SHIFT + 9 ) ) // SHIFT+TAB
					{
						editor.execCommand( 'blurBack' );
						ev.cancel();
					}
				});
			}

			editor.addCommand( 'blur', CKEDITOR.tools.extend( blurCommand, meta ) );
			editor.addCommand( 'blurBack', CKEDITOR.tools.extend( blurBackCommand, meta ) );
		}
	});
})();

/**
 * Moves the UI focus to the element following this element in the tabindex
 * order.
 * @example
 * var element = CKEDITOR.document.getById( 'example' );
 * element.focusNext();
 */
CKEDITOR.dom.element.prototype.focusNext = function( ignoreChildren, indexToUse ) {
	var $ = this.$,
		curTabIndex = ( indexToUse === undefined ? this.getTabIndex() : indexToUse ),
		passedCurrent, enteredCurrent, elected, electedTabIndex, element, elementTabIndex;

	if ( curTabIndex <= 0 ) {
		// If this element has tabindex <= 0 then we must simply look for any
		// element following it containing tabindex=0.

		element = this.getNextSourceNode( ignoreChildren, CKEDITOR.NODE_ELEMENT );

		while ( element ) {
			if ( element.isVisible() && element.getTabIndex() === 0 ) {
				elected = element;
				break;
			}

			element = element.getNextSourceNode( false, CKEDITOR.NODE_ELEMENT );
		}
	} else {
		// If this element has tabindex > 0 then we must look for:
		//		1. An element following this element with the same tabindex.
		//		2. The first element in source other with the lowest tabindex
		//		   that is higher than this element tabindex.
		//		3. The first element with tabindex=0.

		element = this.getDocument().getBody().getFirst();

		while ( ( element = element.getNextSourceNode( false, CKEDITOR.NODE_ELEMENT ) ) ) {
			if ( !passedCurrent ) {
				if ( !enteredCurrent && element.equals( this ) ) {
					enteredCurrent = true;

					// Ignore this element, if required.
					if ( ignoreChildren ) {
						if ( !( element = element.getNextSourceNode( true, CKEDITOR.NODE_ELEMENT ) ) )
							break;
						passedCurrent = 1;
					}
				} else if ( enteredCurrent && !this.contains( element ) )
					passedCurrent = 1;
			}

			if ( !element.isVisible() || ( elementTabIndex = element.getTabIndex() ) < 0 )
				continue;

			if ( passedCurrent && elementTabIndex == curTabIndex ) {
				elected = element;
				break;
			}

			if ( elementTabIndex > curTabIndex && ( !elected || !electedTabIndex || elementTabIndex < electedTabIndex ) ) {
				elected = element;
				electedTabIndex = elementTabIndex;
			} else if ( !elected && elementTabIndex === 0 ) {
				elected = element;
				electedTabIndex = elementTabIndex;
			}
		}
	}

	if ( elected )
		elected.focus();
};

/**
 * Moves the UI focus to the element before this element in the tabindex order.
 * @example
 * var element = CKEDITOR.document.getById( 'example' );
 * element.focusPrevious();
 */
CKEDITOR.dom.element.prototype.focusPrevious = function( ignoreChildren, indexToUse ) {
	var $ = this.$,
		curTabIndex = ( indexToUse === undefined ? this.getTabIndex() : indexToUse ),
		passedCurrent, enteredCurrent, elected,
		electedTabIndex = 0,
		elementTabIndex;

	var element = this.getDocument().getBody().getLast();

	while ( ( element = element.getPreviousSourceNode( false, CKEDITOR.NODE_ELEMENT ) ) ) {
		if ( !passedCurrent ) {
			if ( !enteredCurrent && element.equals( this ) ) {
				enteredCurrent = true;

				// Ignore this element, if required.
				if ( ignoreChildren ) {
					if ( !( element = element.getPreviousSourceNode( true, CKEDITOR.NODE_ELEMENT ) ) )
						break;
					passedCurrent = 1;
				}
			} else if ( enteredCurrent && !this.contains( element ) )
				passedCurrent = 1;
		}

		if ( !element.isVisible() || ( elementTabIndex = element.getTabIndex() ) < 0 )
			continue;

		if ( curTabIndex <= 0 ) {
			// If this element has tabindex <= 0 then we must look for:
			//		1. An element before this one containing tabindex=0.
			//		2. The last element with the highest tabindex.

			if ( passedCurrent && elementTabIndex === 0 ) {
				elected = element;
				break;
			}

			if ( elementTabIndex > electedTabIndex ) {
				elected = element;
				electedTabIndex = elementTabIndex;
			}
		} else {
			// If this element has tabindex > 0 we must look for:
			//		1. An element preceeding this one, with the same tabindex.
			//		2. The last element in source other with the highest tabindex
			//		   that is lower than this element tabindex.

			if ( passedCurrent && elementTabIndex == curTabIndex ) {
				elected = element;
				break;
			}

			if ( elementTabIndex < curTabIndex && ( !elected || elementTabIndex > electedTabIndex ) ) {
				elected = element;
				electedTabIndex = elementTabIndex;
			}
		}
	}

	if ( elected )
		elected.focus();
};

/**
 * Intructs the editor to add a number of spaces (&amp;nbsp;) to the text when
 * hitting the TAB key. If set to zero, the TAB key will be used to move the
 * cursor focus to the next element in the page, out of the editor focus.
 * @name CKEDITOR.config.tabSpaces
 * @type Number
 * @default 0
 * @example
 * config.tabSpaces = 4;
 */

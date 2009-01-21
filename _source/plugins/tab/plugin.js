/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var blurInternal = function( editor, previous ) {
			var hasContainer = editor.container;

			if ( hasContainer ) {
				// We need an empty element after the container, so the focus don't go to a container child.
				var tempSpan = new CKEDITOR.dom.element( 'span' );
				tempSpan.setAttribute( 'tabindex', editor.container.getTabIndex() );
				tempSpan.hide();

				// Insert the temp element and set the focus.
				if ( previous ) {
					tempSpan.insertBefore( editor.container );
					tempSpan.focusPrevious();
				} else {
					tempSpan.insertAfter( editor.container );
					tempSpan.focusNext();
				}

				// Remove the temporary node.
				tempSpan.remove();
			}

			return hasContainer;
		};

	var blurCommand = {
		exec: function( editor ) {
			return blurInternal( editor );
		}
	};

	var blurBackCommand = {
		exec: function( editor ) {
			return blurInternal( editor, true );
		}
	};

	CKEDITOR.plugins.add( 'tab', {
		requires: [ 'keystrokes' ],

		init: function( editor, pluginPath ) {
			// Register the keystrokes.
			var keystrokes = editor.keystrokeHandler.keystrokes;
			keystrokes[ 9 /* TAB */ ] = 'tab';
			keystrokes[ CKEDITOR.SHIFT + 9 /* TAB */ ] = 'shiftTab';

			var tabSpaces = editor.config.tabSpaces,
				tabText = '';

			while ( tabSpaces-- )
				tabText += '\xa0';

			// Register the "tab" and "shiftTab" commands.
			editor.addCommand( 'tab', {
				exec: function( editor ) {
					// Fire the "tab" event, making it possible to
					// customize the TAB key behavior on specific cases.
					if ( !editor.fire( 'tab' ) ) {
						if ( tabText.length > 0 ) {
							// TODO
							/*jsl:pass*/
						} else {
							// All browsers jump to the next field on TAB,
							// except Safari, so we have to do that manually
							// here.
							/// https://bugs.webkit.org/show_bug.cgi?id=20597
							return editor.execCommand( 'blur' );
						}
					}

					return true;
				}
			});

			editor.addCommand( 'shiftTab', {
				exec: function( editor ) {
					// Fire the "tab" event, making it possible to
					// customize the TAB key behavior on specific cases.
					if ( !editor.fire( 'shiftTab' ) )
						return editor.execCommand( 'blurBack' );

					return true;
				}
			});

			editor.addCommand( 'blur', blurCommand );
			editor.addCommand( 'blurBack', blurBackCommand );
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
CKEDITOR.dom.element.prototype.focusNext = function() {
	var $ = this.$,
		curTabIndex = this.getTabIndex(),
		passedCurrent = false,
		elected, electedTabIndex;

	var all = document.body.all || document.body.getElementsByTagName( '*' );

	if ( curTabIndex <= 0 ) {
		for ( var i = 0, element; element = all[ i ]; i++ ) {
			if ( !passedCurrent ) {
				if ( element == $ )
					passedCurrent = true;
				continue;
			}

			element = new CKEDITOR.dom.element( element );

			if ( element.getComputedStyle( 'display' ) == 'none' || element.getComputedStyle( 'visibility' ) == 'hidden' )
				continue;

			if ( element.getTabIndex() === 0 ) {
				elected = element;
				break;
			}
		}
	} else {
		for ( i = 0, element; element = all[ i ]; i++ ) {
			if ( !passedCurrent && element == $ ) {
				passedCurrent = true;
				continue;
			}

			element = new CKEDITOR.dom.element( element );

			if ( element.getComputedStyle( 'display' ) == 'none' || element.getComputedStyle( 'visibility' ) == 'hidden' )
				continue;

			var elementTabIndex = element.getTabIndex();

			if ( passedCurrent && elementTabIndex == curTabIndex ) {
				elected = element;
				break;
			} else if ( elementTabIndex > curTabIndex && ( !elected || electedTabIndex > elementTabIndex || electedTabIndex === 0 ) ) {
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
CKEDITOR.dom.element.prototype.focusPrevious = function() {
	var $ = this.$,
		curTabIndex = this.getTabIndex(),
		passedCurrent = false,
		elected, electedTabIndex;

	var all = document.body.all || document.body.getElementsByTagName( '*' );

	if ( curTabIndex <= 0 ) {
		for ( var i = 0, element; element = all[ i ]; i++ ) {
			if ( !passedCurrent && element == $ ) {
				if ( elected && electedTabIndex === 0 )
					break;

				passedCurrent = true;
				continue;
			}

			element = new CKEDITOR.dom.element( element );

			if ( element.getComputedStyle( 'display' ) == 'none' || element.getComputedStyle( 'visibility' ) == 'hidden' )
				continue;

			var elementTabIndex = element.getTabIndex();

			if ( ( !passedCurrent && elementTabIndex === 0 ) || ( elementTabIndex > 0 && ( !elected || ( electedTabIndex > 0 && electedTabIndex <= elementTabIndex ) ) ) ) {
				elected = element;
				electedTabIndex = elementTabIndex;
			}
		}
	} else {
		for ( i = 0, element; element = all[ i ]; i++ ) {
			if ( !passedCurrent && element == $ ) {
				if ( elected && electedTabIndex == curTabIndex )
					break;

				passedCurrent = true;
				continue;
			}

			element = new CKEDITOR.dom.element( element );

			elementTabIndex = element.getTabIndex();

			if ( elementTabIndex > 0 ) {
				if ( ( !passedCurrent && elementTabIndex == curTabIndex ) || ( elementTabIndex < curTabIndex && ( !elected || electedTabIndex <= elementTabIndex ) ) ) {
					elected = element;
					electedTabIndex = elementTabIndex;
				}
			}
		}
	}

	if ( elected )
		elected.focus();
};

/**
 * Intructs the editor to add a number of spaces (&amp;nbsp;) to the text when
 * hitting the TAB key. If set to zero, the TAB key will have its default
 * behavior instead (like moving out of the editor).
 * @type {Number}
 * @default 0
 * @example
 * config.tabSpaces = 4;
 */
CKEDITOR.config.tabSpaces = 0;

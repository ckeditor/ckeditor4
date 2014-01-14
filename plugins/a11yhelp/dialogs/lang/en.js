/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'en', {
	title: 'Accessibility Instructions',
	contents: 'Help Contents. To close this dialog press ESC.',
	legend: [
		{
		name: 'General',
		items: [
			{
			name: 'Editor Toolbar',
			legend: 'Press ${toolbarFocus} to navigate to the toolbar. ' +
				'Move to the next and previous toolbar group with TAB and SHIFT-TAB. ' +
				'Move to the next and previous toolbar button with RIGHT ARROW or LEFT ARROW. ' +
				'Press SPACE or ENTER to activate the toolbar button.'
		},

			{
			name: 'Editor Dialog',
			legend: 'Inside a dialog, press TAB to navigate to next dialog field, press SHIFT + TAB to move to previous field, press ENTER to submit dialog, press ESC to cancel dialog. ' +
				'For dialogs that have multiple tab pages, press ALT + F10 to navigate to tab-list. ' +
				'Then move to next tab with TAB OR RIGTH ARROW. ' +
				'Move to previous tab with SHIFT + TAB or LEFT ARROW. ' +
				'Press SPACE or ENTER to select the tab page.'
		},

			{
			name: 'Editor Context Menu',
			legend: 'Press ${contextMenu} or APPLICATION KEY to open context-menu. ' +
				'Then move to next menu option with TAB or DOWN ARROW. ' +
				'Move to previous option with SHIFT+TAB or UP ARROW. ' +
				'Press SPACE or ENTER to select the menu option. ' +
				'Open sub-menu of current option with SPACE or ENTER or RIGHT ARROW. ' +
				'Go back to parent menu item with ESC or LEFT ARROW. ' +
				'Close context menu with ESC.'
		},

			{
			name: 'Editor List Box',
			legend: 'Inside a list-box, move to next list item with TAB OR DOWN ARROW. ' +
				'Move to previous list item with SHIFT + TAB or UP ARROW. ' +
				'Press SPACE or ENTER to select the list option. ' +
				'Press ESC to close the list-box.'
		},

			{
			name: 'Editor Element Path Bar',
			legend: 'Press ${elementsPathFocus} to navigate to the elements path bar. ' +
				'Move to next element button with TAB or RIGHT ARROW. ' +
				'Move to previous button with  SHIFT+TAB or LEFT ARROW. ' +
				'Press SPACE or ENTER to select the element in editor.'
		}
		]
	},
		{
		name: 'Commands',
		items: [
			{
			name: ' Undo command',
			legend: 'Press ${undo}'
		},
			{
			name: ' Redo command',
			legend: 'Press ${redo}'
		},
			{
			name: ' Bold command',
			legend: 'Press ${bold}'
		},
			{
			name: ' Italic command',
			legend: 'Press ${italic}'
		},
			{
			name: ' Underline command',
			legend: 'Press ${underline}'
		},
			{
			name: ' Link command',
			legend: 'Press ${link}'
		},
			{
			name: ' Toolbar Collapse command',
			legend: 'Press ${toolbarCollapse}'
		},
			{
			name: ' Access previous focus space command',
			legend: 'Press ${accessPreviousSpace} to access the closest unreachable focus space before the caret, ' +
				'for example: two adjacent HR elements. Repeat the key combination to reach distant focus spaces.'
		},
			{
			name: ' Access next focus space command',
			legend: 'Press ${accessNextSpace} to access the closest unreachable focus space after the caret, ' +
				'for example: two adjacent HR elements. Repeat the key combination to reach distant focus spaces.'
		},
			{
			name: ' Accessibility Help',
			legend: 'Press ${a11yHelp}'
		}
		]
	}
	],
	backspace: 'BACKSPACE',
	tab: 'TAB',
	enter: 'ENTER',
	shift: 'SHIFT',
	ctrl: 'CTRL',
	alt: 'ALT',
	pause: 'PAUSE',
	capslock: 'CAPSLOCK',
	escape: 'ESCAPE',
	pageUp: 'PAGE UP',
	pageDown: 'PAGE DOWN',
	end: 'END',
	home: 'HOME',
	leftArrow: 'LEFT ARROW',
	upArrow: 'UP ARROW',
	rightArrow: 'RIGHT ARROW',
	downArrow: 'DOWN ARROW',
	insert: 'INSERT',
	'delete': 'DELETE',
	leftWindowKey: 'LEFT WINDOW KEY',
	rightWindowKey: 'RIGHT WINDOW KEY',
	selectKey: 'SELECT KEY',
	numpad0: 'NUMPAD 0',
	numpad1: 'NUMPAD 1',
	numpad2: 'NUMPAD 2',
	numpad3: 'NUMPAD 3',
	numpad4: 'NUMPAD 4',
	numpad5: 'NUMPAD 5',
	numpad6: 'NUMPAD 6',
	numpad7: 'NUMPAD 7',
	numpad8: 'NUMPAD 8',
	numpad9: 'NUMPAD 9',
	multiply: 'MULTIPLY',
	add: 'ADD',
	subtract: 'SUBTRACT',
	decimalPoint: 'DECIMAL POINT',
	divide: 'DIVIDE',
	f1: 'F1',
	f2: 'F2',
	f3: 'F3',
	f4: 'F4',
	f5: 'F5',
	f6: 'F6',
	f7: 'F7',
	f8: 'F8',
	f9: 'F9',
	f10: 'F10',
	f11: 'F11',
	f12: 'F12',
	numLock: 'NUM LOCK',
	scrollLock: 'SCROLL LOCK',
	semiColon: 'SEMI-COLON',
	equalSign: 'EQUAL SIGN',
	comma: 'COMMA',
	dash: 'DASH',
	period: 'PERIOD',
	forwardSlash: 'FORWARD SLASH',
	graveAccent: 'GRAVE ACCENT',
	openBracket: 'OPEN BRACKET',
	backSlash: 'BACK SLASH',
	closeBracket: 'CLOSE BRACKET',
	singleQuote: 'SINGLE QUOTE'
} );
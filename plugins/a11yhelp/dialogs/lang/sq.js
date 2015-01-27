/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'sq', {
	title: 'Udhëzimet e Qasjes',
	contents: 'Përmbajtja ndihmëse. Për ta mbyllur dialogun shtyp ESC.',
	legend: [
		{
		name: 'Të përgjithshme',
		items: [
			{
			name: 'Shiriti i Redaktuesit',
			legend: 'Press ${toolbarFocus} to navigate to the toolbar. Move to the next and previous toolbar group with TAB and SHIFT-TAB. Move to the next and previous toolbar button with RIGHT ARROW or LEFT ARROW. Press SPACE or ENTER to activate the toolbar button.' // MISSING
		},

			{
			name: 'Dialogu i Redaktuesit',
			legend: 'Inside a dialog, press TAB to navigate to next dialog field, press SHIFT + TAB to move to previous field, press ENTER to submit dialog, press ESC to cancel dialog. For dialogs that have multiple tab pages, press ALT + F10 to navigate to tab-list. Then move to next tab with TAB OR RIGTH ARROW. Move to previous tab with SHIFT + TAB or LEFT ARROW. Press SPACE or ENTER to select the tab page.' // MISSING
		},

			{
			name: 'Editor Context Menu', // MISSING
			legend: 'Press ${contextMenu} or APPLICATION KEY to open context-menu. Then move to next menu option with TAB or DOWN ARROW. Move to previous option with SHIFT+TAB or UP ARROW. Press SPACE or ENTER to select the menu option. Open sub-menu of current option with SPACE or ENTER or RIGHT ARROW. Go back to parent menu item with ESC or LEFT ARROW. Close context menu with ESC.' // MISSING
		},

			{
			name: 'Editor List Box', // MISSING
			legend: 'Inside a list-box, move to next list item with TAB OR DOWN ARROW. Move to previous list item with SHIFT + TAB or UP ARROW. Press SPACE or ENTER to select the list option. Press ESC to close the list-box.' // MISSING
		},

			{
			name: 'Editor Element Path Bar', // MISSING
			legend: 'Press ${elementsPathFocus} to navigate to the elements path bar. Move to next element button with TAB or RIGHT ARROW. Move to previous button with  SHIFT+TAB or LEFT ARROW. Press SPACE or ENTER to select the element in editor.' // MISSING
		}
		]
	},
		{
		name: 'Komandat',
		items: [
			{
			name: 'Rikthe komandën',
			legend: 'Shtyp ${undo}'
		},
			{
			name: 'Ribëj komandën',
			legend: 'Shtyp ${redo}'
		},
			{
			name: 'Komanda e trashjes së tekstit',
			legend: 'Shtyp ${bold}'
		},
			{
			name: 'Komanda kursive',
			legend: 'Shtyp ${italic}'
		},
			{
			name: 'Komanda e nënvijëzimit',
			legend: 'Shtyp ${underline}'
		},
			{
			name: 'Komanda e Nyjes',
			legend: 'Shtyp ${link}'
		},
			{
			name: ' Toolbar Collapse command', // MISSING
			legend: 'Shtyp ${toolbarCollapse}'
		},
			{
			name: ' Access previous focus space command', // MISSING
			legend: 'Press ${accessPreviousSpace} to access the closest unreachable focus space before the caret, for example: two adjacent HR elements. Repeat the key combination to reach distant focus spaces.' // MISSING
		},
			{
			name: ' Access next focus space command', // MISSING
			legend: 'Press ${accessNextSpace} to access the closest unreachable focus space after the caret, for example: two adjacent HR elements. Repeat the key combination to reach distant focus spaces.' // MISSING
		},
			{
			name: 'Ndihmë Qasjeje',
			legend: 'Shtyp ${a11yHelp}'
		}
		]
	}
	],
	backspace: 'Prapa',
	tab: 'Fletë',
	enter: 'Enter',
	shift: 'Shift',
	ctrl: 'Ctrl',
	alt: 'Alt',
	pause: 'Pause',
	capslock: 'Caps Lock',
	escape: 'Escape',
	pageUp: 'Page Up',
	pageDown: 'Page Down',
	end: 'End',
	home: 'Home',
	leftArrow: 'Shenja majtas',
	upArrow: 'Shenja sipër',
	rightArrow: 'Shenja djathtas',
	downArrow: 'Shenja poshtë',
	insert: 'Shto',
	'delete': 'Grise',
	leftWindowKey: 'Left Windows key', // MISSING
	rightWindowKey: 'Right Windows key', // MISSING
	selectKey: 'Select key', // MISSING
	numpad0: 'Numpad 0', // MISSING
	numpad1: 'Numpad 1', // MISSING
	numpad2: 'Numpad 2', // MISSING
	numpad3: 'Numpad 3', // MISSING
	numpad4: 'Numpad 4', // MISSING
	numpad5: 'Numpad 5', // MISSING
	numpad6: 'Numpad 6', // MISSING
	numpad7: 'Numpad 7', // MISSING
	numpad8: 'Numpad 8', // MISSING
	numpad9: 'Numpad 9', // MISSING
	multiply: 'Multiply', // MISSING
	add: 'Shto',
	subtract: 'Subtract', // MISSING
	decimalPoint: 'Decimal Point', // MISSING
	divide: 'Divide', // MISSING
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
	numLock: 'Num Lock',
	scrollLock: 'Scroll Lock',
	semiColon: 'Semicolon',
	equalSign: 'Equal Sign', // MISSING
	comma: 'Presje',
	dash: 'vizë',
	period: 'Pikë',
	forwardSlash: 'Forward Slash', // MISSING
	graveAccent: 'Grave Accent', // MISSING
	openBracket: 'Hape kllapën',
	backSlash: 'Backslash', // MISSING
	closeBracket: 'Mbylle kllapën',
	singleQuote: 'Single Quote' // MISSING
} );

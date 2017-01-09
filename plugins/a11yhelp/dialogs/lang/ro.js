/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'ro', {
	title: 'Instrucțiuni de accesibilitate',
	contents: 'Cuprins. Pentru a închide acest dialog, apăsați tasta ESC.',
	legend: [
		{
		name: 'General',
		items: [
			{
			name: 'Editează bara instrumente.',
			legend: 'Apasă ${toolbarFocus} pentru a naviga prin bara de instrumente. Pentru a te mișca prin grupurile de instrumente folosește tastele TAB și SHIFT+TAB. Pentru a te mișca intre diverse instrumente folosește tastele SĂGEATĂ DREAPTA sau SĂGEATĂ STÂNGA. Apasă butonul SPAȚIU sau ENTER pentru activarea instrumentului.'
		},

			{
			name: 'Dialog editor',
			legend:
				'Inside a dialog, press TAB to navigate to the next dialog element, press SHIFT+TAB to move to the previous dialog element, press ENTER to submit the dialog, press ESC to cancel the dialog. When a dialog has multiple tabs, the tab list can be reached either with ALT+F10 or with TAB as part of the dialog tabbing order. With tab list focused, move to the next and previous tab with RIGHT and LEFT ARROW, respectively.'  // MISSING
		},

			{
			name: 'Editor meniu contextual',
			legend: 'Apasă ${contextMenu} sau TASTA MENIU pentru a deschide meniul contextual. Treci la următoarea opțiune din meniu cu TAB sau SĂGEATĂ JOS. Treci la opțiunea anterioară cu  SHIFT+TAB sau SĂGEATĂ SUS. Apasă SPAȚIU sau ENTER pentru a selecta opțiunea din meniu. Deschide sub-meniul opțiunii curente cu SPAȚIU sau ENTER sau SĂGEATĂ DREAPTA. Revino la elementul din meniul părinte cu ESC sau SĂGEATĂ STÂNGA. Închide meniul de context cu ESC.'
		},

			{
			name: 'Editor Casetă Listă',
			legend: 'În interiorul unei liste, treci la următorull element cu TAB sau SĂGEATĂ JOS. Treci la elementul anterior din listă cu SHIFT+TAB sau SĂGEATĂ SUS. Apasă SPAȚIU sau ENTER pentru a selecta opțiunea din listă. Apasă ESC pentru a închide lista.'
		},

			{
			name: 'Editor Element Path Bar', // MISSING
			legend: 'Press ${elementsPathFocus} to navigate to the elements path bar. Move to next element button with TAB or RIGHT ARROW. Move to previous button with SHIFT+TAB or LEFT ARROW. Press SPACE or ENTER to select the element in editor.' // MISSING
		}
		]
	},
		{
		name: 'Comenzi',
		items: [
			{
			name: ' Undo command', // MISSING
			legend: 'Apasă ${undo}'
		},
			{
			name: 'Comanda precedentă',
			legend: 'Apasă ${redo}'
		},
			{
			name: 'Comanda Îngroșat',
			legend: 'Apasă ${bold}'
		},
			{
			name: 'Comanda Inclinat',
			legend: 'Apasă ${italic}'
		},
			{
			name: 'Comanda Subliniere',
			legend: 'Apasă ${underline}'
		},
			{
			name: 'Comanda Legatură',
			legend: 'Apasă ${link}'
		},
			{
			name: ' Toolbar Collapse command', // MISSING
			legend: 'Press ${toolbarCollapse}' // MISSING
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
			name: ' Accessibility Help', // MISSING
			legend: 'Press ${a11yHelp}' // MISSING
		}
		]
	}
	],
	tab: 'Tab', // MISSING
	pause: 'Pause', // MISSING
	capslock: 'Caps Lock', // MISSING
	escape: 'Escape', // MISSING
	pageUp: 'Page Up', // MISSING
	pageDown: 'Page Down', // MISSING
	leftArrow: 'Left Arrow', // MISSING
	upArrow: 'Up Arrow', // MISSING
	rightArrow: 'Right Arrow', // MISSING
	downArrow: 'Down Arrow', // MISSING
	insert: 'Insert', // MISSING
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
	add: 'Add', // MISSING
	subtract: 'Subtract', // MISSING
	decimalPoint: 'Decimal Point', // MISSING
	divide: 'Divide', // MISSING
	f1: 'F1', // MISSING
	f2: 'F2', // MISSING
	f3: 'F3', // MISSING
	f4: 'F4', // MISSING
	f5: 'F5', // MISSING
	f6: 'F6', // MISSING
	f7: 'F7', // MISSING
	f8: 'F8', // MISSING
	f9: 'F9', // MISSING
	f10: 'F10', // MISSING
	f11: 'F11', // MISSING
	f12: 'F12', // MISSING
	numLock: 'Num Lock', // MISSING
	scrollLock: 'Scroll Lock', // MISSING
	semiColon: 'Semicolon', // MISSING
	equalSign: 'Equal Sign', // MISSING
	comma: 'Comma', // MISSING
	dash: 'Dash', // MISSING
	period: 'Period', // MISSING
	forwardSlash: 'Forward Slash', // MISSING
	graveAccent: 'Grave Accent', // MISSING
	openBracket: 'Open Bracket', // MISSING
	backSlash: 'Backslash', // MISSING
	closeBracket: 'Close Bracket', // MISSING
	singleQuote: 'Single Quote' // MISSING
} );

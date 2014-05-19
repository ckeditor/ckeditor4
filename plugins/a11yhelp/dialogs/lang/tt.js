/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'tt', {
	title: 'Accessibility Instructions', // MISSING
	contents: 'Help Contents. To close this dialog press ESC.', // MISSING
	legend: [
		{
		name: 'Гомуми',
		items: [
			{
			name: 'Editor Toolbar', // MISSING
			legend: 'Press ${toolbarFocus} to navigate to the toolbar. Move to the next and previous toolbar group with TAB and SHIFT-TAB. Move to the next and previous toolbar button with RIGHT ARROW or LEFT ARROW. Press SPACE or ENTER to activate the toolbar button.' // MISSING
		},

			{
			name: 'Editor Dialog', // MISSING
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
		name: 'Командалар',
		items: [
			{
			name: 'Кайтару',
			legend: '${undo} басыгыз'
		},
			{
			name: 'Кабатлау',
			legend: '${redo} басыгыз'
		},
			{
			name: 'Калын',
			legend: '${bold} басыгыз'
		},
			{
			name: 'Курсив',
			legend: '${italic} басыгыз'
		},
			{
			name: 'Астына сызылган',
			legend: '${underline} басыгыз'
		},
			{
			name: 'Сылталама',
			legend: '${link} басыгыз'
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
			legend: '${a11yHelp} басыгыз'
		}
		]
	}
	],
	backspace: 'Кайтару',
	tab: 'Tab',
	enter: 'Enter',
	shift: 'Shift',
	ctrl: 'Ctrl',
	alt: 'Alt',
	pause: 'Тыныш',
	capslock: 'Caps Lock',
	escape: 'Escape',
	pageUp: 'Page Up',
	pageDown: 'Page Down',
	end: 'End',
	home: 'Home',
	leftArrow: 'Сул якка ук',
	upArrow: 'Өскә таба ук',
	rightArrow: 'Уң якка ук',
	downArrow: 'Аска таба ук',
	insert: 'Өстәү',
	'delete': 'Бетерү',
	leftWindowKey: 'Сул Windows төймəсе',
	rightWindowKey: 'Уң Windows төймəсе',
	selectKey: 'Select төймəсе',
	numpad0: 'Numpad 0',
	numpad1: 'Numpad 1',
	numpad2: 'Numpad 2',
	numpad3: 'Numpad 3',
	numpad4: 'Numpad 4',
	numpad5: 'Numpad 5',
	numpad6: 'Numpad 6',
	numpad7: 'Numpad 7',
	numpad8: 'Numpad 8',
	numpad9: 'Numpad 9',
	multiply: 'Тапкырлау',
	add: 'Кушу',
	subtract: 'Алу',
	decimalPoint: 'Унарлы нокта',
	divide: 'Бүлү',
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
	semiColon: 'Нокталы өтер',
	equalSign: 'Тигезлек билгесе',
	comma: 'Өтер',
	dash: 'Сызык',
	period: 'Дәрәҗә',
	forwardSlash: 'Кыек сызык',
	graveAccent: 'Гравис',
	openBracket: 'Җәя ачу',
	backSlash: 'Кире кыек сызык',
	closeBracket: 'Җәя ябу',
	singleQuote: 'Бер иңле куштырнаклар'
} );

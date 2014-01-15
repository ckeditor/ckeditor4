/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'ca', {
	title: 'Instruccions d\'Accessibilitat',
	contents: 'Continguts de l\'Ajuda. Per tancar aquest quadre de diàleg premi ESC.',
	legend: [
		{
		name: 'General',
		items: [
			{
			name: 'Editor de barra d\'eines',
			legend: 'Premi ${toolbarFocus} per desplaçar-se per la barra d\'eines. Vagi en el següent i anterior grup de barra d\'eines amb TAB i SHIFT-TAB. Vagi en el següent i anterior botó de la barra d\'eines amb RIGHT ARROW i LEFT ARROW. Premi SPACE o ENTER per activar el botó de la barra d\'eines.'
		},

			{
			name: 'Editor de quadre de diàleg',
			legend: 'Dins d\'un quadre de diàleg, premi la tecla TAB per desplaçar-se al següent camp del quadre de diàleg, premi SHIFT + TAB per desplaçar-se a l\'anterior camp, premi ENTER per acceptar el quadre de diàleg, premi ESC per cancel·lar el quadre de diàleg. Per els quadres de diàleg que tenen diverses pestanyes, premi ALT + F10 per anar a la llista de pestanyes. Després podrà desplaçar-se a la següent pestanya amb TAB o RIGHT ARROW. Anar a la pestanya anterior amb SHIFT + TAB o LEFT ARROW. Premi SPACE o ENTER per seleccionar la pestanya.'
		},

			{
			name: 'Editor de menú contextual',
			legend: 'Premi ${contextMenu} o APPLICATION KEY per obrir el menú contextual. Després desplacis a la següent opció del menú amb TAB o DOWN ARROW. Desplacis a l\'anterior opció amb SHIFT+TAB o UP ARROW. Premi SPACE o ENTER per seleccionar l\'opció del menú. Obri el submenú de l\'actual opció utilitzant SPACE o ENTER o RIGHT ARROW. Pot tornar a l\'opció del menú pare amb ESC o LEFT ARROW. Tanqui el menú contextual amb ESC.'
		},

			{
			name: 'Editor de caixa de llista',
			legend: 'Dins d\'un quadre de llista, desplacis al següent element de la llista amb TAB o DOWN ARROW. Desplacis a l\'anterior element de la llista amb SHIFT + TAB o UP ARROW. Premi SPACE o ENTER per seleccionar l\'opció de la llista. Premi ESC per tancar el quadre de llista.'
		},

			{
			name: 'Editor de barra de ruta de l\'element',
			legend: 'Premi ${elementsPathFocus} per anar als elements de la barra de ruta. Desplacis al botó de l\'element següent amb TAB o RIGHT ARROW. Desplacis a l\'anterior botó amb  SHIFT+TAB o LEFT ARROW. Premi SPACE o ENTER per seleccionar l\'element a l\'editor.'
		}
		]
	},
		{
		name: 'Ordres',
		items: [
			{
			name: 'Desfer ordre',
			legend: 'Premi ${undo}'
		},
			{
			name: 'Refer ordre',
			legend: 'Premi ${redo}'
		},
			{
			name: 'Ordre negreta',
			legend: 'Premi ${bold}'
		},
			{
			name: 'Ordre cursiva',
			legend: 'Premi ${italic}'
		},
			{
			name: 'Ordre subratllat',
			legend: 'Premi ${underline}'
		},
			{
			name: 'Ordre enllaç',
			legend: 'Premi ${link}'
		},
			{
			name: 'Ordre amagar barra d\'eines',
			legend: 'Premi ${toolbarCollapse}'
		},
			{
			name: 'Ordre per accedir a l\'anterior espai enfocat',
			legend: 'Premi ${accessPreviousSpace} per accedir a l\'enfocament d\'espai més proper inabastable abans del símbol d\'intercalació, per exemple: dos elements HR adjacents. Repetiu la combinació de tecles per arribar a enfocaments d\'espais distants.'
		},
			{
			name: 'Ordre per accedir al següent espai enfocat',
			legend: 'Premi ${accessNextSpace} per accedir a l\'enfocament d\'espai més proper inabastable després del símbol d\'intercalació, per exemple: dos elements HR adjacents. Repetiu la combinació de tecles per arribar a enfocaments d\'espais distants.'
		},
			{
			name: 'Ajuda d\'accessibilitat',
			legend: 'Premi ${a11yHelp}'
		}
		]
	}
	],
	backspace: 'BACKSPACE', // MISSING
	tab: 'TAB', // MISSING
	enter: 'ENTER', // MISSING
	shift: 'SHIFT', // MISSING
	ctrl: 'CTRL', // MISSING
	alt: 'ALT', // MISSING
	pause: 'PAUSE', // MISSING
	capslock: 'CAPSLOCK', // MISSING
	escape: 'ESCAPE', // MISSING
	pageUp: 'PAGE UP', // MISSING
	pageDown: 'PAGE DOWN', // MISSING
	end: 'END', // MISSING
	home: 'HOME', // MISSING
	leftArrow: 'LEFT ARROW', // MISSING
	upArrow: 'UP ARROW', // MISSING
	rightArrow: 'RIGHT ARROW', // MISSING
	downArrow: 'DOWN ARROW', // MISSING
	insert: 'INSERT', // MISSING
	'delete': 'DELETE', // MISSING
	leftWindowKey: 'LEFT WINDOW KEY', // MISSING
	rightWindowKey: 'RIGHT WINDOW KEY', // MISSING
	selectKey: 'SELECT KEY', // MISSING
	numpad0: 'NUMPAD 0', // MISSING
	numpad1: 'NUMPAD 1', // MISSING
	numpad2: 'NUMPAD 2', // MISSING
	numpad3: 'NUMPAD 3', // MISSING
	numpad4: 'NUMPAD 4', // MISSING
	numpad5: 'NUMPAD 5', // MISSING
	numpad6: 'NUMPAD 6', // MISSING
	numpad7: 'NUMPAD 7', // MISSING
	numpad8: 'NUMPAD 8', // MISSING
	numpad9: 'NUMPAD 9', // MISSING
	multiply: 'MULTIPLY', // MISSING
	add: 'ADD', // MISSING
	subtract: 'SUBTRACT', // MISSING
	decimalPoint: 'DECIMAL POINT', // MISSING
	divide: 'DIVIDE', // MISSING
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
	numLock: 'NUM LOCK', // MISSING
	scrollLock: 'SCROLL LOCK', // MISSING
	semiColon: 'SEMI-COLON', // MISSING
	equalSign: 'EQUAL SIGN', // MISSING
	comma: 'COMMA', // MISSING
	dash: 'DASH', // MISSING
	period: 'PERIOD', // MISSING
	forwardSlash: 'FORWARD SLASH', // MISSING
	graveAccent: 'GRAVE ACCENT', // MISSING
	openBracket: 'OPEN BRACKET', // MISSING
	backSlash: 'BACK SLASH', // MISSING
	closeBracket: 'CLOSE BRACKET', // MISSING
	singleQuote: 'SINGLE QUOTE' // MISSING
} );

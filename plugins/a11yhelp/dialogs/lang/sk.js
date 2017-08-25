/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'sk', {
	title: 'Inštrukcie prístupnosti',
	contents: 'Pomocný obsah. Pre zatvorenie tohto okna, stlačte ESC.',
	legend: [
		{
		name: 'Všeobecne',
		items: [
			{
			name: 'Lišta nástrojov editora',
			legend: 'Stlačte ${toolbarFocus} pre navigáciu na lištu nástrojov. Medzi ďalšou a predchádzajúcou lištou nástrojov sa pohybujete s TAB a SHIFT+TAB. Medzi ďalším a predchádzajúcim tlačidlom na lište nástrojov sa pohybujete s pravou šípkou a ľavou šípkou. Stlačte medzerník alebo ENTER pre aktiváciu tlačidla lišty nástrojov.'
		},

			{
			name: 'Editorový dialóg',
			legend:
				'V dialógovom okne stlačte TAB pre presun na ďalší prvok, SHIFT+TAB pre presun na predchádzajúci prvok, ENTER pre odoslanie, ESC pre zrušenie. Keď má dialógové okno viacero kariet, zoznam kariet dosiahnete buď stlačením ALT+F10 alebo s TAB v príslušnom poradí kariet. So zameraným zoznamom kariet sa pohybujte k ďalšej alebo predchádzajúcej karte cez PRAVÚ a ĽAVÚ ŠÍPKU.' 
		},

			{
			name: 'Editorové kontextové menu',
			legend: 'Stlačte ${contextMenu} alebo APPLICATION KEY pre otvorenie kontextového menu. Potom sa presúvajte na ďalšie možnosti menu s TAB alebo dolnou šípkou. Presunte sa k predchádzajúcej možnosti s SHIFT+TAB alebo hornou šípkou. Stlačte medzerník alebo ENTER pre výber možnosti menu. Otvorte pod-menu danej možnosti s medzerníkom, alebo ENTER, alebo pravou šípkou. Vráťte sa späť do položky rodičovského menu s ESC alebo ľavou šípkou. Zatvorte kontextové menu s ESC.'
		},

			{
			name: 'Editorov box zoznamu',
			legend: 'V boxe zoznamu, presuňte sa na ďalšiu položku v zozname s TAB alebo dolnou šípkou. Presuňte sa k predchádzajúcej položke v zozname so SHIFT+TAB alebo hornou šípkou. Stlačte medzerník alebo ENTER pre výber možnosti zoznamu. Stlačte ESC pre zatvorenie boxu zoznamu.'
		},

			{
			name: 'Editorove pásmo cesty prvku',
			legend: 'Stlačte ${elementsPathFocus} pre navigovanie na pásmo cesty elementu. Presuňte sa na tlačidlo ďalšieho prvku s TAB alebo pravou šípkou. Presuňte sa k predchádzajúcemu tlačidlu s SHIFT+TAB alebo ľavou šípkou. Stlačte medzerník alebo ENTER pre výber prvku v editore.'
		}
		]
	}
	],
	tab: 'Tab',
	pause: 'Pause',
	capslock: 'Caps Lock',
	escape: 'Escape',
	pageUp: 'Stránka hore',
	pageDown: 'Stránka dole',
	leftArrow: 'Šípka naľavo',
	upArrow: 'Šípka hore',
	rightArrow: 'Šípka napravo',
	downArrow: 'Šípka dole',
	insert: 'Insert',
	leftWindowKey: 'Ľavé Windows tlačidlo',
	rightWindowKey: 'Pravé Windows tlačidlo',
	selectKey: 'Tlačidlo Select',
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
	multiply: 'Násobenie',
	add: 'Sčítanie',
	subtract: 'Odčítanie',
	decimalPoint: 'Desatinná čiarka',
	divide: 'Delenie',
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
	semiColon: 'Bodkočiarka',
	equalSign: 'Rovná sa',
	comma: 'Čiarka',
	dash: 'Pomĺčka',
	period: 'Bodka',
	forwardSlash: 'Lomítko',
	graveAccent: 'Zdôrazňovanie prízvuku',
	openBracket: 'Hranatá zátvorka otváracia',
	backSlash: 'Backslash',
	closeBracket: 'Hranatá zátvorka zatváracia',
	singleQuote: 'Jednoduché úvodzovky',
	commandsList: {
		sectionName: 'Keystrokes table', // MISSING
		command: 'Command', // MISSING
		keystroke: 'Keystroke' // MISSING
	},
	commandsLabel: {
		generalTab:	'Accessibility Help', // MISSING
		keystrokesTab: 'Keystrokes list' // MISSING
	}
} );

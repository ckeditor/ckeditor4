/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
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
			legend: 'Stlačte ${toolbarFocus} pre navigáciu na lištu nástrojov. Medzi ďalšou a predchádzajúcou lištou nástrojov sa pohybujete s TAB a SHIFT-TAB. Medzi ďalším a predchádzajúcim tlačidlom na lište nástrojov sa pohybujete s pravou šípkou a ľavou šípkou. Stlačte medzerník alebo ENTER pre aktiváciu tlačidla lišty nástrojov.'
		},

			{
			name: 'Editorový dialóg',
			legend: 'V dialogu, stlačte TAB pre navigáciu na ďalšie dialógové pole, stlačte STIFT + TAB pre presun na predchádzajúce pole, stlačte ENTER pre odoslanie dialógu, stlačte ESC pre zrušenie dialógu. Pre dialógy, ktoré majú viac záložiek, stlačte ALT + F10 pre navigácou do zoznamu záložiek. Potom sa posúvajte k ďalšej žáložke pomocou TAB alebo pravou šípkou. Pre presun k predchádzajúcej záložke, stlačte SHIFT + TAB alebo ľavú šípku. Stlačte medzerník alebo ENTER pre vybranie záložky.'
		},

			{
			name: 'Editorové kontextové menu',
			legend: 'Stlačte ${contextMenu} alebo APPLICATION KEY pre otvorenie kontextového menu. Potom sa presúvajte na ďalšie možnosti menu s TAB alebo dolnou šípkou. Presunte sa k predchádzajúcej možnosti s SHIFT + TAB alebo hornou šípkou. Stlačte medzerník alebo ENTER pre výber možnosti menu. Otvorte pod-menu danej možnosti s medzerníkom, alebo ENTER, alebo pravou šípkou. Vráťte sa späť do položky rodičovského menu s ESC alebo ľavou šípkou. Zatvorte kontextové menu s ESC.'
		},

			{
			name: 'Editorov box zoznamu',
			legend: 'V boxe zoznamu, presuňte sa na ďalšiu položku v zozname s TAB alebo dolnou šípkou. Presuňte sa k predchádzajúcej položke v zozname so SHIFT + TAB alebo hornou šípkou. Stlačte medzerník alebo ENTER pre výber možnosti zoznamu. Stlačte ESC pre zatvorenie boxu zoznamu.'
		},

			{
			name: 'Editorove pásmo cesty prvku',
			legend: 'Stlačte ${elementsPathFocus} pre navigovanie na pásmo cesty elementu. Presuňte sa na tlačidlo ďalšieho prvku s TAB alebo pravou šípkou. Presuňte sa k predchádzajúcemu tlačidlu s SHIFT + TAB alebo ľavou šípkou. Stlačte medzerník alebo ENTER pre výber prvku v editore.'
		}
		]
	},
		{
		name: 'Príkazy',
		items: [
			{
			name: 'Vrátiť príkazy',
			legend: 'Stlačte ${undo}'
		},
			{
			name: 'Nanovo vrátiť príkaz',
			legend: 'Stlačte ${redo}'
		},
			{
			name: 'Príkaz na stučnenie',
			legend: 'Stlačte ${bold}'
		},
			{
			name: 'Príkaz na kurzívu',
			legend: 'Stlačte ${italic}'
		},
			{
			name: 'Príkaz na podčiarknutie',
			legend: 'Stlačte ${underline}'
		},
			{
			name: 'Príkaz na odkaz',
			legend: 'Stlačte ${link}'
		},
			{
			name: 'Príkaz na zbalenie lišty nástrojov',
			legend: 'Stlačte ${toolbarCollapse}'
		},
			{
			name: 'Prejsť na predchádzajúcu zamerateľnú medzeru príkazu',
			legend: 'Stlačte ${accessPreviousSpace} pre prístup na najbližšie nedosiahnuteľné zamerateľné medzery pred vsuvkuo. Napríklad: dve za sebou idúce horizontálne čiary. Opakujte kombináciu klávesov pre dosiahnutie vzdialených zamerateľných medzier.'
		},
			{
			name: 'Prejsť na ďalší ',
			legend: 'Stlačte ${accessNextSpace} pre prístup na najbližšie nedosiahnuteľné zamerateľné medzery po vsuvke. Napríklad: dve za sebou idúce horizontálne čiary. Opakujte kombináciu klávesov pre dosiahnutie vzdialených zamerateľných medzier.'
		},
			{
			name: 'Pomoc prístupnosti',
			legend: 'Stlačte ${a11yHelp}'
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

/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'hr', {
	title: 'Upute dostupnosti',
	contents: 'Sadržaj pomoći. Za zatvaranje pritisnite ESC.',
	legend: [
		{
		name: 'Općenito',
		items: [
			{
			name: 'Alatna traka',
			legend: 'Pritisni ${toolbarFocus} za navigaciju do alatne trake. Pomicanje do prethodne ili sljedeće alatne grupe vrši se pomoću SHIFT-TAB i TAB. Pomicanje do prethodnog ili sljedećeg gumba u alatnoj traci vrši se pomoću lijeve i desne strelice kursora. Pritisnite SPACE ili ENTER za aktivaciju alatne trake.'
		},

			{
			name: 'Dijalog',
			legend: 'Unutar dijaloga, pritisnite TAB za navigaciju do sljedećeg polja, pritisnite SHIFT + TAB za vraćanje na prethodno polje, pritisnite ENTER za slanje dijaloga ili ESC za zatvaranje dijaloga. Za dijaloge koji imaju višestruke kartice, pritisnite ALT + F10 za na navigaciju i zatim TAB ili lijeva strelica kursora ili SHIFT + TAB i desna strelica kursora. SPACE ili ENTER odabiru karticu.'
		},

			{
			name: 'Kontekstni izbornik',
			legend: 'Pritisnite ${contextMenu} ili APPLICATION tipku za otvaranje kontekstnog izbornika. Pomicanje se vrši TAB ili strelicom kursora prema dolje ili SHIFT+TAB ili strelica kursora prema gore. SPACE ili ENTER odabiru opciju izbornika. Otvorite podizbornik trenutne opcije sa  SPACE, ENTER ili desna strelica kursora. Povratak na prethodni izbornik vrši se sa ESC ili lijevom strelicom kursora. Zatvaranje se vrši pritiskom na tipku ESC.'
		},

			{
			name: 'Lista',
			legend: 'Unutar list-boxa, pomicanje na sljedeću stavku vrši se sa TAB ili strelica kursora prema dolje. Na prethodnu sa SHIFT + TAB ili strelica prema gore. Pritiskom na SPACE ili ENTER odabire se stavka ili ESC za zatvaranje.'
		},

			{
			name: 'Traka putanje elemenata',
			legend: 'Pritisnite ${elementsPathFocus} za navigaciju po putanji elemenata. Pritisnite TAB ili desnu strelicu kursora za pomicanje na sljedeći element ili SHIFT + TAB ili lijeva strelica kursora za pomicanje na prethodni element. Pritiskom na SPACE ili ENTER vrši se odabir elementa.'
		}
		]
	},
		{
		name: 'Naredbe',
		items: [
			{
			name: 'Vrati naredbu',
			legend: 'Pritisni ${undo}'
		},
			{
			name: 'Ponovi naredbu',
			legend: 'Pritisni ${redo}'
		},
			{
			name: 'Bold naredba',
			legend: 'Pritisni ${bold}'
		},
			{
			name: 'Italic naredba',
			legend: 'Pritisni ${italic}'
		},
			{
			name: 'Underline naredba',
			legend: 'Pritisni ${underline}'
		},
			{
			name: 'Link naredba',
			legend: 'Pritisni ${link}'
		},
			{
			name: 'Smanji alatnu traku naredba',
			legend: 'Pritisni ${toolbarCollapse}'
		},
			{
			name: 'Access previous focus space naredba',
			legend: 'Pritisni ${accessPreviousSpace} za pristup najbližem nedostupnom razmaku prije kursora, npr.: dva spojena HR elementa. Ponovnim pritiskom dohvatiti će se sljedeći nedostupni razmak.'
		},
			{
			name: 'Access next focus space naredba',
			legend: 'Pritisni ${accessNextSpace} za pristup najbližem nedostupnom razmaku nakon kursora, npr.: dva spojena HR elementa. Ponovnim pritiskom dohvatiti će se sljedeći nedostupni razmak.'
		},
			{
			name: 'Pomoć za dostupnost',
			legend: 'Pritisni ${a11yHelp}'
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

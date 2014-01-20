/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'nl', {
	title: 'Toegankelijkheidsinstructies',
	contents: 'Help inhoud. Druk op ESC om dit dialoog te sluiten.',
	legend: [
		{
		name: 'Algemeen',
		items: [
			{
			name: 'Werkbalk tekstverwerker',
			legend: 'Druk op ${toolbarFocus} om naar de werkbalk te navigeren. Om te schakelen naar de volgende en vorige werkbalkgroep, gebruik TAB en SHIFT+TAB. Om te schakelen naar de volgende en vorige werkbalkknop, gebruik de PIJL RECHTS en PIJL LINKS. Druk op SPATIE of ENTER om een werkbalkknop te activeren.'
		},

			{
			name: 'Dialoog tekstverwerker',
			legend: 'In een dialoogvenster, druk op TAB om te navigeren naar het volgende veld. Druk op SHIFT+TAB om naar het vorige veld te navigeren. Druk op ENTER om het dialoogvenster te verzenden. Druk op ESC om het dialoogvenster te sluiten. Voor dialoogvensters met meerdere tabbladen, druk op ALT+F10 om naar de tabset te navigeren. Schakel naar het volgende tabblad met TAB of PIJL RECHTS. Schakel naar het vorige tabblad met SHIFT+TAB of PIJL LINKS. Druk op SPATIE of ENTER om het tabblad te selecteren.'
		},

			{
			name: 'Contextmenu tekstverwerker',
			legend: 'Druk op ${contextMenu} of APPLICATION KEY om het contextmenu te openen. Schakel naar de volgende menuoptie met TAB of PIJL OMLAAG. Schakel naar de vorige menuoptie met SHIFT+TAB of PIJL OMHOOG. Druk op SPATIE of ENTER om een menuoptie te selecteren. Op een submenu van de huidige optie met SPATIE, ENTER of PIJL RECHTS. Ga terug naar de bovenliggende menuoptie met ESC of PIJL LINKS. Sluit het contextmenu met ESC.'
		},

			{
			name: 'Keuzelijst tekstverwerker',
			legend: 'In een keuzelijst, schakel naar het volgende item met TAB of PIJL OMLAAG. Schakel naar het vorige item met SHIFT+TAB of PIJL OMHOOG. Druk op SPATIE of ENTER om het item te selecteren. Druk op ESC om de keuzelijst te sluiten.'
		},

			{
			name: 'Elementenpad werkbalk tekstverwerker',
			legend: 'Druk op ${elementsPathFocus} om naar het elementenpad te navigeren. Om te schakelen naar het volgende element, gebruik TAB of PIJL RECHTS. Om te schakelen naar het vorige element, gebruik SHIFT+TAB or PIJL LINKS. Druk op SPATIE of ENTER om een element te selecteren in de tekstverwerker.'
		}
		]
	},
		{
		name: 'Opdrachten',
		items: [
			{
			name: 'Ongedaan maken opdracht',
			legend: 'Druk op ${undo}'
		},
			{
			name: 'Opnieuw uitvoeren opdracht',
			legend: 'Druk op ${redo}'
		},
			{
			name: 'Vetgedrukt opdracht',
			legend: 'Druk op ${bold}'
		},
			{
			name: 'Cursief opdracht',
			legend: 'Druk op ${italic}'
		},
			{
			name: 'Onderstrepen opdracht',
			legend: 'Druk op ${underline}'
		},
			{
			name: 'Link opdracht',
			legend: 'Druk op ${link}'
		},
			{
			name: 'Werkbalk inklappen opdracht',
			legend: 'Druk op ${toolbarCollapse}'
		},
			{
			name: 'Ga naar vorige focus spatie commando',
			legend: 'Druk ${accessPreviousSpace} om toegang te verkrijgen tot de dichtstbijzijnde onbereikbare focus spatie voor de caret, bijvoorbeeld: twee aangrenzende HR elementen. Herhaal de toetscombinatie om de verste focus spatie te bereiken.'
		},
			{
			name: 'Ga naar volgende focus spatie commando',
			legend: 'Druk ${accessNextSpace} om toegang te verkrijgen tot de dichtstbijzijnde onbereikbare focus spatie na de caret, bijvoorbeeld: twee aangrenzende HR elementen. Herhaal de toetscombinatie om de verste focus spatie te bereiken.'
		},
			{
			name: 'Toegankelijkheidshulp',
			legend: 'Druk op ${a11yHelp}'
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

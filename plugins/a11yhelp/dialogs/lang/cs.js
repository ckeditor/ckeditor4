/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'cs', {
	title: 'Instrukce pro přístupnost',
	contents: 'Obsah nápovědy. Pro uzavření tohoto dialogu stiskněte klávesu ESC.',
	legend: [
		{
		name: 'Obecné',
		items: [
			{
			name: 'Panel nástrojů editoru',
			legend: 'Stiskněte${toolbarFocus} k procházení panelu nástrojů. Přejděte na další a předchozí skupiny pomocí TAB a SHIFT-TAB. Přechod na další a předchozí tlačítko panelu nástrojů je pomocí ŠIPKA VPRAVO nebo ŠIPKA VLEVO. Stisknutím mezerníku nebo klávesy ENTER tlačítko aktivujete.'
		},

			{
			name: 'Dialogové okno editoru',
			legend: 'Uvnitř dialogového okna stiskněte TAB pro přesunutí na další pole, stiskněte SHIFT + TAB pro přesun na předchozí pole, stiskněte ENTER pro odeslání dialogu, stiskněte ESC pro jeho zrušení. Pro dialogová okna, která mají mnoho karet stiskněte ALT + F10 pr oprocházení seznamu karet. Pak se přesuňte na další kartu pomocí TAB nebo ŠIPKA VPRAVO. Pro přesun na předchozí stiskněte SHIFT + TAB nebo ŠIPKA VLEVO. Stiskněte MEZERNÍK nebo ENTER pro vybrání stránky karet.'
		},

			{
			name: 'Kontextové menu editoru',
			legend: 'Stiskněte ${contextMenu} nebo klávesu APPLICATION k otevření kontextového menu. Pak se přesuňte na další možnost menu pomocí TAB nebo ŠIPKY DOLŮ. Přesuňte se na předchozí možnost pomocí  SHIFT+TAB nebo ŠIPKY NAHORU. Stiskněte MEZERNÍK nebo ENTER pro zvolení možnosti menu. Podmenu současné možnosti otevřete pomocí MEZERNÍKU nebo ENTER či ŠIPKY DOLEVA. Kontextové menu uzavřete stiskem ESC.'
		},

			{
			name: 'Rámeček seznamu editoru',
			legend: 'Uvnitř rámečku seznamu se přesunete na další položku menu pomocí TAB nebo ŠIPKA DOLŮ. Na předchozí položku se přesunete SHIFT + TAB nebo ŠIPKA NAHORU. Stiskněte MEZERNÍK nebo ENTER pro zvolení možnosti seznamu. Stiskněte ESC pro uzavření seznamu.'
		},

			{
			name: 'Lišta cesty prvku v editoru',
			legend: 'Stiskněte ${elementsPathFocus} pro procházení lišty cesty prvku. Na další tlačítko prvku se přesunete pomocí TAB nebo ŠIPKA VPRAVO. Na předchozí položku se přesunete pomocí SHIFT + TAB nebo ŠIPKA VLEVO. Stiskněte MEZERNÍK nebo ENTER pro vybrání prvku v editoru.'
		}
		]
	},
		{
		name: 'Příkazy',
		items: [
			{
			name: ' Příkaz Zpět',
			legend: 'Stiskněte ${undo}'
		},
			{
			name: ' Příkaz Znovu',
			legend: 'Stiskněte ${redo}'
		},
			{
			name: ' Příkaz Tučné',
			legend: 'Stiskněte ${bold}'
		},
			{
			name: ' Příkaz Kurzíva',
			legend: 'Stiskněte ${italic}'
		},
			{
			name: ' Příkaz Podtržení',
			legend: 'Stiskněte ${underline}'
		},
			{
			name: ' Příkaz Odkaz',
			legend: 'Stiskněte ${link}'
		},
			{
			name: ' Příkaz Skrýt panel nástrojů',
			legend: 'Stiskněte ${toolbarCollapse}'
		},
			{
			name: 'Příkaz pro přístup k předchozímu prostoru zaměření',
			legend: 'Stiskněte ${accessPreviousSpace} pro přístup k nejbližšímu nedosažitelnému prostoru zaměření před stříškou, například: dva přilehlé prvky HR. Pro dosažení vzdálených prostorů zaměření tuto kombinaci kláves opakujte.'
		},
			{
			name: 'Příkaz pro přístup k dalšímu prostoru zaměření',
			legend: 'Stiskněte ${accessNextSpace} pro přístup k nejbližšímu nedosažitelnému prostoru zaměření po stříšce, například: dva přilehlé prvky HR. Pro dosažení vzdálených prostorů zaměření tuto kombinaci kláves opakujte.'
		},
			{
			name: ' Nápověda přístupnosti',
			legend: 'Stiskněte ${a11yHelp}'
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

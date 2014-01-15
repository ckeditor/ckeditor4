/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'sl', {
	title: 'Navodila Dostopnosti',
	contents: 'Vsebina Pomoči. Če želite zapreti to pogovorno okno pritisnite ESC.',
	legend: [
		{
		name: 'Splošno',
		items: [
			{
			name: 'Urejevalna Orodna Vrstica',
			legend: 'Pritisnite ${toolbarFocus} za pomik v orodno vrstico. Z TAB in SHIFT-TAB se pomikate na naslednjo in prejšnjo skupino orodne vrstice. Z DESNO PUŠČICO ali LEVO PUŠČICO se pomikate na naslednji in prejšnji gumb orodne vrstice. Pritisnite SPACE ali ENTER, da aktivirate gumb orodne vrstice.'
		},

			{
			name: 'Urejevalno Pogovorno Okno',
			legend: 'Znotraj pogovornega okna, pritisnite tipko TAB za pomik na naslednjo pogovorno polje, pritisnite SHIFT + TAB za pomik v prejšnje polje, pritisnite tipko ENTER za predložitev pogovornega okna, pritisnite tipko ESC, da prekličete okno. Za okna, ki imajo več zavihkov, pritisnite ALT + F10, da pojdete na seznam zavihkov. Na naslednji zavihek se premaknete s tipko TAB ali DESNO PUŠČICO. Z SHIFT + TAB ali LEVO PUŠČICO pa se premaknete na prejšnji zavihek. Pritisnite tipko SPACE ali ENTER za izbiro zavihka.'
		},

			{
			name: 'Urejevalni Kontekstni Meni',
			legend: 'Pritisnite ${contextMenu} ali APPLICATION KEY, da odprete kontekstni meni. Nato se premaknite na naslednjo možnost menija s tipko TAB ali PUŠČICA DOL. Premakniti se na prejšnjo možnost z SHIFT + TAB ali PUŠČICA GOR. Pritisnite SPACE ali ENTER za izbiro možnosti menija. Odprite podmeni trenutne možnosti menija s tipko SPACE ali ENTER ali DESNA PUŠČICA. Vrnite se na matični element menija s tipko ESC ali LEVA PUŠČICA. Zaprite kontekstni meni z ESC.'
		},

			{
			name: 'Urejevalno Seznamsko Polje',
			legend: 'Znotraj seznama, se premaknete na naslednji element seznama s tipko TAB ali PUŠČICO DOL. Z SHIFT + TAB ali PUŠČICO GOR se premaknete na prejšnji element seznama. Pritisnite tipko SPACE ali ENTER za izbiro elementa. Pritisnite tipko ESC, da zaprete seznam.'
		},

			{
			name: 'Urejevalna vrstica poti elementa',
			legend: 'Pritisnite ${elementsPathFocus} za pomikanje po vrstici elementnih poti. S TAB ali DESNA PUŠČICA se premaknete na naslednji gumb elementa. Z SHIFT + TAB ali LEVO PUŠČICO se premaknete na prejšnji gumb elementa. Pritisnite SPACE ali ENTER za izbiro elementa v urejevalniku.'
		}
		]
	},
		{
		name: 'Ukazi',
		items: [
			{
			name: 'Razveljavi ukaz',
			legend: 'Pritisnite ${undo}'
		},
			{
			name: 'Ponovi ukaz',
			legend: 'Pritisnite ${redo}'
		},
			{
			name: 'Krepki ukaz',
			legend: 'Pritisnite ${bold}'
		},
			{
			name: 'Ležeči ukaz',
			legend: 'Pritisnite ${italic}'
		},
			{
			name: 'Poudarni ukaz',
			legend: 'Pritisnite ${underline}'
		},
			{
			name: 'Ukaz povezave',
			legend: 'Pritisnite ${link}'
		},
			{
			name: 'Skrči Orodno Vrstico Ukaz',
			legend: 'Pritisnite ${toolbarCollapse}'
		},
			{
			name: 'Dostop do prejšnjega ukaza ostrenja',
			legend: 'Pritisnite ${accessPreviousSpace} za dostop do najbližjega nedosegljivega osredotočenega prostora pred strešico, npr.: dva sosednja HR elementa. Ponovite kombinacijo tipk, da dosežete oddaljene osredotočene prostore.'
		},
			{
			name: 'Dostop do naslednjega ukaza ostrenja',
			legend: 'Pritisnite ${accessNextSpace} za dostop do najbližjega nedosegljivega osredotočenega prostora po strešici, npr.: dva sosednja HR elementa. Ponovite kombinacijo tipk, da dosežete oddaljene osredotočene prostore.'
		},
			{
			name: 'Pomoč Dostopnosti',
			legend: 'Pritisnite ${a11yHelp}'
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

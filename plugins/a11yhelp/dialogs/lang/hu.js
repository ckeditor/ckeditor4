/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'hu', {
	title: 'Kisegítő utasítások',
	contents: 'Súgó tartalmak. A párbeszédablak bezárásához nyomjon ESC-et.',
	legend: [
		{
		name: 'Általános',
		items: [
			{
			name: 'Szerkesztő Eszköztár',
			legend: 'Nyomjon ${toolbarFocus} hogy kijelölje az eszköztárat. A következő és előző eszköztár csoporthoz a TAB és SHIFT TAB-al juthat el. A következő és előző eszköztár gombhoz a BAL NYÍL vagy JOBB NYÍL gombbal juthat el. Nyomjon SPACE-t vagy ENTER-t hogy aktiválja az eszköztár gombot.'
		},

			{
			name: 'Szerkesző párbeszéd ablak',
			legend: 'Párbeszédablakban nyomjon TAB-ot a következő párbeszédmezőhöz ugráshoz, nyomjon SHIFT + TAB-ot az előző mezőhöz ugráshoz, nyomjon ENTER-t a párbeszédablak elfogadásához, nyomjon ESC-et a párbeszédablak elvetéséhez. Azokhoz a párbeszédablakokhoz, amik több fület tartalmaznak, nyomjon ALT + F10-et hogy a fülekre ugorjon. Ezután a TAB-al vagy a JOBB NYÍLLAL a következő fülre ugorhat. Az előző fülre ugráshoz használja a SHIFT + TAB-ot vagy a BAL NYILAT. Nyomjon SPACE-t vagy ENTER-t hogy kijelölje a fület.'
		},

			{
			name: 'Szerkesztő helyi menü',
			legend: 'Nyomjon ${contextMenu}-t vagy ALKALMAZÁS BILLENTYŰT a helyi menü megnyitásához. Ezután a következő menüpontra léphet a TAB vagy LEFELÉ NYÍLLAL. Az előző opciót a SHIFT+TAB vagy FELFELÉ NYÍLLAL érheti el. Nyomjon SPACE-t vagy ENTER-t a menüpont kiválasztásához. A jelenlegi menüpont almenüjének megnyitásához nyomjon SPACE-t vagy ENTER-t, vagy JOBB NYILAT. A főmenühöz való visszatéréshez nyomjon ESC-et vagy BAL NYILAT. A helyi menü bezárása az ESC billentyűvel lehetséges.'
		},

			{
			name: 'Szerkesztő lista',
			legend: 'A listán belül a következő elemre a TAB vagy LEFELÉ NYÍLLAL mozoghat. Az előző elem kiválasztásához nyomjon SHIFT+TAB-ot vagy FELFELÉ NYILAT. Nyomjon SPACE-t vagy ENTER-t az elem kiválasztásához. Az ESC billentyű megnyomásával bezárhatja a listát.'
		},

			{
			name: 'Szerkesztő elem utak sáv',
			legend: 'Nyomj ${elementsPathFocus} hogy kijelöld a elemek út sávját. A következő elem gombhoz a TAB-al vagy a JOBB NYÍLLAL juthatsz el. Az előző gombhoz a SHIFT+TAB vagy BAL NYÍLLAL mehetsz. A SPACE vagy ENTER billentyűvel kiválaszthatod az elemet a szerkesztőben.'
		}
		]
	},
		{
		name: 'Parancsok',
		items: [
			{
			name: 'Parancs visszavonása',
			legend: 'Nyomj ${undo}'
		},
			{
			name: 'Parancs megismétlése',
			legend: 'Nyomjon ${redo}'
		},
			{
			name: 'Félkövér parancs',
			legend: 'Nyomjon ${bold}'
		},
			{
			name: 'Dőlt parancs',
			legend: 'Nyomjon ${italic}'
		},
			{
			name: 'Aláhúzott parancs',
			legend: 'Nyomjon ${underline}'
		},
			{
			name: 'Link parancs',
			legend: 'Nyomjon ${link}'
		},
			{
			name: 'Szerkesztősáv összecsukása parancs',
			legend: 'Nyomjon ${toolbarCollapse}'
		},
			{
			name: 'Hozzáférés az előző fókusz helyhez parancs',
			legend: 'Nyomj ${accessNextSpace} hogy hozzáférj a legközelebbi elérhetetlen fókusz helyhez a hiányjel előtt, például: két szomszédos HR elemhez. Ismételd meg a billentyűkombinációt hogy megtaláld a távolabbi fókusz helyeket.'
		},
			{
			name: 'Hozzáférés a következő fókusz helyhez parancs',
			legend: 'Nyomj ${accessNextSpace} hogy hozzáférj a legközelebbi elérhetetlen fókusz helyhez a hiányjel után, például: két szomszédos HR elemhez. Ismételd meg a billentyűkombinációt hogy megtaláld a távolabbi fókusz helyeket.'
		},
			{
			name: 'Kisegítő súgó',
			legend: 'Nyomjon ${a11yHelp}'
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

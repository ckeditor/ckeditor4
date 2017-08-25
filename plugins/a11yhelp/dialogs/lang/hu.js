/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
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
			legend: 'Nyomjon ${toolbarFocus} hogy kijelölje az eszköztárat. A következő és előző eszköztár csoporthoz a TAB és SHIFT+TAB-al juthat el. A következő és előző eszköztár gombhoz a BAL NYÍL vagy JOBB NYÍL gombbal juthat el. Nyomjon SPACE-t vagy ENTER-t hogy aktiválja az eszköztár gombot.'
		},

			{
			name: 'Szerkesző párbeszéd ablak',
			legend:
				'Párbeszédablakban nyomjon TAB-ot a következő párbeszédmezőhöz ugráshoz, nyomjon SHIFT + TAB-ot az előző mezőhöz ugráshoz, nyomjon ENTER-t a párbeszédablak elfogadásához, nyomjon ESC-et a párbeszédablak elvetéséhez. Azokhoz a párbeszédablakokhoz, amik több fület tartalmaznak, nyomjon ALT + F10-et vagy TAB-ot hogy a fülekre ugorjon. Ezután a TAB-al vagy a JOBB NYÍLLAL a következő fülre ugorhat.' 
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
	}
	],
	tab: 'Tab',
	pause: 'Pause',
	capslock: 'Caps Lock',
	escape: 'Escape',
	pageUp: 'Page Up',
	pageDown: 'Page Down',
	leftArrow: 'balra nyíl',
	upArrow: 'felfelé nyíl',
	rightArrow: 'jobbra nyíl',
	downArrow: 'lefelé nyíl',
	insert: 'Insert',
	leftWindowKey: 'bal Windows-billentyű',
	rightWindowKey: 'jobb Windows-billentyű',
	selectKey: 'Billentyű választása',
	numpad0: 'Számbillentyűk 0',
	numpad1: 'Számbillentyűk 1',
	numpad2: 'Számbillentyűk 2',
	numpad3: 'Számbillentyűk 3',
	numpad4: 'Számbillentyűk 4',
	numpad5: 'Számbillentyűk 5',
	numpad6: 'Számbillentyűk 6',
	numpad7: 'Számbillentyűk 7',
	numpad8: 'Számbillentyűk 8',
	numpad9: 'Számbillentyűk 9',
	multiply: 'Szorzás',
	add: 'Hozzáadás',
	subtract: 'Kivonás',
	decimalPoint: 'Tizedespont',
	divide: 'Osztás',
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
	semiColon: 'Pontosvessző',
	equalSign: 'Egyenlőségjel',
	comma: 'Vessző',
	dash: 'Kötőjel',
	period: 'Pont',
	forwardSlash: 'Perjel',
	graveAccent: 'Visszafelé dőlő ékezet',
	openBracket: 'Nyitó szögletes zárójel',
	backSlash: 'fordított perjel',
	closeBracket: 'Záró szögletes zárójel',
	singleQuote: 'szimpla idézőjel',
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

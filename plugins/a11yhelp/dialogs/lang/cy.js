/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'cy', {
	title: 'Canllawiau Hygyrchedd',
	contents: 'Cynnwys Cymorth. I gau y deialog hwn, pwyswch ESC.',
	legend: [
		{
		name: 'Cyffredinol',
		items: [
			{
			name: 'Bar Offer y Golygydd',
			legend: 'Pwyswch $ {toolbarFocus} i fynd at y bar offer. Symudwch i\'r grŵp bar offer nesaf a blaenorol gyda TAB a SHIFT+TAB. Symudwch i\'r botwm bar offer nesaf a blaenorol gyda SAETH DDE neu SAETH CHWITH. Pwyswch SPACE neu ENTER i wneud botwm y bar offer yn weithredol.'
		},

			{
			name: 'Deialog y Golygydd',
			legend:
				'Inside a dialog, press TAB to navigate to the next dialog element, press SHIFT+TAB to move to the previous dialog element, press ENTER to submit the dialog, press ESC to cancel the dialog. When a dialog has multiple tabs, the tab list can be reached either with ALT+F10 or with TAB as part of the dialog tabbing order. With tab list focused, move to the next and previous tab with RIGHT and LEFT ARROW, respectively.'  // MISSING
		},

			{
			name: 'Dewislen Cyd-destun y Golygydd',
			legend: 'Pwyswch $ {contextMenu} neu\'r ALLWEDD \'APPLICATION\' i agor y ddewislen cyd-destun. Yna symudwch i\'r opsiwn ddewislen nesaf gyda\'r TAB neu\'r SAETH I LAWR. Symudwch i\'r opsiwn blaenorol gyda SHIFT+TAB neu\'r SAETH I FYNY. Pwyswch SPACE neu ENTER i ddewis yr opsiwn ddewislen. Agorwch is-dewislen yr opsiwn cyfredol gyda SPACE neu ENTER neu SAETH DDE. Ewch yn ôl i\'r eitem ar y ddewislen uwch gydag ESC neu SAETH CHWITH. Ceuwch y ddewislen cyd-destun gydag ESC.'
		},

			{
			name: 'Blwch Rhestr y Golygydd',
			legend: 'Tu mewn y blwch rhestr, ewch i\'r eitem rhestr nesaf gyda TAB neu\'r SAETH I LAWR. Symudwch i restr eitem flaenorol gyda SHIFT+TAB neu SAETH I FYNY. Pwyswch SPACE neu ENTER i ddewis yr opsiwn o\'r rhestr. Pwyswch ESC i gau\'r rhestr.'
		},

			{
			name: 'Bar Llwybr Elfen y Golygydd',
			legend: 'Pwyswch ${elementsPathFocus} i fynd i\'r bar llwybr elfennau. Symudwch i fotwm yr elfen nesaf gyda TAB neu SAETH DDE. Symudwch i fotwm blaenorol gyda SHIFT+TAB neu SAETH CHWITH. Pwyswch SPACE neu ENTER i ddewis yr elfen yn y golygydd.'
		}
		]
	},
		{
		name: 'Gorchmynion',
		items: [
			{
			name: 'Gorchymyn dadwneud',
			legend: 'Pwyswch ${undo}'
		},
			{
			name: 'Gorchymyn ailadrodd',
			legend: 'Pwyswch ${redo}'
		},
			{
			name: 'Gorchymyn Bras',
			legend: 'Pwyswch ${bold}'
		},
			{
			name: 'Gorchymyn italig',
			legend: 'Pwyswch ${italig}'
		},
			{
			name: 'Gorchymyn tanlinellu',
			legend: 'Pwyso ${underline}'
		},
			{
			name: 'Gorchymyn dolen',
			legend: 'Pwyswch ${link}'
		},
			{
			name: 'Gorchymyn Cwympo\'r Dewislen',
			legend: 'Pwyswch ${toolbarCollapse}'
		},
			{
			name: 'Myned i orchymyn bwlch ffocws blaenorol',
			legend: 'Pwyswch ${accessPreviousSpace} i fyned i\'r "blwch ffocws sydd methu ei gyrraedd" cyn y caret, er enghraifft: dwy elfen HR drws nesaf i\'w gilydd. AIladroddwch y cyfuniad allwedd i gyrraedd bylchau ffocws pell.'
		},
			{
			name: 'Ewch i\'r gorchymyn blwch ffocws nesaf',
			legend: 'Pwyswch ${accessNextSpace} i fyned i\'r blwch ffocws agosaf nad oes modd ei gyrraedd ar ôl y caret, er enghraifft: dwy elfen HR drws nesaf i\'w gilydd. Ailadroddwch y cyfuniad allwedd i gyrraedd blychau ffocws pell.'
		},
			{
			name: 'Cymorth Hygyrchedd',
			legend: 'Pwyswch ${a11yHelp}'
		},
			{
			name: ' Paste as plain text', // MISSING
			legend: 'Press ${pastetext}', // MISSING
			legendEdge: 'Press ${pastetext}, followed by ${paste}' // MISSING
		}
		]
	}
	],
	tab: 'Tab',
	pause: 'Pause', // MISSING
	capslock: 'Caps Lock', // MISSING
	escape: 'Escape',
	pageUp: 'Page Up', // MISSING
	pageDown: 'Page Down', // MISSING
	leftArrow: 'Left Arrow', // MISSING
	upArrow: 'Up Arrow', // MISSING
	rightArrow: 'Right Arrow', // MISSING
	downArrow: 'Down Arrow', // MISSING
	insert: 'Insert', // MISSING
	leftWindowKey: 'Left Windows key', // MISSING
	rightWindowKey: 'Right Windows key', // MISSING
	selectKey: 'Select key', // MISSING
	numpad0: 'Numpad 0', // MISSING
	numpad1: 'Numpad 1', // MISSING
	numpad2: 'Numpad 2', // MISSING
	numpad3: 'Numpad 3', // MISSING
	numpad4: 'Numpad 4', // MISSING
	numpad5: 'Numpad 5', // MISSING
	numpad6: 'Numpad 6', // MISSING
	numpad7: 'Numpad 7', // MISSING
	numpad8: 'Numpad 8', // MISSING
	numpad9: 'Numpad 9', // MISSING
	multiply: 'Multiply', // MISSING
	add: 'Add', // MISSING
	subtract: 'Subtract', // MISSING
	decimalPoint: 'Decimal Point', // MISSING
	divide: 'Divide', // MISSING
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
	numLock: 'Num Lock', // MISSING
	scrollLock: 'Scroll Lock', // MISSING
	semiColon: 'Semicolon', // MISSING
	equalSign: 'Equal Sign', // MISSING
	comma: 'Comma', // MISSING
	dash: 'Dash', // MISSING
	period: 'Period', // MISSING
	forwardSlash: 'Forward Slash', // MISSING
	graveAccent: 'Grave Accent', // MISSING
	openBracket: 'Open Bracket', // MISSING
	backSlash: 'Backslash', // MISSING
	closeBracket: 'Close Bracket', // MISSING
	singleQuote: 'Single Quote' // MISSING
} );

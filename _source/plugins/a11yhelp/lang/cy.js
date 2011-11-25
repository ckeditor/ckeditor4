/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.setLang( 'a11yhelp', 'cy', {
	accessibilityHelp: {
		title: 'Canllawiau Hygyrchedd',
		contents: 'Cynnwys Cymorth. I gau y deialog hwn, pwyswch ESC.',
		legend: [
			{
			name: 'Cyffredinol',
			items: [
				{
				name: 'Bar Offer y Golygydd',
				legend: 'Pwyswch $ {toolbarFocus} i fynd at y bar offer. Symudwch i\'r grŵp bar offer nesaf a blaenorol gyda TAB a SHIFT-TAB. Symudwch i\'r botwm bar offer nesaf a blaenorol gyda SAETH DDE neu SAETH CHWITH. Pwyswch SPACE neu ENTER i wneud botwm y bar offer yn weithredol.'
			},

				{
				name: 'Deialog y Golygydd',
				legend: 'Tu mewn i\'r deialog, pwyswch TAB i fynd i\'r maes nesaf ar y deialog, pwyswch SHIFT + TAB i symud i faes blaenorol, pwyswch ENTER i gyflwyno\'r deialog, pwyswch ESC i ddiddymu\'r deialog. Ar gyfer deialogau sydd â thudalennau aml-tab, pwyswch ALT + F10 i lywio\'r tab-restr. Yna symudwch i\'r tab nesaf gyda TAB neu SAETH DDE. Symudwch i dab blaenorol gyda SHIFT + TAB neu\'r SAETH CHWITH. Pwyswch SPACE neu ENTER i ddewis y dudalen tab.'
			},

				{
				name: 'Dewislen Cyd-destun y Golygydd',
				legend: 'Press ${contextMenu} or APPLICATION KEY to open context-menu. Then move to next menu option with TAB or DOWN ARROW. Move to previous option with  SHIFT+TAB or UP ARROW. Press SPACE or ENTER to select the menu option. Open sub-menu of current option wtih SPACE or ENTER or RIGHT ARROW. Go back to parent menu item with ESC or LEFT ARROW. Close context menu with ESC.' // MISSING
			},

				{
				name: 'Blwch Rhestr y Golygydd',
				legend: 'Inside a list-box, move to next list item with TAB OR DOWN ARROW. Move to previous list item with SHIFT + TAB or UP ARROW. Press SPACE or ENTER to select the list option. Press ESC to close the list-box.' // MISSING
			},

				{
				name: 'Bar Llwybr Elfen y Golygydd',
				legend: 'Press ${elementsPathFocus} to navigate to the elements path bar. Move to next element button with TAB or RIGHT ARROW. Move to previous button with  SHIFT+TAB or LEFT ARROW. Press SPACE or ENTER to select the element in editor.' // MISSING
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
				name: 'Cymorth Hygyrchedd',
				legend: 'Pwyswch ${a11yHelp}'
			}
			]
		}
		]
	}
});

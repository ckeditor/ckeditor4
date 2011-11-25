/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.setLang( 'a11yhelp', 'fi', {
	accessibilityHelp: {
		title: 'Saavutettavuus ohjeet',
		contents: 'Ohjeen sisällöt. Sulkeaksesi tämän dialogin paina ESC.',
		legend: [
			{
			name: 'Yleinen',
			items: [
				{
				name: 'Editorin työkalupalkki',
				legend: 'Press ${toolbarFocus} to navigate to the toolbar. Move to the next and previous toolbar group with TAB and SHIFT-TAB. Move to the next and previous toolbar button with RIGHT ARROW or LEFT ARROW. Press SPACE or ENTER to activate the toolbar button.' // MISSING
			},

				{
				name: 'Editorin dialogi',
				legend: 'Inside a dialog, press TAB to navigate to next dialog field, press SHIFT + TAB to move to previous field, press ENTER to submit dialog, press ESC to cancel dialog. For dialogs that have multiple tab pages, press ALT + F10 to navigate to tab-list. Then move to next tab with TAB OR RIGTH ARROW. Move to previous tab with SHIFT + TAB or LEFT ARROW. Press SPACE or ENTER to select the tab page.' // MISSING
			},

				{
				name: 'Editorin oheisvalikko',
				legend: 'Press ${contextMenu} or APPLICATION KEY to open context-menu. Then move to next menu option with TAB or DOWN ARROW. Move to previous option with  SHIFT+TAB or UP ARROW. Press SPACE or ENTER to select the menu option. Open sub-menu of current option wtih SPACE or ENTER or RIGHT ARROW. Go back to parent menu item with ESC or LEFT ARROW. Close context menu with ESC.' // MISSING
			},

				{
				name: 'Editorin lista laatikko',
				legend: 'Inside a list-box, move to next list item with TAB OR DOWN ARROW. Move to previous list item with SHIFT + TAB or UP ARROW. Press SPACE or ENTER to select the list option. Press ESC to close the list-box.' // MISSING
			},

				{
				name: 'Editorin elementtipolun palkki',
				legend: 'Press ${elementsPathFocus} to navigate to the elements path bar. Move to next element button with TAB or RIGHT ARROW. Move to previous button with  SHIFT+TAB or LEFT ARROW. Press SPACE or ENTER to select the element in editor.' // MISSING
			}
			]
		},
			{
			name: 'Komennot',
			items: [
				{
				name: 'Peruuta komento',
				legend: 'Paina ${undo}'
			},
				{
				name: 'Tee uudelleen komento',
				legend: 'Paina ${redo}'
			},
				{
				name: 'Lihavoi komento',
				legend: 'Paina ${bold}'
			},
				{
				name: 'Kursivoi komento',
				legend: 'Paina ${italic}'
			},
				{
				name: 'Alleviivaa komento',
				legend: 'Paina ${underline}'
			},
				{
				name: 'Linkki komento',
				legend: 'Paina ${link}'
			},
				{
				name: 'Pienennä työkalupalkki komento',
				legend: 'Paina ${toolbarCollapse}'
			},
				{
				name: 'Saavutettavuus ohjeet',
				legend: 'Paina ${a11yHelp}'
			}
			]
		}
		]
	}
});

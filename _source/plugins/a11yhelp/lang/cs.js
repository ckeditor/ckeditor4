/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.setLang( 'a11yhelp', 'cs', {
	accessibilityHelp: {
		title: 'Accessibility Instructions', // MISSING
		contents: 'Obsah nápovědy. Pro uzavření tohoto dialogu stiskněte klávesu ESC.',
		legend: [
			{
			name: 'Obecné',
			items: [
				{
				name: 'Panel nástrojů editoru',
				legend: 'Press ${toolbarFocus} to navigate to the toolbar. Move to the next and previous toolbar group with TAB and SHIFT-TAB. Move to the next and previous toolbar button with RIGHT ARROW or LEFT ARROW. Press SPACE or ENTER to activate the toolbar button.' // MISSING
			},

				{
				name: 'Dialogové okno editoru',
				legend: 'Inside a dialog, press TAB to navigate to next dialog field, press SHIFT + TAB to move to previous field, press ENTER to submit dialog, press ESC to cancel dialog. For dialogs that have multiple tab pages, press ALT + F10 to navigate to tab-list. Then move to next tab with TAB OR RIGTH ARROW. Move to previous tab with SHIFT + TAB or LEFT ARROW. Press SPACE or ENTER to select the tab page.' // MISSING
			},

				{
				name: 'Editor Context Menu', // MISSING
				legend: 'Press ${contextMenu} or APPLICATION KEY to open context-menu. Then move to next menu option with TAB or DOWN ARROW. Move to previous option with  SHIFT+TAB or UP ARROW. Press SPACE or ENTER to select the menu option. Open sub-menu of current option wtih SPACE or ENTER or RIGHT ARROW. Go back to parent menu item with ESC or LEFT ARROW. Close context menu with ESC.' // MISSING
			},

				{
				name: 'Editor List Box', // MISSING
				legend: 'Inside a list-box, move to next list item with TAB OR DOWN ARROW. Move to previous list item with SHIFT + TAB or UP ARROW. Press SPACE or ENTER to select the list option. Press ESC to close the list-box.' // MISSING
			},

				{
				name: 'Editor Element Path Bar', // MISSING
				legend: 'Press ${elementsPathFocus} to navigate to the elements path bar. Move to next element button with TAB or RIGHT ARROW. Move to previous button with  SHIFT+TAB or LEFT ARROW. Press SPACE or ENTER to select the element in editor.' // MISSING
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
				name: ' Accessibility Help', // MISSING
				legend: 'Stiskněte ${a11yHelp}'
			}
			]
		}
		]
	}
});

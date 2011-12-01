/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.setLang( 'a11yhelp', 'cs', {
	accessibilityHelp: {
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
				legend: 'Press ${contextMenu} or APPLICATION KEY to open context-menu. Then move to next menu option with TAB or DOWN ARROW. Move to previous option with  SHIFT+TAB or UP ARROW. Press SPACE or ENTER to select the menu option. Open sub-menu of current option wtih SPACE or ENTER or RIGHT ARROW. Go back to parent menu item with ESC or LEFT ARROW. Close context menu with ESC.' // MISSING
			},

				{
				name: 'Editor List Box', // MISSING
				legend: 'Inside a list-box, move to next list item with TAB OR DOWN ARROW. Move to previous list item with SHIFT + TAB or UP ARROW. Press SPACE or ENTER to select the list option. Press ESC to close the list-box.' // MISSING
			},

				{
				name: 'Lišta cesty prvku v editoru',
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
				name: ' Nápověda přístupnosti',
				legend: 'Stiskněte ${a11yHelp}'
			}
			]
		}
		]
	}
});

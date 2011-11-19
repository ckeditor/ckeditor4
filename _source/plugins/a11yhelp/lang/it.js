/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.setLang( 'a11yhelp', 'it', {
	accessibilityHelp: {
		title: 'Istruzioni di Accessibilità',
		contents: 'Contenuti di Aiuto. Per chiudere questa finestra premi ESC.',
		legend: [
			{
			name: 'Generale',
			items: [
				{
				name: 'Barra degli strumenti Editor',
				legend: 'Premi ${toolbarFocus} per navigare fino alla barra degli strumenti. Muoviti tra i gruppi della barra degli strumenti con i tasti Tab e Maiusc-Tab. Spostati tra il successivo ed il precedente pulsante della barra degli strumenti usando le frecce direzionali Destra e Sinistra. Premi Spazio o Invio per attivare il pulsante della barra degli strumenti.'
			},

				{
				name: 'Finestra Editor',
				legend: 'All\'interno di una finestra di dialogo, premi Tab per navigare fino al campo successivo della finestra di dialogo, premi Maiusc-Tab per tornare al campo precedente, premi Invio per inviare la finestra di dialogo, premi Esc per uscire. Per le finestre che hanno schede multiple, premi Alt+F10 per navigare nella lista delle schede. Quindi spostati alla scheda successiva con il tasto Tab oppure con la Freccia Destra. Torna alla scheda precedente con Maiusc+Tab oppure con la Freccia Sinistra. Premi Spazio o Invio per scegliere la scheda.'
			},

				{
				name: 'Menù contestuale Editor',
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
			name: 'Comandi',
			items: [
				{
				name: ' Annulla comando',
				legend: 'Premi ${undo}'
			},
				{
				name: ' Ripeti comando',
				legend: 'Premi ${redo}'
			},
				{
				name: ' Comando Grassetto',
				legend: 'Premi ${bold}'
			},
				{
				name: ' Comando Corsivo',
				legend: 'Premi ${italic}'
			},
				{
				name: ' Comando Sottolineato',
				legend: 'Premi ${underline}'
			},
				{
				name: ' Comando Link',
				legend: 'Premi ${link}'
			},
				{
				name: ' Comando riduci barra degli strumenti',
				legend: 'Premi ${toolbarCollapse}'
			},
				{
				name: ' Aiuto Accessibilità',
				legend: 'Premi ${a11yHelp}'
			}
			]
		}
		]
	}
});

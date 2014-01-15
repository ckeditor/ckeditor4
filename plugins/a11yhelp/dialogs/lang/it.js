/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'it', {
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
			legend: 'Premi ${contextMenu} o TASTO APPLICAZIONE per aprire il menu contestuale. Dunque muoviti all\'opzione successiva del menu con il tasto TAB o con la Freccia Sotto. Muoviti all\'opzione precedente con  MAIUSC+TAB o con Freccia Sopra. Premi SPAZIO o INVIO per scegliere l\'opzione di menu. Apri il sottomenu dell\'opzione corrente con SPAZIO o INVIO oppure con la Freccia Destra. Torna indietro al menu superiore con ESC oppure Freccia Sinistra. Chiudi il menu contestuale con ESC.'
		},

			{
			name: 'Box Lista Editor',
			legend: 'Dentro un box-lista, muoviti al prossimo elemento della lista con TAB o con la Freccia direzionale giù. Spostati all\'elemento precedente con MAIUSC+TAB oppure con Freccia direzionale sopra. Premi SPAZIO o INVIO per scegliere l\'opzione della lista. Premi ESC per chiudere il box-lista.'
		},

			{
			name: 'Barra percorso elementi editor',
			legend: 'Premi ${elementsPathFocus} per navigare tra gli elementi della barra percorso. Muoviti al prossimo pulsante di elemento con TAB o la Freccia direzionale destra. Muoviti al pulsante precedente con MAIUSC+TAB o la Freccia Direzionale Sinistra. Premi SPAZIO o INVIO per scegliere l\'elemento nell\'editor.'
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
			name: 'Comando di accesso al precedente spazio di focus',
			legend: 'Premi ${accessPreviousSpace} per accedere il più vicino spazio di focus non raggiungibile prima del simbolo caret, per esempio due elementi HR adiacenti. Ripeti la combinazione di tasti per raggiungere spazi di focus distanti.'
		},
			{
			name: 'Comando di accesso al prossimo spazio di focus',
			legend: 'Premi ${accessNextSpace} per accedere il più vicino spazio di focus non raggiungibile dopo il simbolo caret, per esempio due elementi HR adiacenti. Ripeti la combinazione di tasti per raggiungere spazi di focus distanti.'
		},
			{
			name: ' Aiuto Accessibilità',
			legend: 'Premi ${a11yHelp}'
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

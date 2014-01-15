/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'es', {
	title: 'Instrucciones de accesibilidad',
	contents: 'Ayuda. Para cerrar presione ESC.',
	legend: [
		{
		name: 'General',
		items: [
			{
			name: 'Barra de herramientas del editor',
			legend: 'Presiona ${toolbarFocus} para navegar por la barra de herramientas. Para moverse por los distintos grupos de herramientas usa las teclas TAB y MAY-TAB. Para moverse por las distintas herramientas usa FLECHA DERECHA o FECHA IZQUIERDA. Presiona "espacio" o "intro" para activar la herramienta.'
		},

			{
			name: 'Editor de diálogo',
			legend: 'Dentro de un cuadro de diálogo, presione la tecla TAB para desplazarse al campo siguiente del cuadro de diálogo, pulse SHIFT + TAB para desplazarse al campo anterior, pulse ENTER para presentar cuadro de diálogo, pulse la tecla ESC para cancelar el diálogo. Para los diálogos que tienen varias páginas, presione ALT + F10 para navegar a la pestaña de la lista. Luego pasar a la siguiente pestaña con TAB o FLECHA DERECHA. Para ir a la ficha anterior con SHIFT + TAB o FLECHA IZQUIERDA. Presione ESPACIO o ENTRAR para seleccionar la página de ficha.'
		},

			{
			name: 'Editor del menú contextual',
			legend: 'Presiona ${contextMenu} o TECLA MENÚ para abrir el menú contextual. Entonces muévete a la siguiente opción del menú con TAB o FLECHA ABAJO. Muévete a la opción previa con SHIFT + TAB o FLECHA ARRIBA. Presiona ESPACIO o ENTER para seleccionar la opción del menú. Abre el submenú de la opción actual con ESPACIO o ENTER o FLECHA DERECHA. Regresa al elemento padre del menú con ESC o FLECHA IZQUIERDA. Cierra el menú contextual con ESC.'
		},

			{
			name: 'Lista del Editor',
			legend: 'Dentro de una lista, te mueves al siguiente elemento de la lista con TAB o FLECHA ABAJO. Te mueves al elemento previo de la lista con SHIFT + TAB o FLECHA ARRIBA. Presiona ESPACIO o ENTER para elegir la opción de la lista. Presiona ESC para cerrar la lista.'
		},

			{
			name: 'Barra de Ruta del Elemento en el Editor',
			legend: 'Presiona ${elementsPathFocus} para navegar a los elementos de la barra de ruta. Te mueves al siguiente elemento botón con TAB o FLECHA DERECHA. Te mueves al botón previo con SHIFT + TAB o FLECHA IZQUIERDA. Presiona ESPACIO o ENTER para seleccionar el elemento en el editor.'
		}
		]
	},
		{
		name: 'Comandos',
		items: [
			{
			name: 'Comando deshacer',
			legend: 'Presiona ${undo}'
		},
			{
			name: 'Comando rehacer',
			legend: 'Presiona ${redo}'
		},
			{
			name: 'Comando negrita',
			legend: 'Presiona ${bold}'
		},
			{
			name: 'Comando itálica',
			legend: 'Presiona ${italic}'
		},
			{
			name: 'Comando subrayar',
			legend: 'Presiona ${underline}'
		},
			{
			name: 'Comando liga',
			legend: 'Presiona ${liga}'
		},
			{
			name: 'Comando colapsar barra de herramientas',
			legend: 'Presiona ${toolbarCollapse}'
		},
			{
			name: 'Comando accesar el anterior espacio de foco',
			legend: 'Presiona ${accessPreviousSpace} para accesar el espacio de foco no disponible más cercano anterior al cursor, por ejemplo: dos elementos HR adyacentes. Repite la combinación de teclas para alcanzar espacios de foco distantes.'
		},
			{
			name: 'Comando accesar el siguiente spacio de foco',
			legend: 'Presiona ${accessNextSpace} para accesar el espacio de foco no disponible más cercano después del cursor, por ejemplo: dos elementos HR adyacentes. Repite la combinación de teclas para alcanzar espacios de foco distantes.'
		},
			{
			name: 'Ayuda de Accesibilidad',
			legend: 'Presiona ${a11yHelp}'
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

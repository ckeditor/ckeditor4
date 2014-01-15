/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'gl', {
	title: 'Instrucións de accesibilidade',
	contents: 'Axuda. Para pechar este diálogo prema ESC.',
	legend: [
		{
		name: 'Xeral',
		items: [
			{
			name: 'Barra de ferramentas do editor',
			legend: 'Prema ${toolbarFocus} para navegar pola barra de ferramentas. Para moverse polos distintos grupos de ferramentas use as teclas TAB e MAIÚS+TAB. Para moverse polas distintas ferramentas use FRECHA DEREITA ou FRECHA ESQUERDA. Prema ESPAZO ou INTRO para activar o botón da barra de ferramentas.'
		},

			{
			name: 'Editor de diálogo',
			legend: 'Dentro dun cadro de diálogo, prema a tecla TAB para desprazarse ao campo seguinte do cadro de diálogo, prema MAIÚS + TAB para desprazarse ao campo anterior, prema INTRO para presentar o cadro de diálogo, prema a tecla ESC para cancelar o diálogo. Para os diálogos que teñen varias páxinas, prema ALT + F10 para navegar á lapela da lista. Despois pasar á seguinte lapela con TAB ou FRECHA DEREITA. Para ir á lapela anterior con SHIFT + TAB ou FRECHA ESQUERDA. Prema ESPAZO ou INTRO para seleccionar a lapela da páxina.'
		},

			{
			name: 'Editor do menú contextual',
			legend: 'Prema ${contextMenu} ou a TECLA MENÚ para abrir o menú contextual. A seguir móvase á seguinte opción do menú con TAB ou FRECHA ABAIXO. Móvase á opción anterior con MAIÚS + TAB ou FRECHA ARRIBA. Prema ESPAZO ou INTRO para seleccionar a opción do menú. Abra o submenú da opción actual con ESPAZO ou INTRO ou FRECHA DEREITA. Regrese ao elemento principal do menú con ESC ou FRECHA ESQUERDA. Peche o menú contextual con ESC.'
		},

			{
			name: 'Lista do editor',
			legend: 'Dentro dunha lista, móvase ao seguinte elemento da lista con TAB ou FRECHA ABAIXO. Móvase ao elemento anterior da lista con MAIÚS + TAB ou FRECHA ARRIBA. Prema ESPAZO ou INTRO para escoller a opción da lista. Prema ESC para pechar a lista.'
		},

			{
			name: 'Barra da ruta ao elemento no editor',
			legend: 'Prema ${elementsPathFocus} para navegar ata os elementos da barra de ruta. Móvase ao seguinte elemento botón con TAB ou FRECHA DEREITA. Móvase ao botón anterior con MAIÚS + TAB ou FRECHA ESQUERDA. Prema ESPAZO ou INTRO para seleccionar o elemento no editor.'
		}
		]
	},
		{
		name: 'Ordes',
		items: [
			{
			name: 'Orde «desfacer»',
			legend: 'Prema ${undo}'
		},
			{
			name: 'Orde «refacer»',
			legend: 'Prema ${redo}'
		},
			{
			name: 'Orde «negra»',
			legend: 'Prema ${bold}'
		},
			{
			name: 'Orde «cursiva»',
			legend: 'Prema ${italic}'
		},
			{
			name: 'Orde «subliñar»',
			legend: 'Prema ${underline}'
		},
			{
			name: 'Orde «ligazón»',
			legend: 'Prema ${link}'
		},
			{
			name: 'Orde «contraer a barra de ferramentas»',
			legend: 'Prema ${toolbarCollapse}'
		},
			{
			name: 'Orde «acceder ao anterior espazo en foco»',
			legend: 'Prema ${accessPreviousSpace} para acceder ao espazo máis próximo de foco inalcanzábel anterior ao cursor, por exemplo: dous elementos HR adxacentes. Repita a combinación de teclas para chegar a espazos de foco distantes.'
		},
			{
			name: 'Orde «acceder ao seguinte espazo en foco»',
			legend: 'Prema ${accessNextSpace} para acceder ao espazo máis próximo de foco inalcanzábel posterior ao cursor, por exemplo: dous elementos HR adxacentes. Repita a combinación de teclas para chegar a espazos de foco distantes.'
		},
			{
			name: 'Axuda da accesibilidade',
			legend: 'Prema ${a11yHelp}'
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

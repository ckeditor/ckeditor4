/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Spanish language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'es' ] = {
	// ARIA description.
	editor: 'Editor de Texto Enriquecido',
	editorPanel: 'Panel del Editor de Texto Enriquecido',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Pulse ALT 0 para ayuda',

		browseServer: 'Ver Servidor',
		url: 'URL',
		protocol: 'Protocolo',
		upload: 'Cargar',
		uploadSubmit: 'Enviar al Servidor',
		image: 'Imagen',
		form: 'Formulario',
		checkbox: 'Casilla de Verificación',
		radio: 'Botones de Radio',
		textField: 'Campo de Texto',
		textarea: 'Area de Texto',
		hiddenField: 'Campo Oculto',
		button: 'Botón',
		select: 'Campo de Selección',
		imageButton: 'Botón Imagen',
		notSet: '<No definido>',
		id: 'Id',
		name: 'Nombre',
		langDir: 'Orientación',
		langDirLtr: 'Izquierda a Derecha (LTR)',
		langDirRtl: 'Derecha a Izquierda (RTL)',
		langCode: 'Cód. de idioma',
		longDescr: 'Descripción larga URL',
		cssClass: 'Clases de hojas de estilo',
		advisoryTitle: 'Título',
		cssStyle: 'Estilo',
		ok: 'Aceptar',
		cancel: 'Cancelar',
		close: 'Cerrar',
		preview: 'Previsualización',
		resize: 'Arrastre para redimensionar',
		generalTab: 'General',
		advancedTab: 'Avanzado',
		validateNumberFailed: 'El valor no es un número.',
		confirmNewPage: 'Cualquier cambio que no se haya guardado se perderá.\r\n¿Está seguro de querer crear una nueva página?',
		confirmCancel: 'Algunas de las opciones se han cambiado.\r\n¿Está seguro de querer cerrar el diálogo?',
		options: 'Opciones',
		target: 'Destino',
		targetNew: 'Nueva ventana (_blank)',
		targetTop: 'Ventana principal (_top)',
		targetSelf: 'Misma ventana (_self)',
		targetParent: 'Ventana padre (_parent)',
		langDirLTR: 'Izquierda a derecha (LTR)',
		langDirRTL: 'Derecha a izquierda (RTL)',
		styles: 'Estilos',
		cssClasses: 'Clase de la hoja de estilos',
		width: 'Anchura',
		height: 'Altura',
		align: 'Alineación',
		left: 'Izquierda',
		right: 'Derecha',
		center: 'Centrado',
		justify: 'Justificado',
		alignLeft: 'Alinear a Izquierda',
		alignRight: 'Alinear a Derecha',
		alignCenter: 'Centrar',
		alignTop: 'Tope',
		alignMiddle: 'Centro',
		alignBottom: 'Pie',
		alignNone: 'Ninguno',
		invalidValue: 'Valor no válido',
		invalidHeight: 'Altura debe ser un número.',
		invalidWidth: 'Anchura debe ser un número.',
		invalidLength: 'El valor especificado para el campo "%1" debe ser un número positivo, incluyendo opcionalmente una unidad de medida válida (%2).',
		invalidCssLength: 'El valor especificado para el campo "%1" debe ser un número positivo, incluyendo optionalmente una unidad de medida CSS válida (px, %, in, cm, mm, em, ex, pt, o pc).',
		invalidHtmlLength: 'El valor especificado para el campo "%1" debe ser un número positivo, incluyendo optionalmente una unidad de medida HTML válida (px o %).',
		invalidInlineStyle: 'El valor especificado para el estilo debe consistir en uno o más pares con el formato "nombre: valor", separados por punto y coma.',
		cssLengthTooltip: 'Introduca un número para el valor en pixels o un número con una unidad de medida CSS válida (px, %, in, cm, mm, em, ex, pt, o pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, no disponible</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Retroceso',
			13: 'Ingresar',
			16: 'Mayús.',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Espacio',
			35: 'Fin',
			36: 'Inicio',
			46: 'Suprimir',
			112: 'F1',
			113: 'F2',
			114: 'F3',
			115: 'F4',
			116: 'F5',
			117: 'F6',
			118: 'F7',
			119: 'F8',
			120: 'F9',
			121: 'F10',
			122: 'F11',
			123: 'F12',
			124: 'F13',
			125: 'F14',
			126: 'F15',
			127: 'F16',
			128: 'F17',
			129: 'F18',
			130: 'F19',
			131: 'F20',
			132: 'F21',
			133: 'F22',
			134: 'F23',
			135: 'F24',
			224: 'Comando'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Atajos de teclado',

		optionDefault: 'Default'
	}
};

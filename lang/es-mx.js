/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
* @fileOverview 
*/

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'es-mx' ] = {
	// ARIA description.
	editor: 'Editor de texto enriquecido',
	editorPanel: 'Panel del editor de texto',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Presiona ALT + 0 para ayuda',

		browseServer: 'Examinar servidor',
		url: 'URL',
		protocol: 'Protocolo',
		upload: 'Subir',
		uploadSubmit: 'Enviar al servidor',
		image: 'Imagen',
		flash: 'Flash',
		form: 'Formulario',
		checkbox: 'Casilla de verificación',
		radio: 'Botón de opción',
		textField: 'Campo de texto',
		textarea: 'Área de texto',
		hiddenField: 'Campo oculto',
		button: 'Botón',
		select: 'Campo de selección',
		imageButton: 'Botón de imagen',
		notSet: '<not set>',
		id: 'Id',
		name: 'Nombre',
		langDir: 'Dirección de idiomas',
		langDirLtr: 'Izquierda a derecha (LTR)',
		langDirRtl: 'Derecha a izquierda (RTL)',
		langCode: 'Código de lenguaje',
		longDescr: 'URL descripción larga',
		cssClass: 'Clases de hoja de estilo',
		advisoryTitle: 'Título del anuncio',
		cssStyle: 'Estilo',
		ok: 'OK',
		cancel: 'Cancelar',
		close: 'Cerrar',
		preview: 'Vista previa',
		resize: 'Redimensionar',
		generalTab: 'General',
		advancedTab: 'Avanzada',
		validateNumberFailed: 'Este valor no es un número.',
		confirmNewPage: 'Se perderán todos los cambios no guardados en este contenido. ¿Seguro que quieres cargar nueva página?',
		confirmCancel: 'Ha cambiado algunas opciones. ¿Está seguro de que desea cerrar la ventana de diálogo?',
		options: 'Opciones',
		target: 'Objetivo',
		targetNew: 'Nueva ventana (_blank)',
		targetTop: 'Ventana superior (_top)',
		targetSelf: 'Misma ventana (_self)',
		targetParent: 'Ventana principal (_parent)',
		langDirLTR: 'Izquierda a Derecha (LTR)',
		langDirRTL: 'Derecha a Izquierda (RTL)',
		styles: 'Estilo',
		cssClasses: 'Clases de hojas de estilo',
		width: 'Ancho',
		height: 'Alto',
		align: 'Alineación',
		left: 'Izquierda',
		right: 'Derecha',
		center: 'Centrado',
		justify: 'Justificado',
		alignLeft: 'Alinear a la izquierda',
		alignRight: 'Alinear a la derecha',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Arriba',
		alignMiddle: 'En medio',
		alignBottom: 'Abajo',
		alignNone: 'Ninguno',
		invalidValue: 'Valor inválido',
		invalidHeight: 'La altura debe ser un número.',
		invalidWidth: 'La anchura debe ser un número.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'El valor especificado para el campo "% 1" debe ser un número positivo con o sin una unidad de medida CSS válida (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'El valor especificado para el campo "% 1" debe ser un número positivo con o sin una unidad de medición HTML válida (px or %).',
		invalidInlineStyle: 'El valor especificado para el estilo en línea debe constar de una o más tuplas con el formato de "nombre: valor", separados por punto y coma',
		cssLengthTooltip: 'Introduzca un número para un valor en píxeles o un número con una unidad CSS válida  (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, no disponible</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Retroceso',
			13: 'Intro',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Espacio',
			35: 'Fin',
			36: 'Inicio',
			46: 'Borrar',
			112: 'F1', // MISSING
			113: 'F2', // MISSING
			114: 'F3', // MISSING
			115: 'F4', // MISSING
			116: 'F5', // MISSING
			117: 'F6', // MISSING
			118: 'F7', // MISSING
			119: 'F8', // MISSING
			120: 'F9', // MISSING
			121: 'F10', // MISSING
			122: 'F11', // MISSING
			123: 'F12', // MISSING
			124: 'F13', // MISSING
			125: 'F14', // MISSING
			126: 'F15', // MISSING
			127: 'F16', // MISSING
			128: 'F17', // MISSING
			129: 'F18', // MISSING
			130: 'F19', // MISSING
			131: 'F20', // MISSING
			132: 'F21', // MISSING
			133: 'F22', // MISSING
			134: 'F23', // MISSING
			135: 'F24', // MISSING
			224: 'Comando'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Atajo de teclado',

		optionDefault: 'Default' // MISSING
	}
};

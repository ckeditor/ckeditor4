/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Galician language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'gl' ] = {
	// ARIA description.
	application: 'Editor de texto mellorado',
	editor: 'Editor de texto mellorado',
	editorPanel: 'Panel do editor de texto mellorado',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Prema ALT 0 para obter axuda',

		browseServer: 'Examinar o servidor',
		url: 'URL',
		protocol: 'Protocolo',
		upload: 'Enviar',
		uploadSubmit: 'Enviar ao servidor',
		image: 'Imaxe',
		form: 'Formulario',
		checkbox: 'Caixa de selección',
		radio: 'Botón de opción',
		textField: 'Campo de texto',
		textarea: 'Área de texto',
		hiddenField: 'Campo agochado',
		button: 'Botón',
		select: 'Campo de selección',
		imageButton: 'Botón de imaxe',
		notSet: '<sen estabelecer>',
		id: 'ID',
		name: 'Nome',
		langDir: 'Dirección de escritura do idioma',
		langDirLtr: 'Esquerda a dereita (LTR)',
		langDirRtl: 'Dereita a esquerda (RTL)',
		langCode: 'Código do idioma',
		longDescr: 'Descrición completa do URL',
		cssClass: 'Clases da folla de estilos',
		advisoryTitle: 'Título',
		cssStyle: 'Estilo',
		ok: 'Aceptar',
		cancel: 'Cancelar',
		close: 'Pechar',
		preview: 'Vista previa',
		resize: 'Redimensionar',
		generalTab: 'Xeral',
		advancedTab: 'Avanzado',
		validateNumberFailed: 'Este valor non é un número.',
		confirmNewPage: 'Calquera cambio que non gardara neste contido perderase.\r\nConfirma que quere cargar unha páxina nova?',
		confirmCancel: 'Algunhas das opcións foron cambiadas.\r\nConfirma que quere pechar o diálogo?',
		options: 'Opcións',
		target: 'Destino',
		targetNew: 'Nova xanela (_blank)',
		targetTop: 'Xanela principal (_top)',
		targetSelf: 'Mesma xanela (_self)',
		targetParent: 'Xanela superior (_parent)',
		langDirLTR: 'Esquerda a dereita (LTR)',
		langDirRTL: 'Dereita a esquerda (RTL)',
		styles: 'Estilo',
		cssClasses: 'Clases da folla de estilos',
		width: 'Largo',
		height: 'Alto',
		align: 'Aliñamento',
		left: 'Esquerda',
		right: 'Dereita',
		center: 'Centro',
		justify: 'Xustificado',
		alignLeft: 'Aliñar á esquerda',
		alignRight: 'Aliñar á dereita',
		alignCenter: 'Aliñar ao centro',
		alignTop: 'Arriba',
		alignMiddle: 'Centro',
		alignBottom: 'Abaixo',
		alignNone: 'Ningún',
		invalidValue: 'Valor incorrecto.',
		invalidHeight: 'O alto debe ser un número.',
		invalidWidth: 'O largo debe ser un número.',
		invalidLength: 'O valor especificado para o campo «%1» debe ser un número positivo con ou sen unha unidade de medida correcta (%2).',
		invalidCssLength: 'O valor especificado para o campo «%1» debe ser un número positivo con ou sen unha unidade de medida CSS correcta (px, %, in, cm, mm, em, ex, pt, ou pc).',
		invalidHtmlLength: 'O valor especificado para o campo «%1» debe ser un número positivo con ou sen unha unidade de medida HTML correcta (px ou %).',
		invalidInlineStyle: 'O valor especificado no estilo en liña debe consistir nunha ou máis tuplas co formato «nome : valor», separadas por punto e coma.',
		cssLengthTooltip: 'Escriba un número para o valor en píxeles ou un número cunha unidade CSS correcta (px, %, in, cm, mm, em, ex, pt, ou pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, non dispoñíbel</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Ir atrás',
			13: 'Intro',
			16: 'Maiús',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Espazo',
			35: 'Fin',
			36: 'Inicio',
			46: 'Supr',
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
			224: 'Orde'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Atallo de teclado',

		optionDefault: 'Predeterminado'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};

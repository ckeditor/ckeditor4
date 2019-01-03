/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Catalan language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'ca' ] = {
	// ARIA description.
	editor: 'Editor de text enriquit',
	editorPanel: 'Panell de l\'editor de text enriquit',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Premeu ALT 0 per ajuda',

		browseServer: 'Veure servidor',
		url: 'URL',
		protocol: 'Protocol',
		upload: 'Puja',
		uploadSubmit: 'Envia-la al servidor',
		image: 'Imatge',
		flash: 'Flash',
		form: 'Formulari',
		checkbox: 'Casella de verificació',
		radio: 'Botó d\'opció',
		textField: 'Camp de text',
		textarea: 'Àrea de text',
		hiddenField: 'Camp ocult',
		button: 'Botó',
		select: 'Camp de selecció',
		imageButton: 'Botó d\'imatge',
		notSet: '<no definit>',
		id: 'Id',
		name: 'Nom',
		langDir: 'Direcció de l\'idioma',
		langDirLtr: 'D\'esquerra a dreta (LTR)',
		langDirRtl: 'De dreta a esquerra (RTL)',
		langCode: 'Codi d\'idioma',
		longDescr: 'Descripció llarga de la URL',
		cssClass: 'Classes del full d\'estil',
		advisoryTitle: 'Títol consultiu',
		cssStyle: 'Estil',
		ok: 'D\'acord',
		cancel: 'Cancel·la',
		close: 'Tanca',
		preview: 'Previsualitza',
		resize: 'Arrossegueu per redimensionar',
		generalTab: 'General',
		advancedTab: 'Avançat',
		validateNumberFailed: 'Aquest valor no és un número.',
		confirmNewPage: 'Els canvis en aquest contingut que no es desin es perdran. Esteu segur que voleu carregar una pàgina nova?',
		confirmCancel: 'Algunes opcions s\'han canviat. Esteu segur que voleu tancar el quadre de diàleg?',
		options: 'Opcions',
		target: 'Destí',
		targetNew: 'Nova finestra (_blank)',
		targetTop: 'Finestra superior (_top)',
		targetSelf: 'Mateixa finestra (_self)',
		targetParent: 'Finestra pare (_parent)',
		langDirLTR: 'D\'esquerra a dreta (LTR)',
		langDirRTL: 'De dreta a esquerra (RTL)',
		styles: 'Estil',
		cssClasses: 'Classes del full d\'estil',
		width: 'Amplada',
		height: 'Alçada',
		align: 'Alineació',
		left: 'Ajusta a l\'esquerra',
		right: 'Ajusta a la dreta',
		center: 'Centre',
		justify: 'Justificat',
		alignLeft: 'Alinea a l\'esquerra',
		alignRight: 'Alinea a la dreta',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Superior',
		alignMiddle: 'Centre',
		alignBottom: 'Inferior',
		alignNone: 'Cap',
		invalidValue: 'Valor no vàlid.',
		invalidHeight: 'L\'alçada ha de ser un número.',
		invalidWidth: 'L\'amplada ha de ser un número.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'El valor especificat per als "%1" camps ha de ser un número positiu amb o sense unitat de mesura vàlida de CSS (px, %, in, cm, mm, em, ex, pt o pc).',
		invalidHtmlLength: 'El valor especificat per als "%1" camps ha de ser un número positiu amb o sense unitat de mesura vàlida d\'HTML (px o %).',
		invalidInlineStyle: 'El valor especificat per l\'estil en línia ha de constar d\'una o més tuples amb el format "name: value", separats per punt i coma.',
		cssLengthTooltip: 'Introduïu un número per un valor en píxels o un número amb una unitat vàlida de CSS (px, %, in, cm, mm, em, ex, pt o pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, no disponible</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Retrocés',
			13: 'Intro',
			16: 'Majúscules',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Space', // MISSING
			35: 'Fi',
			36: 'Inici',
			46: 'Eliminar',
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
			224: 'Command' // MISSING
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Keyboard shortcut', // MISSING

		optionDefault: 'Default' // MISSING
	}
};

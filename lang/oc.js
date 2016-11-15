/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object for the Occitan
 *		language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'oc' ] = {
	// ARIA description.
	editor: 'Editor de tèxte enriquit',
	editorPanel: 'Tablèu de bòrd de l\'editor de tèxte enriquit',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Utilisatz l\'acorchi Alt-0 per obténer d\'ajuda',

		browseServer: 'Percórrer lo servidor',
		url: 'URL',
		protocol: 'Protocòl',
		upload: 'Mandar',
		uploadSubmit: 'Mandar sul servidor',
		image: 'Imatge',
		flash: 'Flash',
		form: 'Formulari',
		checkbox: 'Casa de marcar',
		radio: 'Boton ràdio',
		textField: 'Camp  tèxte',
		textarea: 'Zòna de tèxte',
		hiddenField: 'Camp invisible',
		button: 'Boton',
		select: 'Lista desenrotlanta',
		imageButton: 'Boton amb imatge',
		notSet: '<indefinit>',
		id: 'Id',
		name: 'Nom',
		langDir: 'Sens d\'escritura',
		langDirLtr: 'Esquèrra a dreita (LTR)',
		langDirRtl: 'Dreita a esquèrra (RTL)',
		langCode: 'Còdi de lenga',
		longDescr: 'URL de descripcion longa',
		cssClass: 'Classas d\'estil',
		advisoryTitle: 'Infobulla',
		cssStyle: 'Estil',
		ok: 'D\'acòrdi',
		cancel: 'Anullar',
		close: 'Tampar',
		preview: 'Previsualizar',
		resize: 'Redimensionar',
		generalTab: 'General',
		advancedTab: 'Avançat',
		validateNumberFailed: 'Aquesta valor es pas un nombre.',
		confirmNewPage: 'Los cambiaments pas salvats seràn perduts. Sètz segur que volètz cargar una novèla pagina ?',
		confirmCancel: 'Certanas opcions son estadas modificadas. Sètz segur que volètz tampar ?',
		options: 'Opcions',
		target: 'Cibla',
		targetNew: 'Novèla fenèstra (_blank)',
		targetTop: 'Fenèstra superiora (_top)',
		targetSelf: 'Meteissa fenèstra (_self)',
		targetParent: 'Fenèstra parent (_parent)',
		langDirLTR: 'Esquèrra a dreita (LTR)',
		langDirRTL: 'Dreita a esquèrra (RTL)',
		styles: 'Estil',
		cssClasses: 'Classas d\'estil',
		width: 'Largor',
		height: 'Nautor',
		align: 'Alinhament',
		alignLeft: 'Esquèrra',
		alignRight: 'Dreita',
		alignCenter: 'Centrar',
		alignJustify: 'Justificar',
		alignTop: 'Naut',
		alignMiddle: 'Mitan',
		alignBottom: 'Bas',
		alignNone: 'Pas cap',
		invalidValue: 'Valor invalida.',
		invalidHeight: 'La nautor deu èsser un nombre.',
		invalidWidth: 'La largor deu èsser un nombre.',
		invalidCssLength: 'La valor especificada pel camp « %1 » deu èsser un nombre positiu amb o sens unitat de mesura CSS valid (px, %, in, cm, mm, em, ex, pt, o pc).',
		invalidHtmlLength: 'La valor especificada pel camp « %1 » deu èsser un nombre positiu amb o sens unitat de mesura HTML valid (px o %).',
		invalidInlineStyle: 'La valor especificada per l\'estil en linha deu èsser compausada d\'un o mantun parelh al format « nom : valor », separats per de punts-virgulas.',
		cssLengthTooltip: 'Entrar un nombre per una valor en pixèls o un nombre amb una unitat de mesura CSS valida (px, %, in, cm, mm, em, ex, pt, o pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, indisponible</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Retorn',
			13: 'Entrada',
			16: 'Majuscula',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Espaci',
			35: 'Fin',
			36: 'Origina',
			46: 'Suprimir',
			224: 'Comanda'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Acorchi de clavièr'
	}
};

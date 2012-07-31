/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
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
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Editor de text enriquit',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Press ALT 0 for help', // MISSING

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
		confirmCancel: 'Algunes opcions s\'han canviat. Esteu segur que voleu tancar la finestra de diàleg?',
		options: 'Opcions',
		target: 'Destí',
		targetNew: 'Nova finestra (_blank)',
		targetTop: 'Finestra major (_top)',
		targetSelf: 'Mateixa finestra (_self)',
		targetParent: 'Finestra pare (_parent)',
		langDirLTR: 'D\'esquerra a dreta (LTR)',
		langDirRTL: 'De dreta a esquerra (RTL)',
		styles: 'Estil',
		cssClasses: 'Classes del full d\'estil',
		width: 'Amplada',
		height: 'Alçada',
		align: 'Alineació',
		alignLeft: 'Ajusta a l\'esquerra',
		alignRight: 'Ajusta a la dreta',
		alignCenter: 'Centre',
		alignTop: 'Superior',
		alignMiddle: 'Centre',
		alignBottom: 'Inferior',
		invalidHeight: 'L\'alçada ha de ser un nombre.',
		invalidWidth: 'L\'amplada ha de ser un nombre.',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, no disponible</span>'
	}
};

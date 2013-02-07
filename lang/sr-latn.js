/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Serbian (Latin) language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'sr-latn' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Rich Text Editor', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Press ALT 0 for help', // MISSING

		browseServer: 'Pretraži server',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Pošalji',
		uploadSubmit: 'Pošalji na server',
		image: 'Slika',
		flash: 'Fleš',
		form: 'Forma',
		checkbox: 'Polje za potvrdu',
		radio: 'Radio-dugme',
		textField: 'Tekstualno polje',
		textarea: 'Zona teksta',
		hiddenField: 'Skriveno polje',
		button: 'Dugme',
		select: 'Izborno polje',
		imageButton: 'Dugme sa slikom',
		notSet: '<nije postavljeno>',
		id: 'Id',
		name: 'Naziv',
		langDir: 'Smer jezika',
		langDirLtr: 'S leva na desno (LTR)',
		langDirRtl: 'S desna na levo (RTL)',
		langCode: 'Kôd jezika',
		longDescr: 'Pun opis URL',
		cssClass: 'Stylesheet klase',
		advisoryTitle: 'Advisory naslov',
		cssStyle: 'Stil',
		ok: 'OK',
		cancel: 'Otkaži',
		close: 'Close', // MISSING
		preview: 'Izgled stranice',
		resize: 'Resize', // MISSING
		generalTab: 'General', // MISSING
		advancedTab: 'Napredni tagovi',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING
		options: 'Options', // MISSING
		target: 'Meta',
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'S leva na desno (LTR)',
		langDirRTL: 'S desna na levo (RTL)',
		styles: 'Stil',
		cssClasses: 'Stylesheet klase',
		width: 'Širina',
		height: 'Visina',
		align: 'Ravnanje',
		alignLeft: 'Levo',
		alignRight: 'Desno',
		alignCenter: 'Sredina',
		alignTop: 'Vrh',
		alignMiddle: 'Sredina',
		alignBottom: 'Dole',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'Height must be a number.', // MISSING
		invalidWidth: 'Width must be a number.', // MISSING
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	}
};

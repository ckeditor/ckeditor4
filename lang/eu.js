/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Basque language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'eu' ] = {
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

		browseServer: 'Zerbitzaria arakatu',
		url: 'URL',
		protocol: 'Protokoloa',
		upload: 'Gora kargatu',
		uploadSubmit: 'Zerbitzarira bidalia',
		image: 'Irudia',
		flash: 'Flasha',
		form: 'Formularioa',
		checkbox: 'Kontrol-laukia',
		radio: 'Aukera-botoia',
		textField: 'Testu Eremua',
		textarea: 'Testu-area',
		hiddenField: 'Ezkutuko Eremua',
		button: 'Botoia',
		select: 'Hautespen Eremua',
		imageButton: 'Irudi Botoia',
		notSet: '<Ezarri gabe>',
		id: 'Id',
		name: 'Izena',
		langDir: 'Hizkuntzaren Norabidea',
		langDirLtr: 'Ezkerretik Eskumara(LTR)',
		langDirRtl: 'Eskumatik Ezkerrera (RTL)',
		langCode: 'Hizkuntza Kodea',
		longDescr: 'URL Deskribapen Luzea',
		cssClass: 'Estilo-orriko Klaseak',
		advisoryTitle: 'Izenburua',
		cssStyle: 'Estiloa',
		ok: 'Ados',
		cancel: 'Utzi',
		close: 'Close', // MISSING
		preview: 'Aurrebista',
		resize: 'Arrastatu tamaina aldatzeko',
		generalTab: 'Orokorra',
		advancedTab: 'Aurreratua',
		validateNumberFailed: 'Balio hau ez da zenbaki bat.',
		confirmNewPage: 'Eduki honetan gorde gabe dauden aldaketak galduko dira. Ziur zaude orri berri bat kargatu nahi duzula?',
		confirmCancel: 'Aukera batzuk aldatu egin dira. Ziur zaude elkarrizketa-koadroa itxi nahi duzula?',
		options: 'Aukerak',
		target: 'Target (Helburua)',
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'Ezkerretik Eskumara(LTR)',
		langDirRTL: 'Eskumatik Ezkerrera (RTL)',
		styles: 'Estiloa',
		cssClasses: 'Estilo-orriko Klaseak',
		width: 'Zabalera',
		height: 'Altuera',
		align: 'Lerrokatu',
		alignLeft: 'Ezkerrera',
		alignRight: 'Eskuman',
		alignCenter: 'Erdian',
		alignTop: 'Goian',
		alignMiddle: 'Erdian',
		alignBottom: 'Behean',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'Altuera zenbaki bat izan behar da.',
		invalidWidth: 'Zabalera zenbaki bat izan behar da.',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, erabilezina</span>'
	}
};

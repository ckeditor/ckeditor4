/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Slovenian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'sl' ] = {
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

		browseServer: 'Prebrskaj na strežniku',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Prenesi',
		uploadSubmit: 'Pošlji na strežnik',
		image: 'Slika',
		flash: 'Flash',
		form: 'Obrazec',
		checkbox: 'Potrditveno polje',
		radio: 'Izbirno polje',
		textField: 'Vnosno polje',
		textarea: 'Vnosno območje',
		hiddenField: 'Skrito polje',
		button: 'Gumb',
		select: 'Spustni seznam',
		imageButton: 'Gumb s sliko',
		notSet: '<ni postavljen>',
		id: 'Id',
		name: 'Ime',
		langDir: 'Smer jezika',
		langDirLtr: 'Od leve proti desni (LTR)',
		langDirRtl: 'Od desne proti levi (RTL)',
		langCode: 'Oznaka jezika',
		longDescr: 'Dolg opis URL-ja',
		cssClass: 'Razred stilne predloge',
		advisoryTitle: 'Predlagani naslov',
		cssStyle: 'Slog',
		ok: 'V redu',
		cancel: 'Prekliči',
		close: 'Close', // MISSING
		preview: 'Predogled',
		resize: 'Potegni za spremembo velikosti',
		generalTab: 'Splošno',
		advancedTab: 'Napredno',
		validateNumberFailed: 'Ta vrednost ni število.',
		confirmNewPage: 'Vse neshranjene spremembe te vsebine bodo izgubljene. Ali gotovo želiš naložiti novo stran?',
		confirmCancel: 'Nekaj možnosti je bilo spremenjenih. Ali gotovo želiš zapreti okno?',
		options: 'Možnosti',
		target: 'Cilj',
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'Od leve proti desni (LTR)',
		langDirRTL: 'Od desne proti levi (RTL)',
		styles: 'Slog',
		cssClasses: 'Razred stilne predloge',
		width: 'Širina',
		height: 'Višina',
		align: 'Poravnava',
		alignLeft: 'Levo',
		alignRight: 'Desno',
		alignCenter: 'Sredinsko',
		alignTop: 'Na vrh',
		alignMiddle: 'V sredino',
		alignBottom: 'Na dno',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'Višina mora biti število.',
		invalidWidth: 'Širina mora biti število.',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nedosegljiv</span>'
	}
};

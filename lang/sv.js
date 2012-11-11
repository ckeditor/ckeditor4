/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
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
CKEDITOR.lang[ 'sv' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Rich Text Editor',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Tryck ALT 0 för hjälp',

		browseServer: 'Bläddra på server',
		url: 'URL',
		protocol: 'Protokoll',
		upload: 'Ladda upp',
		uploadSubmit: 'Skicka till server',
		image: 'Bild',
		flash: 'Flash',
		form: 'Formulär',
		checkbox: 'Kryssruta',
		radio: 'Alternativknapp',
		textField: 'Textfält',
		textarea: 'Textruta',
		hiddenField: 'Dolt fält',
		button: 'Knapp',
		select: 'Flervalslista',
		imageButton: 'Bildknapp',
		notSet: '<ej angivet>',
		id: 'Id',
		name: 'Namn',
		langDir: 'Språkriktning',
		langDirLtr: 'Vänster till Höger (VTH)',
		langDirRtl: 'Höger till Vänster (HTV)',
		langCode: 'Språkkod',
		longDescr: 'URL-beskrivning',
		cssClass: 'Stilmall',
		advisoryTitle: 'Titel',
		cssStyle: 'Stilmall',
		ok: 'OK',
		cancel: 'Avbryt',
		close: 'Stäng',
		preview: 'Förhandsgranska',
		resize: 'Dra för att ändra storlek',
		generalTab: 'Allmänt',
		advancedTab: 'Avancerad',
		validateNumberFailed: 'Värdet är inte ett nummer.',
		confirmNewPage: 'Alla ändringar i innehållet kommer att förloras. Är du säker på att du vill ladda en ny sida?',
		confirmCancel: 'Några av de alternativ har ändrats. Är du säker på att stänga dialogrutan?',
		options: 'Alternativ',
		target: 'Mål',
		targetNew: 'Nytt fönster (_blank)',
		targetTop: 'Översta fönstret (_top)',
		targetSelf: 'Samma fönster (_self)',
		targetParent: 'Föregående fönster (_parent)',
		langDirLTR: 'Vänster till höger (LTR)',
		langDirRTL: 'Höger till vänster (RTL)',
		styles: 'Stil',
		cssClasses: 'Stilmallar',
		width: 'Bredd',
		height: 'Höjd',
		align: 'Justering',
		alignLeft: 'Vänster',
		alignRight: 'Höger',
		alignCenter: 'Centrerad',
		alignTop: 'Överkant',
		alignMiddle: 'Mitten',
		alignBottom: 'Nederkant',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'Höjd måste vara ett nummer.',
		invalidWidth: 'Bredd måste vara ett nummer.',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, Ej tillgänglig</span>'
	}
};

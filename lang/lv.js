/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Latvian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'lv' ] = {
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

		browseServer: 'Skatīt servera saturu',
		url: 'URL',
		protocol: 'Protokols',
		upload: 'Augšupielādēt',
		uploadSubmit: 'Nosūtīt serverim',
		image: 'Attēls',
		flash: 'Flash',
		form: 'Forma',
		checkbox: 'Atzīmēšanas kastīte',
		radio: 'Izvēles poga',
		textField: 'Teksta rinda',
		textarea: 'Teksta laukums',
		hiddenField: 'Paslēpta teksta rinda',
		button: 'Poga',
		select: 'Iezīmēšanas lauks',
		imageButton: 'Attēlpoga',
		notSet: '<nav iestatīts>',
		id: 'Id',
		name: 'Nosaukums',
		langDir: 'Valodas lasīšanas virziens',
		langDirLtr: 'No kreisās uz labo (LTR)',
		langDirRtl: 'No labās uz kreiso (RTL)',
		langCode: 'Valodas kods',
		longDescr: 'Gara apraksta Hipersaite',
		cssClass: 'Stilu saraksta klases',
		advisoryTitle: 'Konsultatīvs virsraksts',
		cssStyle: 'Stils',
		ok: 'Darīts!',
		cancel: 'Atcelt',
		close: 'Close', // MISSING
		preview: 'Preview', // MISSING
		resize: 'Resize', // MISSING
		generalTab: 'General', // MISSING
		advancedTab: 'Izvērstais',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING
		options: 'Options', // MISSING
		target: 'Target', // MISSING
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'Left to Right (LTR)', // MISSING
		langDirRTL: 'Right to Left (RTL)', // MISSING
		styles: 'Style', // MISSING
		cssClasses: 'Stylesheet Classes', // MISSING
		width: 'Platums',
		height: 'Augstums',
		align: 'Nolīdzināt',
		alignLeft: 'Pa kreisi',
		alignRight: 'Pa labi',
		alignCenter: 'Centrēti',
		alignTop: 'Augšā',
		alignMiddle: 'Vertikāli centrēts',
		alignBottom: 'Apakšā',
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

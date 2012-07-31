/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Slovak language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'sk' ] = {
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
		editorHelp: 'Stlačte ALT 0 pre nápovedu',

		browseServer: 'Prechádzať server',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Odoslať',
		uploadSubmit: 'Odoslať na server',
		image: 'Obrázok',
		flash: 'Flash',
		form: 'Formulár',
		checkbox: 'Zaškrtávacie políčko',
		radio: 'Prepínač',
		textField: 'Textové pole',
		textarea: 'Textová oblasť',
		hiddenField: 'Skryté pole',
		button: 'Tlačidlo',
		select: 'Rozbaľovací zoznam',
		imageButton: 'Obrázkové tlačidlo',
		notSet: '<nenastavené>',
		id: 'Id',
		name: 'Meno',
		langDir: 'Orientácia jazyka',
		langDirLtr: 'Zľava doprava (LTR)',
		langDirRtl: 'Sprava doľava (RTL)',
		langCode: 'Kód jazyka',
		longDescr: 'Dlhý popis URL',
		cssClass: 'Trieda štýlu',
		advisoryTitle: 'Pomocný titulok',
		cssStyle: 'Štýl',
		ok: 'OK',
		cancel: 'Zrušiť',
		close: 'Zatvorit',
		preview: 'Náhľad',
		resize: 'Resize', // MISSING
		generalTab: 'Hlavné',
		advancedTab: 'Rozšírené',
		validateNumberFailed: 'Hodnota nieje číslo.',
		confirmNewPage: 'Prajete si načítat novú stránku? Všetky neuložené zmeny budú stratené. ',
		confirmCancel: 'Niektore možnosti boli zmenené. Naozaj chcete zavrieť okno?',
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
		width: 'Šírka',
		height: 'Výška',
		align: 'Zarovnanie',
		alignLeft: 'Vľavo',
		alignRight: 'Vpravo',
		alignCenter: 'Na stred',
		alignTop: 'Nahor',
		alignMiddle: 'Na stred',
		alignBottom: 'Dole',
		invalidHeight: 'Výška musí byť číslo.',
		invalidWidth: 'Šírka musí byť číslo.',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	}
};

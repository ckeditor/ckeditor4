/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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
	// ARIA description.
	editor: 'Bogati uređivač teksta',
	editorPanel: 'Rich Text Editor panel', // MISSING

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
		close: 'Zatvori',
		preview: 'Izgled stranice',
		resize: 'Resize', // MISSING
		generalTab: 'Opšte',
		advancedTab: 'Napredni tagovi',
		validateNumberFailed: 'Ova vrednost nije broj.',
		confirmNewPage: 'Nesačuvane promene ovog sadržaja će biti izgubljene. Jeste li sigurni da želita da učitate novu stranu?',
		confirmCancel: 'You have changed some options. Are you sure you want to close the dialog window?', // MISSING
		options: 'Opcije',
		target: 'Meta',
		targetNew: 'Novi prozor (_blank)',
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Isti prozor (_self)',
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'S leva na desno (LTR)',
		langDirRTL: 'S desna na levo (RTL)',
		styles: 'Stil',
		cssClasses: 'Stylesheet klase',
		width: 'Širina',
		height: 'Visina',
		align: 'Ravnanje',
		left: 'Levo',
		right: 'Desno',
		center: 'Sredina',
		justify: 'Obostrano ravnanje',
		alignLeft: 'Levo ravnanje',
		alignRight: 'Desno ravnanje',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Vrh',
		alignMiddle: 'Sredina',
		alignBottom: 'Dole',
		alignNone: 'None', // MISSING
		invalidValue: 'Invalid value.', // MISSING
		invalidHeight: 'Visina mora biti broj.',
		invalidWidth: 'Širina mora biti broj.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>', // MISSING

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace', // MISSING
			13: 'Enter', // MISSING
			16: 'Shift', // MISSING
			17: 'Ctrl', // MISSING
			18: 'Alt', // MISSING
			32: 'Space', // MISSING
			35: 'End', // MISSING
			36: 'Home', // MISSING
			46: 'Delete', // MISSING
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

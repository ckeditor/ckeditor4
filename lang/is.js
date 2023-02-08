/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Icelandic language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'is' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Editor', // MISSING
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Press ALT 0 for help', // MISSING

		browseServer: 'Fletta í skjalasafni',
		url: 'Vefslóð',
		protocol: 'Samskiptastaðall',
		upload: 'Senda upp',
		uploadSubmit: 'Hlaða upp',
		image: 'Setja inn mynd',
		form: 'Setja inn innsláttarform',
		checkbox: 'Setja inn hökunarreit',
		radio: 'Setja inn valhnapp',
		textField: 'Setja inn textareit',
		textarea: 'Setja inn textasvæði',
		hiddenField: 'Setja inn falið svæði',
		button: 'Setja inn hnapp',
		select: 'Setja inn lista',
		imageButton: 'Setja inn myndahnapp',
		notSet: '<ekkert valið>',
		id: 'Auðkenni',
		name: 'Nafn',
		langDir: 'Lesstefna',
		langDirLtr: 'Frá vinstri til hægri (LTR)',
		langDirRtl: 'Frá hægri til vinstri (RTL)',
		langCode: 'Tungumálakóði',
		longDescr: 'Nánari lýsing',
		cssClass: 'Stílsniðsflokkur',
		advisoryTitle: 'Titill',
		cssStyle: 'Stíll',
		ok: 'Í lagi',
		cancel: 'Hætta við',
		close: 'Close', // MISSING
		preview: 'Forskoða',
		resize: 'Resize', // MISSING
		generalTab: 'Almennt',
		advancedTab: 'Tæknilegt',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'You have changed some options. Are you sure you want to close the dialog window?', // MISSING
		options: 'Options', // MISSING
		target: 'Mark',
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'Frá vinstri til hægri (LTR)',
		langDirRTL: 'Frá hægri til vinstri (RTL)',
		styles: 'Stíll',
		cssClasses: 'Stílsniðsflokkur',
		width: 'Breidd',
		height: 'Hæð',
		align: 'Jöfnun',
		left: 'Vinstri',
		right: 'Hægri',
		center: 'Miðjað',
		justify: 'Jafna báðum megin',
		alignLeft: 'Vinstrijöfnun',
		alignRight: 'Hægrijöfnun',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Efst',
		alignMiddle: 'Miðjuð',
		alignBottom: 'Neðst',
		alignNone: 'None', // MISSING
		invalidValue: 'Invalid value.', // MISSING
		invalidHeight: 'Height must be a number.', // MISSING
		invalidWidth: 'Width must be a number.', // MISSING
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

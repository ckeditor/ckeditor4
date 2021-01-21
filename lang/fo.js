/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Faroese language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'fo' ] = {
	// ARIA description.
	editor: 'Rich Text Editor',
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Trýst ALT og 0 fyri vegleiðing',

		browseServer: 'Ambætarakagi',
		url: 'URL',
		protocol: 'Protokoll',
		upload: 'Send til ambætaran',
		uploadSubmit: 'Send til ambætaran',
		image: 'Myndir',
		flash: 'Flash',
		form: 'Formur',
		checkbox: 'Flugubein',
		radio: 'Radioknøttur',
		textField: 'Tekstteigur',
		textarea: 'Tekstumráði',
		hiddenField: 'Fjaldur teigur',
		button: 'Knøttur',
		select: 'Valskrá',
		imageButton: 'Myndaknøttur',
		notSet: '<ikki sett>',
		id: 'Id',
		name: 'Navn',
		langDir: 'Tekstkós',
		langDirLtr: 'Frá vinstru til høgru (LTR)',
		langDirRtl: 'Frá høgru til vinstru (RTL)',
		langCode: 'Málkoda',
		longDescr: 'Víðkað URL frágreiðing',
		cssClass: 'Typografi klassar',
		advisoryTitle: 'Vegleiðandi heiti',
		cssStyle: 'Typografi',
		ok: 'Góðkent',
		cancel: 'Avlýs',
		close: 'Lat aftur',
		preview: 'Frumsýn',
		resize: 'Drag fyri at broyta stødd',
		generalTab: 'Generelt',
		advancedTab: 'Fjølbroytt',
		validateNumberFailed: 'Hetta er ikki eitt tal.',
		confirmNewPage: 'Allar ikki goymdar broytingar í hesum innihaldið hvørva. Skal nýggj síða lesast kortini?',
		confirmCancel: 'Nakrir valmøguleikar eru broyttir. Ert tú vísur í, at dialogurin skal latast aftur?',
		options: 'Options',
		target: 'Target',
		targetNew: 'Nýtt vindeyga (_blank)',
		targetTop: 'Vindeyga ovast (_top)',
		targetSelf: 'Sama vindeyga (_self)',
		targetParent: 'Upphavligt vindeyga (_parent)',
		langDirLTR: 'Frá vinstru til høgru (LTR)',
		langDirRTL: 'Frá høgru til vinstru (RTL)',
		styles: 'Style',
		cssClasses: 'Stylesheet Classes',
		width: 'Breidd',
		height: 'Hædd',
		align: 'Justering',
		left: 'Vinstra',
		right: 'Høgra',
		center: 'Miðsett',
		justify: 'Javnir tekstkantar',
		alignLeft: 'Vinstrasett',
		alignRight: 'Høgrasett',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Ovast',
		alignMiddle: 'Miðja',
		alignBottom: 'Botnur',
		alignNone: 'Eingin',
		invalidValue: 'Invalid value.', // MISSING
		invalidHeight: 'Hædd má vera eitt tal.',
		invalidWidth: 'Breidd má vera eitt tal.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Virðið sett í "%1" feltið má vera eitt positivt tal, við ella uttan gyldugum CSS mátieind (px, %, in, cm, mm, em, ex, pt, ella pc).',
		invalidHtmlLength: 'Virðið sett í "%1" feltiðield má vera eitt positivt tal, við ella uttan gyldugum CSS mátieind (px ella %).',
		invalidInlineStyle: 'Virði specifiserað fyri inline style má hava eitt ella fleiri pør (tuples) skrivað sum "name : value", hvørt parið sundurskilt við semi-colon.',
		cssLengthTooltip: 'Skriva eitt tal fyri eitt virði í pixels ella eitt tal við gyldigum CSS eind (px, %, in, cm, mm, em, ex, pt, ella pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, ikki tøkt</span>',

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

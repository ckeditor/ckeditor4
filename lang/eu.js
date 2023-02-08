/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Testu aberastuaren editorea',
	editorPanel: 'Testu aberastuaren editorearen panela',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Sakatu ALT 0 laguntza jasotzeko',

		browseServer: 'Arakatu zerbitzaria',
		url: 'URLa',
		protocol: 'Protokoloa',
		upload: 'Kargatu',
		uploadSubmit: 'Bidali zerbitzarira',
		image: 'Irudia',
		form: 'Formularioa',
		checkbox: 'Kontrol-laukia',
		radio: 'Aukera-botoia',
		textField: 'Testu-eremua',
		textarea: 'Testu-area',
		hiddenField: 'Ezkutuko eremua',
		button: 'Botoia',
		select: 'Hautespen-eremua',
		imageButton: 'Irudi-botoia',
		notSet: '<ezarri gabe>',
		id: 'Id',
		name: 'Izena',
		langDir: 'Hizkuntzaren norabidea',
		langDirLtr: 'Ezkerretik eskuinera (LTR)',
		langDirRtl: 'Eskuinetik ezkerrera (RTL)',
		langCode: 'Hizkuntzaren kodea',
		longDescr: 'URLaren deskribapen luzea',
		cssClass: 'Estilo-orriko klaseak',
		advisoryTitle: 'Aholkatutako izenburua',
		cssStyle: 'Estiloa',
		ok: 'Ados',
		cancel: 'Utzi',
		close: 'Itxi',
		preview: 'Aurrebista',
		resize: 'Aldatu tamainaz',
		generalTab: 'Orokorra',
		advancedTab: 'Aurreratua',
		validateNumberFailed: 'Balio hau ez da zenbaki bat.',
		confirmNewPage: 'Eduki honetan gorde gabe dauden aldaketak galduko dira. Ziur zaude orri berri bat kargatu nahi duzula?',
		confirmCancel: 'Aukera batzuk aldatu dituzu. Ziur zaude elkarrizketa-koadroa itxi nahi duzula?',
		options: 'Aukerak',
		target: 'Helburua',
		targetNew: 'Leiho berria (_blank)',
		targetTop: 'Goieneko leihoan (_top)',
		targetSelf: 'Leiho berean (_self)',
		targetParent: 'Leiho gurasoan (_parent)',
		langDirLTR: 'Ezkerretik eskuinera (LTR)',
		langDirRTL: 'Eskuinetik ezkerrera (RTL)',
		styles: 'Estiloa',
		cssClasses: 'Estilo-orriko klaseak',
		width: 'Zabalera',
		height: 'Altuera',
		align: 'Lerrokatzea',
		left: 'Ezkerrean',
		right: 'Eskuinean',
		center: 'Erdian',
		justify: 'Justifikatu',
		alignLeft: 'Lerrokatu ezkerrean',
		alignRight: 'Lerrokatu eskuinean',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Goian',
		alignMiddle: 'Erdian',
		alignBottom: 'Behean',
		alignNone: 'Bat ere ez',
		invalidValue: 'Balio desegokia.',
		invalidHeight: 'Altuera zenbaki bat izan behar da.',
		invalidWidth: 'Zabalera zenbaki bat izan behar da.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: '"%1" eremurako zehaztutako balioak zenbaki positibo bat izan behar du, CSS neurri unitate batekin edo gabe (px, %, in, cm, mm, em, ex, pt edo pc).',
		invalidHtmlLength: '"%1" eremurako zehaztutako balioak zenbaki positibo bat izan behar du, HTML neurri unitate batekin edo gabe (px edo %).',
		invalidInlineStyle: 'Lineako estiloan zehaztutako balioak "izen : balio" formatuko tupla bat edo gehiago izan behar dira, komaz bereiztuak.',
		cssLengthTooltip: 'Sartu zenbaki bat edo zenbaki bat baliozko CSS unitate batekin (px, %, in, cm, mm, em, ex, pt, edo pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, erabilezina</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Atzera tekla',
			13: 'Sartu',
			16: 'Maius',
			17: 'Ktrl',
			18: 'Alt',
			32: 'Zuriunea',
			35: 'Buka',
			36: 'Etxea',
			46: 'Ezabatu',
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
			224: 'Komandoa'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Laster-tekla',

		optionDefault: 'Lehenetsia'
	}
};

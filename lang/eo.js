/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Esperanto language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'eo' ] = {
	// ARIA description.
	editor: 'RiĉTeksta Redaktilo',
	editorPanel: 'Panelo de la RiĉTeksta Redaktilo',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Premu ALT 0 por helpilo',

		browseServer: 'Foliumi en la Servilo',
		url: 'URL',
		protocol: 'Protokolo',
		upload: 'Alŝuti',
		uploadSubmit: 'Sendu al Servilo',
		image: 'Bildo',
		flash: 'Flaŝo',
		form: 'Formularo',
		checkbox: 'Markobutono',
		radio: 'Radiobutono',
		textField: 'Teksta kampo',
		textarea: 'Teksta Areo',
		hiddenField: 'Kaŝita Kampo',
		button: 'Butono',
		select: 'Elekta Kampo',
		imageButton: 'Bildbutono',
		notSet: '<Defaŭlta>',
		id: 'Id',
		name: 'Nomo',
		langDir: 'Skribdirekto',
		langDirLtr: 'De maldekstro dekstren (LTR)',
		langDirRtl: 'De dekstro maldekstren (RTL)',
		langCode: 'Lingva Kodo',
		longDescr: 'URL de Longa Priskribo',
		cssClass: 'Klasoj de Stilfolioj',
		advisoryTitle: 'Priskriba Titolo',
		cssStyle: 'Stilo',
		ok: 'Akcepti',
		cancel: 'Rezigni',
		close: 'Fermi',
		preview: 'Vidigi Aspekton',
		resize: 'Movigi por ŝanĝi la grandon',
		generalTab: 'Ĝenerala',
		advancedTab: 'Speciala',
		validateNumberFailed: 'Tiu valoro ne estas nombro.',
		confirmNewPage: 'La neregistritaj ŝanĝoj estas perdotaj. Ĉu vi certas, ke vi volas ŝargi novan paĝon?',
		confirmCancel: 'Iuj opcioj esta ŝanĝitaj. Ĉu vi certas, ke vi volas fermi la dialogon?',
		options: 'Opcioj',
		target: 'Celo',
		targetNew: 'Nova Fenestro (_blank)',
		targetTop: 'Supra Fenestro (_top)',
		targetSelf: 'Sama Fenestro (_self)',
		targetParent: 'Patra Fenestro (_parent)',
		langDirLTR: 'De maldekstro dekstren (LTR)',
		langDirRTL: 'De dekstro maldekstren (RTL)',
		styles: 'Stilo',
		cssClasses: 'Stilfoliaj Klasoj',
		width: 'Larĝo',
		height: 'Alto',
		align: 'Ĝisrandigo',
		left: 'Maldekstre',
		right: 'Dekstre',
		center: 'Centre',
		justify: 'Ĝisrandigi Ambaŭflanke',
		alignLeft: 'Ĝisrandigi maldekstren',
		alignRight: 'Ĝisrandigi dekstren',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Supre',
		alignMiddle: 'Centre',
		alignBottom: 'Malsupre',
		alignNone: 'Neniu',
		invalidValue: 'Nevalida Valoro',
		invalidHeight: 'Alto devas esti nombro.',
		invalidWidth: 'Larĝo devas esti nombro.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'La valoro indikita por la "%1" kampo devas esti pozitiva nombro kun aŭ sen valida CSSmezurunuo (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'La valoro indikita por la "%1" kampo devas esti pozitiva nombro kun aŭ sen valida HTMLmezurunuo (px or %).',
		invalidInlineStyle: 'La valoro indikita por la enlinia stilo devas konsisti el unu aŭ pluraj elementoj kun la formato de "nomo : valoro", apartigitaj per punktokomoj.',
		cssLengthTooltip: 'Entajpu nombron por rastrumera valoro aŭ nombron kun valida CSSunuo (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nehavebla</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Retropaŝo',
			13: 'Enigi',
			16: 'Registrumo',
			17: 'Stirklavo',
			18: 'Alt-klavo',
			32: 'Spaco',
			35: 'Fino',
			36: 'Hejmo',
			46: 'Forigi',
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
			224: 'Komando'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Fulmoklavo',

		optionDefault: 'Defaŭlta'
	}
};

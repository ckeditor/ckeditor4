/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Estonian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'et' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Rikkalik tekstiredaktor',
	editorPanel: 'Rikkaliku tekstiredaktori paneel',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Abi saamiseks vajuta ALT 0',

		browseServer: 'Serveri sirvimine',
		url: 'URL',
		protocol: 'Protokoll',
		upload: 'Laadi üles',
		uploadSubmit: 'Saada serverisse',
		image: 'Pilt',
		form: 'Vorm',
		checkbox: 'Märkeruut',
		radio: 'Raadionupp',
		textField: 'Tekstilahter',
		textarea: 'Tekstiala',
		hiddenField: 'Varjatud lahter',
		button: 'Nupp',
		select: 'Valiklahter',
		imageButton: 'Piltnupp',
		notSet: '<määramata>',
		id: 'ID',
		name: 'Nimi',
		langDir: 'Keele suund',
		langDirLtr: 'Vasakult paremale (LTR)',
		langDirRtl: 'Paremalt vasakule (RTL)',
		langCode: 'Keele kood',
		longDescr: 'Pikk kirjeldus URL',
		cssClass: 'Stiilistiku klassid',
		advisoryTitle: 'Soovituslik pealkiri',
		cssStyle: 'Laad',
		ok: 'Olgu',
		cancel: 'Loobu',
		close: 'Sulge',
		preview: 'Eelvaade',
		resize: 'Suuruse muutmiseks lohista',
		generalTab: 'Üldine',
		advancedTab: 'Täpsemalt',
		validateNumberFailed: 'See väärtus pole number.',
		confirmNewPage: 'Kõik salvestamata muudatused lähevad kaotsi. Kas oled kindel, et tahad laadida uue lehe?',
		confirmCancel: 'Mõned valikud on muudetud. Kas oled kindel, et tahad dialoogi sulgeda?',
		options: 'Valikud',
		target: 'Sihtkoht',
		targetNew: 'Uus aken (_blank)',
		targetTop: 'Kõige ülemine aken (_top)',
		targetSelf: 'Sama aken (_self)',
		targetParent: 'Vanemaken (_parent)',
		langDirLTR: 'Vasakult paremale (LTR)',
		langDirRTL: 'Paremalt vasakule (RTL)',
		styles: 'Stiili',
		cssClasses: 'Stiililehe klassid',
		width: 'Laius',
		height: 'Kõrgus',
		align: 'Joondus',
		left: 'Vasak',
		right: 'Paremale',
		center: 'Kesk',
		justify: 'Rööpjoondus',
		alignLeft: 'Vasakjoondus',
		alignRight: 'Paremjoondus',
		alignCenter: 'Keskjoondus',
		alignTop: 'Üles',
		alignMiddle: 'Keskele',
		alignBottom: 'Alla',
		alignNone: 'Pole',
		invalidValue: 'Vigane väärtus.',
		invalidHeight: 'Kõrgus peab olema number.',
		invalidWidth: 'Laius peab olema number.',
		invalidLength: 'Välja "%1" väärtus peab olema positiivne arv korrektse ühikuga (%2) või ilma.',
		invalidCssLength: '"%1" välja jaoks määratud väärtus peab olema positiivne täisarv CSS ühikuga (px, %, in, cm, mm, em, ex, pt või pc) või ilma.',
		invalidHtmlLength: '"%1" välja jaoks määratud väärtus peab olema positiivne täisarv HTML ühikuga (px või %) või ilma.',
		invalidInlineStyle: 'Reasisese stiili määrangud peavad koosnema paarisväärtustest (tuples), mis on semikoolonitega eraldatult järgnevas vormingus: "nimi : väärtus".',
		cssLengthTooltip: 'Sisesta väärtus pikslites või number koos sobiva CSS-i ühikuga (px, %, in, cm, mm, em, ex, pt või pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, pole saadaval</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Tühik',
			35: 'End',
			36: 'Home',
			46: 'Kustuta',
			112: 'F1',
			113: 'F2',
			114: 'F3',
			115: 'F4',
			116: 'F5',
			117: 'F6',
			118: 'F7',
			119: 'F8',
			120: 'F9',
			121: 'F10',
			122: 'F11',
			123: 'F12',
			124: 'F13',
			125: 'F14',
			126: 'F15',
			127: 'F16',
			128: 'F17',
			129: 'F18',
			130: 'F19',
			131: 'F20',
			132: 'F21',
			133: 'F22',
			134: 'F23',
			135: 'F24',
			224: 'Command'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Kiirklahv',

		optionDefault: 'Vaikeväärtus'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};

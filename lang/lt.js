/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object for the
 * Lithuanian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'lt' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Pilnas redaktorius',
	editorPanel: 'Pilno redagtoriaus skydelis',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Spauskite ALT 0 dėl pagalbos',

		browseServer: 'Naršyti po serverį',
		url: 'URL',
		protocol: 'Protokolas',
		upload: 'Siųsti',
		uploadSubmit: 'Siųsti į serverį',
		image: 'Vaizdas',
		form: 'Forma',
		checkbox: 'Žymimasis langelis',
		radio: 'Žymimoji akutė',
		textField: 'Teksto laukas',
		textarea: 'Teksto sritis',
		hiddenField: 'Nerodomas laukas',
		button: 'Mygtukas',
		select: 'Atrankos laukas',
		imageButton: 'Vaizdinis mygtukas',
		notSet: '<nėra nustatyta>',
		id: 'Id',
		name: 'Vardas',
		langDir: 'Teksto kryptis',
		langDirLtr: 'Iš kairės į dešinę (LTR)',
		langDirRtl: 'Iš dešinės į kairę (RTL)',
		langCode: 'Kalbos kodas',
		longDescr: 'Ilgas aprašymas URL',
		cssClass: 'Stilių lentelės klasės',
		advisoryTitle: 'Konsultacinė antraštė',
		cssStyle: 'Stilius',
		ok: 'OK',
		cancel: 'Nutraukti',
		close: 'Uždaryti',
		preview: 'Peržiūrėti',
		resize: 'Pavilkite, kad pakeistumėte dydį',
		generalTab: 'Bendros savybės',
		advancedTab: 'Papildomas',
		validateNumberFailed: 'Ši reikšmė nėra skaičius.',
		confirmNewPage: 'Visas neišsaugotas turinys bus prarastas. Ar tikrai norite įkrauti naują puslapį?',
		confirmCancel: 'Kai kurie parametrai pasikeitė. Ar tikrai norite užverti langą?',
		options: 'Parametrai',
		target: 'Tikslinė nuoroda',
		targetNew: 'Naujas langas (_blank)',
		targetTop: 'Viršutinis langas (_top)',
		targetSelf: 'Esamas langas (_self)',
		targetParent: 'Paskutinis langas (_parent)',
		langDirLTR: 'Iš kairės į dešinę (LTR)',
		langDirRTL: 'Iš dešinės į kairę (RTL)',
		styles: 'Stilius',
		cssClasses: 'Stilių klasės',
		width: 'Plotis',
		height: 'Aukštis',
		align: 'Lygiuoti',
		left: 'Kairę',
		right: 'Dešinę',
		center: 'Centrą',
		justify: 'Lygiuoti abi puses',
		alignLeft: 'Lygiuoti kairę',
		alignRight: 'Lygiuoti dešinę',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Viršūnę',
		alignMiddle: 'Vidurį',
		alignBottom: 'Apačią',
		alignNone: 'Niekas',
		invalidValue: 'Neteisinga reikšmė.',
		invalidHeight: 'Aukštis turi būti nurodytas skaičiais.',
		invalidWidth: 'Plotis turi būti nurodytas skaičiais.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Reikšmė nurodyta "%1" laukui, turi būti teigiamas skaičius su arba be tinkamo CSS matavimo vieneto (px, %, in, cm, mm, em, ex, pt arba pc).',
		invalidHtmlLength: 'Reikšmė nurodyta "%1" laukui, turi būti teigiamas skaičius su arba be tinkamo HTML matavimo vieneto (px arba %).',
		invalidInlineStyle: 'Reikšmė nurodyta vidiniame stiliuje turi būti sudaryta iš vieno šių reikšmių "vardas : reikšmė", atskirta kabliataškiais.',
		cssLengthTooltip: 'Įveskite reikšmę pikseliais arba skaičiais su tinkamu CSS vienetu (px, %, in, cm, mm, em, ex, pt arba pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, netinkamas</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Tarpas',
			35: 'End',
			36: 'Home',
			46: 'Delete',
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
		keyboardShortcut: 'Spartusis klavišas',

		optionDefault: 'Numatytasis'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};

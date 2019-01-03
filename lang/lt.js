/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
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
		flash: 'Flash',
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

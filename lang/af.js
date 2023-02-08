/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Afrikaans language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'af' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Woordverwerker',
	editorPanel: 'Woordverwerkerpaneel',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Druk op ALT 0 vir hulp',

		browseServer: 'Blaai op bediener',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Oplaai',
		uploadSubmit: 'Stuur aan die bediener',
		image: 'Beeld',
		form: 'Vorm',
		checkbox: 'Merkhokkie',
		radio: 'Radioknoppie',
		textField: 'Teksveld',
		textarea: 'Teksarea',
		hiddenField: 'Versteekteveld',
		button: 'Knop',
		select: 'Keuseveld',
		imageButton: 'Beeldknop',
		notSet: '<geen instelling>',
		id: 'Id',
		name: 'Naam',
		langDir: 'Skryfrigting',
		langDirLtr: 'Links na regs (LTR)',
		langDirRtl: 'Regs na links (RTL)',
		langCode: 'Taalkode',
		longDescr: 'Lang beskrywing URL',
		cssClass: 'CSS klasse',
		advisoryTitle: 'Aanbevole titel',
		cssStyle: 'Styl',
		ok: 'OK',
		cancel: 'Kanselleer',
		close: 'Sluit',
		preview: 'Voorbeeld',
		resize: 'Skalierung',
		generalTab: 'Algemeen',
		advancedTab: 'Gevorderd',
		validateNumberFailed: 'Hierdie waarde is nie \'n nommer nie.',
		confirmNewPage: 'Alle wysiginge sal verlore gaan. Is jy seker dat jy \'n nuwe bladsy wil laai?',
		confirmCancel: 'Sommige opsies is gewysig. Is jy seker dat jy hierdie dialoogvenster wil sluit?',
		options: 'Opsies',
		target: 'Teiken',
		targetNew: 'Nuwe venster (_blank)',
		targetTop: 'Boonste venster (_top)',
		targetSelf: 'Selfde venster (_self)',
		targetParent: 'Oorspronklike venster (_parent)',
		langDirLTR: 'Links na Regs (LTR)',
		langDirRTL: 'Regs na Links (RTL)',
		styles: 'Styl',
		cssClasses: 'CSS klasse',
		width: 'Breedte',
		height: 'Hoogte',
		align: 'Orienteerung',
		left: 'Links',
		right: 'Regs',
		center: 'Middel',
		justify: 'Eweredig',
		alignLeft: 'Links oplyn',
		alignRight: 'Regs oplyn',
		alignCenter: 'Middel oplyn',
		alignTop: 'Bo',
		alignMiddle: 'Middel',
		alignBottom: 'Onder',
		alignNone: 'Geen',
		invalidValue: 'Ongeldige waarde',
		invalidHeight: 'Hoogte moet \'n getal wees',
		invalidWidth: 'Breedte moet \'n getal wees.',
		invalidLength: 'Die waarde vir die veld "%1" moet \'n  posetiewe nommer wees met of sonder die meeteenheid (%2).',
		invalidCssLength: 'Die waarde vir die "%1" veld moet \'n posetiewe getal wees met of sonder \'n geldige CSS eenheid (px, %, in, cm, mm, em, ex, pt, of pc).',
		invalidHtmlLength: 'Die waarde vir die  "%1" veld moet \'n posetiewe getal wees met of sonder \'n geldige HTML eenheid (px of %).',
		invalidInlineStyle: 'Ongeldige CSS. Formaat is een of meer sleutel-wert paare, "naam : wert" met kommapunte gesky.',
		cssLengthTooltip: 'Voeg \'n getal wert in pixel in, of \'n waarde met geldige CSS eenheid (px, %, in, cm, mm, em, ex, pt, of pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nie beskikbaar nie</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Skuif',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Spasie',
			35: 'Einde',
			36: 'Tuis',
			46: 'Verwyder',
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
			224: 'Bevel'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Sleutel kombenasie',

		optionDefault: 'Verstek'
	}
};

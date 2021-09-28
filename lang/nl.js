/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object for the
 * Dutch language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'nl' ] = {
	// ARIA description.
	editor: 'Tekstverwerker',
	editorPanel: 'Tekstverwerker beheerpaneel',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Druk ALT 0 voor hulp',

		browseServer: 'Bladeren op server',
		url: 'URL',
		protocol: 'Protocol',
		upload: 'Upload',
		uploadSubmit: 'Naar server verzenden',
		image: 'Afbeelding',
		form: 'Formulier',
		checkbox: 'Selectievinkje',
		radio: 'Keuzerondje',
		textField: 'Tekstveld',
		textarea: 'Tekstvak',
		hiddenField: 'Verborgen veld',
		button: 'Knop',
		select: 'Selectieveld',
		imageButton: 'Afbeeldingsknop',
		notSet: '<niet ingevuld>',
		id: 'Id',
		name: 'Naam',
		langDir: 'Schrijfrichting',
		langDirLtr: 'Links naar rechts (LTR)',
		langDirRtl: 'Rechts naar links (RTL)',
		langCode: 'Taalcode',
		longDescr: 'Lange URL-omschrijving',
		cssClass: 'Stylesheet-klassen',
		advisoryTitle: 'Adviserende titel',
		cssStyle: 'Stijl',
		ok: 'OK',
		cancel: 'Annuleren',
		close: 'Sluiten',
		preview: 'Voorbeeld',
		resize: 'Sleep om te herschalen',
		generalTab: 'Algemeen',
		advancedTab: 'Geavanceerd',
		validateNumberFailed: 'Deze waarde is geen geldig getal.',
		confirmNewPage: 'Alle aangebrachte wijzigingen gaan verloren. Weet u zeker dat u een nieuwe pagina wilt openen?',
		confirmCancel: 'Enkele opties zijn gewijzigd. Weet u zeker dat u dit dialoogvenster wilt sluiten?',
		options: 'Opties',
		target: 'Doelvenster',
		targetNew: 'Nieuw venster (_blank)',
		targetTop: 'Hele venster (_top)',
		targetSelf: 'Zelfde venster (_self)',
		targetParent: 'Origineel venster (_parent)',
		langDirLTR: 'Links naar rechts (LTR)',
		langDirRTL: 'Rechts naar links (RTL)',
		styles: 'Stijl',
		cssClasses: 'Stylesheet-klassen',
		width: 'Breedte',
		height: 'Hoogte',
		align: 'Uitlijning',
		left: 'Links',
		right: 'Rechts',
		center: 'Centreren',
		justify: 'Uitvullen',
		alignLeft: 'Links uitlijnen',
		alignRight: 'Rechts uitlijnen',
		alignCenter: 'Centreren',
		alignTop: 'Boven',
		alignMiddle: 'Midden',
		alignBottom: 'Onder',
		alignNone: 'Geen',
		invalidValue: 'Ongeldige waarde.',
		invalidHeight: 'De hoogte moet een getal zijn.',
		invalidWidth: 'De breedte moet een getal zijn.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Waarde in veld "%1" moet een positief nummer zijn, met of zonder een geldige CSS meeteenheid (px, %, in, cm, mm, em, ex, pt of pc).',
		invalidHtmlLength: 'Waarde in veld "%1" moet een positief nummer zijn, met of zonder een geldige HTML meeteenheid (px of %).',
		invalidInlineStyle: 'Waarde voor de online stijl moet bestaan uit een of meerdere tupels met het formaat "naam : waarde", gescheiden door puntkomma\'s.',
		cssLengthTooltip: 'Geef een nummer in voor een waarde in pixels of geef een nummer in met een geldige CSS eenheid (px, %, in, cm, mm, em, ex, pt, of pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, niet beschikbaar</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Spatie',
			35: 'End',
			36: 'Home',
			46: 'Verwijderen',
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
		keyboardShortcut: 'Sneltoets',

		optionDefault: 'Standaard'
	}
};

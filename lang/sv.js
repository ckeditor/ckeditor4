/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Swedish language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'sv' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Rich Text-editor',
	editorPanel: 'Panel till Rich Text-editor',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Tryck ALT 0 för hjälp',

		browseServer: 'Bläddra på server',
		url: 'URL',
		protocol: 'Protokoll',
		upload: 'Ladda upp',
		uploadSubmit: 'Skicka till server',
		image: 'Bild',
		form: 'Formulär',
		checkbox: 'Kryssruta',
		radio: 'Alternativknapp',
		textField: 'Textfält',
		textarea: 'Textruta',
		hiddenField: 'Dolt fält',
		button: 'Knapp',
		select: 'Flervalslista',
		imageButton: 'Bildknapp',
		notSet: '<ej angivet>',
		id: 'Id',
		name: 'Namn',
		langDir: 'Språkriktning',
		langDirLtr: 'Vänster till Höger (VTH)',
		langDirRtl: 'Höger till Vänster (HTV)',
		langCode: 'Språkkod',
		longDescr: 'URL-beskrivning',
		cssClass: 'Stilmall',
		advisoryTitle: 'Titel',
		cssStyle: 'Stilmall',
		ok: 'OK',
		cancel: 'Avbryt',
		close: 'Stäng',
		preview: 'Förhandsgranska',
		resize: 'Dra för att ändra storlek',
		generalTab: 'Allmänt',
		advancedTab: 'Avancerad',
		validateNumberFailed: 'Värdet är inte ett nummer.',
		confirmNewPage: 'Alla ändringar i innehållet kommer att förloras. Är du säker på att du vill ladda en ny sida?',
		confirmCancel: 'Några av alternativen har ändrats. Är du säker på att du vill stänga dialogrutan?',
		options: 'Alternativ',
		target: 'Mål',
		targetNew: 'Nytt fönster (_blank)',
		targetTop: 'Översta fönstret (_top)',
		targetSelf: 'Samma fönster (_self)',
		targetParent: 'Föregående fönster (_parent)',
		langDirLTR: 'Vänster till höger (LTR)',
		langDirRTL: 'Höger till vänster (RTL)',
		styles: 'Stil',
		cssClasses: 'Stilmallar',
		width: 'Bredd',
		height: 'Höjd',
		align: 'Justering',
		left: 'Vänster',
		right: 'Höger',
		center: 'Centrerad',
		justify: 'Justera till marginaler',
		alignLeft: 'Vänsterjustera',
		alignRight: 'Högerjustera',
		alignCenter: 'Centrera',
		alignTop: 'Överkant',
		alignMiddle: 'Mitten',
		alignBottom: 'Nederkant',
		alignNone: 'Ingen',
		invalidValue: 'Felaktigt värde.',
		invalidHeight: 'Höjd måste vara ett nummer.',
		invalidWidth: 'Bredd måste vara ett nummer.',
		invalidLength: 'Värdet för fältet "%1" måste vara ett positivt nummer med eller utan en giltig mätenhet (%2).',
		invalidCssLength: 'Värdet för fältet "%1" måste vara ett positivt nummer med eller utan CSS-mätenheter (px, %, in, cm, mm, em, ex, pt, eller pc).',
		invalidHtmlLength: 'Värdet för fältet "%1" måste vara ett positivt nummer med eller utan godkända HTML-mätenheter (px eller %).',
		invalidInlineStyle: 'Det angivna värdet för style måste innehålla en eller flera tupler separerade med semikolon i följande format: "name : value"',
		cssLengthTooltip: 'Ange ett nummer i pixlar eller ett nummer men godkänd CSS-mätenhet (px, %, in, cm, mm, em, ex, pt, eller pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, Ej tillgänglig</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backsteg',
			13: 'Retur',
			16: 'Skift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Mellanslag',
			35: 'Slut',
			36: 'Hem',
			46: 'Radera',
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
			224: 'Kommando'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Kortkommando',

		optionDefault: 'Standard'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};

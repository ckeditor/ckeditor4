/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Norwegian Bokmål language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'nb' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Rikteksteditor',
	editorPanel: 'Panel for rikteksteditor',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Trykk ALT 0 for hjelp',

		browseServer: 'Bla gjennom tjener',
		url: 'URL',
		protocol: 'Protokoll',
		upload: 'Last opp',
		uploadSubmit: 'Send det til serveren',
		image: 'Bilde',
		form: 'Skjema',
		checkbox: 'Avmerkingsboks',
		radio: 'Alternativknapp',
		textField: 'Tekstboks',
		textarea: 'Tekstområde',
		hiddenField: 'Skjult felt',
		button: 'Knapp',
		select: 'Rullegardinliste',
		imageButton: 'Bildeknapp',
		notSet: '<ikke satt>',
		id: 'Id',
		name: 'Navn',
		langDir: 'Språkretning',
		langDirLtr: 'Venstre til høyre (LTR)',
		langDirRtl: 'Høyre til venstre (RTL)',
		langCode: 'Språkkode',
		longDescr: 'Utvidet beskrivelse',
		cssClass: 'Stilarkklasser',
		advisoryTitle: 'Tittel',
		cssStyle: 'Stil',
		ok: 'OK',
		cancel: 'Avbryt',
		close: 'Lukk',
		preview: 'Forhåndsvis',
		resize: 'Dra for å skalere',
		generalTab: 'Generelt',
		advancedTab: 'Avansert',
		validateNumberFailed: 'Denne verdien er ikke et tall.',
		confirmNewPage: 'Alle ulagrede endringer som er gjort i dette innholdet vil gå tapt. Er du sikker på at du vil laste en ny side?',
		confirmCancel: 'Du har endret noen alternativer. Er du sikker på at du vil lukke dialogvinduet?',
		options: 'Valg',
		target: 'Mål',
		targetNew: 'Nytt vindu (_blank)',
		targetTop: 'Hele vinduet (_top)',
		targetSelf: 'Samme vindu (_self)',
		targetParent: 'Foreldrevindu (_parent)',
		langDirLTR: 'Venstre til høyre (VTH)',
		langDirRTL: 'Høyre til venstre (HTV)',
		styles: 'Stil',
		cssClasses: 'Stilarkklasser',
		width: 'Bredde',
		height: 'Høyde',
		align: 'Juster',
		left: 'Venstre',
		right: 'Høyre',
		center: 'Midtstill',
		justify: 'Blokkjuster',
		alignLeft: 'Venstrejuster',
		alignRight: 'Høyrejuster',
		alignCenter: 'Midtstill',
		alignTop: 'Topp',
		alignMiddle: 'Midten',
		alignBottom: 'Bunn',
		alignNone: 'Ingen',
		invalidValue: 'Ugyldig verdi.',
		invalidHeight: 'Høyde må være et tall.',
		invalidWidth: 'Bredde må være et tall.',
		invalidLength: 'Den angitte verdien for feltet "%1" må være et positivt tall med eller uten en gyldig måleenhet (%2).',
		invalidCssLength: 'Den angitte verdien for feltet "%1" må være et positivt tall med eller uten en gyldig CSS-målingsenhet (px, %, in, cm, mm, em, ex, pt, eller pc).',
		invalidHtmlLength: 'Den angitte verdien for feltet "%1" må være et positivt tall med eller uten en gyldig HTML-målingsenhet (px eller %).',
		invalidInlineStyle: 'Verdi angitt for inline stil må bestå av en eller flere sett med formatet "navn : verdi", separert med semikolon',
		cssLengthTooltip: 'Skriv inn et tall for en piksel-verdi eller et tall med en gyldig CSS-enhet (px, %, in, cm, mm, em, ex, pt, eller pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, utilgjenglig</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Mellomrom',
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
		keyboardShortcut: 'Tastatursnarvei',

		optionDefault: 'Standard'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};

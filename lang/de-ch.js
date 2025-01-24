/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
* @fileOverview
*/

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'de-ch' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'WYSIWYG-Editor',
	editorPanel: 'WYSIWYG-Editor-Leiste',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Drücken Sie ALT 0 für Hilfe',

		browseServer: 'Server durchsuchen',
		url: 'URL',
		protocol: 'Protokoll',
		upload: 'Hochladen',
		uploadSubmit: 'Zum Server senden',
		image: 'Bild',
		form: 'Formular',
		checkbox: 'Kontrollbox',
		radio: 'Optionsfeld',
		textField: 'Textfeld',
		textarea: 'Textfeld',
		hiddenField: 'Verstecktes Feld',
		button: 'Schaltfläche',
		select: 'Auswahlfeld',
		imageButton: 'Bildschaltfläche',
		notSet: '<nicht festgelegt>',
		id: 'Kennung',
		name: 'Name',
		langDir: 'Schreibrichtung',
		langDirLtr: 'Links nach Rechts (LTR)',
		langDirRtl: 'Rechts nach Links (RTL)',
		langCode: 'Sprachcode',
		longDescr: 'Langbeschreibungs-URL',
		cssClass: 'Formatvorlagenklassen',
		advisoryTitle: 'Titel Beschreibung',
		cssStyle: 'Stil',
		ok: 'OK',
		cancel: 'Abbrechen',
		close: 'Schliessen',
		preview: 'Vorschau',
		resize: 'Grösse ändern',
		generalTab: 'Allgemein',
		advancedTab: 'Erweitert',
		validateNumberFailed: 'Dieser Wert ist keine Nummer.',
		confirmNewPage: 'Alle nicht gespeicherten Änderungen gehen verloren. Sind Sie sicher, die neue Seite zu laden?',
		confirmCancel: 'Einige Optionen wurden geändert. Wollen Sie den Dialog dennoch schliessen?',
		options: 'Optionen',
		target: 'Zielseite',
		targetNew: 'Neues Fenster (_blank)',
		targetTop: 'Oberstes Fenster (_top)',
		targetSelf: 'Gleiches Fenster (_self)',
		targetParent: 'Oberes Fenster (_parent)',
		langDirLTR: 'Links nach Rechts (LNR)',
		langDirRTL: 'Rechts nach Links (RNL)',
		styles: 'Style',
		cssClasses: 'Stylesheet Klasse',
		width: 'Breite',
		height: 'Höhe',
		align: 'Ausrichtung',
		left: 'Links',
		right: 'Rechts',
		center: 'Zentriert',
		justify: 'Blocksatz',
		alignLeft: 'Linksbündig',
		alignRight: 'Rechtsbündig',
		alignCenter: 'Zentriert',
		alignTop: 'Oben',
		alignMiddle: 'Mitte',
		alignBottom: 'Unten',
		alignNone: 'Keine',
		invalidValue: 'Ungültiger Wert.',
		invalidHeight: 'Höhe muss eine Zahl sein.',
		invalidWidth: 'Breite muss eine Zahl sein.',
		invalidLength: 'Wert spezifiziert für "%1" Feld muss ein positiver numerischer Wert sein mit oder ohne korrekter HTML-Masseinheit (px oder %).',
		invalidCssLength: 'Wert spezifiziert für "%1" Feld muss ein positiver numerischer Wert sein mit oder ohne korrekter CSS-Masseinheit (px, %, in, cm, mm, em, ex, pt oder pc).',
		invalidHtmlLength: 'Wert spezifiziert für "%1" Feld muss ein positiver numerischer Wert sein mit oder ohne korrekter HTML-Masseinheit (px oder %).',
		invalidInlineStyle: 'Wert spezifiziert für inline Stilart muss enthalten ein oder mehr Wertepaare mit dem Format "Name : Wert" getrennt durch Semikolons.',
		cssLengthTooltip: 'Geben Sie eine Zahl ein für ein Wert in Pixel oder eine Zahl mit einer korrekten CSS-Masseinheit (px, %, in, cm, mm, em, ex, pt oder pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nicht verfügbar</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Rücktaste',
			13: 'Eingabe',
			16: 'Umschalt',
			17: 'Strg',
			18: 'Alt',
			32: 'Leertaste',
			35: 'Ende',
			36: 'Pos1',
			46: 'Entfernen',
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
			224: 'Befehl'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Tastaturkürzel',

		optionDefault: 'Standard'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};

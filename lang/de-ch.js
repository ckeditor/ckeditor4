/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
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
		flash: 'Flash',
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
		confirmNewPage: 'Alle nicht gespeicherten Änderungen gehen verlohren. Sind Sie sicher die neue Seite zu laden?',
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
		alignLeft: 'Links',
		alignRight: 'Rechts',
		alignCenter: 'Zentriert',
		alignJustify: 'Blocksatz',
		alignTop: 'Oben',
		alignMiddle: 'Mitte',
		alignBottom: 'Unten',
		alignNone: 'Keine',
		invalidValue: 'Ungültiger Wert.',
		invalidHeight: 'Höhe muss eine Zahl sein.',
		invalidWidth: 'Breite muss eine Zahl sein.',
		invalidCssLength: 'Wert spezifiziert für "%1" Feld muss ein positiver numerischer Wert sein mit oder ohne korrekte CSS Messeinheit (px, %, in, cm, mm, em, ex, pt oder pc).',
		invalidHtmlLength: 'Wert spezifiziert für "%1" Feld muss ein positiver numerischer Wert sein mit oder ohne korrekte HTML Messeinheit (px oder %).',
		invalidInlineStyle: 'Wert spezifiziert für inline Stilart muss enthalten ein oder mehr Tupels mit dem Format "Name : Wert" getrennt mit Semikolons.',
		cssLengthTooltip: 'Gebe eine Zahl ein für ein Wert in pixels oder eine Zahl mit einer korrekten CSS Messeinheit (px, %, in, cm, mm, em, ex, pt oder pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nicht verfügbar</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Rücktaste',
			13: 'Eingabe',
			16: 'Umschalt',
			17: 'Strg',
			18: 'Alt',
			32: 'Space', // MISSING
			35: 'Ende',
			36: 'Pos1',
			46: 'Entfernen',
			224: 'Command' // MISSING
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Keyboard shortcut' // MISSING
	}
};

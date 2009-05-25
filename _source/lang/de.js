/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * German language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'de' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	/*
	 * Screenreader titles. Please note that screenreaders are not always capable
	 * of reading non-English words. So be careful while translating it.
	 */
	editorTitle: 'Rich text editor, %1', // MISSING

	// Toolbar buttons without dialogs.
	source: 'Quellcode',
	newPage: 'Neue Seite',
	save: 'Speichern',
	preview: 'Vorschau',
	cut: 'Ausschneiden',
	copy: 'Kopieren',
	paste: 'Einfügen',
	print: 'Drucken',
	underline: 'Unterstrichen',
	bold: 'Fett',
	italic: 'Kursiv',
	selectAll: 'Alles auswählen',
	removeFormat: 'Formatierungen entfernen',
	strike: 'Durchgestrichen',
	subscript: 'Tiefgestellt',
	superscript: 'Hochgestellt',
	horizontalrule: 'Horizontale Linie einfügen',
	pagebreak: 'Seitenumbruch einfügen',
	unlink: 'Link entfernen',
	undo: 'Rückgängig',
	redo: 'Wiederherstellen',

	// Common messages and labels.
	common: {
		browseServer: 'Server durchsuchen',
		url: 'Bildauswahl',
		protocol: 'Protokoll',
		upload: 'Upload',
		uploadSubmit: 'Zum Server senden',
		image: 'Bild',
		flash: 'Flash',
		form: 'Formular',
		checkbox: 'Checkbox',
		radio: 'Radiobutton',
		textField: 'Textfeld einzeilig',
		textarea: 'Textfeld mehrzeilig',
		hiddenField: 'verstecktes Feld',
		button: 'Klickbutton',
		select: 'Auswahlfeld',
		imageButton: 'Bildbutton',
		notSet: '<nichts>',
		id: 'ID',
		name: 'Name',
		langDir: 'Schreibrichtung',
		langDirLtr: 'Links nach Rechts (LTR)',
		langDirRtl: 'Rechts nach Links (RTL)',
		langCode: 'Sprachenkürzel',
		longDescr: 'Langform URL',
		cssClass: 'Stylesheet Klasse',
		advisoryTitle: 'Titel Beschreibung',
		cssStyle: 'Style',
		ok: 'OK',
		cancel: 'Abbrechen',
		generalTab: 'Allgemein',
		advancedTab: 'Erweitert',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Sonderzeichen einfügen/editieren',
		title: 'Sonderzeichen auswählen'
	},

	// Link dialog.
	link: {
		toolbar: 'Link einfügen/editieren', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Link editieren',
		title: 'Link',
		info: 'Link-Info',
		target: 'Zielseite',
		upload: 'Upload',
		advanced: 'Erweitert',
		type: 'Link-Typ',
		toAnchor: 'Anker in dieser Seite',
		toEmail: 'E-Mail',
		target: 'Zielseite',
		targetNotSet: '<nichts>',
		targetFrame: '<Frame>',
		targetPopup: '<Pop-up Fenster>',
		targetNew: 'Neues Fenster (_blank)',
		targetTop: 'Oberstes Fenster (_top)',
		targetSelf: 'Gleiches Fenster (_self)',
		targetParent: 'Oberes Fenster (_parent)',
		targetFrameName: 'Ziel-Fenster-Name',
		targetPopupName: 'Pop-up Fenster-Name',
		popupFeatures: 'Pop-up Fenster-Eigenschaften',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Statusleiste',
		popupLocationBar: 'Adress-Leiste',
		popupToolbar: 'Werkzeugleiste',
		popupMenuBar: 'Menü-Leiste',
		popupFullScreen: 'Vollbild (IE)',
		popupScrollBars: 'Rollbalken',
		popupDependent: 'Abhängig (Netscape)',
		popupWidth: 'Breite',
		popupLeft: 'Linke Position',
		popupHeight: 'Höhe',
		popupTop: 'Obere Position',
		id: 'Id', // MISSING
		langDir: 'Schreibrichtung',
		langDirNotSet: '<nichts>',
		langDirLTR: 'Links nach Rechts (LTR)',
		langDirRTL: 'Rechts nach Links (RTL)',
		acccessKey: 'Zugriffstaste',
		name: 'Name',
		langCode: 'Schreibrichtung',
		tabIndex: 'Tab-Index',
		advisoryTitle: 'Titel Beschreibung',
		advisoryContentType: 'Inhaltstyp',
		cssClasses: 'Stylesheet Klasse',
		charset: 'Ziel-Zeichensatz',
		styles: 'Style',
		selectAnchor: 'Anker auswählen',
		anchorName: 'nach Anker Name',
		anchorId: 'nach Element Id',
		emailAddress: 'E-Mail Addresse',
		emailSubject: 'Betreffzeile',
		emailBody: 'Nachrichtentext',
		noAnchors: '(keine Anker im Dokument vorhanden)',
		noUrl: 'Bitte geben Sie die Link-URL an',
		noEmail: 'Bitte geben Sie e-Mail Adresse an'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Anker einfügen/editieren',
		menu: 'Anker-Eigenschaften',
		title: 'Anker-Eigenschaften',
		name: 'Anker Name',
		errorName: 'Bitte geben Sie den Namen des Ankers ein'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Suchen und Ersetzen',
		find: 'Suchen',
		replace: 'Ersetzen',
		findWhat: 'Suche nach:',
		replaceWith: 'Ersetze mit:',
		notFoundMsg: 'Der gesuchte Text wurde nicht gefunden.',
		matchCase: 'Groß-Kleinschreibung beachten',
		matchWord: 'Nur ganze Worte suchen',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Alle Ersetzen',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Tabelle',
		title: 'Tabellen-Eigenschaften',
		menu: 'Tabellen-Eigenschaften',
		deleteTable: 'Tabelle löschen',
		rows: 'Zeile',
		columns: 'Spalte',
		border: 'Rahmen',
		align: 'Ausrichtung',
		alignNotSet: '<keine>',
		alignLeft: 'Links',
		alignCenter: 'Zentriert',
		alignRight: 'Rechts',
		width: 'Breite',
		widthPx: 'Pixel',
		widthPc: '%',
		height: 'Höhe',
		cellSpace: 'Zellenabstand außen',
		cellPad: 'Zellenabstand innen',
		caption: 'Überschrift',
		summary: 'Inhaltsübersicht',
		headers: 'Headers', // MISSING
		headersNone: 'None', // MISSING
		headersColumn: 'First column', // MISSING
		headersRow: 'First Row', // MISSING
		headersBoth: 'Both', // MISSING
		invalidRows: 'Number of rows must be a number greater than 0.', // MISSING
		invalidCols: 'Number of columns must be a number greater than 0.', // MISSING
		invalidBorder: 'Border size must be a number.', // MISSING
		invalidWidth: 'Table width must be a number.', // MISSING
		invalidHeight: 'Table height must be a number.', // MISSING
		invalidCellSpacing: 'Cell spacing must be a number.', // MISSING
		invalidCellPadding: 'Cell padding must be a number.', // MISSING

		cell: {
			menu: 'Zelle',
			insertBefore: 'Zelle davor einfügen',
			insertAfter: 'Zelle danach einfügen',
			deleteCell: 'Zelle löschen',
			merge: 'Zellen verbinden',
			mergeRight: 'nach rechts verbinden',
			mergeDown: 'nach unten verbinden',
			splitHorizontal: 'Zelle horizontal teilen',
			splitVertical: 'Zelle vertikal teilen',
			title: 'Cell Properties', // MISSING
			cellType: 'Cell Type', // MISSING
			rowSpan: 'Rows Span', // MISSING
			colSpan: 'Columns Span', // MISSING
			wordWrap: 'Word Wrap', // MISSING
			hAlign: 'Horizontal Alignment', // MISSING
			vAlign: 'Vertical Alignment', // MISSING
			alignTop: 'Top', // MISSING
			alignMiddle: 'Middle', // MISSING
			alignBottom: 'Bottom', // MISSING
			alignBaseline: 'Baseline', // MISSING
			bgColor: 'Background Color', // MISSING
			borderColor: 'Border Color', // MISSING
			data: 'Data', // MISSING
			header: 'Header', // MISSING
			yes: 'Yes', // MISSING
			no: 'No', // MISSING
			invalidWidth: 'Cell width must be a number.', // MISSING
			invalidHeight: 'Cell height must be a number.', // MISSING
			invalidRowSpan: 'Rows span must be a whole number.', // MISSING
			invalidColSpan: 'Columns span must be a whole number.' // MISSING
		},

		row: {
			menu: 'Zeile',
			insertBefore: 'Zeile oberhalb einfügen',
			insertAfter: 'Zeile unterhalb einfügen',
			deleteRow: 'Zeile entfernen'
		},

		column: {
			menu: 'Spalte',
			insertBefore: 'Spalte links davor einfügen',
			insertAfter: 'Spalte rechts danach einfügen',
			deleteColumn: 'Spalte löschen'
		}
	},

	// Button Dialog.
	button: {
		title: 'Button-Eigenschaften',
		text: 'Text (Wert)',
		type: 'Typ',
		typeBtn: 'Button',
		typeSbm: 'Absenden',
		typeRst: 'Zurücksetzen'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Checkbox-Eigenschaften',
		radioTitle: 'Optionsfeld-Eigenschaften',
		value: 'Wert',
		selected: 'ausgewählt'
	},

	// Form Dialog.
	form: {
		title: 'Formular-Eigenschaften',
		menu: 'Formular-Eigenschaften',
		action: 'Action',
		method: 'Method',
		encoding: 'Encoding', // MISSING
		target: 'Zielseite',
		targetNotSet: '<nichts>',
		targetNew: 'Neues Fenster (_blank)',
		targetTop: 'Oberstes Fenster (_top)',
		targetSelf: 'Gleiches Fenster (_self)',
		targetParent: 'Oberes Fenster (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Auswahlfeld-Eigenschaften',
		selectInfo: 'Info',
		opAvail: 'Mögliche Optionen',
		value: 'Wert',
		size: 'Größe',
		lines: 'Linien',
		chkMulti: 'Erlaube Mehrfachauswahl',
		opText: 'Text',
		opValue: 'Wert',
		btnAdd: 'Hinzufügen',
		btnModify: 'Ändern',
		btnUp: 'Hoch',
		btnDown: 'Runter',
		btnSetValue: 'Setze als Standardwert',
		btnDelete: 'Entfernen'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Textfeld (mehrzeilig) Eigenschaften',
		cols: 'Spalten',
		rows: 'Reihen'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Textfeld (einzeilig) Eigenschaften',
		name: 'Name',
		value: 'Wert',
		charWidth: 'Zeichenbreite',
		maxChars: 'Max. Zeichen',
		type: 'Typ',
		typeText: 'Text',
		typePass: 'Passwort'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Verstecktes Feld-Eigenschaften',
		name: 'Name',
		value: 'Wert'
	},

	// Image Dialog.
	image: {
		title: 'Bild-Eigenschaften',
		titleButton: 'Bildbutton-Eigenschaften',
		menu: 'Bild-Eigenschaften',
		infoTab: 'Bild-Info',
		btnUpload: 'Zum Server senden',
		url: 'Bildauswahl',
		upload: 'Upload',
		alt: 'Alternativer Text',
		width: 'Breite',
		height: 'Höhe',
		lockRatio: 'Größenverhältniss beibehalten',
		resetSize: 'Größe zurücksetzen',
		border: 'Rahmen',
		hSpace: 'Horizontal-Abstand',
		vSpace: 'Vertikal-Abstand',
		align: 'Ausrichtung',
		alignLeft: 'Links',
		alignAbsBottom: 'Abs Unten',
		alignAbsMiddle: 'Abs Mitte',
		alignBaseline: 'Baseline',
		alignBottom: 'Unten',
		alignMiddle: 'Mitte',
		alignRight: 'Rechts',
		alignTextTop: 'Text Oben',
		alignTop: 'Oben',
		preview: 'Vorschau',
		alertUrl: 'Bitte geben Sie die Bild-URL an',
		linkTab: 'Link',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Flash-Eigenschaften',
		propertiesTab: 'Properties', // MISSING
		title: 'Flash-Eigenschaften',
		chkPlay: 'autom. Abspielen',
		chkLoop: 'Endlosschleife',
		chkMenu: 'Flash-Menü aktivieren',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Skalierung',
		scaleAll: 'Alles anzeigen',
		scaleNoBorder: 'ohne Rand',
		scaleFit: 'Passgenau',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Ausrichtung',
		alignLeft: 'Links',
		alignAbsBottom: 'Abs Unten',
		alignAbsMiddle: 'Abs Mitte',
		alignBaseline: 'Baseline',
		alignBottom: 'Unten',
		alignMiddle: 'Mitte',
		alignRight: 'Rechts',
		alignTextTop: 'Text Oben',
		alignTop: 'Oben',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Hintergrundfarbe',
		width: 'Breite',
		height: 'Höhe',
		hSpace: 'Horizontal-Abstand',
		vSpace: 'Vertikal-Abstand',
		validateSrc: 'Bitte geben Sie die Link-URL an',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Rechtschreibprüfung',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Nicht im Wörterbuch',
		changeTo: 'Ändern in',
		btnIgnore: 'Ignorieren',
		btnIgnoreAll: 'Alle Ignorieren',
		btnReplace: 'Ersetzen',
		btnReplaceAll: 'Alle Ersetzen',
		btnUndo: 'Rückgängig',
		noSuggestions: ' - keine Vorschläge - ',
		progress: 'Rechtschreibprüfung läuft...',
		noMispell: 'Rechtschreibprüfung abgeschlossen - keine Fehler gefunden',
		noChanges: 'Rechtschreibprüfung abgeschlossen - keine Worte geändert',
		oneChange: 'Rechtschreibprüfung abgeschlossen - ein Wort geändert',
		manyChanges: 'Rechtschreibprüfung abgeschlossen - %1 Wörter geändert',
		ieSpellDownload: 'Rechtschreibprüfung nicht installiert. Möchten Sie sie jetzt herunterladen?'
	},

	smiley: {
		toolbar: 'Smiley',
		title: 'Smiley auswählen'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Nummerierte Liste',
	bulletedlist: 'Liste',
	indent: 'Einzug erhöhen',
	outdent: 'Einzug verringern',

	justify: {
		left: 'Linksbündig',
		center: 'Zentriert',
		right: 'Rechtsbündig',
		block: 'Blocksatz'
	},

	blockquote: 'Zitatblock',

	clipboard: {
		title: 'Einfügen',
		cutError: 'Die Sicherheitseinstellungen Ihres Browsers lassen es nicht zu, den Text automatisch auszuschneiden. Bitte benutzen Sie die System-Zwischenablage über STRG-X (ausschneiden) und STRG-V (einfügen).',
		copyError: 'Die Sicherheitseinstellungen Ihres Browsers lassen es nicht zu, den Text automatisch kopieren. Bitte benutzen Sie die System-Zwischenablage über STRG-C (kopieren).',
		pasteMsg: 'Bitte fügen Sie den Text in der folgenden Box über die Tastatur (mit <STRONG>Strg+V</STRONG>) ein und bestätigen Sie mit <STRONG>OK</STRONG>.',
		securityMsg: 'Aufgrund von Sicherheitsbeschränkungen Ihres Browsers kann der Editor nicht direkt auf die Zwischenablage zugreifen. Bitte fügen Sie den Inhalt erneut in diesem Fenster ein.'
	},

	pastefromword: {
		toolbar: 'aus MS-Word einfügen',
		title: 'aus MS-Word einfügen',
		advice: 'Bitte fügen Sie den Text in der folgenden Box über die Tastatur (mit <STRONG>Strg+V</STRONG>) ein und bestätigen Sie mit <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Ignoriere Schriftart-Definitionen',
		removeStyle: 'Entferne Style-Definitionen'
	},

	pasteText: {
		button: 'Als Text einfügen',
		title: 'Als Text einfügen'
	},

	templates: {
		button: 'Vorlagen',
		title: 'Vorlagen',
		insertOption: 'Aktuellen Inhalt ersetzen',
		selectPromptMsg: 'Klicken Sie auf eine Vorlage, um sie im Editor zu öffnen (der aktuelle Inhalt wird dabei gelöscht!):',
		emptyListMsg: '(keine Vorlagen definiert)'
	},

	showBlocks: 'Blöcke anzeigen',

	stylesCombo: {
		label: 'Stil',
		voiceLabel: 'Styles', // MISSING
		panelVoiceLabel: 'Select a style', // MISSING
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Format',
		voiceLabel: 'Format', // MISSING
		panelTitle: 'Format',
		panelVoiceLabel: 'Select a paragraph format', // MISSING

		tag_p: 'Normal',
		tag_pre: 'Formatiert',
		tag_address: 'Addresse',
		tag_h1: 'Überschrift 1',
		tag_h2: 'Überschrift 2',
		tag_h3: 'Überschrift 3',
		tag_h4: 'Überschrift 4',
		tag_h5: 'Überschrift 5',
		tag_h6: 'Überschrift 6',
		tag_div: 'Normal (DIV)'
	},

	font: {
		label: 'Schriftart',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'Schriftart',
		panelVoiceLabel: 'Select a font' // MISSING
	},

	fontSize: {
		label: 'Größe',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'Größe',
		panelVoiceLabel: 'Select a font size' // MISSING
	},

	colorButton: {
		textColorTitle: 'Textfarbe',
		bgColorTitle: 'Hintergrundfarbe',
		auto: 'Automatisch',
		more: 'Weitere Farben...'
	},

	colors: {
		'000': 'Black',
		'800000': 'Maroon',
		'8B4513': 'Saddle Brown',
		'2F4F4F': 'Dark Slate Gray',
		'008080': 'Teal',
		'000080': 'Navy',
		'4B0082': 'Indigo',
		'696969': 'Dim Gray',
		'B22222': 'Fire Brick',
		'A52A2A': 'Brown',
		'DAA520': 'Golden Rod',
		'006400': 'Dark Green',
		'40E0D0': 'Turquoise',
		'0000CD': 'Medium Blue',
		'800080': 'Purple',
		'808080': 'Gray',
		'F00': 'Red',
		'FF8C00': 'Dark Orange',
		'FFD700': 'Gold',
		'008000': 'Green',
		'0FF': 'Cyan',
		'00F': 'Blue',
		'EE82EE': 'Violet',
		'A9A9A9': 'Dark Gray',
		'FFA07A': 'Light Salmon',
		'FFA500': 'Orange',
		'FFFF00': 'Yellow',
		'00FF00': 'Lime',
		'AFEEEE': 'Pale Turquoise',
		'ADD8E6': 'Light Blue',
		'DDA0DD': 'Plum',
		'D3D3D3': 'Light Grey',
		'FFF0F5': 'Lavender Blush',
		'FAEBD7': 'Antique White',
		'FFFFE0': 'Light Yellow',
		'F0FFF0': 'Honeydew',
		'F0FFFF': 'Azure',
		'F0F8FF': 'Alice Blue',
		'E6E6FA': 'Lavender',
		'FFF': 'White'
	},

	scayt: {
		title: 'Spell Check As You Type', // MISSING
		enable: 'Enable SCAYT', // MISSING
		disable: 'Disable SCAYT', // MISSING
		about: 'About SCAYT', // MISSING
		toggle: 'Toggle SCAYT', // MISSING
		options: 'Options', // MISSING
		langs: 'Languages', // MISSING
		moreSuggestions: 'More suggestions', // MISSING
		ignore: 'Ignore', // MISSING
		ignoreAll: 'Ignore All', // MISSING
		addWord: 'Add Word', // MISSING
		emptyDic: 'Dictionary name should not be empty.', // MISSING
		optionsTab: 'Options', // MISSING
		languagesTab: 'Languages', // MISSING
		dictionariesTab: 'Dictionaries', // MISSING
		aboutTab: 'About' // MISSING
	},

	about: {
		title: 'About CKEditor', // MISSING
		moreInfo: 'For licensing information please visit our web site:', // MISSING
		copy: 'Copyright &copy; $1. All rights reserved.' // MISSING
	},

	maximize: 'Maximize', // MISSING

	resize: 'Drag to resize' // MISSING
};

/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Dutch language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'nl' ] = {
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
	source: 'Code',
	newPage: 'Nieuwe pagina',
	save: 'Opslaan',
	preview: 'Voorbeeld',
	cut: 'Knippen',
	copy: 'Kopiëren',
	paste: 'Plakken',
	print: 'Printen',
	underline: 'Onderstreept',
	bold: 'Vet',
	italic: 'Schuingedrukt',
	selectAll: 'Alles selecteren',
	removeFormat: 'Opmaak verwijderen',
	strike: 'Doorhalen',
	subscript: 'Subscript',
	superscript: 'Superscript',
	horizontalrule: 'Horizontale lijn invoegen',
	pagebreak: 'Pagina-einde invoegen',
	unlink: 'Link verwijderen',
	undo: 'Ongedaan maken',
	redo: 'Opnieuw uitvoeren',

	// Common messages and labels.
	common: {
		browseServer: 'Bladeren op server',
		url: 'URL',
		protocol: 'Protocol',
		upload: 'Upload',
		uploadSubmit: 'Naar server verzenden',
		image: 'Afbeelding',
		flash: 'Flash',
		form: 'Formulier',
		checkbox: 'Aanvinkvakje',
		radio: 'Selectievakje',
		textField: 'Tekstveld',
		textarea: 'Tekstvak',
		hiddenField: 'Verborgen veld',
		button: 'Knop',
		select: 'Selectieveld',
		imageButton: 'Afbeeldingsknop',
		notSet: '<niet ingevuld>',
		id: 'Kenmerk',
		name: 'Naam',
		langDir: 'Schrijfrichting',
		langDirLtr: 'Links naar rechts (LTR)',
		langDirRtl: 'Rechts naar links (RTL)',
		langCode: 'Taalcode',
		longDescr: 'Lange URL-omschrijving',
		cssClass: 'Stylesheet-klassen',
		advisoryTitle: 'Aanbevolen titel',
		cssStyle: 'Stijl',
		ok: 'OK',
		cancel: 'Annuleren',
		generalTab: 'Algemeen',
		advancedTab: 'Geavanceerd',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Speciaal teken invoegen',
		title: 'Selecteer speciaal teken'
	},

	// Link dialog.
	link: {
		toolbar: 'Link invoegen/wijzigen', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Link wijzigen',
		title: 'Link',
		info: 'Linkomschrijving',
		target: 'Doel',
		upload: 'Upload',
		advanced: 'Geavanceerd',
		type: 'Linktype',
		toAnchor: 'Interne link in pagina',
		toEmail: 'E-mail',
		target: 'Doel',
		targetNotSet: '<niet ingevuld>',
		targetFrame: '<frame>',
		targetPopup: '<popup window>',
		targetNew: 'Nieuw venster (_blank)',
		targetTop: 'Hele venster (_top)',
		targetSelf: 'Zelfde venster (_self)',
		targetParent: 'Origineel venster (_parent)',
		targetFrameName: 'Naam doelframe',
		targetPopupName: 'Naam popupvenster',
		popupFeatures: 'Instellingen popupvenster',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Statusbalk',
		popupLocationBar: 'Locatiemenu',
		popupToolbar: 'Menubalk',
		popupMenuBar: 'Menubalk',
		popupFullScreen: 'Volledig scherm (IE)',
		popupScrollBars: 'Schuifbalken',
		popupDependent: 'Afhankelijk (Netscape)',
		popupWidth: 'Breedte',
		popupLeft: 'Positie links',
		popupHeight: 'Hoogte',
		popupTop: 'Positie boven',
		id: 'Id', // MISSING
		langDir: 'Schrijfrichting',
		langDirNotSet: '<niet ingevuld>',
		langDirLTR: 'Links naar rechts (LTR)',
		langDirRTL: 'Rechts naar links (RTL)',
		acccessKey: 'Toegangstoets',
		name: 'Naam',
		langCode: 'Schrijfrichting',
		tabIndex: 'Tabvolgorde',
		advisoryTitle: 'Aanbevolen titel',
		advisoryContentType: 'Aanbevolen content-type',
		cssClasses: 'Stylesheet-klassen',
		charset: 'Karakterset van gelinkte bron',
		styles: 'Stijl',
		selectAnchor: 'Kies een interne link',
		anchorName: 'Op naam interne link',
		anchorId: 'Op kenmerk interne link',
		emailAddress: 'E-mailadres',
		emailSubject: 'Onderwerp bericht',
		emailBody: 'Inhoud bericht',
		noAnchors: '(Geen interne links in document gevonden)',
		noUrl: 'Geef de link van de URL',
		noEmail: 'Geef een e-mailadres'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Interne link',
		menu: 'Eigenschappen interne link',
		title: 'Eigenschappen interne link',
		name: 'Naam interne link',
		errorName: 'Geef de naam van de interne link op'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Zoeken en vervangen',
		find: 'Zoeken',
		replace: 'Vervangen',
		findWhat: 'Zoeken naar:',
		replaceWith: 'Vervangen met:',
		notFoundMsg: 'De opgegeven tekst is niet gevonden.',
		matchCase: 'Hoofdlettergevoelig',
		matchWord: 'Hele woord moet voorkomen',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Alles vervangen',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Tabel',
		title: 'Eigenschappen tabel',
		menu: 'Eigenschappen tabel',
		deleteTable: 'Tabel verwijderen',
		rows: 'Rijen',
		columns: 'Kolommen',
		border: 'Breedte rand',
		align: 'Uitlijning',
		alignNotSet: '<Niet ingevoerd>',
		alignLeft: 'Links',
		alignCenter: 'Centreren',
		alignRight: 'Rechts',
		width: 'Breedte',
		widthPx: 'pixels',
		widthPc: 'procent',
		height: 'Hoogte',
		cellSpace: 'Afstand tussen cellen',
		cellPad: 'Afstand vanaf rand cel',
		caption: 'Naam',
		summary: 'Samenvatting',
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
			menu: 'Cel',
			insertBefore: 'Voeg cel in voor',
			insertAfter: 'Voeg cel in achter',
			deleteCell: 'Cellen verwijderen',
			merge: 'Cellen samenvoegen',
			mergeRight: 'Voeg samen naar rechts',
			mergeDown: 'Voeg samen naar beneden',
			splitHorizontal: 'Splits cellen horizontaal',
			splitVertical: 'Splits cellen verticaal',
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
			menu: 'Rij',
			insertBefore: 'Voeg rij in voor',
			insertAfter: 'Voeg rij in achter',
			deleteRow: 'Rijen verwijderen'
		},

		column: {
			menu: 'Kolom',
			insertBefore: 'Voeg kolom in voor',
			insertAfter: 'Voeg kolom in achter',
			deleteColumn: 'Kolommen verwijderen'
		}
	},

	// Button Dialog.
	button: {
		title: 'Eigenschappen knop',
		text: 'Tekst (waarde)',
		type: 'Soort',
		typeBtn: 'Knop',
		typeSbm: 'Versturen',
		typeRst: 'Leegmaken'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Eigenschappen aanvinkvakje',
		radioTitle: 'Eigenschappen selectievakje',
		value: 'Waarde',
		selected: 'Geselecteerd'
	},

	// Form Dialog.
	form: {
		title: 'Eigenschappen formulier',
		menu: 'Eigenschappen formulier',
		action: 'Actie',
		method: 'Methode',
		encoding: 'Encoding', // MISSING
		target: 'Doel',
		targetNotSet: '<niet ingevuld>',
		targetNew: 'Nieuw venster (_blank)',
		targetTop: 'Hele venster (_top)',
		targetSelf: 'Zelfde venster (_self)',
		targetParent: 'Origineel venster (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Eigenschappen selectieveld',
		selectInfo: 'Informatie',
		opAvail: 'Beschikbare opties',
		value: 'Waarde',
		size: 'Grootte',
		lines: 'Regels',
		chkMulti: 'Gecombineerde selecties toestaan',
		opText: 'Tekst',
		opValue: 'Waarde',
		btnAdd: 'Toevoegen',
		btnModify: 'Wijzigen',
		btnUp: 'Omhoog',
		btnDown: 'Omlaag',
		btnSetValue: 'Als geselecteerde waarde instellen',
		btnDelete: 'Verwijderen'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Eigenschappen tekstvak',
		cols: 'Kolommen',
		rows: 'Rijen'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Eigenschappen tekstveld',
		name: 'Naam',
		value: 'Waarde',
		charWidth: 'Breedte (tekens)',
		maxChars: 'Maximum aantal tekens',
		type: 'Soort',
		typeText: 'Tekst',
		typePass: 'Wachtwoord'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Eigenschappen verborgen veld',
		name: 'Naam',
		value: 'Waarde'
	},

	// Image Dialog.
	image: {
		title: 'Eigenschappen afbeelding',
		titleButton: 'Eigenschappen afbeeldingsknop',
		menu: 'Eigenschappen afbeelding',
		infoTab: 'Informatie afbeelding',
		btnUpload: 'Naar server verzenden',
		url: 'URL',
		upload: 'Upload',
		alt: 'Alternatieve tekst',
		width: 'Breedte',
		height: 'Hoogte',
		lockRatio: 'Afmetingen vergrendelen',
		resetSize: 'Afmetingen resetten',
		border: 'Rand',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		align: 'Uitlijning',
		alignLeft: 'Links',
		alignAbsBottom: 'Absoluut-onder',
		alignAbsMiddle: 'Absoluut-midden',
		alignBaseline: 'Basislijn',
		alignBottom: 'Beneden',
		alignMiddle: 'Midden',
		alignRight: 'Rechts',
		alignTextTop: 'Boven tekst',
		alignTop: 'Boven',
		preview: 'Voorbeeld',
		alertUrl: 'Geef de URL van de afbeelding',
		linkTab: 'Link',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Eigenschappen Flash',
		propertiesTab: 'Properties', // MISSING
		title: 'Eigenschappen Flash',
		chkPlay: 'Automatisch afspelen',
		chkLoop: 'Herhalen',
		chkMenu: 'Flashmenu\'s inschakelen',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Schaal',
		scaleAll: 'Alles tonen',
		scaleNoBorder: 'Geen rand',
		scaleFit: 'Precies passend',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Uitlijning',
		alignLeft: 'Links',
		alignAbsBottom: 'Absoluut-onder',
		alignAbsMiddle: 'Absoluut-midden',
		alignBaseline: 'Basislijn',
		alignBottom: 'Beneden',
		alignMiddle: 'Midden',
		alignRight: 'Rechts',
		alignTextTop: 'Boven tekst',
		alignTop: 'Boven',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Achtergrondkleur',
		width: 'Breedte',
		height: 'Hoogte',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		validateSrc: 'Geef de link van de URL',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Spellingscontrole',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Niet in het woordenboek',
		changeTo: 'Wijzig in',
		btnIgnore: 'Negeren',
		btnIgnoreAll: 'Alles negeren',
		btnReplace: 'Vervangen',
		btnReplaceAll: 'Alles vervangen',
		btnUndo: 'Ongedaan maken',
		noSuggestions: '-Geen suggesties-',
		progress: 'Bezig met spellingscontrole...',
		noMispell: 'Klaar met spellingscontrole: geen fouten gevonden',
		noChanges: 'Klaar met spellingscontrole: geen woorden aangepast',
		oneChange: 'Klaar met spellingscontrole: één woord aangepast',
		manyChanges: 'Klaar met spellingscontrole: %1 woorden aangepast',
		ieSpellDownload: 'De spellingscontrole niet geïnstalleerd. Wilt u deze nu downloaden?'
	},

	smiley: {
		toolbar: 'Smiley',
		title: 'Smiley invoegen'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Genummerde lijst',
	bulletedlist: 'Opsomming',
	indent: 'Inspringen vergroten',
	outdent: 'Inspringen verkleinen',

	justify: {
		left: 'Links uitlijnen',
		center: 'Centreren',
		right: 'Rechts uitlijnen',
		block: 'Uitvullen'
	},

	blockquote: 'Citaatblok',

	clipboard: {
		title: 'Plakken',
		cutError: 'De beveiligingsinstelling van de browser verhinderen het automatisch knippen. Gebruik de sneltoets Ctrl+X van het toetsenbord.',
		copyError: 'De beveiligingsinstelling van de browser verhinderen het automatisch kopiëren. Gebruik de sneltoets Ctrl+C van het toetsenbord.',
		pasteMsg: 'Plak de tekst in het volgende vak gebruik makend van uw toetsenbord (<strong>Ctrl+V</strong>) en klik op <strong>OK</strong>.',
		securityMsg: 'Door de beveiligingsinstellingen van uw browser is het niet mogelijk om direct vanuit het klembord in de editor te plakken. Middels opnieuw plakken in dit venster kunt u de tekst alsnog plakken in de editor.'
	},

	pastefromword: {
		toolbar: 'Plakken als Word-gegevens',
		title: 'Plakken als Word-gegevens',
		advice: 'Plak de tekst in het volgende vak gebruik makend van uw toetsenbord (<strong>Ctrl+V</strong>) en klik op <strong>OK</strong>.',
		ignoreFontFace: 'Negeer "Font Face"-definities',
		removeStyle: 'Verwijder "Style"-definities'
	},

	pasteText: {
		button: 'Plakken als platte tekst',
		title: 'Plakken als platte tekst'
	},

	templates: {
		button: 'Sjablonen',
		title: 'Inhoud sjabonen',
		insertOption: 'Vervang de huidige inhoud',
		selectPromptMsg: 'Selecteer het sjabloon dat in de editor geopend moet worden (de actuele inhoud gaat verloren):',
		emptyListMsg: '(Geen sjablonen gedefinieerd)'
	},

	showBlocks: 'Toon blokken',

	stylesCombo: {
		label: 'Stijl',
		voiceLabel: 'Styles', // MISSING
		panelVoiceLabel: 'Select a style', // MISSING
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Opmaak',
		voiceLabel: 'Format', // MISSING
		panelTitle: 'Opmaak',
		panelVoiceLabel: 'Select a paragraph format', // MISSING

		tag_p: 'Normaal',
		tag_pre: 'Met opmaak',
		tag_address: 'Adres',
		tag_h1: 'Kop 1',
		tag_h2: 'Kop 2',
		tag_h3: 'Kop 3',
		tag_h4: 'Kop 4',
		tag_h5: 'Kop 5',
		tag_h6: 'Kop 6',
		tag_div: 'Normaal (DIV)'
	},

	font: {
		label: 'Lettertype',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'Lettertype',
		panelVoiceLabel: 'Select a font' // MISSING
	},

	fontSize: {
		label: 'Grootte',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'Grootte',
		panelVoiceLabel: 'Select a font size' // MISSING
	},

	colorButton: {
		textColorTitle: 'Tekstkleur',
		bgColorTitle: 'Achtergrondkleur',
		auto: 'Automatisch',
		more: 'Meer kleuren...'
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

	fakeobjects: {
		anchor: 'Anchor', // MISSING
		flash: 'Flash Animation', // MISSING
		div: 'Page Break', // MISSING
		unknown: 'Unknown Object' // MISSING
	},

	resize: 'Drag to resize' // MISSING
};

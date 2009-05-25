/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Danish language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'da' ] = {
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
	source: 'Kilde',
	newPage: 'Ny side',
	save: 'Gem',
	preview: 'Vis eksempel',
	cut: 'Klip',
	copy: 'Kopier',
	paste: 'Indsæt',
	print: 'Udskriv',
	underline: 'Understreget',
	bold: 'Fed',
	italic: 'Kursiv',
	selectAll: 'Vælg alt',
	removeFormat: 'Fjern formatering',
	strike: 'Overstreget',
	subscript: 'Sænket skrift',
	superscript: 'Hævet skrift',
	horizontalrule: 'Indsæt vandret linie',
	pagebreak: 'Indsæt sideskift',
	unlink: 'Fjern hyperlink',
	undo: 'Fortryd',
	redo: 'Annuller fortryd',

	// Common messages and labels.
	common: {
		browseServer: 'Gennemse...',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Upload',
		uploadSubmit: 'Upload',
		image: 'Indsæt billede',
		flash: 'Flash',
		form: 'Indsæt formular',
		checkbox: 'Indsæt afkrydsningsfelt',
		radio: 'Indsæt alternativknap',
		textField: 'Indsæt tekstfelt',
		textarea: 'Indsæt tekstboks',
		hiddenField: 'Indsæt skjult felt',
		button: 'Indsæt knap',
		select: 'Indsæt liste',
		imageButton: 'Indsæt billedknap',
		notSet: '<intet valgt>',
		id: 'Id',
		name: 'Navn',
		langDir: 'Tekstretning',
		langDirLtr: 'Fra venstre mod højre (LTR)',
		langDirRtl: 'Fra højre mod venstre (RTL)',
		langCode: 'Sprogkode',
		longDescr: 'Udvidet beskrivelse',
		cssClass: 'Typografiark',
		advisoryTitle: 'Titel',
		cssStyle: 'Typografi',
		ok: 'OK',
		cancel: 'Annuller',
		generalTab: 'Generelt',
		advancedTab: 'Avanceret',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Indsæt symbol',
		title: 'Vælg symbol'
	},

	// Link dialog.
	link: {
		toolbar: 'Indsæt/rediger hyperlink', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Rediger hyperlink',
		title: 'Egenskaber for hyperlink',
		info: 'Generelt',
		target: 'Mål',
		upload: 'Upload',
		advanced: 'Avanceret',
		type: 'Hyperlink type',
		toAnchor: 'Bogmærke på denne side',
		toEmail: 'E-mail',
		target: 'Mål',
		targetNotSet: '<intet valgt>',
		targetFrame: '<ramme>',
		targetPopup: '<popup vindue>',
		targetNew: 'Nyt vindue (_blank)',
		targetTop: 'Hele vinduet (_top)',
		targetSelf: 'Samme vindue (_self)',
		targetParent: 'Overordnet ramme (_parent)',
		targetFrameName: 'Destinationsvinduets navn',
		targetPopupName: 'Pop-up vinduets navn',
		popupFeatures: 'Egenskaber for pop-up',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Statuslinje',
		popupLocationBar: 'Adresselinje',
		popupToolbar: 'Værktøjslinje',
		popupMenuBar: 'Menulinje',
		popupFullScreen: 'Fuld skærm (IE)',
		popupScrollBars: 'Scrollbars',
		popupDependent: 'Koblet/dependent (Netscape)',
		popupWidth: 'Bredde',
		popupLeft: 'Position fra venstre',
		popupHeight: 'Højde',
		popupTop: 'Position fra toppen',
		id: 'Id', // MISSING
		langDir: 'Tekstretning',
		langDirNotSet: '<intet valgt>',
		langDirLTR: 'Fra venstre mod højre (LTR)',
		langDirRTL: 'Fra højre mod venstre (RTL)',
		acccessKey: 'Genvejstast',
		name: 'Navn',
		langCode: 'Tekstretning',
		tabIndex: 'Tabulator indeks',
		advisoryTitle: 'Titel',
		advisoryContentType: 'Indholdstype',
		cssClasses: 'Typografiark',
		charset: 'Tegnsæt',
		styles: 'Typografi',
		selectAnchor: 'Vælg et anker',
		anchorName: 'Efter anker navn',
		anchorId: 'Efter element Id',
		emailAddress: 'E-mailadresse',
		emailSubject: 'Emne',
		emailBody: 'Brødtekst',
		noAnchors: '(Ingen bogmærker dokumentet)',
		noUrl: 'Indtast hyperlink URL!',
		noEmail: 'Indtast e-mailaddresse!'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Indsæt/rediger bogmærke',
		menu: 'Egenskaber for bogmærke',
		title: 'Egenskaber for bogmærke',
		name: 'Bogmærke navn',
		errorName: 'Indtast bogmærke navn!'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Søg og erstat',
		find: 'Søg',
		replace: 'Erstat',
		findWhat: 'Søg efter:',
		replaceWith: 'Erstat med:',
		notFoundMsg: 'Søgeteksten blev ikke fundet!',
		matchCase: 'Forskel på store og små bogstaver',
		matchWord: 'Kun hele ord',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Erstat alle',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Table',
		title: 'Egenskaber for tabel',
		menu: 'Egenskaber for tabel',
		deleteTable: 'Slet tabel',
		rows: 'Rækker',
		columns: 'Kolonner',
		border: 'Rammebredde',
		align: 'Justering',
		alignNotSet: '<intet valgt>',
		alignLeft: 'Venstrestillet',
		alignCenter: 'Centreret',
		alignRight: 'Højrestillet',
		width: 'Bredde',
		widthPx: 'pixels',
		widthPc: 'procent',
		height: 'Højde',
		cellSpace: 'Celleafstand',
		cellPad: 'Cellemargen',
		caption: 'Titel',
		summary: 'Resume',
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
			menu: 'Celle',
			insertBefore: 'Indsæt celle før',
			insertAfter: 'Indsæt celle efter',
			deleteCell: 'Slet celle',
			merge: 'Flet celler',
			mergeRight: 'Flet til højre',
			mergeDown: 'Flet nedad',
			splitHorizontal: 'Del celle vandret',
			splitVertical: 'Del celle lodret',
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
			menu: 'Række',
			insertBefore: 'Indsæt række før',
			insertAfter: 'Indsæt række efter',
			deleteRow: 'Slet række'
		},

		column: {
			menu: 'Kolonne',
			insertBefore: 'Indsæt kolonne før',
			insertAfter: 'Indsæt kolonne efter',
			deleteColumn: 'Slet kolonne'
		}
	},

	// Button Dialog.
	button: {
		title: 'Egenskaber for knap',
		text: 'Tekst',
		type: 'Type',
		typeBtn: 'Knap',
		typeSbm: 'Send',
		typeRst: 'Nulstil'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Egenskaber for afkrydsningsfelt',
		radioTitle: 'Egenskaber for alternativknap',
		value: 'Værdi',
		selected: 'Valgt'
	},

	// Form Dialog.
	form: {
		title: 'Egenskaber for formular',
		menu: 'Egenskaber for formular',
		action: 'Handling',
		method: 'Metod',
		encoding: 'Encoding', // MISSING
		target: 'Mål',
		targetNotSet: '<intet valgt>',
		targetNew: 'Nyt vindue (_blank)',
		targetTop: 'Hele vinduet (_top)',
		targetSelf: 'Samme vindue (_self)',
		targetParent: 'Overordnet ramme (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Egenskaber for liste',
		selectInfo: 'Generelt',
		opAvail: 'Valgmuligheder',
		value: 'Værdi',
		size: 'Størrelse',
		lines: 'linier',
		chkMulti: 'Tillad flere valg',
		opText: 'Tekst',
		opValue: 'Værdi',
		btnAdd: 'Tilføj',
		btnModify: 'Rediger',
		btnUp: 'Op',
		btnDown: 'Ned',
		btnSetValue: 'Sæt som valgt',
		btnDelete: 'Slet'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Egenskaber for tekstboks',
		cols: 'Kolonner',
		rows: 'Rækker'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Egenskaber for tekstfelt',
		name: 'Navn',
		value: 'Værdi',
		charWidth: 'Bredde (tegn)',
		maxChars: 'Max antal tegn',
		type: 'Type',
		typeText: 'Tekst',
		typePass: 'Adgangskode'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Egenskaber for skjult felt',
		name: 'Navn',
		value: 'Værdi'
	},

	// Image Dialog.
	image: {
		title: 'Egenskaber for billede',
		titleButton: 'Egenskaber for billedknap',
		menu: 'Egenskaber for billede',
		infoTab: 'Generelt',
		btnUpload: 'Upload',
		url: 'URL',
		upload: 'Upload',
		alt: 'Alternativ tekst',
		width: 'Bredde',
		height: 'Højde',
		lockRatio: 'Lås størrelsesforhold',
		resetSize: 'Nulstil størrelse',
		border: 'Ramme',
		hSpace: 'HMargen',
		vSpace: 'VMargen',
		align: 'Justering',
		alignLeft: 'Venstre',
		alignAbsBottom: 'Absolut nederst',
		alignAbsMiddle: 'Absolut centreret',
		alignBaseline: 'Grundlinje',
		alignBottom: 'Nederst',
		alignMiddle: 'Centreret',
		alignRight: 'Højre',
		alignTextTop: 'Toppen af teksten',
		alignTop: 'Øverst',
		preview: 'Vis eksempel',
		alertUrl: 'Indtast stien til billedet',
		linkTab: 'Hyperlink',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Egenskaber for Flash',
		propertiesTab: 'Properties', // MISSING
		title: 'Egenskaber for Flash',
		chkPlay: 'Automatisk afspilning',
		chkLoop: 'Gentagelse',
		chkMenu: 'Vis Flash menu',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Skalér',
		scaleAll: 'Vis alt',
		scaleNoBorder: 'Ingen ramme',
		scaleFit: 'Tilpas størrelse',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Justering',
		alignLeft: 'Venstre',
		alignAbsBottom: 'Absolut nederst',
		alignAbsMiddle: 'Absolut centreret',
		alignBaseline: 'Grundlinje',
		alignBottom: 'Nederst',
		alignMiddle: 'Centreret',
		alignRight: 'Højre',
		alignTextTop: 'Toppen af teksten',
		alignTop: 'Øverst',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Baggrundsfarve',
		width: 'Bredde',
		height: 'Højde',
		hSpace: 'HMargen',
		vSpace: 'VMargen',
		validateSrc: 'Indtast hyperlink URL!',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Stavekontrol',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Ikke i ordbogen',
		changeTo: 'Forslag',
		btnIgnore: 'Ignorer',
		btnIgnoreAll: 'Ignorer alle',
		btnReplace: 'Erstat',
		btnReplaceAll: 'Erstat alle',
		btnUndo: 'Tilbage',
		noSuggestions: '- ingen forslag -',
		progress: 'Stavekontrolen arbejder...',
		noMispell: 'Stavekontrol færdig: Ingen fejl fundet',
		noChanges: 'Stavekontrol færdig: Ingen ord ændret',
		oneChange: 'Stavekontrol færdig: Et ord ændret',
		manyChanges: 'Stavekontrol færdig: %1 ord ændret',
		ieSpellDownload: 'Stavekontrol ikke installeret.<br>Vil du hente den nu?'
	},

	smiley: {
		toolbar: 'Smiley',
		title: 'Vælg smiley'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Talopstilling',
	bulletedlist: 'Punktopstilling',
	indent: 'Forøg indrykning',
	outdent: 'Formindsk indrykning',

	justify: {
		left: 'Venstrestillet',
		center: 'Centreret',
		right: 'Højrestillet',
		block: 'Lige margener'
	},

	blockquote: 'Blokcitat',

	clipboard: {
		title: 'Indsæt',
		cutError: 'Din browsers sikkerhedsindstillinger tillader ikke editoren at klippe tekst automatisk!<br>Brug i stedet tastaturet til at klippe teksten (Ctrl+X).',
		copyError: 'Din browsers sikkerhedsindstillinger tillader ikke editoren at kopiere tekst automatisk!<br>Brug i stedet tastaturet til at kopiere teksten (Ctrl+C).',
		pasteMsg: 'Indsæt i feltet herunder (<STRONG>Ctrl+V</STRONG>) og klik <STRONG>OK</STRONG>.',
		securityMsg: 'På grund af browserens sikkerhedsindstillinger kan editoren ikke tilgå udklipsholderen direkte. Du skal indsætte udklipsholderens indhold i dette vindue igen.'
	},

	pastefromword: {
		toolbar: 'Indsæt fra Word',
		title: 'Indsæt fra Word',
		advice: 'Indsæt i feltet herunder (<STRONG>Ctrl+V</STRONG>) og klik <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Ignorer font definitioner',
		removeStyle: 'Ignorer typografi'
	},

	pasteText: {
		button: 'Indsæt som ikke-formateret tekst',
		title: 'Indsæt som ikke-formateret tekst'
	},

	templates: {
		button: 'Skabeloner',
		title: 'Indholdsskabeloner',
		insertOption: 'Erstat det faktiske indhold',
		selectPromptMsg: 'Vælg den skabelon, som skal åbnes i editoren.<br>(Nuværende indhold vil blive overskrevet!):',
		emptyListMsg: '(Der er ikke defineret nogen skabelon!)'
	},

	showBlocks: 'Show Blocks', // MISSING

	stylesCombo: {
		label: 'Typografi',
		voiceLabel: 'Styles', // MISSING
		panelVoiceLabel: 'Select a style', // MISSING
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Formatering',
		voiceLabel: 'Format', // MISSING
		panelTitle: 'Formatering',
		panelVoiceLabel: 'Select a paragraph format', // MISSING

		tag_p: 'Normal',
		tag_pre: 'Formateret',
		tag_address: 'Adresse',
		tag_h1: 'Overskrift 1',
		tag_h2: 'Overskrift 2',
		tag_h3: 'Overskrift 3',
		tag_h4: 'Overskrift 4',
		tag_h5: 'Overskrift 5',
		tag_h6: 'Overskrift 6',
		tag_div: 'Normal (DIV)'
	},

	font: {
		label: 'Skrifttype',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'Skrifttype',
		panelVoiceLabel: 'Select a font' // MISSING
	},

	fontSize: {
		label: 'Skriftstørrelse',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'Skriftstørrelse',
		panelVoiceLabel: 'Select a font size' // MISSING
	},

	colorButton: {
		textColorTitle: 'Tekstfarve',
		bgColorTitle: 'Baggrundsfarve',
		auto: 'Automatisk',
		more: 'Flere farver...'
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

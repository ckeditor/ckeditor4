/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Croatian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'hr' ] = {
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
	source: 'Kôd',
	newPage: 'Nova stranica',
	save: 'Snimi',
	preview: 'Pregledaj',
	cut: 'Izreži',
	copy: 'Kopiraj',
	paste: 'Zalijepi',
	print: 'Ispiši',
	underline: 'Potcrtano',
	bold: 'Podebljaj',
	italic: 'Ukosi',
	selectAll: 'Odaberi sve',
	removeFormat: 'Ukloni formatiranje',
	strike: 'Precrtano',
	subscript: 'Subscript',
	superscript: 'Superscript',
	horizontalrule: 'Ubaci vodoravnu liniju',
	pagebreak: 'Ubaci prijelom stranice',
	unlink: 'Ukloni link',
	undo: 'Poništi',
	redo: 'Ponovi',

	// Common messages and labels.
	common: {
		browseServer: 'Pretraži server',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Pošalji',
		uploadSubmit: 'Pošalji na server',
		image: 'Slika',
		flash: 'Flash',
		form: 'Form',
		checkbox: 'Checkbox',
		radio: 'Radio Button',
		textField: 'Text Field',
		textarea: 'Textarea',
		hiddenField: 'Hidden Field',
		button: 'Button',
		select: 'Selection Field',
		imageButton: 'Image Button',
		notSet: '<nije postavljeno>',
		id: 'Id',
		name: 'Naziv',
		langDir: 'Smjer jezika',
		langDirLtr: 'S lijeva na desno (LTR)',
		langDirRtl: 'S desna na lijevo (RTL)',
		langCode: 'Kôd jezika',
		longDescr: 'Dugački opis URL',
		cssClass: 'Stylesheet klase',
		advisoryTitle: 'Advisory naslov',
		cssStyle: 'Stil',
		ok: 'OK',
		cancel: 'Poništi',
		generalTab: 'Općenito',
		advancedTab: 'Napredno',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Ubaci posebne znakove',
		title: 'Odaberite posebni karakter'
	},

	// Link dialog.
	link: {
		toolbar: 'Ubaci/promijeni link', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Promijeni link',
		title: 'Link',
		info: 'Link Info',
		target: 'Meta',
		upload: 'Pošalji',
		advanced: 'Napredno',
		type: 'Link vrsta',
		toAnchor: 'Sidro na ovoj stranici',
		toEmail: 'E-Mail',
		target: 'Meta',
		targetNotSet: '<nije postavljeno>',
		targetFrame: '<okvir>',
		targetPopup: '<popup prozor>',
		targetNew: 'Novi prozor (_blank)',
		targetTop: 'Vršni prozor (_top)',
		targetSelf: 'Isti prozor (_self)',
		targetParent: 'Roditeljski prozor (_parent)',
		targetFrameName: 'Ime ciljnog okvira',
		targetPopupName: 'Naziv popup prozora',
		popupFeatures: 'Mogućnosti popup prozora',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Statusna traka',
		popupLocationBar: 'Traka za lokaciju',
		popupToolbar: 'Traka s alatima',
		popupMenuBar: 'Izborna traka',
		popupFullScreen: 'Cijeli ekran (IE)',
		popupScrollBars: 'Scroll traka',
		popupDependent: 'Ovisno (Netscape)',
		popupWidth: 'Širina',
		popupLeft: 'Lijeva pozicija',
		popupHeight: 'Visina',
		popupTop: 'Gornja pozicija',
		id: 'Id', // MISSING
		langDir: 'Smjer jezika',
		langDirNotSet: '<nije postavljeno>',
		langDirLTR: 'S lijeva na desno (LTR)',
		langDirRTL: 'S desna na lijevo (RTL)',
		acccessKey: 'Pristupna tipka',
		name: 'Naziv',
		langCode: 'Smjer jezika',
		tabIndex: 'Tab Indeks',
		advisoryTitle: 'Advisory naslov',
		advisoryContentType: 'Advisory vrsta sadržaja',
		cssClasses: 'Stylesheet klase',
		charset: 'Kodna stranica povezanih resursa',
		styles: 'Stil',
		selectAnchor: 'Odaberi sidro',
		anchorName: 'Po nazivu sidra',
		anchorId: 'Po Id elementa',
		emailAddress: 'E-Mail adresa',
		emailSubject: 'Naslov',
		emailBody: 'Sadržaj poruke',
		noAnchors: '(Nema dostupnih sidra)',
		noUrl: 'Molimo upišite URL link',
		noEmail: 'Molimo upišite e-mail adresu'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Ubaci/promijeni sidro',
		menu: 'Svojstva sidra',
		title: 'Svojstva sidra',
		name: 'Ime sidra',
		errorName: 'Molimo unesite ime sidra'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Pronađi i zamijeni',
		find: 'Pronađi',
		replace: 'Zamijeni',
		findWhat: 'Pronađi:',
		replaceWith: 'Zamijeni s:',
		notFoundMsg: 'Traženi tekst nije pronađen.',
		matchCase: 'Usporedi mala/velika slova',
		matchWord: 'Usporedi cijele riječi',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Zamijeni sve',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Tablica',
		title: 'Svojstva tablice',
		menu: 'Svojstva tablice',
		deleteTable: 'Izbriši tablicu',
		rows: 'Redova',
		columns: 'Kolona',
		border: 'Veličina okvira',
		align: 'Poravnanje',
		alignNotSet: '<nije postavljeno>',
		alignLeft: 'Lijevo',
		alignCenter: 'Središnje',
		alignRight: 'Desno',
		width: 'Širina',
		widthPx: 'piksela',
		widthPc: 'postotaka',
		height: 'Visina',
		cellSpace: 'Prostornost ćelija',
		cellPad: 'Razmak ćelija',
		caption: 'Naslov',
		summary: 'Sažetak',
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
			menu: 'Ćelija',
			insertBefore: 'Ubaci ćeliju prije',
			insertAfter: 'Ubaci ćeliju poslije',
			deleteCell: 'Izbriši ćelije',
			merge: 'Spoji ćelije',
			mergeRight: 'Spoji desno',
			mergeDown: 'Spoji dolje',
			splitHorizontal: 'Podijeli ćeliju vodoravno',
			splitVertical: 'Podijeli ćeliju okomito',
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
			menu: 'Red',
			insertBefore: 'Ubaci red prije',
			insertAfter: 'Ubaci red poslije',
			deleteRow: 'Izbriši redove'
		},

		column: {
			menu: 'Kolona',
			insertBefore: 'Ubaci kolonu prije',
			insertAfter: 'Ubaci kolonu poslije',
			deleteColumn: 'Izbriši kolone'
		}
	},

	// Button Dialog.
	button: {
		title: 'Image Button svojstva',
		text: 'Tekst (vrijednost)',
		type: 'Vrsta',
		typeBtn: 'Gumb',
		typeSbm: 'Pošalji',
		typeRst: 'Poništi'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Checkbox svojstva',
		radioTitle: 'Radio Button svojstva',
		value: 'Vrijednost',
		selected: 'Odabrano'
	},

	// Form Dialog.
	form: {
		title: 'Form svojstva',
		menu: 'Form svojstva',
		action: 'Akcija',
		method: 'Metoda',
		encoding: 'Encoding', // MISSING
		target: 'Meta',
		targetNotSet: '<nije postavljeno>',
		targetNew: 'Novi prozor (_blank)',
		targetTop: 'Vršni prozor (_top)',
		targetSelf: 'Isti prozor (_self)',
		targetParent: 'Roditeljski prozor (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Selection svojstva',
		selectInfo: 'Info',
		opAvail: 'Dostupne opcije',
		value: 'Vrijednost',
		size: 'Veličina',
		lines: 'linija',
		chkMulti: 'Dozvoli višestruki odabir',
		opText: 'Tekst',
		opValue: 'Vrijednost',
		btnAdd: 'Dodaj',
		btnModify: 'Promijeni',
		btnUp: 'Gore',
		btnDown: 'Dolje',
		btnSetValue: 'Postavi kao odabranu vrijednost',
		btnDelete: 'Obriši'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Textarea svojstva',
		cols: 'Kolona',
		rows: 'Redova'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Text Field svojstva',
		name: 'Ime',
		value: 'Vrijednost',
		charWidth: 'Širina',
		maxChars: 'Najviše karaktera',
		type: 'Vrsta',
		typeText: 'Tekst',
		typePass: 'Šifra'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Hidden Field svojstva',
		name: 'Ime',
		value: 'Vrijednost'
	},

	// Image Dialog.
	image: {
		title: 'Svojstva slika',
		titleButton: 'Image Button svojstva',
		menu: 'Svojstva slika',
		infoTab: 'Info slike',
		btnUpload: 'Pošalji na server',
		url: 'URL',
		upload: 'Pošalji',
		alt: 'Alternativni tekst',
		width: 'Širina',
		height: 'Visina',
		lockRatio: 'Zaključaj odnos',
		resetSize: 'Obriši veličinu',
		border: 'Okvir',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		align: 'Poravnaj',
		alignLeft: 'Lijevo',
		alignAbsBottom: 'Abs dolje',
		alignAbsMiddle: 'Abs sredina',
		alignBaseline: 'Bazno',
		alignBottom: 'Dolje',
		alignMiddle: 'Sredina',
		alignRight: 'Desno',
		alignTextTop: 'Vrh teksta',
		alignTop: 'Vrh',
		preview: 'Pregledaj',
		alertUrl: 'Unesite URL slike',
		linkTab: 'Link',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Flash svojstva',
		propertiesTab: 'Properties', // MISSING
		title: 'Flash svojstva',
		chkPlay: 'Auto Play',
		chkLoop: 'Ponavljaj',
		chkMenu: 'Omogući Flash izbornik',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Omjer',
		scaleAll: 'Prikaži sve',
		scaleNoBorder: 'Bez okvira',
		scaleFit: 'Točna veličina',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Poravnaj',
		alignLeft: 'Lijevo',
		alignAbsBottom: 'Abs dolje',
		alignAbsMiddle: 'Abs sredina',
		alignBaseline: 'Bazno',
		alignBottom: 'Dolje',
		alignMiddle: 'Sredina',
		alignRight: 'Desno',
		alignTextTop: 'Vrh teksta',
		alignTop: 'Vrh',
		quality: 'Quality', // MISSING
		qualityBest: 'Best', // MISSING
		qualityHigh: 'High', // MISSING
		qualityAutoHigh: 'Auto High', // MISSING
		qualityMedium: 'Medium', // MISSING
		qualityAutoLow: 'Auto Low', // MISSING
		qualityLow: 'Low', // MISSING
		windowModeWindow: 'Window', // MISSING
		windowModeOpaque: 'Opaque', // MISSING
		windowModeTransparent: 'Transparent', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Boja pozadine',
		width: 'Širina',
		height: 'Visina',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		validateSrc: 'Molimo upišite URL link',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Provjeri pravopis',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Nije u rječniku',
		changeTo: 'Promijeni u',
		btnIgnore: 'Zanemari',
		btnIgnoreAll: 'Zanemari sve',
		btnReplace: 'Zamijeni',
		btnReplaceAll: 'Zamijeni sve',
		btnUndo: 'Vrati',
		noSuggestions: '-Nema preporuke-',
		progress: 'Provjera u tijeku...',
		noMispell: 'Provjera završena: Nema grešaka',
		noChanges: 'Provjera završena: Nije napravljena promjena',
		oneChange: 'Provjera završena: Jedna riječ promjenjena',
		manyChanges: 'Provjera završena: Promijenjeno %1 riječi',
		ieSpellDownload: 'Provjera pravopisa nije instalirana. Želite li skinuti provjeru pravopisa?'
	},

	smiley: {
		toolbar: 'Smješko',
		title: 'Ubaci smješka'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Brojčana lista',
	bulletedlist: 'Obična lista',
	indent: 'Pomakni udesno',
	outdent: 'Pomakni ulijevo',

	justify: {
		left: 'Lijevo poravnanje',
		center: 'Središnje poravnanje',
		right: 'Desno poravnanje',
		block: 'Blok poravnanje'
	},

	blockquote: 'Blockquote',

	clipboard: {
		title: 'Zalijepi',
		cutError: 'Sigurnosne postavke Vašeg pretraživača ne dozvoljavaju operacije automatskog izrezivanja. Molimo koristite kraticu na tipkovnici (Ctrl+X).',
		copyError: 'Sigurnosne postavke Vašeg pretraživača ne dozvoljavaju operacije automatskog kopiranja. Molimo koristite kraticu na tipkovnici (Ctrl+C).',
		pasteMsg: 'Molimo zaljepite unutar doljnjeg okvira koristeći tipkovnicu (<STRONG>Ctrl+V</STRONG>) i kliknite <STRONG>OK</STRONG>.',
		securityMsg: 'Zbog sigurnosnih postavki Vašeg pretraživača, editor nema direktan pristup Vašem međuspremniku. Potrebno je ponovno zalijepiti tekst u ovaj prozor.'
	},

	pastefromword: {
		toolbar: 'Zalijepi iz Worda',
		title: 'Zalijepi iz Worda',
		advice: 'Molimo zaljepite unutar doljnjeg okvira koristeći tipkovnicu (<STRONG>Ctrl+V</STRONG>) i kliknite <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Zanemari definiciju vrste fonta',
		removeStyle: 'Ukloni definicije stilova'
	},

	pasteText: {
		button: 'Zalijepi kao čisti tekst',
		title: 'Zalijepi kao čisti tekst'
	},

	templates: {
		button: 'Predlošci',
		title: 'Predlošci sadržaja',
		insertOption: 'Zamijeni trenutne sadržaje',
		selectPromptMsg: 'Molimo odaberite predložak koji želite otvoriti<br>(stvarni sadržaj će biti izgubljen):',
		emptyListMsg: '(Nema definiranih predložaka)'
	},

	showBlocks: 'Prikaži blokove',

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
		tag_pre: 'Formatted',
		tag_address: 'Address',
		tag_h1: 'Heading 1',
		tag_h2: 'Heading 2',
		tag_h3: 'Heading 3',
		tag_h4: 'Heading 4',
		tag_h5: 'Heading 5',
		tag_h6: 'Heading 6',
		tag_div: 'Normal (DIV)'
	},

	font: {
		label: 'Font',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'Font',
		panelVoiceLabel: 'Select a font' // MISSING
	},

	fontSize: {
		label: 'Veličina',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'Veličina',
		panelVoiceLabel: 'Select a font size' // MISSING
	},

	colorButton: {
		textColorTitle: 'Boja teksta',
		bgColorTitle: 'Boja pozadine',
		auto: 'Automatski',
		more: 'Više boja...'
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

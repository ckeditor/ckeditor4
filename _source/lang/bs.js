/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Bosnian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'bs' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// Toolbar buttons without dialogs.
	source: 'HTML kôd',
	newPage: 'Novi dokument',
	save: 'Snimi',
	preview: 'Prikaži',
	cut: 'Izreži',
	copy: 'Kopiraj',
	paste: 'Zalijepi',
	print: 'Štampaj',
	underline: 'Podvuci',
	bold: 'Boldiraj',
	italic: 'Ukosi',
	selectAll: 'Selektuj sve',
	removeFormat: 'Poništi format',
	strike: 'Precrtaj',
	subscript: 'Subscript',
	superscript: 'Superscript',
	horizontalrule: 'Ubaci horizontalnu liniju',
	pagebreak: 'Insert Page Break', // MISSING
	unlink: 'Izbriši link',
	undo: 'Vrati',
	redo: 'Ponovi',

	// Common messages and labels.
	common: {
		browseServer: 'Browser Server', // MISSING
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Šalji',
		uploadSubmit: 'Šalji na server',
		image: 'Slika',
		flash: 'Flash', // MISSING
		form: 'Form', // MISSING
		checkbox: 'Checkbox', // MISSING
		radio: 'Radio Button', // MISSING
		textField: 'Text Field', // MISSING
		textarea: 'Textarea', // MISSING
		hiddenField: 'Hidden Field', // MISSING
		button: 'Button', // MISSING
		select: 'Selection Field', // MISSING
		imageButton: 'Image Button', // MISSING
		notSet: '<nije podešeno>',
		id: 'Id',
		name: 'Naziv',
		langDir: 'Smjer pisanja',
		langDirLtr: 'S lijeva na desno (LTR)',
		langDirRtl: 'S desna na lijevo (RTL)',
		langCode: 'Jezièni kôd',
		longDescr: 'Dugaèki opis URL-a',
		cssClass: 'Klase CSS stilova',
		advisoryTitle: 'Advisory title',
		cssStyle: 'Stil',
		ok: 'OK',
		cancel: 'Odustani',
		generalTab: 'General', // MISSING
		advancedTab: 'Naprednije',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Ubaci specijalni karater',
		title: 'Izaberi specijalni karakter'
	},

	// Link dialog.
	link: {
		toolbar: 'Ubaci/Izmjeni link', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Izmjeni link',
		title: 'Link',
		info: 'Link info',
		target: 'Prozor',
		upload: 'Šalji',
		advanced: 'Naprednije',
		type: 'Tip linka',
		toAnchor: 'Sidro na ovoj stranici',
		toEmail: 'E-Mail',
		target: 'Prozor',
		targetNotSet: '<nije podešeno>',
		targetFrame: '<frejm>',
		targetPopup: '<popup prozor>',
		targetNew: 'Novi prozor (_blank)',
		targetTop: 'Najgornji prozor (_top)',
		targetSelf: 'Isti prozor (_self)',
		targetParent: 'Glavni prozor (_parent)',
		targetFrameName: 'Target Frame Name', // MISSING
		targetPopupName: 'Naziv popup prozora',
		popupFeatures: 'Moguænosti popup prozora',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Statusna traka',
		popupLocationBar: 'Traka za lokaciju',
		popupToolbar: 'Traka sa alatima',
		popupMenuBar: 'Izborna traka',
		popupFullScreen: 'Cijeli ekran (IE)',
		popupScrollBars: 'Scroll traka',
		popupDependent: 'Ovisno (Netscape)',
		popupWidth: 'Širina',
		popupLeft: 'Lijeva pozicija',
		popupHeight: 'Visina',
		popupTop: 'Gornja pozicija',
		id: 'Id', // MISSING
		langDir: 'Smjer pisanja',
		langDirNotSet: '<nije podešeno>',
		langDirLTR: 'S lijeva na desno (LTR)',
		langDirRTL: 'S desna na lijevo (RTL)',
		acccessKey: 'Pristupna tipka',
		name: 'Naziv',
		langCode: 'Smjer pisanja',
		tabIndex: 'Tab indeks',
		advisoryTitle: 'Advisory title',
		advisoryContentType: 'Advisory vrsta sadržaja',
		cssClasses: 'Klase CSS stilova',
		charset: 'Linked Resource Charset',
		styles: 'Stil',
		selectAnchor: 'Izaberi sidro',
		anchorName: 'Po nazivu sidra',
		anchorId: 'Po Id-u elementa',
		emailAddress: 'E-Mail Adresa',
		emailSubject: 'Subjekt poruke',
		emailBody: 'Poruka',
		noAnchors: '(Nema dostupnih sidra na stranici)',
		noUrl: 'Molimo ukucajte URL link',
		noEmail: 'Molimo ukucajte e-mail adresu'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Anchor', // MISSING
		menu: 'Edit Anchor', // MISSING
		title: 'Anchor Properties', // MISSING
		name: 'Anchor Name', // MISSING
		errorName: 'Please type the anchor name' // MISSING
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Find and Replace', // MISSING
		find: 'Naði',
		replace: 'Zamjeni',
		findWhat: 'Naði šta:',
		replaceWith: 'Zamjeni sa:',
		notFoundMsg: 'Traženi tekst nije pronaðen.',
		matchCase: 'Uporeðuj velika/mala slova',
		matchWord: 'Uporeðuj samo cijelu rijeè',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Zamjeni sve',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Tabela',
		title: 'Svojstva tabele',
		menu: 'Svojstva tabele',
		deleteTable: 'Delete Table', // MISSING
		rows: 'Redova',
		columns: 'Kolona',
		border: 'Okvir',
		align: 'Poravnanje',
		alignNotSet: '<Nije podešeno>',
		alignLeft: 'Lijevo',
		alignCenter: 'Centar',
		alignRight: 'Desno',
		width: 'Širina',
		widthPx: 'piksela',
		widthPc: 'posto',
		height: 'Visina',
		cellSpace: 'Razmak æelija',
		cellPad: 'Uvod æelija',
		caption: 'Naslov',
		summary: 'Summary', // MISSING
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
			menu: 'Cell', // MISSING
			insertBefore: 'Insert Cell Before', // MISSING
			insertAfter: 'Insert Cell After', // MISSING
			deleteCell: 'Briši æelije',
			merge: 'Spoji æelije',
			mergeRight: 'Merge Right', // MISSING
			mergeDown: 'Merge Down', // MISSING
			splitHorizontal: 'Split Cell Horizontally', // MISSING
			splitVertical: 'Split Cell Vertically' // MISSING
		},

		row: {
			menu: 'Row', // MISSING
			insertBefore: 'Insert Row Before', // MISSING
			insertAfter: 'Insert Row After', // MISSING
			deleteRow: 'Briši redove'
		},

		column: {
			menu: 'Column', // MISSING
			insertBefore: 'Insert Column Before', // MISSING
			insertAfter: 'Insert Column After', // MISSING
			deleteColumn: 'Briši kolone'
		}
	},

	// Button Dialog.
	button: {
		title: 'Button Properties', // MISSING
		text: 'Text (Value)', // MISSING
		type: 'Type', // MISSING
		typeBtn: 'Button', // MISSING
		typeSbm: 'Submit', // MISSING
		typeRst: 'Reset' // MISSING
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Checkbox Properties', // MISSING
		radioTitle: 'Radio Button Properties', // MISSING
		value: 'Value', // MISSING
		selected: 'Selected' // MISSING
	},

	// Form Dialog.
	form: {
		title: 'Form Properties', // MISSING
		menu: 'Form Properties', // MISSING
		action: 'Action', // MISSING
		method: 'Method', // MISSING
		encoding: 'Encoding', // MISSING
		target: 'Prozor',
		targetNotSet: '<nije podešeno>',
		targetNew: 'Novi prozor (_blank)',
		targetTop: 'Najgornji prozor (_top)',
		targetSelf: 'Isti prozor (_self)',
		targetParent: 'Glavni prozor (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Selection Field Properties', // MISSING
		selectInfo: 'Select Info', // MISSING
		opAvail: 'Available Options', // MISSING
		value: 'Value', // MISSING
		size: 'Size', // MISSING
		lines: 'lines', // MISSING
		chkMulti: 'Allow multiple selections', // MISSING
		opText: 'Text', // MISSING
		opValue: 'Value', // MISSING
		btnAdd: 'Add', // MISSING
		btnModify: 'Modify', // MISSING
		btnUp: 'Up', // MISSING
		btnDown: 'Down', // MISSING
		btnSetValue: 'Set as selected value', // MISSING
		btnDelete: 'Delete' // MISSING
	},

	// Textarea Dialog.
	textarea: {
		title: 'Textarea Properties', // MISSING
		cols: 'Columns', // MISSING
		rows: 'Rows' // MISSING
	},

	// Text Field Dialog.
	textfield: {
		title: 'Text Field Properties', // MISSING
		name: 'Name', // MISSING
		value: 'Value', // MISSING
		charWidth: 'Character Width', // MISSING
		maxChars: 'Maximum Characters', // MISSING
		type: 'Type', // MISSING
		typeText: 'Text', // MISSING
		typePass: 'Password' // MISSING
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Hidden Field Properties', // MISSING
		name: 'Name', // MISSING
		value: 'Value' // MISSING
	},

	// Image Dialog.
	image: {
		title: 'Svojstva slike',
		titleButton: 'Image Button Properties', // MISSING
		menu: 'Svojstva slike',
		infoTab: 'Info slike',
		btnUpload: 'Šalji na server',
		url: 'URL',
		upload: 'Šalji',
		alt: 'Tekst na slici',
		width: 'Širina',
		height: 'Visina',
		lockRatio: 'Zakljuèaj odnos',
		resetSize: 'Resetuj dimenzije',
		border: 'Okvir',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		align: 'Poravnanje',
		alignLeft: 'Lijevo',
		alignAbsBottom: 'Abs dole',
		alignAbsMiddle: 'Abs sredina',
		alignBaseline: 'Bazno',
		alignBottom: 'Dno',
		alignMiddle: 'Sredina',
		alignRight: 'Desno',
		alignTextTop: 'Vrh teksta',
		alignTop: 'Vrh',
		preview: 'Prikaz',
		alertUrl: 'Molimo ukucajte URL od slike.',
		linkTab: 'Link', // MISSING
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Flash Properties', // MISSING
		propertiesTab: 'Properties', // MISSING
		title: 'Flash Properties', // MISSING
		chkPlay: 'Auto Play', // MISSING
		chkLoop: 'Loop', // MISSING
		chkMenu: 'Enable Flash Menu', // MISSING
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Scale', // MISSING
		scaleAll: 'Show all', // MISSING
		scaleNoBorder: 'No Border', // MISSING
		scaleFit: 'Exact Fit', // MISSING
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Poravnanje',
		alignLeft: 'Lijevo',
		alignAbsBottom: 'Abs dole',
		alignAbsMiddle: 'Abs sredina',
		alignBaseline: 'Bazno',
		alignBottom: 'Dno',
		alignMiddle: 'Sredina',
		alignRight: 'Desno',
		alignTextTop: 'Vrh teksta',
		alignTop: 'Vrh',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Boja pozadine',
		width: 'Širina',
		height: 'Visina',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		validateSrc: 'Molimo ukucajte URL link',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Check Spelling', // MISSING
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Not in dictionary', // MISSING
		changeTo: 'Change to', // MISSING
		btnIgnore: 'Ignore', // MISSING
		btnIgnoreAll: 'Ignore All', // MISSING
		btnReplace: 'Replace', // MISSING
		btnReplaceAll: 'Replace All', // MISSING
		btnUndo: 'Undo', // MISSING
		noSuggestions: '- No suggestions -', // MISSING
		progress: 'Spell check in progress...', // MISSING
		noMispell: 'Spell check complete: No misspellings found', // MISSING
		noChanges: 'Spell check complete: No words changed', // MISSING
		oneChange: 'Spell check complete: One word changed', // MISSING
		manyChanges: 'Spell check complete: %1 words changed', // MISSING
		ieSpellDownload: 'Spell checker not installed. Do you want to download it now?' // MISSING
	},

	smiley: {
		toolbar: 'Smješko',
		title: 'Ubaci smješka'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Numerisana lista',
	bulletedlist: 'Lista',
	indent: 'Poveæaj uvod',
	outdent: 'Smanji uvod',

	justify: {
		left: 'Lijevo poravnanje',
		center: 'Centralno poravnanje',
		right: 'Desno poravnanje',
		block: 'Puno poravnanje'
	},

	outdent: 'Smanji uvod',
	blockquote: 'Blockquote', // MISSING

	clipboard: {
		title: 'Zalijepi',
		cutError: 'Sigurnosne postavke vašeg pretraživaèa ne dozvoljavaju operacije automatskog rezanja. Molimo koristite kraticu na tastaturi (Ctrl+X).',
		copyError: 'Sigurnosne postavke Vašeg pretraživaèa ne dozvoljavaju operacije automatskog kopiranja. Molimo koristite kraticu na tastaturi (Ctrl+C).',
		pasteMsg: 'Please paste inside the following box using the keyboard (Ctrl+V) and hit OK', // MISSING
		securityMsg: 'Because of your browser security settings, the editor is not able to access your clipboard data directly. You are required to paste it again in this window.' // MISSING
	},

	pastefromword: {
		toolbar: 'Zalijepi iz Word-a',
		title: 'Zalijepi iz Word-a',
		advice: 'Please paste inside the following box using the keyboard (<strong>Ctrl+V</strong>) and hit <strong>OK</strong>.', // MISSING
		ignoreFontFace: 'Ignore Font Face definitions', // MISSING
		removeStyle: 'Remove Styles definitions' // MISSING
	},

	pasteText: {
		button: 'Zalijepi kao obièan tekst',
		title: 'Zalijepi kao obièan tekst'
	},

	templates: {
		button: 'Templates', // MISSING
		title: 'Content Templates', // MISSING
		insertOption: 'Replace actual contents', // MISSING
		selectPromptMsg: 'Please select the template to open in the editor', // MISSING
		emptyListMsg: '(No templates defined)' // MISSING
	},

	showBlocks: 'Show Blocks', // MISSING

	stylesCombo: {
		label: 'Stil',
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Format',
		panelTitle: 'Format',

		tag_p: 'Normal',
		tag_pre: 'Formatted',
		tag_address: 'Address',
		tag_h1: 'Heading 1',
		tag_h2: 'Heading 2',
		tag_h3: 'Heading 3',
		tag_h4: 'Heading 4',
		tag_h5: 'Heading 5',
		tag_h6: 'Heading 6',
		tag_div: 'Normal (DIV)' // MISSING
	},

	font: {
		label: 'Font',
		panelTitle: 'Font'
	},

	fontSize: {
		label: 'Velièina',
		panelTitle: 'Velièina'
	},

	colorButton: {
		textColorTitle: 'Boja teksta',
		bgColorTitle: 'Boja pozadine',
		auto: 'Automatska',
		more: 'Više boja...'
	}
};

/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Basque language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'eu' ] = {
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
	source: 'HTML Iturburua',
	newPage: 'Orrialde Berria',
	save: 'Gorde',
	preview: 'Aurrebista',
	cut: 'Ebaki',
	copy: 'Kopiatu',
	paste: 'Itsatsi',
	print: 'Inprimatu',
	underline: 'Azpimarratu',
	bold: 'Lodia',
	italic: 'Etzana',
	selectAll: 'Hautatu dena',
	removeFormat: 'Kendu Formatua',
	strike: 'Marratua',
	subscript: 'Azpi-indize',
	superscript: 'Goi-indize',
	horizontalrule: 'Txertatu Marra Horizontala',
	pagebreak: 'Txertatu Orrialde-jauzia',
	unlink: 'Kendu Esteka',
	undo: 'Desegin',
	redo: 'Berregin',

	// Common messages and labels.
	common: {
		browseServer: 'Zerbitzaria arakatu',
		url: 'URL',
		protocol: 'Protokoloa',
		upload: 'Gora kargatu',
		uploadSubmit: 'Zerbitzarira bidalia',
		image: 'Irudia',
		flash: 'Flasha',
		form: 'Formularioa',
		checkbox: 'Kontrol-laukia',
		radio: 'Aukera-botoia',
		textField: 'Testu Eremua',
		textarea: 'Testu-area',
		hiddenField: 'Ezkutuko Eremua',
		button: 'Botoia',
		select: 'Hautespen Eremua',
		imageButton: 'Irudi Botoia',
		notSet: '<Ezarri gabe>',
		id: 'Id',
		name: 'Izena',
		langDir: 'Hizkuntzaren Norabidea',
		langDirLtr: 'Ezkerretik Eskumara(LTR)',
		langDirRtl: 'Eskumatik Ezkerrera (RTL)',
		langCode: 'Hizkuntza Kodea',
		longDescr: 'URL Deskribapen Luzea',
		cssClass: 'Estilo-orriko Klaseak',
		advisoryTitle: 'Izenburua',
		cssStyle: 'Estiloa',
		ok: 'Ados',
		cancel: 'Utzi',
		generalTab: 'Orokorra',
		advancedTab: 'Aurreratua',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Txertatu Karaktere Berezia',
		title: 'Karaktere Berezia Aukeratu'
	},

	// Link dialog.
	link: {
		toolbar: 'Txertatu/Editatu Esteka', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Aldatu Esteka',
		title: 'Esteka',
		info: 'Estekaren Informazioa',
		target: 'Target (Helburua)',
		upload: 'Gora kargatu',
		advanced: 'Aurreratua',
		type: 'Esteka Mota',
		toAnchor: 'Aingura orrialde honetan',
		toEmail: 'ePosta',
		target: 'Target (Helburua)',
		targetNotSet: '<Ezarri gabe>',
		targetFrame: '<marko>',
		targetPopup: '<popup leihoa>',
		targetNew: 'Leiho Berria (_blank)',
		targetTop: 'Goiko Leihoa (_top)',
		targetSelf: 'Leiho Berdina (_self)',
		targetParent: 'Leiho Gurasoa (_parent)',
		targetFrameName: 'Marko Helburuaren Izena',
		targetPopupName: 'Popup Leihoaren Izena',
		popupFeatures: 'Popup Leihoaren Ezaugarriak',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Egoera Barra',
		popupLocationBar: 'Kokaleku Barra',
		popupToolbar: 'Tresna Barra',
		popupMenuBar: 'Menu Barra',
		popupFullScreen: 'Pantaila Osoa (IE)',
		popupScrollBars: 'Korritze Barrak',
		popupDependent: 'Menpekoa (Netscape)',
		popupWidth: 'Zabalera',
		popupLeft: 'Ezkerreko  Posizioa',
		popupHeight: 'Altuera',
		popupTop: 'Goiko Posizioa',
		id: 'Id', // MISSING
		langDir: 'Hizkuntzaren Norabidea',
		langDirNotSet: '<Ezarri gabe>',
		langDirLTR: 'Ezkerretik Eskumara(LTR)',
		langDirRTL: 'Eskumatik Ezkerrera (RTL)',
		acccessKey: 'Sarbide-gakoa',
		name: 'Izena',
		langCode: 'Hizkuntzaren Norabidea',
		tabIndex: 'Tabulazio Indizea',
		advisoryTitle: 'Izenburua',
		advisoryContentType: 'Eduki Mota (Content Type)',
		cssClasses: 'Estilo-orriko Klaseak',
		charset: 'Estekatutako Karaktere Multzoa',
		styles: 'Estiloa',
		selectAnchor: 'Aingura bat hautatu',
		anchorName: 'Aingura izenagatik',
		anchorId: 'Elementuaren ID-gatik',
		emailAddress: 'ePosta Helbidea',
		emailSubject: 'Mezuaren Gaia',
		emailBody: 'Mezuaren Gorputza',
		noAnchors: '(Ez daude aingurak eskuragarri dokumentuan)',
		noUrl: 'Mesedez URL esteka idatzi',
		noEmail: 'Mesedez ePosta helbidea idatzi'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Aingura',
		menu: 'Ainguraren Ezaugarriak',
		title: 'Ainguraren Ezaugarriak',
		name: 'Ainguraren Izena',
		errorName: 'Idatzi ainguraren izena'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Bilatu eta Ordeztu',
		find: 'Bilatu',
		replace: 'Ordezkatu',
		findWhat: 'Zer bilatu:',
		replaceWith: 'Zerekin ordeztu:',
		notFoundMsg: 'Idatzitako testua ez da topatu.',
		matchCase: 'Maiuskula/minuskula',
		matchWord: 'Esaldi osoa bilatu',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Ordeztu Guztiak',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Taula',
		title: 'Taularen Ezaugarriak',
		menu: 'Taularen Ezaugarriak',
		deleteTable: 'Ezabatu Taula',
		rows: 'Lerroak',
		columns: 'Zutabeak',
		border: 'Ertzaren Zabalera',
		align: 'Lerrokatu',
		alignNotSet: '<Ezarri gabe>',
		alignLeft: 'Ezkerrean',
		alignCenter: 'Erdian',
		alignRight: 'Eskuman',
		width: 'Zabalera',
		widthPx: 'pixel',
		widthPc: 'ehuneko',
		height: 'Altuera',
		cellSpace: 'Gelaxka arteko tartea',
		cellPad: 'Gelaxken betegarria',
		caption: 'Epigrafea',
		summary: 'Laburpena',
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
			menu: 'Gelaxka',
			insertBefore: 'Txertatu Gelaxka Aurretik',
			insertAfter: 'Txertatu Gelaxka Ostean',
			deleteCell: 'Kendu Gelaxkak',
			merge: 'Batu Gelaxkak',
			mergeRight: 'Elkartu Eskumara',
			mergeDown: 'Elkartu Behera',
			splitHorizontal: 'Banatu Gelaxkak Horizontalki',
			splitVertical: 'Banatu Gelaxkak Bertikalki',
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
			menu: 'Errenkada',
			insertBefore: 'Txertatu Lerroa Aurretik',
			insertAfter: 'Txertatu Lerroa Ostean',
			deleteRow: 'Ezabatu Errenkadak'
		},

		column: {
			menu: 'Zutabea',
			insertBefore: 'Txertatu Zutabea Aurretik',
			insertAfter: 'Txertatu Zutabea Ostean',
			deleteColumn: 'Ezabatu Zutabeak'
		}
	},

	// Button Dialog.
	button: {
		title: 'Botoiaren Ezaugarriak',
		text: 'Testua (Balorea)',
		type: 'Mota',
		typeBtn: 'Botoia',
		typeSbm: 'Bidali',
		typeRst: 'Garbitu'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Kontrol-laukiko Ezaugarriak',
		radioTitle: 'Aukera-botoiaren Ezaugarriak',
		value: 'Balorea',
		selected: 'Hautatuta'
	},

	// Form Dialog.
	form: {
		title: 'Formularioaren Ezaugarriak',
		menu: 'Formularioaren Ezaugarriak',
		action: 'Ekintza',
		method: 'Metodoa',
		encoding: 'Encoding', // MISSING
		target: 'Target (Helburua)',
		targetNotSet: '<Ezarri gabe>',
		targetNew: 'Leiho Berria (_blank)',
		targetTop: 'Goiko Leihoa (_top)',
		targetSelf: 'Leiho Berdina (_self)',
		targetParent: 'Leiho Gurasoa (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Hautespen Eremuaren Ezaugarriak',
		selectInfo: 'Informazioa',
		opAvail: 'Aukera Eskuragarriak',
		value: 'Balorea',
		size: 'Tamaina',
		lines: 'lerro kopurura',
		chkMulti: 'Hautaketa anitzak baimendu',
		opText: 'Testua',
		opValue: 'Balorea',
		btnAdd: 'Gehitu',
		btnModify: 'Aldatu',
		btnUp: 'Gora',
		btnDown: 'Behera',
		btnSetValue: 'Aukeratutako balorea ezarri',
		btnDelete: 'Ezabatu'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Testu-arearen Ezaugarriak',
		cols: 'Zutabeak',
		rows: 'Lerroak'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Testu Eremuaren Ezaugarriak',
		name: 'Izena',
		value: 'Balorea',
		charWidth: 'Zabalera',
		maxChars: 'Zenbat karaktere gehienez',
		type: 'Mota',
		typeText: 'Testua',
		typePass: 'Pasahitza'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Ezkutuko Eremuaren Ezaugarriak',
		name: 'Izena',
		value: 'Balorea'
	},

	// Image Dialog.
	image: {
		title: 'Irudi Ezaugarriak',
		titleButton: 'Irudi Botoiaren Ezaugarriak',
		menu: 'Irudi Ezaugarriak',
		infoTab: 'Irudi informazioa',
		btnUpload: 'Zerbitzarira bidalia',
		url: 'URL',
		upload: 'Gora Kargatu',
		alt: 'Ordezko Testua',
		width: 'Zabalera',
		height: 'Altuera',
		lockRatio: 'Erlazioa Blokeatu',
		resetSize: 'Tamaina Berrezarri',
		border: 'Ertza',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		align: 'Lerrokatu',
		alignLeft: 'Ezkerrera',
		alignAbsBottom: 'Abs Behean',
		alignAbsMiddle: 'Abs Erdian',
		alignBaseline: 'Oinan',
		alignBottom: 'Behean',
		alignMiddle: 'Erdian',
		alignRight: 'Eskuman',
		alignTextTop: 'Testua Goian',
		alignTop: 'Goian',
		preview: 'Aurrebista',
		alertUrl: 'Mesedez Irudiaren URLa idatzi',
		linkTab: 'Esteka',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Flasharen Ezaugarriak',
		propertiesTab: 'Properties', // MISSING
		title: 'Flasharen Ezaugarriak',
		chkPlay: 'Automatikoki Erreproduzitu',
		chkLoop: 'Begizta',
		chkMenu: 'Flasharen Menua Gaitu',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Eskalatu',
		scaleAll: 'Dena erakutsi',
		scaleNoBorder: 'Ertzik gabe',
		scaleFit: 'Doitu',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Lerrokatu',
		alignLeft: 'Ezkerrera',
		alignAbsBottom: 'Abs Behean',
		alignAbsMiddle: 'Abs Erdian',
		alignBaseline: 'Oinan',
		alignBottom: 'Behean',
		alignMiddle: 'Erdian',
		alignRight: 'Eskuman',
		alignTextTop: 'Testua Goian',
		alignTop: 'Goian',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Atzeko kolorea',
		width: 'Zabalera',
		height: 'Altuera',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		validateSrc: 'Mesedez URL esteka idatzi',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Ortografia',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Ez dago hiztegian',
		changeTo: 'Honekin ordezkatu',
		btnIgnore: 'Ezikusi',
		btnIgnoreAll: 'Denak Ezikusi',
		btnReplace: 'Ordezkatu',
		btnReplaceAll: 'Denak Ordezkatu',
		btnUndo: 'Desegin',
		noSuggestions: '- Iradokizunik ez -',
		progress: 'Zuzenketa ortografikoa martxan...',
		noMispell: 'Zuzenketa ortografikoa bukatuta: Akatsik ez',
		noChanges: 'Zuzenketa ortografikoa bukatuta: Ez da ezer aldatu',
		oneChange: 'Zuzenketa ortografikoa bukatuta: Hitz bat aldatu da',
		manyChanges: 'Zuzenketa ortografikoa bukatuta: %1 hitz aldatu dira',
		ieSpellDownload: 'Zuzentzaile ortografikoa ez dago instalatuta. Deskargatu nahi duzu?'
	},

	smiley: {
		toolbar: 'Aurpegierak',
		title: 'Aurpegiera Sartu'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Zenbakidun Zerrenda',
	bulletedlist: 'Buletdun Zerrenda',
	indent: 'Handitu Koska',
	outdent: 'Txikitu Koska',

	justify: {
		left: 'Lerrokatu Ezkerrean',
		center: 'Lerrokatu Erdian',
		right: 'Lerrokatu Eskuman',
		block: 'Justifikatu'
	},

	outdent: 'Txikitu Koska',
	blockquote: 'Aipamen blokea',

	clipboard: {
		title: 'Itsatsi',
		cutError: 'Zure web nabigatzailearen segurtasun ezarpenak testuak automatikoki moztea ez dute baimentzen. Mesedez teklatua erabili ezazu (Ctrl+X).',
		copyError: 'Zure web nabigatzailearen segurtasun ezarpenak testuak automatikoki kopiatzea ez dute baimentzen. Mesedez teklatua erabili ezazu (Ctrl+C).',
		pasteMsg: 'Mesedez teklatua erabilita (<STRONG>Ctrl+V</STRONG>) ondorego eremuan testua itsatsi eta <STRONG>OK</STRONG> sakatu.',
		securityMsg: 'Nabigatzailearen segurtasun ezarpenak direla eta, editoreak ezin du arbela zuzenean erabili. Leiho honetan berriro itsatsi behar duzu.'
	},

	pastefromword: {
		toolbar: 'Itsatsi Word-etik',
		title: 'Itsatsi Word-etik',
		advice: 'Mesedez teklatua erabilita (<STRONG>Ctrl+V</STRONG>) ondorego eremuan testua itsatsi eta <STRONG>OK</STRONG> sakatu.',
		ignoreFontFace: 'Letra Motaren definizioa ezikusi',
		removeStyle: 'Estilo definizioak kendu'
	},

	pasteText: {
		button: 'Testu Arrunta bezala Itsatsi',
		title: 'Testu Arrunta bezala Itsatsi'
	},

	templates: {
		button: 'Txantiloiak',
		title: 'Eduki Txantiloiak',
		insertOption: 'Ordeztu oraingo edukiak',
		selectPromptMsg: 'Mesedez txantiloia aukeratu editorean kargatzeko<br>(orain dauden edukiak galduko dira):',
		emptyListMsg: '(Ez dago definitutako txantiloirik)'
	},

	showBlocks: 'Blokeak erakutsi',

	stylesCombo: {
		label: 'Estiloa',
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Formatua',
		panelTitle: 'Formatua',

		tag_p: 'Arrunta',
		tag_pre: 'Formateatua',
		tag_address: 'Helbidea',
		tag_h1: 'Izenburua 1',
		tag_h2: 'Izenburua 2',
		tag_h3: 'Izenburua 3',
		tag_h4: 'Izenburua 4',
		tag_h5: 'Izenburua 5',
		tag_h6: 'Izenburua 6',
		tag_div: 'Paragrafoa (DIV)'
	},

	font: {
		label: 'Letra-tipoa',
		panelTitle: 'Letra-tipoa'
	},

	fontSize: {
		label: 'Tamaina',
		panelTitle: 'Tamaina'
	},

	colorButton: {
		textColorTitle: 'Testu Kolorea',
		bgColorTitle: 'Atzeko kolorea',
		auto: 'Automatikoa',
		more: 'Kolore gehiago...'
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

	about: {
		title: 'About CKEditor', // MISSING
		moreInfo: 'For licensing information please visit our web site:', // MISSING
		copy: 'Copyright &copy; $1. All rights reserved.' // MISSING
	},

	maximize: 'Maximize' // MISSING
};

/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Faroese language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'fo' ] = {
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
	editorTitle: 'Rich text editor, %1, press ALT 0 for help.', // MISSING

	// ARIA descriptions.
	toolbar: 'Toolbar', // MISSING
	editor: 'Rich Text Editor', // MISSING

	// Toolbar buttons without dialogs.
	source: 'Kelda',
	newPage: 'Nýggj síða',
	save: 'Goym',
	preview: 'Frumsýning',
	cut: 'Kvett',
	copy: 'Avrita',
	paste: 'Innrita',
	print: 'Prenta',
	underline: 'Undirstrikað',
	bold: 'Feit skrift',
	italic: 'Skráskrift',
	selectAll: 'Markera alt',
	removeFormat: 'Strika sniðgeving',
	strike: 'Yvirstrikað',
	subscript: 'Lækkað skrift',
	superscript: 'Hækkað skrift',
	horizontalrule: 'Ger vatnrætta linju',
	pagebreak: 'Ger síðuskift',
	unlink: 'Strika tilknýti',
	undo: 'Angra',
	redo: 'Vend aftur',

	// Common messages and labels.
	common: {
		browseServer: 'Ambætarakagi',
		url: 'URL',
		protocol: 'Protokoll',
		upload: 'Send til ambætaran',
		uploadSubmit: 'Send til ambætaran',
		image: 'Myndir',
		flash: 'Flash',
		form: 'Formur',
		checkbox: 'Flugubein',
		radio: 'Radioknøttur',
		textField: 'Tekstteigur',
		textarea: 'Tekstumráði',
		hiddenField: 'Fjaldur teigur',
		button: 'Knøttur',
		select: 'Valskrá',
		imageButton: 'Myndaknøttur',
		notSet: '<ikki sett>',
		id: 'Id',
		name: 'Navn',
		langDir: 'Tekstkós',
		langDirLtr: 'Frá vinstru til høgru (LTR)',
		langDirRtl: 'Frá høgru til vinstru (RTL)',
		langCode: 'Málkoda',
		longDescr: 'Víðkað URL frágreiðing',
		cssClass: 'Typografi klassar',
		advisoryTitle: 'Vegleiðandi heiti',
		cssStyle: 'Typografi',
		ok: 'Góðkent',
		cancel: 'Avlýst',
		close: 'Close', // MISSING
		preview: 'Preview', // MISSING
		generalTab: 'Generelt',
		advancedTab: 'Fjølbroytt',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING
		options: 'Options', // MISSING
		target: 'Target', // MISSING
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	},

	contextmenu: {
		options: 'Context Menu Options' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Set inn sertekn',
		title: 'Vel sertekn',
		options: 'Special Character Options' // MISSING
	},

	// Link dialog.
	link: {
		toolbar: 'Ger/broyt tilknýti',
		other: '<other>', // MISSING
		menu: 'Broyt tilknýti',
		title: 'Tilknýti',
		info: 'Tilknýtis upplýsingar',
		target: 'Mál',
		upload: 'Send til ambætaran',
		advanced: 'Fjølbroytt',
		type: 'Tilknýtisslag',
		toUrl: 'URL', // MISSING
		toAnchor: 'Tilknýti til marknastein í tekstinum',
		toEmail: 'Teldupostur',
		targetFrame: '<ramma>',
		targetPopup: '<popup vindeyga>',
		targetFrameName: 'Vís navn vindeygans',
		targetPopupName: 'Popup vindeygans navn',
		popupFeatures: 'Popup vindeygans víðkaðu eginleikar',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Støðufrágreiðingarbjálki',
		popupLocationBar: 'Adressulinja',
		popupToolbar: 'Amboðsbjálki',
		popupMenuBar: 'Skrábjálki',
		popupFullScreen: 'Fullur skermur (IE)',
		popupScrollBars: 'Rullibjálki',
		popupDependent: 'Bundið (Netscape)',
		popupWidth: 'Breidd',
		popupLeft: 'Frástøða frá vinstru',
		popupHeight: 'Hædd',
		popupTop: 'Frástøða frá íerva',
		id: 'Id', // MISSING
		langDir: 'Tekstkós',
		langDirLTR: 'Frá vinstru til høgru (LTR)',
		langDirRTL: 'Frá høgru til vinstru (RTL)',
		acccessKey: 'Snarvegisknappur',
		name: 'Navn',
		langCode: 'Tekstkós',
		tabIndex: 'Inntriv indeks',
		advisoryTitle: 'Vegleiðandi heiti',
		advisoryContentType: 'Vegleiðandi innihaldsslag',
		cssClasses: 'Typografi klassar',
		charset: 'Atknýtt teknsett',
		styles: 'Typografi',
		selectAnchor: 'Vel ein marknastein',
		anchorName: 'Eftir navni á marknasteini',
		anchorId: 'Eftir element Id',
		emailAddress: 'Teldupost-adressa',
		emailSubject: 'Evni',
		emailBody: 'Breyðtekstur',
		noAnchors: '(Eingir marknasteinar eru í hesum dokumentið)',
		noUrl: 'Vinarliga skriva tilknýti (URL)',
		noEmail: 'Vinarliga skriva teldupost-adressu'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Ger/broyt marknastein',
		menu: 'Eginleikar fyri marknastein',
		title: 'Eginleikar fyri marknastein',
		name: 'Heiti marknasteinsins',
		errorName: 'Vinarliga rita marknasteinsins heiti'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Finn og broyt',
		find: 'Leita',
		replace: 'Yvirskriva',
		findWhat: 'Finn:',
		replaceWith: 'Yvirskriva við:',
		notFoundMsg: 'Leititeksturin varð ikki funnin',
		matchCase: 'Munur á stórum og smáðum bókstavum',
		matchWord: 'Bert heil orð',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Yvirskriva alt',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Tabell',
		title: 'Eginleikar fyri tabell',
		menu: 'Eginleikar fyri tabell',
		deleteTable: 'Strika tabell',
		rows: 'Røðir',
		columns: 'Kolonnur',
		border: 'Bordabreidd',
		align: 'Justering',
		alignLeft: 'Vinstrasett',
		alignCenter: 'Miðsett',
		alignRight: 'Høgrasett',
		width: 'Breidd',
		widthPx: 'pixels',
		widthPc: 'prosent',
		widthUnit: 'width unit', // MISSING
		height: 'Hædd',
		cellSpace: 'Fjarstøða millum meskar',
		cellPad: 'Meskubreddi',
		caption: 'Tabellfrágreiðing',
		summary: 'Samandráttur',
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
			menu: 'Meski',
			insertBefore: 'Set meska inn áðrenn',
			insertAfter: 'Set meska inn aftaná',
			deleteCell: 'Strika meskar',
			merge: 'Flætta meskar',
			mergeRight: 'Flætta meskar til høgru',
			mergeDown: 'Flætta saman',
			splitHorizontal: 'Kloyv meska vatnrætt',
			splitVertical: 'Kloyv meska loddrætt',
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
			invalidColSpan: 'Columns span must be a whole number.', // MISSING
			chooseColor: 'Choose' // MISSING
		},

		row: {
			menu: 'Rað',
			insertBefore: 'Set rað inn áðrenn',
			insertAfter: 'Set rað inn aftaná',
			deleteRow: 'Strika røðir'
		},

		column: {
			menu: 'Kolonna',
			insertBefore: 'Set kolonnu inn áðrenn',
			insertAfter: 'Set kolonnu inn aftaná',
			deleteColumn: 'Strika kolonnur'
		}
	},

	// Button Dialog.
	button: {
		title: 'Eginleikar fyri knøtt',
		text: 'Tekstur',
		type: 'Slag',
		typeBtn: 'Knøttur',
		typeSbm: 'Send',
		typeRst: 'Nullstilla'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Eginleikar fyri flugubein',
		radioTitle: 'Eginleikar fyri radioknøtt',
		value: 'Virði',
		selected: 'Valt'
	},

	// Form Dialog.
	form: {
		title: 'Eginleikar fyri Form',
		menu: 'Eginleikar fyri Form',
		action: 'Hending',
		method: 'Háttur',
		encoding: 'Encoding' // MISSING
	},

	// Select Field Dialog.
	select: {
		title: 'Eginleikar fyri valskrá',
		selectInfo: 'Upplýsingar',
		opAvail: 'Tøkir møguleikar',
		value: 'Virði',
		size: 'Stødd',
		lines: 'Linjur',
		chkMulti: 'Loyv fleiri valmøguleikum samstundis',
		opText: 'Tekstur',
		opValue: 'Virði',
		btnAdd: 'Legg afturat',
		btnModify: 'Broyt',
		btnUp: 'Upp',
		btnDown: 'Niður',
		btnSetValue: 'Set sum valt virði',
		btnDelete: 'Strika'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Eginleikar fyri tekstumráði',
		cols: 'kolonnur',
		rows: 'røðir'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Eginleikar fyri tekstteig',
		name: 'Navn',
		value: 'Virði',
		charWidth: 'Breidd (sjónlig tekn)',
		maxChars: 'Mest loyvdu tekn',
		type: 'Slag',
		typeText: 'Tekstur',
		typePass: 'Loyniorð'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Eginleikar fyri fjaldan teig',
		name: 'Navn',
		value: 'Virði'
	},

	// Image Dialog.
	image: {
		title: 'Myndaeginleikar',
		titleButton: 'Eginleikar fyri myndaknøtt',
		menu: 'Myndaeginleikar',
		infoTab: 'Myndaupplýsingar',
		btnUpload: 'Send til ambætaran',
		upload: 'Send',
		alt: 'Alternativur tekstur',
		width: 'Breidd',
		height: 'Hædd',
		lockRatio: 'Læs lutfallið',
		unlockRatio: 'Unlock Ratio', // MISSING
		resetSize: 'Upprunastødd',
		border: 'Bordi',
		hSpace: 'Høgri breddi',
		vSpace: 'Vinstri breddi',
		align: 'Justering',
		alignLeft: 'Vinstra',
		alignRight: 'Høgra',
		alertUrl: 'Rita slóðina til myndina',
		linkTab: 'Tilknýti',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?', // MISSING
		urlMissing: 'Image source URL is missing.', // MISSING
		validateWidth: 'Width must be a whole number.', // MISSING
		validateHeight: 'Height must be a whole number.', // MISSING
		validateBorder: 'Border must be a whole number.', // MISSING
		validateHSpace: 'HSpace must be a whole number.', // MISSING
		validateVSpace: 'VSpace must be a whole number.' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Flash eginleikar',
		propertiesTab: 'Properties', // MISSING
		title: 'Flash eginleikar',
		chkPlay: 'Avspælingin byrjar sjálv',
		chkLoop: 'Endurspæl',
		chkMenu: 'Ger Flash skrá virkna',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Skalering',
		scaleAll: 'Vís alt',
		scaleNoBorder: 'Eingin bordi',
		scaleFit: 'Neyv skalering',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Justering',
		alignLeft: 'Vinstra',
		alignAbsBottom: 'Abs botnur',
		alignAbsMiddle: 'Abs miðja',
		alignBaseline: 'Basislinja',
		alignBottom: 'Botnur',
		alignMiddle: 'Miðja',
		alignRight: 'Høgra',
		alignTextTop: 'Tekst toppur',
		alignTop: 'Ovast',
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
		bgcolor: 'Bakgrundslitur',
		width: 'Breidd',
		height: 'Hædd',
		hSpace: 'Høgri breddi',
		vSpace: 'Vinstri breddi',
		validateSrc: 'Vinarliga skriva tilknýti (URL)',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Kanna stavseting',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Finst ikki í orðabókini',
		changeTo: 'Broyt til',
		btnIgnore: 'Forfjóna',
		btnIgnoreAll: 'Forfjóna alt',
		btnReplace: 'Yvirskriva',
		btnReplaceAll: 'Yvirskriva alt',
		btnUndo: 'Angra',
		noSuggestions: '- Einki uppskot -',
		progress: 'Rættstavarin arbeiðir...',
		noMispell: 'Rættstavarain liðugur: Eingin feilur funnin',
		noChanges: 'Rættstavarain liðugur: Einki orð varð broytt',
		oneChange: 'Rættstavarain liðugur: Eitt orð er broytt',
		manyChanges: 'Rættstavarain liðugur: %1 orð broytt',
		ieSpellDownload: 'Rættstavarin er ikki tøkur í tekstviðgeranum. Vilt tú heinta hann nú?'
	},

	smiley: {
		toolbar: 'Smiley',
		title: 'Vel Smiley',
		options: 'Smiley Options' // MISSING
	},

	elementsPath: {
		eleLabel: 'Elements path', // MISSING
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Talmerktur listi',
	bulletedlist: 'Punktmerktur listi',
	indent: 'Økja reglubrotarinntriv',
	outdent: 'Minka reglubrotarinntriv',

	justify: {
		left: 'Vinstrasett',
		center: 'Miðsett',
		right: 'Høgrasett',
		block: 'Javnir tekstkantar'
	},

	blockquote: 'Blockquote',

	clipboard: {
		title: 'Innrita',
		cutError: 'Trygdaruppseting alnótskagans forðar tekstviðgeranum í at kvetta tekstin. Vinarliga nýt knappaborðið til at kvetta tekstin (Ctrl/Cmd+X).',
		copyError: 'Trygdaruppseting alnótskagans forðar tekstviðgeranum í at avrita tekstin. Vinarliga nýt knappaborðið til at avrita tekstin (Ctrl/Cmd+C).',
		pasteMsg: 'Vinarliga koyr tekstin í hendan rútin við knappaborðinum (<strong>Ctrl/Cmd+V</strong>) og klikk á <strong>Góðtak</strong>.',
		securityMsg: 'Trygdaruppseting alnótskagans forðar tekstviðgeranum í beinleiðis atgongd til avritingarminnið. Tygum mugu royna aftur í hesum rútinum.',
		pasteArea: 'Paste Area' // MISSING
	},

	pastefromword: {
		confirmCleanup: 'The text you want to paste seems to be copied from Word. Do you want to clean it before pasting?', // MISSING
		toolbar: 'Innrita frá Word',
		title: 'Innrita frá Word',
		error: 'It was not possible to clean up the pasted data due to an internal error' // MISSING
	},

	pasteText: {
		button: 'Innrita som reinan tekst',
		title: 'Innrita som reinan tekst'
	},

	templates: {
		button: 'Skabelónir',
		title: 'Innihaldsskabelónir',
		options: 'Template Options', // MISSING
		insertOption: 'Yvirskriva núverandi innihald',
		selectPromptMsg: 'Vinarliga vel ta skabelón, ið skal opnast í tekstviðgeranum<br>(Hetta yvirskrivar núverandi innihald):',
		emptyListMsg: '(Ongar skabelónir tøkar)'
	},

	showBlocks: 'Vís blokkar',

	stylesCombo: {
		label: 'Typografi',
		panelTitle: 'Formatting Styles', // MISSING
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Skriftsnið',
		panelTitle: 'Skriftsnið',

		tag_p: 'Vanligt',
		tag_pre: 'Sniðgivið',
		tag_address: 'Adressa',
		tag_h1: 'Yvirskrift 1',
		tag_h2: 'Yvirskrift 2',
		tag_h3: 'Yvirskrift 3',
		tag_h4: 'Yvirskrift 4',
		tag_h5: 'Yvirskrift 5',
		tag_h6: 'Yvirskrift 6',
		tag_div: 'Normal (DIV)' // MISSING
	},

	div: {
		title: 'Create Div Container', // MISSING
		toolbar: 'Create Div Container', // MISSING
		cssClassInputLabel: 'Stylesheet Classes', // MISSING
		styleSelectLabel: 'Style', // MISSING
		IdInputLabel: 'Id', // MISSING
		languageCodeInputLabel: ' Language Code', // MISSING
		inlineStyleInputLabel: 'Inline Style', // MISSING
		advisoryTitleInputLabel: 'Advisory Title', // MISSING
		langDirLabel: 'Language Direction', // MISSING
		langDirLTRLabel: 'Left to Right (LTR)', // MISSING
		langDirRTLLabel: 'Right to Left (RTL)', // MISSING
		edit: 'Edit Div', // MISSING
		remove: 'Remove Div' // MISSING
	},

	font: {
		label: 'Skrift',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'Skrift'
	},

	fontSize: {
		label: 'Skriftstødd',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'Skriftstødd'
	},

	colorButton: {
		textColorTitle: 'Tekstlitur',
		bgColorTitle: 'Bakgrundslitur',
		panelTitle: 'Colors', // MISSING
		auto: 'Automatiskt',
		more: 'Fleiri litir...'
	},

	colors: {
		'000': 'Black', // MISSING
		'800000': 'Maroon', // MISSING
		'8B4513': 'Saddle Brown', // MISSING
		'2F4F4F': 'Dark Slate Gray', // MISSING
		'008080': 'Teal', // MISSING
		'000080': 'Navy', // MISSING
		'4B0082': 'Indigo', // MISSING
		'696969': 'Dim Gray', // MISSING
		'B22222': 'Fire Brick', // MISSING
		'A52A2A': 'Brown', // MISSING
		'DAA520': 'Golden Rod', // MISSING
		'006400': 'Dark Green', // MISSING
		'40E0D0': 'Turquoise', // MISSING
		'0000CD': 'Medium Blue', // MISSING
		'800080': 'Purple', // MISSING
		'808080': 'Gray', // MISSING
		'F00': 'Red', // MISSING
		'FF8C00': 'Dark Orange', // MISSING
		'FFD700': 'Gold', // MISSING
		'008000': 'Green', // MISSING
		'0FF': 'Cyan', // MISSING
		'00F': 'Blue', // MISSING
		'EE82EE': 'Violet', // MISSING
		'A9A9A9': 'Dark Gray', // MISSING
		'FFA07A': 'Light Salmon', // MISSING
		'FFA500': 'Orange', // MISSING
		'FFFF00': 'Yellow', // MISSING
		'00FF00': 'Lime', // MISSING
		'AFEEEE': 'Pale Turquoise', // MISSING
		'ADD8E6': 'Light Blue', // MISSING
		'DDA0DD': 'Plum', // MISSING
		'D3D3D3': 'Light Grey', // MISSING
		'FFF0F5': 'Lavender Blush', // MISSING
		'FAEBD7': 'Antique White', // MISSING
		'FFFFE0': 'Light Yellow', // MISSING
		'F0FFF0': 'Honeydew', // MISSING
		'F0FFFF': 'Azure', // MISSING
		'F0F8FF': 'Alice Blue', // MISSING
		'E6E6FA': 'Lavender', // MISSING
		'FFF': 'White' // MISSING
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
		dlgTitle: 'About CKEditor', // MISSING
		moreInfo: 'For licensing information please visit our web site:', // MISSING
		copy: 'Copyright &copy; $1. All rights reserved.' // MISSING
	},

	maximize: 'Maximize', // MISSING
	minimize: 'Minimize', // MISSING

	fakeobjects: {
		anchor: 'Anchor', // MISSING
		flash: 'Flash Animation', // MISSING
		div: 'Page Break', // MISSING
		unknown: 'Unknown Object' // MISSING
	},

	resize: 'Drag to resize', // MISSING

	colordialog: {
		title: 'Select color', // MISSING
		highlight: 'Highlight', // MISSING
		selected: 'Selected', // MISSING
		clear: 'Clear' // MISSING
	},

	toolbarCollapse: 'Collapse Toolbar', // MISSING
	toolbarExpand: 'Expand Toolbar' // MISSING
};

/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Catalan language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'ca' ] = {
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
	source: 'Codi font',
	newPage: 'Nova Pàgina',
	save: 'Desa',
	preview: 'Visualització prèvia',
	cut: 'Retalla',
	copy: 'Copia',
	paste: 'Enganxa',
	print: 'Imprimeix',
	underline: 'Subratllat',
	bold: 'Negreta',
	italic: 'Cursiva',
	selectAll: 'Selecciona-ho tot',
	removeFormat: 'Elimina Format',
	strike: 'Barrat',
	subscript: 'Subíndex',
	superscript: 'Superíndex',
	horizontalrule: 'Insereix línia horitzontal',
	pagebreak: 'Insereix salt de pàgina',
	unlink: 'Elimina l\'enllaç',
	undo: 'Desfés',
	redo: 'Refés',

	// Common messages and labels.
	common: {
		browseServer: 'Veure servidor',
		url: 'URL',
		protocol: 'Protocol',
		upload: 'Puja',
		uploadSubmit: 'Envia-la al servidor',
		image: 'Imatge',
		flash: 'Flash',
		form: 'Formulari',
		checkbox: 'Casella de verificació',
		radio: 'Botó d\'opció',
		textField: 'Camp de text',
		textarea: 'Àrea de text',
		hiddenField: 'Camp ocult',
		button: 'Botó',
		select: 'Camp de selecció',
		imageButton: 'Botó d\'imatge',
		notSet: '<no definit>',
		id: 'Id',
		name: 'Nom',
		langDir: 'Direcció de l\'idioma',
		langDirLtr: 'D\'esquerra a dreta (LTR)',
		langDirRtl: 'De dreta a esquerra (RTL)',
		langCode: 'Codi d\'idioma',
		longDescr: 'Descripció llarga de la URL',
		cssClass: 'Classes del full d\'estil',
		advisoryTitle: 'Títol consultiu',
		cssStyle: 'Estil',
		ok: 'D\'acord',
		cancel: 'Cancel·la',
		generalTab: 'General',
		advancedTab: 'Avançat',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Insereix caràcter especial',
		title: 'Selecciona el caràcter especial'
	},

	// Link dialog.
	link: {
		toolbar: 'Insereix/Edita enllaç',
		menu: 'Edita l\'enllaç',
		title: 'Enllaç',
		info: 'Informació de l\'enllaç',
		target: 'Destí',
		upload: 'Puja',
		advanced: 'Avançat',
		type: 'Tipus d\'enllaç',
		toAnchor: 'Àncora en aquesta pàgina',
		toEmail: 'Correu electrònic',
		target: 'Destí',
		targetNotSet: '<no definit>',
		targetFrame: '<marc>',
		targetPopup: '<finestra emergent>',
		targetNew: 'Nova finestra (_blank)',
		targetTop: 'Finestra Major (_top)',
		targetSelf: 'Mateixa finestra (_self)',
		targetParent: 'Finestra pare (_parent)',
		targetFrameName: 'Nom del marc de destí',
		targetPopupName: 'Nom finestra popup',
		popupFeatures: 'Característiques finestra popup',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Barra d\'estat',
		popupLocationBar: 'Barra d\'adreça',
		popupToolbar: 'Barra d\'eines',
		popupMenuBar: 'Barra de menú',
		popupFullScreen: 'Pantalla completa (IE)',
		popupScrollBars: 'Barres d\'scroll',
		popupDependent: 'Depenent (Netscape)',
		popupWidth: 'Amplada',
		popupLeft: 'Posició esquerra',
		popupHeight: 'Alçada',
		popupTop: 'Posició dalt',
		id: 'Id', // MISSING
		langDir: 'Direcció de l\'idioma',
		langDirNotSet: '<no definit>',
		langDirLTR: 'D\'esquerra a dreta (LTR)',
		langDirRTL: 'De dreta a esquerra (RTL)',
		acccessKey: 'Clau d\'accés',
		name: 'Nom',
		langCode: 'Direcció de l\'idioma',
		tabIndex: 'Index de Tab',
		advisoryTitle: 'Títol consultiu',
		advisoryContentType: 'Tipus de contingut consultiu',
		cssClasses: 'Classes del full d\'estil',
		charset: 'Conjunt de caràcters font enllaçat',
		styles: 'Estil',
		selectAnchor: 'Selecciona una àncora',
		anchorName: 'Per nom d\'àncora',
		anchorId: 'Per Id d\'element',
		emailAddress: 'Adreça de correu electrònic',
		emailSubject: 'Assumpte del missatge',
		emailBody: 'Cos del missatge',
		noAnchors: '(No hi ha àncores disponibles en aquest document)',
		noUrl: 'Si us plau, escrigui l\'enllaç URL',
		noEmail: 'Si us plau, escrigui l\'adreça correu electrònic'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Insereix/Edita àncora',
		menu: 'Propietats de l\'àncora',
		title: 'Propietats de l\'àncora',
		name: 'Nom de l\'àncora',
		errorName: 'Si us plau, escriviu el nom de l\'ancora'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Cerca i reemplaça',
		find: 'Cerca',
		replace: 'Reemplaça',
		findWhat: 'Cerca:',
		replaceWith: 'Remplaça amb:',
		notFoundMsg: 'El text especificat no s\'ha trobat.',
		matchCase: 'Distingeix majúscules/minúscules',
		matchWord: 'Només paraules completes',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Reemplaça-ho tot',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Taula',
		title: 'Propietats de la taula',
		menu: 'Propietats de la taula',
		deleteTable: 'Suprimeix la taula',
		rows: 'Files',
		columns: 'Columnes',
		border: 'Mida vora',
		align: 'Alineació',
		alignNotSet: '<No Definit>',
		alignLeft: 'Esquerra',
		alignCenter: 'Centre',
		alignRight: 'Dreta',
		width: 'Amplada',
		widthPx: 'píxels',
		widthPc: 'percentatge',
		height: 'Alçada',
		cellSpace: 'Espaiat de cel·les',
		cellPad: 'Encoixinament de cel·les',
		caption: 'Títol',
		summary: 'Resum',
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
			menu: 'Cel·la',
			insertBefore: 'Insereix cel·la abans de',
			insertAfter: 'Insereix cel·la darrera',
			deleteCell: 'Suprimeix les cel·les',
			merge: 'Fusiona les cel·les',
			mergeRight: 'Fusiona cap a la dreta',
			mergeDown: 'Fusiona cap avall',
			splitHorizontal: 'Divideix la cel·la horitzontalment',
			splitVertical: 'Divideix la cel·la verticalment',
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
			menu: 'Fila',
			insertBefore: 'Insereix fila abans de',
			insertAfter: 'Insereix fila darrera',
			deleteRow: 'Suprimeix una fila'
		},

		column: {
			menu: 'Columna',
			insertBefore: 'Insereix columna abans de',
			insertAfter: 'Insereix columna darrera',
			deleteColumn: 'Suprimeix una columna'
		}
	},

	// Button Dialog.
	button: {
		title: 'Propietats del botó',
		text: 'Text (Valor)',
		type: 'Tipus',
		typeBtn: 'Botó',
		typeSbm: 'Transmet formulari',
		typeRst: 'Reinicia formulari'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Propietats de la casella de verificació',
		radioTitle: 'Propietats del botó d\'opció',
		value: 'Valor',
		selected: 'Seleccionat'
	},

	// Form Dialog.
	form: {
		title: 'Propietats del formulari',
		menu: 'Propietats del formulari',
		action: 'Acció',
		method: 'Mètode',
		encoding: 'Encoding', // MISSING
		target: 'Destí',
		targetNotSet: '<no definit>',
		targetNew: 'Nova finestra (_blank)',
		targetTop: 'Finestra Major (_top)',
		targetSelf: 'Mateixa finestra (_self)',
		targetParent: 'Finestra pare (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Propietats del camp de selecció',
		selectInfo: 'Info',
		opAvail: 'Opcions disponibles',
		value: 'Valor',
		size: 'Mida',
		lines: 'Línies',
		chkMulti: 'Permet múltiples seleccions',
		opText: 'Text',
		opValue: 'Valor',
		btnAdd: 'Afegeix',
		btnModify: 'Modifica',
		btnUp: 'Amunt',
		btnDown: 'Avall',
		btnSetValue: 'Selecciona per defecte',
		btnDelete: 'Elimina'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Propietats de l\'àrea de text',
		cols: 'Columnes',
		rows: 'Files'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Propietats del camp de text',
		name: 'Nom',
		value: 'Valor',
		charWidth: 'Amplada',
		maxChars: 'Nombre màxim de caràcters',
		type: 'Tipus',
		typeText: 'Text',
		typePass: 'Contrasenya'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Propietats del camp ocult',
		name: 'Nom',
		value: 'Valor'
	},

	// Image Dialog.
	image: {
		title: 'Propietats de la imatge',
		titleButton: 'Propietats del botó d\'imatge',
		menu: 'Propietats de la imatge',
		infoTab: 'Informació de la imatge',
		btnUpload: 'Envia-la al servidor',
		url: 'URL',
		upload: 'Puja',
		alt: 'Text alternatiu',
		width: 'Amplada',
		height: 'Alçada',
		lockRatio: 'Bloqueja les proporcions',
		resetSize: 'Restaura la mida',
		border: 'Vora',
		hSpace: 'Espaiat horit.',
		vSpace: 'Espaiat vert.',
		align: 'Alineació',
		alignLeft: 'Ajusta a l\'esquerra',
		alignAbsBottom: 'Abs Bottom',
		alignAbsMiddle: 'Abs Middle',
		alignBaseline: 'Baseline',
		alignBottom: 'Bottom',
		alignMiddle: 'Middle',
		alignRight: 'Ajusta a la dreta',
		alignTextTop: 'Text Top',
		alignTop: 'Top',
		preview: 'Vista prèvia',
		alertUrl: 'Si us plau, escriviu la URL de la imatge',
		linkTab: 'Enllaç',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Propietats del Flash',
		propertiesTab: 'Properties', // MISSING
		title: 'Propietats del Flash',
		chkPlay: 'Reprodució automàtica',
		chkLoop: 'Bucle',
		chkMenu: 'Habilita menú Flash',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Escala',
		scaleAll: 'Mostra-ho tot',
		scaleNoBorder: 'Sense vores',
		scaleFit: 'Mida exacta',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Alineació',
		alignLeft: 'Ajusta a l\'esquerra',
		alignAbsBottom: 'Abs Bottom',
		alignAbsMiddle: 'Abs Middle',
		alignBaseline: 'Baseline',
		alignBottom: 'Bottom',
		alignMiddle: 'Middle',
		alignRight: 'Ajusta a la dreta',
		alignTextTop: 'Text Top',
		alignTop: 'Top',
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
		bgcolor: 'Color de Fons',
		width: 'Amplada',
		height: 'Alçada',
		hSpace: 'Espaiat horit.',
		vSpace: 'Espaiat vert.',
		validateSrc: 'Si us plau, escrigui l\'enllaç URL',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Revisa l\'ortografia',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'No és al diccionari',
		changeTo: 'Reemplaça amb',
		btnIgnore: 'Ignora',
		btnIgnoreAll: 'Ignora-les totes',
		btnReplace: 'Canvia',
		btnReplaceAll: 'Canvia-les totes',
		btnUndo: 'Desfés',
		noSuggestions: 'Cap suggeriment',
		progress: 'Verificació ortogràfica en curs...',
		noMispell: 'Verificació ortogràfica acabada: no hi ha cap paraula mal escrita',
		noChanges: 'Verificació ortogràfica: no s\'ha canviat cap paraula',
		oneChange: 'Verificació ortogràfica: s\'ha canviat una paraula',
		manyChanges: 'Verificació ortogràfica: s\'han canviat %1 paraules',
		ieSpellDownload: 'Verificació ortogràfica no instal·lada. Voleu descarregar-ho ara?'
	},

	smiley: {
		toolbar: 'Icona',
		title: 'Insereix una icona'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Llista numerada',
	bulletedlist: 'Llista de pics',
	indent: 'Augmenta el sagnat',
	outdent: 'Redueix el sagnat',

	justify: {
		left: 'Alinia a l\'esquerra',
		center: 'Centrat',
		right: 'Alinia a la dreta',
		block: 'Justificat'
	},

	blockquote: 'Bloc de cita',

	clipboard: {
		title: 'Enganxa',
		cutError: 'La seguretat del vostre navegador no permet executar automàticament les operacions de retallar. Si us plau, utilitzeu el teclat (Ctrl+X).',
		copyError: 'La seguretat del vostre navegador no permet executar automàticament les operacions de copiar. Si us plau, utilitzeu el teclat (Ctrl+C).',
		pasteMsg: 'Si us plau, enganxeu dins del següent camp utilitzant el teclat (<STRONG>Ctrl+V</STRONG>) i premeu <STRONG>OK</STRONG>.',
		securityMsg: 'A causa de la configuració de seguretat del vostre navegador, l\'editor no pot accedir al porta-retalls directament. Enganxeu-ho un altre cop en aquesta finestra.'
	},

	pastefromword: {
		toolbar: 'Enganxa des del Word',
		title: 'Enganxa des del Word',
		advice: 'Si us plau, enganxeu dins del següent camp utilitzant el teclat (<STRONG>Ctrl+V</STRONG>) i premeu <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Ignora definicions de font',
		removeStyle: 'Elimina definicions d\'estil'
	},

	pasteText: {
		button: 'Enganxa com a text no formatat',
		title: 'Enganxa com a text no formatat'
	},

	templates: {
		button: 'Plantilles',
		title: 'Contingut plantilles',
		insertOption: 'Reemplaça el contingut actual',
		selectPromptMsg: 'Si us plau, seleccioneu la plantilla per obrir a l\'editor<br>(el contingut actual no serà enregistrat):',
		emptyListMsg: '(No hi ha plantilles definides)'
	},

	showBlocks: 'Mostra els blocs',

	stylesCombo: {
		label: 'Estil',
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
		tag_pre: 'Formatejat',
		tag_address: 'Adreça',
		tag_h1: 'Encapçalament 1',
		tag_h2: 'Encapçalament 2',
		tag_h3: 'Encapçalament 3',
		tag_h4: 'Encapçalament 4',
		tag_h5: 'Encapçalament 5',
		tag_h6: 'Encapçalament 6',
		tag_div: 'Normal (DIV)'
	},

	font: {
		label: 'Tipus de lletra',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'Tipus de lletra',
		panelVoiceLabel: 'Select a font' // MISSING
	},

	fontSize: {
		label: 'Mida',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'Mida',
		panelVoiceLabel: 'Select a font size' // MISSING
	},

	colorButton: {
		textColorTitle: 'Color de Text',
		bgColorTitle: 'Color de Fons',
		auto: 'Automàtic',
		more: 'Més colors...'
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
		dlgTitle: 'About CKEditor', // MISSING
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

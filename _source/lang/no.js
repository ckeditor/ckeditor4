/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Norwegian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'no' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// Toolbar buttons without dialogs.
	source: 'Kilde',
	newPage: 'Ny Side',
	save: 'Lagre',
	preview: 'Forhåndsvis',
	cut: 'Klipp ut',
	copy: 'Kopier',
	paste: 'Lim inn',
	print: 'Skriv ut',
	underline: 'Understrek',
	bold: 'Fet',
	italic: 'Kursiv',
	selectAll: 'Merk alt',
	removeFormat: 'Fjern format',
	strike: 'Gjennomstrek',
	subscript: 'Senket skrift',
	superscript: 'Hevet skrift',
	horizontalrule: 'Sett inn horisontal linje',
	pagebreak: 'Sett inn sideskift',
	unlink: 'Fjern lenke',
	undo: 'Angre',
	redo: 'Gjør om',

	// Common messages and labels.
	common: {
		browseServer: 'Bla igjennom server',
		url: 'URL',
		protocol: 'Protokoll',
		upload: 'Last opp',
		uploadSubmit: 'Send det til serveren',
		image: 'Bilde',
		flash: 'Flash',
		form: 'Skjema',
		checkbox: 'Avmerkingsboks',
		radio: 'Alternativknapp',
		textField: 'Tekstboks',
		textarea: 'Tekstområde',
		hiddenField: 'Skjult felt',
		button: 'Knapp',
		select: 'Rullegardinliste',
		imageButton: 'Bildeknapp',
		notSet: '<ikke satt>',
		id: 'Id',
		name: 'Navn',
		langDir: 'Språkretning',
		langDirLtr: 'Venstre til høyre (VTH)',
		langDirRtl: 'Høyre til venstre (HTV)',
		langCode: 'Språkkode',
		longDescr: 'Utvidet beskrivelse',
		cssClass: 'Stilarkklasser',
		advisoryTitle: 'Tittel',
		cssStyle: 'Stil',
		ok: 'OK',
		cancel: 'Avbryt',
		generalTab: 'Generelt',
		advancedTab: 'Avansert',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Sett inn spesielt tegn',
		title: 'Velg spesielt tegn'
	},

	// Link dialog.
	link: {
		toolbar: 'Sett inn/Rediger lenke', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Rediger lenke',
		title: 'Lenke',
		info: 'Lenkeinfo',
		target: 'Mål',
		upload: 'Last opp',
		advanced: 'Avansert',
		type: 'Lenketype',
		toAnchor: 'Lenke til anker i teksten',
		toEmail: 'E-post',
		target: 'Mål',
		targetNotSet: '<ikke satt>',
		targetFrame: '<ramme>',
		targetPopup: '<popup vindu>',
		targetNew: 'Nytt vindu (_blank)',
		targetTop: 'Hele vindu (_top)',
		targetSelf: 'Samme vindu (_self)',
		targetParent: 'Foreldrevindu (_parent)',
		targetFrameName: 'Målramme',
		targetPopupName: 'Navn på popup-vindus',
		popupFeatures: 'Egenskaper for popup-vindu',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Statuslinje',
		popupLocationBar: 'Adresselinje',
		popupToolbar: 'Verktøylinje',
		popupMenuBar: 'Menylinje',
		popupFullScreen: 'Full skjerm (IE)',
		popupScrollBars: 'Scrollbar',
		popupDependent: 'Avhenging (Netscape)',
		popupWidth: 'Bredde',
		popupLeft: 'Venstre posisjon',
		popupHeight: 'Høyde',
		popupTop: 'Topp-posisjon',
		id: 'Id', // MISSING
		langDir: 'Språkretning',
		langDirNotSet: '<ikke satt>',
		langDirLTR: 'Venstre til høyre (VTH)',
		langDirRTL: 'Høyre til venstre (HTV)',
		acccessKey: 'Aksessknapp',
		name: 'Navn',
		langCode: 'Språkretning',
		tabIndex: 'Tab Indeks',
		advisoryTitle: 'Tittel',
		advisoryContentType: 'Type',
		cssClasses: 'Stilarkklasser',
		charset: 'Lenket språkkart',
		styles: 'Stil',
		selectAnchor: 'Velg et anker',
		anchorName: 'Anker etter navn',
		anchorId: 'Element etter ID',
		emailAddress: 'E-postadresse',
		emailSubject: 'Meldingsemne',
		emailBody: 'Melding',
		noAnchors: '(Ingen anker i dokumentet)',
		noUrl: 'Vennligst skriv inn lenkens url',
		noEmail: 'Vennligst skriv inn e-postadressen'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Sett inn/Rediger anker',
		menu: 'Egenskaper for anker',
		title: 'Egenskaper for anker',
		name: 'Ankernavn',
		errorName: 'Vennligst skriv inn ankernavnet'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Søk og erstatt',
		find: 'Søk',
		replace: 'Erstatt',
		findWhat: 'Søk etter:',
		replaceWith: 'Erstatt med:',
		notFoundMsg: 'Fant ikke søketeksten.',
		matchCase: 'Skill mellom store og små bokstaver',
		matchWord: 'Bare hele ord',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Erstatt alle',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Tabell',
		title: 'Egenskaper for tabell',
		menu: 'Egenskaper for tabell',
		deleteTable: 'Slett tabell',
		rows: 'Rader',
		columns: 'Kolonner',
		border: 'Rammestørrelse',
		align: 'Justering',
		alignNotSet: '<Ikke satt>',
		alignLeft: 'Venstre',
		alignCenter: 'Midtjuster',
		alignRight: 'Høyre',
		width: 'Bredde',
		widthPx: 'piksler',
		widthPc: 'prosent',
		height: 'Høyde',
		cellSpace: 'Cellemarg',
		cellPad: 'Cellepolstring',
		caption: 'Tittel',
		summary: 'Sammendrag',
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
			insertBefore: 'Sett inn celle før',
			insertAfter: 'Sett inn celle etter',
			deleteCell: 'Slett celler',
			merge: 'Slå sammen celler',
			mergeRight: 'Slå sammen høyre',
			mergeDown: 'Slå sammen ned',
			splitHorizontal: 'Del celle horisontalt',
			splitVertical: 'Del celle vertikalt'
		},

		row: {
			menu: 'Rader',
			insertBefore: 'Sett inn rad før',
			insertAfter: 'Sett inn rad etter',
			deleteRow: 'Slett rader'
		},

		column: {
			menu: 'Kolonne',
			insertBefore: 'Sett inn kolonne før',
			insertAfter: 'Sett inn kolonne etter',
			deleteColumn: 'Slett kolonner'
		}
	},

	// Button Dialog.
	button: {
		title: 'Egenskaper for knapp',
		text: 'Tekst (verdi)',
		type: 'Type',
		typeBtn: 'Knapp',
		typeSbm: 'Send',
		typeRst: 'Nullstill'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Egenskaper for avmerkingsboks',
		radioTitle: 'Egenskaper for alternativknapp',
		value: 'Verdi',
		selected: 'Valgt'
	},

	// Form Dialog.
	form: {
		title: 'Egenskaper for skjema',
		menu: 'Egenskaper for skjema',
		action: 'Handling',
		method: 'Metode',
		encoding: 'Encoding', // MISSING
		target: 'Mål',
		targetNotSet: '<ikke satt>',
		targetNew: 'Nytt vindu (_blank)',
		targetTop: 'Hele vindu (_top)',
		targetSelf: 'Samme vindu (_self)',
		targetParent: 'Foreldrevindu (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Egenskaper for rullegardinliste',
		selectInfo: 'Info',
		opAvail: 'Tilgjenglige alternativer',
		value: 'Verdi',
		size: 'Størrelse',
		lines: 'Linjer',
		chkMulti: 'Tillat flervalg',
		opText: 'Tekst',
		opValue: 'Verdi',
		btnAdd: 'Legg til',
		btnModify: 'Endre',
		btnUp: 'Opp',
		btnDown: 'Ned',
		btnSetValue: 'Sett som valgt',
		btnDelete: 'Slett'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Egenskaper for tekstområde',
		cols: 'Kolonner',
		rows: 'Rader'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Egenskaper for tekstfelt',
		name: 'Navn',
		value: 'Verdi',
		charWidth: 'Tegnbredde',
		maxChars: 'Maks antall tegn',
		type: 'Type',
		typeText: 'Tekst',
		typePass: 'Passord'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Egenskaper for skjult felt',
		name: 'Navn',
		value: 'Verdi'
	},

	// Image Dialog.
	image: {
		title: 'Bildeegenskaper',
		titleButton: 'Egenskaper for bildeknapp',
		menu: 'Bildeegenskaper',
		infoTab: 'Bildeinformasjon',
		btnUpload: 'Send det til serveren',
		url: 'URL',
		upload: 'Last opp',
		alt: 'Alternativ tekst',
		width: 'Bredde',
		height: 'Høyde',
		lockRatio: 'Lås forhold',
		resetSize: 'Tilbakestill størrelse',
		border: 'Ramme',
		hSpace: 'HMarg',
		vSpace: 'VMarg',
		align: 'Juster',
		alignLeft: 'Venstre',
		alignAbsBottom: 'Abs bunn',
		alignAbsMiddle: 'Abs midten',
		alignBaseline: 'Bunnlinje',
		alignBottom: 'Bunn',
		alignMiddle: 'Midten',
		alignRight: 'Høyre',
		alignTextTop: 'Tekst topp',
		alignTop: 'Topp',
		preview: 'Forhåndsvis',
		alertUrl: 'Vennligst skriv bilde-urlen',
		linkTab: 'Lenke',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Egenskaper for Flash-objekt',
		propertiesTab: 'Properties', // MISSING
		title: 'Flash-egenskaper',
		chkPlay: 'Autospill',
		chkLoop: 'Loop',
		chkMenu: 'Slå på Flash-meny',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Skaler',
		scaleAll: 'Vis alt',
		scaleNoBorder: 'Ingen ramme',
		scaleFit: 'Skaler til å passe',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Juster',
		alignLeft: 'Venstre',
		alignAbsBottom: 'Abs bunn',
		alignAbsMiddle: 'Abs midten',
		alignBaseline: 'Bunnlinje',
		alignBottom: 'Bunn',
		alignMiddle: 'Midten',
		alignRight: 'Høyre',
		alignTextTop: 'Tekst topp',
		alignTop: 'Topp',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Bakgrunnsfarge',
		width: 'Bredde',
		height: 'Høyde',
		hSpace: 'HMarg',
		vSpace: 'VMarg',
		validateSrc: 'Vennligst skriv inn lenkens url',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Stavekontroll',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Ikke i ordboken',
		changeTo: 'Endre til',
		btnIgnore: 'Ignorer',
		btnIgnoreAll: 'Ignorer alle',
		btnReplace: 'Erstatt',
		btnReplaceAll: 'Erstatt alle',
		btnUndo: 'Angre',
		noSuggestions: '- Ingen forslag -',
		progress: 'Stavekontroll pågår...',
		noMispell: 'Stavekontroll fullført: ingen feilstavinger funnet',
		noChanges: 'Stavekontroll fullført: ingen ord endret',
		oneChange: 'Stavekontroll fullført: Ett ord endret',
		manyChanges: 'Stavekontroll fullført: %1 ord endret',
		ieSpellDownload: 'Stavekontroll er ikke installert. Vil du laste den ned nå?'
	},

	smiley: {
		toolbar: 'Smil',
		title: 'Sett inn smil'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Nummerert liste',
	bulletedlist: 'Uordnet liste',
	indent: 'Øk nivå',
	outdent: 'Senk nivå',

	justify: {
		left: 'Venstrejuster',
		center: 'Midtjuster',
		right: 'Høyrejuster',
		block: 'Blokkjuster'
	},

	outdent: 'Senk nivå',
	blockquote: 'Blockquote', // MISSING

	clipboard: {
		title: 'Lim inn',
		cutError: 'Din nettlesers sikkerhetsinstillinger tillater ikke automatisk klipping av tekst. Vennligst bruk snareveien (Ctrl+X).',
		copyError: 'Din nettlesers sikkerhetsinstillinger tillater ikke automatisk kopiering av tekst. Vennligst bruk snareveien (Ctrl+C).',
		pasteMsg: 'Vennligst lim inn i den følgende boksen med tastaturet (<STRONG>Ctrl+V</STRONG>) og trykk <STRONG>OK</STRONG>.',
		securityMsg: 'Din nettlesers sikkerhetsinstillinger gir ikke redigeringsverktøyet direkte tilgang til utklippstavlen. Du må lime det igjen i dette vinduet.'
	},

	pastefromword: {
		toolbar: 'Lim inn fra Word',
		title: 'Lim inn fra Word',
		advice: 'Vennligst lim inn i den følgende boksen med tastaturet (<STRONG>Ctrl+V</STRONG>) og trykk <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Fjern skrifttyper',
		removeStyle: 'Fjern stildefinisjoner'
	},

	pasteText: {
		button: 'Lim inn som ren tekst',
		title: 'Lim inn som ren tekst'
	},

	templates: {
		button: 'Maler',
		title: 'Innholdsmaler',
		insertOption: 'Erstatt faktisk innold',
		selectPromptMsg: 'Velg malen du vil åpne<br>(innholdet du har skrevet blir tapt!):',
		emptyListMsg: '(Ingen maler definert)'
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
		tag_pre: 'Formatert',
		tag_address: 'Adresse',
		tag_h1: 'Tittel 1',
		tag_h2: 'Tittel 2',
		tag_h3: 'Tittel 3',
		tag_h4: 'Tittel 4',
		tag_h5: 'Tittel 5',
		tag_h6: 'Tittel 6',
		tag_div: 'Normal (DIV)'
	},

	font: {
		label: 'Skrift',
		panelTitle: 'Skrift'
	},

	fontSize: {
		label: 'Størrelse',
		panelTitle: 'Størrelse'
	},

	colorButton: {
		textColorTitle: 'Tekstfarge',
		bgColorTitle: 'Bakgrunnsfarge',
		auto: 'Automatisk',
		more: 'Flere farger...'
	}
};

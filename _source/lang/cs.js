/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Czech language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'cs' ] = {
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
	source: 'Zdroj',
	newPage: 'Nová stránka',
	save: 'Uložit',
	preview: 'Náhled',
	cut: 'Vyjmout',
	copy: 'Kopírovat',
	paste: 'Vložit',
	print: 'Tisk',
	underline: 'Podtržené',
	bold: 'Tučné',
	italic: 'Kurzíva',
	selectAll: 'Vybrat vše',
	removeFormat: 'Odstranit formátování',
	strike: 'Přeškrtnuté',
	subscript: 'Dolní index',
	superscript: 'Horní index',
	horizontalrule: 'Vložit vodorovnou linku',
	pagebreak: 'Vložit konec stránky',
	unlink: 'Odstranit odkaz',
	undo: 'Zpět',
	redo: 'Znovu',

	// Common messages and labels.
	common: {
		browseServer: 'Vybrat na serveru',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Odeslat',
		uploadSubmit: 'Odeslat na server',
		image: 'Obrázek',
		flash: 'Flash',
		form: 'Formulář',
		checkbox: 'Zaškrtávací políčko',
		radio: 'Přepínač',
		textField: 'Textové pole',
		textarea: 'Textová oblast',
		hiddenField: 'Skryté pole',
		button: 'Tlačítko',
		select: 'Seznam',
		imageButton: 'Obrázkové tlačítko',
		notSet: '<nenastaveno>',
		id: 'Id',
		name: 'Jméno',
		langDir: 'Orientace jazyka',
		langDirLtr: 'Zleva do prava (LTR)',
		langDirRtl: 'Zprava do leva (RTL)',
		langCode: 'Kód jazyka',
		longDescr: 'Dlouhý popis URL',
		cssClass: 'Třída stylu',
		advisoryTitle: 'Pomocný titulek',
		cssStyle: 'Styl',
		ok: 'OK',
		cancel: 'Storno',
		generalTab: 'Obecné',
		advancedTab: 'Rozšířené',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Vložit speciální znaky',
		title: 'Výběr speciálního znaku'
	},

	// Link dialog.
	link: {
		toolbar: 'Vložit/změnit odkaz', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Změnit odkaz',
		title: 'Odkaz',
		info: 'Informace o odkazu',
		target: 'Cíl',
		upload: 'Odeslat',
		advanced: 'Rozšířené',
		type: 'Typ odkazu',
		toAnchor: 'Kotva v této stránce',
		toEmail: 'E-Mail',
		target: 'Cíl',
		targetNotSet: '<nenastaveno>',
		targetFrame: '<rámec>',
		targetPopup: '<vyskakovací okno>',
		targetNew: 'Nové okno (_blank)',
		targetTop: 'Hlavní okno (_top)',
		targetSelf: 'Stejné okno (_self)',
		targetParent: 'Rodičovské okno (_parent)',
		targetFrameName: 'Název cílového rámu',
		targetPopupName: 'Název vyskakovacího okna',
		popupFeatures: 'Vlastnosti vyskakovacího okna',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Stavový řádek',
		popupLocationBar: 'Panel umístění',
		popupToolbar: 'Panel nástrojů',
		popupMenuBar: 'Panel nabídky',
		popupFullScreen: 'Celá obrazovka (IE)',
		popupScrollBars: 'Posuvníky',
		popupDependent: 'Závislost (Netscape)',
		popupWidth: 'Šířka',
		popupLeft: 'Levý okraj',
		popupHeight: 'Výška',
		popupTop: 'Horní okraj',
		id: 'Id', // MISSING
		langDir: 'Orientace jazyka',
		langDirNotSet: '<nenastaveno>',
		langDirLTR: 'Zleva do prava (LTR)',
		langDirRTL: 'Zprava do leva (RTL)',
		acccessKey: 'Přístupový klíč',
		name: 'Jméno',
		langCode: 'Orientace jazyka',
		tabIndex: 'Pořadí prvku',
		advisoryTitle: 'Pomocný titulek',
		advisoryContentType: 'Pomocný typ obsahu',
		cssClasses: 'Třída stylu',
		charset: 'Přiřazená znaková sada',
		styles: 'Styl',
		selectAnchor: 'Vybrat kotvu',
		anchorName: 'Podle jména kotvy',
		anchorId: 'Podle Id objektu',
		emailAddress: 'E-Mailová adresa',
		emailSubject: 'Předmět zprávy',
		emailBody: 'Tělo zprávy',
		noAnchors: '(Ve stránce není definována žádná kotva!)',
		noUrl: 'Zadejte prosím URL odkazu',
		noEmail: 'Zadejte prosím e-mailovou adresu'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Vložít/změnit záložku',
		menu: 'Vlastnosti záložky',
		title: 'Vlastnosti záložky',
		name: 'Název záložky',
		errorName: 'Zadejte prosím název záložky'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Najít a nahradit',
		find: 'Hledat',
		replace: 'Nahradit',
		findWhat: 'Co hledat:',
		replaceWith: 'Čím nahradit:',
		notFoundMsg: 'Hledaný text nebyl nalezen.',
		matchCase: 'Rozlišovat velikost písma',
		matchWord: 'Pouze celá slova',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Nahradit vše',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Tabulka',
		title: 'Vlastnosti tabulky',
		menu: 'Vlastnosti tabulky',
		deleteTable: 'Smazat tabulku',
		rows: 'Řádky',
		columns: 'Sloupce',
		border: 'Ohraničení',
		align: 'Zarovnání',
		alignNotSet: '<nenastaveno>',
		alignLeft: 'Vlevo',
		alignCenter: 'Na střed',
		alignRight: 'Vpravo',
		width: 'Šířka',
		widthPx: 'bodů',
		widthPc: 'procent',
		height: 'Výška',
		cellSpace: 'Vzdálenost buněk',
		cellPad: 'Odsazení obsahu',
		caption: 'Popis',
		summary: 'Souhrn',
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
			menu: 'Buňka',
			insertBefore: 'Vložit buňku před',
			insertAfter: 'Vložit buňku za',
			deleteCell: 'Smazat buňky',
			merge: 'Sloučit buňky',
			mergeRight: 'Sloučit doprava',
			mergeDown: 'Sloučit dolů',
			splitHorizontal: 'Rozdělit buňky vodorovně',
			splitVertical: 'Rozdělit buňky svisle',
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
			menu: 'Řádek',
			insertBefore: 'Vložit řádek před',
			insertAfter: 'Vložit řádek za',
			deleteRow: 'Smazat řádky'
		},

		column: {
			menu: 'Sloupec',
			insertBefore: 'Vložit sloupec před',
			insertAfter: 'Vložit sloupec za',
			deleteColumn: 'Smazat sloupec'
		}
	},

	// Button Dialog.
	button: {
		title: 'Vlastnosti tlačítka',
		text: 'Popisek',
		type: 'Typ',
		typeBtn: 'Tlačítko',
		typeSbm: 'Odeslat',
		typeRst: 'Obnovit'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Vlastnosti zaškrtávacího políčka',
		radioTitle: 'Vlastnosti přepínače',
		value: 'Hodnota',
		selected: 'Zaškrtnuto'
	},

	// Form Dialog.
	form: {
		title: 'Vlastnosti formuláře',
		menu: 'Vlastnosti formuláře',
		action: 'Akce',
		method: 'Metoda',
		encoding: 'Encoding', // MISSING
		target: 'Cíl',
		targetNotSet: '<nenastaveno>',
		targetNew: 'Nové okno (_blank)',
		targetTop: 'Hlavní okno (_top)',
		targetSelf: 'Stejné okno (_self)',
		targetParent: 'Rodičovské okno (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Vlastnosti seznamu',
		selectInfo: 'Info',
		opAvail: 'Dostupná nastavení',
		value: 'Hodnota',
		size: 'Velikost',
		lines: 'Řádků',
		chkMulti: 'Povolit mnohonásobné výběry',
		opText: 'Text',
		opValue: 'Hodnota',
		btnAdd: 'Přidat',
		btnModify: 'Změnit',
		btnUp: 'Nahoru',
		btnDown: 'Dolů',
		btnSetValue: 'Nastavit jako vybranou hodnotu',
		btnDelete: 'Smazat'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Vlastnosti textové oblasti',
		cols: 'Sloupců',
		rows: 'Řádků'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Vlastnosti textového pole',
		name: 'Název',
		value: 'Hodnota',
		charWidth: 'Šířka ve znacích',
		maxChars: 'Maximální počet znaků',
		type: 'Typ',
		typeText: 'Text',
		typePass: 'Heslo'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Vlastnosti skrytého pole',
		name: 'Název',
		value: 'Hodnota'
	},

	// Image Dialog.
	image: {
		title: 'Vlastnosti obrázku',
		titleButton: 'Vlastností obrázkového tlačítka',
		menu: 'Vlastnosti obrázku',
		infoTab: 'Informace o obrázku',
		btnUpload: 'Odeslat na server',
		url: 'URL',
		upload: 'Odeslat',
		alt: 'Alternativní text',
		width: 'Šířka',
		height: 'Výška',
		lockRatio: 'Zámek',
		resetSize: 'Původní velikost',
		border: 'Okraje',
		hSpace: 'H-mezera',
		vSpace: 'V-mezera',
		align: 'Zarovnání',
		alignLeft: 'Vlevo',
		alignAbsBottom: 'Zcela dolů',
		alignAbsMiddle: 'Doprostřed',
		alignBaseline: 'Na účaří',
		alignBottom: 'Dolů',
		alignMiddle: 'Na střed',
		alignRight: 'Vpravo',
		alignTextTop: 'Na horní okraj textu',
		alignTop: 'Nahoru',
		preview: 'Náhled',
		alertUrl: 'Zadejte prosím URL obrázku',
		linkTab: 'Odkaz',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Vlastnosti Flashe',
		propertiesTab: 'Properties', // MISSING
		title: 'Vlastnosti Flashe',
		chkPlay: 'Automatické spuštění',
		chkLoop: 'Opakování',
		chkMenu: 'Nabídka Flash',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Zobrazit',
		scaleAll: 'Zobrazit vše',
		scaleNoBorder: 'Bez okraje',
		scaleFit: 'Přizpůsobit',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Zarovnání',
		alignLeft: 'Vlevo',
		alignAbsBottom: 'Zcela dolů',
		alignAbsMiddle: 'Doprostřed',
		alignBaseline: 'Na účaří',
		alignBottom: 'Dolů',
		alignMiddle: 'Na střed',
		alignRight: 'Vpravo',
		alignTextTop: 'Na horní okraj textu',
		alignTop: 'Nahoru',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Barva pozadí',
		width: 'Šířka',
		height: 'Výška',
		hSpace: 'H-mezera',
		vSpace: 'V-mezera',
		validateSrc: 'Zadejte prosím URL odkazu',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Zkontrolovat pravopis',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Není ve slovníku',
		changeTo: 'Změnit na',
		btnIgnore: 'Přeskočit',
		btnIgnoreAll: 'Přeskakovat vše',
		btnReplace: 'Zaměnit',
		btnReplaceAll: 'Zaměňovat vše',
		btnUndo: 'Zpět',
		noSuggestions: '- žádné návrhy -',
		progress: 'Probíhá kontrola pravopisu...',
		noMispell: 'Kontrola pravopisu dokončena: Žádné pravopisné chyby nenalezeny',
		noChanges: 'Kontrola pravopisu dokončena: Beze změn',
		oneChange: 'Kontrola pravopisu dokončena: Jedno slovo změněno',
		manyChanges: 'Kontrola pravopisu dokončena: %1 slov změněno',
		ieSpellDownload: 'Kontrola pravopisu není nainstalována. Chcete ji nyní stáhnout?'
	},

	smiley: {
		toolbar: 'Smajlíky',
		title: 'Vkládání smajlíků'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Číslování',
	bulletedlist: 'Odrážky',
	indent: 'Zvětšit odsazení',
	outdent: 'Zmenšit odsazení',

	justify: {
		left: 'Zarovnat vlevo',
		center: 'Zarovnat na střed',
		right: 'Zarovnat vpravo',
		block: 'Zarovnat do bloku'
	},

	outdent: 'Zmenšit odsazení',
	blockquote: 'Citace',

	clipboard: {
		title: 'Vložit',
		cutError: 'Bezpečnostní nastavení Vašeho prohlížeče nedovolují editoru spustit funkci pro vyjmutí zvoleného textu do schránky. Prosím vyjměte zvolený text do schránky pomocí klávesnice (Ctrl+X).',
		copyError: 'Bezpečnostní nastavení Vašeho prohlížeče nedovolují editoru spustit funkci pro kopírování zvoleného textu do schránky. Prosím zkopírujte zvolený text do schránky pomocí klávesnice (Ctrl+C).',
		pasteMsg: 'Do následujícího pole vložte požadovaný obsah pomocí klávesnice (<STRONG>Ctrl+V</STRONG>) a stiskněte <STRONG>OK</STRONG>.',
		securityMsg: 'Z důvodů nastavení bezpečnosti Vašeho prohlížeče nemůže editor přistupovat přímo do schránky. Obsah schránky prosím vložte znovu do tohoto okna.'
	},

	pastefromword: {
		toolbar: 'Vložit z Wordu',
		title: 'Vložit z Wordu',
		advice: 'Do následujícího pole vložte požadovaný obsah pomocí klávesnice (<STRONG>Ctrl+V</STRONG>) a stiskněte <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Ignorovat písmo',
		removeStyle: 'Odstranit styly'
	},

	pasteText: {
		button: 'Vložit jako čistý text',
		title: 'Vložit jako čistý text'
	},

	templates: {
		button: 'Šablony',
		title: 'Šablony obsahu',
		insertOption: 'Nahradit aktuální obsah',
		selectPromptMsg: 'Prosím zvolte šablonu pro otevření v editoru<br>(aktuální obsah editoru bude ztracen):',
		emptyListMsg: '(Není definována žádná šablona)'
	},

	showBlocks: 'Ukázat bloky',

	stylesCombo: {
		label: 'Styl',
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Formát',
		panelTitle: 'Formát',

		tag_p: 'Normální',
		tag_pre: 'Naformátováno',
		tag_address: 'Adresa',
		tag_h1: 'Nadpis 1',
		tag_h2: 'Nadpis 2',
		tag_h3: 'Nadpis 3',
		tag_h4: 'Nadpis 4',
		tag_h5: 'Nadpis 5',
		tag_h6: 'Nadpis 6',
		tag_div: 'Normální (DIV)'
	},

	font: {
		label: 'Písmo',
		panelTitle: 'Písmo'
	},

	fontSize: {
		label: 'Velikost',
		panelTitle: 'Velikost'
	},

	colorButton: {
		textColorTitle: 'Barva textu',
		bgColorTitle: 'Barva pozadí',
		auto: 'Automaticky',
		more: 'Více barev...'
	}
};

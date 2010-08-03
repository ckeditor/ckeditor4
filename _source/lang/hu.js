/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Hungarian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'hu' ] = {
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
	source: 'Forráskód',
	newPage: 'Új oldal',
	save: 'Mentés',
	preview: 'Előnézet',
	cut: 'Kivágás',
	copy: 'Másolás',
	paste: 'Beillesztés',
	print: 'Nyomtatás',
	underline: 'Aláhúzott',
	bold: 'Félkövér',
	italic: 'Dőlt',
	selectAll: 'Mindent kijelöl',
	removeFormat: 'Formázás eltávolítása',
	strike: 'Áthúzott',
	subscript: 'Alsó index',
	superscript: 'Felső index',
	horizontalrule: 'Elválasztóvonal beillesztése',
	pagebreak: 'Oldaltörés beillesztése',
	unlink: 'Hivatkozás törlése',
	undo: 'Visszavonás',
	redo: 'Ismétlés',

	// Common messages and labels.
	common: {
		browseServer: 'Böngészés a szerveren',
		url: 'Hivatkozás',
		protocol: 'Protokoll',
		upload: 'Feltöltés',
		uploadSubmit: 'Küldés a szerverre',
		image: 'Kép',
		flash: 'Flash',
		form: 'Űrlap',
		checkbox: 'Jelölőnégyzet',
		radio: 'Választógomb',
		textField: 'Szövegmező',
		textarea: 'Szövegterület',
		hiddenField: 'Rejtettmező',
		button: 'Gomb',
		select: 'Legördülő lista',
		imageButton: 'Képgomb',
		notSet: '<nincs beállítva>',
		id: 'Azonosító',
		name: 'Név',
		langDir: 'Írás iránya',
		langDirLtr: 'Balról jobbra',
		langDirRtl: 'Jobbról balra',
		langCode: 'Nyelv kódja',
		longDescr: 'Részletes leírás webcíme',
		cssClass: 'Stíluskészlet',
		advisoryTitle: 'Súgócimke',
		cssStyle: 'Stílus',
		ok: 'Rendben',
		cancel: 'Mégsem',
		close: 'Close', // MISSING
		preview: 'Preview', // MISSING
		generalTab: 'Általános',
		advancedTab: 'További opciók',
		validateNumberFailed: 'A mezőbe csak számokat írhat.',
		confirmNewPage: 'Minden nem mentett változás el fog veszni! Biztosan be szeretné tölteni az oldalt?',
		confirmCancel: 'Az űrlap tartalma megváltozott, ám a változásokat nem rögzítette. Biztosan be szeretné zárni az űrlapot?',
		options: 'Options', // MISSING
		target: 'Target', // MISSING
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		advanced: 'Advanced', // MISSING
		langDirLTR: 'Left to Right (LTR)', // MISSING
		langDirRTL: 'Right to Left (RTL)', // MISSING
		styles: 'Style', // MISSING
		cssClasses: 'Stylesheet Classes', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	},

	contextmenu: {
		options: 'Context Menu Options' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Speciális karakter beillesztése',
		title: 'Speciális karakter választása',
		options: 'Special Character Options' // MISSING
	},

	// Link dialog.
	link: {
		toolbar: 'Hivatkozás beillesztése/módosítása',
		other: '<más>',
		menu: 'Hivatkozás módosítása',
		title: 'Hivatkozás tulajdonságai',
		info: 'Alaptulajdonságok',
		target: 'Tartalom megjelenítése',
		upload: 'Feltöltés',
		advanced: 'További opciók',
		type: 'Hivatkozás típusa',
		toUrl: 'URL', // MISSING
		toAnchor: 'Horgony az oldalon',
		toEmail: 'E-Mail',
		targetFrame: '<keretben>',
		targetPopup: '<felugró ablakban>',
		targetFrameName: 'Keret neve',
		targetPopupName: 'Felugró ablak neve',
		popupFeatures: 'Felugró ablak jellemzői',
		popupResizable: 'Átméretezés',
		popupStatusBar: 'Állapotsor',
		popupLocationBar: 'Címsor',
		popupToolbar: 'Eszköztár',
		popupMenuBar: 'Menü sor',
		popupFullScreen: 'Teljes képernyő (csak IE)',
		popupScrollBars: 'Gördítősáv',
		popupDependent: 'Szülőhöz kapcsolt (csak Netscape)',
		popupWidth: 'Szélesség',
		popupLeft: 'Bal pozíció',
		popupHeight: 'Magasság',
		popupTop: 'Felső pozíció',
		id: 'Id',
		langDir: 'Írás iránya',
		langDirLTR: 'Balról jobbra',
		langDirRTL: 'Jobbról balra',
		acccessKey: 'Billentyűkombináció',
		name: 'Név',
		langCode: 'Írás iránya',
		tabIndex: 'Tabulátor index',
		advisoryTitle: 'Súgócimke',
		advisoryContentType: 'Súgó tartalomtípusa',
		cssClasses: 'Stíluskészlet',
		charset: 'Hivatkozott tartalom kódlapja',
		styles: 'Stílus',
		selectAnchor: 'Horgony választása',
		anchorName: 'Horgony név szerint',
		anchorId: 'Azonosító szerint',
		emailAddress: 'E-Mail cím',
		emailSubject: 'Üzenet tárgya',
		emailBody: 'Üzenet',
		noAnchors: '(Nincs horgony a dokumentumban)',
		noUrl: 'Adja meg a hivatkozás webcímét',
		noEmail: 'Adja meg az E-Mail címet'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Horgony beillesztése/szerkesztése',
		menu: 'Horgony tulajdonságai',
		title: 'Horgony tulajdonságai',
		name: 'Horgony neve',
		errorName: 'Kérem adja meg a horgony nevét'
	},

	// List style dialog
	list: {
		numberedTitle: 'Numbered List Properties', // MISSING
		bulletedTitle: 'Bulleted List Properties', // MISSING
		type: 'Type', // MISSING
		start: 'Start', // MISSING
		validateStartNumber: 'List start number must be a whole number.', // MISSING
		circle: 'Circle', // MISSING
		disc: 'Disc', // MISSING
		square: 'Square', // MISSING
		none: 'None', // MISSING
		notset: '<not set>', // MISSING
		armenian: 'Armenian numbering', // MISSING
		georgian: 'Georgian numbering (an, ban, gan, etc.)', // MISSING
		lowerRoman: 'Lower Roman (i, ii, iii, iv, v, etc.)', // MISSING
		upperRoman: 'Upper Roman (I, II, III, IV, V, etc.)', // MISSING
		lowerAlpha: 'Lower Alpha (a, b, c, d, e, etc.)', // MISSING
		upperAlpha: 'Upper Alpha (A, B, C, D, E, etc.)', // MISSING
		lowerGreek: 'Lower Greek (alpha, beta, gamma, etc.)', // MISSING
		decimal: 'Decimal (1, 2, 3, etc.)', // MISSING
		decimalLeadingZero: 'Decimal leading zero (01, 02, 03, etc.)' // MISSING
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Keresés és csere',
		find: 'Keresés',
		replace: 'Csere',
		findWhat: 'Keresett szöveg:',
		replaceWith: 'Csere erre:',
		notFoundMsg: 'A keresett szöveg nem található.',
		matchCase: 'kis- és nagybetű megkülönböztetése',
		matchWord: 'csak ha ez a teljes szó',
		matchCyclic: 'Ciklikus keresés',
		replaceAll: 'Az összes cseréje',
		replaceSuccessMsg: '%1 egyezőség cserélve.'
	},

	// Table Dialog
	table: {
		toolbar: 'Táblázat',
		title: 'Táblázat tulajdonságai',
		menu: 'Táblázat tulajdonságai',
		deleteTable: 'Táblázat törlése',
		rows: 'Sorok',
		columns: 'Oszlopok',
		border: 'Szegélyméret',
		align: 'Igazítás',
		alignLeft: 'Balra',
		alignCenter: 'Középre',
		alignRight: 'Jobbra',
		width: 'Szélesség',
		widthPx: 'képpont',
		widthPc: 'százalék',
		widthUnit: 'width unit', // MISSING
		height: 'Magasság',
		cellSpace: 'Cella térköz',
		cellPad: 'Cella belső margó',
		caption: 'Felirat',
		summary: 'Leírás',
		headers: 'Fejlécek',
		headersNone: 'Nincsenek',
		headersColumn: 'Első oszlop',
		headersRow: 'Első sor',
		headersBoth: 'Mindkettő',
		invalidRows: 'A sorok számának nagyobbnak kell lenni mint 0.',
		invalidCols: 'Az oszlopok számának nagyobbnak kell lenni mint 0.',
		invalidBorder: 'A szegélyméret mezőbe csak számokat írhat.',
		invalidWidth: 'A szélesség mezőbe csak számokat írhat.',
		invalidHeight: 'A magasság mezőbe csak számokat írhat.',
		invalidCellSpacing: 'A cella térköz mezőbe csak számokat írhat.',
		invalidCellPadding: 'A cella belső margó mezőbe csak számokat írhat.',

		cell: {
			menu: 'Cella',
			insertBefore: 'Beszúrás balra',
			insertAfter: 'Beszúrás jobbra',
			deleteCell: 'Cellák törlése',
			merge: 'Cellák egyesítése',
			mergeRight: 'Cellák egyesítése jobbra',
			mergeDown: 'Cellák egyesítése lefelé',
			splitHorizontal: 'Cellák szétválasztása vízszintesen',
			splitVertical: 'Cellák szétválasztása függőlegesen',
			title: 'Cella tulajdonságai',
			cellType: 'Cella típusa',
			rowSpan: 'Függőleges egyesítés',
			colSpan: 'Vízszintes egyesítés',
			wordWrap: 'Hosszú sorok törése',
			hAlign: 'Vízszintes igazítás',
			vAlign: 'Függőleges igazítás',
			alignTop: 'Fel',
			alignMiddle: 'Középre',
			alignBottom: 'Le',
			alignBaseline: 'Alapvonalra',
			bgColor: 'Háttér színe',
			borderColor: 'Keret színe',
			data: 'Adat',
			header: 'Fejléc',
			yes: 'Igen',
			no: 'Nem',
			invalidWidth: 'A szélesség mezőbe csak számokat írhat.',
			invalidHeight: 'A magasság mezőbe csak számokat írhat.',
			invalidRowSpan: 'A függőleges egyesítés mezőbe csak számokat írhat.',
			invalidColSpan: 'A vízszintes egyesítés mezőbe csak számokat írhat.',
			chooseColor: 'Choose' // MISSING
		},

		row: {
			menu: 'Sor',
			insertBefore: 'Beszúrás fölé',
			insertAfter: 'Beszúrás alá',
			deleteRow: 'Sorok törlése'
		},

		column: {
			menu: 'Oszlop',
			insertBefore: 'Beszúrás balra',
			insertAfter: 'Beszúrás jobbra',
			deleteColumn: 'Oszlopok törlése'
		}
	},

	// Button Dialog.
	button: {
		title: 'Gomb tulajdonságai',
		text: 'Szöveg (Érték)',
		type: 'Típus',
		typeBtn: 'Gomb',
		typeSbm: 'Küldés',
		typeRst: 'Alaphelyzet'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Jelölőnégyzet tulajdonságai',
		radioTitle: 'Választógomb tulajdonságai',
		value: 'Érték',
		selected: 'Kiválasztott'
	},

	// Form Dialog.
	form: {
		title: 'Űrlap tulajdonságai',
		menu: 'Űrlap tulajdonságai',
		action: 'Adatfeldolgozást végző hivatkozás',
		method: 'Adatküldés módja',
		encoding: 'Kódolás'
	},

	// Select Field Dialog.
	select: {
		title: 'Legördülő lista tulajdonságai',
		selectInfo: 'Alaptulajdonságok',
		opAvail: 'Elérhető opciók',
		value: 'Érték',
		size: 'Méret',
		lines: 'sor',
		chkMulti: 'több sor is kiválasztható',
		opText: 'Szöveg',
		opValue: 'Érték',
		btnAdd: 'Hozzáad',
		btnModify: 'Módosít',
		btnUp: 'Fel',
		btnDown: 'Le',
		btnSetValue: 'Legyen az alapértelmezett érték',
		btnDelete: 'Töröl'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Szövegterület tulajdonságai',
		cols: 'Karakterek száma egy sorban',
		rows: 'Sorok száma'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Szövegmező tulajdonságai',
		name: 'Név',
		value: 'Érték',
		charWidth: 'Megjelenített karakterek száma',
		maxChars: 'Maximális karakterszám',
		type: 'Típus',
		typeText: 'Szöveg',
		typePass: 'Jelszó'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Rejtett mező tulajdonságai',
		name: 'Név',
		value: 'Érték'
	},

	// Image Dialog.
	image: {
		title: 'Kép tulajdonságai',
		titleButton: 'Képgomb tulajdonságai',
		menu: 'Kép tulajdonságai',
		infoTab: 'Alaptulajdonságok',
		btnUpload: 'Küldés a szerverre',
		upload: 'Feltöltés',
		alt: 'Buborék szöveg',
		width: 'Szélesség',
		height: 'Magasság',
		lockRatio: 'Arány megtartása',
		unlockRatio: 'Unlock Ratio', // MISSING
		resetSize: 'Eredeti méret',
		border: 'Keret',
		hSpace: 'Vízsz. táv',
		vSpace: 'Függ. táv',
		align: 'Igazítás',
		alignLeft: 'Bal',
		alignRight: 'Jobbra',
		alertUrl: 'Töltse ki a kép webcímét',
		linkTab: 'Hivatkozás',
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
		properties: 'Flash tulajdonságai',
		propertiesTab: 'Tulajdonságok',
		title: 'Flash tulajdonságai',
		chkPlay: 'Automata lejátszás',
		chkLoop: 'Folyamatosan',
		chkMenu: 'Flash menü engedélyezése',
		chkFull: 'Teljes képernyő engedélyezése',
		scale: 'Méretezés',
		scaleAll: 'Mindent mutat',
		scaleNoBorder: 'Keret nélkül',
		scaleFit: 'Teljes kitöltés',
		access: 'Szkript hozzáférés',
		accessAlways: 'Mindig',
		accessSameDomain: 'Azonos domainről',
		accessNever: 'Soha',
		align: 'Igazítás',
		alignLeft: 'Bal',
		alignAbsBottom: 'Legaljára',
		alignAbsMiddle: 'Közepére',
		alignBaseline: 'Alapvonalhoz',
		alignBottom: 'Aljára',
		alignMiddle: 'Középre',
		alignRight: 'Jobbra',
		alignTextTop: 'Szöveg tetejére',
		alignTop: 'Tetejére',
		quality: 'Minőség',
		qualityBest: 'Legjobb',
		qualityHigh: 'Jó',
		qualityAutoHigh: 'Automata jó',
		qualityMedium: 'Közepes',
		qualityAutoLow: 'Automata gyenge',
		qualityLow: 'Gyenge',
		windowModeWindow: 'Window',
		windowModeOpaque: 'Opaque',
		windowModeTransparent: 'Transparent',
		windowMode: 'Ablak mód',
		flashvars: 'Flash változók',
		bgcolor: 'Háttérszín',
		width: 'Szélesség',
		height: 'Magasság',
		hSpace: 'Vízsz. táv',
		vSpace: 'Függ. táv',
		validateSrc: 'Adja meg a hivatkozás webcímét',
		validateWidth: 'A szélesség mezőbe csak számokat írhat.',
		validateHeight: 'A magasság mezőbe csak számokat írhat.',
		validateHSpace: 'A vízszintes távolsűág mezőbe csak számokat írhat.',
		validateVSpace: 'A függőleges távolsűág mezőbe csak számokat írhat.'
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Helyesírás-ellenőrzés',
		title: 'Helyesírás ellenörző',
		notAvailable: 'Sajnálom, de a szolgáltatás jelenleg nem elérhető.',
		errorLoading: 'Hiba a szolgáltatás host betöltése közben: %s.',
		notInDic: 'Nincs a szótárban',
		changeTo: 'Módosítás',
		btnIgnore: 'Kihagyja',
		btnIgnoreAll: 'Mindet kihagyja',
		btnReplace: 'Csere',
		btnReplaceAll: 'Összes cseréje',
		btnUndo: 'Visszavonás',
		noSuggestions: 'Nincs javaslat',
		progress: 'Helyesírás-ellenőrzés folyamatban...',
		noMispell: 'Helyesírás-ellenőrzés kész: Nem találtam hibát',
		noChanges: 'Helyesírás-ellenőrzés kész: Nincs változtatott szó',
		oneChange: 'Helyesírás-ellenőrzés kész: Egy szó cserélve',
		manyChanges: 'Helyesírás-ellenőrzés kész: %1 szó cserélve',
		ieSpellDownload: 'A helyesírás-ellenőrző nincs telepítve. Szeretné letölteni most?'
	},

	smiley: {
		toolbar: 'Hangulatjelek',
		title: 'Hangulatjel beszúrása',
		options: 'Smiley Options' // MISSING
	},

	elementsPath: {
		eleLabel: 'Elements path', // MISSING
		eleTitle: '%1 elem'
	},

	numberedlist: 'Számozás',
	bulletedlist: 'Felsorolás',
	indent: 'Behúzás növelése',
	outdent: 'Behúzás csökkentése',

	justify: {
		left: 'Balra',
		center: 'Középre',
		right: 'Jobbra',
		block: 'Sorkizárt'
	},

	blockquote: 'Idézet blokk',

	clipboard: {
		title: 'Beillesztés',
		cutError: 'A böngésző biztonsági beállításai nem engedélyezik a szerkesztőnek, hogy végrehajtsa a kivágás műveletet. Használja az alábbi billentyűkombinációt (Ctrl/Cmd+X).',
		copyError: 'A böngésző biztonsági beállításai nem engedélyezik a szerkesztőnek, hogy végrehajtsa a másolás műveletet. Használja az alábbi billentyűkombinációt (Ctrl/Cmd+X).',
		pasteMsg: 'Másolja be az alábbi mezőbe a <STRONG>Ctrl/Cmd+V</STRONG> billentyűk lenyomásával, majd nyomjon <STRONG>Rendben</STRONG>-t.',
		securityMsg: 'A böngésző biztonsági beállításai miatt a szerkesztő nem képes hozzáférni a vágólap adataihoz. Illeszd be újra ebben az ablakban.',
		pasteArea: 'Paste Area' // MISSING
	},

	pastefromword: {
		confirmCleanup: 'The text you want to paste seems to be copied from Word. Do you want to clean it before pasting?', // MISSING
		toolbar: 'Beillesztés Word-ből',
		title: 'Beillesztés Word-ből',
		error: 'It was not possible to clean up the pasted data due to an internal error' // MISSING
	},

	pasteText: {
		button: 'Beillesztés formázatlan szövegként',
		title: 'Beillesztés formázatlan szövegként'
	},

	templates: {
		button: 'Sablonok',
		title: 'Elérhető sablonok',
		options: 'Template Options', // MISSING
		insertOption: 'Kicseréli a jelenlegi tartalmat',
		selectPromptMsg: 'Válassza ki melyik sablon nyíljon meg a szerkesztőben<br>(a jelenlegi tartalom elveszik):',
		emptyListMsg: '(Nincs sablon megadva)'
	},

	showBlocks: 'Blokkok megjelenítése',

	stylesCombo: {
		label: 'Stílus',
		panelTitle: 'Formatting Styles', // MISSING
		panelTitle1: 'Blokk stílusok',
		panelTitle2: 'Inline stílusok',
		panelTitle3: 'Objektum stílusok'
	},

	format: {
		label: 'Formátum',
		panelTitle: 'Formátum',

		tag_p: 'Normál',
		tag_pre: 'Formázott',
		tag_address: 'Címsor',
		tag_h1: 'Fejléc 1',
		tag_h2: 'Fejléc 2',
		tag_h3: 'Fejléc 3',
		tag_h4: 'Fejléc 4',
		tag_h5: 'Fejléc 5',
		tag_h6: 'Fejléc 6',
		tag_div: 'Bekezdés (DIV)'
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
		label: 'Betűtípus',
		voiceLabel: 'Betűtípus',
		panelTitle: 'Betűtípus'
	},

	fontSize: {
		label: 'Méret',
		voiceLabel: 'Betűméret',
		panelTitle: 'Méret'
	},

	colorButton: {
		textColorTitle: 'Betűszín',
		bgColorTitle: 'Háttérszín',
		panelTitle: 'Colors', // MISSING
		auto: 'Automatikus',
		more: 'További színek...'
	},

	colors: {
		'000': 'Fekete',
		'800000': 'Bordó',
		'8B4513': 'Barna',
		'2F4F4F': 'Sötét türkiz',
		'008080': 'Türkiz',
		'000080': 'Király kék',
		'4B0082': 'Indigó kék',
		'696969': 'Szürke',
		'B22222': 'Tégla vörös',
		'A52A2A': 'Vörös',
		'DAA520': 'Arany sárga',
		'006400': 'Sötét zöld',
		'40E0D0': 'Türkiz',
		'0000CD': 'Kék',
		'800080': 'Lila',
		'808080': 'Szürke',
		'F00': 'Piros',
		'FF8C00': 'Sötét narancs',
		'FFD700': 'Arany',
		'008000': 'Zöld',
		'0FF': 'Türkiz',
		'00F': 'Kék',
		'EE82EE': 'Rózsaszín',
		'A9A9A9': 'Sötét szürke',
		'FFA07A': 'Lazac',
		'FFA500': 'Narancs',
		'FFFF00': 'Citromsárga',
		'00FF00': 'Neon zöld',
		'AFEEEE': 'Világos türkiz',
		'ADD8E6': 'Világos kék',
		'DDA0DD': 'Világos lila',
		'D3D3D3': 'Világos szürke',
		'FFF0F5': 'Lavender Blush',
		'FAEBD7': 'Törtfehér',
		'FFFFE0': 'Világos sárga',
		'F0FFF0': 'Menta',
		'F0FFFF': 'Azúr kék',
		'F0F8FF': 'Halvány kék',
		'E6E6FA': 'Lavender',
		'FFF': 'Fehér'
	},

	scayt: {
		title: 'Helyesírás ellenőrzés gépelés közben',
		opera_title: 'Not supported by Opera', // MISSING
		enable: 'SCAYT engedélyezése',
		disable: 'SCAYT letiltása',
		about: 'SCAYT névjegy',
		toggle: 'SCAYT kapcsolása',
		options: 'Beállítások',
		langs: 'Nyelvek',
		moreSuggestions: 'További javaslatok',
		ignore: 'Kihagy',
		ignoreAll: 'Összes kihagyása',
		addWord: 'Szó hozzáadása',
		emptyDic: 'A szótár nevét meg kell adni.',

		optionsTab: 'Beállítások',
		allCaps: 'Ignore All-Caps Words', // MISSING
		ignoreDomainNames: 'Ignore Domain Names', // MISSING
		mixedCase: 'Ignore Words with Mixed Case', // MISSING
		mixedWithDigits: 'Ignore Words with Numbers', // MISSING

		languagesTab: 'Nyelvek',

		dictionariesTab: 'Szótár',
		dic_field_name: 'Dictionary name', // MISSING
		dic_create: 'Create', // MISSING
		dic_restore: 'Restore', // MISSING
		dic_delete: 'Delete', // MISSING
		dic_rename: 'Rename', // MISSING
		dic_info: 'Initially the User Dictionary is stored in a Cookie. However, Cookies are limited in size. When the User Dictionary grows to a point where it cannot be stored in a Cookie, then the dictionary may be stored on our server. To store your personal dictionary on our server you should specify a name for your dictionary. If you already have a stored dictionary, please type it\'s name and click the Restore button.', // MISSING

		aboutTab: 'Névjegy'
	},

	about: {
		title: 'CKEditor névjegy',
		dlgTitle: 'CKEditor névjegy',
		moreInfo: 'Licenszelési információkért kérjük látogassa meg weboldalunkat:',
		copy: 'Copyright &copy; $1. Minden jog fenntartva.'
	},

	maximize: 'Teljes méret',
	minimize: 'Kis méret',

	fakeobjects: {
		anchor: 'Horgony',
		flash: 'Flash animáció',
		div: 'Oldaltörés',
		unknown: 'Ismeretlen objektum'
	},

	resize: 'Húzza az átméretezéshez',

	colordialog: {
		title: 'Válasszon színt',
		options: 'Color Options', // MISSING
		highlight: 'Nagyítás',
		selected: 'Kiválasztott',
		clear: 'Ürítés'
	},

	toolbarCollapse: 'Collapse Toolbar', // MISSING
	toolbarExpand: 'Expand Toolbar', // MISSING

	bidi: {
		ltr: 'Text direction from left to right', // MISSING
		rtl: 'Text direction from right to left' // MISSING
	}
};

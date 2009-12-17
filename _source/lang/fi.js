/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Finnish language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'fi' ] = {
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
	editorTitle: 'Tekstieditori, %1',

	// Toolbar buttons without dialogs.
	source: 'Koodi',
	newPage: 'Tyhjennä',
	save: 'Tallenna',
	preview: 'Esikatsele',
	cut: 'Leikkaa',
	copy: 'Kopioi',
	paste: 'Liitä',
	print: 'Tulosta',
	underline: 'Alleviivattu',
	bold: 'Lihavoitu',
	italic: 'Kursivoitu',
	selectAll: 'Valitse kaikki',
	removeFormat: 'Poista muotoilu',
	strike: 'Yliviivattu',
	subscript: 'Alaindeksi',
	superscript: 'Yläindeksi',
	horizontalrule: 'Lisää murtoviiva',
	pagebreak: 'Lisää sivun vaihto',
	unlink: 'Poista linkki',
	undo: 'Kumoa',
	redo: 'Toista',

	// Common messages and labels.
	common: {
		browseServer: 'Selaa palvelinta',
		url: 'Osoite',
		protocol: 'Protokolla',
		upload: 'Lisää tiedosto',
		uploadSubmit: 'Lähetä palvelimelle',
		image: 'Kuva',
		flash: 'Flash',
		form: 'Lomake',
		checkbox: 'Valintaruutu',
		radio: 'Radiopainike',
		textField: 'Tekstikenttä',
		textarea: 'Tekstilaatikko',
		hiddenField: 'Piilokenttä',
		button: 'Painike',
		select: 'Valintakenttä',
		imageButton: 'Kuvapainike',
		notSet: '<ei asetettu>',
		id: 'Tunniste',
		name: 'Nimi',
		langDir: 'Kielen suunta',
		langDirLtr: 'Vasemmalta oikealle (LTR)',
		langDirRtl: 'Oikealta vasemmalle (RTL)',
		langCode: 'Kielikoodi',
		longDescr: 'Pitkän kuvauksen URL',
		cssClass: 'Tyyliluokat',
		advisoryTitle: 'Avustava otsikko',
		cssStyle: 'Tyyli',
		ok: 'OK',
		cancel: 'Peruuta',
		generalTab: 'Yleinen',
		advancedTab: 'Lisäominaisuudet',
		validateNumberFailed: 'Arvon pitää olla numero.',
		confirmNewPage: 'Kaikki tallentamattomat muutokset tähän sisältöön menetetään. Oletko varma, että haluat ladata uuden sivun?',
		confirmCancel: 'Jotkut asetuksista on muuttuneet. Oletko varma, että haluat sulkea valintaikkunan?',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, ei saatavissa</span>'
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Lisää erikoismerkki',
		title: 'Valitse erikoismerkki'
	},

	// Link dialog.
	link: {
		toolbar: 'Lisää linkki/muokkaa linkkiä',
		menu: 'Muokkaa linkkiä',
		title: 'Linkki',
		info: 'Linkin tiedot',
		target: 'Kohde',
		upload: 'Lisää tiedosto',
		advanced: 'Lisäominaisuudet',
		type: 'Linkkityyppi',
		toAnchor: 'Ankkuri tässä sivussa',
		toEmail: 'Sähköposti',
		target: 'Kohde',
		targetNotSet: '<ei asetettu>',
		targetFrame: '<kehys>',
		targetPopup: '<popup ikkuna>',
		targetNew: 'Uusi ikkuna (_blank)',
		targetTop: 'Päällimmäisin ikkuna (_top)',
		targetSelf: 'Sama ikkuna (_self)',
		targetParent: 'Emoikkuna (_parent)',
		targetFrameName: 'Kohdekehyksen nimi',
		targetPopupName: 'Popup ikkunan nimi',
		popupFeatures: 'Popup ikkunan ominaisuudet',
		popupResizable: 'Venytettävä',
		popupStatusBar: 'Tilarivi',
		popupLocationBar: 'Osoiterivi',
		popupToolbar: 'Vakiopainikkeet',
		popupMenuBar: 'Valikkorivi',
		popupFullScreen: 'Täysi ikkuna (IE)',
		popupScrollBars: 'Vierityspalkit',
		popupDependent: 'Riippuva (Netscape)',
		popupWidth: 'Leveys',
		popupLeft: 'Vasemmalta (px)',
		popupHeight: 'Korkeus',
		popupTop: 'Ylhäältä (px)',
		id: 'Tunniste',
		langDir: 'Kielen suunta',
		langDirNotSet: '<ei asetettu>',
		langDirLTR: 'Vasemmalta oikealle (LTR)',
		langDirRTL: 'Oikealta vasemmalle (RTL)',
		acccessKey: 'Pikanäppäin',
		name: 'Nimi',
		langCode: 'Kielen suunta',
		tabIndex: 'Tabulaattori indeksi',
		advisoryTitle: 'Avustava otsikko',
		advisoryContentType: 'Avustava sisällön tyyppi',
		cssClasses: 'Tyyliluokat',
		charset: 'Linkitetty kirjaimisto',
		styles: 'Tyyli',
		selectAnchor: 'Valitse ankkuri',
		anchorName: 'Ankkurin nimen mukaan',
		anchorId: 'Ankkurin ID:n mukaan',
		emailAddress: 'Sähköpostiosoite',
		emailSubject: 'Aihe',
		emailBody: 'Viesti',
		noAnchors: '(Ei ankkureita tässä dokumentissa)',
		noUrl: 'Linkille on kirjoitettava URL',
		noEmail: 'Kirjoita sähköpostiosoite'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Lisää ankkuri/muokkaa ankkuria',
		menu: 'Ankkurin ominaisuudet',
		title: 'Ankkurin ominaisuudet',
		name: 'Nimi',
		errorName: 'Ankkurille on kirjoitettava nimi'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Etsi ja korvaa',
		find: 'Etsi',
		replace: 'Korvaa',
		findWhat: 'Etsi mitä:',
		replaceWith: 'Korvaa tällä:',
		notFoundMsg: 'Etsittyä tekstiä ei löytynyt.',
		matchCase: 'Sama kirjainkoko',
		matchWord: 'Koko sana',
		matchCyclic: 'Kierrä ympäri',
		replaceAll: 'Korvaa kaikki',
		replaceSuccessMsg: '%1 esiintymä(ä) korvattu.'
	},

	// Table Dialog
	table: {
		toolbar: 'Taulu',
		title: 'Taulun ominaisuudet',
		menu: 'Taulun ominaisuudet',
		deleteTable: 'Poista taulu',
		rows: 'Rivit',
		columns: 'Sarakkeet',
		border: 'Rajan paksuus',
		align: 'Kohdistus',
		alignNotSet: '<ei asetettu>',
		alignLeft: 'Vasemmalle',
		alignCenter: 'Keskelle',
		alignRight: 'Oikealle',
		width: 'Leveys',
		widthPx: 'pikseliä',
		widthPc: 'prosenttia',
		height: 'Korkeus',
		cellSpace: 'Solujen väli',
		cellPad: 'Solujen sisennys',
		caption: 'Otsikko',
		summary: 'Yhteenveto',
		headers: 'Ylätunnisteet',
		headersNone: 'Ei',
		headersColumn: 'Ensimmäinen sarake',
		headersRow: 'Ensimmäinen rivi',
		headersBoth: 'Molemmat',
		invalidRows: 'Rivien määrän täytyy olla suurempi kuin 0.',
		invalidCols: 'Sarakkeiden määrän täytyy olla suurempi kuin 0.',
		invalidBorder: 'Reunan koon täytyy olla numero.',
		invalidWidth: 'Taulun leveyden täytyy olla numero.',
		invalidHeight: 'Taulun korkeuden täytyy olla numero.',
		invalidCellSpacing: 'Solujen välin täytyy olla numero.',
		invalidCellPadding: 'Solujen sisennyksen täytyy olla numero.',

		cell: {
			menu: 'Solu',
			insertBefore: 'Lisää solu eteen',
			insertAfter: 'Lisää solu perään',
			deleteCell: 'Poista solut',
			merge: 'Yhdistä solut',
			mergeRight: 'Yhdistä oikealla olevan kanssa',
			mergeDown: 'Yhdistä alla olevan kanssa',
			splitHorizontal: 'Jaa solu vaakasuunnassa',
			splitVertical: 'Jaa solu pystysuunnassa',
			title: 'Solun ominaisuudet',
			cellType: 'Solun tyyppi',
			rowSpan: 'Rivin jatkuvuus',
			colSpan: 'Solun jatkuvuus',
			wordWrap: 'Rivitys',
			hAlign: 'Horisontaali kohdistus',
			vAlign: 'Vertikaali kohdistus',
			alignTop: 'Ylös',
			alignMiddle: 'Keskelle',
			alignBottom: 'Alas',
			alignBaseline: 'Alas (teksti)',
			bgColor: 'Taustan väri',
			borderColor: 'Reunan väri',
			data: 'Data',
			header: 'Ylätunniste',
			yes: 'Kyllä',
			no: 'Ei',
			invalidWidth: 'Solun leveyden täytyy olla numero.',
			invalidHeight: 'Solun korkeuden täytyy olla numero.',
			invalidRowSpan: 'Rivin jatkuvuuden täytyy olla kokonaisluku.',
			invalidColSpan: 'Solun jatkuvuuden täytyy olla kokonaisluku.',
			chooseColor: 'Valitse'
		},

		row: {
			menu: 'Rivi',
			insertBefore: 'Lisää rivi yläpuolelle',
			insertAfter: 'Lisää rivi alapuolelle',
			deleteRow: 'Poista rivit'
		},

		column: {
			menu: 'Sarake',
			insertBefore: 'Lisää sarake vasemmalle',
			insertAfter: 'Lisää sarake oikealle',
			deleteColumn: 'Poista sarakkeet'
		}
	},

	// Button Dialog.
	button: {
		title: 'Painikkeen ominaisuudet',
		text: 'Teksti (arvo)',
		type: 'Tyyppi',
		typeBtn: 'Painike',
		typeSbm: 'Lähetä',
		typeRst: 'Tyhjennä'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Valintaruudun ominaisuudet',
		radioTitle: 'Radiopainikkeen ominaisuudet',
		value: 'Arvo',
		selected: 'Valittu'
	},

	// Form Dialog.
	form: {
		title: 'Lomakkeen ominaisuudet',
		menu: 'Lomakkeen ominaisuudet',
		action: 'Toiminto',
		method: 'Tapa',
		encoding: 'Enkoodaus',
		target: 'Kohde',
		targetNotSet: '<ei asetettu>',
		targetNew: 'Uusi ikkuna (_blank)',
		targetTop: 'Päällimmäisin ikkuna (_top)',
		targetSelf: 'Sama ikkuna (_self)',
		targetParent: 'Emoikkuna (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Valintakentän ominaisuudet',
		selectInfo: 'Info',
		opAvail: 'Ominaisuudet',
		value: 'Arvo',
		size: 'Koko',
		lines: 'Rivit',
		chkMulti: 'Salli usea valinta',
		opText: 'Teksti',
		opValue: 'Arvo',
		btnAdd: 'Lisää',
		btnModify: 'Muuta',
		btnUp: 'Ylös',
		btnDown: 'Alas',
		btnSetValue: 'Aseta valituksi',
		btnDelete: 'Poista'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Tekstilaatikon ominaisuudet',
		cols: 'Sarakkeita',
		rows: 'Rivejä'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Tekstikentän ominaisuudet',
		name: 'Nimi',
		value: 'Arvo',
		charWidth: 'Leveys',
		maxChars: 'Maksimi merkkimäärä',
		type: 'Tyyppi',
		typeText: 'Teksti',
		typePass: 'Salasana'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Piilokentän ominaisuudet',
		name: 'Nimi',
		value: 'Arvo'
	},

	// Image Dialog.
	image: {
		title: 'Kuvan ominaisuudet',
		titleButton: 'Kuvapainikkeen ominaisuudet',
		menu: 'Kuvan ominaisuudet',
		infoTab: 'Kuvan tiedot',
		btnUpload: 'Lähetä palvelimelle',
		url: 'Osoite',
		upload: 'Lisää kuva',
		alt: 'Vaihtoehtoinen teksti',
		width: 'Leveys',
		height: 'Korkeus',
		lockRatio: 'Lukitse suhteet',
		resetSize: 'Alkuperäinen koko',
		border: 'Raja',
		hSpace: 'Vaakatila',
		vSpace: 'Pystytila',
		align: 'Kohdistus',
		alignLeft: 'Vasemmalle',
		alignRight: 'Oikealle',
		preview: 'Esikatselu',
		alertUrl: 'Kirjoita kuvan osoite (URL)',
		linkTab: 'Linkki',
		button2Img: 'Haluatko muuntaa valitun kuvanäppäimen kuvaksi?',
		img2Button: 'Haluatko muuntaa valitun kuvan kuvanäppäimeksi?',
		urlMissing: 'Kuvan lähdeosoite puuttuu.'
	},

	// Flash Dialog
	flash: {
		properties: 'Flash ominaisuudet',
		propertiesTab: 'Ominaisuudet',
		title: 'Flash ominaisuudet',
		chkPlay: 'Automaattinen käynnistys',
		chkLoop: 'Toisto',
		chkMenu: 'Näytä Flash-valikko',
		chkFull: 'Salli kokoruututila',
		scale: 'Levitä',
		scaleAll: 'Näytä kaikki',
		scaleNoBorder: 'Ei rajaa',
		scaleFit: 'Tarkka koko',
		access: 'Skriptien pääsy',
		accessAlways: 'Aina',
		accessSameDomain: 'Sama verkkotunnus',
		accessNever: 'Ei koskaan',
		align: 'Kohdistus',
		alignLeft: 'Vasemmalle',
		alignAbsBottom: 'Aivan alas',
		alignAbsMiddle: 'Aivan keskelle',
		alignBaseline: 'Alas (teksti)',
		alignBottom: 'Alas',
		alignMiddle: 'Keskelle',
		alignRight: 'Oikealle',
		alignTextTop: 'Ylös (teksti)',
		alignTop: 'Ylös',
		quality: 'Laatu',
		qualityBest: 'Paras',
		qualityHigh: 'Korkea',
		qualityAutoHigh: 'Automaattinen korkea',
		qualityMedium: 'Keskitaso',
		qualityAutoLow: 'Automaattinen matala',
		qualityLow: 'Matala',
		windowModeWindow: 'Ikkuna',
		windowModeOpaque: 'Läpinäkyvyys',
		windowModeTransparent: 'Läpinäkyvä',
		windowMode: 'Ikkuna tila',
		flashvars: 'Muuttujat Flash:lle',
		bgcolor: 'Taustaväri',
		width: 'Leveys',
		height: 'Korkeus',
		hSpace: 'Vaakatila',
		vSpace: 'Pystytila',
		validateSrc: 'Linkille on kirjoitettava URL',
		validateWidth: 'Leveyden täytyy olla numero.',
		validateHeight: 'Korkeuden täytyy olla numero.',
		validateHSpace: 'Vaakatilan täytyy olla numero.',
		validateVSpace: 'Pystytilan täytyy olla numero.'
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Tarkista oikeinkirjoitus',
		title: 'Oikoluku',
		notAvailable: 'Valitettavasti oikoluku ei ole käytössä tällä hetkellä.',
		errorLoading: 'Virhe ladattaessa oikolukupalvelua isännältä: %s.',
		notInDic: 'Ei sanakirjassa',
		changeTo: 'Vaihda',
		btnIgnore: 'Jätä huomioimatta',
		btnIgnoreAll: 'Jätä kaikki huomioimatta',
		btnReplace: 'Korvaa',
		btnReplaceAll: 'Korvaa kaikki',
		btnUndo: 'Kumoa',
		noSuggestions: 'Ei ehdotuksia',
		progress: 'Tarkistus käynnissä...',
		noMispell: 'Tarkistus valmis: Ei virheitä',
		noChanges: 'Tarkistus valmis: Yhtään sanaa ei muutettu',
		oneChange: 'Tarkistus valmis: Yksi sana muutettiin',
		manyChanges: 'Tarkistus valmis: %1 sanaa muutettiin',
		ieSpellDownload: 'Oikeinkirjoituksen tarkistusta ei ole asennettu. Haluatko ladata sen nyt?'
	},

	smiley: {
		toolbar: 'Hymiö',
		title: 'Lisää hymiö'
	},

	elementsPath: {
		eleTitle: '%1 elementti'
	},

	numberedlist: 'Numerointi',
	bulletedlist: 'Luottelomerkit',
	indent: 'Suurenna sisennystä',
	outdent: 'Pienennä sisennystä',

	justify: {
		left: 'Tasaa vasemmat reunat',
		center: 'Keskitä',
		right: 'Tasaa oikeat reunat',
		block: 'Tasaa molemmat reunat'
	},

	blockquote: 'Lainaus',

	clipboard: {
		title: 'Liitä',
		cutError: 'Selaimesi turva-asetukset eivät salli editorin toteuttaa leikkaamista. Käytä näppäimistöä leikkaamiseen (Ctrl+X).',
		copyError: 'Selaimesi turva-asetukset eivät salli editorin toteuttaa kopioimista. Käytä näppäimistöä kopioimiseen (Ctrl+C).',
		pasteMsg: 'Liitä painamalla (<STRONG>Ctrl+V</STRONG>) ja painamalla <STRONG>OK</STRONG>.',
		securityMsg: 'Selaimesi turva-asetukset eivät salli editorin käyttää leikepöytää suoraan. Sinun pitää suorittaa liittäminen tässä ikkunassa.'
	},

	pastefromword: {
		toolbar: 'Liitä Wordista',
		title: 'Liitä Wordista',
		advice: 'Liitä painamalla (<STRONG>Ctrl+V</STRONG>) ja painamalla <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Jätä huomioimatta fonttimääritykset',
		removeStyle: 'Poista tyylimääritykset'
	},

	pasteText: {
		button: 'Liitä tekstinä',
		title: 'Liitä tekstinä'
	},

	templates: {
		button: 'Pohjat',
		title: 'Sisältöpohjat',
		insertOption: 'Korvaa editorin koko sisältö',
		selectPromptMsg: 'Valitse pohja editoriin<br>(aiempi sisältö menetetään):',
		emptyListMsg: '(Ei määriteltyjä pohjia)'
	},

	showBlocks: 'Näytä elementit',

	stylesCombo: {
		label: 'Tyyli',
		voiceLabel: 'Tyylit',
		panelVoiceLabel: 'Valitse tyyli',
		panelTitle1: 'Lohkojen tyylit',
		panelTitle2: 'Rivinsisäiset tyylit',
		panelTitle3: 'Objektien tyylit'
	},

	format: {
		label: 'Muotoilu',
		voiceLabel: 'Muotoilu',
		panelTitle: 'Muotoilu',
		panelVoiceLabel: 'Valitse kappaleen muotoilu',

		tag_p: 'Normaali',
		tag_pre: 'Muotoiltu',
		tag_address: 'Osoite',
		tag_h1: 'Otsikko 1',
		tag_h2: 'Otsikko 2',
		tag_h3: 'Otsikko 3',
		tag_h4: 'Otsikko 4',
		tag_h5: 'Otsikko 5',
		tag_h6: 'Otsikko 6',
		tag_div: 'Normaali (DIV)'
	},

	font: {
		label: 'Kirjaisinlaji',
		voiceLabel: 'Kirjaisinlaji',
		panelTitle: 'Kirjaisinlaji',
		panelVoiceLabel: 'Valitse kirjaisinlaji'
	},

	fontSize: {
		label: 'Koko',
		voiceLabel: 'Kirjaisimen koko',
		panelTitle: 'Koko',
		panelVoiceLabel: 'Valitse kirjaisimen koko'
	},

	colorButton: {
		textColorTitle: 'Tekstiväri',
		bgColorTitle: 'Taustaväri',
		auto: 'Automaattinen',
		more: 'Lisää värejä...'
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
		title: 'Oikolue kirjoitettaessa',
		enable: 'Ota käyttöön oikoluku kirjoitettaessa',
		disable: 'Poista käytöstä oikoluku kirjoitetaessa',
		about: 'Tietoja oikoluvusta kirjoitetaessa',
		toggle: 'Vaihda oikoluku kirjoittaessa tilaa',
		options: 'Asetukset',
		langs: 'Kielet',
		moreSuggestions: 'Lisää ehdotuksia',
		ignore: 'Ohita',
		ignoreAll: 'Ohita kaikki',
		addWord: 'Lisää sana',
		emptyDic: 'Sanakirjan nimi on annettava.',
		optionsTab: 'Asetukset',
		languagesTab: 'Kielet',
		dictionariesTab: 'Sanakirjat',
		aboutTab: 'Tietoa'
	},

	about: {
		title: 'Tietoa CKEditorista',
		dlgTitle: 'Tietoa CKEditorista',
		moreInfo: 'Lisenssitiedot löytyvät kotisivuiltamme:',
		copy: 'Copyright &copy; $1. Kaikki oikeuden pidätetään.'
	},

	maximize: 'Suurenna',
	minimize: 'Pienennä',

	fakeobjects: {
		anchor: 'Ankkuri',
		flash: 'Flash animaatio',
		div: 'Sivun vaihto',
		unknown: 'Tuntematon objekti'
	},

	resize: 'Raahaa muuttaaksesi kokoa',

	colordialog: {
		title: 'Valitse väri',
		highlight: 'Korostus',
		selected: 'Valittu',
		clear: 'Poista'
	},

	toolbarCollapse: 'Collapse Toolbar', // MISSING
	toolbarExpand: 'Expand Toolbar' // MISSING
};

/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Dutch language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'nl' ] = {
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
	source: 'Code',
	newPage: 'Nieuwe pagina',
	save: 'Opslaan',
	preview: 'Voorbeeld',
	cut: 'Knippen',
	copy: 'Kopiëren',
	paste: 'Plakken',
	print: 'Printen',
	underline: 'Onderstreept',
	bold: 'Vet',
	italic: 'Schuingedrukt',
	selectAll: 'Alles selecteren',
	removeFormat: 'Opmaak verwijderen',
	strike: 'Doorhalen',
	subscript: 'Subscript',
	superscript: 'Superscript',
	horizontalrule: 'Horizontale lijn invoegen',
	pagebreak: 'Pagina-einde invoegen',
	unlink: 'Link verwijderen',
	undo: 'Ongedaan maken',
	redo: 'Opnieuw uitvoeren',

	// Common messages and labels.
	common: {
		browseServer: 'Bladeren op server',
		url: 'URL',
		protocol: 'Protocol',
		upload: 'Upload',
		uploadSubmit: 'Naar server verzenden',
		image: 'Afbeelding',
		flash: 'Flash',
		form: 'Formulier',
		checkbox: 'Aanvinkvakje',
		radio: 'Selectievakje',
		textField: 'Tekstveld',
		textarea: 'Tekstvak',
		hiddenField: 'Verborgen veld',
		button: 'Knop',
		select: 'Selectieveld',
		imageButton: 'Afbeeldingsknop',
		notSet: '<niet ingevuld>',
		id: 'Kenmerk',
		name: 'Naam',
		langDir: 'Schrijfrichting',
		langDirLtr: 'Links naar rechts (LTR)',
		langDirRtl: 'Rechts naar links (RTL)',
		langCode: 'Taalcode',
		longDescr: 'Lange URL-omschrijving',
		cssClass: 'Stylesheet-klassen',
		advisoryTitle: 'Aanbevolen titel',
		cssStyle: 'Stijl',
		ok: 'OK',
		cancel: 'Annuleren',
		close: 'Close', // MISSING
		preview: 'Preview', // MISSING
		generalTab: 'Algemeen',
		advancedTab: 'Geavanceerd',
		validateNumberFailed: 'Deze waarde is geen geldig getal.',
		confirmNewPage: 'Alle aangebrachte wijzigingen gaan verloren. Weet u zeker dat u een nieuwe pagina wilt openen?',
		confirmCancel: 'Enkele opties zijn gewijzigd. Weet u zeker dat u dit dialoogvenster wilt sluiten?',
		options: 'Options', // MISSING
		target: 'Target', // MISSING
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, niet beschikbaar</span>'
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Speciaal teken invoegen',
		title: 'Selecteer speciaal teken',
		options: 'Special Character Options' // MISSING
	},

	// Link dialog.
	link: {
		toolbar: 'Link invoegen/wijzigen',
		other: '<ander>',
		menu: 'Link wijzigen',
		title: 'Link',
		info: 'Linkomschrijving',
		target: 'Doel',
		upload: 'Upload',
		advanced: 'Geavanceerd',
		type: 'Linktype',
		toUrl: 'URL', // MISSING
		toAnchor: 'Interne link in pagina',
		toEmail: 'E-mail',
		targetFrame: '<frame>',
		targetPopup: '<popup window>',
		targetFrameName: 'Naam doelframe',
		targetPopupName: 'Naam popupvenster',
		popupFeatures: 'Instellingen popupvenster',
		popupResizable: 'Herschaalbaar',
		popupStatusBar: 'Statusbalk',
		popupLocationBar: 'Locatiemenu',
		popupToolbar: 'Menubalk',
		popupMenuBar: 'Menubalk',
		popupFullScreen: 'Volledig scherm (IE)',
		popupScrollBars: 'Schuifbalken',
		popupDependent: 'Afhankelijk (Netscape)',
		popupWidth: 'Breedte',
		popupLeft: 'Positie links',
		popupHeight: 'Hoogte',
		popupTop: 'Positie boven',
		id: 'Id',
		langDir: 'Schrijfrichting',
		langDirLTR: 'Links naar rechts (LTR)',
		langDirRTL: 'Rechts naar links (RTL)',
		acccessKey: 'Toegangstoets',
		name: 'Naam',
		langCode: 'Schrijfrichting',
		tabIndex: 'Tabvolgorde',
		advisoryTitle: 'Aanbevolen titel',
		advisoryContentType: 'Aanbevolen content-type',
		cssClasses: 'Stylesheet-klassen',
		charset: 'Karakterset van gelinkte bron',
		styles: 'Stijl',
		selectAnchor: 'Kies een interne link',
		anchorName: 'Op naam interne link',
		anchorId: 'Op kenmerk interne link',
		emailAddress: 'E-mailadres',
		emailSubject: 'Onderwerp bericht',
		emailBody: 'Inhoud bericht',
		noAnchors: '(Geen interne links in document gevonden)',
		noUrl: 'Geef de link van de URL',
		noEmail: 'Geef een e-mailadres'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Interne link',
		menu: 'Eigenschappen interne link',
		title: 'Eigenschappen interne link',
		name: 'Naam interne link',
		errorName: 'Geef de naam van de interne link op'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Zoeken en vervangen',
		find: 'Zoeken',
		replace: 'Vervangen',
		findWhat: 'Zoeken naar:',
		replaceWith: 'Vervangen met:',
		notFoundMsg: 'De opgegeven tekst is niet gevonden.',
		matchCase: 'Hoofdlettergevoelig',
		matchWord: 'Hele woord moet voorkomen',
		matchCyclic: 'Doorlopend zoeken',
		replaceAll: 'Alles vervangen',
		replaceSuccessMsg: '%1 resulaten vervangen.'
	},

	// Table Dialog
	table: {
		toolbar: 'Tabel',
		title: 'Eigenschappen tabel',
		menu: 'Eigenschappen tabel',
		deleteTable: 'Tabel verwijderen',
		rows: 'Rijen',
		columns: 'Kolommen',
		border: 'Breedte rand',
		align: 'Uitlijning',
		alignLeft: 'Links',
		alignCenter: 'Centreren',
		alignRight: 'Rechts',
		width: 'Breedte',
		widthPx: 'pixels',
		widthPc: 'procent',
		widthUnit: 'width unit', // MISSING
		height: 'Hoogte',
		cellSpace: 'Afstand tussen cellen',
		cellPad: 'Ruimte in de cel',
		caption: 'Naam',
		summary: 'Samenvatting',
		headers: 'Koppen',
		headersNone: 'Geen',
		headersColumn: 'Eerste kolom',
		headersRow: 'Eerste rij',
		headersBoth: 'Beide',
		invalidRows: 'Het aantal rijen moet een getal zijn groter dan 0.',
		invalidCols: 'Het aantal kolommen moet een getal zijn groter dan 0.',
		invalidBorder: 'De rand breedte moet een getal zijn.',
		invalidWidth: 'De tabel breedte moet een getal zijn.',
		invalidHeight: 'De tabel hoogte moet een getal zijn.',
		invalidCellSpacing: 'Afstand tussen cellen moet een getal zijn.',
		invalidCellPadding: 'Ruimte in de cel moet een getal zijn.',

		cell: {
			menu: 'Cel',
			insertBefore: 'Voeg cel in voor',
			insertAfter: 'Voeg cel in achter',
			deleteCell: 'Cellen verwijderen',
			merge: 'Cellen samenvoegen',
			mergeRight: 'Voeg samen naar rechts',
			mergeDown: 'Voeg samen naar beneden',
			splitHorizontal: 'Splits cellen horizontaal',
			splitVertical: 'Splits cellen verticaal',
			title: 'Cel eigenschappen',
			cellType: 'Cel type',
			rowSpan: 'Rijen samenvoegen',
			colSpan: 'Kolommen samenvoegen',
			wordWrap: 'Automatische terugloop',
			hAlign: 'Horizontale uitlijning',
			vAlign: 'Verticale uitlijning',
			alignTop: 'Boven',
			alignMiddle: 'Midden',
			alignBottom: 'Onder',
			alignBaseline: 'Basislijn',
			bgColor: 'Achtergrondkleur',
			borderColor: 'Kleur rand',
			data: 'Inhoud',
			header: 'Kop',
			yes: 'Ja',
			no: 'Nee',
			invalidWidth: 'De celbreedte moet een getal zijn.',
			invalidHeight: 'De celhoogte moet een getal zijn.',
			invalidRowSpan: 'Rijen samenvoegen moet een heel getal zijn.',
			invalidColSpan: 'Kolommen samenvoegen moet een heel getal zijn.',
			chooseColor: 'Kies'
		},

		row: {
			menu: 'Rij',
			insertBefore: 'Voeg rij in voor',
			insertAfter: 'Voeg rij in achter',
			deleteRow: 'Rijen verwijderen'
		},

		column: {
			menu: 'Kolom',
			insertBefore: 'Voeg kolom in voor',
			insertAfter: 'Voeg kolom in achter',
			deleteColumn: 'Kolommen verwijderen'
		}
	},

	// Button Dialog.
	button: {
		title: 'Eigenschappen knop',
		text: 'Tekst (waarde)',
		type: 'Soort',
		typeBtn: 'Knop',
		typeSbm: 'Versturen',
		typeRst: 'Leegmaken'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Eigenschappen aanvinkvakje',
		radioTitle: 'Eigenschappen selectievakje',
		value: 'Waarde',
		selected: 'Geselecteerd'
	},

	// Form Dialog.
	form: {
		title: 'Eigenschappen formulier',
		menu: 'Eigenschappen formulier',
		action: 'Actie',
		method: 'Methode',
		encoding: 'Codering'
	},

	// Select Field Dialog.
	select: {
		title: 'Eigenschappen selectieveld',
		selectInfo: 'Informatie',
		opAvail: 'Beschikbare opties',
		value: 'Waarde',
		size: 'Grootte',
		lines: 'Regels',
		chkMulti: 'Gecombineerde selecties toestaan',
		opText: 'Tekst',
		opValue: 'Waarde',
		btnAdd: 'Toevoegen',
		btnModify: 'Wijzigen',
		btnUp: 'Omhoog',
		btnDown: 'Omlaag',
		btnSetValue: 'Als geselecteerde waarde instellen',
		btnDelete: 'Verwijderen'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Eigenschappen tekstvak',
		cols: 'Kolommen',
		rows: 'Rijen'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Eigenschappen tekstveld',
		name: 'Naam',
		value: 'Waarde',
		charWidth: 'Breedte (tekens)',
		maxChars: 'Maximum aantal tekens',
		type: 'Soort',
		typeText: 'Tekst',
		typePass: 'Wachtwoord'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Eigenschappen verborgen veld',
		name: 'Naam',
		value: 'Waarde'
	},

	// Image Dialog.
	image: {
		title: 'Eigenschappen afbeelding',
		titleButton: 'Eigenschappen afbeeldingsknop',
		menu: 'Eigenschappen afbeelding',
		infoTab: 'Informatie afbeelding',
		btnUpload: 'Naar server verzenden',
		upload: 'Upload',
		alt: 'Alternatieve tekst',
		width: 'Breedte',
		height: 'Hoogte',
		lockRatio: 'Afmetingen vergrendelen',
		unlockRatio: 'Unlock Ratio', // MISSING
		resetSize: 'Afmetingen resetten',
		border: 'Rand',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		align: 'Uitlijning',
		alignLeft: 'Links',
		alignRight: 'Rechts',
		alertUrl: 'Geef de URL van de afbeelding',
		linkTab: 'Link',
		button2Img: 'Wilt u de geselecteerde afbeeldingsknop vervangen door een eenvoudige afbeelding?',
		img2Button: 'Wilt u de geselecteerde afbeelding vervangen door een afbeeldingsknop?',
		urlMissing: 'De URL naar de afbeelding ontbreekt.',
		validateWidth: 'Width must be a whole number.', // MISSING
		validateHeight: 'Height must be a whole number.', // MISSING
		validateBorder: 'Border must be a whole number.', // MISSING
		validateHSpace: 'HSpace must be a whole number.', // MISSING
		validateVSpace: 'VSpace must be a whole number.' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Eigenschappen Flash',
		propertiesTab: 'Eigenschappen',
		title: 'Eigenschappen Flash',
		chkPlay: 'Automatisch afspelen',
		chkLoop: 'Herhalen',
		chkMenu: 'Flashmenu\'s inschakelen',
		chkFull: 'Schermvullend toestaan',
		scale: 'Schaal',
		scaleAll: 'Alles tonen',
		scaleNoBorder: 'Geen rand',
		scaleFit: 'Precies passend',
		access: 'Script toegang',
		accessAlways: 'Altijd',
		accessSameDomain: 'Zelfde domeinnaam',
		accessNever: 'Nooit',
		align: 'Uitlijning',
		alignLeft: 'Links',
		alignAbsBottom: 'Absoluut-onder',
		alignAbsMiddle: 'Absoluut-midden',
		alignBaseline: 'Basislijn',
		alignBottom: 'Beneden',
		alignMiddle: 'Midden',
		alignRight: 'Rechts',
		alignTextTop: 'Boven tekst',
		alignTop: 'Boven',
		quality: 'Kwaliteit',
		qualityBest: 'Beste',
		qualityHigh: 'Hoog',
		qualityAutoHigh: 'Automatisch hoog',
		qualityMedium: 'Gemiddeld',
		qualityAutoLow: 'Automatisch laag',
		qualityLow: 'Laag',
		windowModeWindow: 'Venster',
		windowModeOpaque: 'Ondoorzichtig',
		windowModeTransparent: 'Doorzichtig',
		windowMode: 'Venster modus',
		flashvars: 'Variabelen voor Flash',
		bgcolor: 'Achtergrondkleur',
		width: 'Breedte',
		height: 'Hoogte',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		validateSrc: 'Geef de link van de URL',
		validateWidth: 'De breedte moet een getal zijn.',
		validateHeight: 'De hoogte moet een getal zijn.',
		validateHSpace: 'De HSpace moet een getal zijn.',
		validateVSpace: 'De VSpace moet een getal zijn.'
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Spellingscontrole',
		title: 'Spellingscontrole',
		notAvailable: 'Excuses, deze dienst is momenteel niet beschikbaar.',
		errorLoading: 'Er is een fout opgetreden bij het laden van de diesnt: %s.',
		notInDic: 'Niet in het woordenboek',
		changeTo: 'Wijzig in',
		btnIgnore: 'Negeren',
		btnIgnoreAll: 'Alles negeren',
		btnReplace: 'Vervangen',
		btnReplaceAll: 'Alles vervangen',
		btnUndo: 'Ongedaan maken',
		noSuggestions: '-Geen suggesties-',
		progress: 'Bezig met spellingscontrole...',
		noMispell: 'Klaar met spellingscontrole: geen fouten gevonden',
		noChanges: 'Klaar met spellingscontrole: geen woorden aangepast',
		oneChange: 'Klaar met spellingscontrole: één woord aangepast',
		manyChanges: 'Klaar met spellingscontrole: %1 woorden aangepast',
		ieSpellDownload: 'De spellingscontrole niet geïnstalleerd. Wilt u deze nu downloaden?'
	},

	smiley: {
		toolbar: 'Smiley',
		title: 'Smiley invoegen',
		options: 'Smiley Options' // MISSING
	},

	elementsPath: {
		eleLabel: 'Elements path', // MISSING
		eleTitle: '%1 element'
	},

	numberedlist: 'Genummerde lijst',
	bulletedlist: 'Opsomming',
	indent: 'Inspringen vergroten',
	outdent: 'Inspringen verkleinen',

	justify: {
		left: 'Links uitlijnen',
		center: 'Centreren',
		right: 'Rechts uitlijnen',
		block: 'Uitvullen'
	},

	blockquote: 'Citaatblok',

	clipboard: {
		title: 'Plakken',
		cutError: 'De beveiligingsinstelling van de browser verhinderen het automatisch knippen. Gebruik de sneltoets Ctrl+X van het toetsenbord.',
		copyError: 'De beveiligingsinstelling van de browser verhinderen het automatisch kopiëren. Gebruik de sneltoets Ctrl+C van het toetsenbord.',
		pasteMsg: 'Plak de tekst in het volgende vak gebruik makend van uw toetsenbord (<strong>Ctrl+V</strong>) en klik op <strong>OK</strong>.',
		securityMsg: 'Door de beveiligingsinstellingen van uw browser is het niet mogelijk om direct vanuit het klembord in de editor te plakken. Middels opnieuw plakken in dit venster kunt u de tekst alsnog plakken in de editor.',
		pasteArea: 'Paste Area' // MISSING
	},

	pastefromword: {
		confirmCleanup: 'De tekst die u plakte lijkt gekopieerd te zijn vanuit Word. Wilt u de tekst opschonen voordat deze geplakt wordt?',
		toolbar: 'Plakken als Word-gegevens',
		title: 'Plakken als Word-gegevens',
		error: 'Het was niet mogelijk om de geplakte tekst op te schonen door een interne fout'
	},

	pasteText: {
		button: 'Plakken als platte tekst',
		title: 'Plakken als platte tekst'
	},

	templates: {
		button: 'Sjablonen',
		title: 'Inhoud sjabonen',
		options: 'Template Options', // MISSING
		insertOption: 'Vervang de huidige inhoud',
		selectPromptMsg: 'Selecteer het sjabloon dat in de editor geopend moet worden (de actuele inhoud gaat verloren):',
		emptyListMsg: '(Geen sjablonen gedefinieerd)'
	},

	showBlocks: 'Toon blokken',

	stylesCombo: {
		label: 'Stijl',
		panelTitle: 'Formatting Styles', // MISSING
		panelTitle1: 'Blok stijlen',
		panelTitle2: 'In-line stijlen',
		panelTitle3: 'Object stijlen'
	},

	format: {
		label: 'Opmaak',
		panelTitle: 'Opmaak',

		tag_p: 'Normaal',
		tag_pre: 'Met opmaak',
		tag_address: 'Adres',
		tag_h1: 'Kop 1',
		tag_h2: 'Kop 2',
		tag_h3: 'Kop 3',
		tag_h4: 'Kop 4',
		tag_h5: 'Kop 5',
		tag_h6: 'Kop 6',
		tag_div: 'Normaal (DIV)'
	},

	div: {
		title: 'Div aanmaken',
		toolbar: 'Div aanmaken',
		cssClassInputLabel: 'Stylesheet klassen',
		styleSelectLabel: 'Stijl',
		IdInputLabel: 'Id',
		languageCodeInputLabel: ' Taalcode',
		inlineStyleInputLabel: 'Inline stijl',
		advisoryTitleInputLabel: 'informatieve titel',
		langDirLabel: 'Schrijfrichting',
		langDirLTRLabel: 'Links naar rechts (LTR)',
		langDirRTLLabel: 'Rechts naar links (RTL)',
		edit: 'Div wijzigen',
		remove: 'Div verwijderen'
	},

	font: {
		label: 'Lettertype',
		voiceLabel: 'Lettertype',
		panelTitle: 'Lettertype'
	},

	fontSize: {
		label: 'Lettergrootte',
		voiceLabel: 'Lettergrootte',
		panelTitle: 'Lettergrootte'
	},

	colorButton: {
		textColorTitle: 'Tekstkleur',
		bgColorTitle: 'Achtergrondkleur',
		panelTitle: 'Colors', // MISSING
		auto: 'Automatisch',
		more: 'Meer kleuren...'
	},

	colors: {
		'000': 'Zwart',
		'800000': 'Kastanjebruin',
		'8B4513': 'Chocoladebruin',
		'2F4F4F': 'Donkerleigrijs',
		'008080': 'Blauwgroen',
		'000080': 'Marine',
		'4B0082': 'Indigo',
		'696969': 'Donkergrijs',
		'B22222': 'Baksteen',
		'A52A2A': 'Bruin',
		'DAA520': 'Donkergeel',
		'006400': 'Donkergroen',
		'40E0D0': 'Turquoise',
		'0000CD': 'Middenblauw',
		'800080': 'Paars',
		'808080': 'Grijs',
		'F00': 'Rood',
		'FF8C00': 'Donkeroranje',
		'FFD700': 'Goud',
		'008000': 'Groen',
		'0FF': 'Cyaan',
		'00F': 'Blauw',
		'EE82EE': 'Violet',
		'A9A9A9': 'Donkergrijs',
		'FFA07A': 'Lichtzalm',
		'FFA500': 'Oranje',
		'FFFF00': 'Geel',
		'00FF00': 'Felgroen',
		'AFEEEE': 'Lichtturquoise',
		'ADD8E6': 'Lichtblauw',
		'DDA0DD': 'Pruim',
		'D3D3D3': 'Lichtgrijs',
		'FFF0F5': 'Linnen',
		'FAEBD7': 'Ivoor',
		'FFFFE0': 'Lichtgeel',
		'F0FFF0': 'Honingdauw',
		'F0FFFF': 'Azuur',
		'F0F8FF': 'Licht hemelsblauw',
		'E6E6FA': 'Lavendel',
		'FFF': 'Wit'
	},

	scayt: {
		title: 'Controleer de spelling tijdens het typen',
		enable: 'SCAYT inschakelen',
		disable: 'SCAYT uitschakelen',
		about: 'Over SCAYT',
		toggle: 'SCAYT in/uitschakelen',
		options: 'Opties',
		langs: 'Talen',
		moreSuggestions: 'Meer suggesties',
		ignore: 'Negeren',
		ignoreAll: 'Alles negeren',
		addWord: 'Woord toevoegen',
		emptyDic: 'De naam van het woordenboek mag niet leeg zijn.',
		optionsTab: 'Opties',
		languagesTab: 'Talen',
		dictionariesTab: 'Woordenboeken',
		aboutTab: 'Over'
	},

	about: {
		title: 'Over CKEditor',
		dlgTitle: 'Over CKEditor',
		moreInfo: 'Voor licentie informatie, bezoek onze website:',
		copy: 'Copyright &copy; $1. Alle rechten voorbehouden.'
	},

	maximize: 'Maximaliseren',
	minimize: 'Minimaliseren',

	fakeobjects: {
		anchor: 'Anker',
		flash: 'Flash animatie',
		div: 'Pagina einde',
		unknown: 'Onbekend object'
	},

	resize: 'Sleep om te herschalen',

	colordialog: {
		title: 'Selecteer kleur',
		highlight: 'Actief',
		selected: 'Geselecteerd',
		clear: 'Wissen'
	},

	toolbarCollapse: 'Werkbalk inklappen',
	toolbarExpand: 'Werkbalk uitklappen'
};

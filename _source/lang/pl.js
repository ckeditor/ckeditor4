/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Polish language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'pl' ] = {
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
	source: 'Źródło dokumentu',
	newPage: 'Nowa strona',
	save: 'Zapisz',
	preview: 'Podgląd',
	cut: 'Wytnij',
	copy: 'Kopiuj',
	paste: 'Wklej',
	print: 'Drukuj',
	underline: 'Podkreślenie',
	bold: 'Pogrubienie',
	italic: 'Kursywa',
	selectAll: 'Zaznacz wszystko',
	removeFormat: 'Usuń formatowanie',
	strike: 'Przekreślenie',
	subscript: 'Indeks dolny',
	superscript: 'Indeks górny',
	horizontalrule: 'Wstaw poziomą linię',
	pagebreak: 'Wstaw odstęp',
	unlink: 'Usuń hiperłącze',
	undo: 'Cofnij',
	redo: 'Ponów',

	// Common messages and labels.
	common: {
		browseServer: 'Przeglądaj',
		url: 'Adres URL',
		protocol: 'Protokół',
		upload: 'Wyślij',
		uploadSubmit: 'Wyślij',
		image: 'Obrazek',
		flash: 'Flash',
		form: 'Formularz',
		checkbox: 'Pole wyboru (checkbox)',
		radio: 'Pole wyboru (radio)',
		textField: 'Pole tekstowe',
		textarea: 'Obszar tekstowy',
		hiddenField: 'Pole ukryte',
		button: 'Przycisk',
		select: 'Lista wyboru',
		imageButton: 'Przycisk-obrazek',
		notSet: '<nie ustawione>',
		id: 'Id',
		name: 'Nazwa',
		langDir: 'Kierunek tekstu',
		langDirLtr: 'Od lewej do prawej (LTR)',
		langDirRtl: 'Od prawej do lewej (RTL)',
		langCode: 'Kod języka',
		longDescr: 'Długi opis hiperłącza',
		cssClass: 'Nazwa klasy CSS',
		advisoryTitle: 'Opis obiektu docelowego',
		cssStyle: 'Styl',
		ok: 'OK',
		cancel: 'Anuluj',
		generalTab: 'General', // MISSING
		advancedTab: 'Zaawansowane',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Wstaw znak specjalny',
		title: 'Wybierz znak specjalny'
	},

	// Link dialog.
	link: {
		toolbar: 'Wstaw/edytuj hiperłącze', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Edytuj hiperłącze',
		title: 'Hiperłącze',
		info: 'Informacje ',
		target: 'Cel',
		upload: 'Wyślij',
		advanced: 'Zaawansowane',
		type: 'Typ hiperłącza',
		toAnchor: 'Odnośnik wewnątrz strony',
		toEmail: 'Adres e-mail',
		target: 'Cel',
		targetNotSet: '<nie ustawione>',
		targetFrame: '<ramka>',
		targetPopup: '<wyskakujące okno>',
		targetNew: 'Nowe okno (_blank)',
		targetTop: 'Okno najwyższe w hierarchii (_top)',
		targetSelf: 'To samo okno (_self)',
		targetParent: 'Okno nadrzędne (_parent)',
		targetFrameName: 'Nazwa Ramki Docelowej',
		targetPopupName: 'Nazwa wyskakującego okna',
		popupFeatures: 'Właściwości wyskakującego okna',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Pasek statusu',
		popupLocationBar: 'Pasek adresu',
		popupToolbar: 'Pasek narzędzi',
		popupMenuBar: 'Pasek menu',
		popupFullScreen: 'Pełny ekran (IE)',
		popupScrollBars: 'Paski przewijania',
		popupDependent: 'Okno zależne (Netscape)',
		popupWidth: 'Szerokość',
		popupLeft: 'Pozycja w poziomie',
		popupHeight: 'Wysokość',
		popupTop: 'Pozycja w pionie',
		id: 'Id', // MISSING
		langDir: 'Kierunek tekstu',
		langDirNotSet: '<nie ustawione>',
		langDirLTR: 'Od lewej do prawej (LTR)',
		langDirRTL: 'Od prawej do lewej (RTL)',
		acccessKey: 'Klawisz dostępu',
		name: 'Nazwa',
		langCode: 'Kierunek tekstu',
		tabIndex: 'Indeks tabeli',
		advisoryTitle: 'Opis obiektu docelowego',
		advisoryContentType: 'Typ MIME obiektu docelowego',
		cssClasses: 'Nazwa klasy CSS',
		charset: 'Kodowanie znaków obiektu docelowego',
		styles: 'Styl',
		selectAnchor: 'Wybierz etykietę',
		anchorName: 'Wg etykiety',
		anchorId: 'Wg identyfikatora elementu',
		emailAddress: 'Adres e-mail',
		emailSubject: 'Temat',
		emailBody: 'Treść',
		noAnchors: '(W dokumencie nie zdefiniowano żadnych etykiet)',
		noUrl: 'Podaj adres URL',
		noEmail: 'Podaj adres e-mail'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Wstaw/edytuj kotwicę',
		menu: 'Właściwości kotwicy',
		title: 'Właściwości kotwicy',
		name: 'Nazwa kotwicy',
		errorName: 'Wpisz nazwę kotwicy'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Znajdź i zamień',
		find: 'Znajdź',
		replace: 'Zamień',
		findWhat: 'Znajdź:',
		replaceWith: 'Zastąp przez:',
		notFoundMsg: 'Nie znaleziono szukanego hasła.',
		matchCase: 'Uwzględnij wielkość liter',
		matchWord: 'Całe słowa',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Zastąp wszystko',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Tabela',
		title: 'Właściwości tabeli',
		menu: 'Właściwości tabeli',
		deleteTable: 'Usuń tabelę',
		rows: 'Liczba wierszy',
		columns: 'Liczba kolumn',
		border: 'Grubość ramki',
		align: 'Wyrównanie',
		alignNotSet: '<brak ustawień>',
		alignLeft: 'Do lewej',
		alignCenter: 'Do środka',
		alignRight: 'Do prawej',
		width: 'Szerokość',
		widthPx: 'piksele',
		widthPc: '%',
		height: 'Wysokość',
		cellSpace: 'Odstęp pomiędzy komórkami',
		cellPad: 'Margines wewnętrzny komórek',
		caption: 'Tytuł',
		summary: 'Podsumowanie',
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
			menu: 'Komórka',
			insertBefore: 'Wstaw komórkę z lewej',
			insertAfter: 'Wstaw komórkę z prawej',
			deleteCell: 'Usuń komórki',
			merge: 'Połącz komórki',
			mergeRight: 'Połącz z komórką z prawej',
			mergeDown: 'Połącz z komórką poniżej',
			splitHorizontal: 'Podziel komórkę poziomo',
			splitVertical: 'Podziel komórkę pionowo',
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
			menu: 'Wiersz',
			insertBefore: 'Wstaw wiersz powyżej',
			insertAfter: 'Wstaw wiersz poniżej',
			deleteRow: 'Usuń wiersze'
		},

		column: {
			menu: 'Kolumna',
			insertBefore: 'Wstaw kolumnę z lewej',
			insertAfter: 'Wstaw kolumnę z prawej',
			deleteColumn: 'Usuń kolumny'
		}
	},

	// Button Dialog.
	button: {
		title: 'Właściwości przycisku',
		text: 'Tekst (Wartość)',
		type: 'Typ',
		typeBtn: 'Przycisk',
		typeSbm: 'Wyślij',
		typeRst: 'Wyzeruj'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Właściwości pola wyboru (checkbox)',
		radioTitle: 'Właściwości pola wyboru (radio)',
		value: 'Wartość',
		selected: 'Zaznaczone'
	},

	// Form Dialog.
	form: {
		title: 'Właściwości formularza',
		menu: 'Właściwości formularza',
		action: 'Akcja',
		method: 'Metoda',
		encoding: 'Encoding', // MISSING
		target: 'Cel',
		targetNotSet: '<nie ustawione>',
		targetNew: 'Nowe okno (_blank)',
		targetTop: 'Okno najwyższe w hierarchii (_top)',
		targetSelf: 'To samo okno (_self)',
		targetParent: 'Okno nadrzędne (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Właściwości listy wyboru',
		selectInfo: 'Informacje',
		opAvail: 'Dostępne opcje',
		value: 'Wartość',
		size: 'Rozmiar',
		lines: 'linii',
		chkMulti: 'Wielokrotny wybór',
		opText: 'Tekst',
		opValue: 'Wartość',
		btnAdd: 'Dodaj',
		btnModify: 'Zmień',
		btnUp: 'Do góry',
		btnDown: 'Do dołu',
		btnSetValue: 'Ustaw wartość zaznaczoną',
		btnDelete: 'Usuń'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Właściwości obszaru tekstowego',
		cols: 'Kolumnu',
		rows: 'Wiersze'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Właściwości pola tekstowego',
		name: 'Nazwa',
		value: 'Wartość',
		charWidth: 'Szerokość w znakach',
		maxChars: 'Max. szerokość',
		type: 'Typ',
		typeText: 'Tekst',
		typePass: 'Hasło'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Właściwości pola ukrytego',
		name: 'Nazwa',
		value: 'Wartość'
	},

	// Image Dialog.
	image: {
		title: 'Właściwości obrazka',
		titleButton: 'Właściwości przycisku obrazka',
		menu: 'Właściwości obrazka',
		infoTab: 'Informacje o obrazku',
		btnUpload: 'Wyślij',
		url: 'Adres URL',
		upload: 'Wyślij',
		alt: 'Tekst zastępczy',
		width: 'Szerokość',
		height: 'Wysokość',
		lockRatio: 'Zablokuj proporcje',
		resetSize: 'Przywróć rozmiar',
		border: 'Ramka',
		hSpace: 'Odstęp poziomy',
		vSpace: 'Odstęp pionowy',
		align: 'Wyrównaj',
		alignLeft: 'Do lewej',
		alignAbsBottom: 'Do dołu',
		alignAbsMiddle: 'Do środka w pionie',
		alignBaseline: 'Do linii bazowej',
		alignBottom: 'Do dołu',
		alignMiddle: 'Do środka',
		alignRight: 'Do prawej',
		alignTextTop: 'Do góry tekstu',
		alignTop: 'Do góry',
		preview: 'Podgląd',
		alertUrl: 'Podaj adres obrazka.',
		linkTab: 'Hiperłącze',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Właściwości elementu Flash',
		propertiesTab: 'Properties', // MISSING
		title: 'Właściwości elementu Flash',
		chkPlay: 'Auto Odtwarzanie',
		chkLoop: 'Pętla',
		chkMenu: 'Włącz menu',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Skaluj',
		scaleAll: 'Pokaż wszystko',
		scaleNoBorder: 'Bez Ramki',
		scaleFit: 'Dokładne dopasowanie',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Wyrównaj',
		alignLeft: 'Do lewej',
		alignAbsBottom: 'Do dołu',
		alignAbsMiddle: 'Do środka w pionie',
		alignBaseline: 'Do linii bazowej',
		alignBottom: 'Do dołu',
		alignMiddle: 'Do środka',
		alignRight: 'Do prawej',
		alignTextTop: 'Do góry tekstu',
		alignTop: 'Do góry',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Kolor tła',
		width: 'Szerokość',
		height: 'Wysokość',
		hSpace: 'Odstęp poziomy',
		vSpace: 'Odstęp pionowy',
		validateSrc: 'Podaj adres URL',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Sprawdź pisownię',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Słowa nie ma w słowniku',
		changeTo: 'Zmień na',
		btnIgnore: 'Ignoruj',
		btnIgnoreAll: 'Ignoruj wszystkie',
		btnReplace: 'Zmień',
		btnReplaceAll: 'Zmień wszystkie',
		btnUndo: 'Cofnij',
		noSuggestions: '- Brak sugestii -',
		progress: 'Trwa sprawdzanie ...',
		noMispell: 'Sprawdzanie zakończone: nie znaleziono błędów',
		noChanges: 'Sprawdzanie zakończone: nie zmieniono żadnego słowa',
		oneChange: 'Sprawdzanie zakończone: zmieniono jedno słowo',
		manyChanges: 'Sprawdzanie zakończone: zmieniono %l słów',
		ieSpellDownload: 'Słownik nie jest zainstalowany. Chcesz go ściągnąć?'
	},

	smiley: {
		toolbar: 'Emotikona',
		title: 'Wstaw emotikonę'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Lista numerowana',
	bulletedlist: 'Lista wypunktowana',
	indent: 'Zwiększ wcięcie',
	outdent: 'Zmniejsz wcięcie',

	justify: {
		left: 'Wyrównaj do lewej',
		center: 'Wyrównaj do środka',
		right: 'Wyrównaj do prawej',
		block: 'Wyrównaj do lewej i prawej'
	},

	blockquote: 'Cytat',

	clipboard: {
		title: 'Wklej',
		cutError: 'Ustawienia bezpieczeństwa Twojej przeglądarki nie pozwalają na automatyczne wycinanie tekstu. Użyj skrótu klawiszowego Ctrl+X.',
		copyError: 'Ustawienia bezpieczeństwa Twojej przeglądarki nie pozwalają na automatyczne kopiowanie tekstu. Użyj skrótu klawiszowego Ctrl+C.',
		pasteMsg: 'Proszę wkleić w poniższym polu używając klawiaturowego skrótu (<STRONG>Ctrl+V</STRONG>) i kliknąć <STRONG>OK</STRONG>.',
		securityMsg: 'Zabezpieczenia przeglądarki uniemożliwiają wklejenie danych bezpośrednio do edytora. Proszę dane wkleić ponownie w tym okienku.'
	},

	pastefromword: {
		toolbar: 'Wklej z Worda',
		title: 'Wklej z Worda',
		advice: 'Proszę wkleić w poniższym polu używając klawiaturowego skrótu (<STRONG>Ctrl+V</STRONG>) i kliknąć <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Ignoruj definicje \'Font Face\'',
		removeStyle: 'Usuń definicje Stylów'
	},

	pasteText: {
		button: 'Wklej jako czysty tekst',
		title: 'Wklej jako czysty tekst'
	},

	templates: {
		button: 'Sablony',
		title: 'Szablony zawartości',
		insertOption: 'Zastąp aktualną zawartość',
		selectPromptMsg: 'Wybierz szablon do otwarcia w edytorze<br>(obecna zawartość okna edytora zostanie utracona):',
		emptyListMsg: '(Brak zdefiniowanych szablonów)'
	},

	showBlocks: 'Pokaż bloki',

	stylesCombo: {
		label: 'Styl',
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

		tag_p: 'Normalny',
		tag_pre: 'Tekst sformatowany',
		tag_address: 'Adres',
		tag_h1: 'Nagłówek 1',
		tag_h2: 'Nagłówek 2',
		tag_h3: 'Nagłówek 3',
		tag_h4: 'Nagłówek 4',
		tag_h5: 'Nagłówek 5',
		tag_h6: 'Nagłówek 6',
		tag_div: 'Normal (DIV)' // MISSING
	},

	font: {
		label: 'Czcionka',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'Czcionka',
		panelVoiceLabel: 'Select a font' // MISSING
	},

	fontSize: {
		label: 'Rozmiar',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'Rozmiar',
		panelVoiceLabel: 'Select a font size' // MISSING
	},

	colorButton: {
		textColorTitle: 'Kolor tekstu',
		bgColorTitle: 'Kolor tła',
		auto: 'Automatycznie',
		more: 'Więcej kolorów...'
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

	maximize: 'Maximize' // MISSING
};

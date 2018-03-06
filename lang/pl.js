/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object for the
 * Polish language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'pl' ] = {
	// ARIA description.
	editor: 'Edytor tekstu sformatowanego',
	editorPanel: 'Panel edytora tekstu sformatowanego',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'W celu uzyskania pomocy naciśnij ALT 0',

		browseServer: 'Przeglądaj',
		url: 'Adres URL',
		protocol: 'Protokół',
		upload: 'Wyślij',
		uploadSubmit: 'Wyślij',
		image: 'Obrazek',
		flash: 'Flash',
		form: 'Formularz',
		checkbox: 'Pole wyboru (checkbox)',
		radio: 'Przycisk opcji (radio)',
		textField: 'Pole tekstowe',
		textarea: 'Obszar tekstowy',
		hiddenField: 'Pole ukryte',
		button: 'Przycisk',
		select: 'Lista wyboru',
		imageButton: 'Przycisk graficzny',
		notSet: '<nie ustawiono>',
		id: 'Id',
		name: 'Nazwa',
		langDir: 'Kierunek tekstu',
		langDirLtr: 'Od lewej do prawej (LTR)',
		langDirRtl: 'Od prawej do lewej (RTL)',
		langCode: 'Kod języka',
		longDescr: 'Adres URL długiego opisu',
		cssClass: 'Nazwa klasy CSS',
		advisoryTitle: 'Opis obiektu docelowego',
		cssStyle: 'Styl',
		ok: 'OK',
		cancel: 'Anuluj',
		close: 'Zamknij',
		preview: 'Podgląd',
		resize: 'Przeciągnij, aby zmienić rozmiar',
		generalTab: 'Ogólne',
		advancedTab: 'Zaawansowane',
		validateNumberFailed: 'Ta wartość nie jest liczbą.',
		confirmNewPage: 'Wszystkie niezapisane zmiany zostaną utracone. Czy na pewno wczytać nową stronę?',
		confirmCancel: 'Pewne opcje zostały zmienione. Czy na pewno zamknąć okno dialogowe?',
		options: 'Opcje',
		target: 'Obiekt docelowy',
		targetNew: 'Nowe okno (_blank)',
		targetTop: 'Okno najwyżej w hierarchii (_top)',
		targetSelf: 'To samo okno (_self)',
		targetParent: 'Okno nadrzędne (_parent)',
		langDirLTR: 'Od lewej do prawej (LTR)',
		langDirRTL: 'Od prawej do lewej (RTL)',
		styles: 'Style',
		cssClasses: 'Klasy arkusza stylów',
		width: 'Szerokość',
		height: 'Wysokość',
		align: 'Wyrównaj',
		left: 'Do lewej',
		right: 'Do prawej',
		center: 'Do środka',
		justify: 'Wyjustuj',
		alignLeft: 'Wyrównaj do lewej',
		alignRight: 'Wyrównaj do prawej',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Do góry',
		alignMiddle: 'Do środka',
		alignBottom: 'Do dołu',
		alignNone: 'Brak',
		invalidValue: 'Nieprawidłowa wartość.',
		invalidHeight: 'Wysokość musi być liczbą.',
		invalidWidth: 'Szerokość musi być liczbą.',
		invalidLength: 'Wartość podana dla pola "%1" musi być liczbą dodatnią bez jednostki lub z poprawną jednostką długości (%2).',
		invalidCssLength: 'Wartość podana dla pola "%1" musi być liczbą dodatnią bez jednostki lub z poprawną jednostką długości zgodną z CSS (px, %, in, cm, mm, em, ex, pt lub pc).',
		invalidHtmlLength: 'Wartość podana dla pola "%1" musi być liczbą dodatnią bez jednostki lub z poprawną jednostką długości zgodną z HTML (px lub %).',
		invalidInlineStyle: 'Wartość podana dla stylu musi składać się z jednej lub większej liczby krotek w formacie "nazwa : wartość", rozdzielonych średnikami.',
		cssLengthTooltip: 'Wpisz liczbę dla wartości w pikselach lub liczbę wraz z jednostką długości zgodną z CSS (px, %, in, cm, mm, em, ex, pt lub pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, niedostępne</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'spacja',
			35: 'End',
			36: 'Home',
			46: 'Delete',
			112: 'F1',
			113: 'F2',
			114: 'F3',
			115: 'F4',
			116: 'F5',
			117: 'F6',
			118: 'F7',
			119: 'F8',
			120: 'F9',
			121: 'F10',
			122: 'F11',
			123: 'F12',
			124: 'F13',
			125: 'F14',
			126: 'F15',
			127: 'F16',
			128: 'F17',
			129: 'F18',
			130: 'F19',
			131: 'F20',
			132: 'F21',
			133: 'F22',
			134: 'F23',
			135: 'F24',
			224: 'Command'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Skrót klawiszowy',

		optionDefault: 'Domyślny'
	}
};

/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Croatian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'hr' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Bogati uređivač teksta, %1',
	editorPanel: 'Ploča Bogatog Uređivača Teksta',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Pritisni ALT 0 za pomoć',

		browseServer: 'Pretraži server',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Pošalji',
		uploadSubmit: 'Pošalji na server',
		image: 'Slika',
		form: 'Forma',
		checkbox: 'Checkbox',
		radio: 'Radio Button',
		textField: 'Text Field',
		textarea: 'Textarea',
		hiddenField: 'Hidden Field',
		button: 'Button',
		select: 'Selection Field',
		imageButton: 'Image Button',
		notSet: '<nije postavljeno>',
		id: 'Id',
		name: 'Naziv',
		langDir: 'Smjer jezika',
		langDirLtr: 'S lijeva na desno (LTR)',
		langDirRtl: 'S desna na lijevo (RTL)',
		langCode: 'Kôd jezika',
		longDescr: 'Dugački opis URL',
		cssClass: 'Klase stilova',
		advisoryTitle: 'Advisory naslov',
		cssStyle: 'Stil',
		ok: 'OK',
		cancel: 'Poništi',
		close: 'Zatvori',
		preview: 'Pregledaj',
		resize: 'Povuci za promjenu veličine',
		generalTab: 'Općenito',
		advancedTab: 'Napredno',
		validateNumberFailed: 'Ova vrijednost nije broj.',
		confirmNewPage: 'Sve napravljene promjene će biti izgubljene ukoliko ih niste snimili. Sigurno želite učitati novu stranicu?',
		confirmCancel: 'Neke od opcija su promjenjene. Sigurno želite zatvoriti ovaj prozor?',
		options: 'Opcije',
		target: 'Odredište',
		targetNew: 'Novi prozor (_blank)',
		targetTop: 'Vršni prozor (_top)',
		targetSelf: 'Isti prozor (_self)',
		targetParent: 'Roditeljski prozor (_parent)',
		langDirLTR: 'S lijeva na desno (LTR)',
		langDirRTL: 'S desna na lijevo (RTL)',
		styles: 'Stil',
		cssClasses: 'Klase stilova',
		width: 'Širina',
		height: 'Visina',
		align: 'Poravnanje',
		left: 'Lijevo',
		right: 'Desno',
		center: 'Središnje',
		justify: 'Blok poravnanje',
		alignLeft: 'Lijevo poravnanje',
		alignRight: 'Desno poravnanje',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Vrh',
		alignMiddle: 'Sredina',
		alignBottom: 'Dolje',
		alignNone: 'Bez poravnanja',
		invalidValue: 'Neispravna vrijednost.',
		invalidHeight: 'Visina mora biti broj.',
		invalidWidth: 'Širina mora biti broj.',
		invalidLength: 'Naznačena vrijednost polja "%1" mora biti pozitivni broj sa ili bez važeće mjerne jedinice (%2).',
		invalidCssLength: 'Vrijednost određena za "%1" polje mora biti pozitivni broj sa ili bez važećih CSS mjernih jedinica (px, %, in, cm, mm, em, ex, pt ili pc).',
		invalidHtmlLength: 'Vrijednost određena za "%1" polje mora biti pozitivni broj sa ili bez važećih HTML mjernih jedinica (px ili %).',
		invalidInlineStyle: 'Vrijednost za linijski stil mora sadržavati jednu ili više definicija s formatom "naziv:vrijednost", odvojenih točka-zarezom.',
		cssLengthTooltip: 'Unesite broj za vrijednost u pikselima ili broj s važećim CSS mjernim jedinicama (px, %, in, cm, mm, em, ex, pt ili pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nedostupno</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Space',
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
		keyboardShortcut: 'Prečica na tipkovnici',

		optionDefault: 'Zadano'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};

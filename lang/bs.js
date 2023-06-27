/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Bosnian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'bs' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Editor', // MISSING
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Press ALT 0 for help', // MISSING

		browseServer: 'Browse Server', // MISSING
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Šalji',
		uploadSubmit: 'Šalji na server',
		image: 'Slika',
		form: 'Forma',
		checkbox: 'Checkbox', // MISSING
		radio: 'Radio Button', // MISSING
		textField: 'Polje za unos teksta',
		textarea: 'Textarea', // MISSING
		hiddenField: 'Skriveno polje',
		button: 'Button',
		select: 'Selection Field', // MISSING
		imageButton: 'Image Button', // MISSING
		notSet: '<nije podešeno>',
		id: 'Id',
		name: 'Naziv',
		langDir: 'Smjer pisanja',
		langDirLtr: 'S lijeva na desno (LTR)',
		langDirRtl: 'S desna na lijevo (RTL)',
		langCode: 'Jezièni kôd',
		longDescr: 'Dugaèki opis URL-a',
		cssClass: 'Klase CSS stilova',
		advisoryTitle: 'Advisory title',
		cssStyle: 'Stil',
		ok: 'OK',
		cancel: 'Odustani',
		close: 'Zatvori',
		preview: 'Prikaži',
		resize: 'Promijeni veličinu',
		generalTab: 'Generalno',
		advancedTab: 'Naprednije',
		validateNumberFailed: 'Unesena vrijednost nije broj',
		confirmNewPage: 'Nesačuvane izmjene će biti izgubljene. Da li ste sigurni da želite otvoriti novu stranicu ?',
		confirmCancel: 'Napravili ste par izmjena. Da li želite zatvoriti prozor ?',
		options: 'Opcije',
		target: 'Prozor',
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'S lijeva na desno (LTR)',
		langDirRTL: 'S desna na lijevo (RTL)',
		styles: 'Stil',
		cssClasses: 'Klase CSS stilova',
		width: 'Širina',
		height: 'Visina',
		align: 'Poravnanje',
		left: 'Lijevo',
		right: 'Desno',
		center: 'Centar',
		justify: 'Puno poravnanje',
		alignLeft: 'Lijevo poravnanje',
		alignRight: 'Desno poravnanje',
		alignCenter: 'Centriranje',
		alignTop: 'Vrh',
		alignMiddle: 'Sredina',
		alignBottom: 'Dno',
		alignNone: 'Bez poravnanja',
		invalidValue: 'Nepravilna vrijednost',
		invalidHeight: 'Vrijednost visine mora biti broj.',
		invalidWidth: 'Vrijednost širine mora biti broj.',
		invalidLength: 'Vrijednost za "%1" polje mora biti pozitivan broj ili bez ispravne mjerne jedinice (%2).',
		invalidCssLength: 'Vrijednost za "%1" polje mora biti pozitivan broj ili bez validne CSS mjerne jedinice (px, %, in, cm, mm, em, ex, pt ili pc).',
		invalidHtmlLength: 'Vrijednost za "%1" polje mora biti pozitivan broj ili bez validne HTML mjerne jedinice (px ili %).',
		invalidInlineStyle: 'Vrijednost za inline stil mora sadržavati jedan ili više parova u formatu "name: value", razdvojenih tačka-zarezom.',
		cssLengthTooltip: 'Unesite vrijednost u pikselima ili kao broj sa ispravnom CSS jedinicom (px, %, in, cm, mm, em, ex, pt ili pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '$1<span class="cke_accessibility">, nedostupno</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace', // MISSING
			13: 'Enter', // MISSING
			16: 'Shift', // MISSING
			17: 'Ctrl', // MISSING
			18: 'Alt', // MISSING
			32: 'Space', // MISSING
			35: 'End', // MISSING
			36: 'Home', // MISSING
			46: 'Delete', // MISSING
			112: 'F1', // MISSING
			113: 'F2', // MISSING
			114: 'F3', // MISSING
			115: 'F4', // MISSING
			116: 'F5', // MISSING
			117: 'F6', // MISSING
			118: 'F7', // MISSING
			119: 'F8', // MISSING
			120: 'F9', // MISSING
			121: 'F10', // MISSING
			122: 'F11', // MISSING
			123: 'F12', // MISSING
			124: 'F13', // MISSING
			125: 'F14', // MISSING
			126: 'F15', // MISSING
			127: 'F16', // MISSING
			128: 'F17', // MISSING
			129: 'F18', // MISSING
			130: 'F19', // MISSING
			131: 'F20', // MISSING
			132: 'F21', // MISSING
			133: 'F22', // MISSING
			134: 'F23', // MISSING
			135: 'F24', // MISSING
			224: 'Command' // MISSING
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Keyboard shortcut', // MISSING

		optionDefault: 'Zadano'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};

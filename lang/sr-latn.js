/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Serbian (Latin) language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'sr-latn' ] = {
	// ARIA description.
	application: 'Uređivač bogatog teksta',
	editor: 'Uređivač ',
	editorPanel: 'Bogati uređivač panel',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Za pomoć pritisnite ALT 0',

		browseServer: 'Pretraži na serveru',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Pošalji',
		uploadSubmit: 'Pošalji na server',
		image: 'Slika',
		form: 'Formular',
		checkbox: 'Polje za potvrdu',
		radio: 'Radio-dugme',
		textField: 'Tekstualno polje',
		textarea: 'Zona teksta',
		hiddenField: 'Skriveno polje',
		button: 'Dugme',
		select: 'Padajuća lista',
		imageButton: 'Dugme sa slikom',
		notSet: '<nije postavljeno> ',
		id: 'Id',
		name: 'Naziv',
		langDir: 'Smer pisanja',
		langDirLtr: 'S leva na desno (LTR)',
		langDirRtl: 'S desna na levo (RTL)',
		langCode: 'Kôd jezika',
		longDescr: 'Detaljan opis URL',
		cssClass: 'CSS klase',
		advisoryTitle: 'Advisory naslov',
		cssStyle: 'Stil',
		ok: 'OK',
		cancel: 'Otkaži',
		close: 'Zatvori',
		preview: 'Izgled stranice',
		resize: 'Promena veličine',
		generalTab: 'Opšti',
		advancedTab: 'Dalje opcije',
		validateNumberFailed: 'Ova vrednost nije broj.',
		confirmNewPage: 'Nesačuvane promene ovog sadržaja će biti izgubljene. Jeste li sigurni da želita da učitate novu stranu?',
		confirmCancel: 'Neka podešavanja su promenjena.Sigurno želite zatvoriti prozor?',
		options: 'Podešavanja',
		target: 'Cilj',
		targetNew: 'Novi prozor (_blank)',
		targetTop: 'Prozor na vrhu stranice(_top)',
		targetSelf: 'Isti prozor (_self)',
		targetParent: 'Matični prozor (_parent)',
		langDirLTR: 'S leva na desno (LTR)',
		langDirRTL: 'S desna na levo (RTL)',
		styles: 'Stil',
		cssClasses: 'CSS klase',
		width: 'Širina',
		height: 'Visina',
		align: 'Ravnanje',
		left: 'Levo',
		right: 'Desno',
		center: 'Sredina',
		justify: 'Obostrano ravnanje',
		alignLeft: 'Levo ravnanje',
		alignRight: 'Desno ravnanje',
		alignCenter: 'Centralno ravnanje',
		alignTop: 'Vrh',
		alignMiddle: 'Sredina',
		alignBottom: 'Dole',
		alignNone: 'Ništa',
		invalidValue: 'Nevažeća vrednost.',
		invalidHeight: 'U polje visina mogu se upisati samo brojevi.',
		invalidWidth: 'U polje širina mogu se upisati samo brojevi.',
		invalidLength: 'U "%1" polju data vrednos treba da bude pozitivan broj, sa validnom mernom jedinicom ili bez (%2).',
		invalidCssLength: 'Za "%1" data vrednost mora biti pozitivan broj, moguće označiti sa validnim CSS vrednosću (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'Za "%1" data vrednost mora biti potitivan broj, moguće označiti sa validnim HTML vrednošću (px or %).',
		invalidInlineStyle: 'Vrednost u inline styleu mora da sadrži barem jedan rekord u formatu "name : value", razdeljeni sa tačkazapetom.',
		cssLengthTooltip: 'Odredite broj u pixeima ili u validnim CSS vrednostima (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>',

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
		keyboardShortcut: 'Taster za prečicu',

		optionDefault: 'Оsnovni'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};

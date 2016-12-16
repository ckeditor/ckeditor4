/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Slovenian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'sl' ] = {
	// ARIA description.
	editor: 'Urejevalnik obogatenega besedila',
	editorPanel: 'Plošča urejevalnika obogatenega besedila',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Pritisnite ALT 0 za pomoč',

		browseServer: 'Prebrskaj na strežniku',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Naloži',
		uploadSubmit: 'Pošlji na strežnik',
		image: 'Slika',
		flash: 'Flash',
		form: 'Obrazec',
		checkbox: 'Potrditveno polje',
		radio: 'Izbirno polje',
		textField: 'Besedilno polje',
		textarea: 'Besedilno območje',
		hiddenField: 'Skrito polje',
		button: 'Gumb',
		select: 'Spustno polje',
		imageButton: 'Slikovni gumb',
		notSet: '<ni določen>',
		id: 'Id',
		name: 'Ime',
		langDir: 'Smer jezika',
		langDirLtr: 'Od leve proti desni (LTR)',
		langDirRtl: 'Od desne proti levi (RTL)',
		langCode: 'Koda jezika',
		longDescr: 'Dolg opis URL-ja',
		cssClass: 'Razredi slogovne predloge',
		advisoryTitle: 'Predlagani naslov',
		cssStyle: 'Slog',
		ok: 'V redu',
		cancel: 'Prekliči',
		close: 'Zapri',
		preview: 'Predogled',
		resize: 'Potegni za spremembo velikosti',
		generalTab: 'Splošno',
		advancedTab: 'Napredno',
		validateNumberFailed: 'Vrednost ni število.',
		confirmNewPage: 'Vse neshranjene spremembe vsebine bodo izgubljene. Ali res želite naložiti novo stran?',
		confirmCancel: 'Spremenili ste nekaj možnosti. Ali res želite zapreti okno?',
		options: 'Možnosti',
		target: 'Cilj',
		targetNew: 'Novo okno (_blank)',
		targetTop: 'Vrhovno okno (_top)',
		targetSelf: 'Isto okno (_self)',
		targetParent: 'Starševsko okno (_parent)',
		langDirLTR: 'Od leve proti desni (LTR)',
		langDirRTL: 'Od desne proti levi (RTL)',
		styles: 'Slog',
		cssClasses: 'Razredi slogovne predloge',
		width: 'Širina',
		height: 'Višina',
		align: 'Poravnava',
		alignLeft: 'Levo',
		alignRight: 'Desno',
		alignCenter: 'Sredinsko',
		alignJustify: 'Obojestranska poravnava',
		alignTop: 'Na vrh',
		alignMiddle: 'V sredino',
		alignBottom: 'Na dno',
		alignNone: 'Brez poravnave',
		invalidValue: 'Neveljavna vrednost.',
		invalidHeight: 'Višina mora biti število.',
		invalidWidth: 'Širina mora biti število.',
		invalidCssLength: 'Vrednost, določena za polje »%1«, mora biti pozitivno število z ali brez veljavne CSS-enote za merjenje (px, %, in, cm, mm, em, ex, pt ali pc).',
		invalidHtmlLength: 'Vrednost, določena za polje »%1«, mora biti pozitivno število z ali brez veljavne HTML-enote za merjenje (px ali %).',
		invalidInlineStyle: 'Vrednost, določena za slog v vrstici, mora biti sestavljena iz ene ali več dvojic oblike »ime : vrednost«, ločenih s podpičji.',
		cssLengthTooltip: 'Vnesite število za vrednost v slikovnih pikah ali število z veljavno CSS-enoto (px, %, in, cm, mm, em, ex, pt ali pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nedosegljiv</span>',

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
			224: 'Command' // MISSING
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Keyboard shortcut' // MISSING
	}
};

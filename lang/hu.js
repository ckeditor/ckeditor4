/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
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
 * Contains the dictionary of language entries.
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

	// ARIA description.
	editor: 'HTML szerkesztő',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Press ALT 0 for help', // MISSING

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
		close: 'Bezárás',
		preview: 'Előnézet',
		resize: 'Húzza az átméretezéshez',
		generalTab: 'Általános',
		advancedTab: 'További opciók',
		validateNumberFailed: 'A mezőbe csak számokat írhat.',
		confirmNewPage: 'Minden nem mentett változás el fog veszni! Biztosan be szeretné tölteni az oldalt?',
		confirmCancel: 'Az űrlap tartalma megváltozott, ám a változásokat nem rögzítette. Biztosan be szeretné zárni az űrlapot?',
		options: 'Beállítások',
		target: 'Cél',
		targetNew: 'Új ablak (_blank)',
		targetTop: 'Legfelső ablak (_top)',
		targetSelf: 'Aktuális ablakban (_self)',
		targetParent: 'Szülő ablak (_parent)',
		langDirLTR: 'Balról jobbra (LTR)',
		langDirRTL: 'Jobbról balra (RTL)',
		styles: 'Stílus',
		cssClasses: 'Stíluslap osztály',
		width: 'Szélesség',
		height: 'Magasság',
		align: 'Igazítás',
		alignLeft: 'Bal',
		alignRight: 'Jobbra',
		alignCenter: 'Középre',
		alignTop: 'Tetejére',
		alignMiddle: 'Középre',
		alignBottom: 'Aljára',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'A magasság mezőbe csak számokat írhat.',
		invalidWidth: 'A szélesség mezőbe csak számokat írhat.',
		invalidCssLength: '"%1"-hez megadott érték csakis egy pozitív szám lehet, esetleg egy érvényes CSS egységgel megjelölve(px, %, in, cm, mm, em, ex, pt vagy pc).',
		invalidHtmlLength: '"%1"-hez megadott érték csakis egy pozitív szám lehet, esetleg egy érvényes HTML egységgel megjelölve(px vagy %).',
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nem elérhető</span>'
	}
};

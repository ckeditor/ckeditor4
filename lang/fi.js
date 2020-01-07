/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object for the
 * Finnish language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'fi' ] = {
	// ARIA description.
	editor: 'Rikastekstieditori',
	editorPanel: 'Rikastekstieditoripaneeli',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Paina ALT 0 nähdäksesi ohjeen',

		browseServer: 'Selaa palvelinta',
		url: 'Osoite',
		protocol: 'Protokolla',
		upload: 'Lisää tiedosto',
		uploadSubmit: 'Lähetä palvelimelle',
		image: 'Kuva',
		flash: 'Flash-animaatio',
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
		close: 'Sulje',
		preview: 'Esikatselu',
		resize: 'Raahaa muuttaaksesi kokoa',
		generalTab: 'Yleinen',
		advancedTab: 'Lisäominaisuudet',
		validateNumberFailed: 'Arvon pitää olla numero.',
		confirmNewPage: 'Kaikki tallentamattomat muutokset tähän sisältöön menetetään. Oletko varma, että haluat ladata uuden sivun?',
		confirmCancel: 'Jotkut asetuksista on muuttuneet. Oletko varma, että haluat sulkea valintaikkunan?',
		options: 'Asetukset',
		target: 'Kohde',
		targetNew: 'Uusi ikkuna (_blank)',
		targetTop: 'Päällimmäinen ikkuna (_top)',
		targetSelf: 'Sama ikkuna (_self)',
		targetParent: 'Ylemmän tason ikkuna (_parent)',
		langDirLTR: 'Vasemmalta oikealle (LTR)',
		langDirRTL: 'Oikealta vasemmalle (RTL)',
		styles: 'Tyyli',
		cssClasses: 'Tyylitiedoston luokat',
		width: 'Leveys',
		height: 'Korkeus',
		align: 'Kohdistus',
		left: 'Vasemmalle',
		right: 'Oikealle',
		center: 'Keskelle',
		justify: 'Tasaa molemmat reunat',
		alignLeft: 'Tasaa vasemmat reunat',
		alignRight: 'Tasaa oikeat reunat',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Ylös',
		alignMiddle: 'Keskelle',
		alignBottom: 'Alas',
		alignNone: 'Ei asetettu',
		invalidValue: 'Virheellinen arvo.',
		invalidHeight: 'Korkeuden täytyy olla numero.',
		invalidWidth: 'Leveyden täytyy olla numero.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Kentän "%1" arvon täytyy olla positiivinen luku CSS mittayksikön (px, %, in, cm, mm, em, ex, pt tai pc) kanssa tai ilman.',
		invalidHtmlLength: 'Kentän "%1" arvon täytyy olla positiivinen luku HTML mittayksikön (px tai %) kanssa tai ilman.',
		invalidInlineStyle: 'Tyylille annetun arvon täytyy koostua yhdestä tai useammasta "nimi : arvo" parista, jotka ovat eroteltuna toisistaan puolipisteillä.',
		cssLengthTooltip: 'Anna numeroarvo pikseleinä tai numeroarvo CSS mittayksikön kanssa (px, %, in, cm, mm, em, ex, pt, tai pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, ei saatavissa</span>',

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

		optionDefault: 'Default' // MISSING
	}
};

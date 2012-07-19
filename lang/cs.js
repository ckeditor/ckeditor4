/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Czech language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'cs' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Textový editor',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'nápovědu zobrazíte stiskem ALT 0.',

		browseServer: 'Vybrat na serveru',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Odeslat',
		uploadSubmit: 'Odeslat na server',
		image: 'Obrázek',
		flash: 'Flash',
		form: 'Formulář',
		checkbox: 'Zaškrtávací políčko',
		radio: 'Přepínač',
		textField: 'Textové pole',
		textarea: 'Textová oblast',
		hiddenField: 'Skryté pole',
		button: 'Tlačítko',
		select: 'Seznam',
		imageButton: 'Obrázkové tlačítko',
		notSet: '<nenastaveno>',
		id: 'Id',
		name: 'Jméno',
		langDir: 'Orientace jazyka',
		langDirLtr: 'Zleva do prava (LTR)',
		langDirRtl: 'Zprava do leva (RTL)',
		langCode: 'Kód jazyka',
		longDescr: 'Dlouhý popis URL',
		cssClass: 'Třída stylu',
		advisoryTitle: 'Pomocný titulek',
		cssStyle: 'Styl',
		ok: 'OK',
		cancel: 'Storno',
		close: 'Zavřít',
		preview: 'Náhled',
		resize: 'Uchopit pro změnu velikosti',
		generalTab: 'Obecné',
		advancedTab: 'Rozšířené',
		validateNumberFailed: 'Zadaná hodnota není číselná.',
		confirmNewPage: 'Jakékoliv neuložené změny obsahu budou ztraceny. Skutečně chete otevrít novou stránku?',
		confirmCancel: 'Některá z nastavení byla změněna. Skutečně chete zavřít dialogové okno?',
		options: 'Nastavení',
		target: 'Cíl',
		targetNew: 'Nové okno (_blank)',
		targetTop: 'Okno nejvyšší úrovně (_top)',
		targetSelf: 'Stejné okno (_self)',
		targetParent: 'Rodičovské onko (_parent)',
		langDirLTR: 'Zleva doprava (LTR)',
		langDirRTL: 'Zprava doleva (RTL)',
		styles: 'Styly',
		cssClasses: 'Třídy stylů',
		width: 'Šířka',
		height: 'Výška',
		align: 'Zarovnání',
		alignLeft: 'Vlevo',
		alignRight: 'Vpravo',
		alignCenter: 'Na střed',
		alignTop: 'Nahoru',
		alignMiddle: 'Na střed',
		alignBottom: 'Dolů',
		invalidHeight: 'Zadaná výška musí být číslo.',
		invalidWidth: 'Zadaná šířka musí být číslo.',
		invalidCssLength: 'Hodnota určená pro pole "%1" musí být kladné číslo bez nebo s platnou jednotkou míry CSS (px, %, in, cm, mm, em, ex, pt, nebo pc).',
		invalidHtmlLength: 'Hodnota určená pro pole "%1" musí být kladné číslo bez nebo s platnou jednotkou míry HTML (px nebo %).',
		invalidInlineStyle: 'Hodnota určená pro řádkový styl se musí skládat z jedné nebo více n-tic ve formátu "název : hodnota", oddělené středníky',
		cssLengthTooltip: 'Zadejte číslo jako hodnotu v pixelech nebo číslo s platnou jednotkou CSS (px, %, v cm, mm, em, ex, pt, nebo pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nedostupné</span>'
	}
};

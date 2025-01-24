/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
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
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Textový editor',
	editorPanel: 'Panel textového editoru',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Stiskněte ALT 0 pro nápovědu',

		browseServer: 'Vybrat na serveru',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Odeslat',
		uploadSubmit: 'Odeslat na server',
		image: 'Obrázek',
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
		langDir: 'Směr jazyka',
		langDirLtr: 'Zleva doprava (LTR)',
		langDirRtl: 'Zprava doleva (RTL)',
		langCode: 'Kód jazyka',
		longDescr: 'Dlouhý popis URL',
		cssClass: 'Třída stylu',
		advisoryTitle: 'Pomocný titulek',
		cssStyle: 'Styl',
		ok: 'OK',
		cancel: 'Zrušit',
		close: 'Zavřít',
		preview: 'Náhled',
		resize: 'Uchopit pro změnu velikosti',
		generalTab: 'Obecné',
		advancedTab: 'Rozšířené',
		validateNumberFailed: 'Zadaná hodnota není číselná.',
		confirmNewPage: 'Jakékoliv neuložené změny obsahu budou ztraceny. Skutečně chcete otevřít novou stránku?',
		confirmCancel: 'Některá z nastavení byla změněna. Skutečně chcete zavřít dialogové okno?',
		options: 'Nastavení',
		target: 'Cíl',
		targetNew: 'Nové okno (_blank)',
		targetTop: 'Okno nejvyšší úrovně (_top)',
		targetSelf: 'Stejné okno (_self)',
		targetParent: 'Rodičovské okno (_parent)',
		langDirLTR: 'Zleva doprava (LTR)',
		langDirRTL: 'Zprava doleva (RTL)',
		styles: 'Styly',
		cssClasses: 'Třídy stylů',
		width: 'Šířka',
		height: 'Výška',
		align: 'Zarovnání',
		left: 'Vlevo',
		right: 'Vpravo',
		center: 'Na střed',
		justify: 'Zarovnat do bloku',
		alignLeft: 'Zarovnat vlevo',
		alignRight: 'Zarovnat vpravo',
		alignCenter: 'Zarovnat na střed',
		alignTop: 'Nahoru',
		alignMiddle: 'Na střed',
		alignBottom: 'Dolů',
		alignNone: 'Žádné',
		invalidValue: 'Neplatná hodnota.',
		invalidHeight: 'Zadaná výška musí být číslo.',
		invalidWidth: 'Šířka musí být číslo.',
		invalidLength: 'Hodnota určená pro pole "%1" musí být kladné číslo bez nebo s platnou jednotkou míry (%2).',
		invalidCssLength: 'Hodnota určená pro pole "%1" musí být kladné číslo bez nebo s platnou jednotkou míry CSS (px, %, in, cm, mm, em, ex, pt, nebo pc).',
		invalidHtmlLength: 'Hodnota určená pro pole "%1" musí být kladné číslo bez nebo s platnou jednotkou míry HTML (px nebo %).',
		invalidInlineStyle: 'Hodnota určená pro řádkový styl se musí skládat z jedné nebo více n-tic ve formátu "název : hodnota", oddělené středníky',
		cssLengthTooltip: 'Zadejte číslo jako hodnotu v pixelech nebo číslo s platnou jednotkou CSS (px, %, v cm, mm, em, ex, pt, nebo pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nedostupné</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Mezerník',
			35: 'Konec',
			36: 'Domů',
			46: 'Smazat',
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
		keyboardShortcut: 'Klávesová zkratka',

		optionDefault: 'Výchozí'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};

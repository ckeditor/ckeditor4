/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Afrikaans language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'af' ] = {
	// ARIA description.
	editor: 'Woordverwerker',
	editorPanel: 'Woordverwerkerpaneel',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Druk op ALT 0 vir hulp',

		browseServer: 'Blaai op bediener',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Oplaai',
		uploadSubmit: 'Stuur aan die bediener',
		image: 'Beeld',
		flash: 'Flash',
		form: 'Vorm',
		checkbox: 'Merkhokkie',
		radio: 'Radioknoppie',
		textField: 'Teksveld',
		textarea: 'Teksarea',
		hiddenField: 'Versteekteveld',
		button: 'Knop',
		select: 'Keuseveld',
		imageButton: 'Beeldknop',
		notSet: '<geen instelling>',
		id: 'Id',
		name: 'Naam',
		langDir: 'Skryfrigting',
		langDirLtr: 'Links na regs (LTR)',
		langDirRtl: 'Regs na links (RTL)',
		langCode: 'Taalkode',
		longDescr: 'Lang beskrywing URL',
		cssClass: 'CSS klasse',
		advisoryTitle: 'Aanbevole titel',
		cssStyle: 'Styl',
		ok: 'OK',
		cancel: 'Kanselleer',
		close: 'Sluit',
		preview: 'Voorbeeld',
		resize: 'Skalierung',
		generalTab: 'Algemeen',
		advancedTab: 'Gevorderd',
		validateNumberFailed: 'Hierdie waarde is nie \'n nommer nie.',
		confirmNewPage: 'Alle wysiginge sal verlore gaan. Is jy seker dat jy \'n nuwe bladsy wil laai?',
		confirmCancel: 'Sommige opsies is gewysig. Is jy seker dat jy hierdie dialoogvenster wil sluit?',
		options: 'Opsies',
		target: 'Teiken',
		targetNew: 'Nuwe venster (_blank)',
		targetTop: 'Boonste venster (_top)',
		targetSelf: 'Selfde venster (_self)',
		targetParent: 'Oorspronklike venster (_parent)',
		langDirLTR: 'Links na Regs (LTR)',
		langDirRTL: 'Regs na Links (RTL)',
		styles: 'Styl',
		cssClasses: 'CSS klasse',
		width: 'Breedte',
		height: 'Hoogte',
		align: 'Orienteerung',
		alignLeft: 'Links',
		alignRight: 'Regs',
		alignCenter: 'Middel',
		alignJustify: 'Eweredig',
		alignTop: 'Bo',
		alignMiddle: 'Middel',
		alignBottom: 'Onder',
		alignNone: 'Geen',
		invalidValue	: 'Ongeldige waarde',
		invalidHeight: 'Hoogte moet \'n getal wees',
		invalidWidth: 'Breedte moet \'n getal wees.',
		invalidCssLength: 'Die waarde vir die "%1" veld moet \'n posetiewe getal wees met of sonder \'n geldige CSS eenheid (px, %, in, cm, mm, em, ex, pt, of pc).',
		invalidHtmlLength: 'Die waarde vir die  "%1" veld moet \'n posetiewe getal wees met of sonder \'n geldige HTML eenheid (px of %).',
		invalidInlineStyle: 'Ongeldige CSS. Formaat is een of meer sleutel-wert paare, "naam : wert" met kommapunte gesky.',
		cssLengthTooltip: 'Voeg \'n getal wert in pixel in, of \'n waarde met geldige CSS eenheid (px, %, in, cm, mm, em, ex, pt, of pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nie beskikbaar nie</span>'
	}
};

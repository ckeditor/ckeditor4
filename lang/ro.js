/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Romanian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'ro' ] = {
	// ARIA description.
	editor: 'Editor de text îmbogățit',
	editorPanel: 'Panoul editorului de text îmbogățit',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Apasă ALT 0 pentru ajutor',

		browseServer: 'Răsfoiește fișiere',
		url: 'URL',
		protocol: 'Protocol',
		upload: 'Încarcă',
		uploadSubmit: 'Trimite la server',
		image: 'Imagine',
		flash: 'Flash',
		form: 'Formular (Form)',
		checkbox: 'Bifă (Checkbox)',
		radio: 'Buton radio (RadioButton)',
		textField: 'Câmp text (TextField)',
		textarea: 'Suprafaţă text (Textarea)',
		hiddenField: 'Câmp ascuns (HiddenField)',
		button: 'Buton',
		select: 'Câmp selecţie (SelectionField)',
		imageButton: 'Buton imagine (ImageButton)',
		notSet: 'fără setări',
		id: 'identificator',
		name: 'Nume',
		langDir: 'Direcţia cuvintelor',
		langDirLtr: 'de la stânga la dreapta (LTR)',
		langDirRtl: 'de la dreapta la stânga (RTL)',
		langCode: 'Codul limbii',
		longDescr: 'Descrierea completă URL',
		cssClass: 'Clasele cu stilul paginii (CSS)',
		advisoryTitle: 'Titlul consultativ',
		cssStyle: 'Stil',
		ok: 'OK',
		cancel: 'Anulare',
		close: 'Închide',
		preview: 'Previzualizare',
		resize: 'Redimensionează',
		generalTab: 'General',
		advancedTab: 'Avansat',
		validateNumberFailed: 'Această valoare nu este un număr!',
		confirmNewPage: 'Orice modificări nesalvate ale acestui conținut, vor fi pierdute. Sigur doriți încărcarea unei noi pagini?',
		confirmCancel: 'Ai schimbat câteva opțiuni. Ești sigur că dorești să închiz fereastra de dialog?',
		options: 'Opțiuni',
		target: 'Țintă',
		targetNew: 'Fereastră nouă (_blank)',
		targetTop: 'Topmost Window (_top)',
		targetSelf: 'În aceeași fereastră (_self)',
		targetParent: 'Parent Window (_parent)',
		langDirLTR: 'Stânga spre Dreapta (LTR)',
		langDirRTL: 'Dreapta spre Stânga (RTL)',
		styles: 'Stil',
		cssClasses: 'Clase foaie de stil',
		width: 'Lăţime',
		height: 'Înălţime',
		align: 'Aliniere',
		alignLeft: 'Aliniază la stânga',
		alignRight: 'Aliniază la dreapta',
		alignCenter: 'Aliniază pe centru',
		alignJustify: 'Aliniere în bloc (Justify)',
		alignTop: 'Aliniere sus',
		alignMiddle: 'Aliniere la mijloc',
		alignBottom: 'Aliniere jos',
		alignNone: 'Fără aliniere',
		invalidValue: 'Valoare invalidă',
		invalidHeight: 'Înălțimea trebuie să fie un număr.',
		invalidWidth: 'Lățimea trebuie să fie un număr.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Valoarea specificată pentru câmpul "%1" trebuie să fie un număr pozitiv cu sau fără o unitate de măsură validă CSS (px, %, in, cm, mm, em, ex, pt, sau pc).',
		invalidHtmlLength: 'Valoarea specificată pentru câmpul "%1" trebuie să fie un număr pozitiv cu sau fără o unitate de măsură validă HTML (px sau %).',
		invalidInlineStyle: 'Valoarea specificată pentru stil trebuie să conțină una sau mai multe construcții de tipul "name : value", separate prin punct și virgulă.',
		cssLengthTooltip: 'Introdu un număr pentru o valoare în pixeli sau un număr pentru o unitate de măsură validă CSS (px, %, in, cm, mm, em, ex, pt, sau pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, nu este disponibil</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Bară spațiu',
			35: 'End',
			36: 'Home',
			46: 'Delete',
			224: 'Command'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Scurtături tastatură',

		optionDefault: 'Default' // MISSING
	}
};

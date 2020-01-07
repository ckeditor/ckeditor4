/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
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
		left: 'Aliniază la stânga',
		right: 'Aliniază la dreapta',
		center: 'Aliniază pe centru',
		justify: 'Aliniere în bloc (Justify)',
		alignLeft: 'Aliniere la stânga',
		alignRight: 'Aliniere la dreapta',
		alignCenter: 'Aliniere centru',
		alignTop: 'Aliniere sus',
		alignMiddle: 'Aliniere la mijloc',
		alignBottom: 'Aliniere jos',
		alignNone: 'Fără aliniere',
		invalidValue: 'Valoare invalidă',
		invalidHeight: 'Înălțimea trebuie să fie un număr.',
		invalidWidth: 'Lățimea trebuie să fie un număr.',
		invalidLength: 'Valoarea specificată pentru câmpul "%1" trebuie să fie un număr pozitiv cu sau fără o unitate de măsură validă (%2).',
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
			112: 'F1',
			113: 'F2',
			114: 'F3',
			115: 'F4',
			116: 'F5',
			117: 'F6',
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
			224: 'Command'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Scurtături tastatură',

		optionDefault: 'Implicit'
	}
};

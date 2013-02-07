/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Greek language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'el' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Επεξεργαστής Πλούσιου Κειμένου',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Πατήστε το ALT 0 για βοήθεια',

		browseServer: 'Εξερεύνηση διακομιστή',
		url: 'URL',
		protocol: 'Πρωτόκολλο',
		upload: 'Ανέβασμα',
		uploadSubmit: 'Αποστολή στον Διακομιστή',
		image: 'Εικόνα',
		flash: 'Εισαγωγή Flash',
		form: 'Φόρμα',
		checkbox: 'Κουτί επιλογής',
		radio: 'Κουμπί επιλογής',
		textField: 'Πεδίο κειμένου',
		textarea: 'Περιοχή κειμένου',
		hiddenField: 'Κρυφό πεδίο',
		button: 'Κουμπί',
		select: 'Πεδίο επιλογής',
		imageButton: 'Κουμπί εικόνας',
		notSet: '<δεν έχει ρυθμιστεί>',
		id: 'Id',
		name: 'Όνομα',
		langDir: 'Κατεύθυνση κειμένου',
		langDirLtr: 'Αριστερά προς Δεξιά (LTR)',
		langDirRtl: 'Δεξιά προς Αριστερά (RTL)',
		langCode: 'Κωδικός Γλώσσας',
		longDescr: 'Αναλυτική περιγραφή URL',
		cssClass: 'Stylesheet Classes',
		advisoryTitle: 'Ενδεικτικός τίτλος',
		cssStyle: 'Μορφή κειμένου',
		ok: 'OK',
		cancel: 'Ακύρωση',
		close: 'Κλείσιμο',
		preview: 'Προεπισκόπηση',
		resize: 'Σύρσιμο για αλλαγή μεγέθους',
		generalTab: 'Γενικά',
		advancedTab: 'Για προχωρημένους',
		validateNumberFailed: 'Αυτή η τιμή δεν είναι αριθμός.',
		confirmNewPage: 'Οι όποιες αλλαγές στο περιεχόμενο θα χαθούν. Είσαστε σίγουροι ότι θέλετε να φορτώσετε μια νέα σελίδα;',
		confirmCancel: 'Μερικές επιλογές έχουν αλλάξει. Είσαστε σίγουροι ότι θέλετε να κλείσετε το παράθυρο διαλόγου;',
		options: 'Επιλογές',
		target: 'Προορισμός',
		targetNew: 'Νέο Παράθυρο (_blank)',
		targetTop: 'Αρχική Περιοχή (_top)',
		targetSelf: 'Ίδια Περιοχή (_self)',
		targetParent: 'Γονεϊκό Παράθυρο (_parent)',
		langDirLTR: 'Αριστερά προς Δεξιά (LTR)',
		langDirRTL: 'Δεξιά προς Αριστερά (RTL)',
		styles: 'Μορφή',
		cssClasses: 'Stylesheet Classes',
		width: 'Πλάτος',
		height: 'Ύψος',
		align: 'Στοίχιση',
		alignLeft: 'Αριστερά',
		alignRight: 'Δεξιά',
		alignCenter: 'Κέντρο',
		alignTop: 'Πάνω',
		alignMiddle: 'Μέση',
		alignBottom: 'Κάτω',
		invalidValue	: 'Μη έγκυρη τιμή.',
		invalidHeight: 'Το ύψος πρέπει να είναι ένας αριθμός.',
		invalidWidth: 'Το πλάτος πρέπει να είναι ένας αριθμός.',
		invalidCssLength: 'Η τιμή που ορίζεται για το πεδίο "%1" πρέπει να είναι ένας θετικός αριθμός με ή χωρίς μια έγκυρη μονάδα μέτρησης CSS (px, %, in, cm, mm, em, ex, pt, ή pc).',
		invalidHtmlLength: 'Η τιμή που ορίζεται για το πεδίο "%1" πρέπει να είναι ένας θετικός αριθμός με ή χωρίς μια έγκυρη μονάδα μέτρησης HTML (px or %).',
		invalidInlineStyle: 'Η τιμή για το εν σειρά στυλ πρέπει να περιέχει ένα ή περισσότερα ζεύγη με την μορφή "όνομα: τιμή" διαχωρισμένα με Ελληνικό ερωτηματικό.',
		cssLengthTooltip: 'Εισάγεται μια τιμή σε pixel ή έναν αριθμό μαζί με μια έγκυρη μονάδα μέτρησης CSS (px, %, in, cm, mm, em, ex, pt, ή pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, δεν είναι διαθέσιμο</span>'
	}
};

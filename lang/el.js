/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
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

	/*
	 * Screenreader titles. Please note that screenreaders are not always capable
	 * of reading non-English words. So be careful while translating it.
	 */
	editorTitle: 'Rich text editor, %1, press ALT 0 for help.', // MISSING

	// ARIA descriptions.
	toolbars: 'Εργαλειοθήκες Επεξεργαστή',
	editor: 'Επεξεργαστής Πλούσιου Κειμένου',

	// Toolbar buttons without dialogs.
	source: 'HTML κώδικας',
	newPage: 'Νέα Σελίδα',
	save: 'Αποθήκευση',
	preview: 'Προεπισκόπιση',
	cut: 'Αποκοπή',
	copy: 'Αντιγραφή',
	paste: 'Επικόλληση',
	print: 'Εκτύπωση',
	underline: 'Υπογράμμιση',
	bold: 'Έντονα',
	italic: 'Πλάγια',
	selectAll: 'Επιλογή όλων',
	removeFormat: 'Αφαίρεση Μορφοποίησης',
	strike: 'Διαγράμμιση',
	subscript: 'Δείκτης',
	superscript: 'Εκθέτης',
	horizontalrule: 'Εισαγωγή Οριζόντιας Γραμμής',
	pagebreak: 'Εισαγωγή τέλους σελίδας',
	pagebreakAlt: 'Αλλαγή Σελίδας',
	unlink: 'Αφαίρεση Συνδέσμου (Link)',
	undo: 'Αναίρεση',
	redo: 'Επαναφορά',

	// Common messages and labels.
	common: {
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
		langDirLTR: 'Left to Right (LTR)', // MISSING
		langDirRTL: 'Right to Left (RTL)', // MISSING
		styles: 'Μορφή',
		cssClasses: 'Stylesheet Classes', // MISSING
		width: 'Πλάτος',
		height: 'Ύψος',
		align: 'Στοίχιση',
		alignLeft: 'Αριστερά',
		alignRight: 'Δεξιά',
		alignCenter: 'Κέντρο',
		alignTop: 'Πάνω',
		alignMiddle: 'Μέση',
		alignBottom: 'Κάτω',
		invalidHeight: 'Height must be a number.', // MISSING
		invalidWidth: 'Width must be a number.', // MISSING
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	},

	contextmenu: {
		options: 'Context Menu Options' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Εισαγωγή Ειδικού Χαρακτήρα',
		title: 'Επιλέξτε έναν Ειδικό Χαρακτήρα',
		options: 'Special Character Options' // MISSING
	},

	// Link dialog.
	link: {
		toolbar: 'Σύνδεσμος',
		other: '<άλλο>',
		menu: 'Επεξεργασία Συνδέσμου',
		title: 'Σύνδεσμος',
		info: 'Πληροφορίες Συνδέσμου',
		target: 'Παράθυρο Προορισμού',
		upload: 'Ανέβασμα',
		advanced: 'Για προχωρημένους',
		type: 'Τύπος Συνδέσμου',
		toUrl: 'URL', // MISSING
		toAnchor: 'Άγκυρα σε αυτή τη σελίδα',
		toEmail: 'E-Mail',
		targetFrame: '<πλαίσιο>',
		targetPopup: '<αναδυόμενο παράθυρο>',
		targetFrameName: 'Όνομα Παραθύρου Προορισμού',
		targetPopupName: 'Όνομα Αναδυόμενου Παραθύρου',
		popupFeatures: 'Επιλογές Αναδυόμενου Παραθύρου',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Γραμμή Κατάστασης',
		popupLocationBar: 'Γραμμή Τοποθεσίας',
		popupToolbar: 'Εργαλειοθήκη',
		popupMenuBar: 'Γραμμή Επιλογών',
		popupFullScreen: 'Πλήρης Οθόνη (IE)',
		popupScrollBars: 'Μπάρες Κύλισης',
		popupDependent: 'Εξαρτημένο (Netscape)',
		popupLeft: 'Θέση Αριστερά',
		popupTop: 'Θέση Πάνω',
		id: 'Id', // MISSING
		langDir: 'Κατεύθυνση Κειμένου',
		langDirLTR: 'Αριστερά προς Δεξιά (LTR)',
		langDirRTL: 'Δεξιά προς Αριστερά (RTL)',
		acccessKey: 'Συντόμευση',
		name: 'Όνομα',
		langCode: 'Κατεύθυνση Κειμένου',
		tabIndex: 'Σειρά Μεταπήδησης',
		advisoryTitle: 'Ενδεικτικός Τίτλος',
		advisoryContentType: 'Ενδεικτικός Τύπος Περιεχομένου',
		cssClasses: 'Stylesheet Classes',
		charset: 'Κωδικοποίηση Χαρακτήρων Προσαρτημένης Πηγής',
		styles: 'Μορφή',
		rel: 'Relationship', // MISSING
		selectAnchor: 'Επιλέξτε μια άγκυρα',
		anchorName: 'Βάσει του Ονόματος της άγκυρας',
		anchorId: 'Βάσει του Element Id',
		emailAddress: 'Διεύθυνση e-mail',
		emailSubject: 'Θέμα Μηνύματος',
		emailBody: 'Κείμενο Μηνύματος',
		noAnchors: '(Δεν υπάρχουν άγκυρες στο κείμενο)',
		noUrl: 'Εισάγετε την τοποθεσία (URL) του υπερσυνδέσμου (Link)',
		noEmail: 'Εισάγετε την διεύθυνση ηλεκτρονικού ταχυδρομείου'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Εισαγωγή/επεξεργασία Άγκυρας',
		menu: 'Ιδιότητες άγκυρας',
		title: 'Ιδιότητες άγκυρας',
		name: 'Όνομα άγκυρας',
		errorName: 'Παρακαλούμε εισάγετε όνομα άγκυρας',
		remove: 'Remove Anchor' // MISSING
	},

	// List style dialog
	list: {
		numberedTitle: 'Numbered List Properties', // MISSING
		bulletedTitle: 'Bulleted List Properties', // MISSING
		type: 'Type', // MISSING
		start: 'Start', // MISSING
		validateStartNumber: 'List start number must be a whole number.', // MISSING
		circle: 'Circle', // MISSING
		disc: 'Disc', // MISSING
		square: 'Square', // MISSING
		none: 'None', // MISSING
		notset: '<not set>', // MISSING
		armenian: 'Armenian numbering', // MISSING
		georgian: 'Georgian numbering (an, ban, gan, etc.)', // MISSING
		lowerRoman: 'Lower Roman (i, ii, iii, iv, v, etc.)', // MISSING
		upperRoman: 'Upper Roman (I, II, III, IV, V, etc.)', // MISSING
		lowerAlpha: 'Lower Alpha (a, b, c, d, e, etc.)', // MISSING
		upperAlpha: 'Upper Alpha (A, B, C, D, E, etc.)', // MISSING
		lowerGreek: 'Lower Greek (alpha, beta, gamma, etc.)', // MISSING
		decimal: 'Decimal (1, 2, 3, etc.)', // MISSING
		decimalLeadingZero: 'Decimal leading zero (01, 02, 03, etc.)' // MISSING
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Find and Replace', // MISSING
		find: 'Αναζήτηση',
		replace: 'Αντικατάσταση',
		findWhat: 'Αναζήτηση για:',
		replaceWith: 'Αντικατάσταση με:',
		notFoundMsg: 'Το κείμενο δεν βρέθηκε.',
		findOptions: 'Find Options', // MISSING
		matchCase: 'Έλεγχος πεζών/κεφαλαίων',
		matchWord: 'Εύρεση πλήρους λέξης',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Αντικατάσταση Όλων',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Πίνακας',
		title: 'Ιδιότητες Πίνακα',
		menu: 'Ιδιότητες Πίνακα',
		deleteTable: 'Διαγραφή πίνακα',
		rows: 'Γραμμές',
		columns: 'Κολώνες',
		border: 'Πάχος Περιγράμματος',
		widthPx: 'pixels',
		widthPc: 'τοις εκατό',
		widthUnit: 'width unit', // MISSING
		cellSpace: 'Διάστημα κελιών',
		cellPad: 'Γέμισμα κελιών',
		caption: 'Λεζάντα',
		summary: 'Περίληψη',
		headers: 'Headers', // MISSING
		headersNone: 'None', // MISSING
		headersColumn: 'First column', // MISSING
		headersRow: 'First Row', // MISSING
		headersBoth: 'Both', // MISSING
		invalidRows: 'Number of rows must be a number greater than 0.', // MISSING
		invalidCols: 'Number of columns must be a number greater than 0.', // MISSING
		invalidBorder: 'Border size must be a number.', // MISSING
		invalidWidth: 'Table width must be a number.', // MISSING
		invalidHeight: 'Table height must be a number.', // MISSING
		invalidCellSpacing: 'Cell spacing must be a positive number.', // MISSING
		invalidCellPadding: 'Cell padding must be a positive number.', // MISSING

		cell: {
			menu: 'Κελί',
			insertBefore: 'Insert Cell Before', // MISSING
			insertAfter: 'Insert Cell After', // MISSING
			deleteCell: 'Διαγραφή Κελιών',
			merge: 'Ενοποίηση Κελιών',
			mergeRight: 'Merge Right', // MISSING
			mergeDown: 'Merge Down', // MISSING
			splitHorizontal: 'Split Cell Horizontally', // MISSING
			splitVertical: 'Split Cell Vertically', // MISSING
			title: 'Cell Properties', // MISSING
			cellType: 'Cell Type', // MISSING
			rowSpan: 'Rows Span', // MISSING
			colSpan: 'Columns Span', // MISSING
			wordWrap: 'Word Wrap', // MISSING
			hAlign: 'Horizontal Alignment', // MISSING
			vAlign: 'Vertical Alignment', // MISSING
			alignBaseline: 'Baseline', // MISSING
			bgColor: 'Background Color', // MISSING
			borderColor: 'Border Color', // MISSING
			data: 'Data', // MISSING
			header: 'Header', // MISSING
			yes: 'Yes', // MISSING
			no: 'No', // MISSING
			invalidWidth: 'Cell width must be a number.', // MISSING
			invalidHeight: 'Cell height must be a number.', // MISSING
			invalidRowSpan: 'Rows span must be a whole number.', // MISSING
			invalidColSpan: 'Columns span must be a whole number.', // MISSING
			chooseColor: 'Choose' // MISSING
		},

		row: {
			menu: 'Σειρά',
			insertBefore: 'Insert Row Before', // MISSING
			insertAfter: 'Insert Row After', // MISSING
			deleteRow: 'Διαγραφή Γραμμών'
		},

		column: {
			menu: 'Στήλη',
			insertBefore: 'Insert Column Before', // MISSING
			insertAfter: 'Insert Column After', // MISSING
			deleteColumn: 'Διαγραφή Κολωνών'
		}
	},

	// Button Dialog.
	button: {
		title: 'Ιδιότητες Κουμπιού',
		text: 'Κείμενο (Τιμή)',
		type: 'Τύπος',
		typeBtn: 'Κουμπί',
		typeSbm: 'Υποβολή',
		typeRst: 'Επαναφορά'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Ιδιότητες Κουτιού Επιλογής',
		radioTitle: 'Ιδιότητες Κουμπιού Επιλογής',
		value: 'Τιμή',
		selected: 'Επιλεγμένο'
	},

	// Form Dialog.
	form: {
		title: 'Ιδιότητες Φόρμας',
		menu: 'Ιδιότητες Φόρμας',
		action: 'Δράση',
		method: 'Μέθοδος',
		encoding: 'Encoding' // MISSING
	},

	// Select Field Dialog.
	select: {
		title: 'Ιδιότητες Πεδίου Επιλογής',
		selectInfo: 'Πληροφορίες Πεδίου Επιλογής',
		opAvail: 'Διαθέσιμες Επιλογές',
		value: 'Τιμή',
		size: 'Μέγεθος',
		lines: 'γραμμές',
		chkMulti: 'Να επιτρέπονται οι πολλαπλές επιλογές',
		opText: 'Κείμενο',
		opValue: 'Τιμή',
		btnAdd: 'Προσθήκη',
		btnModify: 'Τροποποίηση',
		btnUp: 'Πάνω',
		btnDown: 'Κάτω',
		btnSetValue: 'Προεπιλογή',
		btnDelete: 'Διαγραφή'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Ιδιότητες Περιοχής Κειμένου',
		cols: 'Στήλες',
		rows: 'Σειρές'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Ιδιότητες Πεδίου Κειμένου',
		name: 'Όνομα',
		value: 'Τιμή',
		charWidth: 'Πλάτος Χαρακτήρων',
		maxChars: 'Μέγιστοι χαρακτήρες',
		type: 'Τύπος',
		typeText: 'Κείμενο',
		typePass: 'Κωδικός'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Ιδιότητες Κρυφού Πεδίου',
		name: 'Όνομα',
		value: 'Τιμή'
	},

	// Image Dialog.
	image: {
		title: 'Ιδιότητες Εικόνας',
		titleButton: 'Ιδιότητες Κουμπιού Εικόνας',
		menu: 'Ιδιότητες Εικόνας',
		infoTab: 'Πληροφορίες Εικόνας',
		btnUpload: 'Αποστολή στον Διακομιστή',
		upload: 'Ανέβασμα',
		alt: 'Εναλλακτικό Κείμενο',
		lockRatio: 'Κλείδωμα Αναλογίας',
		resetSize: 'Επαναφορά Αρχικού Μεγέθους',
		border: 'Περίγραμμα',
		hSpace: 'Οριζόντιο Διάστημα',
		vSpace: 'Κάθετο Διάστημα',
		alertUrl: 'Εισάγετε την τοποθεσία (URL) της εικόνας',
		linkTab: 'Σύνδεσμος',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?', // MISSING
		urlMissing: 'Image source URL is missing.', // MISSING
		validateBorder: 'Border must be a whole number.', // MISSING
		validateHSpace: 'HSpace must be a whole number.', // MISSING
		validateVSpace: 'VSpace must be a whole number.' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Ιδιότητες Flash',
		propertiesTab: 'Properties', // MISSING
		title: 'Ιδιότητες Flash',
		chkPlay: 'Αυτόματη Εκτέλεση',
		chkLoop: 'Επανάληψη',
		chkMenu: 'Ενεργοποίηση Flash Menu',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Μεγέθυνση',
		scaleAll: 'Εμφάνιση όλων',
		scaleNoBorder: 'Χωρίς Περίγραμμα',
		scaleFit: 'Ακριβές Μέγεθος',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		alignAbsBottom: 'Απόλυτα Κάτω',
		alignAbsMiddle: 'Απόλυτα στη Μέση',
		alignBaseline: 'Γραμμή Βάσης',
		alignTextTop: 'Κορυφή Κειμένου',
		quality: 'Quality', // MISSING
		qualityBest: 'Best', // MISSING
		qualityHigh: 'High', // MISSING
		qualityAutoHigh: 'Auto High', // MISSING
		qualityMedium: 'Medium', // MISSING
		qualityAutoLow: 'Auto Low', // MISSING
		qualityLow: 'Low', // MISSING
		windowModeWindow: 'Window', // MISSING
		windowModeOpaque: 'Opaque', // MISSING
		windowModeTransparent: 'Transparent', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Χρώμα Υποβάθρου',
		hSpace: 'Οριζόντιο Διάστημα',
		vSpace: 'Κάθετο Διάστημα',
		validateSrc: 'Εισάγετε την τοποθεσία (URL) του υπερσυνδέσμου (Link)',
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Ορθογραφικός Έλεγχος',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Δεν υπάρχει στο λεξικό',
		changeTo: 'Αλλαγή σε',
		btnIgnore: 'Αγνόηση',
		btnIgnoreAll: 'Αγνόηση όλων',
		btnReplace: 'Αντικατάσταση',
		btnReplaceAll: 'Αντικατάσταση όλων',
		btnUndo: 'Αναίρεση',
		noSuggestions: '- Δεν υπάρχουν προτάσεις -',
		progress: 'Γίνεται ορθογραφικός έλεγχος...',
		noMispell: 'Ο ορθογραφικός έλεγχος ολοκληρώθηκε: Δεν βρέθηκαν λάθη',
		noChanges: 'Ο ορθογραφικός έλεγχος ολοκληρώθηκε: Δεν άλλαξαν λέξεις',
		oneChange: 'Ο ορθογραφικός έλεγχος ολοκληρώθηκε: Άλλαξε μια λέξη',
		manyChanges: 'Ο ορθογραφικός έλεγχος ολοκληρώθηκε: Άλλαξαν %1 λέξεις',
		ieSpellDownload: 'Δεν υπάρχει εγκατεστημένος ορθογράφος. Θέλετε να τον κατεβάσετε τώρα;'
	},

	smiley: {
		toolbar: 'Smiley',
		title: 'Επιλέξτε ένα Smiley',
		options: 'Smiley Options' // MISSING
	},

	elementsPath: {
		eleLabel: 'Elements path', // MISSING
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Εισαγωγή/Απομάκρυνση Αριθμημένης Λίστας',
	bulletedlist: 'Εισαγωγή/Απομάκρυνση Λίστας Κουκκίδων',
	indent: 'Αύξηση Εσοχής',
	outdent: 'Μείωση Εσοχής',

	justify: {
		left: 'Στοίχιση Αριστερά',
		center: 'Στοίχιση στο Κέντρο',
		right: 'Στοίχιση Δεξιά',
		block: 'Πλήρης Στοίχιση'
	},

	blockquote: 'Περιοχή Παράθεσης',

	clipboard: {
		title: 'Επικόλληση',
		cutError: 'Οι ρυθμίσεις ασφαλείας του φυλλομετρητή σας δεν επιτρέπουν την επιλεγμένη εργασία αποκοπής. Χρησιμοποιείστε το πληκτρολόγιο (Ctrl/Cmd+X).',
		copyError: 'Οι ρυθμίσεις ασφαλείας του φυλλομετρητή σας δεν επιτρέπουν την επιλεγμένη εργασία αντιγραφής. Χρησιμοποιείστε το πληκτρολόγιο (Ctrl/Cmd+C).',
		pasteMsg: 'Παρακαλώ επικολήστε στο ακόλουθο κουτί χρησιμοποιόντας το πληκτρολόγιο (<strong>Ctrl/Cmd+V</strong>) και πατήστε OK.',
		securityMsg: 'Because of your browser security settings, the editor is not able to access your clipboard data directly. You are required to paste it again in this window.', // MISSING
		pasteArea: 'Paste Area' // MISSING
	},

	pastefromword: {
		confirmCleanup: 'The text you want to paste seems to be copied from Word. Do you want to clean it before pasting?', // MISSING
		toolbar: 'Επικόλληση από το Word',
		title: 'Επικόλληση από το Word',
		error: 'It was not possible to clean up the pasted data due to an internal error' // MISSING
	},

	pasteText: {
		button: 'Επικόλληση ως Απλό Κείμενο',
		title: 'Επικόλληση ως Απλό Κείμενο'
	},

	templates: {
		button: 'Πρότυπα',
		title: 'Πρότυπα Περιεχομένου',
		options: 'Template Options', // MISSING
		insertOption: 'Αντικατάσταση υπάρχοντων περιεχομένων',
		selectPromptMsg: 'Παρακαλώ επιλέξτε πρότυπο για εισαγωγή στο πρόγραμμα',
		emptyListMsg: '(Δεν έχουν καθοριστεί πρότυπα)'
	},

	showBlocks: 'Προβολή Περιοχών',

	stylesCombo: {
		label: 'Μορφές',
		panelTitle: 'Formatting Styles', // MISSING
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Μορφοποίηση',
		panelTitle: 'Μορφοποίηση Παραγράφου',

		tag_p: 'Κανονικό',
		tag_pre: 'Μορφοποιημένο',
		tag_address: 'Διεύθυνση',
		tag_h1: 'Επικεφαλίδα 1',
		tag_h2: 'Επικεφαλίδα 2',
		tag_h3: 'Επικεφαλίδα 3',
		tag_h4: 'Επικεφαλίδα 4',
		tag_h5: 'Επικεφαλίδα 5',
		tag_h6: 'Επικεφαλίδα 6',
		tag_div: 'Normal (DIV)' // MISSING
	},

	div: {
		title: 'Create Div Container', // MISSING
		toolbar: 'Create Div Container', // MISSING
		cssClassInputLabel: 'Stylesheet Classes', // MISSING
		styleSelectLabel: 'Style', // MISSING
		IdInputLabel: 'Id', // MISSING
		languageCodeInputLabel: ' Language Code', // MISSING
		inlineStyleInputLabel: 'Inline Style', // MISSING
		advisoryTitleInputLabel: 'Advisory Title', // MISSING
		langDirLabel: 'Language Direction', // MISSING
		langDirLTRLabel: 'Left to Right (LTR)', // MISSING
		langDirRTLLabel: 'Right to Left (RTL)', // MISSING
		edit: 'Edit Div', // MISSING
		remove: 'Remove Div' // MISSING
	},

	iframe: {
		title: 'IFrame Properties', // MISSING
		toolbar: 'IFrame', // MISSING
		noUrl: 'Please type the iframe URL', // MISSING
		scrolling: 'Enable scrollbars', // MISSING
		border: 'Show frame border' // MISSING
	},

	font: {
		label: 'Γραμματοσειρά',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'Όνομα Γραμματοσειράς'
	},

	fontSize: {
		label: 'Μέγεθος',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'Μέγεθος Γραμματοσειράς'
	},

	colorButton: {
		textColorTitle: 'Χρώμα Κειμένου',
		bgColorTitle: 'Χρώμα Φόντου',
		panelTitle: 'Colors', // MISSING
		auto: 'Αυτόματα',
		more: 'Περισσότερα χρώματα...'
	},

	colors: {
		'000': 'Black', // MISSING
		'800000': 'Maroon', // MISSING
		'8B4513': 'Saddle Brown', // MISSING
		'2F4F4F': 'Dark Slate Gray', // MISSING
		'008080': 'Teal', // MISSING
		'000080': 'Navy', // MISSING
		'4B0082': 'Indigo', // MISSING
		'696969': 'Dark Gray', // MISSING
		'B22222': 'Fire Brick', // MISSING
		'A52A2A': 'Brown', // MISSING
		'DAA520': 'Golden Rod', // MISSING
		'006400': 'Dark Green', // MISSING
		'40E0D0': 'Turquoise', // MISSING
		'0000CD': 'Medium Blue', // MISSING
		'800080': 'Purple', // MISSING
		'808080': 'Gray', // MISSING
		'F00': 'Red', // MISSING
		'FF8C00': 'Dark Orange', // MISSING
		'FFD700': 'Gold', // MISSING
		'008000': 'Green', // MISSING
		'0FF': 'Cyan', // MISSING
		'00F': 'Blue', // MISSING
		'EE82EE': 'Violet', // MISSING
		'A9A9A9': 'Dim Gray', // MISSING
		'FFA07A': 'Light Salmon', // MISSING
		'FFA500': 'Orange', // MISSING
		'FFFF00': 'Yellow', // MISSING
		'00FF00': 'Lime', // MISSING
		'AFEEEE': 'Pale Turquoise', // MISSING
		'ADD8E6': 'Light Blue', // MISSING
		'DDA0DD': 'Plum', // MISSING
		'D3D3D3': 'Light Grey', // MISSING
		'FFF0F5': 'Lavender Blush', // MISSING
		'FAEBD7': 'Antique White', // MISSING
		'FFFFE0': 'Light Yellow', // MISSING
		'F0FFF0': 'Honeydew', // MISSING
		'F0FFFF': 'Azure', // MISSING
		'F0F8FF': 'Alice Blue', // MISSING
		'E6E6FA': 'Lavender', // MISSING
		'FFF': 'White' // MISSING
	},

	scayt: {
		title: 'Spell Check As You Type', // MISSING
		opera_title: 'Not supported by Opera', // MISSING
		enable: 'Enable SCAYT', // MISSING
		disable: 'Disable SCAYT', // MISSING
		about: 'About SCAYT', // MISSING
		toggle: 'Toggle SCAYT', // MISSING
		options: 'Options', // MISSING
		langs: 'Languages', // MISSING
		moreSuggestions: 'More suggestions', // MISSING
		ignore: 'Ignore', // MISSING
		ignoreAll: 'Ignore All', // MISSING
		addWord: 'Add Word', // MISSING
		emptyDic: 'Dictionary name should not be empty.', // MISSING

		optionsTab: 'Options', // MISSING
		allCaps: 'Ignore All-Caps Words', // MISSING
		ignoreDomainNames: 'Ignore Domain Names', // MISSING
		mixedCase: 'Ignore Words with Mixed Case', // MISSING
		mixedWithDigits: 'Ignore Words with Numbers', // MISSING

		languagesTab: 'Languages', // MISSING

		dictionariesTab: 'Dictionaries', // MISSING
		dic_field_name: 'Dictionary name', // MISSING
		dic_create: 'Create', // MISSING
		dic_restore: 'Restore', // MISSING
		dic_delete: 'Delete', // MISSING
		dic_rename: 'Rename', // MISSING
		dic_info: 'Initially the User Dictionary is stored in a Cookie. However, Cookies are limited in size. When the User Dictionary grows to a point where it cannot be stored in a Cookie, then the dictionary may be stored on our server. To store your personal dictionary on our server you should specify a name for your dictionary. If you already have a stored dictionary, please type its name and click the Restore button.', // MISSING

		aboutTab: 'About' // MISSING
	},

	about: {
		title: 'About CKEditor', // MISSING
		dlgTitle: 'About CKEditor', // MISSING
		help: 'Check $1 for help.', // MISSING
		userGuide: 'CKEditor User\'s Guide', // MISSING
		moreInfo: 'For licensing information please visit our web site:', // MISSING
		copy: 'Copyright &copy; $1. All rights reserved.' // MISSING
	},

	maximize: 'Μεγιστοποίηση',
	minimize: 'Ελαχιστοποίηση',

	fakeobjects: {
		anchor: 'Anchor', // MISSING
		flash: 'Flash Animation', // MISSING
		iframe: 'IFrame', // MISSING
		hiddenfield: 'Hidden Field', // MISSING
		unknown: 'Unknown Object' // MISSING
	},

	resize: 'Σύρσιμο για αλλαγή μεγέθους',

	colordialog: {
		title: 'Select color', // MISSING
		options: 'Color Options', // MISSING
		highlight: 'Highlight', // MISSING
		selected: 'Selected Color', // MISSING
		clear: 'Clear' // MISSING
	},

	toolbarCollapse: 'Σύμπτηξη Εργαλειοθήκης',
	toolbarExpand: 'Ανάπτυξη Εργαλειοθήκης',

	toolbarGroups: {
		document: 'Document', // MISSING
		clipboard: 'Clipboard/Undo', // MISSING
		editing: 'Editing', // MISSING
		forms: 'Forms', // MISSING
		basicstyles: 'Basic Styles', // MISSING
		paragraph: 'Paragraph', // MISSING
		links: 'Links', // MISSING
		insert: 'Insert', // MISSING
		styles: 'Styles', // MISSING
		colors: 'Colors', // MISSING
		tools: 'Tools' // MISSING
	},

	bidi: {
		ltr: 'Text direction from left to right', // MISSING
		rtl: 'Text direction from right to left' // MISSING
	},

	docprops: {
		label: 'Ιδιότητες Εγγράφου',
		title: 'Ιδιότητες Εγγράφου',
		design: 'Design', // MISSING
		meta: 'Δεδομένα Meta',
		chooseColor: 'Choose', // MISSING
		other: 'Άλλο...',
		docTitle: 'Τίτλος Σελίδας',
		charset: 'Κωδικοποίηση Χαρακτήρων',
		charsetOther: 'Άλλη Κωδικοποίηση Χαρακτήρων',
		charsetASCII: 'ASCII', // MISSING
		charsetCE: 'Κεντρικής Ευρώπης',
		charsetCT: 'Παραδοσιακά κινέζικα (Big5)',
		charsetCR: 'Κυριλλική',
		charsetGR: 'Ελληνική',
		charsetJP: 'Ιαπωνική',
		charsetKR: 'Κορεάτικη',
		charsetTR: 'Τουρκική',
		charsetUN: 'Διεθνής (UTF-8)',
		charsetWE: 'Δυτικής Ευρώπης',
		docType: 'Επικεφαλίδα τύπου εγγράφου',
		docTypeOther: 'Άλλη επικεφαλίδα τύπου εγγράφου',
		xhtmlDec: 'Να συμπεριληφθούν οι δηλώσεις XHTML',
		bgColor: 'Χρώμα φόντου',
		bgImage: 'Διεύθυνση εικόνας φόντου',
		bgFixed: 'Φόντο χωρίς κύλιση',
		txtColor: 'Χρώμα Γραμμάτων',
		margin: 'Περιθώρια σελίδας',
		marginTop: 'Κορυφή',
		marginLeft: 'Αριστερά',
		marginRight: 'Δεξιά',
		marginBottom: 'Κάτω',
		metaKeywords: 'Λέξεις κλειδιά δείκτες εγγράφου (διαχωρισμός με κόμμα)',
		metaDescription: 'Περιγραφή εγγράφου',
		metaAuthor: 'Συγγραφέας',
		metaCopyright: 'Πνευματικά Δικαιώματα',
		previewHtml: '<p>This is some <strong>sample text</strong>. You are using <a href="javascript:void(0)">CKEditor</a>.</p>' // MISSING
	}
};

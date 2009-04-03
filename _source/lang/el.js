/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
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
 * Constains the dictionary of language entries.
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
	editorTitle: 'Rich text editor, %1', // MISSING

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
	unlink: 'Αφαίρεση Συνδέσμου (Link)',
	undo: 'Αναίρεση',
	redo: 'Επαναφορά',

	// Common messages and labels.
	common: {
		browseServer: 'Εξερεύνηση διακομιστή',
		url: 'URL',
		protocol: 'Προτόκολο',
		upload: 'Αποστολή',
		uploadSubmit: 'Αποστολή στον Διακομιστή',
		image: 'Εικόνα',
		flash: 'Εισαγωγή Flash',
		form: 'Φόρμα',
		checkbox: 'Κουτί επιλογής',
		radio: 'Κουμπί Radio',
		textField: 'Πεδίο κειμένου',
		textarea: 'Περιοχή κειμένου',
		hiddenField: 'Κρυφό πεδίο',
		button: 'Κουμπί',
		select: 'Πεδίο επιλογής',
		imageButton: 'Κουμπί εικόνας',
		notSet: '<χωρίς>',
		id: 'Id',
		name: 'Όνομα',
		langDir: 'Κατεύθυνση κειμένου',
		langDirLtr: 'Αριστερά προς Δεξιά (LTR)',
		langDirRtl: 'Δεξιά προς Αριστερά (RTL)',
		langCode: 'Κωδικός Γλώσσας',
		longDescr: 'Αναλυτική περιγραφή URL',
		cssClass: 'Stylesheet Classes',
		advisoryTitle: 'Συμβουλευτικός τίτλος',
		cssStyle: 'Στύλ',
		ok: 'OK',
		cancel: 'Ακύρωση',
		generalTab: 'General', // MISSING
		advancedTab: 'Για προχωρημένους',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Εισαγωγή Ειδικού Συμβόλου',
		title: 'Επιλέξτε ένα Ειδικό Σύμβολο'
	},

	// Link dialog.
	link: {
		toolbar: 'Εισαγωγή/Μεταβολή Συνδέσμου (Link)', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Μεταβολή Συνδέσμου (Link)',
		title: 'Σύνδεσμος (Link)',
		info: 'Link',
		target: 'Παράθυρο Στόχος (Target)',
		upload: 'Αποστολή',
		advanced: 'Για προχωρημένους',
		type: 'Τύπος συνδέσμου (Link)',
		toAnchor: 'Άγκυρα σε αυτή τη σελίδα',
		toEmail: 'E-Mail',
		target: 'Παράθυρο Στόχος (Target)',
		targetNotSet: '<χωρίς>',
		targetFrame: '<πλαίσιο>',
		targetPopup: '<παράθυρο popup>',
		targetNew: 'Νέο Παράθυρο (_blank)',
		targetTop: 'Ανώτατο Παράθυρο (_top)',
		targetSelf: 'Ίδιο Παράθυρο (_self)',
		targetParent: 'Γονικό Παράθυρο (_parent)',
		targetFrameName: 'Όνομα πλαισίου στόχου',
		targetPopupName: 'Όνομα Popup Window',
		popupFeatures: 'Επιλογές Popup Window',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Μπάρα Status',
		popupLocationBar: 'Μπάρα Τοποθεσίας',
		popupToolbar: 'Μπάρα Εργαλείων',
		popupMenuBar: 'Μπάρα Menu',
		popupFullScreen: 'Ολόκληρη η Οθόνη (IE)',
		popupScrollBars: 'Μπάρες Κύλισης',
		popupDependent: 'Dependent (Netscape)',
		popupWidth: 'Πλάτος',
		popupLeft: 'Τοποθεσία Αριστερής Άκρης',
		popupHeight: 'Ύψος',
		popupTop: 'Τοποθεσία Πάνω Άκρης',
		id: 'Id', // MISSING
		langDir: 'Κατεύθυνση κειμένου',
		langDirNotSet: '<χωρίς>',
		langDirLTR: 'Αριστερά προς Δεξιά (LTR)',
		langDirRTL: 'Δεξιά προς Αριστερά (RTL)',
		acccessKey: 'Συντόμευση (Access Key)',
		name: 'Όνομα',
		langCode: 'Κατεύθυνση κειμένου',
		tabIndex: 'Tab Index',
		advisoryTitle: 'Συμβουλευτικός τίτλος',
		advisoryContentType: 'Συμβουλευτικός τίτλος περιεχομένου',
		cssClasses: 'Stylesheet Classes',
		charset: 'Linked Resource Charset',
		styles: 'Στύλ',
		selectAnchor: 'Επιλέξτε μια άγκυρα',
		anchorName: 'Βάσει του Ονόματος (Name) της άγκυρας',
		anchorId: 'Βάσει του Element Id',
		emailAddress: 'Διεύθυνση Ηλεκτρονικού Ταχυδρομείου',
		emailSubject: 'Θέμα Μηνύματος',
		emailBody: 'Κείμενο Μηνύματος',
		noAnchors: '(Δεν υπάρχουν άγκυρες στο κείμενο)',
		noUrl: 'Εισάγετε την τοποθεσία (URL) του υπερσυνδέσμου (Link)',
		noEmail: 'Εισάγετε την διεύθυνση ηλεκτρονικού ταχυδρομείου'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Εισαγωγή/επεξεργασία Anchor',
		menu: 'Ιδιότητες άγκυρας',
		title: 'Ιδιότητες άγκυρας',
		name: 'Όνομα άγκυρας',
		errorName: 'Παρακαλούμε εισάγετε όνομα άγκυρας'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Find and Replace', // MISSING
		find: 'Αναζήτηση',
		replace: 'Αντικατάσταση',
		findWhat: 'Αναζήτηση:',
		replaceWith: 'Αντικατάσταση με:',
		notFoundMsg: 'Το κείμενο δεν βρέθηκε.',
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
		border: 'Μέγεθος Περιθωρίου',
		align: 'Στοίχιση',
		alignNotSet: '<χωρίς>',
		alignLeft: 'Αριστερά',
		alignCenter: 'Κέντρο',
		alignRight: 'Δεξιά',
		width: 'Πλάτος',
		widthPx: 'pixels',
		widthPc: '%',
		height: 'Ύψος',
		cellSpace: 'Απόσταση κελιών',
		cellPad: 'Γέμισμα κελιών',
		caption: 'Υπέρτιτλος',
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
		invalidCellSpacing: 'Cell spacing must be a number.', // MISSING
		invalidCellPadding: 'Cell padding must be a number.', // MISSING

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
			alignTop: 'Top', // MISSING
			alignMiddle: 'Middle', // MISSING
			alignBottom: 'Bottom', // MISSING
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
			invalidColSpan: 'Columns span must be a whole number.' // MISSING
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
		title: 'Ιδιότητες κουμπιού',
		text: 'Κείμενο (Τιμή)',
		type: 'Τύπος',
		typeBtn: 'Κουμπί',
		typeSbm: 'Καταχώρηση',
		typeRst: 'Επαναφορά'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Ιδιότητες κουμπιού επιλογής',
		radioTitle: 'Ιδιότητες κουμπιού radio',
		value: 'Τιμή',
		selected: 'Επιλεγμένο'
	},

	// Form Dialog.
	form: {
		title: 'Ιδιότητες φόρμας',
		menu: 'Ιδιότητες φόρμας',
		action: 'Δράση',
		method: 'Μάθοδος',
		encoding: 'Encoding', // MISSING
		target: 'Παράθυρο Στόχος (Target)',
		targetNotSet: '<χωρίς>',
		targetNew: 'Νέο Παράθυρο (_blank)',
		targetTop: 'Ανώτατο Παράθυρο (_top)',
		targetSelf: 'Ίδιο Παράθυρο (_self)',
		targetParent: 'Γονικό Παράθυρο (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Ιδιότητες πεδίου επιλογής',
		selectInfo: 'Πληροφορίες',
		opAvail: 'Διαθέσιμες επιλογές',
		value: 'Τιμή',
		size: 'Μέγεθος',
		lines: 'γραμμές',
		chkMulti: 'Πολλαπλές επιλογές',
		opText: 'Κείμενο',
		opValue: 'Τιμή',
		btnAdd: 'Προσθήκη',
		btnModify: 'Αλλαγή',
		btnUp: 'Πάνω',
		btnDown: 'Κάτω',
		btnSetValue: 'Προεπιλεγμένη επιλογή',
		btnDelete: 'Διαγραφή'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Ιδιότητες περιοχής κειμένου',
		cols: 'Στήλες',
		rows: 'Σειρές'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Ιδιότητες πεδίου κειμένου',
		name: 'Όνομα',
		value: 'Τιμή',
		charWidth: 'Μήκος χαρακτήρων',
		maxChars: 'Μέγιστοι χαρακτήρες',
		type: 'Τύπος',
		typeText: 'Κείμενο',
		typePass: 'Κωδικός'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Ιδιότητες κρυφού πεδίου',
		name: 'Όνομα',
		value: 'Τιμή'
	},

	// Image Dialog.
	image: {
		title: 'Ιδιότητες Εικόνας',
		titleButton: 'Ιδιότητες κουμπιού εικόνας',
		menu: 'Ιδιότητες Εικόνας',
		infoTab: 'Πληροφορίες Εικόνας',
		btnUpload: 'Αποστολή στον Διακομιστή',
		url: 'URL',
		upload: 'Αποστολή',
		alt: 'Εναλλακτικό Κείμενο (ALT)',
		width: 'Πλάτος',
		height: 'Ύψος',
		lockRatio: 'Κλείδωμα Αναλογίας',
		resetSize: 'Επαναφορά Αρχικού Μεγέθους',
		border: 'Περιθώριο',
		hSpace: 'Οριζόντιος Χώρος (HSpace)',
		vSpace: 'Κάθετος Χώρος (VSpace)',
		align: 'Ευθυγράμμιση (Align)',
		alignLeft: 'Αριστερά',
		alignAbsBottom: 'Απόλυτα Κάτω (Abs Bottom)',
		alignAbsMiddle: 'Απόλυτα στη Μέση (Abs Middle)',
		alignBaseline: 'Γραμμή Βάσης (Baseline)',
		alignBottom: 'Κάτω (Bottom)',
		alignMiddle: 'Μέση (Middle)',
		alignRight: 'Δεξιά (Right)',
		alignTextTop: 'Κορυφή Κειμένου (Text Top)',
		alignTop: 'Πάνω (Top)',
		preview: 'Προεπισκόπιση',
		alertUrl: 'Εισάγετε την τοποθεσία (URL) της εικόνας',
		linkTab: 'Σύνδεσμος',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Ιδιότητες Flash',
		propertiesTab: 'Properties', // MISSING
		title: 'Ιδιότητες flash',
		chkPlay: 'Αυτόματη έναρξη',
		chkLoop: 'Επανάληψη',
		chkMenu: 'Ενεργοποίηση Flash Menu',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Κλίμακα',
		scaleAll: 'Εμφάνιση όλων',
		scaleNoBorder: 'Χωρίς όρια',
		scaleFit: 'Ακριβής εφαρμογή',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Ευθυγράμμιση (Align)',
		alignLeft: 'Αριστερά',
		alignAbsBottom: 'Απόλυτα Κάτω (Abs Bottom)',
		alignAbsMiddle: 'Απόλυτα στη Μέση (Abs Middle)',
		alignBaseline: 'Γραμμή Βάσης (Baseline)',
		alignBottom: 'Κάτω (Bottom)',
		alignMiddle: 'Μέση (Middle)',
		alignRight: 'Δεξιά (Right)',
		alignTextTop: 'Κορυφή Κειμένου (Text Top)',
		alignTop: 'Πάνω (Top)',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Χρώμα Υποβάθρου',
		width: 'Πλάτος',
		height: 'Ύψος',
		hSpace: 'Οριζόντιος Χώρος (HSpace)',
		vSpace: 'Κάθετος Χώρος (VSpace)',
		validateSrc: 'Εισάγετε την τοποθεσία (URL) του υπερσυνδέσμου (Link)',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Ορθογραφικός έλεγχος',
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
		progress: 'Ορθογραφικός έλεγχος σε εξέλιξη...',
		noMispell: 'Ο ορθογραφικός έλεγχος ολοκληρώθηκε: Δεν βρέθηκαν λάθη',
		noChanges: 'Ο ορθογραφικός έλεγχος ολοκληρώθηκε: Δεν άλλαξαν λέξεις',
		oneChange: 'Ο ορθογραφικός έλεγχος ολοκληρώθηκε: Μια λέξη άλλαξε',
		manyChanges: 'Ο ορθογραφικός έλεγχος ολοκληρώθηκε: %1 λέξεις άλλαξαν',
		ieSpellDownload: 'Δεν υπάρχει εγκατεστημένος ορθογράφος. Θέλετε να τον κατεβάσετε τώρα;'
	},

	smiley: {
		toolbar: 'Smiley',
		title: 'Επιλέξτε ένα Smiley'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Λίστα με Αριθμούς',
	bulletedlist: 'Λίστα με Bullets',
	indent: 'Αύξηση Εσοχής',
	outdent: 'Μείωση Εσοχής',

	justify: {
		left: 'Στοίχιση Αριστερά',
		center: 'Στοίχιση στο Κέντρο',
		right: 'Στοίχιση Δεξιά',
		block: 'Πλήρης Στοίχιση (Block)'
	},

	outdent: 'Μείωση Εσοχής',
	blockquote: 'Blockquote', // MISSING

	clipboard: {
		title: 'Επικόλληση',
		cutError: 'Οι ρυθμίσεις ασφαλείας του φυλλομετρητή σας δεν επιτρέπουν την επιλεγμένη εργασία αποκοπής. Χρησιμοποιείστε το πληκτρολόγιο (Ctrl+X).',
		copyError: 'Οι ρυθμίσεις ασφαλείας του φυλλομετρητή σας δεν επιτρέπουν την επιλεγμένη εργασία αντιγραφής. Χρησιμοποιείστε το πληκτρολόγιο (Ctrl+C).',
		pasteMsg: 'Παρακαλώ επικολήστε στο ακόλουθο κουτί χρησιμοποιόντας το πληκτρολόγιο (<STRONG>Ctrl+V</STRONG>) και πατήστε <STRONG>OK</STRONG>.',
		securityMsg: 'Because of your browser security settings, the editor is not able to access your clipboard data directly. You are required to paste it again in this window.' // MISSING
	},

	pastefromword: {
		toolbar: 'Επικόλληση από το Word',
		title: 'Επικόλληση από το Word',
		advice: 'Παρακαλώ επικολήστε στο ακόλουθο κουτί χρησιμοποιόντας το πληκτρολόγιο (<STRONG>Ctrl+V</STRONG>) και πατήστε <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Αγνόηση προδιαγραφών γραμματοσειράς',
		removeStyle: 'Αφαίρεση προδιαγραφών στύλ'
	},

	pasteText: {
		button: 'Επικόλληση ως Απλό Κείμενο',
		title: 'Επικόλληση ως Απλό Κείμενο'
	},

	templates: {
		button: 'Πρότυπα',
		title: 'Πρότυπα περιεχομένου',
		insertOption: 'Αντικατάσταση υπάρχοντων περιεχομένων',
		selectPromptMsg: 'Παρακαλώ επιλέξτε πρότυπο για εισαγωγή στο πρόγραμμα<br>(τα υπάρχοντα περιεχόμενα θα χαθούν):',
		emptyListMsg: '(Δεν έχουν καθοριστεί πρότυπα)'
	},

	showBlocks: 'Show Blocks', // MISSING

	stylesCombo: {
		label: 'Στυλ',
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Μορφή Γραμματοσειράς',
		panelTitle: 'Μορφή Γραμματοσειράς',

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

	font: {
		label: 'Γραμματοσειρά',
		panelTitle: 'Γραμματοσειρά'
	},

	fontSize: {
		label: 'Μέγεθος',
		panelTitle: 'Μέγεθος'
	},

	colorButton: {
		textColorTitle: 'Χρώμα Γραμμάτων',
		bgColorTitle: 'Χρώμα Υποβάθρου',
		auto: 'Αυτόματο',
		more: 'Περισσότερα χρώματα...'
	}
};

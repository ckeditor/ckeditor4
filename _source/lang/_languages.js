/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ '' ] = // MISSING
{
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr', // MISSING
	/*
	 * Screenreader titles. Please note that screenreaders are not always capable
	 * of reading non-English words. So be careful while translating it.
	 */
	editorTitle: 'Rich text editor, %1', // MISSING

	// Toolbar buttons without dialogs.
	source: 'Source', // MISSING
	newPage: 'New Page', // MISSING
	save: 'Save', // MISSING
	preview: 'Preview', // MISSING
	cut: 'Cut', // MISSING
	copy: 'Copy', // MISSING
	paste: 'Paste', // MISSING
	print: 'Print', // MISSING
	underline: 'Underline', // MISSING
	bold: 'Bold', // MISSING
	italic: 'Italic', // MISSING
	selectAll: 'Select All', // MISSING
	removeFormat: 'Remove Format', // MISSING
	strike: 'Strike Through', // MISSING
	subscript: 'Subscript', // MISSING
	superscript: 'Superscript', // MISSING
	horizontalrule: 'Insert Horizontal Line', // MISSING
	pagebreak: 'Insert Page Break for Printing', // MISSING
	unlink: 'Unlink', // MISSING
	undo: 'Undo', // MISSING
	redo: 'Redo', // MISSING

	// Common messages and labels.
	common: {
		browseServer: 'Browser Server', // MISSING
		url: 'URL', // MISSING
		protocol: 'Protocol', // MISSING
		upload: 'Upload', // MISSING
		uploadSubmit: 'Send it to the Server', // MISSING
		image: 'Image', // MISSING
		flash: 'Flash', // MISSING
		form: 'Form', // MISSING
		checkbox: 'Checkbox', // MISSING
		radio: 'Radio Button', // MISSING
		textField: 'Text Field', // MISSING
		textarea: 'Textarea', // MISSING
		hiddenField: 'Hidden Field', // MISSING
		button: 'Button', // MISSING
		select: 'Selection Field', // MISSING
		imageButton: 'Image Button', // MISSING
		notSet: '<not set>', // MISSING
		id: 'Id', // MISSING
		name: 'Name', // MISSING
		langDir: 'Language Direction', // MISSING
		langDirLtr: 'Left to Right (LTR)', // MISSING
		langDirRtl: 'Right to Left (RTL)', // MISSING
		langCode: 'Language Code', // MISSING
		longDescr: 'Long Description URL', // MISSING
		cssClass: 'Stylesheet Classes', // MISSING
		advisoryTitle: 'Advisory Title', // MISSING
		cssStyle: 'Style', // MISSING
		ok: 'OK', // MISSING
		cancel: 'Cancel', // MISSING
		generalTab: 'General', // MISSING
		advancedTab: 'Advanced', // MISSING
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Insert Special Character', // MISSING
		title: 'Select Special Character' // MISSING
	},

	// Link dialog.
	link: {
		toolbar: 'Link\u200b', // MISSING // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Edit Link', // MISSING
		title: 'Link', // MISSING
		info: 'Link Info', // MISSING
		target: 'Target', // MISSING
		upload: 'Upload', // MISSING
		advanced: 'Advanced', // MISSING
		type: 'Link Type', // MISSING
		toAnchor: 'Link to anchor in the text', // MISSING
		toEmail: 'E-mail', // MISSING
		target: 'Target', // MISSING
		targetNotSet: '<not set>', // MISSING
		targetFrame: '<frame>', // MISSING
		targetPopup: '<popup window>', // MISSING
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		targetFrameName: 'Target Frame Name', // MISSING
		targetPopupName: 'Popup Window Name', // MISSING
		popupFeatures: 'Popup Window Features', // MISSING
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Status Bar', // MISSING
		popupLocationBar: 'Location Bar', // MISSING
		popupToolbar: 'Toolbar', // MISSING
		popupMenuBar: 'Menu Bar', // MISSING
		popupFullScreen: 'Full Screen (IE)', // MISSING
		popupScrollBars: 'Scroll Bars', // MISSING
		popupDependent: 'Dependent (Netscape)', // MISSING
		popupWidth: 'Width', // MISSING
		popupLeft: 'Left Position', // MISSING
		popupHeight: 'Height', // MISSING
		popupTop: 'Top Position', // MISSING
		id: 'Id', // MISSING
		langDir: 'Language Direction', // MISSING
		langDirNotSet: '<not set>', // MISSING
		langDirLTR: 'Left to Right', // MISSING
		langDirRTL: 'Right to Left', // MISSING
		acccessKey: 'Access Key', // MISSING
		name: 'Name', // MISSING
		langCode: 'Language Code', // MISSING
		tabIndex: 'Tab Index', // MISSING
		advisoryTitle: 'Advisory Title', // MISSING
		advisoryContentType: 'Advisory Content Type', // MISSING
		cssClasses: 'Stylesheet Classes', // MISSING
		charset: 'Linked Resource Charset', // MISSING
		styles: 'Style', // MISSING
		selectAnchor: 'Select an Anchor', // MISSING
		anchorName: 'By Anchor Name', // MISSING
		anchorId: 'By Element Id', // MISSING
		emailAddress: 'E-Mail Address', // MISSING
		emailSubject: 'Message Subject', // MISSING
		emailBody: 'Message Body', // MISSING
		noAnchors: '(No anchors available in the document)', // MISSING
		noUrl: 'Please type the link URL', // MISSING
		noEmail: 'Please type the e-mail address' // MISSING
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Anchor', // MISSING
		menu: 'Edit Anchor', // MISSING
		title: 'Anchor Properties', // MISSING
		name: 'Anchor Name', // MISSING
		errorName: 'Please type the anchor name' // MISSING
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Find and Replace', // MISSING
		find: 'Find', // MISSING
		replace: 'Replace', // MISSING
		findWhat: 'Find what:', // MISSING
		replaceWith: 'Replace with:', // MISSING
		notFoundMsg: 'The specified text was not found.', // MISSING
		matchCase: 'Match case', // MISSING
		matchWord: 'Match whole word', // MISSING
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Replace All', // MISSING
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Table', // MISSING
		title: 'Table Properties', // MISSING
		menu: 'Table Properties', // MISSING
		deleteTable: 'Delete Table', // MISSING
		rows: 'Rows', // MISSING
		columns: 'Columns', // MISSING
		border: 'Border size', // MISSING
		align: 'Alignment', // MISSING
		alignNotSet: '<Not set>', // MISSING
		alignLeft: 'Left', // MISSING
		alignCenter: 'Center', // MISSING
		alignRight: 'Right', // MISSING
		width: 'Width', // MISSING
		widthPx: 'pixels', // MISSING
		widthPc: 'percent', // MISSING
		height: 'Height', // MISSING
		cellSpace: 'Cell spacing', // MISSING
		cellPad: 'Cell padding', // MISSING
		caption: 'Caption', // MISSING
		summary: 'Summary', // MISSING
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
			menu: 'Cell', // MISSING
			insertBefore: 'Insert Cell Before', // MISSING
			insertAfter: 'Insert Cell After', // MISSING
			deleteCell: 'Delete Cells', // MISSING
			merge: 'Merge Cells', // MISSING
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
			menu: 'Row', // MISSING
			insertBefore: 'Insert Row Before', // MISSING
			insertAfter: 'Insert Row After', // MISSING
			deleteRow: 'Delete Rows' // MISSING
		},

		column: {
			menu: 'Column', // MISSING
			insertBefore: 'Insert Column Before', // MISSING
			insertAfter: 'Insert Column After', // MISSING
			deleteColumn: 'Delete Columns' // MISSING
		}
	},

	// Button Dialog.
	button: {
		title: 'Button Properties', // MISSING
		text: 'Text (Value)', // MISSING
		type: 'Type', // MISSING
		typeBtn: 'Button', // MISSING
		typeSbm: 'Submit', // MISSING
		typeRst: 'Reset' // MISSING
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Checkbox Properties', // MISSING
		radioTitle: 'Radio Button Properties', // MISSING
		value: 'Value', // MISSING
		selected: 'Selected' // MISSING
	},

	// Form Dialog.
	form: {
		title: 'Form Properties', // MISSING
		menu: 'Form Properties', // MISSING
		action: 'Action', // MISSING
		method: 'Method', // MISSING
		encoding: 'Encoding', // MISSING
		target: 'Target', // MISSING
		targetNotSet: '<not set>', // MISSING
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)' // MISSING
	},

	// Select Field Dialog.
	select: {
		title: 'Selection Field Properties', // MISSING
		selectInfo: 'Select Info', // MISSING
		opAvail: 'Available Options', // MISSING
		value: 'Value', // MISSING
		size: 'Size', // MISSING
		lines: 'lines', // MISSING
		chkMulti: 'Allow multiple selections', // MISSING
		opText: 'Text', // MISSING
		opValue: 'Value', // MISSING
		btnAdd: 'Add', // MISSING
		btnModify: 'Modify', // MISSING
		btnUp: 'Up', // MISSING
		btnDown: 'Down', // MISSING
		btnSetValue: 'Set as selected value', // MISSING
		btnDelete: 'Delete' // MISSING
	},

	// Textarea Dialog.
	textarea: {
		title: 'Textarea Properties', // MISSING
		cols: 'Columns', // MISSING
		rows: 'Rows' // MISSING
	},

	// Text Field Dialog.
	textfield: {
		title: 'Text Field Properties', // MISSING
		name: 'Name', // MISSING
		value: 'Value', // MISSING
		charWidth: 'Character Width', // MISSING
		maxChars: 'Maximum Characters', // MISSING
		type: 'Type', // MISSING
		typeText: 'Text', // MISSING
		typePass: 'Password' // MISSING
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Hidden Field Properties', // MISSING
		name: 'Name', // MISSING
		value: 'Value' // MISSING
	},

	// Image Dialog.
	image: {
		title: 'Image Properties', // MISSING
		titleButton: 'Image Button Properties', // MISSING
		menu: 'Image Properties', // MISSING
		infoTab: 'Image Info', // MISSING
		btnUpload: 'Send it to the Server', // MISSING
		url: 'URL', // MISSING
		upload: 'Upload', // MISSING
		alt: 'Alternative Text', // MISSING
		width: 'Width', // MISSING
		height: 'Height', // MISSING
		lockRatio: 'Lock Ratio', // MISSING
		resetSize: 'Reset Size', // MISSING
		border: 'Border', // MISSING
		hSpace: 'HSpace', // MISSING
		vSpace: 'VSpace', // MISSING
		align: 'Align', // MISSING
		alignLeft: 'Left', // MISSING
		alignAbsBottom: 'Abs Bottom', // MISSING
		alignAbsMiddle: 'Abs Middle', // MISSING
		alignBaseline: 'Baseline', // MISSING
		alignBottom: 'Bottom', // MISSING
		alignMiddle: 'Middle', // MISSING
		alignRight: 'Right', // MISSING
		alignTextTop: 'Text Top', // MISSING
		alignTop: 'Top', // MISSING
		preview: 'Preview', // MISSING
		alertUrl: 'Please type the image URL', // MISSING
		linkTab: 'Link', // MISSING
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Flash Properties', // MISSING
		propertiesTab: 'Properties', // MISSING
		title: 'Flash Properties', // MISSING
		chkPlay: 'Auto Play', // MISSING
		chkLoop: 'Loop', // MISSING
		chkMenu: 'Enable Flash Menu', // MISSING
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Scale', // MISSING
		scaleAll: 'Show all', // MISSING
		scaleNoBorder: 'No Border', // MISSING
		scaleFit: 'Exact Fit', // MISSING
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Align', // MISSING
		alignLeft: 'Left', // MISSING
		alignAbsBottom: 'Abs Bottom', // MISSING
		alignAbsMiddle: 'Abs Middle', // MISSING
		alignBaseline: 'Baseline', // MISSING
		alignBottom: 'Bottom', // MISSING
		alignMiddle: 'Middle', // MISSING
		alignRight: 'Right', // MISSING
		alignTextTop: 'Text Top', // MISSING
		alignTop: 'Top', // MISSING
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Background color', // MISSING
		width: 'Width', // MISSING
		height: 'Height', // MISSING
		hSpace: 'HSpace', // MISSING
		vSpace: 'VSpace', // MISSING
		validateSrc: 'URL must not be empty.', // MISSING
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Check Spelling', // MISSING
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Not in dictionary', // MISSING
		changeTo: 'Change to', // MISSING
		btnIgnore: 'Ignore', // MISSING
		btnIgnoreAll: 'Ignore All', // MISSING
		btnReplace: 'Replace', // MISSING
		btnReplaceAll: 'Replace All', // MISSING
		btnUndo: 'Undo', // MISSING
		noSuggestions: '- No suggestions -', // MISSING
		progress: 'Spell check in progress...', // MISSING
		noMispell: 'Spell check complete: No misspellings found', // MISSING
		noChanges: 'Spell check complete: No words changed', // MISSING
		oneChange: 'Spell check complete: One word changed', // MISSING
		manyChanges: 'Spell check complete: %1 words changed', // MISSING
		ieSpellDownload: 'Spell checker not installed. Do you want to download it now?' // MISSING
	},

	smiley: {
		toolbar: 'Smiley', // MISSING
		title: 'Insert a Smiley' // MISSING
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Insert/Remove Numbered List', // MISSING
	bulletedlist: 'Insert/Remove Bulleted List', // MISSING
	indent: 'Increase Indent', // MISSING
	outdent: 'Decrease Indent', // MISSING

	justify: {
		left: 'Left Justify', // MISSING
		center: 'Center Justify', // MISSING
		right: 'Right Justify', // MISSING
		block: 'Block Justify' // MISSING
	},

	outdent: 'Decrease Indent', // MISSING
	blockquote: 'Blockquote', // MISSING

	clipboard: {
		title: 'Paste', // MISSING
		cutError: 'Your browser security settings don\'t permit the editor to automatically execute cutting operations. Please use the keyboard for that (Ctrl+X).', // MISSING
		copyError: 'Your browser security settings don\'t permit the editor to automatically execute copying operations. Please use the keyboard for that (Ctrl+C).', // MISSING
		pasteMsg: 'Please paste inside the following box using the keyboard (Ctrl+V) and hit OK', // MISSING
		securityMsg: 'Because of your browser security settings, the editor is not able to access your clipboard data directly. You are required to paste it again in this window.' // MISSING
	},

	pastefromword: {
		toolbar: 'Paste from Word', // MISSING
		title: 'Paste from Word', // MISSING
		advice: 'Please paste inside the following box using the keyboard (<strong>Ctrl+V</strong>) and hit <strong>OK</strong>.', // MISSING
		ignoreFontFace: 'Ignore Font Face definitions', // MISSING
		removeStyle: 'Remove Styles definitions' // MISSING
	},

	pasteText: {
		button: 'Paste as plain text', // MISSING
		title: 'Paste as Plain Text' // MISSING
	},

	templates: {
		button: 'Templates', // MISSING
		title: 'Content Templates', // MISSING
		insertOption: 'Replace actual contents', // MISSING
		selectPromptMsg: 'Please select the template to open in the editor', // MISSING
		emptyListMsg: '(No templates defined)' // MISSING
	},

	showBlocks: 'Show Blocks', // MISSING

	stylesCombo: {
		label: 'Styles', // MISSING
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Format', // MISSING
		panelTitle: 'Paragraph Format', // MISSING

		tag_p: 'Normal', // MISSING
		tag_pre: 'Formatted', // MISSING
		tag_address: 'Address', // MISSING
		tag_h1: 'Heading 1', // MISSING
		tag_h2: 'Heading 2', // MISSING
		tag_h3: 'Heading 3', // MISSING
		tag_h4: 'Heading 4', // MISSING
		tag_h5: 'Heading 5', // MISSING
		tag_h6: 'Heading 6', // MISSING
		tag_div: 'Normal (DIV)' // MISSING
	},

	font: {
		label: 'Font', // MISSING
		panelTitle: 'Font Style' // MISSING
	},

	fontSize: {
		label: 'Size', // MISSING
		panelTitle: 'Font Size' // MISSING
	},

	colorButton: {
		textColorTitle: 'Text Color', // MISSING
		bgColorTitle: 'Background Color', // MISSING
		auto: 'Automatic', // MISSING
		more: 'More Colors...' // MISSING
	},

	about: {
		title: 'About CKEditor', // MISSING
		moreInfo: 'For licensing information please visit our web site:', // MISSING
		copy: 'Copyright &copy; $1. All rights reserved.' // MISSING
	},

	maximize: 'Maximize' // MISSING
};

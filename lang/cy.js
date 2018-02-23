/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Welsh language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'cy' ] = {
	// ARIA description.
	editor: 'Golygydd Testun Cyfoethog',
	editorPanel: 'Panel Golygydd Testun Cyfoethog',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Gwasgwch ALT 0 am gymorth',

		browseServer: 'Pori\'r Gweinydd',
		url: 'URL',
		protocol: 'Protocol',
		upload: 'Lanlwytho',
		uploadSubmit: 'Anfon i\'r Gweinydd',
		image: 'Delwedd',
		flash: 'Flash',
		form: 'Ffurflen',
		checkbox: 'Blwch ticio',
		radio: 'Botwm Radio',
		textField: 'Maes Testun',
		textarea: 'Ardal Testun',
		hiddenField: 'Maes Cudd',
		button: 'Botwm',
		select: 'Maes Dewis',
		imageButton: 'Botwm Delwedd',
		notSet: '<heb osod>',
		id: 'Id',
		name: 'Name',
		langDir: 'Cyfeiriad Iaith',
		langDirLtr: 'Chwith i\'r Dde (LTR)',
		langDirRtl: 'Dde i\'r Chwith (RTL)',
		langCode: 'Cod Iaith',
		longDescr: 'URL Disgrifiad Hir',
		cssClass: 'Dosbarthiadau Dalen Arddull',
		advisoryTitle: 'Teitl Cynghorol',
		cssStyle: 'Arddull',
		ok: 'Iawn',
		cancel: 'Diddymu',
		close: 'Cau',
		preview: 'Rhagolwg',
		resize: 'Ailfeintio',
		generalTab: 'Cyffredinol',
		advancedTab: 'Uwch',
		validateNumberFailed: '\'Dyw\'r gwerth hwn ddim yn rhif.',
		confirmNewPage: 'Byddwch chi\'n colli unrhyw newidiadau i\'r cynnwys sydd heb eu cadw. Ydych am barhau i lwytho tudalen newydd?',
		confirmCancel: 'Cafodd rhai o\'r opsiynau eu newid. Ydych chi wir am gau\'r deialog?',
		options: 'Opsiynau',
		target: 'Targed',
		targetNew: 'Ffenest Newydd (_blank)',
		targetTop: 'Ffenest ar y Brig (_top)',
		targetSelf: 'Yr un Ffenest (_self)',
		targetParent: 'Ffenest y Rhiant (_parent)',
		langDirLTR: 'Chwith i\'r Dde (LTR)',
		langDirRTL: 'Dde i\'r Chwith (RTL)',
		styles: 'Arddull',
		cssClasses: 'Dosbarthiadau Dalen Arddull',
		width: 'Lled',
		height: 'Uchder',
		align: 'Alinio',
		left: 'Chwith',
		right: 'Dde',
		center: 'Canol',
		justify: 'Unioni',
		alignLeft: 'Alinio i\'r Chwith',
		alignRight: 'Alinio i\'r Dde',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Brig',
		alignMiddle: 'Canol',
		alignBottom: 'Gwaelod',
		alignNone: 'None', // MISSING
		invalidValue: 'Gwerth annilys.',
		invalidHeight: 'Mae\'n rhaid i\'r uchder fod yn rhif.',
		invalidWidth: 'Mae\'n rhaid i\'r lled fod yn rhif.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Mae\'n rhaid i\'r gwerth ar gyfer maes "%1" fod yn rhif positif gyda neu heb uned fesuriad CSS dilys (px, %, in, cm, mm, em, ex, pt, neu pc).',
		invalidHtmlLength: 'Mae\'n rhaid i\'r gwerth ar gyfer maes "%1" fod yn rhif positif gyda neu heb uned fesuriad HTML dilys (px neu %).',
		invalidInlineStyle: 'Mae\'n rhaid i\'r gwerth ar gyfer arddull mewn-llinell gynnwys un set neu fwy ar y fformat "enw : gwerth", wedi\'u gwahanu gyda hanner colon.',
		cssLengthTooltip: 'Rhowch rif am werth mewn picsel neu rhif gydag uned CSS dilys (px, %, in, cm, mm, em, pt neu pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, ddim ar gael</span>',

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

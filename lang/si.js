/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'si' ] = {
	// ARIA description.
	editor: 'පොහොසත් වචන සංස්කරණ',
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'උදව් ලබා ගැනීමට  ALT බොත්තම ඔබන්න',

		browseServer: 'සෙවුම් සේවාදායකය',
		url: 'URL',
		protocol: 'මුලාපත්‍රය',
		upload: 'උඩුගතකිරීම',
		uploadSubmit: 'සේවාදායකය වෙත යොමුකිරිම',
		image: 'රුපය',
		flash: 'දීප්තිය',
		form: 'පෝරමය',
		checkbox: 'ලකුණුකිරීමේ කොටුව',
		radio: 'තේරීම් ',
		textField: 'ලියන ප්‍රදේශය',
		textarea: 'අකුරු ',
		hiddenField: 'සැඟවුණු ප්‍රදේශය',
		button: 'බොත්තම',
		select: 'තෝරන්න ',
		imageButton: 'රුප ',
		notSet: '<යොදා >',
		id: 'අංකය',
		name: 'නම',
		langDir: 'භාෂා දිශාව',
		langDirLtr: 'වමේසිට දකුණුට',
		langDirRtl: 'දකුණේ සිට වමට',
		langCode: 'භාෂා කේතය',
		longDescr: 'සම්පුර්න පැහැදිලි කිරීම',
		cssClass: 'විලාශ පත්‍ර පන්තිය',
		advisoryTitle: 'උපදෙස් ',
		cssStyle: 'විලාසය',
		ok: 'නිරදි',
		cancel: 'අවලංගු කිරීම',
		close: 'වැසීම',
		preview: 'නැවත ',
		resize: 'විශාලත්වය නැවත වෙනස් කිරීම',
		generalTab: 'පොදු කරුණු.',
		advancedTab: 'දීය',
		validateNumberFailed: 'මෙම වටිනාකම අංකයක් නොවේ',
		confirmNewPage: 'ආරක්ෂා නොකළ සියලුම දත්තයන් මැකියනුලැබේ. ඔබට නව පිටුවක් ලබා ගැනීමට අවශ්‍යද?',
		confirmCancel: 'ඇතම් විකල්පයන් වෙනස් කර ඇත. ඔබට මින් නික්මීමට අවශ්‍යද?',
		options: ' විකල්ප',
		target: 'අරමුණ',
		targetNew: 'නව කව්ළුව',
		targetTop: 'වැදගත් කව්ළුව',
		targetSelf: 'එම කව්ළුව(_තම\\\\)',
		targetParent: 'මව් කව්ළුව(_)',
		langDirLTR: 'වමේසිට දකුණුට',
		langDirRTL: 'දකුණේ සිට වමට',
		styles: 'විලාසය',
		cssClasses: 'විලාසපත්‍ර පන්තිය',
		width: 'පළල',
		height: 'උස',
		align: 'ගැලපුම',
		left: 'වම',
		right: 'දකුණ',
		center: 'මධ්‍ය',
		justify: 'Justify', // MISSING
		alignLeft: 'Align Left', // MISSING
		alignRight: 'Align Right', // MISSING
		alignCenter: 'Align Center', // MISSING
		alignTop: 'ඉ',
		alignMiddle: 'මැද',
		alignBottom: 'පහල',
		alignNone: 'None', // MISSING
		invalidValue: 'වැරදී වටිනාකමකි',
		invalidHeight: 'උස අංකයක් විය යුතුය',
		invalidWidth: 'පළල අංකයක් විය යුතුය',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'වටිනාකමක් නිරූපණය කිරීම "%1" ප්‍රදේශය ධන සංක්‍යාත්මක වටිනාකමක් හෝ  නිවරදි නොවන  CSS මිනුම් එකක(px, %, in, cm, mm, em, ex, pt, pc)',
		invalidHtmlLength: 'වටිනාකමක් නිරූපණය කිරීම "%1" ප්‍රදේශය ධන සංක්‍යාත්මක වටිනාකමක් හෝ  නිවරදි නොවන  HTML මිනුම් එකක (px හෝ %).',
		invalidInlineStyle: 'වටිනාකමක් නිරූපණය කිරීම  පේළි විලාසයයට ආකෘතිය  අනතර්ග විය යුතය  "නම : වටිනාකම", තිත් කොමාවකින් වෙන් වෙන ලද.',
		cssLengthTooltip: 'සංක්‍යා ඇතුලත් කිරීමේදී වටිනාකම තිත් ප්‍රමාණය නිවරදි CSS  ඒකක(තිත්, %, අඟල්,සෙමි, mm, em, ex, pt, pc)',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span පන්තිය="ළඟා වියහැකි ද බලන්න">, නොමැතිනම්</span>',

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

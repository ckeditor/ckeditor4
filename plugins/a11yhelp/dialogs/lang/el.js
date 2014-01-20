/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'el', {
	title: 'Οδηγίες Προσβασιμότητας',
	contents: 'Περιεχόμενα Βοήθειας. Πατήστε ESC για κλείσιμο.',
	legend: [
		{
		name: 'Γενικά',
		items: [
			{
			name: 'Εργαλειοθήκη Επεξεργαστή',
			legend: 'Πατήστε ${toolbarFocus} για να περιηγηθείτε στην γραμμή εργαλείων. Μετακινηθείτε ανάμεσα στις ομάδες της γραμμής εργαλείων με TAB και SHIFT-TAB. Μετακινηθείτε ανάμεσα στα κουμπιά εργαλείων με το ΔΕΞΙ ή ΑΡΙΣΤΕΡΟ ΒΕΛΑΚΙ. Πατήστε ΔΙΑΣΤΗΜΑ ή ENTER για να ενεργοποιήσετε το ενεργό κουμπί εργαλείου.'
		},

			{
			name: 'Παράθυρο Διαλόγου Επεξεργαστή',
			legend: 'Μέσα σε ένα παράθυρο διαλόγου, πατήστε TAB για να μεταβείτε στο επόμενο πεδίο ή SHIFT + TAB για να μεταβείτε στο προηγούμενο. Πατήστε ENTER για να υποβάλετε την φόρμα. Πατήστε ESC για να ακυρώσετε την διαδικασία της φόρμας. Για παράθυρα διαλόγων που έχουν πολλές σελίδες σε καρτέλες πατήστε ALT + F10 για να μεταβείτε στην λίστα των καρτελών. Στην συνέχεια μπορείτε να μεταβείτε στην επόμενη καρτέλα πατώντας το TAB ή το ΔΕΞΙ ΒΕΛΑΚΙ. Μπορείτε να μεταβείτε στην προηγούμενη καρτέλα πατώντας SHIFT + TAB ή το ΑΡΙΣΤΕΡΟ ΒΕΛΑΚΙ. Πατήστε ΔΙΑΣΤΗΜΑ ή ENTER για να επιλέξτε την καρτέλα για προβολή.'
		},

			{
			name: 'Αναδυόμενο Μενού Επεξεργαστή',
			legend: 'Πατήστε ${contextMenu} ή APPLICATION KEY για να ανοίξετε το αναδυόμενο μενού. Μετά μετακινηθείτε στην επόμενη επιλογή του μενού με  TAB ή ΚΑΤΩ ΒΕΛΑΚΙ. Μετακινηθείτε στην προηγούμενη επιλογή με SHIFT+TAB ή το ΠΑΝΩ ΒΕΛΑΚΙ. Πατήστε ΔΙΑΣΤΗΜΑ ή ENTER για να επιλέξτε το τρέχων στοιχείο. Ανοίξτε το αναδυόμενο μενού της τρέχουσας επιλογής με ΔΙΑΣΤΗΜΑ ή ENTER ή το ΔΕΞΙ ΒΕΛΑΚΙ. Μεταβείτε πίσω στο αρχικό στοιχείο μενού με το ESC ή το ΑΡΙΣΤΕΡΟ ΒΕΛΑΚΙ. Κλείστε το αναδυόμενο μενού με ESC.'
		},

			{
			name: 'Κουτί Λίστας Επεξεργαστών',
			legend: 'Μέσα σε ένα κουτί λίστας, μετακινηθείτε στο επόμενο στοιχείο με TAB ή ΚΑΤΩ ΒΕΛΑΚΙ. Μετακινηθείτε στο προηγούμενο στοιχείο με SHIFT + TAB ή το ΠΑΝΩ ΒΕΛΑΚΙ. Πατήστε ΔΙΑΣΤΗΜΑ ή ENTER για να επιλέξετε ένα στοιχείο. Πατήστε ESC για να κλείσετε το κουτί της λίστας.'
		},

			{
			name: 'Μπάρα Διαδρομών Στοιχείων Επεξεργαστή',
			legend: 'Πατήστε ${elementsPathFocus} για να περιηγηθείτε στην μπάρα διαδρομών στοιχείων του επεξεργαστή. Μετακινηθείτε στο κουμπί του επόμενου στοιχείου με το TAB ή το ΔΕΞΙ ΒΕΛΑΚΙ. Μετακινηθείτε στο κουμπί του προηγούμενου στοιχείου με το SHIFT+TAB ή το ΑΡΙΣΤΕΡΟ ΒΕΛΑΚΙ. Πατήστε ΔΙΑΣΤΗΜΑ ή ENTER για να επιλέξετε το στοιχείο στον επεξεργαστή.'
		}
		]
	},
		{
		name: 'Εντολές',
		items: [
			{
			name: 'Εντολή αναίρεσης',
			legend: 'Πατήστε ${undo}'
		},
			{
			name: 'Εντολή επανάληψης',
			legend: 'Πατήστε ${redo}'
		},
			{
			name: 'Εντολή έντονης γραφής',
			legend: 'Πατήστε ${bold}'
		},
			{
			name: 'Εντολή πλάγιας γραφής',
			legend: 'Πατήστε ${italic}'
		},
			{
			name: 'Εντολή υπογράμμισης',
			legend: 'Πατήστε ${underline}'
		},
			{
			name: 'Εντολή συνδέσμου',
			legend: 'Πατήστε ${link}'
		},
			{
			name: 'Εντολή Σύμπτηξης Εργαλειοθήκης',
			legend: 'Πατήστε ${toolbarCollapse}'
		},
			{
			name: 'Πρόσβαση στην προηγούμενη εντολή του χώρου εστίασης ',
			legend: 'Πατήστε ${accessPreviousSpace} για να έχετε πρόσβαση στον πιο κοντινό χώρο εστίασης πριν το δρομέα, για παράδειγμα: δύο παρακείμενα στοιχεία ΥΕ. Επαναλάβετε το συνδυασμό πλήκτρων για να φθάσετε στους χώρους μακρινής εστίασης. '
		},
			{
			name: 'Πρόσβαση στην επόμενη εντολή του χώρου εστίασης',
			legend: 'Πατήστε ${accessNextSpace} για να έχετε πρόσβαση στον πιο κοντινό χώρο εστίασης μετά το δρομέα, για παράδειγμα: δύο παρακείμενα στοιχεία ΥΕ. Επαναλάβετε το συνδυασμό πλήκτρων για τους χώρους μακρινής εστίασης. '
		},
			{
			name: 'Βοήθεια Προσβασιμότητας',
			legend: 'Πατήστε ${a11yHelp}'
		}
		]
	}
	],
	backspace: 'BACKSPACE', // MISSING
	tab: 'TAB', // MISSING
	enter: 'ENTER', // MISSING
	shift: 'SHIFT', // MISSING
	ctrl: 'CTRL', // MISSING
	alt: 'ALT', // MISSING
	pause: 'PAUSE', // MISSING
	capslock: 'CAPSLOCK', // MISSING
	escape: 'ESCAPE', // MISSING
	pageUp: 'PAGE UP', // MISSING
	pageDown: 'PAGE DOWN', // MISSING
	end: 'END', // MISSING
	home: 'HOME', // MISSING
	leftArrow: 'LEFT ARROW', // MISSING
	upArrow: 'UP ARROW', // MISSING
	rightArrow: 'RIGHT ARROW', // MISSING
	downArrow: 'DOWN ARROW', // MISSING
	insert: 'INSERT', // MISSING
	'delete': 'DELETE', // MISSING
	leftWindowKey: 'LEFT WINDOW KEY', // MISSING
	rightWindowKey: 'RIGHT WINDOW KEY', // MISSING
	selectKey: 'SELECT KEY', // MISSING
	numpad0: 'NUMPAD 0', // MISSING
	numpad1: 'NUMPAD 1', // MISSING
	numpad2: 'NUMPAD 2', // MISSING
	numpad3: 'NUMPAD 3', // MISSING
	numpad4: 'NUMPAD 4', // MISSING
	numpad5: 'NUMPAD 5', // MISSING
	numpad6: 'NUMPAD 6', // MISSING
	numpad7: 'NUMPAD 7', // MISSING
	numpad8: 'NUMPAD 8', // MISSING
	numpad9: 'NUMPAD 9', // MISSING
	multiply: 'MULTIPLY', // MISSING
	add: 'ADD', // MISSING
	subtract: 'SUBTRACT', // MISSING
	decimalPoint: 'DECIMAL POINT', // MISSING
	divide: 'DIVIDE', // MISSING
	f1: 'F1', // MISSING
	f2: 'F2', // MISSING
	f3: 'F3', // MISSING
	f4: 'F4', // MISSING
	f5: 'F5', // MISSING
	f6: 'F6', // MISSING
	f7: 'F7', // MISSING
	f8: 'F8', // MISSING
	f9: 'F9', // MISSING
	f10: 'F10', // MISSING
	f11: 'F11', // MISSING
	f12: 'F12', // MISSING
	numLock: 'NUM LOCK', // MISSING
	scrollLock: 'SCROLL LOCK', // MISSING
	semiColon: 'SEMI-COLON', // MISSING
	equalSign: 'EQUAL SIGN', // MISSING
	comma: 'COMMA', // MISSING
	dash: 'DASH', // MISSING
	period: 'PERIOD', // MISSING
	forwardSlash: 'FORWARD SLASH', // MISSING
	graveAccent: 'GRAVE ACCENT', // MISSING
	openBracket: 'OPEN BRACKET', // MISSING
	backSlash: 'BACK SLASH', // MISSING
	closeBracket: 'CLOSE BRACKET', // MISSING
	singleQuote: 'SINGLE QUOTE' // MISSING
} );

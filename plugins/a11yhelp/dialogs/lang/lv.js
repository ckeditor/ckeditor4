/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'lv', {
	title: 'Pieejamības instrukcija',
	contents: 'Palīdzības saturs. Lai aizvērtu ciet šo dialogu nospiediet ESC.',
	legend: [
		{
		name: 'Galvenais',
		items: [
			{
			name: 'Redaktora rīkjosla',
			legend: 'Nospiediet ${toolbarFocus} lai pārvietotos uz rīkjoslu. Lai pārvietotos uz nākošo vai iepriekšējo rīkjoslas grupu izmantojiet pogu TAB un SHIFT+TAB.  Lai pārvietotos uz nākošo vai iepriekšējo rīkjoslas pogu izmantojiet Kreiso vai Labo bultiņu. Nospiediet Atstarpi vai ENTER lai aktivizētu rīkjosla pogu.'
		},

			{
			name: 'Redaktora dialoga  logs',
			legend: 'Dialoga logā nospiediet pogu TAB lai pārvietotos uz nākošo dialoga loga lauku, nospiediet SHIFT+TAB lai atgrieztos iepriekšējā laukā, nospiediet ENTER lai apstiprinātu dialoga datus, nospiediet ESC lai aizvērtu šo dialogu. Dialogam kuram ir vairākas cilnes, nospiediet ALT+F10 lai pārvietotos uz nepieciešamo cilni.  Lai pārvietotos uz nākošo cilni izmantojiet pogu TAB vai Labo bultiņu. Lai pārvietotos uz iepriekšējo cilni nospiediet SHIFT+TAB vai kreiso bultiņu. Nospiediet SPACE vai ENTER lai izvēlētos lapas cilni.'
		},

			{
			name: 'Redaktora satura izvēle',
			legend: 'Nospiediet ${contextMenu} vai APPLICATION KEY lai atvērtu satura izvēlni. Lai pārvietotos uz nākošo izvēlnes opciju izmantojiet pogu TAB vai pogu Bultiņu uz leju. Lai pārvietotos uz iepriekšējo opciju izmantojiet  SHIFT+TAB vai pogu Bultiņa uz augšu. Nospiediet SPACE vai ENTER lai izvelētos izvēlnes opciju. Atveriet tekošajā opcija apakšizvēlni ar SAPCE vai ENTER ka ari to var izdarīt ar Labo bultiņu. Lai atgrieztos atpakaļ uz sakuma izvēlni nospiediet ESC vai Kreiso bultiņu. Lai aizvērtu ciet izvēlnes saturu nospiediet ESC.'
		},

			{
			name: 'Redaktora saraksta lauks',
			legend: 'Saraksta laukā, lai pārvietotos uz nākošo saraksta elementu nospiediet TAB vai pogu Bultiņa uz leju. Lai pārvietotos uz iepriekšējo saraksta elementu nospiediet SHIFT+TAB vai pogu Bultiņa uz augšu. Nospiediet SPACE vai ENTER lai izvēlētos saraksta opcijas. Nospiediet ESC lai aizvērtu saraksta lauku. '
		},

			{
			name: 'Redaktora elementa ceļa josla',
			legend: 'Nospiediet ${elementsPathFocus} lai pārvietotos uz  elementa ceļa joslu. Lai pārvietotos uz nākošo elementa pogu izmantojiet TAB vai Labo bultiņu. Lai pārvietotos uz iepriekšējo elementa pogu  izmantojiet SHIFT + TAB vai Kreiso bultiņu. Nospiediet SPACE vai ENTER lai izvēlētos elementu redaktorā.'
		}
		]
	},
		{
		name: 'Komandas',
		items: [
			{
			name: 'Komanda atcelt darbību',
			legend: 'Nospiediet ${undo}'
		},
			{
			name: 'Komanda atkārtot darbību',
			legend: 'Nospiediet ${redo}'
		},
			{
			name: 'Treknraksta komanda',
			legend: 'Nospiediet ${bold}'
		},
			{
			name: 'Kursīva komanda',
			legend: 'Nospiediet ${italic}'
		},
			{
			name: 'Apakšsvītras komanda ',
			legend: 'Nospiediet ${underline}'
		},
			{
			name: 'Hipersaites komanda',
			legend: 'Nospiediet ${link}'
		},
			{
			name: 'Rīkjoslas aizvēršanas komanda',
			legend: 'Nospiediet ${toolbarCollapse}'
		},
			{
			name: 'Piekļūt iepriekšējai fokusa vietas komandai',
			legend: 'Nospiediet ${accessPreviousSpace} lai piekļūtu tuvākajai nepieejamajai fokusa vietai pirms kursora. Piemēram: diviem blakus esošiem līnijas HR elementiem. Atkārtojiet taustiņu kombināciju lai piekļūtu pie tālākām vietām.'
		},
			{
			name: 'Piekļūt nākošā fokusa apgabala komandai',
			legend: 'Nospiediet ${accessNextSpace} lai piekļūtu tuvākajai nepieejamajai fokusa vietai pēc kursora. Piemēram: diviem blakus esošiem līnijas HR elementiem. Atkārtojiet taustiņu kombināciju lai piekļūtu pie tālākām vietām.'
		},
			{
			name: 'Pieejamības palīdzība',
			legend: 'Nospiediet ${a11yHelp}'
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

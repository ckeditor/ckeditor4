/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
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
			legend: 'Nospiediet ${toolbarFocus} lai pārvietotos uz rīkjoslu. Lai pārvietotos uz nākošo vai iepriekšējo rīkjoslas grupu izmantojiet pogu TAB un SHIFT+TAB. Lai pārvietotos uz nākošo vai iepriekšējo rīkjoslas pogu izmantojiet Kreiso vai Labo bultiņu. Nospiediet Atstarpi vai ENTER lai aktivizētu rīkjosla pogu.'
		},

			{
			name: 'Redaktora dialoga  logs',
			legend:
				'Inside a dialog, press TAB to navigate to the next dialog element, press SHIFT+TAB to move to the previous dialog element, press ENTER to submit the dialog, press ESC to cancel the dialog. When a dialog has multiple tabs, the tab list can be reached either with ALT+F10 or with TAB as part of the dialog tabbing order. With tab list focused, move to the next and previous tab with RIGHT and LEFT ARROW, respectively. Press ESC to discard changes and close the dialog. The focus will be moved back to the editing area upon leaving the dialog.'  // MISSING
		},

			{
			name: 'Redaktora satura izvēle',
			legend: 'Nospiediet ${contextMenu} vai APPLICATION KEY lai atvērtu satura izvēlni. Lai pārvietotos uz nākošo izvēlnes opciju izmantojiet pogu TAB vai pogu Bultiņu uz leju. Lai pārvietotos uz iepriekšējo opciju izmantojiet  SHIFT+TAB vai pogu Bultiņa uz augšu. Nospiediet SPACE vai ENTER lai izvelētos izvēlnes opciju. Atveriet tekošajā opcija apakšizvēlni ar SAPCE vai ENTER ka ari to var izdarīt ar Labo bultiņu. Lai atgrieztos atpakaļ uz sakuma izvēlni nospiediet ESC vai Kreiso bultiņu. Lai aizvērtu ciet izvēlnes saturu nospiediet ESC.'
		},

			{
			name: 'Redaktora saraksta lauks',
			legend: 'Saraksta laukā, lai pārvietotos uz nākošo saraksta elementu nospiediet TAB vai pogu Bultiņa uz leju. Lai pārvietotos uz iepriekšējo saraksta elementu nospiediet SHIFT+TAB vai pogu Bultiņa uz augšu. Nospiediet SPACE vai ENTER lai izvēlētos saraksta opcijas. Nospiediet ESC lai aizvērtu saraksta lauku.'
		},

			{
			name: 'Redaktora elementa ceļa josla',
			legend: 'Nospiediet ${elementsPathFocus} lai pārvietotos uz elementa ceļa joslu. Lai pārvietotos uz nākošo elementa pogu izmantojiet TAB vai Labo bultiņu. Lai pārvietotos uz iepriekšējo elementa pogu izmantojiet SHIFT+TAB vai Kreiso bultiņu. Nospiediet SPACE vai ENTER lai izvēlētos elementu redaktorā.'
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
			name: 'Saites komanda',
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
		},
			{
			name: ' Paste as plain text', // MISSING
			legend: 'Press ${pastetext}', // MISSING
			legendEdge: 'Press ${pastetext}, followed by ${paste}' // MISSING
		}
		]
	}
	],
	tab: 'Tab', // MISSING
	pause: 'Pause', // MISSING
	capslock: 'Caps Lock', // MISSING
	escape: 'Escape', // MISSING
	pageUp: 'Page Up', // MISSING
	pageDown: 'Page Down', // MISSING
	leftArrow: 'Left Arrow', // MISSING
	upArrow: 'Up Arrow', // MISSING
	rightArrow: 'Right Arrow', // MISSING
	downArrow: 'Down Arrow', // MISSING
	insert: 'Insert', // MISSING
	leftWindowKey: 'Left Windows key', // MISSING
	rightWindowKey: 'Right Windows key', // MISSING
	selectKey: 'Select key', // MISSING
	numpad0: 'Numpad 0', // MISSING
	numpad1: 'Numpad 1', // MISSING
	numpad2: 'Numpad 2', // MISSING
	numpad3: 'Numpad 3', // MISSING
	numpad4: 'Numpad 4', // MISSING
	numpad5: 'Numpad 5', // MISSING
	numpad6: 'Numpad 6', // MISSING
	numpad7: 'Numpad 7', // MISSING
	numpad8: 'Numpad 8', // MISSING
	numpad9: 'Numpad 9', // MISSING
	multiply: 'Multiply', // MISSING
	add: 'Add', // MISSING
	subtract: 'Subtract', // MISSING
	decimalPoint: 'Decimal Point', // MISSING
	divide: 'Divide', // MISSING
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
	numLock: 'Num Lock', // MISSING
	scrollLock: 'Scroll Lock', // MISSING
	semiColon: 'Semicolon', // MISSING
	equalSign: 'Equal Sign', // MISSING
	comma: 'Comma', // MISSING
	dash: 'Dash', // MISSING
	period: 'Period', // MISSING
	forwardSlash: 'Forward Slash', // MISSING
	graveAccent: 'Grave Accent', // MISSING
	openBracket: 'Open Bracket', // MISSING
	backSlash: 'Backslash', // MISSING
	closeBracket: 'Close Bracket', // MISSING
	singleQuote: 'Single Quote' // MISSING
} );

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'fr-ca', {
	title: 'Instructions d\'accessibilité',
	contents: 'Contenu de l\'aide.  Pour fermer cette fenêtre, appuyez sur ESC.',
	legend: [
		{
		name: 'Général',
		items: [
			{
			name: 'Barre d\'outil de l\'éditeur',
			legend: 'Appuyer sur ${toolbarFocus} pour accéder à la barre d\'outils. Se déplacer vers les groupes suivant ou précédent de la barre d\'outil avec les touches TAB et SHIFT+TAB. Se déplacer vers les boutons suivant ou précédent de la barre d\'outils avec les touches FLECHE DROITE et FLECHE GAUCHE. Appuyer sur la barre d\'espace ou la touche ENTRER pour activer le bouton de barre d\'outils.'
		},

			{
			name: 'Dialogue de l\'éditeur',
			legend:
				'Inside a dialog, press TAB to navigate to the next dialog element, press SHIFT+TAB to move to the previous dialog element, press ENTER to submit the dialog, press ESC to cancel the dialog. When a dialog has multiple tabs, the tab list can be reached either with ALT+F10 or with TAB as part of the dialog tabbing order. With tab list focused, move to the next and previous tab with RIGHT and LEFT ARROW, respectively. Press ESC to discard changes and close the dialog. The focus will be moved back to the editing area upon leaving the dialog.'  // MISSING
		},

			{
			name: 'Menu contextuel de l\'éditeur',
			legend: 'Appuyer sur ${contextMenu} ou entrer le RACCOURCI CLAVIER pour ouvrir le menu contextuel. Puis se déplacer vers l\'option suivante du menu avec les touches TAB ou FLECHE BAS. Se déplacer vers l\'option précédente avec les touches SHIFT+TAB ou FLECHE HAUT. appuyer sur la BARRE D\'ESPACE ou la touche ENTREE pour sélectionner l\'option du menu. Oovrir le sous-menu de l\'option courante avec la BARRE D\'ESPACE ou les touches ENTREE ou FLECHE DROITE. Revenir à l\'élément de menu parent avec les touches ESC ou FLECHE GAUCHE. Fermer le menu contextuel avec ESC.'
		},

			{
			name: 'Menu déroulant de l\'éditeur',
			legend: 'A l\'intérieur d\'une liste en menu déroulant, se déplacer vers l\'élément suivant de la liste avec les touches TAB ou FLECHE BAS. Se déplacer vers l\'élément précédent de la liste avec les touches SHIFT+TAB ou FLECHE HAUT. Appuyer sur la BARRE D\'ESPACE ou sur ENTREE pour sélectionner l\'option dans la liste. Appuyer sur ESC pour fermer le menu déroulant.'
		},

			{
			name: 'Barre d\'emplacement des éléments de l\'éditeur',
			legend: 'Appuyer sur ${elementsPathFocus} pour naviguer vers la barre d\'emplacement des éléments de léditeur. Se déplacer vers le bouton d\'élément suivant avec les touches TAB ou FLECHE DROITE. Se déplacer vers le bouton d\'élément précédent avec les touches SHIFT+TAB ou FLECHE GAUCHE. Appuyer sur la BARRE D\'ESPACE ou sur ENTREE pour sélectionner l\'élément dans l\'éditeur.'
		}
		]
	},
		{
		name: 'Commandes',
		items: [
			{
			name: 'Annuler',
			legend: 'Appuyer sur ${undo}'
		},
			{
			name: 'Refaire',
			legend: 'Appuyer sur ${redo}'
		},
			{
			name: 'Gras',
			legend: 'Appuyer sur ${bold}'
		},
			{
			name: 'Italique',
			legend: 'Appuyer sur ${italic}'
		},
			{
			name: 'Souligné',
			legend: 'Appuyer sur ${underline}'
		},
			{
			name: 'Lien',
			legend: 'Appuyer sur ${link}'
		},
			{
			name: 'Enrouler la barre d\'outils',
			legend: 'Appuyer sur ${toolbarCollapse}'
		},
			{
			name: 'Accéder à l\'objet de focus précédent',
			legend: 'Appuyer ${accessPreviousSpace} pour accéder au prochain espace disponible avant le curseur, par exemple: deux éléments HR adjacents.  Répéter la combinaison pour joindre les éléments d\'espaces distantes.'
		},
			{
			name: 'Accéder au prochain objet de focus',
			legend: 'Appuyer ${accessNextSpace} pour accéder au prochain espace disponible après le curseur, par exemple: deux éléments HR adjacents.  Répéter la combinaison pour joindre les éléments d\'espaces distantes.'
		},
			{
			name: 'Aide d\'accessibilité',
			legend: 'Appuyer sur ${a11yHelp}'
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

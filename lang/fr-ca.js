/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Canadian French language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'fr-ca' ] = {
	// ARIA description.
	editor: 'Éditeur de texte enrichi',
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Appuyez sur 0 pour de l\'aide',

		browseServer: 'Parcourir le serveur',
		url: 'URL',
		protocol: 'Protocole',
		upload: 'Envoyer',
		uploadSubmit: 'Envoyer au serveur',
		image: 'Image',
		flash: 'Animation Flash',
		form: 'Formulaire',
		checkbox: 'Case à cocher',
		radio: 'Bouton radio',
		textField: 'Champ texte',
		textarea: 'Zone de texte',
		hiddenField: 'Champ caché',
		button: 'Bouton',
		select: 'Liste déroulante',
		imageButton: 'Bouton image',
		notSet: '<Par défaut>',
		id: 'Id',
		name: 'Nom',
		langDir: 'Sens d\'écriture',
		langDirLtr: 'De gauche à droite (LTR)',
		langDirRtl: 'De droite à gauche (RTL)',
		langCode: 'Code langue',
		longDescr: 'URL de description longue',
		cssClass: 'Classes CSS',
		advisoryTitle: 'Titre',
		cssStyle: 'Style',
		ok: 'OK',
		cancel: 'Annuler',
		close: 'Fermer',
		preview: 'Aperçu',
		resize: 'Redimensionner',
		generalTab: 'Général',
		advancedTab: 'Avancé',
		validateNumberFailed: 'Cette valeur n\'est pas un nombre.',
		confirmNewPage: 'Les changements non sauvegardés seront perdus. Êtes-vous certain de vouloir charger une nouvelle page?',
		confirmCancel: 'Certaines options ont été modifiées.  Êtes-vous certain de vouloir fermer?',
		options: 'Options',
		target: 'Cible',
		targetNew: 'Nouvelle fenêtre (_blank)',
		targetTop: 'Fenêtre supérieur (_top)',
		targetSelf: 'Cette fenêtre (_self)',
		targetParent: 'Fenêtre parent (_parent)',
		langDirLTR: 'De gauche à droite (LTR)',
		langDirRTL: 'De droite à gauche (RTL)',
		styles: 'Style',
		cssClasses: 'Classe CSS',
		width: 'Largeur',
		height: 'Hauteur',
		align: 'Alignement',
		left: 'Gauche',
		right: 'Droite',
		center: 'Centré',
		justify: 'Justifié',
		alignLeft: 'Aligner à gauche',
		alignRight: 'Aligner à Droite',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Haut',
		alignMiddle: 'Milieu',
		alignBottom: 'Bas',
		alignNone: 'None', // MISSING
		invalidValue: 'Valeur invalide.',
		invalidHeight: 'La hauteur doit être un nombre.',
		invalidWidth: 'La largeur doit être un nombre.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'La valeur spécifiée pour le champ "%1" doit être un nombre positif avec ou sans unité de mesure CSS valide (px, %, in, cm, mm, em, ex, pt, ou pc).',
		invalidHtmlLength: 'La valeur spécifiée pour le champ "%1" doit être un nombre positif avec ou sans unité de mesure HTML valide (px ou %).',
		invalidInlineStyle: 'La valeur spécifiée pour le style intégré doit être composée d\'un ou plusieurs couples de valeur au format "nom : valeur", separés par des points-virgules.',
		cssLengthTooltip: 'Entrer un nombre pour la valeur en pixel ou un nombre avec une unité CSS valide (px, %, in, cm, mm, em, ex, pt, ou pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, indisponible</span>',

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

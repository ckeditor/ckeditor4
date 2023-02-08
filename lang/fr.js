/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * French language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'fr' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Éditeur de texte enrichi',
	editorPanel: 'Tableau de bord de l\'éditeur de texte enrichi',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Utilisez le raccourci Alt-0 pour obtenir de l\'aide',

		browseServer: 'Parcourir le serveur',
		url: 'URL',
		protocol: 'Protocole',
		upload: 'Télécharger',
		uploadSubmit: 'Envoyer sur le serveur',
		image: 'Image',
		form: 'Formulaire',
		checkbox: 'Case à cocher',
		radio: 'Bouton radio',
		textField: 'Champ texte',
		textarea: 'Zone de texte',
		hiddenField: 'Champ invisible',
		button: 'Bouton',
		select: 'Liste déroulante',
		imageButton: 'Bouton avec image',
		notSet: '<indéfini>',
		id: 'ID',
		name: 'Nom',
		langDir: 'Sens d\'écriture',
		langDirLtr: 'Gauche à droite (LTR)',
		langDirRtl: 'Droite à gauche (RTL)',
		langCode: 'Code de langue',
		longDescr: 'URL de description longue',
		cssClass: 'Classes de style',
		advisoryTitle: 'Infobulle',
		cssStyle: 'Style',
		ok: 'OK',
		cancel: 'Annuler',
		close: 'Fermer',
		preview: 'Aperçu',
		resize: 'Redimensionner',
		generalTab: 'Général',
		advancedTab: 'Avancé',
		validateNumberFailed: 'Cette valeur n\'est pas un nombre.',
		confirmNewPage: 'Les changements non sauvegardés seront perdus. Êtes-vous sûr de vouloir charger une nouvelle page ?',
		confirmCancel: 'Certaines options ont été modifiées. Êtes-vous sûr de vouloir fermer ?',
		options: 'Options',
		target: 'Cible',
		targetNew: 'Nouvelle fenêtre (_blank)',
		targetTop: 'Fenêtre supérieure (_top)',
		targetSelf: 'Même fenêtre (_self)',
		targetParent: 'Fenêtre parent (_parent)',
		langDirLTR: 'Gauche à droite (LTR)',
		langDirRTL: 'Droite à gauche (RTL)',
		styles: 'Style',
		cssClasses: 'Classes de style',
		width: 'Largeur',
		height: 'Hauteur',
		align: 'Alignement',
		left: 'Gauche',
		right: 'Droite',
		center: 'Centrer',
		justify: 'Justifier',
		alignLeft: 'Aligner à gauche',
		alignRight: 'Aligner à droite',
		alignCenter: 'Aligner au centre',
		alignTop: 'Haut',
		alignMiddle: 'Milieu',
		alignBottom: 'Bas',
		alignNone: 'Aucun',
		invalidValue: 'Valeur invalide.',
		invalidHeight: 'La hauteur doit être un nombre.',
		invalidWidth: 'La largeur doit être un nombre.',
		invalidLength: 'La valeur de "%1" doit être un nombre positif avec ou sans unité de mesure (%2).',
		invalidCssLength: 'La valeur spécifiée pour le champ « %1 » doit être un nombre positif avec ou sans unité de mesure CSS valide (px, %, in, cm, mm, em, ex, pt, ou pc).',
		invalidHtmlLength: 'La valeur spécifiée pour le champ « %1 » doit être un nombre positif avec ou sans unité de mesure HTML valide (px ou %).',
		invalidInlineStyle: 'La valeur spécifiée pour le style en ligne doit être composée d\'un ou plusieurs couples au format « nom : valeur », séparés par des points-virgules.',
		cssLengthTooltip: 'Entrer un nombre pour une valeur en pixels ou un nombre avec une unité de mesure CSS valide (px, %, in, cm, mm, em, ex, pt, ou pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, indisponible</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Retour arrière',
			13: 'Entrée',
			16: 'Majuscule',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Espace',
			35: 'Fin',
			36: 'Origine',
			46: 'Supprimer',
			112: 'F1',
			113: 'F2',
			114: 'F3',
			115: 'F4',
			116: 'F5',
			117: 'F6',
			118: 'F7',
			119: 'F8',
			120: 'F9',
			121: 'F10',
			122: 'F11',
			123: 'F12',
			124: 'F13',
			125: 'F14',
			126: 'F15',
			127: 'F16',
			128: 'F17',
			129: 'F18',
			130: 'F19',
			131: 'F20',
			132: 'F21',
			133: 'F22',
			134: 'F23',
			135: 'F24',
			224: 'Commande'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Raccourci clavier',

		optionDefault: 'Par défaut'
	}
};

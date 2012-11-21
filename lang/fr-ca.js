/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
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
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Rich Text Editor', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Prem ALT 0 per obtenir ajuda',

		browseServer: 'Parcourir le serveur',
		url: 'URL',
		protocol: 'Protocole',
		upload: 'Télécharger',
		uploadSubmit: 'Envoyer sur le serveur',
		image: 'Image',
		flash: 'Animation Flash',
		form: 'Formulaire',
		checkbox: 'Case à cocher',
		radio: 'Bouton radio',
		textField: 'Champ texte',
		textarea: 'Zone de texte',
		hiddenField: 'Champ caché',
		button: 'Bouton',
		select: 'Champ de sélection',
		imageButton: 'Bouton image',
		notSet: '<Par défaut>',
		id: 'Id',
		name: 'Nom',
		langDir: 'Sens d\'écriture',
		langDirLtr: 'De gauche à droite (LTR)',
		langDirRtl: 'De droite à gauche (RTL)',
		langCode: 'Code langue',
		longDescr: 'URL de description longue',
		cssClass: 'Classes de feuilles de style',
		advisoryTitle: 'Titre',
		cssStyle: 'Style',
		ok: 'OK',
		cancel: 'Annuler',
		close: 'Close', // MISSING
		preview: 'Previsualiser',
		resize: 'Resize', // MISSING
		generalTab: 'Général',
		advancedTab: 'Avancée',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING
		options: 'Options', // MISSING
		target: 'Destination',
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'De gauche à droite (LTR)',
		langDirRTL: 'De droite à gauche (RTL)',
		styles: 'Style',
		cssClasses: 'Classes de feuilles de style',
		width: 'Largeur',
		height: 'Hauteur',
		align: 'Alignement',
		alignLeft: 'Gauche',
		alignRight: 'Droite',
		alignCenter: 'Centré',
		alignTop: 'Haut',
		alignMiddle: 'Milieu',
		alignBottom: 'Bas',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'Height must be a number.', // MISSING
		invalidWidth: 'Width must be a number.', // MISSING
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	}
};

/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Galician language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'gl' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Editor de texto enriquecido',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Prema ALT 0 para obter axuda',

		browseServer: 'Ver servidor',
		url: 'URL',
		protocol: 'Protocolo',
		upload: 'Cargar',
		uploadSubmit: 'Enviar ao servidor',
		image: 'Imaxe',
		flash: 'Flash',
		form: 'Formulario',
		checkbox: 'Campo de verificación',
		radio: 'Botón de radio',
		textField: 'Campo de texto',
		textarea: 'Área de texto',
		hiddenField: 'Campo oculto',
		button: 'Botón',
		select: 'Campo de selección',
		imageButton: 'Botón de imaxe',
		notSet: '<non definido>',
		id: 'Id',
		name: 'Nome',
		langDir: 'Orientación do idioma',
		langDirLtr: 'Esquerda a dereita (LTR)',
		langDirRtl: 'Dereita a esquerda (RTL)',
		langCode: 'Código do idioma',
		longDescr: 'Descrición completa da URL',
		cssClass: 'Clases da folla de estilos',
		advisoryTitle: 'Título',
		cssStyle: 'Estilo',
		ok: 'OK',
		cancel: 'Cancelar',
		close: 'Pechar',
		preview: 'Previsualizar',
		resize: 'Redimensionar',
		generalTab: 'Xeral',
		advancedTab: 'Advanzado',
		validateNumberFailed: 'Este valor non é un número.',
		confirmNewPage: 'Calquera cambio que non gardara neste contido perderase.\r\nEstá seguro que quere cargar a nova páxina?',
		confirmCancel: 'Algunhas das opcións foron cambiadas.\r\nEsta seguro que quere pechar o diálogo??',
		options: 'Opcións',
		target: 'Obxectivo',
		targetNew: 'Nova xaneal (_blank)',
		targetTop: 'Xanela principal (_top)',
		targetSelf: 'Mesma xanela (_self)',
		targetParent: 'Xanela superior (_parent)',
		langDirLTR: 'Esquerda a dereita (LTR)',
		langDirRTL: 'Dereita a esquerda (RTL)',
		styles: 'Estilo',
		cssClasses: 'Clases da folla de estilos',
		width: 'Ancho',
		height: 'Alto',
		align: 'Aliñamento',
		alignLeft: 'Esquerda',
		alignRight: 'Dereita',
		alignCenter: 'Centro',
		alignTop: 'Arriba',
		alignMiddle: 'Centro',
		alignBottom: 'Pé',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'O alto debe ser un número.',
		invalidWidth: 'O ancho debe ser un número.',
		invalidCssLength: 'O valor especificado para o campo "%1" debe ser un número positivo con ou sen unha unidade medida CSS válida (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'O valor especificado para o campo "%1" debe ser un número positivo con ou sen unha unidade de medida HTML válidoa (px or %).',
		invalidInlineStyle: 'O valor especificado no estilo en liña debe consistir nunha ou máis tuplas co formato "nome : valor", separadas por punto e coma.',
		cssLengthTooltip: 'Escriba un número para o valor en píxeles ou un número con unha unidade CSS válida (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, non dispoñíbel</span>'
	}
};

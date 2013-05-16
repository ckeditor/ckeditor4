/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Portuguese language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'pt' ] = {
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
		editorHelp: 'Press ALT 0 for help', // MISSING

		browseServer: 'Navegar no Servidor',
		url: 'URL',
		protocol: 'Protocolo',
		upload: 'Carregar',
		uploadSubmit: 'Enviar para o Servidor',
		image: 'Imagem',
		flash: 'Flash',
		form: 'Formulário',
		checkbox: 'Caixa de Verificação',
		radio: 'Botão de Opção',
		textField: 'Campo de Texto',
		textarea: 'Área de Texto',
		hiddenField: 'Campo Escondido',
		button: 'Botão',
		select: 'Caixa de Combinação',
		imageButton: 'Botão de Imagem',
		notSet: '<Não definido>',
		id: 'Id',
		name: 'Nome',
		langDir: 'Orientação de idioma',
		langDirLtr: 'Esquerda à Direita (LTR)',
		langDirRtl: 'Direita a Esquerda (RTL)',
		langCode: 'Código de Idioma',
		longDescr: 'Descrição Completa do URL',
		cssClass: 'Classes de Estilo de Folhas Classes',
		advisoryTitle: 'Título',
		cssStyle: 'Estilo',
		ok: 'OK',
		cancel: 'Cancelar',
		close: 'Fechar',
		preview: 'Pré-visualização',
		resize: 'Arraste para redimensionar',
		generalTab: 'Geral',
		advancedTab: 'Avançado',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING
		options: 'Opções',
		target: 'Alvo',
		targetNew: 'Nova Janela (_blank)',
		targetTop: 'Janela superior (_top)',
		targetSelf: 'Mesma janela (_self)',
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'Esquerda à Direita (LTR)',
		langDirRTL: 'Direita para Esquerda (RTL)',
		styles: 'Estilo',
		cssClasses: 'Classes de Estilo de Folhas Classes',
		width: 'Largura',
		height: 'Altura',
		align: 'Alinhamento',
		alignLeft: 'Esquerda',
		alignRight: 'Direita',
		alignCenter: 'Centrado',
		alignTop: 'Topo',
		alignMiddle: 'Centro',
		alignBottom: 'Fundo',
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

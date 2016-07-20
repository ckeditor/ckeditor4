/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
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
	// ARIA description.
	editor: 'Editor de texto enriquecido',
	editorPanel: 'Painel do editor de texto enriquecido',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Pressione ALT+0 para ajuda',

		browseServer: 'Navegar no servidor',
		url: 'URL',
		protocol: 'Protocolo',
		upload: 'Carregar',
		uploadSubmit: 'Enviar para o servidor',
		image: 'Imagem',
		flash: 'Flash',
		form: 'Formulário',
		checkbox: 'Caixa de verificação',
		radio: 'Botão',
		textField: 'Campo de texto',
		textarea: 'Área de texto',
		hiddenField: 'Campo oculto',
		button: 'Botão',
		select: 'Campo de seleção',
		imageButton: 'Botão da imagem',
		notSet: '<Não definido>',
		id: 'ID',
		name: 'Nome',
		langDir: 'Direção do idioma',
		langDirLtr: 'Esquerda para a Direita (EPD)',
		langDirRtl: 'Direita para a Esquerda (DPE)',
		langCode: 'Código do idioma',
		longDescr: 'Descrição completa do URL',
		cssClass: 'Classes de estilo das folhas',
		advisoryTitle: 'Título consultivo',
		cssStyle: 'Estilo',
		ok: 'CONFIRMAR',
		cancel: 'Cancelar',
		close: 'Fechar',
		preview: 'Pré-visualização',
		resize: 'Redimensionar',
		generalTab: 'Geral',
		advancedTab: 'Avançado',
		validateNumberFailed: 'Este valor não é um numero.',
		confirmNewPage: 'Irão ser perdidas quaisquer alterações não guardadas. Tem a certeza que deseja carregar a nova página?',
		confirmCancel: 'Foram alteradas algumas das opções. Tem a certeza que deseja fechar a janela?',
		options: 'Opções',
		target: 'Destino',
		targetNew: 'Nova Janela (_blank)',
		targetTop: 'Janela superior (_top)',
		targetSelf: 'Mesma Janela (_self)',
		targetParent: 'Janela dependente (_parent)',
		langDirLTR: 'Esquerda para a Direita (EPD)',
		langDirRTL: 'Direita para a Esquerda (DPE)',
		styles: 'Estilo',
		cssClasses: 'Classes de folhas de estilo',
		width: 'Largura',
		height: 'Altura',
		align: 'Alinhamento',
		alignLeft: 'Esquerda',
		alignRight: 'Direita',
		alignCenter: 'Centrado',
		alignJustify: 'Justificado',
		alignTop: 'Topo',
		alignMiddle: 'Centro',
		alignBottom: 'Base',
		alignNone: 'Nenhum',
		invalidValue	: 'Valor inválido.',
		invalidHeight: 'A altura deve ser um número.',
		invalidWidth: 'A largura deve ser um número. ',
		invalidCssLength: 'O valor especificado para o campo "1%" deve ser um número positivo, com ou sem uma unidade de medida CSS válida (px, %, in, cm, mm, em, ex, pt, ou pc).',
		invalidHtmlLength: 'O valor especificado para o campo "1%" deve ser um número positivo, com ou sem uma unidade de medida HTML válida (px ou %).',
		invalidInlineStyle: 'O valor especificado para o estilo em linha deve constituir um ou mais conjuntos de valores com o formato de "nome : valor", separados por ponto e vírgula.',
		cssLengthTooltip: 'Insira um número para um valor em pontos ou um número com uma unidade CSS válida (px, %, in, cm, mm, em, ex, pt, ou pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, indisponível</span>'
	}
};

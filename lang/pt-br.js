/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
* @fileOverview
*/

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'pt-br' ] = {
	// ARIA description.
	application: 'Editor de Rich Text',
	editor: 'Editor',
	editorPanel: 'Painel do editor de Rich Text',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Pressione ALT+0 para ajuda',

		browseServer: 'Localizar no Servidor',
		url: 'URL',
		protocol: 'Protocolo',
		upload: 'Enviar ao Servidor',
		uploadSubmit: 'Enviar para o Servidor',
		image: 'Imagem',
		form: 'Formulário',
		checkbox: 'Caixa de Seleção',
		radio: 'Botão de Opção',
		textField: 'Caixa de Texto',
		textarea: 'Área de Texto',
		hiddenField: 'Campo Oculto',
		button: 'Botão',
		select: 'Caixa de Listagem',
		imageButton: 'Botão de Imagem',
		notSet: '<não ajustado>',
		id: 'Id',
		name: 'Nome',
		langDir: 'Direção do idioma',
		langDirLtr: 'Esquerda para Direita (LTR)',
		langDirRtl: 'Direita para Esquerda (RTL)',
		langCode: 'Idioma',
		longDescr: 'Descrição da URL',
		cssClass: 'Classe de CSS',
		advisoryTitle: 'Título',
		cssStyle: 'Estilos',
		ok: 'OK',
		cancel: 'Cancelar',
		close: 'Fechar',
		preview: 'Visualizar',
		resize: 'Arraste para redimensionar',
		generalTab: 'Geral',
		advancedTab: 'Avançado',
		validateNumberFailed: 'Este valor não é um número.',
		confirmNewPage: 'Todas as mudanças não salvas serão perdidas. Tem certeza de que quer abrir uma nova página?',
		confirmCancel: 'Algumas opções foram alteradas. Tem certeza de que quer fechar a caixa de diálogo?',
		options: 'Opções',
		target: 'Destino',
		targetNew: 'Nova Janela (_blank)',
		targetTop: 'Janela de Cima (_top)',
		targetSelf: 'Mesma Janela (_self)',
		targetParent: 'Janela Pai (_parent)',
		langDirLTR: 'Esquerda para Direita (LTR)',
		langDirRTL: 'Direita para Esquerda (RTL)',
		styles: 'Estilo',
		cssClasses: 'Classes',
		width: 'Largura',
		height: 'Altura',
		align: 'Alinhamento',
		left: 'Esquerda',
		right: 'Direita',
		center: 'Centralizado',
		justify: 'Justificar',
		alignLeft: 'Alinhar Esquerda',
		alignRight: 'Alinhar Direita',
		alignCenter: 'Centralizar',
		alignTop: 'Superior',
		alignMiddle: 'Centralizado',
		alignBottom: 'Inferior',
		alignNone: 'Nenhum',
		invalidValue: 'Valor inválido.',
		invalidHeight: 'A altura tem que ser um número',
		invalidWidth: 'A largura tem que ser um número.',
		invalidLength: 'Valor especifico para o campo "%1" deve ser um número positivo com ou sem uma unidade mensurável (%2) válida.',
		invalidCssLength: 'O valor do campo "%1" deve ser um número positivo opcionalmente seguido por uma válida unidade de medida de CSS (px, %, in, cm, mm, em, ex, pt ou pc).',
		invalidHtmlLength: 'O valor do campo "%1" deve ser um número positivo opcionalmente seguido por uma válida unidade de medida de HTML (px ou %).',
		invalidInlineStyle: 'O valor válido para estilo deve conter uma ou mais tuplas no formato "nome : valor", separados por ponto e vírgula.',
		cssLengthTooltip: 'Insira um número para valor em pixels ou um número seguido de uma válida unidade de medida de CSS (px, %, in, cm, mm, em, ex, pt ou pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, indisponível</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Tecla Retroceder',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Tecla Espaço',
			35: 'End',
			36: 'Home',
			46: 'Delete',
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
			224: 'Comando'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Atalho do teclado',

		optionDefault: 'Padrão'
	}
};

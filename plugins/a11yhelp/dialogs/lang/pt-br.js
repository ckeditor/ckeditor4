/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'pt-br', {
	title: 'Instruções de Acessibilidade',
	contents: 'Conteúdo da Ajuda. Para fechar este diálogo pressione ESC.',
	legend: [
		{
		name: 'Geral',
		items: [
			{
			name: 'Barra de Ferramentas do Editor',
			legend: 'Pressione ${toolbarFocus} para navegar para a barra de ferramentas. Mova para o anterior ou próximo grupo de ferramentas com TAB e SHIFT-TAB. Mova para o anterior ou próximo botão com SETA PARA DIREITA or SETA PARA ESQUERDA. Pressione ESPAÇO ou ENTER para ativar o botão da barra de ferramentas.'
		},

			{
			name: 'Diálogo do Editor',
			legend: 'Dentro de um diálogo, pressione TAB para navegar para o próximo campo, pressione SHIFT + TAB para mover para o campo anterior, pressione ENTER para enviar o diálogo, pressione ESC para cancelar o diálogo. Para diálogos que tem múltiplas abas, pressione ALT + F10 para navegar para a lista de abas, então mova para a próxima aba com SHIFT + TAB ou SETA PARA ESQUERDA. Pressione ESPAÇO ou ENTER para selecionar a aba.'
		},

			{
			name: 'Menu de Contexto do Editor',
			legend: 'Pressione ${contextMenu} ou TECLA DE MENU para abrir o menu de contexto, então mova para a próxima opção com TAB ou SETA PARA BAIXO. Mova para a anterior com SHIFT+TAB ou SETA PARA CIMA. Pressione ESPAÇO ou ENTER para selecionar a opção do menu. Abra o submenu da opção atual com ESPAÇO ou ENTER ou SETA PARA DIREITA. Volte para o menu pai com ESC ou SETA PARA ESQUERDA. Feche o menu de contexto com ESC.'
		},

			{
			name: 'Caixa de Lista do Editor',
			legend: 'Dentro de uma caixa de lista, mova para o próximo item com TAB ou SETA PARA BAIXO. Mova para o item anterior com SHIFT + TAB ou SETA PARA CIMA. Pressione ESPAÇO ou ENTER para selecionar uma opção na lista. Pressione ESC para fechar a caixa de lista.'
		},

			{
			name: 'Barra de Caminho do Elementos do Editor',
			legend: 'Pressione ${elementsPathFocus} para a barra de caminho dos elementos. Mova para o próximo botão de elemento com TAB ou SETA PARA DIREITA. Mova para o botão anterior com  SHIFT+TAB ou SETA PARA ESQUERDA. Pressione ESPAÇO ou ENTER para selecionar o elemento no editor.'
		}
		]
	},
		{
		name: 'Comandos',
		items: [
			{
			name: ' Comando Desfazer',
			legend: 'Pressione ${undo}'
		},
			{
			name: ' Comando Refazer',
			legend: 'Pressione ${redo}'
		},
			{
			name: ' Comando Negrito',
			legend: 'Pressione ${bold}'
		},
			{
			name: ' Comando Itálico',
			legend: 'Pressione ${italic}'
		},
			{
			name: ' Comando Sublinhado',
			legend: 'Pressione ${underline}'
		},
			{
			name: ' Comando Link',
			legend: 'Pressione ${link}'
		},
			{
			name: ' Comando Fechar Barra de Ferramentas',
			legend: 'Pressione ${toolbarCollapse}'
		},
			{
			name: 'Acessar o comando anterior de spaço de foco',
			legend: 'Pressione ${accessNextSpace} para acessar o espaço de foco não alcançável mais próximo antes do cursor, por exemplo: dois elementos HR adjacentes. Repita a combinação de teclas para alcançar espaços de foco distantes.'
		},
			{
			name: 'Acessar próximo fomando de spaço de foco',
			legend: 'Pressione ${accessNextSpace} para acessar o espaço de foco não alcançável mais próximo após o cursor, por exemplo: dois elementos HR adjacentes. Repita a combinação de teclas para alcançar espaços de foco distantes.'
		},
			{
			name: ' Ajuda de Acessibilidade',
			legend: 'Pressione ${a11yHelp}'
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

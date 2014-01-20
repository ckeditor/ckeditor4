/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'pt', {
	title: 'Instruções de Acessibilidade',
	contents: 'Conteúdos da Ajuda. Pressione em \'ESC\' para fechar esta janela.',
	legend: [
		{
		name: 'Geral',
		items: [
			{
			name: 'Barra de Ferramentas do Editor',
			legend: 'Clique em ${toolbarFocus} para navegar para a barra de ferramentas. Vá para o grupo da barra de ferramentas anterior e seguinte com TAB e SHIFT+TAB. Vá para o botão da barra de ferramentas anterior com a SETA DIREITA ou ESQUERDA. Pressione ESPAÇO ou ENTER para ativar o botão da barra de ferramentas.'
		},

			{
			name: 'Janela do Editor',
			legend: 'Dentro de uma janela, pressione TAB para navigar para o campo da janela seguinte, pressione SHIFT + TAB para mover para o campo anterior, pressione ENTER para submeter a janela, pressione ESC para cancelar a janela. Para as janelas que têm múltiplos páginas com separadores, pressione ALT + F10 para navegar para a lista do separador. Depois mova para o seguinte separador com TAB ou SETA DIREITA. Mover para o separador anterior com SHIFT + TAB ou SETA ESQUERDA. Pressione ESPAÇO ou ENTER para selecionar o separador da página.'
		},

			{
			name: 'Menu de Contexto do Editor',
			legend: 'Clique em ${contextMenu} ou TECLA APLICAÇÃO para abrir o menu de contexto. Depois vá para a opção do menu seguinte com TAB ou SETA PARA BAIXO. Vá para a opção anterior com  SHIFT+TAB ou SETA PARA CIMA. Pressione ESPAÇO ou ENTER para selecionar a opção do menu.  Abra o submenu da opção atual com ESPAÇO, ENTER ou SETA DIREITA. GVá para o item do menu parente  com ESC ou SETA ESQUERDA. Feche o menu de contexto com ESC.'
		},

			{
			name: 'Caixa Lista Editor',
			legend: 'Dentro da caixa da lista, vá para o itemda lista seguinte com TAB ou SETA PARA BAIXO. Move Vá parao item da lista anterior com SHIFT+TAB ou SETA PARA BAIXO. Pressione ESPAÇO ou ENTER para selecionar a opção da lista. Pressione ESC para fechar a caisa da lista.'
		},

			{
			name: 'Caminho Barra Elemento Editor',
			legend: 'Clique em ${elementsPathFocus} para navegar para a barra do caminho dos elementos. Vá para o botão do elemento seguinte com TAB ou SETA DIREITA. Vá para o botão anterior com   SHIFT+TAB ou SETA ESQUERDA. Pressione ESPAÇO ou ENTER para selecionar o elemento no editor.'
		}
		]
	},
		{
		name: 'Comandos',
		items: [
			{
			name: 'Comando de Anular',
			legend: 'Pressione ${undo}'
		},
			{
			name: 'Comando de Refazer',
			legend: 'Pressione ${redo}'
		},
			{
			name: 'Comando de Negrito',
			legend: 'Pressione ${bold}'
		},
			{
			name: 'Comando de Itálico',
			legend: 'Pressione ${italic}'
		},
			{
			name: 'Comando de Sublinhado',
			legend: 'Pressione ${underline}'
		},
			{
			name: 'Comando de Hiperligação',
			legend: 'Pressione ${link}'
		},
			{
			name: 'Comando de Ocultar Barra de Ferramentas',
			legend: 'Pressione ${toolbarCollapse}'
		},
			{
			name: 'Acesso comando do espaço focus anterior',
			legend: 'Clique em ${accessPreviousSpace} para aceder ao espaço do focos inalcançável mais perto antes do sinal de omissão, por exemplo: dois elementos HR adjacentes. Repetir a combinação da chave para alcançar os espaços dos focos distantes.'
		},
			{
			name: 'Acesso comando do espaço focus seguinte',
			legend: 'Pressione ${accessNextSpace} para aceder ao espaço do focos inalcançável mais perto depois do sinal de omissão, por exemplo: dois elementos HR adjacentes. Repetir a combinação da chave para alcançar os espaços dos focos distantes.'
		},
			{
			name: 'Ajuda de Acessibilidade',
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

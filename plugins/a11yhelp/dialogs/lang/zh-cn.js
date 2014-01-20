/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'zh-cn', {
	title: '辅助功能说明',
	contents: '帮助内容。要关闭此对话框请按 ESC 键。',
	legend: [
		{
		name: '常规',
		items: [
			{
			name: '编辑器工具栏',
			legend: '按 ${toolbarFocus} 导航到工具栏，使用 TAB 键和 SHIFT+TAB 组合键移动到上一个和下一个工具栏组。使用左右箭头键移动到上一个和下一个工具栏按钮。按空格键或回车键以选中工具栏按钮。'
		},

			{
			name: '编辑器对话框',
			legend: '在对话框内，TAB 键移动到下一个字段，SHIFT + TAB 组合键移动到上一个字段，ENTER 键提交对话框，ESC 键取消对话框。对于有多选项卡的对话框，用ALT + F10来移到选项卡列表。然后用 TAB 键或者向右箭头来移动到下一个选项卡；SHIFT + TAB 组合键或者向左箭头移动到上一个选项卡。用 SPACE 键或者 ENTER 键选择选项卡。'
		},

			{
			name: '编辑器上下文菜单',
			legend: '用 ${contextMenu} 或者“应用程序键”打开上下文菜单。然后用 TAB 键或者下箭头键来移动到下一个菜单项；SHIFT + TAB 组合键或者上箭头键移动到上一个菜单项。用 SPACE 键或者 ENTER 键选择菜单项。用 SPACE 键，ENTER 键或者右箭头键打开子菜单。返回菜单用 ESC 键或者左箭头键。用 ESC 键关闭上下文菜单。'
		},

			{
			name: '编辑器列表框',
			legend: '在列表框中，移到下一列表项用 TAB 键或者下箭头键。移到上一列表项用SHIFT + TAB 组合键或者上箭头键，用 SPACE 键或者 ENTER 键选择列表项。用 ESC 键收起列表框。'
		},

			{
			name: '编辑器元素路径栏',
			legend: '按 ${elementsPathFocus} 以导航到元素路径栏，使用 TAB 键或右箭头键选择下一个元素，使用 SHIFT+TAB 组合键或左箭头键选择上一个元素，按空格键或回车键以选定编辑器里的元素。'
		}
		]
	},
		{
		name: '命令',
		items: [
			{
			name: ' 撤消命令',
			legend: '按 ${undo}'
		},
			{
			name: ' 重做命令',
			legend: '按 ${redo}'
		},
			{
			name: ' 加粗命令',
			legend: '按 ${bold}'
		},
			{
			name: ' 倾斜命令',
			legend: '按 ${italic}'
		},
			{
			name: ' 下划线命令',
			legend: '按 ${underline}'
		},
			{
			name: ' 链接命令',
			legend: '按 ${link}'
		},
			{
			name: ' 工具栏折叠命令',
			legend: '按 ${toolbarCollapse}'
		},
			{
			name: '访问前一个焦点区域的命令',
			legend: '按 ${accessPreviousSpace} 访问^符号前最近的不可访问的焦点区域，例如：两个相邻的 HR 元素。重复此组合按键可以到达远处的焦点区域。'
		},
			{
			name: '访问下一个焦点区域命令',
			legend: '按 ${accessNextSpace} 以访问^符号后最近的不可访问的焦点区域。例如：两个相邻的 HR 元素。重复此组合按键可以到达远处的焦点区域。'
		},
			{
			name: '辅助功能帮助',
			legend: '按 ${a11yHelp}'
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

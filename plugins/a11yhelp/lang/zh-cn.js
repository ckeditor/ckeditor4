/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.setLang( 'a11yhelp', 'zh-cn', {
	accessibilityHelp: {
		title: '辅助说明',
		contents: '帮助内容。要关闭此对话框请按 ESC 键。',
		legend: [
			{
			name: '常规',
			items: [
				{
				name: '编辑器工具栏',
				legend: '按 ${toolbarFocus} 以导航到工具栏，使用 TAB 键或 SHIFT+TAB 组合键以选择工具栏组，使用左右箭头键以选择按钮，按空格键或回车键以应用选中的按钮。'
			},

				{
				name: '编辑器对话框',
				legend: 'Inside a dialog, press TAB to navigate to next dialog field, press SHIFT + TAB to move to previous field, press ENTER to submit dialog, press ESC to cancel dialog. For dialogs that have multiple tab pages, press ALT + F10 to navigate to tab-list. Then move to next tab with TAB OR RIGTH ARROW. Move to previous tab with SHIFT + TAB or LEFT ARROW. Press SPACE or ENTER to select the tab page.' // MISSING
			},

				{
				name: '编辑器上下文菜单',
				legend: 'Press ${contextMenu} or APPLICATION KEY to open context-menu. Then move to next menu option with TAB or DOWN ARROW. Move to previous option with SHIFT+TAB or UP ARROW. Press SPACE or ENTER to select the menu option. Open sub-menu of current option with SPACE or ENTER or RIGHT ARROW. Go back to parent menu item with ESC or LEFT ARROW. Close context menu with ESC.' // MISSING
			},

				{
				name: '编辑器列表框',
				legend: 'Inside a list-box, move to next list item with TAB OR DOWN ARROW. Move to previous list item with SHIFT + TAB or UP ARROW. Press SPACE or ENTER to select the list option. Press ESC to close the list-box.' // MISSING
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
				name: ' 无障碍设计说明',
				legend: '按 ${a11yHelp}'
			}
			]
		}
		]
	}
});

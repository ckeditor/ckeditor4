/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.setLang( 'a11yhelp', 'fa', {
	accessibilityHelp: {
		title: 'دستورالعمل‌های دسترسی',
		contents: 'راهنمای فهرست مطالب. برای بستن این کادر محاوره‌ای ESC را فشار دهید.',
		legend: [
			{
			name: 'عمومی',
			items: [
				{
				name: 'نوار ابزار ویرایشگر',
				legend: 'Press ${toolbarFocus} to navigate to the toolbar. Move to the next and previous toolbar group with TAB and SHIFT-TAB. Move to the next and previous toolbar button with RIGHT ARROW or LEFT ARROW. Press SPACE or ENTER to activate the toolbar button.' // MISSING
			},

				{
				name: 'پنجره محاوره‌ای ویرایشگر',
				legend: 'Inside a dialog, press TAB to navigate to next dialog field, press SHIFT + TAB to move to previous field, press ENTER to submit dialog, press ESC to cancel dialog. For dialogs that have multiple tab pages, press ALT + F10 to navigate to tab-list. Then move to next tab with TAB OR RIGTH ARROW. Move to previous tab with SHIFT + TAB or LEFT ARROW. Press SPACE or ENTER to select the tab page.' // MISSING
			},

				{
				name: 'منوی متنی ویرایشگر',
				legend: 'Press ${contextMenu} or APPLICATION KEY to open context-menu. Then move to next menu option with TAB or DOWN ARROW. Move to previous option with  SHIFT+TAB or UP ARROW. Press SPACE or ENTER to select the menu option. Open sub-menu of current option wtih SPACE or ENTER or RIGHT ARROW. Go back to parent menu item with ESC or LEFT ARROW. Close context menu with ESC.' // MISSING
			},

				{
				name: 'جعبه فهرست ویرایشگر',
				legend: 'Inside a list-box, move to next list item with TAB OR DOWN ARROW. Move to previous list item with SHIFT + TAB or UP ARROW. Press SPACE or ENTER to select the list option. Press ESC to close the list-box.' // MISSING
			},

				{
				name: 'Editor Element Path Bar', // MISSING
				legend: 'Press ${elementsPathFocus} to navigate to the elements path bar. Move to next element button with TAB or RIGHT ARROW. Move to previous button with  SHIFT+TAB or LEFT ARROW. Press SPACE or ENTER to select the element in editor.' // MISSING
			}
			]
		},
			{
			name: 'فرمان‌ها',
			items: [
				{
				name: 'بازگشت فرمان',
				legend: 'فشردن ${undo}'
			},
				{
				name: 'انجام مجدد فرمان',
				legend: 'فشردن ${redo}'
			},
				{
				name: 'فرمان متن درشت',
				legend: 'فشردن ${bold}'
			},
				{
				name: 'فرمان متن کج',
				legend: 'فشردن ${italic}'
			},
				{
				name: 'فرمان متن زیرخط‌دار',
				legend: 'فشردن ${underline}'
			},
				{
				name: 'فرمان پیوند',
				legend: 'فشردن ${link}'
			},
				{
				name: 'بستن نوار ابزار فرمان',
				legend: 'فشردن ${toolbarCollapse}'
			},
				{
				name: 'راهنمای دسترسی',
				legend: 'فشردن ${a11yHelp}'
			}
			]
		}
		]
	}
});

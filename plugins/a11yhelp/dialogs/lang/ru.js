/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'ru', {
	title: 'Горячие клавиши',
	contents: 'Помощь. Для закрытия этого окна нажмите ESC.',
	legend: [
		{
		name: 'Основное',
		items: [
			{
			name: 'Панель инструментов',
			legend: 'Нажмите ${toolbarFocus} для перехода к панели инструментов. Для перемещения между группами панели инструментов используйте TAB и SHIFT-TAB. Для перемещения между кнопками панели иструментов используйте кнопки ВПРАВО или ВЛЕВО. Нажмите ПРОБЕЛ или ENTER для запуска кнопки панели инструментов.'
		},

			{
			name: 'Диалоги',
			legend: 'В диалоговом окне, нажмите клавишу TAB для перехода к следующему диалоговому полю, нажмите клавиши SHIFT + TAB, чтобы перейти к предыдущему полю, нажмите ENTER, чтобы отправить данные, нажмите клавишу ESC, для отмены. Для окон, которые имеют несколько вкладок, нажмите ALT + F10 для перехода к списку вкладок. Переход к следующей вкладке TAB ИЛИ ПРАВУЮ СТРЕЛКУ. Переход к предыдущей вкладке с помощью SHIFT + TAB или ЛЕВАЯ СТРЕЛКА. Нажмите ПРОБЕЛ или ENTER, чтобы выбрать вкладку.'
		},

			{
			name: 'Контекстное меню',
			legend: 'Нажмите ${contextMenu} или клавишу APPLICATION, чтобы открыть контекстное меню. Затем перейдите к следующему пункту меню с помощью TAB или стрелкой "ВНИЗ". Переход к предыдущей опции - SHIFT+TAB или стрелкой "ВВЕРХ". Нажмите SPACE, или ENTER, чтобы задействовать опцию меню. Открыть подменю текущей опции - SPACE или ENTER или стрелкой "ВПРАВО". Возврат к родительскому пункту меню - ESC или стрелкой "ВЛЕВО". Закрытие контекстного меню - ESC.'
		},

			{
			name: 'Редактор списка',
			legend: 'Внутри окна списка, переход к следующему пункту списка - TAB или стрелкой "ВНИЗ". Переход к предыдущему пункту списка - SHIFT + TAB или стрелкой "ВВЕРХ". Нажмите SPACE, или ENTER, чтобы задействовать опцию списка. Нажмите ESC, чтобы закрыть окно списка.'
		},

			{
			name: 'Путь к элементу',
			legend: 'Нажмите ${elementsPathFocus}, чтобы перейти к панели пути элементов. Переход к следующей кнопке элемента - TAB или стрелкой "ВПРАВО". Переход к предыдущей кнопку - SHIFT+TAB или стрелкой "ВЛЕВО". Нажмите SPACE, или ENTER, чтобы выбрать элемент в редакторе.'
		}
		]
	},
		{
		name: 'Команды',
		items: [
			{
			name: 'Отменить',
			legend: 'Нажмите ${undo}'
		},
			{
			name: 'Повторить',
			legend: 'Нажмите ${redo}'
		},
			{
			name: 'Полужирный',
			legend: 'Нажмите ${bold}'
		},
			{
			name: 'Курсив',
			legend: 'Нажмите ${italic}'
		},
			{
			name: 'Подчеркнутый',
			legend: 'Нажмите ${underline}'
		},
			{
			name: 'Гиперссылка',
			legend: 'Нажмите ${link}'
		},
			{
			name: 'Свернуть панель инструментов',
			legend: 'Нажмите ${toolbarCollapse}'
		},
			{
			name: 'Команды доступа к предыдущему фокусному пространству',
			legend: 'Нажмите ${accessPreviousSpace}, чтобы обратиться к ближайшему недостижимому фокусному пространству перед символом "^", например: два смежных HR элемента. Повторите комбинацию клавиш, чтобы достичь отдаленных фокусных пространств.'
		},
			{
			name: 'Команды доступа к следующему фокусному пространству',
			legend: 'Press ${accessNextSpace} to access the closest unreachable focus space after the caret, for example: two adjacent HR elements. Repeat the key combination to reach distant focus spaces.'
		},
			{
			name: 'Справка по горячим клавишам',
			legend: 'Нажмите ${a11yHelp}'
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

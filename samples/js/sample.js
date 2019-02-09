/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* exported initSample */

if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
	CKEDITOR.tools.enableHtml5Elements( document );

// The trick to keep the editor in the sample quite small
// unless user specified own height.
//CKEDITOR.config.height = 150;
//CKEDITOR.config.width = 'auto';

var initSample = ( function() {
	return function() {
		var editorElement = CKEDITOR.document.getById( 'editor' );

		editorElement.setAttribute( 'contenteditable', 'true' );
		var editor = CKEDITOR.inline( 'editor', {
			stylesSet: [
				{ name : 'dasdf', element : 'p', styles: { 'color': 'red' } },
				{ name: 'My Div Class', element: 'div'}
      ],
      smartFields: [1,2,3,4,5,6,7,8,9,10].map(item => ({
        value: 'field-' + item,
        label: 'Custom field ' + item
      })),
			defaultStyles: {
				'font-size': '20pt',
        'font-weight': 'bold',
        'font-family': 'Lato'
			},
			//singleParagraphEdit: true,
			toolbar: [
				{name: 'font', items: ['Styles', 'Font', 'FontSize']},
				{name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'RemoveFormat']},
				{name: 'copyformatting', items: ['CopyFormatting']},
				{name: 'color', items: ['TextColor', 'BGColor']},
				{name: 'list', items: ['NumberedList', 'BulletedList']},
				{name: 'indent', items : ['Indent', 'Outdent']},
				{name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ]},
				{name: 'find', items: ['Find', 'Replace']},
				{name: 'insert', items: ['Table', 'base64image']},
				{name: 'pagebreak', items: ['PageBreak']},
        {name: 'placeholder', items: [
          'CreatePlaceholder',
          // 'CreateCpPlaceholder',
          'CreateAutoSequence'
        ]},
        {name: 'smartfields', items: ['smartfields']},
				{name: 'helpers', items: ['Undo', 'Redo']},
				{name: 'tabletools', items: ['tabledelete', 'tableproperties', 'tablerowinsertbefore',
					'tablerowinsertafter', 'tablerowdelete', 'tablecolumninsertbefore', 'tablecolumninsertafter',
					'tablecolumndelete', 'tablecellinsertbefore', 'tablecellinsertafter', 'tablecelldelete',
          'tablecellproperties', 'tablecellsmerge', 'tablecellmergedown', 'tablecellsplithorizontal', 'tablecellsplitvertical']},
			]
    } );

    editor.on('change', function() {
      // console.log('change', editor.getData())
    })
    
		// editor.on('lite:init', function(event) {
		// 	this._lite = event.data.lite;
		// 	this._lite.toggleTracking(true);
		// 	this._lite.toggleShow(props.showTracking); // enable tracking by default
		// });
	};
} )();

// %LEAVE_UNMINIFIED% %REMOVE_LINE%

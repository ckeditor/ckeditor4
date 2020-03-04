CKEDITOR.addCss(
	'.customwidget {' +
		'border: 2px dashed black;' +
		'padding: 0 15px;' +
		'background-color: #BBFFF0' +
	'}' +
	'.customwidget h2 {' +
		'margin-top: 15px;' +
		'font-size: 24px;' +
		'color: red;' +
		'font-weight: 700;' +
		'text-align: center;' +
	'}' +
	'.customwidget__instruction {' +
		'font-weight: 700;' +
		'margin-left: 30px;' +
	'}' +
	'.customwidget__title {' +
		'font-size: 20px;' +
		'text-align: center;' +
		'background-color: #ffffff;' +
	'}' +
	'.customwidget__content {' +
		'background-color: #ffffff;' +
	'}'
);

CKEDITOR.plugins.add( 'customwidget', {
	requires: 'widget',
	allowedContent: 'div',

	init: function( editor ) {
		editor.widgets.add( 'customwidget', {
			button: 'Create custom widget',
			template: '<div class="customwidget"><h2>Awesome widget!!!</h2><h3 class="customwidget__title">Type here some title</h3>' +
				'<p class="customwidget__instruction">Below is place to add some fancy text.</p><p class="customwidget__content">Type here something</p></div>',
			editables: {
				title: {
					selector: '.customwidget__title',
					allowedContent: 'br strong em'
				},
				content: {
					selector: '.customwidget__content',
					allowedContent: 'br strong em span{*}'
				}
			},
			allowedContent: 'div(!customwidget);h3(!customwidget__title);p(!customwidget__content);h2;p;',
			requiredContent: 'div(customwidget)',
			upcast: function( element ) {
				return element.name == 'div' && element.hasClass( 'customwidget' );
			}
		} );
	}
} );

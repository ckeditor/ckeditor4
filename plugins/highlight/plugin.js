CKEDITOR.config.allowedContent = true;
CKEDITOR.config.extraAllowedContent = 'span(highlight)';

CKEDITOR.addCss(".highlight {animation-name: highlight}");


CKEDITOR.plugins.add('highlight', {
	icons: 'about',
	lang: 'en',
	init: function(editor) {

		// Add button
		editor.ui.addButton('Highlight', {
			label: 'Insert Highlight',
			command: 'insertHighlight',
			toolbar: 'colors',
			icon: this.path + 'icons/highlight.svg'
		});

		var style = new CKEDITOR.style({
			name: 'highlight',
			element: 'span',
			attributes: {
				class: 'highlight'
			}
		});
		editor.addCommand( 'insertHighlight', new CKEDITOR.styleCommand( style ) );
		// Listen to style changes
		editor.attachStyleStateChange(style, function(state) {

			!editor.readOnly && editor.getCommand('insertHighlight').setState(state);

		});


	}

});

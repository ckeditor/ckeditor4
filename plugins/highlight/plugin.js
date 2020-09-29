CKEDITOR.config.extraPlugins = 'highlight';
CKEDITOR.config.allowedContent = true;
CKEDITOR.config.extraAllowedContent = 'span(highlight)';

CKEDITOR.plugins.add( 'highlight', {
    icons: 'about',
    lang: 'en',
    init: function( editor ) {
        editor.addCommand( 'insertHighlight', {
            exec: function( editor ) {
              var selected_text = editor.getSelection().getSelectedText(); // Get Text
              var newElement = new CKEDITOR.dom.element("span");           // Make Span
              newElement.setAttribute('class', 'highlight');               // Set Highlight class
              newElement.setText(selected_text);                           // Set text to element
              editor.insertElement(newElement);                            // Add Element
            }
        });
        editor.ui.addButton( 'Highlight', {
            label: 'Insert Highlight',
            command: 'insertHighlight',
            toolbar: 'colors',
            icon: this.path + 'icons/about.png'
        });
    }
});

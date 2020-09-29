CKEDITOR.config.allowedContent = true;
CKEDITOR.config.extraAllowedContent = 'span(highlight)';

CKEDITOR.plugins.add( 'highlight', {
    icons: 'about',
    lang: 'en',
    init: function( editor ) {
        editor.addCommand( 'insertHighlight', {
            exec: function( editor ) {
              var element = editor.getSelection().getStartElement().$;
              if(element.getAttribute('class') == "highlight") {
                // remove highlight (toggle)
                var selected_text = element.innerText; // Get Text
                var selected_html = element.innerHTML; // Get HTML
                editor.getSelection().getStartElement().remove(false)
                editor.insertText(selected_text)
              } else {
                var range = editor.getSelection().getRanges()[ 0 ];
                var newElement = new CKEDITOR.dom.element("span");           // Make Span
                newElement.setAttribute('class', 'highlight');               // Set Highlight class
                newElement.append( range.cloneContents() );                  // Set text to element
                editor.insertElement(newElement);                            // Add Element
              }
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

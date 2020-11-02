CKEDITOR.config.allowedContent = true;
CKEDITOR.config.extraAllowedContent = 'span(highlight)';

CKEDITOR.config.coreStyle = { name: 'highlight', element: 'span', attributes: { class: 'highlight' } };

CKEDITOR.addCss(
    '.highlight {' +
        'background-color: #DCDCDC;' +
    '}'
);
CKEDITOR.plugins.add( 'highlight', {
    icons: 'about',
    lang: 'en',
    init: function( editor ) {

        // OLD hand written way - lots of bugs (not recommended)
        // editor.addCommand( 'insertHighlight', {
        //     exec: function( editor ) {
        //       var element = editor.getSelection().getStartElement().$;
        //       var selection = editor.getSelection().getSelectedText();
        //       if(element.classList.contains('highlight')) {
        //         element.classList.remove('highlight');
        //       } else if(element.innerText == selection && element.tagName == "SPAN") {
        //         element.classList.add('highlight');
        //       } else {
        //         var range = editor.getSelection().getRanges()[ 0 ];
        //         var newElement = new CKEDITOR.dom.element("span");           // Make Span
        //         newElement.setAttribute('class', 'highlight');               // Set Highlight class
        //         newElement.append( range.cloneContents() );                  // Set text to element
        //         editor.insertElement(newElement);                            // Add Element
        //       }
        //     }
        // });

        // Add button
        editor.ui.addButton( 'Highlight', {
            label: 'Insert Highlight',
            command: 'insertHighlight',
            toolbar: 'colors',
            icon: this.path + 'icons/marker1.png'
        });

        // Listen to style changes
        var style = new CKEDITOR.style(CKEDITOR.config.coreStyle);
        editor.attachStyleStateChange( style, function( state ) {
          !editor.readOnly && editor.getCommand( 'insertHighlight' ).setState( state );
        } );

        // add class command
        var form = [
          [ 'span', function( el ) {
            el.classList.push('highlight');
            return el.classList.contains('highlight');
          } ]
        ];
        editor.addCommand( 'insertHighlight', new CKEDITOR.styleCommand( style, {
          contentForms: form
        } ) );
    }
});

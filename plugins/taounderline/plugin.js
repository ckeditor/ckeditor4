CKEDITOR.plugins.add('taounderline', {
    init: function(editor) {

        editor.addCommand('insertUnderline', {
            exec: function(editor) {
                editor.applyStyle(new CKEDITOR.style({
                    element : 'span',
                    attributes : { 'class' : 'txt-underline' }
                }));
            }
        });
        
        editor.ui.addButton('TaoUnderline', {
            label: 'Underline',
            command: 'insertUnderline',
            icon: this.path + 'images/taounderline.png'
        });
    }
});
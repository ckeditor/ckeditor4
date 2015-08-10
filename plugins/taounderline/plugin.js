CKEDITOR.plugins.add('taounderline', {
    init : function(editor){

        var commandName = 'spanUnderline',
            style = new CKEDITOR.style({
                element : 'span',
                attributes : {'class' : 'txt-underline'}
            }),
            forms = [
                'u',
                [
                    'span',
                    function(el){
                        return el.styles[ 'text-decoration' ] == 'underline';
                    }
                ]
            ];

        // Put the style as the most important form.
        forms.unshift(style);

        // Listen to contextual style activation.
        editor.attachStyleStateChange(style, function(state){
            !editor.readOnly && editor.getCommand(commandName).setState(state);
        });

        // Create the command that can be used to apply the style.
        editor.addCommand(commandName, new CKEDITOR.styleCommand(style, {
            contentForms : forms
        }));

        editor.ui.addButton('TaoUnderline', {
            label : 'Underline',
            command : commandName,
            icon : this.path + 'images/taounderline.png'
        });
    }
});
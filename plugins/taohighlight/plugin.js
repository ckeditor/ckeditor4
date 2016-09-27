CKEDITOR.plugins.add('taohighlight', {
    init : function(editor){
		'use strict';

        var commandName = 'spanHighlight';
        var style = new CKEDITOR.style({
			element : 'span',
			attributes : {'class' : 'txt-highlight'}
		});
        var forms = ['span'];

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

        editor.ui.addButton('TaoHighlight', {
            label : 'Highlight',
            command : commandName,
            icon : this.path + 'images/taohighlight.png'
        });
    }
});

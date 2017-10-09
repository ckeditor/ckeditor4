CKEDITOR.plugins.add('taoqtiprintedvariable', {
    init: function(editor) {

        editor.addCommand('insertQtiPrintedVariable', {
            exec: function(editor) {
                var config = editor.config.taoQtiItem;
                if(typeof(config.insert) === 'function'){
                    editor.insertHtml('<span data-new="true" data-qti-class="printedVariable" class="widget-box">&nbsp;</span>');
                    config.insert.call(editor);
                }
            }
        });

        editor.ui.addButton('TaoQtiPrintedVariable', {
            label: 'Insert Printed Variable',
            command: 'insertQtiPrintedVariable',
            icon: this.path + 'images/taoqtiprintedvariable.png'
        });
    }
});

CKEDITOR.plugins.add('taoqtiinclude', {
	lang: 'de,fr,nl',
    init: function(editor) {

        editor.addCommand('insertQtiInclude', {
            exec: function(editor) {
                var config = editor.config.taoQtiItem;
                if(typeof(config.insert) === 'function'){
                    editor.insertHtml('<span data-new="true" data-qti-class="include" class="widget-box">&nbsp;</span>');
                    config.insert.call(editor);
                }
            }
        });

        editor.ui.addButton('TaoQtiInclude', {
            label: editor.lang.insertQtiInclude.button,
            command: 'insertQtiInclude',
            icon: this.path + 'images/taoqtiimage.png'
        });
    }
});

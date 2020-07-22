CKEDITOR.plugins.add('taoqtiimage', {
    init: function(editor) {

        editor.addCommand('insertQtiImage', {
            exec: function(editor) {
                var config = editor.config.taoQtiItem;
                if(typeof(config.insert) === 'function'){
                    editor.insertHtml('<span data-new="true" data-qti-class="img" class="widget-box">&nbsp;</span>');
                    config.insert.call(editor);
                }
            }
        });

        editor.ui.addButton('TaoQtiImage', {
            label: editor.lang.insertQtiImage.button,
            command: 'insertQtiImage',
            icon: this.path + 'images/taoqtiimage.png'
        });
    }
});

CKEDITOR.plugins.add('taoqtimedia', {
    init: function(editor) {

        editor.addCommand('insertQtiMedia', {
            exec: function(editor) {
                var config = editor.config.taoQtiItem;
                if(typeof(config.insert) === 'function'){
                    editor.insertHtml('<span data-new="true" data-qti-class="object" class="widget-box">&nbsp;</span>');
                    config.insert.call(editor);
                }
            }
        });
        
        editor.ui.addButton('TaoQtiMedia', {
            label: 'Insert Media',
            command: 'insertQtiMedia',
            icon: this.path + 'images/taoqtimedia.png'
        });
    }
});
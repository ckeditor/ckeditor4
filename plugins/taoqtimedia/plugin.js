CKEDITOR.plugins.add('taoqtimedia', {
	lang: 'de,en,fr,nl',
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
            label: editor.lang.insertQtiMedia.button,
            command: 'insertQtiMedia',
            icon: this.path + 'images/taoqtimedia.png'
        });
    }
});

// Register the plugin with the editor.
// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.plugins.html


CKEDITOR.plugins.add('taomediamanager', {
    // The plugin initialization logic goes inside this method.
    // http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.pluginDefinition.html#init
    init: function (editor) {
        // Define an editor command that inserts a taomediamanager.
        // http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.editor.html#addCommand
        var resourceMgrDefaults = {
            params: {
                lang: 'en-US',
                filters: 'image/jpeg,image/png,image/gif'
            },
            pathParam: 'path',
            select: function (e, uris) {
                var i, l = uris.length;
                for (i = 0; i < l; i++) {
                    editor.insertHtml('<img src="' + uris[i] + '"/>')
                }
            }
        };


        editor.addCommand('insertMedia', {
            // Define a function that will be fired when the command is executed.
            // http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.commandDefinition.html#exec
            exec: function (editor) {
                // Insert the taomediamanager into the document.
                // http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.editor.html#insertHtml
                $('<div>').resourcemgr(_.defaults(editor.config.resourcemgr, resourceMgrDefaults));

            }
        });
        // Create a toolbar button that executes the plugin command.
        // http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.html#addButton
        editor.ui.addButton('TaoMediaManager', {
            // Toolbar button tooltip.
            label: 'Insert Media',
            // Reference to the plugin command name.
            command: 'insertMedia',
            // Button's icon file path.
            icon: this.path + 'images/taomediamanager.png'
        });
    }
});
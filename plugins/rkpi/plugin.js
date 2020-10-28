CKEDITOR.addCss(
    '[data-start-counter-class] {' +
        'position: relative;' +
    '}' +
    '[data-start-counter-class]:after {' +
        'content: "";' +
        'position: absolute;' +
        'bottom: 0px;' +
        'left: 0;' +
        'height: 1px;' +
        'width: 100%;' +
        'border-bottom: 2px dashed #000;' +
    '}'
);
CKEDITOR.plugins.add( 'rkpi', {
    icons: 'about',
    lang: 'en',
    init: function( editor ) {
        var dialog = CKEDITOR.dialog.add( 'rkpi', this.path + 'dialogs/rkpi.js' );
        var dialogCommand = editor.addCommand( 'openDialog', new CKEDITOR.dialogCommand( 'rkpi' ) );
        editor.ui.addButton( 'Running KPI', {
            label: 'Insert running KPI',
            command: 'openDialog',
            toolbar: 'basicstyles,100',
            icon: this.path + 'icons/rkpi4.png'
        });
    }
});

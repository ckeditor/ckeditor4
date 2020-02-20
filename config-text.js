CKEDITOR.editorConfig = function (config) {
    config.language = 'pl';
    config.menu_groups = '';
    config.plugins = [
        'button',
        'clipboard',
        'contextmenu',
        'dialog',
        'dialogui',
        'enterkey',
        'entities',
        'find',
        'floatpanel',
        'menu',
        'panel',
        'pastetext',
        'toolbar',
        'undo',
        'wysiwygarea',
        'ins_commands',
        'ins_emailquote',
        'ins_spellchecker'
    ].join(',');
    config.skin = 'moono';

    config.toolbar = 'Basic';
    config.toolbar_Basic = [
        { items: ['Undo', 'Redo'] },
        { items: ['Cut', 'Copy', 'PasteText'] },
        { items: ['Find', 'Replace'] },
        { items: ['ins_spellchecker'] }
    ];

    config.allowedContent = true;
    config.dialog_noConfirmCancel = true;
    config.forcePasteAsPlainText = true;
};
CKEDITOR.editorConfig = function (config) {
    config.language = 'pl';
    config.menu_groups = 'tablecell,tablecellproperties,tablerow,tablecolumn,table,link,image,div';
    config.plugins = [
        'basicstyles',
        'blockquote',
        'button',
        'clipboard',
        'colorbutton',
        'contextmenu',
        'dialog',
        'dialogui',
        'enterkey',
        'entities',
        'fakeobjects',
        'find',
        'floatingspace',
        'floatpanel',
        'font',
        'format',
        'justify',
        'menu',
        'panel',
        'panelbutton',
        'pastefromword',
        'pastetext',
        'richcombo',
        'showborders',
        'toolbar',
        'undo',
        'wysiwygarea',
        'ins_commands',
        'ins_emailquote',
        'ins_spellchecker'
    ].join(',');
    config.skin = 'moono';

    config.toolbar = 'Basic';
    config.canHideEnabled = true;
    config.removeDialogTabs = 'image:advanced;link:target;link:advanced';
    config.toolbar_Basic = [
        { items: ['Undo', 'Redo'], canHide: false },
        { items: ['Cut', 'Copy', 'Paste', 'PasteText'], canHide: false },
        { items: ['ins_spellchecker'], canHide: true },
        { items: ['Font'], canHide: false },
        { items: ['Bold', 'Italic', 'Underline'], canHide: false },
        { items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], canHide: false },
        { items: ['Find', 'Replace'], canHide: false }
    ];

    config.allowedContent = true;
    config.dialog_noConfirmCancel = true;
    config.forcePasteAsPlainText = false;
};
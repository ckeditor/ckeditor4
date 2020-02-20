CKEDITOR.editorConfig = function (config) {
    config.language = 'pl';
    config.menu_groups = 'tablecell,tablecellproperties,tablerow,tablecolumn,table,link,div';
    config.plugins = [
        'basicstyles',
        'blockquote',
        'button',
        'clipboard',
        'codemirror',
        'colorbutton',
        'colordialog',
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
        'indent',
        'indentblock',
        'indentlist',
        'justify',
        'link',
        'list',
        'listblock',
        'liststyle',
        'menu',
        'openlink',
        'panel',
        'panelbutton',
        'pastefromword',
        'pastetext',
        'removeformat',
        'richcombo',
        'showborders',
        'sourcedialog',
        'table',
        'tableresize',
        'tabletools',
        'toolbar',
        'undo',
        'wysiwygarea',
        'ins_commands',
        'ins_emailquote',
        'ins_spellchecker'
    ].join(',');
    config.skin = 'moono';

    config.title = false;
    config.toolbar = 'Basic';
    config.canHideEnabled = true;
    config.removeDialogTabs = 'image:advanced;link:target;link:advanced';
    config.toolbar_Basic = [
        { items: ['Undo', 'Redo'], canHide: false },
        { items: ['Cut', 'Copy', 'Paste', 'PasteText'], canHide: false },
        { items: ['Format'], canHide: true },
        { items: ['Font'], canHide: false },
        { items: ['FontSize'], canHide: false },
        { items: ['Bold', 'Italic', 'Underline'], canHide: false },
        { items: ['Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'], canHide: true },
        { items: ['TextColor', 'BGColor'], canHide: true },
        { items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], canHide: false },
        { items: ['Indent', 'Outdent'], canHide: true },
        { items: ['NumberedList', 'BulletedList'], canHide: false },
        { items: ['Table', 'Image', 'Link'], canHide: false },
        { items: ['Find', 'Replace'], canHide: true },
        { items: ['Sourcedialog'], canHide: false }
    ];

    config.allowedContent = true;
    config.dialog_noConfirmCancel = true;
    config.forcePasteAsPlainText = false;

    config.codemirror = {
        autoFormatOnStart: true,
        autoFormatOnModeChange: true
    };
};
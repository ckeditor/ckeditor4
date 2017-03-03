CKEDITOR.editorConfig = function ( config ) {
  config.height = 400;
  config.toolbar = [
    { name: 'heading',      items: [ 'Heading' ] },
    { name: 'list',         items: [ 'NumberedList', 'BulletedList', 'Indent', 'Outdent' ] },
    { name: 'link',         items: [ 'Link', 'Unlink', 'Anchor' ] },
    { name: 'misc1',        items: [ 'Image', 'Table', 'Language' ] },
    '/',
    { name: 'search',       items: [ 'Find', 'Replace' ] },
    { name: 'clipboard',    items: [ 'Cut', 'Copy', 'Paste', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
    { name: 'basicstyles',  items: [ 'Bold', 'Italic', 'RemoveFormat', 'Styles' ] },
    { name: 'misc2',        items: [ 'SpecialChar' ] }
  ];
  config.extraPlugins = 'heading';
};

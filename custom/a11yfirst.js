/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.editorConfig = function ( config ) {
  config.height = 480;
  config.skin = 'a11yfirst';
  config.startupFocus = true;

  // Standard plus a11ychecker, find, language, liststyle, showblocks,
  // minus format, stylescombo and two spell checkers (scayt and wsc)
  // minus filebrowser, horizontalrule, htmlwriter and maximize.
  // Note: When filebrowser is deselected, popup is automatically
  // removed, but does not need to be added back into the list.
  // Note: When format and stylescombo are deselected, listblock and
  // richcombo are automatically removed. They do need to be added
  // back into the list because a11yfirst plugins depend on them.
  config.plugins =
    'a11ychecker,' +
    'a11yhelp,' +
    'about,' +
    'balloonpanel,' +
    'basicstyles,' +
    'blockquote,' +
    'button,' +
    'clipboard,' +
    'contextmenu,' +
    'dialog,' +
    'dialogui,' +
    'elementspath,' +
    'enterkey,' +
    'entities,' +
    'fakeobjects,' +
    'filebrowser,' +
    'find,' +
    'floatingspace,' +
    'floatpanel,' +
    'horizontalrule,' +
    'htmlwriter,' +
    'image,' +
    'indent,' +
    'indentlist,' +
    'language,' +
    'link,' +
    'list,' +
    'listblock,' +
    'liststyle,' +
    'magicline,' +
    'maximize,' +
    'menu,' +
    'menubutton,' +
    'notification,' +
    'panel,' +
    'pastefromword,' +
    'pastetext,' +
    'popup,' +
    'removeformat,' +
    'resize,' +
    'richcombo,' +
    'showblocks,' +
    'showborders,' +
    'sourcearea,' +
    'specialchar,' +
    'tab,' +
    'table,' +
    'tableselection,' +
    'tabletools,' +
    'toolbar,' +
    'undo,' +
    'wysiwygarea';

  var standardMinusBasic =
    'elementspath,' +     // yes
    'filebrowser,' +      // no
    'horizontalrule,' +   // no
    'htmlwriter,' +       // no
    'magicline,' +        // yes
    'maximize,' +         // no
    'popup,' +            // no
    'resize,' +           // yes
    'showborders,' +      // yes
    'sourcearea,' +       // yes
    'tab,' +              // yes
    'tableselection,' +   // yes
    'tabletools';         // yes

  config.extraPlugins =
    'a11yfirsthelp,' +
    'a11yformat,' +
    'a11yheading,' +
    'a11ystylescombo';

  config.removePlugins =
    'filebrowser,' +
    'horizontalrule,' +
    'htmlwriter,' +
    'maximize,' +
    'popup';

  config.language_list = [
    'ar:Arabic:rtl',
    'zh:Chinese',
    'cs:Czech',
    'da:Danish',
    'nl:Dutch',
    'fi:Finnish',
    'fr:French',
    'gd:Gaelic',
    'de:German',
    'el:Greek',
    'he:Hebrew:rtl',
    'hi:Hindi',
    'hu:Hungarian',
    'id:Indonesian',
    'it:Italian',
    'ja:Japanese',
    'ko:Korean',
    'la:Latin',
    'no:Norwegian',
    'fa:Persian:rtl',
    'pl:Polish',
    'pt:Portuguese',
    'ru:Russian',
    'es:Spanish',
    'sv:Swedish',
    'th:Thai',
    'tr:Turkish',
    'vi:Vietnamese',
    'yi:Yiddish'
  ];

  config.toolbar = [
    { name: 'heading',        items: [ 'Heading' ] },
    { name: 'list',           items: [ 'NumberedList', 'BulletedList', 'Indent', 'Outdent' ] },
    { name: 'link',           items: [ 'Link', 'Unlink', 'Anchor' ] },
    { name: 'blockformat',    items: [ 'BlockFormat' ] },
    { name: 'blockquote',     items: [ 'Blockquote', 'ShowBlocks' ] },
    { name: 'paragraph',      items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    { name: 'misc1',          items: [ 'Image', 'Table' ] },
    { name: 'a11ychecker',    items: [ 'A11ychecker' ] },
    { name: 'a11yfirsthelp',  items: [ 'A11yFirstHelp'] },
    '/',
    { name: 'undoredo',       items: [ 'Undo', 'Redo'] },
    { name: 'clipboard',      items: [ 'Cut', 'Copy', 'Paste', 'PasteFromWord' ] },
    { name: 'search',         items: [ 'Find', 'Replace' ] },
    { name: 'basicstyles',    items: [ 'Bold', 'Italic'] },
    { name: 'removeformat',   items: [ 'RemoveFormat' ] },
    { name: 'inlinestyle',    items: [ 'InlineStyle' ] },
    { name: 'misc2',          items: [ 'Language', 'SpecialChar' ] }
  ];

};

CKEDITOR.stylesSet.add ( 'default', [
  { name: 'Strong',           element: 'strong', overrides: 'b' },
  { name: 'Emphasis',         element: 'em' , overrides: 'i' },
  { name: 'Marker',           element: 'span', attributes: { 'class': 'marker' } },
  { name: 'Inline quotation', element: 'q' },
  { name: 'Cited work',       element: 'cite' },
  { name: 'Computer code',    element: 'code' },
  { name: 'Subscript',        element: 'sub' },
  { name: 'Superscript',      element: 'sup' },
  { name: 'Deleted Text',     element: 'del' },
  { name: 'Inserted Text',    element: 'ins' },
  { name: 'Strikethrough',    element: 'strike' },
  { name: 'Underline',        element: 'u' }
] );

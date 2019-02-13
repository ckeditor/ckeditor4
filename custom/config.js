/**
* Copyright (c) 2018 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*
* DISTRIBUTION BUILD INSTRUCTIONS: Updated for v0.8.0
*
* To use the CKEditor Builder tool, start by selecting the Standard preset.
* Then add and remove plugins as specified in the three steps listed below.
*
* Note: When filebrowser, format, link and stylescombo are removed, their
* dependencies (popup, listblock, fakeobjects and richcombo) are also removed.
*
* 1. Add the following 7 plugins:
*
*    Balloon Panel          (balloonpanel)
*    Code Snippet           (codesnippet)
*    Find / Replace         (find)
*    Justify                (justify)
*    Language               (language)
*    List Style             (liststyle)
*    Show Blocks            (showblocks)
*
* 2. Remove the following 11 plugins:
*
*    File Browser           (filebrowser)
*    Floating Space         (floatingspace)
*    Format                 (format)
*    Horizontal Rule        (horizontalrule)
*    Image                  (image)
*    Link                   (link)
*    Maximize               (maximize)
*    SpellCheckAsYouType    (scayt)
*    Styles Combo           (stylescombo)
*    Upload Image           (uploadimage)
*    WebSpellChecker        (wsc)
*
* 3. Add the 3 a11yfirst plugin dependencies that were removed when the
*    Standard preset plugins format, link and stylescombo were removed:
*
*    Fake Objects           (fakeobjects)
*    List Block             (listblock)
*    Rich Combo             (richcombo)
*
* Note: To determine which plugins to include in our distribution, an analysis
* of the differences between the Basic and Standard presets was performed. The
* following are the additional plugins provided by Standard over Basic, with
* comments specifying whether to include each:
*
*    elementspath     // yes
*    filebrowser      // no
*    horizontalrule   // no
*    htmlwriter       // yes
*    magicline        // yes
*    maximize         // no
*    popup            // no
*    resize           // yes
*    showborders      // yes
*    sourcearea       // yes
*    tab              // yes
*    tableselection   // yes
*    tabletools       // yes
*/

CKEDITOR.editorConfig = function ( config ) {
  config.height = 480;
  config.skin = 'moono-lisa';
  config.startupFocus = true;

  config.plugins =
    'a11yhelp,' +
    'about,' +
    'balloonpanel,' +
    'basicstyles,' +
    'blockquote,' +
    'button,' +
    'clipboard,' +
    'codesnippet,' +
    'contextmenu,' +
    'dialog,' +
    'dialogui,' +
    'elementspath,' +
    'enterkey,' +
    'entities,' +
    'fakeobjects,' +
    'find,' +
    'floatpanel,' +
    'htmlwriter,' +
    'indent,' +
    'indentlist,' +
    'justify,' +
    'language,' +
    'list,' +
    'listblock,' +
    'liststyle,' +
    'magicline,' +
    'menu,' +
    'menubutton,' +
    'notification,' +
    'panel,' +
    'pastefromword,' +
    'pastetext,' +
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

  config.extraPlugins =
    'a11ychecker,' +
    'a11yfirsthelp,' +
    'a11yheading,' +
    'a11yimage,' +
    'a11ylink,' +
    'a11ystylescombo';

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
    { name: 'otherblocks',    items: [ 'Blockquote', 'CodeSnippet' ] },
    { name: 'justify',        items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight' ] },
    { name: 'misc1',          items: [ 'Image', 'Table' ] },
    { name: 'showblocks',     items: [ 'ShowBlocks' ] },
    { name: 'a11yfirsthelp',  items: [ 'A11yFirstHelp' ] },
//  { name: 'source',         items: [ 'Source' ] },
    '/',
    { name: 'undoredo',       items: [ 'Undo', 'Redo' ] },
    { name: 'clipboard',      items: [ 'Cut', 'Copy', 'Paste', 'PasteFromWord' ] },
    { name: 'search',         items: [ 'Find', 'Replace' ] },
    { name: 'basicstyles',    items: [ 'Bold', 'Italic' ] },
    { name: 'inlinestyle',    items: [ 'InlineStyle' ] },
    { name: 'removeformat',   items: [ 'RemoveFormat' ] },
    { name: 'link',           items: [ 'Link', 'Unlink', 'Anchor' ] },
    { name: 'misc2',          items: [ 'Language', 'SpecialChar' ] },
    { name: 'a11ychecker',    items: [ 'A11ychecker' ] }
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

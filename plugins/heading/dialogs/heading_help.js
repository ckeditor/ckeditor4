/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'headingHelp', function( editor ) {
  var lang = editor.lang.about;

  return {
    title: editor.lang.heading.helpLabel,
    minWidth: 500,
    minHeight: 300,
    contents: [
      {
        id: 'tab1',
        label: '',
        title: '',
        expand: true,
        padding: 0,
        elements: [
          {
            type: 'html',
            html: editor.lang.heading.helpContent
          }
        ]
      }
    ],

    buttons: [ CKEDITOR.dialog.cancelButton ]
  };
} );

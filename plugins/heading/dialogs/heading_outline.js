/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'headingOutline', function( editor ) {
  var lang = editor.lang.about;

  return {
    title: editor.lang.heading.outlineLabel,
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
            html: 'Heading Outline'
          }
        ]
      }
    ],

    buttons: [ CKEDITOR.dialog.cancelButton ]
  };
} );

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
    onShow: function( event ) {
      console.log(event.name + " " + event.sender._.name);

      var select = document.getElementById('headingOutlineSelect');

      select.innerHTML = "<option>Test 1</option><option>Test 2</option><option>Test 3</option>";

    },

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
          },
          {
            type: 'html',
            html: '<select id="headingOutlineSelect" size="18" style="width: 90%; border: thin #222 solid"></select>'            
          }
        ]
      }
    ],

    buttons: [ CKEDITOR.dialog.cancelButton ]
  };
} );

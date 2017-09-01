/**
 * @license Copyright (c) 2017, Illinois - Nicholas Hoyt and Jon Gunderson. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'blockformatHelp', function( editor ) {
  var lang = editor.lang.blockformat;

  return {
    title: lang.helpLabel,
    minWidth: 500,
    minHeight: 300,
    onShow: function(event) {

      function h2(content) {
        return '<h2 style="white-space: normal; font-weight: bold; margin-top: 0em; font-size: 135%">' + content + '</h2>';
      }

      function list(tag, list) {
        var html = '<' + tag + ' style="margin-top: 0.5em; padding-left: 1em;">';
        for (let i = 0; i < list.length; i++) {
          html += '<li style="white-space: normal; padding-bottom: 0.5em; font-size: 110%">' + list[i] + '</li>';
        }
        html += '</' + tag + '>';
        return html;
      }


      var node, html;

      node = document.getElementById('id_features');
      html = h2(lang.featuresTitle);
      html += list('ul', lang.featuresItems);
      node.innerHTML = html;

    },

    contents: [
        {
            id: 'blockformat_tab1',
            label: '',
            title: '',
            elements: [
                {
                    type: 'html',
                    html: '<div id="id_features"></div>'
                }
            ]
        }
    ],

    buttons: [ CKEDITOR.dialog.okButton ]
  };
} );

/**
 * @license Copyright (c) 2017, University of Illinois - Nicholas Hoyt and Jon Gunderson. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'A11yFirstGettingStarted', function( editor ) {
  var lang = editor.lang.a11yfirst;

  return {
    title: lang.toolbar,
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

      node = document.getElementById('id_importance');
      html = h2(lang.importanceTitle);
      html += list('ul', lang.importanceItems);
      node.innerHTML = html;

      node = document.getElementById('id_features');
      html = h2(lang.featuresTitle);
      html += list('ul', lang.featuresItems);
      node.innerHTML = html;
    },

    contents: [
      {
        id: 'getting_started_tab1',
        label: lang.importanceLabel,
        title: lang.importanceTitle,
        expand: true,
        padding: 0,
        elements: [
          {
            type: 'html',
            html: '<div><div id="id_importance"></div></div>'
          }
        ]
      },
      {
        id: 'getting_started_tab2',
        label: lang.featuresLabel,
        title: lang.featuresTitle,
        expand: true,
        padding: 0,
        elements: [
          {
            type: 'html',
            html: '<div><div id="id_features"></div></div>'
          }
        ]
      }
    ],

    buttons: [ CKEDITOR.dialog.okButton ]
  };
} );

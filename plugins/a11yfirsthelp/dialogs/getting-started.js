/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'a11yFirstGettingStarted', function( editor ) {
  var lang = editor.lang.a11yfirsthelp;

  return {
    title: lang.gettingStartedLabel,
    minWidth: 500,
    minHeight: 300,
    onShow: function(event) {

      function h2(content) {
        return '<h2 style="white-space: normal; font-weight: bold; margin-top: 1em; font-size: 135%">' + content + '</h2>';
      }

      function p(content) {
        return '<p style="white-space: normal; font-weight: normal; margin-top: 0.5em; font-size: 110%">' + content + '</p>';
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

      node = document.getElementById('a11yfirsthelp_getting_started_content');

      html = h2(lang.section1Heading);
      html += p(lang.section1Content);

      html += h2(lang.section2Heading);
      html += list('ul', lang.section2Content);

      html += h2(lang.section3Heading);
      html += list('ul', lang.section3Content);

      html += h2(lang.section4Heading);
      html += list('ul', lang.section4Content);

      node.innerHTML = html;

    },

    contents: [
      {
        id: 'tab1',
        label: lang.gettingStartedLabel,
        title: lang.gettingStartedTitle,
        expand: true,
        padding: 0,
        elements: [
          {
            type: 'html',
            html: '<div><div id="a11yfirsthelp_getting_started_content" style="height: 300px; overflow: auto">Tab 1</div></div>'
          }
        ]
      }
    ],

    buttons: [ CKEDITOR.dialog.okButton ]
  };
} );

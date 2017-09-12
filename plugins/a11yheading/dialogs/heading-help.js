/**
* Copyright (c) 2017 University of Illinois - Nicholas Hoyt and Jon Gunderson. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'headingHelp', function( editor ) {
  var lang = editor.lang.a11yheading;

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

      node = document.getElementById('tab_features');
      html = h2(lang.helpFeatureTitle);
      html += list('ul', lang.helpFeatureItems);
      node.innerHTML = html;

      node = document.getElementById('tab_rules');
      html = h2(lang.helpRuleTitle);
      html += list('ol', lang.helpRuleItems);
      node.innerHTML = html;

      node = document.getElementById('tab_importance');
      html = h2(lang.helpImportanceTitle);
      html += list('ul', lang.helpImportanceItems);
      node.innerHTML = html;

    },

    contents: [
      {
        id: 'tab1',
        label: lang.helpFeatureLabel,
        title: lang.helpFeatureTitle,
        expand: true,
        padding: 0,
        elements: [
          {
            type: 'html',
            html: '<div><div id="tab_features"></div></div>'
          }
        ]
      },
      {
        id: 'tab2',
        label: lang.helpRuleLabel,
        title: lang.helpRuleTitle,
        expand: true,
        padding: 0,
        elements: [
          {
            type: 'html',
            html: '<div><div id="tab_rules"></div></div>'
          }
        ]
      },
      {
        id: 'tab3',
        label: lang.helpImportanceLabel,
        title: lang.helpImportanceTitle,
        expand: true,
        padding: 0,
        elements: [
          {
            type: 'html',
            html: '<div><div id="tab_importance"></div></div>'
          }
        ]
      }
    ],

    buttons: [ CKEDITOR.dialog.okButton ]
  };
} );

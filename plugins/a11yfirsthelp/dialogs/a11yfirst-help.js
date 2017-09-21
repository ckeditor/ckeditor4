/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'a11yFirstHelpDialog', function( editor ) {
  var lang = editor.lang.a11yfirsthelp;
  var dialogObj = this;

  return {
    title: lang.a11yFirstHelpLabel,
    minWidth: 600,
    minHeight: 400,
    onShow: function(event) {

      var cssLink = {
        padding:    'padding: .25em 0.5em 0.25em 1.25em;',
        margin:     'margin: 0 0 0.5em 0;',
        border:     'border: 1px solid #888;',
        background: 'background-color: #f8f8f8;',
        font:       'font-size: 110%; font-color: #333;',
      }

      var cssLinkSelected = {
        padding:    'padding: 0.25em 0.5em 0.25em 0.5em;',
        margin:     'margin: 0 0 0.5em 0;',
        border:     'border: 1px solid #888;',
        background: 'background-color: #e6f2ff;',
        font:       'font-size: 110%; font-color: #000;',
      }

      function h1(content) {
        return '<h1 style="white-space: normal; font-weight: bold; margin-top: 1em; font-size: 150%">' + content + '</h1>';
      }

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

      function addNavigationLinks() {
        html = '<script type="text/javascript">'; 
        html += 'function editor.a11yfirst.showTopic(id) {'; 
        html += '  for(var i = 0; i < navigation_info.length; i++) {'; 
        html += '    var node = document.getElementById(navigation_info[i].id);'; 
        html += '    node.style.display = "none";'; 
        html += '  }'; 
        html += '  node = document.getElementById(id);'; 
        html += '  node.style.display = "block";'; 
        html += '};  alert(typeof editor.a11yfirst.showTopic);' 
        html += '</script>'; 
        html += '<nav>';
        html += '  <ul title="A11yFirst Help Navigation" style="list-style: none;">';
        for (var i = 0; i < navigation_info.length; i++) {
          var item = navigation_info[i];
          var css = cssLink;
          var before = '';
          if (i == 2) {
            css = cssLinkSelected;
            before = '&rtrif;&nbsp;';
          }  
          html += '    <li style="' + css.padding + css.margin + css.border + css.background + css.font + '">';
          html += '      <a href="#' + item.id + '" onclick="editor.a11yfirst.showTopic(\'' + item.id + '\')">' + before + item.label + '</a>';
          html += '    </li>';
        }
        html += '  </ul>';
        html += '</nav>';
        return html;        
      }

      var navigation_info = [
        {id: 'id_a11yfirst_getting_started', label: lang.gettingStartedLabel},
        {id: 'id_a11yfirst_heading',         label: lang.headingHelpLabel},
        {id: 'id_a11yfirst_block_format',    label: lang.blockFormatHelpLabel},
        {id: 'id_a11yfirst_inline_style',    label: lang.inlineStyleHelpLabel},
        {id: 'id_a11yfirst_link',            label: lang.linkHelpLabel}
      ];

      var node, html;

      node = document.getElementById('a11yfirsthelp_nav');

      node.innerHTML = addNavigationLinks();


      node = document.getElementById('a11yfirsthelp_content');

      html = h2(lang.gettingStarted1Heading);
      html += p(lang.gettingStarted1Content);

      html += h2(lang.gettingStarted2Heading);
      html += list('ul', lang.gettingStarted2Content);

      html += h2(lang.gettingStarted3Heading);
      html += list('ul', lang.gettingStarted3Content);

      html += h2(lang.gettingStarted4Heading);
      html += list('ul', lang.gettingStarted4Content);

      node.innerHTML = html;

    },

    contents: [
      {
        id: 'tab1',
        label: lang.a11yFirstHelpLabel,
        title: lang.a11yFirstHelpTitle,
        expand: true,
        padding: 0,
        elements: [
          {
            type: 'html',
            html: '<table role="none"><tr><td style="width: 150px"><div id="a11yfirsthelp_nav" style="padding-right: 1em;"></div></td><td style="width: 480px; border-left: 1px #d1d1d1 solid"><div id="a11yfirsthelp_content" style="padding-left: 1em; height: 400px; overflow: auto">Tab 1</div></td></tr></table>'
          }
        ]
      }
    ],

    buttons: [ CKEDITOR.dialog.okButton ]
  };
} );

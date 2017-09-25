/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'a11yFirstHelpDialog', function( editor ) {
  var lang = editor.lang.a11yfirsthelp;
  var dialogObj = this;

  var helpTopics = ['contentGettingStarted', 'contentHeadingHelp', 'contentBlockFormatHelp', 'contentInlineStyleHelp', 'contentLinkHelp'];

  var highlighStyle = 'background-color: #e6f2ff;';

  function showHelpTopic(id) {
    console.log(id);

    for (var i = 0; i < helpTopics.length; i++) {
      var node = document.getElementById(helpTopics[i]);
      if (node) {
        if (helpTopics[i] == id) {
          node.style.display = 'block';
        }
        else {
          node.style.display = 'none';     
        }        
      }
    }
  }

  var buttonGettingStarted = {
    type: 'button',
    id: 'buttonGettingStarted',
    style: "width: 11em; text-align: left;",
    label: lang.gettingStartedLabel,
    title: lang.gettingStartedTitle,
    onClick: function() {
        showHelpTopic('contentGettingStarted');
    }
  };

  var buttonHeadingHelp = {
    type: 'button',
    id: 'buttonHeadingHelp',
    style: "width: 11em; text-align: left;",
    label: lang.headingHelpLabel,
    title: lang.headingHelpTitle,
    onClick: function() {
        showHelpTopic('contentHeadingHelp');
    }
  };

  var buttonBlockFormatHelp = {
    type: 'button',
    id: 'buttonBlockFormatHelp',
    style: "width: 11em; text-align: left;",
    label: lang.blockFormatHelpLabel,
    title: lang.blockFormatHelpTitle,
    onClick: function() {
        showHelpTopic('contentBlockFormatHelp');
    },
  };

  var buttonInlineStyleHelp = {
    type: 'button',
    id: 'buttonInlineStyleHelp',
    style: "width: 11em; text-align: left;",
    label: lang.inlineStyleHelpLabel,
    title: lang.inlineStyleHelpTitle,
    onClick: function() {
        showHelpTopic('contentInlineStyleHelp');
    },
  };    

  var buttonLinkHelp = {
    type: 'button',
    id: 'buttonLinkHelp',
    style: "width: 11em; text-align: left;",
    label: lang.linkHelpLabel,
    title: lang.linkHelpTitle,
    onClick: function() {
        showHelpTopic('contentLinkHelp');
    },
  };  


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

      function h3(content) {
        return '<h3 style="white-space: normal; font-weight: bold; margin-top: 1em; font-size: 110%">' + content + '</h3>';
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

      node = document.getElementById('contentGettingStarted');

      html = h2(lang.gettingStartedLabel);

      html += h3(lang.gettingStarted1Heading);
      html += p(lang.gettingStarted1Content);

      html += h3(lang.gettingStarted2Heading);
      html += list('ul', lang.gettingStarted2Content);

      html += h3(lang.gettingStarted3Heading);
      html += list('ul', lang.gettingStarted3Content);

      html += h3(lang.gettingStarted4Heading);
      html += list('ul', lang.gettingStarted4Content);

      node.innerHTML = html;

      node = document.getElementById('contentHeadingHelp');
      console.log('HeadingHelp: ' + node);

      html = h2(lang.headingHelpLabel);

      html += h3(lang.headingHelp1Heading);
      html += p(lang.headingHelp1Content);

      html += h3(lang.headingHelp2Heading);
      html += list('ul', lang.headingHelp2Content);

      node.innerHTML = html;

      node = document.getElementById('contentBlockFormatHelp');
      console.log('BlockFormat: ' + node);

      html = h2(lang.blockFormatHelpLabel);

      html += h3(lang.blockFormatHelp1Heading);
      html += p(lang.blockFormatHelp1Content);

      html += h3(lang.blockFormatHelp2Heading);
      html += list('ul', lang.blockFormatHelp2Content);

      node.innerHTML = html;

      node = document.getElementById('contentInlineStyleHelp');
      console.log('InlineStyle: ' + node);

      html = h2(lang.inlineStyleHelpLabel);

      html += h3(lang.inlineStyleHelp1Heading);
      html += p(lang.inlineStyleHelp1Content);

      html += h2(lang.inlineStyleHelp2Heading);
      html += list('ul', lang.inlineStyleHelp2Content);

      node.innerHTML = html;

      node = document.getElementById('contentLinkHelp');
      console.log('Link: ' + node);

      html = h2(lang.linkHelpLabel);

      html += h3(lang.linkHelp1Heading);
      html += p(lang.linkHelp1Content);

      html += h3(lang.linkHelp2Heading);
      html += list('ul', lang.linkHelp2Content);

      node.innerHTML = html;

      if (editor.a11yfirst.helpOption) {
        showHelpTopic('content' + editor.a11yfirst.helpOption);
      }

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
                type: 'hbox',
                widths: [ '10%', '90%' ],
                children: [
                  {
                    type: 'vbox',
                    align: 'left',
                    width: '200px',
                    children: [buttonGettingStarted, buttonHeadingHelp, buttonBlockFormatHelp, buttonInlineStyleHelp, buttonLinkHelp],
                  },
                  {
                    type: 'html',
                    html: '<div style="padding-left: 1em; height: 400px; overflow: auto; border-left: 2px solid #ddd; margin-left: -5.5em"><div id="contentGettingStarted"></div><div id="contentHeadingHelp"></div><div id="contentBlockFormatHelp"></div><div id="contentInlineStyleHelp"></div><div id="contentLinkHelp"></div></div>'
                  }
                ]
              }
            ]
          }
    ],

    buttons: [ CKEDITOR.dialog.okButton ]
  };
} );

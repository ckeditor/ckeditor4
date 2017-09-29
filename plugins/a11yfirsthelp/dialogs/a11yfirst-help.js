/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'a11yFirstHelpDialog', function( editor ) {
  var lang = editor.lang.a11yfirsthelp;
  var config = editor.config;
  var dialogObj;

  var buttonStyle = 'width: 11em; text-align: left; margin-bottom: 0; margin-top: 0';

  var helpTopics  = ['GettingStarted', 'HeadingHelp', 'BlockFormatHelp', 'InlineStyleHelp', 'LinkHelp'];

  function showHelpTopic(id) {
    var node, button, buttonElement, itemId, contentId, buttonId;

    for (let i = 0; i < helpTopics.length; i++) {
      itemId = helpTopics[i];
      contentId = 'content' + itemId;
      buttonId  = 'button'  + itemId;

      node = document.getElementById(contentId);
      button = dialogObj.getContentElement('a11yFirstHelpTab', buttonId);

      if (node && button) {

        buttonElement = button.getElement();
        buttonElement.addClass('a11yfirsthelp');
        buttonElement.getParent().addClass('a11yfirsthelp');

        if (itemId == id) {
          node.style.display = 'block';
          buttonElement.addClass('selected');
          buttonElement.focus();
        }
        else {
          node.style.display = 'none';     
          buttonElement.removeClass('selected');
        }        
      }
    }
  }

  return {
    title: lang.a11yFirstHelpLabel,
    minWidth: 600,
    minHeight: 360,
    onShow: function(event) {

      function h1(content) {
        return '<h1>' + content + '</h1>';
      }

      function h2(content) {
        return '<h2>' + content + '</h2>';
      }

      function h3(content) {
        return '<h3>' + content + '</h3>';
      }

      function p(content) {
        var html = '';
        var paras = content.split('\n');
        for(var i = 0; i < paras.length; i++ ) {
          html += '<p>' + paras[i] + '</p>';

        }
        return html;
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

      dialogObj = this;

      var converter = new showdown.Converter();


      // Add getting started content

      node = document.getElementById('contentGettingStarted');

      var content = lang.gettingStarted.no_org;
      var a11yLink  = "";

      if (config.a11yfirst) {
        if (config.a11yfirst.organization && config.a11yfirst.organization.length) {
          content = lang.gettingStarted.has_org.replace(/%org/g, config.a11yfirst.organization);
        }
        if (config.a11yfirst.a11yPolicyLink && config.a11yfirst.a11yPolicyLabel) {
          content += lang.gettingStarted.policy_link.replace(/%policy_label/g, config.a11yfirst.a11yPolicyLabel).replace(/%policy_url/g, config.a11yfirst.a11yPolicyLink); 
        }
      } 

      content += lang.gettingStarted.content;

      node.innerHTML = converter.makeHtml(content);

      // Add heading help content

      node = document.getElementById('contentHeadingHelp');
      node.innerHTML = converter.makeHtml(lang.headingHelp.content);

      node = document.getElementById('contentBlockFormatHelp');
      node.innerHTML = converter.makeHtml(lang.blockFormatHelp.content);

      node = document.getElementById('contentInlineStyleHelp');
      node.innerHTML = converter.makeHtml(lang.inlineStyleHelp.content);

      node = document.getElementById('contentLinkHelp');
      node.innerHTML = converter.makeHtml(lang.linkHelp.content);

      if (editor.a11yfirst.helpOption) {
        showHelpTopic(editor.a11yfirst.helpOption);
      }

    },

    contents: [
          {
            id: 'a11yFirstHelpTab',
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
                    children: [
                      {
                        type: 'button',
                        id: 'buttonGettingStarted',
                        style: buttonStyle,
                        label: lang.gettingStarted.label,
                        title: lang.gettingStarted.title,
                        onClick: function() {
                            showHelpTopic('GettingStarted');
                        },    
                      },
                      {
                        type: 'button',
                        id: 'buttonHeadingHelp',
                        style: buttonStyle,
                        label: lang.headingHelp.label,
                        title: lang.headingHelpTitle,
                        onClick: function() {
                            showHelpTopic('HeadingHelp');
                        },
                      },
                      {
                        type: 'button',
                        id: 'buttonBlockFormatHelp',
                        style: buttonStyle,
                        label: lang.blockFormatHelp.label,
                        title: lang.blockFormatHelpTitle,
                        onClick: function() {
                            showHelpTopic('BlockFormatHelp');
                        },
                      },  
                      {
                        type: 'button',
                        id: 'buttonInlineStyleHelp',
                        style: buttonStyle,
                        label: lang.inlineStyleHelp.label,
                        title: lang.inlineStyleHelpTitle,
                        onClick: function() {
                            showHelpTopic('InlineStyleHelp');
                        },
                      },  
                      {
                        type: 'button',
                        id: 'buttonLinkHelp',
                        style: buttonStyle,
                        label: lang.linkHelp.label,
                        title: lang.linkHelpTitle,
                        onClick: function() {
                            showHelpTopic('LinkHelp');
                        },
                      }  
                    ],
                  },
                  {
                    type: 'html',
                    html: '<div class="a11yfirsthelpcontent" style="margin: 0; margin-top: -1em; padding-left: 1em; height: 400px; overflow: auto; border-left: 2px solid #ddd; margin-left: -5.5em"><div id="contentGettingStarted"></div><div id="contentHeadingHelp"></div><div id="contentBlockFormatHelp"></div><div id="contentInlineStyleHelp"></div><div id="contentLinkHelp"></div></div>'
                  }
                ]
              }
            ]
          }
    ],

    buttons: [ CKEDITOR.dialog.okButton ]
  };
} );

/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'a11yFirstHelpDialog', function( editor ) {
  var lang = editor.lang.a11yfirsthelp;
  var config = editor.config;
  var dialogObj;

  var highlighStyle = 'background-color: #e6f2ff;';

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
        return '<h1 style="white-space: normal; font-weight: bold; margin-top: 1em; font-size: 150%">' + content + '</h1>';
      }

      function h2(content) {
        return '<h2 style="white-space: normal; font-weight: bold; margin-top: 1em; font-size: 135%">' + content + '</h2>';
      }

      function h3(content) {
        return '<h3 style="white-space: normal; font-weight: bold; margin-top: 1em; font-size: 110%">' + content + '</h3>';
      }

      function p(content) {
        var html = '';
        var paras = content.split('\n');
        for(var i = 0; i < paras.length; i++ ) {
          html += '<p style="white-space: normal; font-weight: normal; margin-top: 0.5em; font-size: 110%">' + paras[i] + '</p>';

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

      // Add getting started content

      node = document.getElementById('contentGettingStarted');

      html = h2(lang.gettingStartedLabel);

      var importanceContent = lang.gettingStartedImportanceOrganizationContent;
      var a11yLink  = "";

      if (config.a11yfirst) {
        if (config.a11yfirst.organization && config.a11yfirst.organization.length) {
          importanceContent = lang.gettingStartedImportanceOrganizationContent.replace(/%org/g, config.a11yfirst.organization);
        }
        if (config.a11yfirst.a11yPolicyLink && config.a11yfirst.a11yPolicyLabel) {
          a11yLink = '<a target="_reference" style="text-decoration: underline" href="' + config.a11yfirst.a11yPolicyLink + '">' + config.a11yfirst.a11yPolicyLabel + '</a>';
        }
      } 

      html += h3(lang.gettingStartedImportanceHeading);
      html += p(importanceContent);

      if (a11yLink.length) {
        html += p(a11yLink);
      }

      html += h3(lang.gettingStartedWhatIsHeading);
      html += list('ul', lang.gettingStartedWhatIsContent);

      html += h3(lang.gettingStartedPeopleWithHeading);
      html += list('ul', lang.gettingStartedPeopleWithContent);

      html += h3(lang.gettingStartedFeaturesHeading);
      html += list('ul', lang.gettingStartedFeaturesContent);

      html += h3(lang.gettingStartedResourcesHeading);
      html += list('ul', lang.gettingStartedResourcesContent);

      node.innerHTML = html;

      // Add heading help content

      node = document.getElementById('contentHeadingHelp');

      html = h2(lang.headingHelpLabel);

      html += h3(lang.headingHelpFeatureHeading);
      html += list('ul', lang.headingHelpFeatureContent);

      html += h3(lang.headingHelpRuleHeading);
      html += list('ul', lang.headingHelpRuleContent);

      html += h3(lang.headingHelpImportanceHeading);
      html += list('ul', lang.headingHelpImportanceContent);

      node.innerHTML = html;

      // Add block format help content

      node = document.getElementById('contentBlockFormatHelp');

      html = h2(lang.blockFormatHelpLabel);

      html += h3(lang.blockFormatHelp1Heading);
      html += p(lang.blockFormatHelp1Content);

      html += h3(lang.blockFormatHelp2Heading);
      html += list('ul', lang.blockFormatHelp2Content);

      node.innerHTML = html;

      // Add inline style help content

      node = document.getElementById('contentInlineStyleHelp');

      html = h2(lang.inlineStyleHelpLabel);

      html += h3(lang.inlineStyleHelp1Heading);
      html += p(lang.inlineStyleHelp1Content);

      html += h2(lang.inlineStyleHelp2Heading);
      html += list('ul', lang.inlineStyleHelp2Content);

      node.innerHTML = html;

      // Add link help content      

      node = document.getElementById('contentLinkHelp');

      html = h2(lang.linkHelpLabel);

      html += h3(lang.linkHelp1Heading);
      html += p(lang.linkHelp1Content);

      html += h3(lang.linkHelp2Heading);
      html += list('ul', lang.linkHelp2Content);

      node.innerHTML = html;

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
                        label: lang.gettingStartedButtonLabel,
                        title: lang.gettingStartedTitle,
                        onClick: function() {
                            showHelpTopic('GettingStarted');
                        },    
                      },
                      {
                        type: 'button',
                        id: 'buttonHeadingHelp',
                        style: buttonStyle,
                        label: lang.headingHelpButtonLabel,
                        title: lang.headingHelpTitle,
                        onClick: function() {
                            showHelpTopic('HeadingHelp');
                        },
                      },
                      {
                        type: 'button',
                        id: 'buttonBlockFormatHelp',
                        style: buttonStyle,
                        label: lang.blockFormatHelpButtonLabel,
                        title: lang.blockFormatHelpTitle,
                        onClick: function() {
                            showHelpTopic('BlockFormatHelp');
                        },
                      },  
                      {
                        type: 'button',
                        id: 'buttonInlineStyleHelp',
                        style: buttonStyle,
                        label: lang.inlineStyleHelpButtonLabel,
                        title: lang.inlineStyleHelpTitle,
                        onClick: function() {
                            showHelpTopic('InlineStyleHelp');
                        },
                      },  
                      {
                        type: 'button',
                        id: 'buttonLinkHelp',
                        style: buttonStyle,
                        label: lang.linkHelpButtonLabel,
                        title: lang.linkHelpTitle,
                        onClick: function() {
                            showHelpTopic('LinkHelp');
                        },
                      }  
                    ],
                  },
                  {
                    type: 'html',
                    html: '<div style="margin: 0; margin-top: -1em; padding-left: 1em; height: 400px; overflow: auto; border-left: 2px solid #ddd; margin-left: -5.5em"><div id="contentGettingStarted"></div><div id="contentHeadingHelp"></div><div id="contentBlockFormatHelp"></div><div id="contentInlineStyleHelp"></div><div id="contentLinkHelp"></div></div>'
                  }
                ]
              }
            ]
          }
    ],

    buttons: [ CKEDITOR.dialog.okButton ]
  };
} );

/**
* Copyright (c) 2018 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'a11yFirstHelpDialog', function( editor ) {
  var lang = editor.lang.a11yfirsthelp,
    config = editor.config,
    version = '0.8.0',
    dialogObj;

  var buttonStyle = 'width: 11em; text-align: left; margin-bottom: 0; margin-top: 0';

  var helpTopicsKeys = Object.keys( config.a11yFirstHelpTopics ),
      helpOptions = [];

  // Initialize helpOptions array from config defined in plugin.js
  for ( var i = 0; i < helpTopicsKeys.length; i++ ) {
    var key = helpTopicsKeys[ i ];
    helpOptions.push( config.a11yFirstHelpTopics[ key ].option );
  }

  function showHelpTopic( value ) {
    var node, button, buttonElement, option, contentId, buttonId;

    for ( var i = 0; i < helpOptions.length; i++ ) {
      option = helpOptions[ i ];
      contentId = 'content' + option;
      buttonId  = 'button'  + option;

      node = document.getElementById( contentId );
      button = dialogObj.getContentElement( 'a11yFirstHelpTab', buttonId );

      if ( node && button ) {

        buttonElement = button.getElement();
        buttonElement.addClass( 'a11yfirsthelp' );
        buttonElement.getParent().addClass( 'a11yfirsthelp' );

        if (option == value) {
          node.style.display = 'block';
          buttonElement.addClass( 'selected' );
          // buttonElement.focus();
        }
        else {
          node.style.display = 'none';
          buttonElement.removeClass( 'selected' );
        }
      }
    }

    var container = dialogObj.getContentElement( 'a11yFirstHelpTab', 'helpContentContainer' );
    container.focus();
  }

  return {
    title: lang.a11yFirstHelpLabel,

    minWidth: 600,

    minHeight: 360,

    onShow: function( event ) {
      var node, html;

      dialogObj = this;

      var converter = new showdown.Converter();

      // Add getting started content
      node = document.getElementById( 'contentAboutA11yFirst' );

      var content = lang.aboutA11yFirst.no_org;
      var a11yLink  = "";

      if ( config.a11yfirst ) {
        if ( config.a11yfirst.organization && config.a11yfirst.organization.length ) {
          content = lang.aboutA11yFirst.has_org.replace( /%org/g, config.a11yfirst.organization );
        }
        if ( config.a11yfirst.a11yPolicyLink && config.a11yfirst.a11yPolicyLabel ) {
          content += lang.aboutA11yFirst.policy_link
          .replace( /%policy_label/g, config.a11yfirst.a11yPolicyLabel )
          .replace( /%policy_url/g, config.a11yfirst.a11yPolicyLink );
        }
      }

      content += lang.aboutA11yFirst.content;
      content = content.replace( /%version/g, version );

      node.innerHTML = converter.makeHtml( content );

      // Add help content

      node = document.getElementById( 'contentHeadingHelp' );
      node.innerHTML = converter.makeHtml( lang.headingHelp.content );

      node = document.getElementById( 'contentInlineStyleHelp' );
      node.innerHTML = converter.makeHtml( lang.inlineStyleHelp.content );

      node = document.getElementById( 'contentLinkHelp' );
      node.innerHTML = converter.makeHtml( lang.linkHelp.content );

      node = document.getElementById( 'contentImageHelp' );
      node.innerHTML = converter.makeHtml( lang.imageHelp.content );


      if ( editor.a11yfirst.helpOption ) {
        showHelpTopic( editor.a11yfirst.helpOption );
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
                    id: 'buttonHeadingHelp',
                    style: buttonStyle,
                    label: lang.headingHelp.label,
                    title: lang.headingHelpTitle,
                    onClick: function() {
                        showHelpTopic( 'HeadingHelp' );
                    },
                  },
                  {
                    type: 'button',
                    id: 'buttonInlineStyleHelp',
                    style: buttonStyle,
                    label: lang.inlineStyleHelp.label,
                    title: lang.inlineStyleHelpTitle,
                    onClick: function() {
                        showHelpTopic( 'InlineStyleHelp' );
                    },
                  },
                  {
                    type: 'button',
                    id: 'buttonLinkHelp',
                    style: buttonStyle,
                    label: lang.linkHelp.label,
                    title: lang.linkHelpTitle,
                    onClick: function() {
                        showHelpTopic( 'LinkHelp' );
                    },
                  },
                  {
                    type: 'button',
                    id: 'buttonImageHelp',
                    style: buttonStyle,
                    label: lang.imageHelp.label,
                    title: lang.imageHelpTitle,
                    onClick: function() {
                        showHelpTopic( 'ImageHelp' );
                    },
                  },
                  {
                    type: 'button',
                    id: 'buttonAboutA11yFirst',
                    style: buttonStyle,
                    label: lang.aboutA11yFirst.label,
                    title: lang.aboutA11yFirst.title,
                    onClick: function() {
                        showHelpTopic( 'AboutA11yFirst' );
                    },
                  }
                ],
              },
              {
                type: 'html',
                id: 'helpContentContainer',
                focus: function() {
                  this.getElement().focus();
                },
                html:
                  '<div tabindex="-1" class="a11yfirsthelpcontent" style="\
                  margin: 0; margin-top: -1em; margin-left: -5.5em; \
                  padding-left: 1em; border-left: 2px solid #ddd; \
                  height: 400px; overflow: auto">\
                    <div id="contentAboutA11yFirst"></div>\
                    <div id="contentHeadingHelp"></div>\
                    <div id="contentInlineStyleHelp"></div>\
                    <div id="contentLinkHelp"></div>\
                    <div id="contentImageHelp"></div>\
                  </div>'
              }
            ]
          }
        ]
      }
    ],

    buttons: [ CKEDITOR.dialog.okButton ]
  };
} );

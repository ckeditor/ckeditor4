/**
* Copyright (c) 2018 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'a11yFirstHelpDialog', function( editor ) {
  var lang = editor.lang.a11yfirsthelp,
      config = editor.config,
      version = '0.9.0',
      dialogObj;

  var buttonStyle = 'width: 11em; text-align: left; margin-bottom: 0; margin-top: 0';

  var basePathExt = {
    type: 'lang',
    regex: /basePath\//g,
    replace: CKEDITOR.basePath
  };

  // Register the showdown extension
  showdown.extension( 'basePath', basePathExt );

  var helpTopicKeys = Object.keys( config.a11yFirstHelpTopics ),
      helpOptions = [],
      dialogMenuButtons = [];

  // Initialize helpOptions array from config defined in plugin.js
  for ( var i = 0; i < helpTopicKeys.length; i++ ) {
    var key = helpTopicKeys[ i ];
    helpOptions.push( config.a11yFirstHelpTopics[ key ].option );
  }

  // Initialize dialogMenuButtons array from helpTopicKeys and helpOptions
  for ( var i = 0; i < helpTopicKeys.length; i++ ) {
    var key = helpTopicKeys[ i ];
    var option = helpOptions[ i ];
    var buttonObj = {
      type: 'button',
      id: 'button' + option,
      style: buttonStyle,
      label: lang[ key ].label,
      title: lang[ key ].title,
      option: option,
      onClick: function() {
        showHelpTopic( this.option );
      }
    };
    dialogMenuButtons.push ( buttonObj );
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
      var key, contentId, node, html;

      dialogObj = this;

      var converter = new showdown.Converter({ extensions: [ 'basePath' ] });

      for ( var i = 0; i < helpTopicKeys.length; i++ ) {
        key = helpTopicKeys[ i ];
        contentId = 'content' + helpOptions[ i ];
        node = document.getElementById( contentId );
        node.innerHTML = converter.makeHtml( lang[ key ].content );
      }

      if ( editor.a11yfirst.helpOption ) {
        showHelpTopic( editor.a11yfirst.helpOption );
      }

      // Add version information to the button bar at the bottom of the dialog box
      node = document.querySelector('.cke_dialog_footer');
      html = document.createElement('div');
      html.setAttribute('style', 'position: absolute; top: 1em; left: 1em');
      html.innerHTML = lang.versionLabel + ' ' + version;
      node.insertBefore(html, node.firstElementChild);
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
                children: dialogMenuButtons
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
                    <div id="contentHeadingHelp"></div>\
                    <div id="contentListHelp"></div>\
                    <div id="contentImageHelp"></div>\
                    <div id="contentInlineStyleHelp"></div>\
                    <div id="contentLinkHelp"></div>\
                    <div id="contentGettingStarted"></div>\
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

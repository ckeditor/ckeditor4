/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.add( 'a11yfirsthelp', {
  requires: 'richcombo',

  // jscs:disable maximumLineLength
  lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
  // jscs:enable maximumLineLength

  init: function( editor ) {
    if ( editor.blockless )
      return;

    var allowedContent = [],
        config = editor.config,
        lang = editor.lang.a11yfirsthelp,

        a11yFirstHelpDialogCmd = 'a11yFirstHelpDialog',
        helpTopics = config.helpTopics,
        helpTopicIds = config.helpTopicIds,
        menuStyle = new CKEDITOR.style( { element: 'p' } );

    // Initialize A11yFirst Help dialog and command
    CKEDITOR.dialog.add( a11yFirstHelpDialogCmd, this.path + 'dialogs/a11yfirst-help.js' );
    editor.addCommand( a11yFirstHelpDialogCmd, new CKEDITOR.dialogCommand( a11yFirstHelpDialogCmd ) );

    // Register a11yfirsthelp command
    editor.addCommand( 'allyfirsthelp', {
      allowedContent: allowedContent,
      contextSensitive: false
    } );

    // Create namespaced object for help option
    if (!editor.a11yfirst) {
      editor.a11yfirst = {};
    }

    // Add richcombo button and menu items
    editor.ui.addRichCombo( 'A11yFirstHelp', {
      label: lang.label,
      title: lang.panelTitle,
      toolbar: 'a11yfirsthelp',
      command: 'allyfirsthelp',
      allowedContent: allowedContent,

      panel: {
        css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss ),
        multiSelect: false,
        attributes: { 'aria-label': lang.panelTitle }
      },

      init: function() {
        for (var i = 0; i < helpTopicIds.length; i++) {
          var id = helpTopicIds[i];
          var label = lang[ id ].menu;
          // Add the entry to the panel list
          this.add( id, menuStyle.buildPreview( label ), label );
        }
      },

      onClick: function( value ) {
        // editor.fire( 'saveSnapshot' );
        if (helpTopicIds.indexOf( value ) !== -1) {
          editor.a11yfirst.helpOption = helpTopics[ value ].option;
          editor.execCommand( a11yFirstHelpDialogCmd );
        }
      }

    } ); // end addRichCombo

  } // end init

} ); // end plugins.add

CKEDITOR.config.helpTopicIds = [
  'gettingStarted',
  'headingHelp',
  'blockFormatHelp',
  'inlineStyleHelp',
  'linkHelp'
];

CKEDITOR.config.helpTopics = {
  'gettingStarted': {
    option:  'GettingStarted',
    command: 'A11yFirstGettingStarted',
    group:   'A11yFirst_2'
  },

  'headingHelp': {
    option:  'HeadingHelp',
    command: 'A11yFirstHeadingHelp',
    group:   'A11yFirst_1'
  },

  'blockFormatHelp': {
    option:  'BlockFormatHelp',
    command: 'A11yFirstBlockFormatHelp',
    group:   'A11yFirst_1'
  },

  'inlineStyleHelp': {
    option:  'InlineStyleHelp',
    command: 'A11yFirstInlineStyleHelp',
    group:   'A11yFirst_1'
  },

  'linkHelp': {
    option:  'LinkHelp',
    command: 'A11yFirstLinkHelp',
    group:   'A11yFirst_1'
  }
};

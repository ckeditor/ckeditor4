/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
'use strict';

( function () {

  var allowedContent = [],
      startIndex,
      endIndex;

  CKEDITOR.plugins.add( 'a11yfirsthelp', {
    requires: 'a11yfirst,menubutton',

    // jscs:disable maximumLineLength
    lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
    // jscs:enable maximumLineLength

    init: function( editor ) {
      if ( editor.blockless )
        return;

      var config = editor.config,
          lang = editor.lang.a11yfirsthelp,
          plugin = this,
          items = {},
          index = 1;


      if (!editor.a11yfirst) {
        editor.a11yfirst = {};        
      }

      if (!editor.a11yfirst.helpOption) {
        editor.a11yfirst.helpOption = 'gettingstarted';        
      }

      // Change behavior of menubutton with text label
      CKEDITOR.plugins.get( 'a11yfirst' ).overrideButtonSetState();

      // Initialize Getting Started menuitem
      var gettingStartedCmd = 'a11yFirstGettingStarted';
      CKEDITOR.dialog.add( gettingStartedCmd, this.path + 'dialogs/getting-started.js' );
      editor.addCommand( gettingStartedCmd, new CKEDITOR.dialogCommand( gettingStartedCmd, {helpCommandId: 'gettingstarted'} ) );

      // Initialize Block Format Help menuitem
      var blockFormatHelpCmd = 'blockFormatHelp';
      CKEDITOR.dialog.add( blockFormatHelpCmd, this.path + 'dialogs/block-format-help.js' );
      editor.addCommand( blockFormatHelpCmd, new CKEDITOR.dialogCommand( blockFormatHelpCmd ) );

      // Initialize Inline Style Help menuitem
      var inlineStyleHelpCmd = 'inlineStyleHelp';
      CKEDITOR.dialog.add( inlineStyleHelpCmd, this.path + 'dialogs/inline-style-help.js' );
      editor.addCommand( inlineStyleHelpCmd, new CKEDITOR.dialogCommand( inlineStyleHelpCmd ) );

      // Initialize Link Help menuitem
      var a11yFirstLinkHelpCmd = 'a11yFirstLinkHelp';
      CKEDITOR.dialog.add( a11yFirstLinkHelpCmd, this.path + 'dialogs/link-help.js' );
      editor.addCommand( a11yFirstLinkHelpCmd, new CKEDITOR.dialogCommand( a11yFirstLinkHelpCmd ) );

      // Initialize A11yFirst Help dialog and command
      var a11yFirstHelpDialogCmd = 'a11yFirstHelpDialog';
      CKEDITOR.dialog.add( a11yFirstHelpDialogCmd, this.path + 'dialogs/a11yfirst-help.js' );
      editor.addCommand( a11yFirstHelpDialogCmd, new CKEDITOR.dialogCommand( a11yFirstHelpDialogCmd ) );

      // Register a11yfirsthelp command
      editor.addCommand( 'allyfirsthelp', {
        allowedContent: allowedContent,
        contextSensitive: false
      } );


      // Add Heading Help
      items.a11yFirstHelpheadingHelp = {
        label: lang.headingHelpLabel,
        group: 'a11yfirsthelp_helps',
        order: index++,
        onClick: function() {
          editor.a11yfirst.helpOption = 'HeadingHelp';        
          editor.execCommand(a11yFirstHelpDialogCmd);
//          editor.execCommand('headingHelp');
        }
      };

      // Add Block Format Help
      items.a11yFirstBlockFormatHelpCmd = {
        label: lang.blockFormatHelpLabel,
        group: 'a11yfirsthelp_helps',
        order: index++,
        onClick: function() {
          editor.a11yfirst.helpOption = 'BlockFormatHelp';        
          editor.execCommand(a11yFirstHelpDialogCmd);
//          editor.execCommand(blockFormatHelpCmd, 'blockformat');
        }
      };      

      // Add Inline Style Help
      items.a11yFirstInlineStyleHelpCmd = {
        label: lang.inlineStyleHelpLabel,
        group: 'a11yfirsthelp_helps',
        order: index++,
        onClick: function() {
          editor.a11yfirst.helpOption = 'InlineStyleHelp';        
          editor.execCommand(a11yFirstHelpDialogCmd);
//          editor.execCommand(inlineStyleHelpCmd,'inlinestyle');
        }
      };  

      // Add Link Help
      items.a11yFirstLinkHelpCmd = {
        label: lang.linkHelpLabel,
        group: 'a11yfirsthelp_helps',
        order: index++,
        onClick: function() {
          editor.a11yfirst.helpOption = 'LinkHelp';        
          editor.execCommand(a11yFirstHelpDialogCmd);
//          editor.execCommand(a11yFirstLinkHelpCmd, 'link');
        }
      };  


      // Add Getting Started item
      items.a11yFirstHelpGettingStarted = {
        label: lang.gettingStartedLabel,
        group: 'a11yfirsthelp_getting_started',
        order: index+1,
        onClick: function() {
          editor.a11yfirst.helpOption = 'GettingStarted';        
          editor.execCommand(a11yFirstHelpDialogCmd);
//          editor.execCommand( gettingStartedCmd, 'gettingstarted');
        }
      };
      
      // Initialize menu groups
      editor.addMenuGroup( 'a11yfirsthelp_helps', 1 );
      editor.addMenuGroup( 'a11yfirsthelp_getting_started' );
      editor.addMenuItems( items );

      editor.ui.add( 'A11yFirstHelp', CKEDITOR.UI_MENUBUTTON, {
        label: lang.label,
        toolbar: 'a11yfirsthelp',
        command: 'allyfirsthelp',
        onMenu: function() {
          var activeItems = {};

          for ( var prop in items ) {
            activeItems[ prop ] = CKEDITOR.TRISTATE_OFF;
          }

          return activeItems;
        }
      } );
    },
  } )
} )();

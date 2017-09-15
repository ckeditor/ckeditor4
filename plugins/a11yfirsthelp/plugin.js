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


      // Change behavior of menubutton with text label
      CKEDITOR.plugins.get( 'a11yfirst' ).overrideButtonSetState();

      // Initialize Getting Started menuitem
      var gettingStartedCmd = 'a11yFirstGettingStarted';
      CKEDITOR.dialog.add( gettingStartedCmd, this.path + 'dialogs/getting-started.js' );
      editor.addCommand( gettingStartedCmd, new CKEDITOR.dialogCommand( gettingStartedCmd ) );

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
          editor.execCommand('headingHelp');
        }
      };

      // Add Getting Started item
      items.a11yFirstHelpGettingStarted = {
        label: lang.gettingStartedLabel,
        group: 'a11yfirsthelp_getting_started',
        order: index+1,
        onClick: function() {
          editor.execCommand( gettingStartedCmd );
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

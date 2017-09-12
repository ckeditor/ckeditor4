/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.add( 'a11yformat', {
  requires: 'a11yfirst,blockquote,codesnippet,menubutton',

  // jscs:disable maximumLineLength
  lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
  // jscs:enable maximumLineLength

  init: function( editor ) {
    if ( editor.blockless )
      return;

    var config = editor.config,
        lang = editor.lang.a11yformat,
        items = {};

    // Menuitem commands
    var blockquoteCmd = 'blockquote';
    var codesnippetCmd = 'codeSnippet';
    var helpCmd = 'blockformatHelp';

    // Initialize help menuitem
    /*
    CKEDITOR.dialog.add( helpCmd, this.path + 'dialogs/blockformat-help.js' );
    editor.addCommand( helpCmd, new CKEDITOR.dialogCommand( helpCmd ) );
    */

    // Change behavior of menubutton with text label
    CKEDITOR.plugins.get( 'a11yfirst' ).overrideButtonSetState();

    items.blockquote = {
      label: lang.blockquoteLabel,
      group: 'blockformatMain',
      order: 0,
      onClick: function () {
        editor.execCommand( blockquoteCmd );
      }
    };

    items.codesnippet = {
      label: lang.codesnippetLabel,
      group: 'blockformatMain',
      order: 1,
      onClick: function () {
        editor.execCommand( codesnippetCmd );
      }
    };

    // Initialize menu groups
    editor.addMenuGroup( 'blockformatMain', 1 );
    // editor.addMenuGroup( 'other' );
    editor.addMenuItems( items );

    editor.ui.add( 'BlockFormat', CKEDITOR.UI_MENUBUTTON, {
      label: lang.label,
      toolbar: 'blockformat',
      allowedContent: 'blockquote; pre; code(language-*)',
      onMenu: function() {
        var activeItems = {};
        activeItems.blockquote = CKEDITOR.TRISTATE_OFF;
        activeItems.codesnippet = CKEDITOR.TRISTATE_OFF;
        return activeItems;
      }
    } ); // END ui.add

  } // END init

} );

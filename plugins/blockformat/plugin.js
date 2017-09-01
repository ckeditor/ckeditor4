/**
* @license Copyright (c) University of Illinois - Nicholas Hoyt and Jon Gunderson. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'blockformat', {
  requires: 'a11yfirst,codesnippet,menubutton',

  // jscs:disable maximumLineLength
  lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
  // jscs:enable maximumLineLength

  init: function( editor ) {
    if ( editor.blockless )
      return;

    var allowedContent = [],
        config = editor.config,
        lang = editor.lang.blockformat,
        items = {},
        order = 0,
        allowedContent = "",
        label;

    // Gets the list of tags from the settings.
    var tags = config.blockformat_tags.split( ';' );

    // Change behavior of menubutton with text label
    CKEDITOR.plugins.get( 'a11yfirst' ).overrideButtonSetState();

    // Initialize Block Format Help menuitem
    var helpCmd = 'blockformatHelp';
    CKEDITOR.dialog.add( helpCmd, this.path + 'dialogs/blockformat_help.js' );
    editor.addCommand( helpCmd, new CKEDITOR.dialogCommand( helpCmd ) );    

    // Initialize Blockquote menuitem
    var blockquoteCmd = 'blockquote';
    if (tags.includes('blockquote')) {

      allowedContent += 'blockquote';

      items.blockquote = {
        label: lang.blockquoteLabel,
        group: 'blockformatMain',
        order: order++,
        onClick: function () {
          editor.execCommand( blockquoteCmd );
        }
      };

    }

    // Create item entry for each element in format_tags, excluding headings
    for ( var i = 0; i < tags.length; i++ ) {
      var elementTag = tags[ i ];

      if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote'].includes(elementTag)) {

        allowedContent += ';' + elementTag;

        label = elementTag;
        if (lang[elementTag]) label = lang[elementTag];

        items[ elementTag ] = {
          label: label,
          elementTag: elementTag,
          group: 'blockformatTags',
          style: new CKEDITOR.style( { element: elementTag } ),
          order: order++,

          onClick: function() {
            editor.focus();
            editor.fire( 'saveSnapshot' );

            var elementPath = editor.elementPath();

            editor[ this.style.checkActive( elementPath, editor ) ? 'removeStyle' : 'applyStyle' ]( this.style );

            // Save the undo snapshot after all changes are affected. (#4899)
            setTimeout( function() {
              editor.fire( 'saveSnapshot' );
            }, 0 );
          },
          role: 'menuitemcheckbox'
        };

      }

    }

    allowedContent += ';p';

    // Add Normal text item
    items.p = {
      label: lang.remove,
      group: 'blockformatTags',
      style: new CKEDITOR.style( { element: 'p' } ),
      order: order++,
      onClick: function() {
          editor.focus();
          editor.fire( 'saveSnapshot' );

          editor[ 'applyStyle' ]( this.style );
          editor.focus();

          // Save the undo snapshot after all changes are affected. (#4899)
          setTimeout( function() {
            editor.fire( 'saveSnapshot' );
          }, 0 );
      }
    };  
    // Add Help item
    items.blockformatHelp = {
      label: lang.helpLabel,
      group: 'blockformatHelp',
      order: order++,
      onClick: function() {
        editor.execCommand( helpCmd );
      }
    };

    // Initialize menu groups
    editor.addMenuGroup( 'blockformatMain', 1);
    editor.addMenuGroup( 'blockformatTags', 2);
    editor.addMenuGroup( 'blockformatHelp', 3);
    editor.addMenuItems( items );

    editor.ui.add( 'BlockFormat', CKEDITOR.UI_MENUBUTTON, {
      label: lang.label,
      group: 'format_options',
      toolbar: 'blockformat',
      allowedContent: allowedContent,

      onMenu: function() {
        var activeItems = {};

        var elemName = editor.elementPath().elements.length ? editor.elementPath().elements[0].getName() : '';


        for ( var prop in items ) {
          activeItems[ prop ] = prop == elemName ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
        }

        return activeItems;
      }

    } ); // END ui.add

  } // END init

} );

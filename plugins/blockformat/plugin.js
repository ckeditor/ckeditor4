/**
* @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'blockformat', {
  requires: 'a11yfirst,blockquote,codesnippet,menubutton',

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
        order = 0;

    // Gets the list of tags from the settings.
    var tags = config.format_tags.split( ';' );

    // Menuitem commands
    var blockquoteCmd = 'blockquote';
    var helpCmd = 'headingHelp';

    console.log("TAGS" + tags);

    // Change behavior of menubutton with text label
    CKEDITOR.plugins.get( 'a11yfirst' ).overrideButtonSetState();

    items.blockquote = {
      label: lang.blockquoteLabel,
      group: 'blockformatMain',
      order: order++,
      onClick: function () {
        editor.execCommand( blockquoteCmd );
      }
    };

    // Add Normal text item
    items.p = {
      label: lang.remove,
      group: 'blockElementTags',
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

    // Create item entry for each element in format_tags, excluding headings
    for ( var i = 0; i < tags.length; i++ ) {
      var elementTag = tags[ i ];

      if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(elementTag)) {

        items[ elementTag ] = {
          label: elementTag,
          elementTag: elementTag,
          group: 'blockElementTags',
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
          refresh: function( editor ) {
            this.setState(CKEDITOR.TRISTATE_ON);
          },
          role: 'menuitemcheckbox'
        };

      }

    }



    // Add Help item
    items.help = {
      label: lang.helpLabel,
      group: 'blockHelp',
      order: order++,
      onClick: function() {
        editor.execCommand( helpCmd );
      }
    };

    // Initialize menu groups
    editor.addMenuGroup( 'blockformatMain', 1 );
    editor.addMenuGroup( 'blockElementTags', 2);
    editor.addMenuGroup( 'blockHelp', 4);
    editor.addMenuItems( items );

    editor.ui.add( 'BlockFormat', CKEDITOR.UI_MENUBUTTON, {
      label: lang.label,
      group: 'format_options',
      toolbar: 'blockformat',

      onMenu: function() {
        var activeItems = {};

        for ( var prop in items ) {
          activeItems[ prop ] = CKEDITOR.TRISTATE_OFF;
        }

        return activeItems;
      }

    } ); // END ui.add

  } // END init

} );

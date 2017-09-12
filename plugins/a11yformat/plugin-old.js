/**
* @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'blockformat', {
  requires: 'richcombo,blockquote,codesnippet',

  // jscs:disable maximumLineLength
  lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
  // jscs:enable maximumLineLength

  init: function( editor ) {
    if ( editor.blockless )
      return;

    var config = editor.config,
        lang = editor.lang.blockformat;

    // Menuitem commands
    var blockquoteCmd = 'blockquote';
    var codesnippetCmd = 'codeSnippet';
    var helpCmd = 'blockformatHelp';

    // Initialize help menuitem
    /*
    CKEDITOR.dialog.add( helpCmd, this.path + 'dialogs/blockformat-help.js' );
    editor.addCommand( helpCmd, new CKEDITOR.dialogCommand( helpCmd ) );
    */

    // Create style object for menuitems
    var menuStyle = new CKEDITOR.style( config.blockformat_menuitem_style );

    editor.ui.addRichCombo( 'BlockFormat', {
      label: lang.label,
      title: lang.panelTitle,
      toolbar: 'blockformat',
      allowedContent: 'blockquote; pre; code(language-*)',

      panel: {
        css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss ),
        multiSelect: false,
        attributes: { 'aria-label': lang.panelTitle }
      },

      init: function() {
        var label;

        label = lang[ 'blockquoteLabel' ];
        this.add( blockquoteCmd, menuStyle.buildPreview( label ), label );

        label = lang[ 'codesnippetLabel' ];
        this.add( codesnippetCmd, menuStyle.buildPreview( label ), label );

        /*
        label = lang[ 'helpLabel' ];
        this.add( helpCmd, menuStyle.buildPreview( label ), label );
        */
      },

      onClick: function( value ) {
        if ( value == helpCmd ) {
          // editor.execCommand( helpCmd );
          return;
        }

        if ( value == blockquoteCmd ) {
          editor.execCommand( blockquoteCmd );
          return;
        }

        if ( value == codesnippetCmd ) {
          editor.execCommand( codesnippetCmd );
          return;
        }

        editor.focus();
        editor.fire( 'saveSnapshot' );

        // Save the undo snapshot after all changes are affected. (#4899)
        setTimeout( function() {
          editor.fire( 'saveSnapshot' );
        }, 0 );
      },

      onRender: function() {
        editor.on( 'selectionChange', function( ev ) {
          var currentTag = this.getValue(),
              elementPath = ev.data.path;

          this.refresh();
        }, this );
      },

      onOpen: function() {
        var elementPath = editor.elementPath();

        // Start by showing all menuitems ...
        this.showAll();
      },

      refresh: function() {
        /*
        var elementPath = editor.elementPath();

        if ( !elementPath )
            return;

        // Check if element path contains 'p' element.
        if ( !elementPath.isContextFor( 'p' ) ) {
          this.setState( CKEDITOR.TRISTATE_DISABLED );
          return;
        }

        this.setState( CKEDITOR.TRISTATE_DISABLED );
        */
      }
    } ); // END addRichCombo

  } // END init

} );

/**
*   The style definition for menuitems in the Block Format drop-down list:
*/
CKEDITOR.config.blockformat_menuitem_style = { element: 'p' };

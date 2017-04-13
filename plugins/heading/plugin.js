/**
* @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/

'use strict';

( function() {

  var allowedContent = [];

  CKEDITOR.plugins.add( 'heading', {
    requires: 'a11yfirst,menubutton',

    // jscs:disable maximumLineLength
    lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
    // jscs:enable maximumLineLength

    init: function( editor ) {
      if ( editor.blockless )
        return;

      var config = editor.config,
          lang = editor.lang.heading,
          headingConfigStrings = config.headings,
          plugin = this,
          items = {},
          headingTag;

      // Change behavior of menubutton with text label
      CKEDITOR.plugins.get( 'a11yfirst' ).overrideButtonSetState();

      // Initialize Outline / TOC menuitem
      var outlineCmd = 'headingOutline';
      CKEDITOR.dialog.add( outlineCmd, this.path + 'dialogs/heading_outline.js' );
      editor.addCommand( outlineCmd, new CKEDITOR.dialogCommand( outlineCmd ) );

      // Initialize Help menuitem
      var helpCmd = 'headingHelp';
      CKEDITOR.dialog.add( helpCmd, this.path + 'dialogs/heading_help.js' );
      editor.addCommand( helpCmd, new CKEDITOR.dialogCommand( helpCmd ) );

      // Register heading command
      editor.addCommand( 'heading', {
        allowedContent: allowedContent,
        contextSensitive: true,
        exec: function( editor, headingId ) {
          var item = items[ headingId ];
          if ( item ) {
            editor[ item.style.checkActive( editor.elementPath(), editor ) ? 'removeStyle' : 'applyStyle' ]( item.style );
          }
        },
        refresh: function( editor ) {
          this.setState( plugin.getCurrentHeadingElement( editor ) ?
            CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );
        }
      } );

      // Create item entry for each heading element in config
      for ( var i = 0; i < headingConfigStrings.length; i++ ) {
        headingTag = headingConfigStrings[ i ];
        items[ headingTag ] = {
          label: lang[ 'level_' + headingTag ],
          headingId: headingTag,
          group: 'heading_levels',
          order: i,
          onClick: function() {
            editor.execCommand( 'heading', this.headingId );
          },
          role: 'menuitemcheckbox'
        };

        // Initialize style property
        items[ headingTag ].style = new CKEDITOR.style( {
          element: headingTag
        } );

        allowedContent.push( items[ headingTag ].style );
      }

      // Add Remove format item
      items.removeFormat = {
        label: lang.remove,
        group: 'heading_actions',
        style: new CKEDITOR.style( { element: 'p' } ),
        state: CKEDITOR.TRISTATE_DISABLED,
        order: headingConfigStrings.length,
        onClick: function() {
          var currentHeadingElement = plugin.getCurrentHeadingElement( editor );
          if ( currentHeadingElement )
            editor[ this.style.checkActive( editor.elementPath(), editor ) ? 'removeStyle' : 'applyStyle' ]( this.style );
        }
      };

      // Initialize menu groups
      editor.addMenuGroup( 'heading_levels', 1 );
      editor.addMenuGroup( 'heading_actions' );
      editor.addMenuItems( items );

      editor.ui.add( 'Heading', CKEDITOR.UI_MENUBUTTON, {
        label: lang.label,
        allowedContent: allowedContent,
        toolbar: 'heading',
        command: 'heading',
        onMenu: function() {
          var activeItems = {},
            currentHeadingElement = plugin.getCurrentHeadingElement( editor );

          for ( var prop in items )
            activeItems[ prop ] = CKEDITOR.TRISTATE_OFF;

          activeItems.removeFormat = currentHeadingElement ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;

          if ( currentHeadingElement )
            activeItems[ currentHeadingElement.getName() ] = CKEDITOR.TRISTATE_ON;

          return activeItems;
        }
      } );
    },

    getCurrentHeadingElement: function( editor ) {
      var elementPath = editor.elementPath(),
        activePath = elementPath && elementPath.elements,
        pathMember, element;

      function isHeadingElement( name ) {
        switch( name ) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            return true;
          default:
            return false;
        }
      }

      // IE8: Upon initialization if there is no path, elementPath() returns null.
      if ( elementPath ) {
        for ( var i = 0; i < activePath.length; i++ ) {
          pathMember = activePath[ i ];
          if ( !element && isHeadingElement( pathMember.getName() ) )
            element = pathMember;
        }
      }

      return element;
    }
  } )
} )();

/**
*   The list of heading tags that will be applied to the document by the
*   various menuitems in the Heading drop-down list:
*/
CKEDITOR.config.headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
* @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/

'use strict';

( function () {

  var allowedContent = [],
      headings = [],
      startIndex,
      endIndex;

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
          headingConfigStrings = config.headings || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          oneLevel1,
          plugin = this,
          items = {},
          headingTag;

      // Normalize and sort the headings array
      for ( var i = 0; i < headingConfigStrings.length; i++ ) {
        headings.push( headingConfigStrings[i].toLowerCase() );
      }
      headings.sort();

      // Initialize headings array indices used by getAllowedHeadings
      oneLevel1 = typeof config.oneLevel1 === 'undefined' ? true : config.oneLevel1;
      startIndex = oneLevel1 && headings[0] === 'h1' ? 1 : 0;
      endIndex = headings.length - 1;

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
      for ( var i = 0; i < headings.length; i++ ) {
        headingTag = headings[ i ];
        items[ headingTag ] = {
          label: lang[ 'level_' + headingTag ],
          headingId: headingTag,
          group: 'heading_levels',
          style: new CKEDITOR.style( { element: headingTag } ),
          order: i,
          onClick: function() {
            editor.execCommand( 'heading', this.headingId );
          },
          role: 'menuitemcheckbox'
        };

        // Populate allowedContent array
        allowedContent.push( items[ headingTag ].style );
      }

      // Add Remove format item
      items.removeFormat = {
        label: lang.remove,
        group: 'heading_actions',
        style: new CKEDITOR.style( { element: 'p' } ),
        state: CKEDITOR.TRISTATE_DISABLED,
        order: headings.length,
        onClick: function() {
          var currentHeadingElement = plugin.getCurrentHeadingElement( editor );
          if ( currentHeadingElement ) {
            editor[ 'applyStyle' ]( this.style );
            editor.focus();
          }
        }
      };

      // Add Outline / TOC item
      items.outline = {
        label: lang.outlineLabel,
        group: 'heading_actions',
        order: headings.length + 1,
        onClick: function() {
          editor.execCommand( outlineCmd );
        }
      };

      // Add Help item
      items.help = {
        label: lang.helpLabel,
        group: 'heading_actions',
        order: headings.length + 2,
        onClick: function() {
          editor.execCommand( helpCmd );
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
            allowedHeadings = plugin.getAllowedHeadings( editor ),
            currentHeadingElement = plugin.getCurrentHeadingElement( editor );

          for ( var prop in items ) {
            if ( plugin.isHeadingElement( prop ) ) {
              activeItems[ prop ] = allowedHeadings.indexOf( prop ) == -1 ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF;
            }
            else {
              activeItems[ prop ] = CKEDITOR.TRISTATE_OFF;
            }
          }

          activeItems.removeFormat = currentHeadingElement ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
          activeItems.outline = CKEDITOR.TRISTATE_OFF;
          activeItems.help = CKEDITOR.TRISTATE_OFF;

          if ( currentHeadingElement )
            activeItems[ currentHeadingElement.getName() ] = CKEDITOR.TRISTATE_ON;

          return activeItems;
        }
      } );
    },

    isHeadingElement: function ( name ) {
      var names = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      return ( names.indexOf( name ) >= 0 );
    },

    getCurrentHeadingElement: function ( editor ) {
      var elementPath = editor.elementPath(),
          activePath = elementPath && elementPath.elements,
          pathMember, element;

      // IE8: Upon initialization if there is no path, elementPath() returns null.
      if ( elementPath ) {
        for ( var i = 0; i < activePath.length; i++ ) {
          pathMember = activePath[ i ];
          if ( !element && this.isHeadingElement( pathMember.getName() ) )
            element = pathMember;
        }
      }

      return element;
    },

    getAllowedHeadings: function ( editor ) {
      var selectedElement = editor.getSelection().getStartElement();
      // console.log('SELECTED ELEMENT: ' + selectedElement.getName() );

      var lastHeading = undefined,
          plugin = this;

      /*
      *   Note: The getLastHeading function modifies the
      *   lastHeading variable in its outer scope.
      */
      function getLastHeading ( element ) {
        if ( typeof element.getName !== 'function' )
          return false;

        if ( element.equals( selectedElement ) )
          return true;

        var tagName = element.getName();

        if ( plugin.isHeadingElement( tagName ) )
          lastHeading = tagName;

        var children = element.getChildren();
        var count = children.count();

        for ( var i = 0; i < count; i++ ) {
          if ( getLastHeading( children.getItem( i ) ) )
            return true;
        }
        return false;

      } // end function

      getLastHeading( editor.document.getBody() );
      // console.log( 'LAST HEADING: ' + lastHeading );

      if ( typeof lastHeading === 'undefined' )
        return headings.slice( 0, 1 );

      var index = headings.indexOf( lastHeading );
      if ( index >= 0 ) {
        var retVal = headings.slice( startIndex, index + 1 );
        if ( index < endIndex ) {
          retVal.push( headings[ index + 1 ] );
        }
        return retVal;
      }

      // lastHeading not in headings array => lexical comparison
      if ( lastHeading < headings[ 0 ] )
        return headings.slice( startIndex, startIndex + 1 );

      if ( lastHeading > headings[ endIndex ] )
        return headings.slice( startIndex );

    } // end method getAllowedHeadings

  } )
} )();

/**
*   The list of heading tags that will be applied to the document by the
*   various menuitems in the Heading drop-down list:
*/
CKEDITOR.config.headings = ['h1', 'h2', 'h3', 'h4'];
CKEDITOR.config.oneLevel1 = true;

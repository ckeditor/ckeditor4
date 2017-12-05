/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
'use strict';

( function () {

  var allowedContent = [],
    allHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    headings = [],
    startIndex,
    endIndex;

  CKEDITOR.plugins.add( 'a11yheading', {
    requires: 'a11yfirsthelp,menubutton',

    // jscs:disable maximumLineLength
    lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
    // jscs:enable maximumLineLength

    init: function( editor ) {
      if ( editor.blockless )
        return;

      var config = editor.config,
        lang = editor.lang.a11yheading,
        oneLevel1 = typeof config.oneLevel1 === 'undefined' ? true : config.oneLevel1,
        plugin = this,
        items = {},
        headingTag;

      // Initialize headings array and indices used by getAllowedHeadings
      headings = this.getHeadingConfig( config );
      startIndex = oneLevel1 && headings[0] === 'h1' ? 1 : 0;
      endIndex = headings.length - 1;

      // Load the override script to change behavior of menubutton with text label
      CKEDITOR.scriptLoader.load( this.path + 'js/override.js' );

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

      // Register normalText command
      editor.addCommand( 'normalText', {
        allowedContent: allowedContent,
        contextSensitive: true,
        exec: function( editor ) {
          var currentHeadingElement = plugin.getCurrentHeadingElement( editor );
          var normalTextStyle = new CKEDITOR.style( { element: 'p' } );
          if ( currentHeadingElement ) {
            editor[ 'applyStyle' ]( normalTextStyle );
            editor.focus();
          }
        }
      } )

      // Create item entry for each heading element in config
      for ( var i = 0; i < headings.length; i++ ) {
        headingTag = headings[ i ];
        items[ headingTag ] = {
          label: this.getLevelLabel( headingTag, oneLevel1, lang ),
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

      // Add Remove heading format item
      items.removeHeadingFormat = {
        label: lang.remove,
        group: 'heading_actions',
        style: new CKEDITOR.style( { element: 'p' } ),
        state: CKEDITOR.TRISTATE_DISABLED,
        order: headings.length,
        onClick: function() {
          editor.execCommand( 'normalText' );
        }
      };

      // Add Help item using command from a11yfirsthelp plugin
      items.headingHelp = {
        label: lang.helpLabel,
        group: 'heading_actions',
        order: headings.length + 2,
        onClick: function() {
          editor.a11yfirst.helpOption = 'HeadingHelp';
          editor.execCommand('a11yFirstHelpDialog');
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

          activeItems.removeHeadingFormat = currentHeadingElement ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
          activeItems.headingHelp = CKEDITOR.TRISTATE_OFF;

          if ( currentHeadingElement )
            activeItems[ currentHeadingElement.getName() ] = CKEDITOR.TRISTATE_ON;

          return activeItems;
        }
      } );
    },

    getLevelLabel: function ( tag, flag, lang ) {
      var label = lang['level_' + tag];
      return ( tag === 'h1' ) && flag ? label + lang['level_suffix'] : label;
    },

    getHeadingConfig: function ( config ) {
      var headingConfigStrings = [],
          configLength,
          configStringStart,
          configIndexStart,
          configStringEnd,
          configIndexEnd,
          tempArray;

      if ( typeof config.headings !== 'string' || config.headings.length === 0 ) {
        return allHeadings.slice();
      }

      // Convert config.headings to array of lowercase tag names
      tempArray = config.headings.split( ':' );
      for ( var i = 0; i < tempArray.length; i++ ) {
        if ( tempArray[ i ].length ) {
          headingConfigStrings.push( tempArray[ i ].toLowerCase() );
        }
      }
      headingConfigStrings.sort();

      // Allow flexible config settings
      configLength = headingConfigStrings.length;
      if ( configLength > 0 ) {

        configStringStart = headingConfigStrings[ 0 ];
        configIndexStart = allHeadings.indexOf( configStringStart );

        if ( configIndexStart === -1 ) {
          return allHeadings.slice();
        }
        else {
          if ( configLength === 1 ) {
            return allHeadings.slice( configIndexStart );
          }
          else {

            configStringEnd = headingConfigStrings[ configLength - 1 ];
            configIndexEnd = allHeadings.indexOf( configStringEnd );

            if ( configIndexEnd === -1 ) {
              return allHeadings.slice();
            }
            else {
              return allHeadings.slice( configIndexStart, configIndexEnd + 1 );
            }
          }
        }
      }

      return allHeadings.slice();
    },

    isHeadingElement: function ( name ) {
      return ( allHeadings.indexOf( name ) >= 0 );
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

      var lastHeading = null,
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

      if ( lastHeading === null )
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

/**
* @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'heading', {
  requires: 'a11yfirst,richcombo',

  // jscs:disable maximumLineLength
  lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
  // jscs:enable maximumLineLength

  init: function( editor ) {
    if ( editor.blockless )
      return;

    var config = editor.config,
        lang = editor.lang.heading;

    // Initialize heading list menuitem
    var outlineCmd = 'headingOutline';
    CKEDITOR.dialog.add( outlineCmd, this.path + 'dialogs/heading_outline.js' );
    editor.addCommand( outlineCmd, new CKEDITOR.dialogCommand( outlineCmd ) );

    // Initialize help menuitem
    var helpCmd = 'headingHelp';

    CKEDITOR.dialog.add( helpCmd, this.path + 'dialogs/heading_help.js' );
    editor.addCommand( helpCmd, new CKEDITOR.dialogCommand( helpCmd ) );

    // Get the list of tags from the settings.
    var tags = config.heading_tags.split( ';' );

    // Create style objects for all defined styles.
    var menuStyle = new CKEDITOR.style( config.heading_menuitem_style );

    var headingStyles = {},
      stylesCount = 0,
      allowedContent = [];

    for ( var i = 0; i < tags.length; i++ ) {
      var tag = tags[ i ];
      var style = new CKEDITOR.style( config[ 'heading_' + tag ] );
      if ( !editor.filter.customConfig || editor.filter.check( style ) ) {
        stylesCount++;
        headingStyles[ tag ] = style;
        headingStyles[ tag ]._.enterMode = editor.config.enterMode;
        allowedContent.push( style );
      }
    }

    // Hide entire combo when all heading formats are rejected.
    if ( stylesCount === 0 )
      return;

    editor.ui.addRichCombo( 'Heading', {
      label: lang.label,
      title: lang.panelTitle,
      toolbar: 'styles,20',
      allowedContent: allowedContent,

      panel: {
        css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss ),
        multiSelect: false,
        attributes: { 'aria-label': lang.panelTitle }
      },

      init: function() {
        var label;

        for ( var tag in headingStyles ) {
          label = lang[ 'level_' + tag ];

          // Add separator before 'Remove format' menuitem
          if (tag == 'p') this.addSeparator();

          // Add the tag entry to the panel list.
          this.add( tag, menuStyle.buildPreview( label ), label );
        }

        label = lang[ 'outlineLabel' ];
        this.add( outlineCmd, menuStyle.buildPreview( label ), label );

        label = lang[ 'helpLabel' ];
        this.add( helpCmd, menuStyle.buildPreview( label ), label );
      },

      onClick: function( value ) {
        if ( value == helpCmd ) {
          editor.execCommand( helpCmd );
          return;
        }

        if ( value == outlineCmd ) {
          editor.execCommand( outlineCmd );
          return;
        }

        editor.focus();
        editor.fire( 'saveSnapshot' );

        var style = new CKEDITOR.style( config[ 'heading_' + value ] ),
            elementPath = editor.elementPath();

        editor[ style.checkActive( elementPath, editor ) ? 'removeStyle' : 'applyStyle' ]( style );

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
        // The value of getAllowedHeadings is dependent on the
        // current selection, so it needs to be called here...
        var allowedHeadings = this.getAllowedHeadings().split( ';' );
        var elementPath = editor.elementPath();

        // Start by showing all menuitems ...
        this.showAll();

        // Then selectively hide or mark each menuitem
        for ( var tag in headingStyles ) {
          var style = headingStyles[ tag ];

          // Check if that style is enabled in activeFilter
          if ( !editor.activeFilter.check( style ) )
            this.hideItem( tag );

          // If tag is in the current element path...
          if ( elementPath && elementPath.contains( tag ) ) {
            // If it is the 'p' tag, which corresponds to the 'Remove format'
            // menuitem, hide it; otherwise, whether it is an allowed heading
            // or not, keep it in the menu and highlight it to show it is
            // currently selected.
            if ( tag == 'p' ) this.hideItem ( tag );
            else this.mark( tag );
          }
          else {
            // The tag is not in the current element path. If it is a heading
            // tag but is not an allowed heading, hide its menuitem.
            if ( tag != 'p' && allowedHeadings.indexOf( tag ) == -1 )
              this.hideItem( tag );
          }
        }

      },

      refresh: function() {
        var elementPath = editor.elementPath();

        if ( !elementPath )
            return;

        // Check if element path contains 'p' element.
        if ( !elementPath.isContextFor( 'p' ) ) {
          this.setState( CKEDITOR.TRISTATE_DISABLED );
          return;
        }

        // Check if there is any available style.
        for ( var name in headingStyles ) {
          if ( editor.activeFilter.check( headingStyles[ name ] ) )
            return;
        }
        this.setState( CKEDITOR.TRISTATE_DISABLED );
      },

      getAllowedHeadings: function () {
        var selectedElement = editor.getSelection().getStartElement();
        // console.log('SELECTED ELEMENT: ' + selectedElement.getName() );

        var lastHeading = undefined;

        getLastHeading( editor.document.getBody() );
        // console.log( 'LAST HEADING: ' + lastHeading );

        switch ( lastHeading ) {
          case undefined:
            return 'h1;h2';
          case 'h1':
            return 'h2';
          case 'h2':
            return 'h2;h3';
          case 'h3':
            return 'h2;h3;h4';
          case 'h4':
            return 'h2;h3;h4;h5';
          case 'h5':
            return 'h2;h3;h4;h5;h6';
          case 'h6':
            return 'h2;h3;h4;h5;h6';
        }

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
          // console.log( 'In getLastHeading: ' + tagName );

          switch ( tagName ) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
              lastHeading = tagName;
              break;
          }

          var children = element.getChildren();
          var count = children.count();

          for ( var i = 0; i < count; i++ ) {
            if ( getLastHeading( children.getItem( i ) ) )
              return true;
          }
          return false;

        } // end getLastHeading

      } // end getAllowedHeadings

    } );
  }
} );

/**
*   The style definition for menuitems in the Heading drop-down list:
*/
CKEDITOR.config.heading_menuitem_style = { element: 'p', attributes: { 'class': 'separator' } };

/**
*   The list of tags that will be applied to the document by the various menuitems
*   in the Heading drop-down list:
*/
CKEDITOR.config.heading_tags = 'h1;h2;h3;h4;h5;h6;p';

/**
*   The style definitions to be used to apply the corresponding heading format
*   when you select a menuitem in the Heading drop-down list.
*/
CKEDITOR.config.heading_h1 = { element: 'h1' };
CKEDITOR.config.heading_h2 = { element: 'h2' };
CKEDITOR.config.heading_h3 = { element: 'h3' };
CKEDITOR.config.heading_h4 = { element: 'h4' };
CKEDITOR.config.heading_h5 = { element: 'h5' };
CKEDITOR.config.heading_h6 = { element: 'h6' };
CKEDITOR.config.heading_p  = { element: 'p'  };


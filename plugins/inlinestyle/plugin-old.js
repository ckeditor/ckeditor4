/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'inlinestyle', {
  requires: 'richcombo,removeformat',
  // jscs:disable maximumLineLength
  lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
  // jscs:enable maximumLineLength

  init: function( editor ) {
    var config = editor.config,
      lang = editor.lang.inlinestyle,
      combo; // TODO: Is var needed?

    // Get the list of style tags from the settings.
    var tags = config.inlinestyle_tags.split( ';' );

    var menuStyle = new CKEDITOR.style( { element: 'p' } );
    var removeStylesCmd = 'removeFormat';

    var inlineStyles = {},
      stylesCount = 0,
      allowedContent = [];

    for ( var i = 0; i < tags.length; i++ ) {
      var tag = tags[ i ];
      var style = new CKEDITOR.style( config[ 'inlinestyle_' + tag ] );
      if ( !editor.filter.customConfig || editor.filter.check( style ) ) {
        stylesCount++;
        inlineStyles[ tag ] = style;
        inlineStyles[ tag ]._.enterMode = editor.config.enterMode;
        allowedContent.push( style );
      }
    }

    // Hide entire combo when all heading formats are rejected.
    if ( stylesCount === 0 )
      return;







/*
    editor.on( 'stylesSet', function( evt ) {
      var stylesDefinitions = evt.data.styles;

      if ( !stylesDefinitions )
        return;

      var style, styleName, styleType;

      // Put all styles into an Array.
      for ( var i = 0, count = stylesDefinitions.length; i < count; i++ ) {
        var styleDefinition = stylesDefinitions[ i ];

        if ( editor.blockless && ( styleDefinition.element in CKEDITOR.dtd.$block ) ||
          ( typeof styleDefinition.type == 'string' && !CKEDITOR.style.customHandlers[ styleDefinition.type ] ) ) {

          continue;
        }

        styleName = styleDefinition.name;
        style = new CKEDITOR.style( styleDefinition );

        if ( !editor.filter.customConfig || editor.filter.check( style ) ) {
          style._name = styleName;
          style._.enterMode = config.enterMode;
          // Get the type (which will be used to assign style to one of 3 groups) from assignedTo if it's defined.
          style._.type = styleType = style.assignedTo || style.type;

          // Weight is used to sort styles (#9029).
          style._.weight = i + ( styleType == CKEDITOR.STYLE_OBJECT ? 1 : styleType == CKEDITOR.STYLE_BLOCK ? 2 : 3 ) * 1000;

          styles[ styleName ] = style;
          stylesList.push( style );
          allowedContent.push( style );
        }
      }

      // Sorts the Array, so the styles get grouped by type in proper order (#9029).
      stylesList.sort( function( styleA, styleB ) {
        return styleA._.weight - styleB._.weight;
      } );
    } );
*/




    editor.ui.addRichCombo( 'InlineStyle', {
      label: lang.label,
      title: lang.panelTitle,
      toolbar: 'styles,10',
      allowedContent: allowedContent,

      panel: {
        css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss ),
        multiSelect: true,
        attributes: { 'aria-label': lang.panelTitle }
      },

      init: function() {

        var style, label;

        for ( var tag in inlineStyles ) {
          style = inlineStyles[ tag ];
          label = lang[ 'label_' + tag ];

          // Add the tag entry to the panel list.
          this.add( tag, style.buildPreview( label ), label );
        }

        label = lang[ 'removeStylesLabel' ];
        this.add( removeStylesCmd, menuStyle.buildPreview( label ), label );

        this.commit();

/*
        var style, styleName, lastType, type, i, count;

        // Loop over the Array, adding all items to the
        // combo.
        for ( i = 0, count = stylesList.length; i < count; i++ ) {
          style = stylesList[ i ];
          styleName = style._name;
          type = style._.type;

          if ( type != lastType ) {
            this.startGroup( lang[ 'panelTitle' + String( type ) ] );
            lastType = type;
          }

          this.add( styleName, style.type == CKEDITOR.STYLE_OBJECT ? styleName : style.buildPreview(), styleName );
        }
*/
      },

      onClick: function( value ) {
        editor.focus();
        editor.fire( 'saveSnapshot' );

        var style = inlineStyles[ value ],
          elementPath = editor.elementPath();

        // When more then one style from the same group is active ( which is not ok ),
        // remove all other styles from this group and apply selected style.
        if ( style.group && style.removeStylesFromSameGroup( editor ) ) {
          editor.applyStyle( style );
        } else {
          editor[ style.checkActive( elementPath, editor ) ? 'removeStyle' : 'applyStyle' ]( style );
        }

        editor.fire( 'saveSnapshot' );
      },

      onRender: function() {
        editor.on( 'selectionChange', function( ev ) {
          var currentLabel = this.getValue(),
            elementPath = ev.data.path,
            elements = elementPath.elements;

          // For each element into the elements path.
          for ( var i = 0, count = elements.length, element; i < count; i++ ) {
            element = elements[ i ];

            // Check if the element is removable by any of the styles.
            for ( var value in inlineStyles ) {
              // console.log( 'value: ' + value );
              if ( inlineStyles[ value ].checkElementRemovable( element, true, editor ) ) {
                var label = lang[ 'label_' + value ];
                if ( label != currentLabel )
                  this.setValue( label );
                return;
              }
            }
          }

          // If no styles match, just empty it.
          this.setValue( '' );
        }, this );
      },

      onOpen: function() {
        var selection = editor.getSelection(),
          element = selection.getSelectedElement(),
          elementPath = editor.elementPath( element ),
          counter = [ 0, 0, 0, 0 ];

        this.showAll();
        this.unmarkAll();
        for ( var name in inlineStyles ) {
          var style = inlineStyles[ name ],
            type = style._.type;

          if ( style.checkApplicable( elementPath, editor, editor.activeFilter ) )
            counter[ type ]++;
          else
            this.hideItem( name );

          if ( style.checkActive( elementPath, editor ) )
            this.mark( name );
        }

        if ( !counter[ CKEDITOR.STYLE_BLOCK ] )
          this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_BLOCK ) ] );

        if ( !counter[ CKEDITOR.STYLE_INLINE ] )
          this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_INLINE ) ] );

        if ( !counter[ CKEDITOR.STYLE_OBJECT ] )
          this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_OBJECT ) ] );
      },

      refresh: function() {
        var elementPath = editor.elementPath();

        if ( !elementPath )
          return;

        for ( var name in inlineStyles ) {
          var style = inlineStyles[ name ];

          if ( style.checkApplicable( elementPath, editor, editor.activeFilter ) )
            return;
        }
        this.setState( CKEDITOR.TRISTATE_DISABLED );
      },

      // Force a reload of the data
      reset: function() {
        if ( combo ) {
          delete combo._.panel;
          delete combo._.list;
          combo._.committed = 0;
          combo._.items = {};
          combo._.state = CKEDITOR.TRISTATE_OFF;
        }
        inlineStyles = {};
        stylesList = [];
      }
    } );
  }
} );

// List of tags that correspond to inline styles
CKEDITOR.config.inlinestyle_tags = 'strong;em;u;strike;sub;super';

// Inline style name to element mappings
CKEDITOR.config.inlinestyle_strong = { element: 'strong', overrides: 'b' };
CKEDITOR.config.inlinestyle_em =     { element: 'em' , overrides: 'i' };
CKEDITOR.config.inlinestyle_u =      { element: 'u' };
CKEDITOR.config.inlinestyle_strike = { element: 'strike' };
CKEDITOR.config.inlinestyle_sub =    { element: 'sub' };
CKEDITOR.config.inlinestyle_super =  { element: 'sup' };

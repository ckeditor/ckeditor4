/**
* Copyright (c) 2018 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.add( 'a11ystylescombo', {
  requires: 'removeformat,richcombo',
  // jscs:disable maximumLineLength
  lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
  // jscs:enable maximumLineLength

  init: function( editor ) {
    var config = editor.config,
      lang = editor.lang.a11ystylescombo,
      styles = {},
      stylesList = [],
      combo,
      allowedContent = [];

    // Load the separator script
    CKEDITOR.scriptLoader.load( this.path + 'js/separator.js' );

    var menuStyle = new CKEDITOR.style( { element: 'p' } ),
      removeStylesCmd = 'removeFormat', // Defined in removeformat plugin
      helpValue = 'inlineStyleHelp';

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
        var style, styleName, label, lastType, type, i, count;

        // Loop over the Array, adding all items to the
        // combo.
        for ( i = 0, count = stylesList.length; i < count; i++ ) {
          style = stylesList[ i ];
          styleName = style._name;
          type = style._.type;

          if ( type != lastType ) {
            // inlinestyle mod: we do not need panels with titles
            // this.startGroup( lang[ 'panelTitle' + String( type ) ] );
            lastType = type;
          }

          this.add( styleName, style.type == CKEDITOR.STYLE_OBJECT ? styleName : style.buildPreview(), styleName );
        }

        // Add separator between list of styles and 'Remove styles' menuitem
        this.addSeparator();

        label = lang[ 'removeStylesLabel' ];
        this.add( removeStylesCmd, menuStyle.buildPreview( label ), label );

        label = lang[ 'helpLabel' ];
        this.add( helpValue, menuStyle.buildPreview( label ), label );

        this.commit();
      },

      onClick: function( value ) {
        editor.focus();
        editor.fire( 'saveSnapshot' );

        if ( value == removeStylesCmd ) {
          editor.execCommand( removeStylesCmd );
          return;
        }

        if ( value == helpValue ) {
          var helpPlugin = CKEDITOR.plugins.get( 'a11yfirsthelp' );
          if (helpPlugin) {
            editor.a11yfirst.helpOption = 'InlineStyleHelp';
            editor.execCommand('a11yFirstHelpDialog');
          }
          else {
            alert(lang.helpNotFound)
          }
          return;
        }

        var style = styles[ value ],
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
          var currentValue = this.getValue(),
            elementPath = ev.data.path,
            elements = elementPath.elements;

          // For each element into the elements path.
          for ( var i = 0, count = elements.length, element; i < count; i++ ) {
            element = elements[ i ];

            // Check if the element is removable by any of
            // the styles.
            for ( var value in styles ) {
              if ( styles[ value ].checkElementRemovable( element, true, editor ) ) {
                if ( value != currentValue )
                  this.setValue( value );
                // Reinstate the CSS class that richcombo setValue removes to prevent
                // truncation of label text
                var textElement = this.document.getById( 'cke_' + this.id + '_text' );
                textElement.addClass( 'cke_combo_inlinelabel' );
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
        for ( var name in styles ) {
          var style = styles[ name ],
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

        for ( var name in styles ) {
          var style = styles[ name ];

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
        styles = {};
        stylesList = [];
      }
    } );
  }
} );

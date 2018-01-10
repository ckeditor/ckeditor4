/**
* Copyright (c) 2018 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.add( 'a11yformat', {
  requires: 'a11yfirsthelp,richcombo',

  // jscs:disable maximumLineLength
  lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
  // jscs:enable maximumLineLength

  init: function( editor ) {
    if ( editor.blockless )
      return;

    var config = editor.config,
      lang = editor.lang.a11yformat,
      helpValue = 'blockFormatHelp';

    // Load the separator script
    CKEDITOR.scriptLoader.load( this.path + 'js/separator.js' );

    // Gets the list of tags from the settings.
    var tags = config.format_tags.split( ';' );

    // Create style objects for all defined styles.
    var styles = {},
      stylesCount = 0,
      allowedContent = [];
    for ( var i = 0; i < tags.length; i++ ) {
      var tag = tags[ i ];
      var style = new CKEDITOR.style( config[ 'format_' + tag ] );
      if ( !editor.filter.customConfig || editor.filter.check( style ) ) {
        stylesCount++;
        styles[ tag ] = style;
        styles[ tag ]._.enterMode = editor.config.enterMode;
        allowedContent.push( style );
      }
    }

    // Hide entire combo when all formats are rejected.
    if ( stylesCount === 0 )
      return;

    editor.ui.addRichCombo( 'BlockFormat', {
      label: lang.label,
      title: lang.panelTitle,
      toolbar: 'blockformat',
      allowedContent: allowedContent,

      panel: {
        css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss ),
        multiSelect: false,
        attributes: { 'aria-label': lang.panelTitle }
      },

      init: function() {
        var label, menuStyle = new CKEDITOR.style( { element: 'p' } );

        for ( var tag in styles ) {
          label = lang[ 'tag_' + tag ];

          // Add the tag entry to the panel list.
          this.add( tag, styles[ tag ].buildPreview( label ), label );
        }

        // Add separator between list of styles and 'Help' menuitem
        this.addSeparator();

        label = lang[ 'helpLabel' ];
        this.add( helpValue, menuStyle.buildPreview( label ), label );
      },

      onClick: function( value ) {
        editor.focus();
        editor.fire( 'saveSnapshot' );

        if ( value == helpValue ) {
          editor.a11yfirst.helpOption = 'BlockFormatHelp';
          editor.execCommand('a11yFirstHelpDialog');
          return;
        }

        var style = styles[ value ],
          elementPath = editor.elementPath();

        editor[ style.checkActive( elementPath, editor ) ? 'removeStyle' : 'applyStyle' ]( style );

        // Save the undo snapshot after all changes are affected. (http://dev.ckeditor.com/ticket/4899)
        setTimeout( function() {
          editor.fire( 'saveSnapshot' );
        }, 0 );
      },

      onRender: function() {
        editor.on( 'selectionChange', function( ev ) {
          var currentTag = this.getValue(),
            elementPath = ev.data.path;

          this.refresh();

          for ( var tag in styles ) {
            if ( styles[ tag ].checkActive( elementPath, editor ) ) {
              if ( tag != currentTag )
                // Set the style item as active, but don't change the richcombo button label
                // this.setValue( tag, editor.lang.a11yformat[ 'tag_' + tag ] );
                this.setValue( tag, editor.lang.a11yformat[ 'label' ] );
                // Also reinstate the CSS class that richcombo setValue removes
                var textElement = this.document.getById( 'cke_' + this.id + '_text' );
                textElement.addClass( 'cke_combo_inlinelabel' );
              return;
            }
          }

          // If no styles match, just empty it.
          this.setValue( '' );

        }, this );
      },

      onOpen: function() {
        this.showAll();
        for ( var name in styles ) {
          var style = styles[ name ];

          // Check if that style is enabled in activeFilter.
          if ( !editor.activeFilter.check( style ) )
            this.hideItem( name );

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
        for ( var name in styles ) {
          if ( editor.activeFilter.check( styles[ name ] ) )
            return;
        }
        this.setState( CKEDITOR.TRISTATE_DISABLED );
      }
    } );
  }
} );

/**
 * A list of semicolon-separated style names (by default: tags) representing
 * the style definition for each entry to be displayed in the Format drop-down list
 * in the toolbar. Each entry must have a corresponding configuration in a
 * setting named `'format_(tagName)'`. For example, the `'p'` entry has its
 * definition taken from [config.format_p](#!/api/CKEDITOR.config-cfg-format_p).
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *    config.format_tags = 'p;h2;h3;pre';
 *
 * @cfg {String} [format_tags='p;h1;h2;h3;h4;h5;h6;pre;address;div']
 * @member CKEDITOR.config
 */
CKEDITOR.config.format_tags = 'p;pre;address;div';

/**
 * The style definition to be used to apply the `Normal` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *    config.format_p = { element: 'p', attributes: { 'class': 'normalPara' } };
 *
 * @cfg {Object} [format_p={ element: 'p' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.format_p = { element: 'p' };

/**
 * The style definition to be used to apply the `Normal (DIV)` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *    config.format_div = { element: 'div', attributes: { 'class': 'normalDiv' } };
 *
 * @cfg {Object} [format_div={ element: 'div' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.format_div = { element: 'div' };

/**
 * The style definition to be used to apply the `Formatted` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *    config.format_pre = { element: 'pre', attributes: { 'class': 'code' } };
 *
 * @cfg {Object} [format_pre={ element: 'pre' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.format_pre = { element: 'pre' };

/**
 * The style definition to be used to apply the `Address` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *    config.format_address = { element: 'address', attributes: { 'class': 'styledAddress' } };
 *
 * @cfg {Object} [format_address={ element: 'address' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.format_address = { element: 'address' };

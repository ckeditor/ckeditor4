/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'heading', {
    requires: 'richcombo',
    // jscs:disable maximumLineLength
    lang: 'en,en-au,en-ca,en-gb', // %REMOVE_LINE_CORE%
    // jscs:enable maximumLineLength
    init: function( editor ) {
        if ( editor.blockless )
            return;

        var config = editor.config,
            lang = editor.lang.heading; // [changed from 'format' to 'heading']


        // Initialize help
        var helpValue = "help";
        
        CKEDITOR.dialog.add(helpValue, this.path + 'dialogs/heading_help.js');

        editor.addCommand(helpValue, new CKEDITOR.dialogCommand( helpValue ));

        // Gets the list of values from the settings.
        var values = config.heading_values.split( ';' );

        // Create style objects for all defined styles.
        var menuStyles = {},
            stylesCount = 0,
            allowedContent = [];
        for ( var i = 0; i < values.length; i++ ) {
            var value = values[ i ];
            var style     = new CKEDITOR.style( config[ 'heading_menu_' + value ] ); 

            if ( !editor.filter.customConfig || editor.filter.check( style ) ) {
                stylesCount++;
                menuStyles[ value ] = style;
                menuStyles[ value ]._.enterMode = editor.config.enterMode;

                allowedContent.push( style );
            }
        }

        // Hide entire combo when all formats are rejected.
        if ( stylesCount === 0 )
            return;

        editor.ui.addRichCombo( 'Heading', {  // [changed from 'Format' to 'Heading']
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
                // this.startGroup( lang.panelTitle );  // [By not defining a group the richcombo box will not include an item that labels the group]

                for ( var value in menuStyles ) {

                    var label = lang[ 'level_' + value ]; // [changed from 'tag_' to 'level_']

                    // Add the tag entry to the panel list.
                    this.add( value, menuStyles[ value ].buildPreview( label ), label );
                }

                label = lang[ 'helpLabel'];

                this.add(helpValue, menuStyles["p"].buildPreview(label), label);                
            },

            onClick: function( value ) {

                if (value == helpValue) {
                    editor.execCommand(helpValue);
                    return
                } 

                editor.focus();
                editor.fire( 'saveSnapshot' );


                //  Changed the following line to apply the heading style, instead of the style used in the menu                 
                // var style = menuStyles[ value ],   
                var style = new CKEDITOR.style( config[ 'heading_' + value ]),
                    elementPath = editor.elementPath();

                editor[ style.checkActive( elementPath, editor ) ? 'removeStyle' : 'applyStyle' ]( style );

                // Save the undo snapshot after all changes are affected. (#4899)
                setTimeout( function() {
                    editor.fire( 'saveSnapshot' );
                }, 0 );
            },

            onOpen: function() {
                this.showAll();
                this.unmarkAll();

                var allowedHeadings = this.getAllowedHeadings();
                
                for ( var value in menuStyles ) {
                    var style = menuStyles[ value ];

                    // Check if that style is enabled in activeFilter.
                    if ( !editor.activeFilter.check( style ) )
                        this.hideItem( value );

                    // Check for headings to disable
                    if (value != 'p' && allowedHeadings.indexOf(value) < 0) {
                        this.hideItem(value);
                    }
 
                    // Mark any headings in current selection
                    if ( value != 'p' && this.elementPath && this.elementPath.contains(value)) {
                        this.mark( value ); 
                    }

                }

                editor.on( 'selectionChange', function( ev ) {
                    this.elementPath = ev.data.path;
                }, this);    
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
                for ( var name in menuStyles ) {
                    if ( editor.activeFilter.check( menuStyles[ name ] ) )
                        return;
                }
                this.setState( CKEDITOR.TRISTATE_DISABLED );
            },

            getAllowedHeadings: function () {

                function getLastHeading(e) {

                    if (typeof e.getName !== 'function') return false;

                    if (e.equals(selectedElement)) return true;

                    var n = e.getName();

                    if (n === 'body') allowedHeadings = 'h1;h2';
                    if (n === 'h2')   allowedHeadings = 'h1;h2;h3';
                    if (n === 'h3')   allowedHeadings = 'h1;h2;h3;h4';
                    if (n === 'h4')   allowedHeadings = 'h1;h2;h3;h4;h5';
                    if (n === 'h5')   allowedHeadings = 'h1;h2;h3;h4;h5;h6';
                    if (n === 'h6')   allowedHeadings = 'h1;h2;h3;h4;h5;h6';


                    var children = e.getChildren();
                    var count = children.count();

                    for (var i = 0; i < count; i++) {
                        if (getLastHeading(children.getItem(i))) return true;
                    }

                    return false;
                }

                var allowedHeadings = 'h2';

                var selection = editor.getSelection();

                var selectedElement = selection.getStartElement();

                getLastHeading(editor.document.getBody());
                //console.log('LAST HEADING: ' + lastHeading );

                return allowedHeadings;
            },

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
 *        config.format_tags = 'p;h2;h3;pre';
 *
 * @cfg {String} [format_tags='p;h1;h2;h3;h4;h5;h6;pre;address;div']
 * @member CKEDITOR.config
 */
CKEDITOR.config.heading_values = 'h2;h3;h4;h5;h6;p';

/**
 * The style definition to be used to apply the `Heading 1` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *        config.heading_h1 = { element: 'h1', attributes: { 'class': 'contentTitle1' } };
 *
 * @cfg {Object} [heading_h1={ element: 'h1' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.heading_h1 = { element: 'h1' };
CKEDITOR.config.heading_menu_h1 = { element: 'p' };

/**
 * The style definition to be used to apply the `Heading 2` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *        config.heading_h2 = { element: 'h2', attributes: { 'class': 'contentTitle2' } };
 *
 * @cfg {Object} [heading_h2={ element: 'h2' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.heading_h2 = { element: 'h2' };
CKEDITOR.config.heading_menu_h2 = { element: 'p' };

/**
 * The style definition to be used to apply the `Heading 3` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *        config.heading_h3 = { element: 'h3', attributes: { 'class': 'contentTitle3' } };
 *
 * @cfg {Object} [heading_h3={ element: 'h3' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.heading_h3 = { element: 'h3' };
CKEDITOR.config.heading_menu_h3 = { element: 'p' };

/**
 * The style definition to be used to apply the `Heading 4` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *        config.heading_h4 = { element: 'h4', attributes: { 'class': 'contentTitle4' } };
 *
 * @cfg {Object} [heading_h4={ element: 'h4' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.heading_h4 = { element: 'h4' };
CKEDITOR.config.heading_menu_h4 = { element: 'p' };

/**
 * The style definition to be used to apply the `Heading 5` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *        config.heading_h5 = { element: 'h5', attributes: { 'class': 'contentTitle5' } };
 *
 * @cfg {Object} [heading_h5={ element: 'h5' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.heading_h5 = { element: 'h5' };
CKEDITOR.config.heading_menu_h5 = { element: 'p' };

/**
 * The style definition to be used to apply the `Heading 6` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *        config.heading_h6 = { element: 'h6', attributes: { 'class': 'contentTitle6' } };
 *
 * @cfg {Object} [heading_h6={ element: 'h6' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.heading_h6 = { element: 'h6' };
CKEDITOR.config.heading_menu_h6 = { element: 'p' };

/**
 * The style definition to be used to apply the `Heading 6` format.
 *
 * Read more in the [documentation](#!/guide/dev_format)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/format.html).
 *
 *        config.heading_h6 = { element: 'h6', attributes: { 'class': 'contentTitle6' } };
 *
 * @cfg {Object} [heading_h6={ element: 'h6' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.heading_p = { element: 'p' };
CKEDITOR.config.heading_menu_p = { element: 'p' };

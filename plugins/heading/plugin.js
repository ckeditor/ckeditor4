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

		// Gets the list of values from the settings.
		var values = config.heading_values.split( ';' );

		// Create style objects for all defined styles.
		var menuStyles = {},
			stylesCount = 0,
			allowedContent = [];
		for ( var i = 0; i < values.length; i++ ) {
			var value = values[ i ];
			var style = new CKEDITOR.style( config[ 'heading_menu_' + value ] ); // [changed from 'format_' to 'heading_menu_']
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
			},

			onClick: function( value ) {
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

			onRender: function() {
				editor.on( 'selectionChange', function( ev ) {
					var currentTag = this.getValue(),
						elementPath = ev.data.path;

					this.refresh();

					// The following code updates the toolbar label, we don't want to do this
                    /*
					for ( var tag in menuStyles ) {
						if ( menuStyles[ tag ].checkActive( elementPath, editor ) ) {
							this.setValue( tag, this.label ); // [changed from 'tag_' to 'level_']
							return;
						}
					}
                    */

					// If no styles match, just empty it.
					this.setValue( '' );

				}, this );
			},

			onOpen: function() {
				this.showAll();
				for ( var name in menuStyles ) {
					var style = menuStyles[ name ];

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
				for ( var name in menuStyles ) {
					if ( editor.activeFilter.check( menuStyles[ name ] ) )
						return;
				}
				this.setState( CKEDITOR.TRISTATE_DISABLED );
			},

            getAllowedElements: function () {

                function getLastHeading(e) {

                    if (typeof e.getName !== 'function') return false;

                    //console.log('ELEMENT: ' + e.getName() + ' ' + selectedElement.getName() + ' ' + e.equals(selectedElement));

                    if (e.equals(selectedElement)) return true;

                    var n = e.getName();

                    if (n === 'body') lastHeading = 'h2;p;a;';
                    if (n === 'h2') lastHeading = 'h2;h3;p;';
                    if (n === 'h3') lastHeading = 'h3;h4;p;';
                    if (n === 'h4') lastHeading = 'h3;h4;h5;p;';
                    if (n === 'h5') lastHeading = 'h3;h4;h5;h6;p';
                    if (n === 'h6') lastHeading = 'h3;h4;h5;h6;p';

                    var children = e.getChildren();
                    var count = children.count();

                    for (var i = 0; i < count; i++) {
                        if (getLastHeading(children.getItem(i))) return true;
                    }

                    return false;
                }

                var elements = 'h2;';

                var lastHeading = '';

                var selection = editor.getSelection();
                //console.log('SELECTION: ' + selection );

                var selectedElement = selection.getStartElement();
                //console.log('SELECTED ELEMENT: ' + selectedElement.getName() );

                var element = editor.document.getBody();

                getLastHeading(element);
                //console.log('LAST HEADING: ' + lastHeading );

                elements += lastHeading + 'hx;';

                return elements;
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
 *		config.format_tags = 'p;h2;h3;pre';
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
 *		config.heading_h1 = { element: 'h1', attributes: { 'class': 'contentTitle1' } };
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
 *		config.heading_h2 = { element: 'h2', attributes: { 'class': 'contentTitle2' } };
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
 *		config.heading_h3 = { element: 'h3', attributes: { 'class': 'contentTitle3' } };
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
 *		config.heading_h4 = { element: 'h4', attributes: { 'class': 'contentTitle4' } };
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
 *		config.heading_h5 = { element: 'h5', attributes: { 'class': 'contentTitle5' } };
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
 *		config.heading_h6 = { element: 'h6', attributes: { 'class': 'contentTitle6' } };
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
 *		config.heading_h6 = { element: 'h6', attributes: { 'class': 'contentTitle6' } };
 *
 * @cfg {Object} [heading_h6={ element: 'h6' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.heading_p = { element: 'p' };
CKEDITOR.config.heading_menu_p = { element: 'p' };

/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.add( 'basicstyles', {
	// jscs:disable maximumLineLength
	lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
	// jscs:enable maximumLineLength
	icons: 'bold,italic,underline,strike,subscript,superscript', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	init: function( editor ) {
		var order = 0;
		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, buttonLabel, commandName, styleDefiniton ) {
				// Disable the command if no definition is configured.
				if ( !styleDefiniton )
					return;

				var style = new CKEDITOR.style( styleDefiniton ),
					forms = contentForms[ commandName ];

				// Put the style as the most important form.
				forms.unshift( style );

				// Listen to contextual style activation.
				editor.attachStyleStateChange( style, function( state ) {
					!editor.readOnly && editor.getCommand( commandName ).setState( state );
				} );

				// Create the command that can be used to apply the style.
				editor.addCommand( commandName, new CKEDITOR.styleCommand( style, {
					contentForms: forms
				} ) );

				// Register the button, if the button plugin is loaded.
				if ( editor.ui.addButton ) {
					editor.ui.addButton( buttonName, {
						isToggle: true,
						label: buttonLabel,
						command: commandName,
						toolbar: 'basicstyles,' + ( order += 10 )
					} );
				}
			};

		var contentForms = {
				bold: [
					'strong',
					'b',
					[ 'span', function( el ) {
						var fw = el.styles[ 'font-weight' ];
						return fw == 'bold' || +fw >= 700;
					} ]
				],

				italic: [
					'em',
					'i',
					[ 'span', function( el ) {
						return el.styles[ 'font-style' ] == 'italic';
					} ]
				],

				underline: [
					'u',
					[ 'span', function( el ) {
						return el.styles[ 'text-decoration' ] == 'underline';
					} ]
				],

				strike: [
					's',
					'strike',
					[ 'span', function( el ) {
						return el.styles[ 'text-decoration' ] == 'line-through';
					} ]
				],

				subscript: [
					'sub'
				],

				superscript: [
					'sup'
				]
			},
			config = editor.config,
			lang = editor.lang.basicstyles;

		addButtonCommand( 'Bold', lang.bold, 'bold', config.coreStyles_bold );
		addButtonCommand( 'Italic', lang.italic, 'italic', config.coreStyles_italic );
		addButtonCommand( 'Underline', lang.underline, 'underline', config.coreStyles_underline );
		addButtonCommand( 'Strike', lang.strike, 'strike', config.coreStyles_strike );
		addButtonCommand( 'Subscript', lang.subscript, 'subscript', config.coreStyles_subscript );
		addButtonCommand( 'Superscript', lang.superscript, 'superscript', config.coreStyles_superscript );

		editor.setKeystroke( [
			[ CKEDITOR.CTRL + 66 /*B*/, 'bold' ],
			[ CKEDITOR.CTRL + 73 /*I*/, 'italic' ],
			[ CKEDITOR.CTRL + 85 /*U*/, 'underline' ]
		] );
	},

	afterInit: function( editor ) {
		var subscriptCommand = editor.getCommand( 'subscript' );
		var superscriptCommand = editor.getCommand( 'superscript' );

		// Prevent adding subscript and superscript only when both buttons exists. (#5215)
		if ( subscriptCommand && superscriptCommand ) {
			editor.on( 'afterCommandExec', function( evt ) {
				if ( evt.data.name === 'subscript' ) {
					if ( superscriptCommand.state == CKEDITOR.TRISTATE_ON ) {
						removeSubSup( 'sup' );
					}
				} else if ( evt.data.name === 'superscript' ) {
					if ( subscriptCommand.state == CKEDITOR.TRISTATE_ON ) {
						removeSubSup( 'sub' );
					}
				}
			} );
		}

		function removeSubSup( elementName ) {
			var selection = editor.getSelection(),
				range = selection.getRanges()[ 0 ],
				style = new CKEDITOR.style( { element: elementName } );

			range.enlarge( CKEDITOR.ENLARGE_INLINE );

			var walker = new CKEDITOR.dom.walker( range ),
				element = range.startContainer;

			// Remove all subscript or superscript style within the range.
			while ( element ) {
				if ( element.$.nodeName.toLowerCase() === elementName ) {
					editor.removeStyle( style )
				}
				element = walker.next();
			}

			if ( elementName === 'sup' ) {
				superscriptCommand.setState( CKEDITOR.TRISTATE_OFF );
			} else {
				subscriptCommand.setState( CKEDITOR.TRISTATE_OFF );
			}

			editor.selectionChange();
		}
	}
} );

// Basic Inline Styles.

/**
 * The style definition that applies the **bold** style to the text.
 *
 * Read more in the {@glink features/basicstyles documentation}
 * and see the {@glink examples/basicstyles example}.
 *
 *		config.coreStyles_bold = { element: 'b', overrides: 'strong' };
 *
 *		config.coreStyles_bold = {
 *			element: 'span',
 *			attributes: { 'class': 'Bold' }
 *		};
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.coreStyles_bold = { element: 'strong', overrides: 'b' };

/**
 * The style definition that applies the *italics* style to the text.
 *
 * Read more in the {@glink features/basicstyles documentation}
 * and see the {@glink examples/basicstyles example}.
 *
 *		config.coreStyles_italic = { element: 'i', overrides: 'em' };
 *
 *		CKEDITOR.config.coreStyles_italic = {
 *			element: 'span',
 *			attributes: { 'class': 'Italic' }
 *		};
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.coreStyles_italic = { element: 'em', overrides: 'i' };

/**
 * The style definition that applies the <u>underline</u> style to the text.
 *
 * Read more in the {@glink features/basicstyles documentation}
 * and see the {@glink examples/basicstyles example}.
 *
 *		CKEDITOR.config.coreStyles_underline = {
 *			element: 'span',
 *			attributes: { 'class': 'Underline' }
 *		};
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.coreStyles_underline = { element: 'u' };

/**
 * The style definition that applies the <strike>strikethrough</strike> style to the text.
 *
 * Read more in the {@glink features/basicstyles documentation}
 * and see the {@glink examples/basicstyles example}.
 *
 *		CKEDITOR.config.coreStyles_strike = {
 *			element: 'span',
 *			attributes: { 'class': 'Strikethrough' },
 *			overrides: 'strike'
 *		};
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.coreStyles_strike = { element: 's', overrides: 'strike' };

/**
 * The style definition that applies the subscript style to the text.
 *
 * Read more in the {@glink features/basicstyles documentation}
 * and see the {@glink examples/basicstyles example}.
 *
 *		CKEDITOR.config.coreStyles_subscript = {
 *			element: 'span',
 *			attributes: { 'class': 'Subscript' },
 *			overrides: 'sub'
 *		};
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.coreStyles_subscript = { element: 'sub' };

/**
 * The style definition that applies the superscript style to the text.
 *
 * Read more in the {@glink features/basicstyles documentation}
 * and see the {@glink examples/basicstyles example}.
 *
 *		CKEDITOR.config.coreStyles_superscript = {
 *			element: 'span',
 *			attributes: { 'class': 'Superscript' },
 *			overrides: 'sup'
 *		};
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.coreStyles_superscript = { element: 'sup' };

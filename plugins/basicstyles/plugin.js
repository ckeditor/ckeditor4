/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
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
		// If disabled, sub and sub scripts can be applied to element simoultaneously.
		// The rest of that code takes care of toggling both elements (#5215).
		if ( !editor.config.coreStyles_toggleSubSup ) {
			return;
		}

		var subscriptCommand = editor.getCommand( 'subscript' ),
			superscriptCommand = editor.getCommand( 'superscript' );

		// Both commands are required for toggle operation.
		if ( !subscriptCommand || !superscriptCommand ) {
			return;
		}

		editor.on( 'afterCommandExec', function( evt ) {
			var commandName = evt.data.name;

			if ( commandName !== 'subscript' && commandName !== 'superscript' ) {
				return;
			}

			var executedCommand = commandName === 'subscript' ? subscriptCommand : superscriptCommand,
				otherCommand = commandName === 'subscript' ? superscriptCommand : subscriptCommand;

			// Disable the other command if both are enabled.
			if ( executedCommand.state === CKEDITOR.TRISTATE_ON && otherCommand.state === CKEDITOR.TRISTATE_ON ) {
				otherCommand.exec( editor );
				// Merge undo images, so toggle operation is treated as a single undo step.
				editor.fire( 'updateSnapshot' );
			}
		} );
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
 * @cfg {Object} [coreStyles_bold={ element: 'strong', overrides: 'b' }]
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
 * @cfg {Object} [coreStyles_italic={ element: 'em', overrides: 'i' }]
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
 * @cfg {Object} [coreStyles_underline={ element: 'u' }]
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
 * @cfg {Object} [coreStyles_strike={ element: 's', overrides: 'strike' }]
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
 * @cfg {Object} [coreStyles_subscript={ element: 'sub' }]
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
 * @cfg {Object} [coreStyles_superscript={ element: 'sup' }]
 * @member CKEDITOR.config
 */
CKEDITOR.config.coreStyles_superscript = { element: 'sup' };

/**
 * Disallow setting subscript and superscript simultaneously on the same element using UI buttons.
 *
 * By default, you can apply subscript and superscript styles to the same element. Enabling that option
 * will remove the superscript style when the subscript button is pressed and vice versa.
 *
 * @cfg {Boolean} [coreStyles_toggleSubSup=false]
 * @since 4.20.0
 * @member CKEDITOR.config
 */

CKEDITOR.config.coreStyles_toggleSubSup = false;

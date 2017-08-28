/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Plugin definition for the a11yhelp, which provides a dialog
 * with accessibility related help.
 */

( function() {
	var pluginName = 'a11yhelp',
		commandName = 'a11yHelp';

	CKEDITOR.plugins.add( pluginName, {
		requires: 'dialog',

		// List of available localizations.
		// jscs:disable
		availableLangs: { af:1,ar:1,az:1,bg:1,ca:1,cs:1,cy:1,da:1,de:1,'de-ch':1,el:1,en:1,'en-gb':1,eo:1,es:1,'es-mx':1,et:1,eu:1,fa:1,fi:1,fo:1,fr:1,'fr-ca':1,gl:1,gu:1,he:1,hi:1,hr:1,hu:1,id:1,it:1,ja:1,km:1,ko:1,ku:1,lt:1,lv:1,mk:1,mn:1,nb:1,nl:1,no:1,oc:1,pl:1,pt:1,'pt-br':1,ro:1,ru:1,si:1,sk:1,sl:1,sq:1,sr:1,'sr-latn':1,sv:1,th:1,tr:1,tt:1,ug:1,uk:1,vi:1,zh:1,'zh-cn':1 },
		// jscs:enable

		onLoad: function() {
			CKEDITOR.document.appendStyleSheet( CKEDITOR.getUrl( this.path + 'styles/a11yhelp.css' ) );
		},

		init: function( editor ) {
			var plugin = this;
			var langCode = editor.langCode;
			langCode =
				plugin.availableLangs[ langCode ] ? langCode :
				plugin.availableLangs[ langCode.replace( /-.*/, '' ) ] ? langCode.replace( /-.*/, '' ) :
				'en';
			CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( plugin.path + 'dialogs/lang/' + langCode + '.js' ), function() {
				editor.lang.a11yhelp = plugin.langEntries[ langCode ];

				editor.addCommand( commandName, new CKEDITOR.dialogCommand( commandName, {
					modes: { wysiwyg: 1, source: 1 },
					readOnly: 1,
					canUndo: false,
					label: editor.lang.a11yhelp.accessibilityCommandsLabels.generalTab
				} ) );

				editor.addCommand( 'keystrokesTab', new CKEDITOR.dialogCommand( commandName, {
					modes: { wysiwyg: 1, source: 1 },
					readOnly: 1,
					canUndo: false,
					label: editor.lang.a11yhelp.accessibilityCommandsLabels.keystrokesTab,
					tab: 'keystrokes'
				} ) );

				editor.setKeystroke( CKEDITOR.ALT + 48 /*0*/, 'a11yHelp' );
				CKEDITOR.dialog.add( commandName, plugin.path + 'dialogs/a11yhelp.js' );

				editor.setKeystroke( CKEDITOR.CTRL + 191 /*/*/, 'keystrokesTab' );
				CKEDITOR.dialog.add( 'keystrokesTab', plugin.path + 'dialogs/a11yhelp.js' );
			} );

			editor.on( 'ariaEditorHelpLabel', function( evt ) {
				evt.data.label = editor.lang.common.editorHelp;
			} );
		}
	} );

	/**
	 * Set of a11yHelp plugin helpers.
	 *
	 * @class
	 * @singleton
	 * @since 4.8.0
	 */
	CKEDITOR.plugins.a11yhelp = {
		/**
		 * Method creates key map object used by {@link CKEDITOR.plugins.a11yhelp#representKeystroke} to provide proper names for keys.
		 *
		 * @since 4.8.0
		 * @private
		 * @param {CKEDITOR.editor} editor Editor instance
		 * @returns {Object}
		 */
		_createKeyMap: ( function() {
			var keyMapCache;
			return function( editor ) {
				if ( !keyMapCache ) {
					var lang = editor.lang.a11yhelp,
						coreLang = editor.lang.common.keyboard;

					keyMapCache = {
						8: coreLang[ 8 ],
						9: lang.tab,
						13: coreLang[ 13 ],
						16: coreLang[ 16 ],
						17: coreLang[ 17 ],
						18: coreLang[ 18 ],
						19: lang.pause,
						20: lang.capslock,
						27: lang.escape,
						33: lang.pageUp,
						34: lang.pageDown,
						35: coreLang[ 35 ],
						36: coreLang[ 36 ],
						37: lang.leftArrow,
						38: lang.upArrow,
						39: lang.rightArrow,
						40: lang.downArrow,
						45: lang.insert,
						46: coreLang[ 46 ],
						91: lang.leftWindowKey,
						92: lang.rightWindowKey,
						93: lang.selectKey,
						96: lang.numpad0,
						97: lang.numpad1,
						98: lang.numpad2,
						99: lang.numpad3,
						100: lang.numpad4,
						101: lang.numpad5,
						102: lang.numpad6,
						103: lang.numpad7,
						104: lang.numpad8,
						105: lang.numpad9,
						106: lang.multiply,
						107: lang.add,
						109: lang.subtract,
						110: lang.decimalPoint,
						111: lang.divide,
						112: lang.f1,
						113: lang.f2,
						114: lang.f3,
						115: lang.f4,
						116: lang.f5,
						117: lang.f6,
						118: lang.f7,
						119: lang.f8,
						120: lang.f9,
						121: lang.f10,
						122: lang.f11,
						123: lang.f12,
						144: lang.numLock,
						145: lang.scrollLock,
						186: lang.semiColon,
						187: lang.equalSign,
						188: lang.comma,
						189: lang.dash,
						190: lang.period,
						191: lang.forwardSlash,
						192: lang.graveAccent,
						219: lang.openBracket,
						220: lang.backSlash,
						221: lang.closeBracket,
						222: lang.singleQuote
					};
					keyMapCache[ CKEDITOR.ALT ] = coreLang[ 18 ];
					keyMapCache[ CKEDITOR.SHIFT ] = coreLang[ 16 ];
					keyMapCache[ CKEDITOR.CTRL ] = CKEDITOR.env.mac ? coreLang[ 224 ] : coreLang[ 17 ];
				}
				return keyMapCache;
			};
		} )(),

		/**
		 * Return html which represent keystroke. Result is wrapped with `<kbd></kbd>` tags or other defined by the user.
		 *
		 * 		CKEDITOR.plugins.a11yhelp.representKeystroke( CKEDITOR.instances.editor, 4456496 );
		 * 		"<kbd><kbd>Alt</kbd>+<kbd>0</kbd></kbd>"
		 *
		 * @since 4.8.0
		 * @param {CKEDITOR.editor} editor Editor instance.
		 * @param {Number} keystroke Number which represent command keystroke.
		 * @param {String} [wrappingTag=kbd] Wrapping tag. It's inner string of tag: e.g. 'kbd' string in case of `<kbd></kbd>` tags pair.
		 * @returns {String} HTML code with key names wrapped with wrapping tag by default it is `<kbd></kbd>`.
		 */
		representKeystroke: function( editor, keystroke, wrappingTag ) {
			// CharCode <-> KeyChar.
			var keyMap = this._createKeyMap( editor );

			// Sort in desc.
			var modifiers = [ CKEDITOR.ALT, CKEDITOR.SHIFT, CKEDITOR.CTRL ];

			var quotient, modifier,
				presentation = [],
				openTag,
				closeTag;

			if ( wrappingTag === '' ) {
				openTag = '';
				closeTag = '';
			} else {
				if ( wrappingTag === undefined ) {
					wrappingTag = 'kbd';
				}
				openTag = '<' + wrappingTag + '>';
				closeTag = '</' + wrappingTag + '>';
			}

			for ( var i = 0; i < modifiers.length; i++ ) {
				modifier = modifiers[ i ];
				quotient = keystroke / modifiers[ i ];
				if ( quotient > 1 && quotient <= 2 ) {
					keystroke -= modifier;
					presentation.push( openTag + keyMap[ modifier ] + closeTag );
				}
			}
			presentation.push( openTag + ( keyMap[ keystroke ] || String.fromCharCode( keystroke ) ) + closeTag );

			return openTag + presentation.join( '+' ) + closeTag;
		}
	};
} )();

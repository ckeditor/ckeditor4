/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

// Register a plugin named "keystrokes".
CKEDITOR.plugins.add( 'keystrokes', {
	beforeInit: function( editor ) {
		/**
		 * Controls keystroke typing in this editor instance.
		 * @name CKEDITOR.editor.prototype.keystrokeHandler
		 * @type CKEDITOR.keystrokeHandler
		 * @example
		 */
		editor.keystrokeHandler = new CKEDITOR.keystrokeHandler( editor );

		editor.specialKeys = {};
	},

	init: function( editor ) {
		var keystrokesConfig = editor.config.keystrokes,
			blockedConfig = editor.config.blockedKeystrokes;

		var keystrokes = editor.keystrokeHandler.keystrokes,
			blockedKeystrokes = editor.keystrokeHandler.blockedKeystrokes;

		for ( var i = 0; i < keystrokesConfig.length; i++ )
			keystrokes[ keystrokesConfig[ i ][ 0 ] ] = keystrokesConfig[ i ][ 1 ];

		for ( i = 0; i < blockedConfig.length; i++ )
			blockedKeystrokes[ blockedConfig[ i ] ] = 1;
	}
});

/**
 * Controls keystroke typing in an editor instance.
 * @constructor
 * @param {CKEDITOR.editor} editor The editor instance.
 * @example
 */
CKEDITOR.keystrokeHandler = function( editor ) {
	if ( editor.keystrokeHandler )
		return editor.keystrokeHandler;

	/**
	 * List of keystrokes associated with commands. Each entry points to a
	 * command to be executed.
	 * @type Object
	 * @example
	 */
	this.keystrokes = {};

	/**
	 * List of keystrokes that should be blocked if not defined by
	 * the <code>{@link #keystrokes}</code> setting.
	 * In this way it is possible to block default browser behavior for those keystrokes.
	 * @type Object
	 * @example
	 */
	this.blockedKeystrokes = {};

	this._ = {
		editor: editor
	};

	return this;
};

(function() {
	var cancel;

	var onKeyDown = function( event ) {
			// The DOM event object is passed by the "data" property.
			event = event.data;

			var keyCombination = event.getKeystroke();
			var command = this.keystrokes[ keyCombination ];
			var editor = this._.editor;

			cancel = ( editor.fire( 'key', { keyCode: keyCombination } ) === true );

			if ( !cancel ) {
				if ( command ) {
					var data = { from: 'keystrokeHandler' };
					cancel = ( editor.execCommand( command, data ) !== false );
				}

				if ( !cancel ) {
					var handler = editor.specialKeys[ keyCombination ];
					cancel = ( handler && handler( editor ) === true );

					if ( !cancel )
						cancel = !!this.blockedKeystrokes[ keyCombination ];
				}
			}

			if ( cancel )
				event.preventDefault( true );

			return !cancel;
		};

	var onKeyPress = function( event ) {
			if ( cancel ) {
				cancel = false;
				event.data.preventDefault( true );
			}
		};

	CKEDITOR.keystrokeHandler.prototype = {
		/**
		 * Attaches this keystroke handle to a DOM object. Keystrokes typed
		 * over this object will be handled by this keystroke handler.
		 * @param {CKEDITOR.dom.domObject} domObject The DOM object to attach
		 *		to.
		 * @example
		 */
		attach: function( domObject ) {
			// For most browsers, it is enough to listen to the keydown event
			// only.
			domObject.on( 'keydown', onKeyDown, this );

			// Some browsers instead, don't cancel key events in the keydown, but in the
			// keypress. So we must do a longer trip in those cases.
			if ( CKEDITOR.env.opera || ( CKEDITOR.env.gecko && CKEDITOR.env.mac ) )
				domObject.on( 'keypress', onKeyPress, this );
		}
	};
})();

/**
 * A list of keystrokes to be blocked if not defined in the <code>{@link CKEDITOR.config.keystrokes}</code>
 * setting. In this way it is possible to block default browser behavior
 * for those keystrokes.
 * @type Array
 * @default (see example)
 * @example
 * // This is actually the default value.
 * config.blockedKeystrokes =
 * [
 *     CKEDITOR.CTRL + 66 &#47;*B*&#47;,
 *     CKEDITOR.CTRL + 73 &#47;*I*&#47;,
 *     CKEDITOR.CTRL + 85 &#47;*U*&#47;
 * ];
 */
CKEDITOR.config.blockedKeystrokes = [
	CKEDITOR.CTRL + 66 /*B*/,
	CKEDITOR.CTRL + 73 /*I*/,
	CKEDITOR.CTRL + 85 /*U*/
	];

/**
 * A list associating keystrokes with editor commands. Each element in the list
 * is an array where the first item is the keystroke, and the second is the
 * name of the command to be executed.
 * @type Array
 * @default (see example)
 * @example
 * // This is actually the default value.
 * config.keystrokes =
 * [
 *     [ CKEDITOR.ALT + 121 &#47;*F10*&#47;, 'toolbarFocus' ],
 *     [ CKEDITOR.ALT + 122 &#47;*F11*&#47;, 'elementsPathFocus' ],
 *
 *     [ CKEDITOR.SHIFT + 121 &#47;*F10*&#47;, 'contextMenu' ],
 *
 *     [ CKEDITOR.CTRL + 90 &#47;*Z*&#47;, 'undo' ],
 *     [ CKEDITOR.CTRL + 89 &#47;*Y*&#47;, 'redo' ],
 *     [ CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 &#47;*Z*&#47;, 'redo' ],
 *
 *     [ CKEDITOR.CTRL + 76 &#47;*L*&#47;, 'link' ],
 *
 *     [ CKEDITOR.CTRL + 66 &#47;*B*&#47;, 'bold' ],
 *     [ CKEDITOR.CTRL + 73 &#47;*I*&#47;, 'italic' ],
 *     [ CKEDITOR.CTRL + 85 &#47;*U*&#47;, 'underline' ],
 *
 *     [ CKEDITOR.ALT + 109 &#47;*-*&#47;, 'toolbarCollapse' ]
 * ];
 */
CKEDITOR.config.keystrokes = [
	[ CKEDITOR.ALT + 121 /*F10*/, 'toolbarFocus' ],
	[ CKEDITOR.ALT + 122 /*F11*/, 'elementsPathFocus' ],

	[ CKEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ],
	[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ],

	[ CKEDITOR.CTRL + 90 /*Z*/, 'undo' ],
	[ CKEDITOR.CTRL + 89 /*Y*/, 'redo' ],
	[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 /*Z*/, 'redo' ],

	[ CKEDITOR.CTRL + 76 /*L*/, 'link' ],

	[ CKEDITOR.CTRL + 66 /*B*/, 'bold' ],
	[ CKEDITOR.CTRL + 73 /*I*/, 'italic' ],
	[ CKEDITOR.CTRL + 85 /*U*/, 'underline' ],

	[ CKEDITOR.ALT + ( CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109 ) /*-*/, 'toolbarCollapse' ],
	[ CKEDITOR.ALT + 48 /*0*/, 'a11yHelp' ]
	];

/**
 * Fired when any keyboard key (or a combination of keys) is pressed in the editing area.
 * @name CKEDITOR.editor#key
 * @event
 * @param {Number} data.keyCode A number representing the key code (or
 *		key combination code). It is the sum of the current key code and the
 *		<code>{@link CKEDITOR.CTRL}</code>, <code>{@link CKEDITOR.SHIFT}</code>,
 *		and <code>{@link CKEDITOR.ALT}</code> constants, if those are pressed.
 */

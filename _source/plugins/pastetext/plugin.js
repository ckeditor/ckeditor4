/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @file Paste as plain text plugin
 */

(function() {
	// The pastetext command definition.
	var pasteTextCmd = {
		exec: function( editor ) {
			var clipboardText = CKEDITOR.tools.tryThese( function() {
				var clipboardText = window.clipboardData.getData( 'Text' );
				if ( !clipboardText )
					throw 0;
				return clipboardText;
			}, function() {
				window.netscape.security.PrivilegeManager.enablePrivilege( "UniversalXPConnect" );

				var clip = window.Components.classes[ "@mozilla.org/widget/clipboard;1" ].getService( window.Components.interfaces.nsIClipboard );
				var trans = window.Components.classes[ "@mozilla.org/widget/transferable;1" ].createInstance( window.Components.interfaces.nsITransferable );
				trans.addDataFlavor( "text/unicode" );
				clip.getData( trans, clip.kGlobalClipboard );

				var str = {},
					strLength = {},
					clipboardText;
				trans.getTransferData( "text/unicode", str, strLength );
				str = str.value.QueryInterface( window.Components.interfaces.nsISupportsString );
				clipboardText = str.data.substring( 0, strLength.value / 2 );
				return clipboardText;
			}
			// Any other approach that's working... 
			);

			if ( !clipboardText ) // Clipboard access privilege is not granted.
			{
				editor.openDialog( 'pastetext' );
				return false;
			} else
				editor.fire( 'paste', { 'text': clipboardText } );

			return true;
		}
	};

	function doInsertText( doc, text ) {
		// Native text insertion.
		if ( CKEDITOR.env.ie ) {
			var selection = doc.selection;
			if ( selection.type == 'Control' )
				selection.clear();
			selection.createRange().pasteHTML( text );
		} else
			doc.execCommand( 'inserthtml', false, text );
	}

	// Register the plugin.
	CKEDITOR.plugins.add( 'pastetext', {
		init: function( editor ) {
			var commandName = 'pastetext',
				command = editor.addCommand( commandName, pasteTextCmd );

			editor.ui.addButton( 'PasteText', {
				label: editor.lang.pasteText.button,
				command: commandName
			});

			CKEDITOR.dialog.add( commandName, CKEDITOR.getUrl( this.path + 'dialogs/pastetext.js' ) );

			if ( editor.config.forcePasteAsPlainText ) {
				// Intercept the default pasting process.
				editor.on( 'beforeCommandExec', function( evt ) {
					if ( evt.data.name == 'paste' ) {
						editor.execCommand( 'pastetext' );
						evt.cancel();
					}
				}, null, null, 0 );
			}
		},

		requires: [ 'clipboard' ]
	});

	function doEnter( editor, mode, times, forceMode ) {
		while ( times-- ) {
			CKEDITOR.plugins.enterkey[ mode == CKEDITOR.ENTER_BR ? 'enterBr' : 'enterBlock' ]
			( editor, mode, null, forceMode );
		}
	}

	CKEDITOR.editor.prototype.insertText = function( text ) {
		this.fire( 'saveSnapshot' );

		var mode = this.getSelection().getStartElement().hasAscendant( 'pre', true ) ? CKEDITOR.ENTER_BR : this.config.enterMode,
			isEnterBrMode = mode == CKEDITOR.ENTER_BR,
			doc = this.document.$,
			self = this,
			line;

		text = CKEDITOR.tools.htmlEncode( text.replace( /\r\n|\r/g, '\n' ) );

		var startIndex = 0;
		text.replace( /\n+/g, function( match, lastIndex ) {
			line = text.substring( startIndex, lastIndex );
			startIndex = lastIndex + match.length;
			line.length && doInsertText( doc, line );

			var lineBreakNums = match.length,
				// Duo consequence line-break as a enter block.
				enterBlockTimes = isEnterBrMode ? 0 : Math.floor( lineBreakNums / 2 ),
				// Per link-break as a enter br.
				enterBrTimes = isEnterBrMode ? lineBreakNums : lineBreakNums % 2;

			// Line-breaks are converted to editor enter key strokes.
			doEnter( self, mode, enterBlockTimes );
			doEnter( self, CKEDITOR.ENTER_BR, enterBrTimes, isEnterBrMode ? false : true );
		});

		// Insert the last text line of text.
		line = text.substring( startIndex, text.length );
		line.length && doInsertText( doc, line );

		this.fire( 'saveSnapshot' );
	};
})();


/**
 * Whether to force all pasting operations to insert on plain text into the
 * editor, loosing any formatting information possibly available in the source
 * text.
 * @name CKEDITOR.config.forcePasteAsPlainText
 * @type Boolean
 * @default false
 * @example
 * config.forcePasteAsPlainText = true;
 */

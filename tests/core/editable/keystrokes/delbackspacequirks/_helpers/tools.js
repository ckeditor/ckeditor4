/* exported quirksTools */

var quirksTools = ( function() {
	'use strict';

	var DEL = 46,
		BACKSPACE = 8,

		keyNames = {
			46: 'DEL',
			8: 'BACKSPACE'
		};

	// (#3819)
	function assertRemovingSpaces( keyCode, caretPosition ) {
		return function() {
			bender.editorBot.create( {
				name: 'editor' + new Date().getTime()
			}, function( bot ) {
				// Intentionally makes selection marker (`{}`) at the end.
				// If we put it in proper position at the beginning - content will be splited before key simulation.
				bender.tools.selection.setWithHtml( bot.editor, 'Hello&nbsp; World{}' );

				var editable = bot.editor.editable(),
					pContent = editable.findOne( 'p' ),
					initialChildCount = pContent.getChildCount(),
					childCountAfterKeyUsage,
					range = bot.editor.createRange();

				// Move caret to proper place in text.
				range.setStart( pContent.getFirst(), caretPosition );
				range.select();

				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: keyCode } ) );
				childCountAfterKeyUsage = pContent.getChildCount();

				assert.areEqual( initialChildCount, childCountAfterKeyUsage,
					'There should not be a node starting with whitespace after ' + keyNames[ keyCode ] + ' key.' );
			} );
		};
	}

	function assertKeystroke( key, keyModifiers, handled, html, expected ) {
		function decodeBoguses( html ) {
			return html.replace( /@/g, CKEDITOR.env.needsBrFiller ? '<br />' : '' );
		}

		return function() {
			var bot = this.editorBot,
				editor = bot.editor,
				handledNatively = 0;

			html = decodeBoguses( html );

			bender.tools.selection.setWithHtml( editor, html );

			var listener = editor.on( 'key', function() {
				++handledNatively;
			}, null, null, 999 );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
				keyCode: key,
				ctrlKey: keyModifiers & CKEDITOR.CTRL,
				shiftKey: keyModifiers & CKEDITOR.SHIFT
			} ) );

			var htmlWithSelection = bender.tools.selection.getWithHtml( editor );
			var message = '(' + keyNames[ key ] + ') Correct DOM state after the keystroke';

			assert.isInnerHtmlMatching(
				expected,
				htmlWithSelection,
				{ compareSelection: true, normalizeSelection: true },
				message
			);

			assert.areSame( handled, handledNatively, '(' + keyNames[ key ] + ') Keystroke handled by the browser' );

			listener.removeListener();
		};
	}

	function d() {
		return assertKeystroke.apply( this, [ DEL, 0, 0 ].concat( [].slice.call( arguments ) ) );
	}

	function b() {
		return assertKeystroke.apply( this, [ BACKSPACE, 0, 0 ].concat( [].slice.call( arguments ) ) );
	}

	// We need expected param, because in some cases selection normalization will change the input
	// selection markers. Therefore, in some cases we can't compare the result after with the input HTML.
	function bf( html, expected ) {
		if ( !expected ) {
			expected = html;
		}

		return assertKeystroke.apply( this, [ BACKSPACE, 0, 1, html, expected ] );
	}

	function df( html, expected ) {
		if ( !expected ) {
			expected = html;
		}

		return assertKeystroke.apply( this, [ DEL, 0, 1, html, expected ] );
	}

	return {
		DEL: DEL,
		BACKSPACE: BACKSPACE,

		assertKeystroke: assertKeystroke,
		d: d,
		b: b,

		assertRemovingSpaces: assertRemovingSpaces,

		// Calls d() and b() for the same arguments.
		bd: function() {
			var bfn = b.apply( this, arguments ),
				dfn = d.apply( this, arguments );

			return function() {
				bfn.call( this );
				dfn.call( this );
			};
		},

		bf: bf,
		df: df,

		// Calls df() and bf() for the same arguments.
		bdf: function() {
			var bffn = bf.apply( this, arguments ),
				dffn = df.apply( this, arguments );

			return function() {
				bffn.call( this );
				dffn.call( this );
			};
		}
	};
} )();

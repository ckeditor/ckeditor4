/* exported quirksTools */

var quirksTools = ( function() {
	'use strict';

	var DEL = 46,
		BACKSPACE = 8,

		keyNames = {
			46: 'DEL',
			8: 'BACKSPACE'
		};

	function assertKeystroke( key, keyModifiers, handled, html, expected, normalizeSelection ) {
		normalizeSelection = ( normalizeSelection === false ) ? false : true;

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
				{ compareSelection: true, normalizeSelection: normalizeSelection },
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

	function bf( html ) {
		return assertKeystroke.apply( this, [ BACKSPACE, 0, 1, html, html, false ] );
	}

	function df( html ) {
		return assertKeystroke.apply( this, [ DEL, 0, 1, html, html, false ] );
	}

	return {
		DEL: DEL,
		BACKSPACE: BACKSPACE,

		assertKeystroke: assertKeystroke,
		d: d,
		b: b,

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

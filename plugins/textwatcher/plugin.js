/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {

	CKEDITOR.plugins.add( 'textwatcher', {} );

	/**
	 * Class implementing a text watcher &mdash; a base for features like
	 * autocomplete. It fires the {@link #matched} and {@link #unmatched} events
	 * based on changes in the text and position of the caret in the editor.
	 *
	 * To check whether a text matches some criteria, the text watcher uses
	 * a callback function which should return the matching text and a {@link CKEDITOR.dom.range}
	 * for that text.
	 *
	 * Since the text watcher works on the DOM in which searching for text
	 * is pretty complicated, it is usually recommended to use the {@link CKEDITOR.plugins.textMatch#match}
	 * function.
	 *
	 * Example:
	 *
	 *		function textTestCallback( range ) {
	 *			// We don't want to autocomplete a non-empty selection.
	 *			if ( !range.collapsed ) {
	 *				return null;
	 *			}
	 *
	 *			// Use the textmatch plugin which does the tricky job of doing
	 *			// a text search in the DOM. The matchCallback function should return
	 *			// a matching fragment of the text.
	 *			return CKEDITOR.plugins.textMatch.match( range, matchCallback );
	 *		}
	 *
	 *		function matchCallback( text, offset ) {
	 *				// Get the text before the caret.
	 *			var left = text.slice( 0, offset ),
	 *				// Will look for an '@' character followed by word characters.
	 *				match = left.match( /@\w*$/ );
	 *
	 *			if ( !match ) {
	 *				return null;
	 *			}
	 *			return { start: match.index, end: offset };
	 *		}
	 *
	 *		// Initilize the text watcher.
	 *		var textWatcher = new CKEDITOR.plugins.textWatcher( editor, textTestCallback );
	 *		// Starts listening.
	 *		textWatcher.attach();
	 *
	 * @class CKEDITOR.plugins.textWatcher
	 * @mixins CKEDITOR.event
	 * @constructor Creates the text watcher instance.
	 * @param {CKEDITOR.editor} editor The editor instance to watch in.
	 * @param {Function} callback Callback executed when the text watcher
	 * thinks that something might have changed.
	 *
	 * ### Parameters
	 *
	 * * `{CKEDITOR.dom.range} range` The selection range.
	 *
	 * ### Returns
	 *
	 * * `{Object/null}` Matching text data (`null` if nothing matches).
	 *		* `{String} text` The matching text.
	 *		* `{CKEDITOR.dom.range} range` Range in the DOM for the text that matches.
	 */
	function TextWatcher( editor, callback ) {
		/**
		 * The editor instance which the text watcher watches.
		 *
		 * @readonly
		 * @property {CKEDITOR.editor}
		 */
		this.editor = editor;

		/**
		 * The last matched text.
		 *
		 * @readonly
		 * @property {String}
		 */
		this.lastMatched = null;

		/**
		 * Whether the next check should be ignored. See the {@link #consumeNext} method.
		 *
		 * @readonly
		 */
		this.ignoreNext = false;

		/**
		 * The callback passed to the {@link CKEDITOR.plugins.textWatcher} constructor.
		 *
		 * @readonly
		 * @property {Function}
		 */
		this.callback = callback;

		/**
		 * Keys that should be ignored by the {@link #check} method.
		 *
		 * @readonly
		 */
		this.ignoredKeys = {
			16: 1, // Shift
			17: 1, // Ctrl
			18: 1, // Alt
			91: 1 // Cmd
		};

		this._eventListeners = [];

		/**
		 * Event fired when the text starts matching and then on every change.
		 *
		 * @event matched
		 * @param {Object} data The value returned by the {@link #callback}.
		 * @param {String} data.text
		 * @param {CKEDITOR.dom.range} data.range
		 */

		/**
		 * Event fired when the text stops matching.
		 *
		 * @event unmatched
		 */
	}

	TextWatcher.prototype = {
		/**
		 * Attaches the text watcher to the {@link #editor}.
		 */
		attach: function() {
			var editor = this.editor;

			this._eventListeners.push( editor.on( 'contentDom', onContentDom, this ) );
			this._eventListeners.push( editor.on( 'focus', check, this ) );
			this._eventListeners.push( editor.on( 'blur', unmatch, this ) );
			this._eventListeners.push( editor.on( 'beforeModeUnload', unmatch, this ) );
			this._eventListeners.push( editor.on( 'setData', unmatch, this ) );
			this._eventListeners.push( editor.on( 'afterCommandExec', unmatch, this ) );

			// Attach if editor is already initialized.
			if ( editor.editable() ) {
				onContentDom.call( this );
			}

			return this;

			function onContentDom() {
				var editable = editor.editable();

				this._eventListeners.push( editable.attachListener( editable, 'keyup', check, this ) );
			}

			// CKEditor's event system has a limitation that one function (in this case this.check)
			// cannot be used as listener for the same event more than once. Hence, wrapper function.
			function check( evt ) {
				this.check( evt );
			}

			function unmatch() {
				this.unmatch();
			}
		},

		/**
		 * Triggers a text check. Fires {@link #matched} and {@link #unmatched} events.
		 * The {@link #matched} event will not be fired twice in a row for the same text
		 * unless the text watcher is {@link #unmatch reset}.
		 *
		 * @param {CKEDITOR.dom.event/CKEDITOR.eventInfo} [evt]
		 */
		check: function( evt ) {
			if ( this.ignoreNext ) {
				this.ignoreNext = false;
				return;
			}

			// Ignore control keys, so they don't trigger the check.
			if ( evt && evt.name == 'keyup' && ( evt.data.getKey() in this.ignoredKeys ) ) {
				return;
			}

			var sel = this.editor.getSelection();
			if ( !sel ) {
				return;
			}

			var selectionRange = sel.getRanges()[ 0 ];
			if ( !selectionRange ) {
				return;
			}

			var matched = this.callback( selectionRange );

			if ( matched ) {
				if ( matched.text == this.lastMatched ) {
					return;
				}

				this.lastMatched = matched.text;
				this.fire( 'matched', matched );
			} else if ( this.lastMatched ) {
				this.unmatch();
			}
		},

		/**
		 * Ignores the next {@link #check}.
		 *
		 * @chainable
		 */
		consumeNext: function() {
			this.ignoreNext = true;
			return this;
		},

		/**
		 * Resets the state and fires the {@link #unmatched} event.
		 *
		 * @chainable
		 */
		unmatch: function() {
			this.lastMatched = null;
			this.fire( 'unmatched' );
			return this;
		},

		/**
		 * Destroys the text watcher instance. The DOM event listeners will be cleaned up.
		 */
		destroy: function() {
			CKEDITOR.tools.array.forEach( this._eventListeners, function( obj ) {
				obj.removeListener();
			} );
		}
	};

	CKEDITOR.event.implementOn( TextWatcher.prototype );

	CKEDITOR.plugins.textWatcher = TextWatcher;

} )();

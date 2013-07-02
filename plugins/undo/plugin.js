/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Undo/Redo system for saving shapshot for document modification
 *		and other recordable changes.
 */

(function() {
	CKEDITOR.plugins.add( 'undo', {
		lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		icons: 'redo,redo-rtl,undo,undo-rtl', // %REMOVE_LINE_CORE%
		init: function( editor ) {
			var undoManager = new UndoManager( editor );

			var undoCommand = editor.addCommand( 'undo', {
				exec: function() {
					if ( undoManager.undo() ) {
						editor.selectionChange();
						this.fire( 'afterUndo' );
					}
				},
				state: CKEDITOR.TRISTATE_DISABLED,
				canUndo: false
			});

			var redoCommand = editor.addCommand( 'redo', {
				exec: function() {
					if ( undoManager.redo() ) {
						editor.selectionChange();
						this.fire( 'afterRedo' );
					}
				},
				state: CKEDITOR.TRISTATE_DISABLED,
				canUndo: false
			});

			editor.setKeystroke( [
				[ CKEDITOR.CTRL + 90 /*Z*/, 'undo' ],
				[ CKEDITOR.CTRL + 89 /*Y*/, 'redo' ],
				[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 /*Z*/, 'redo' ]
				] );

			undoManager.onChange = function() {
				undoCommand.setState( undoManager.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );
				redoCommand.setState( undoManager.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );
			};

			function recordCommand( event ) {
				// If the command hasn't been marked to not support undo.
				if ( undoManager.enabled && event.data.command.canUndo !== false )
					undoManager.save();
			}

			// We'll save snapshots before and after executing a command.
			editor.on( 'beforeCommandExec', recordCommand );
			editor.on( 'afterCommandExec', recordCommand );

			// Save snapshots before doing custom changes.
			editor.on( 'saveSnapshot', function( evt ) {
				undoManager.save( evt.data && evt.data.contentOnly );
			});

			// Registering keydown on every document recreation.(#3844)
			editor.on( 'contentDom', function() {
				editor.editable().on( 'keydown', function( event ) {
					// Do not capture CTRL hotkeys.
					if ( !event.data.$.ctrlKey && !event.data.$.metaKey )
						undoManager.type( event );
				});
			});

			// Always save an undo snapshot - the previous mode might have
			// changed editor contents.
			editor.on( 'beforeModeUnload', function() {
				editor.mode == 'wysiwyg' && undoManager.save( true );
			});

			function toggleUndoManager() {
				undoManager.enabled = editor.readOnly ? false : editor.mode == 'wysiwyg';
				undoManager.onChange();
			}

			// Make the undo manager available only in wysiwyg mode.
			editor.on( 'mode', toggleUndoManager );

			// Disable undo manager when in read-only mode.
			editor.on( 'readOnly', toggleUndoManager );

			if ( editor.ui.addButton ) {
				editor.ui.addButton( 'Undo', {
					label: editor.lang.undo.undo,
					command: 'undo',
					toolbar: 'undo,10'
				});

				editor.ui.addButton( 'Redo', {
					label: editor.lang.undo.redo,
					command: 'redo',
					toolbar: 'undo,20'
				});
			}

			/**
			 * Reset undo stack.
			 *
			 * @member CKEDITOR.editor
			 */
			editor.resetUndo = function() {
				// Reset the undo stack.
				undoManager.reset();

				// Create the first image.
				editor.fire( 'saveSnapshot' );
			};

			/**
			 * Amend the top of undo stack (last undo image) with the current DOM changes.
			 *
			 *		function() {
			 *			editor.fire( 'saveSnapshot' );
			 *			editor.document.body.append(...);
			 *			// Make new changes following the last undo snapshot part of it.
			 *			editor.fire( 'updateSnapshot' );
			 *			..
			 *		}
			 *
			 * @event updateSnapshot
			 * @member CKEDITOR.editor
 			 * @param {CKEDITOR.editor} editor This editor instance.
			 */
			editor.on( 'updateSnapshot', function() {
				if ( undoManager.currentImage )
					undoManager.update();
			});

			/**
			 * Lock manager to prevent any save/update operations.
			 *
			 * It's convenient to lock manager before doing DOM operations
			 * that shouldn't be recored (e.g. auto paragraphing).
			 *
			 * See {@link CKEDITOR.plugins.undo.UndoManager#lock} for more details.
			 *
			 * **Note:** In order to unlock the Undo Manager {@link #unlockSnapshot} has to be fired
			 * number of times `lockSnapshot` has been fired.
			 *
			 * @since 4.0
			 * @event lockSnapshot
			 * @member CKEDITOR.editor
 			 * @param {CKEDITOR.editor} editor This editor instance.
			 */
			editor.on( 'lockSnapshot', undoManager.lock, undoManager );

			/**
			 * Unlock manager and update latest snapshot.
			 *
			 * @since 4.0
			 * @event unlockSnapshot
			 * @member CKEDITOR.editor
 			 * @param {CKEDITOR.editor} editor This editor instance.
			 */
			editor.on( 'unlockSnapshot', undoManager.unlock, undoManager );
		}
	});

	CKEDITOR.plugins.undo = {};

	/**
	 * Undo snapshot which represents the current document status.
	 *
	 * @private
	 * @class CKEDITOR.plugins.undo.Image
	 * @constructor Creates an Image class instance.
	 * @param {CKEDITOR.editor} editor The editor instance on which the image is created.
	 */
	var Image = CKEDITOR.plugins.undo.Image = function( editor ) {
			this.editor = editor;

			editor.fire( 'beforeUndoImage' );

			var contents = editor.getSnapshot(),
				selection = contents && editor.getSelection();

			// In IE, we need to remove the expando attributes.
			CKEDITOR.env.ie && contents && ( contents = contents.replace( /\s+data-cke-expando=".*?"/g, '' ) );

			this.contents = contents;
			this.bookmarks = selection && selection.createBookmarks2( true );

			editor.fire( 'afterUndoImage' );
		};

	// Attributes that browser may changing them when setting via innerHTML.
	var protectedAttrs = /\b(?:href|src|name)="[^"]*?"/gi;

	Image.prototype = {
		equalsContent: function( otherImage ) {
			var thisContents = this.contents,
				otherContents = otherImage.contents;

			// For IE6/7 : Comparing only the protected attribute values but not the original ones.(#4522)
			if ( CKEDITOR.env.ie && ( CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat ) ) {
				thisContents = thisContents.replace( protectedAttrs, '' );
				otherContents = otherContents.replace( protectedAttrs, '' );
			}

			if ( thisContents != otherContents )
				return false;

			return true;
		},
		equalsSelection: function( otherImage ) {
			var bookmarksA = this.bookmarks,
				bookmarksB = otherImage.bookmarks;

			if ( bookmarksA || bookmarksB ) {
				if ( !bookmarksA || !bookmarksB || bookmarksA.length != bookmarksB.length )
					return false;

				for ( var i = 0; i < bookmarksA.length; i++ ) {
					var bookmarkA = bookmarksA[ i ],
						bookmarkB = bookmarksB[ i ];

					if ( bookmarkA.startOffset != bookmarkB.startOffset || bookmarkA.endOffset != bookmarkB.endOffset || !CKEDITOR.tools.arrayCompare( bookmarkA.start, bookmarkB.start ) || !CKEDITOR.tools.arrayCompare( bookmarkA.end, bookmarkB.end ) ) {
						return false;
					}
				}
			}

			return true;
		},
		equals: function( otherImage ) {
			return this.equalsContent( otherImage ) && this.equalsSelection( otherImage );
		}
	};

	/**
	 * Main logic for Redo/Undo feature.
	 *
	 * **Note:** This class isn't accessible from the global scope.
	 *
	 * @private
	 * @class CKEDITOR.plugins.undo.UndoManager
	 * @constructor Creates an UndoManager class instance.
	 * @param {CKEDITOR.editor} editor
	 */
	function UndoManager( editor ) {
		this.editor = editor;

		// Reset the undo stack.
		this.reset();
	}

	/* keyTypes:
		-1: delete (Backspace, Delete),
		 0: neutral (Home, F1, Shift),
		 1: character (a, 9, &) */
	var keyTypes = { 8: -1/*Backspace*/, 9: 0/*Tab*/, 13: 1/*Enter*/, 16: 0/*Shift*/, 17: 0/*Ctrl*/, 18: 0/*Alt*/, 19: 0/*Pause/Break*/, 20: 0/*Caps Lock*/, 27: 0/*Esc*/, 32: 1/*Space*/, 33: 0/*Page Up*/, 34: 0/*Page Down*/, 35: 0/*End*/, 36: 0/*Home*/, 37: 0/*Left*/, 38: 0/*Up*/, 39: 0/*Right*/, 40: 0/*Down*/, 45: 0/*Insert*/, 46: -1/*Delete*/, 48: 1/*0*/, 49: 1/*1*/, 50: 1/*2*/, 51: 1/*3*/, 52: 1/*4*/, 53: 1/*5*/, 54: 1/*6*/, 55: 1/*7*/, 56: 1/*8*/, 57: 1/*9*/, 65: 1/*A*/, 66: 1/*B*/, 67: 1/*C*/, 68: 1/*D*/, 69: 1/*E*/, 70: 1/*F*/, 71: 1/*G*/, 72: 1/*H*/, 73: 1/*I*/, 74: 1/*J*/, 75: 1/*K*/, 76: 1/*L*/, 77: 1/*M*/, 78: 1/*N*/, 79: 1/*O*/, 80: 1/*P*/, 81: 1/*Q*/, 82: 1/*R*/, 83: 1/*S*/, 84: 1/*T*/, 85: 1/*U*/, 86: 1/*V*/, 87: 1/*W*/, 88: 1/*X*/, 89: 1/*Y*/, 90: 1/*Z*/, 91: 0/*Windows*/, 93: 0/*Right Click*/, 96: 1/*Numpad 0*/, 97: 1/*Numpad 1*/, 98: 1/*Numpad 2*/, 99: 1/*Numpad 3*/, 100: 1/*Numpad 4*/, 101: 1/*Numpad 5*/, 102: 1/*Numpad 6*/, 103: 1/*Numpad 7*/, 104: 1/*Numpad 8*/, 105: 1/*Numpad 9*/, 106: 1/*Numpad **/, 107: 1/*Numpad +*/, 109: 1/*Numpad -*/, 110: 1/*Numpad .*/, 111: 1/*Numpad /*/, 112: 0/*F1*/, 113: 0/*F2*/, 114: 0/*F3*/, 115: 0/*F4*/, 116: 0/*F5*/, 117: 0/*F6*/, 118: 0/*F7*/, 119: 0/*F8*/, 120: 0/*F9*/, 121: 0/*F10*/, 122: 0/*F11*/, 123: 0/*F12*/, 144: 0/*Num Lock*/, 145: 0/*Scroll Lock*/, 182: 0/*My Computer*/, 183: 0/*My Calculator*/, 186: 1/*;*/, 187: 1/*=*/, 188: 1/*,*/, 189: 1/*-*/, 190: 1/*.*/, 191: 1/*/*/, 192: 1/*`*/, 219: 1/*[*/, 220: 1/*\\*/, 221: 1/*]*/, 222: 1/***/ };

	UndoManager.prototype = {
		/**
		 * When `locked` property is not `null` manager is locked, so
		 * operations like `save` or `update` are forbidden.
		 *
		 * Manager can be locked/unlocked by {@link #lock} and {@link #unlock} methods.
		 *
		 * @private
		 * @property {Object} [locked=null]
		 */

		/**
		 * Process undo system regard keystrikes.
		 * @param {CKEDITOR.dom.event} event
		 */
		type: function( event ) {
			var keystroke = event && event.data.getKey(),
				keyType = keystroke in keyTypes? keyTypes[ keystroke ]:0,
				isDeleteKey = keyType == -1,
				isNeutralKey = keyType == 0,
				isCharacterKey = keyType == 1,
				lastKeyType = keystroke in keyTypes? keyTypes[ keystroke ]:0,
				wasDeleteKey = lastKeyType == -1,
				wasNeutralKey = lastKeyType == 0,
				sameAsLastEditingKey = isDeleteKey && keystroke == this.lastKeystroke,

				// Create undo snap for every different modifier key.
				modifierSnapshot = ( isDeleteKey && !sameAsLastEditingKey ),
				// Create undo snap on the following cases:
				// 1. Just start to type .
				// 2. Typing some content after a modifier.
				// 3. Typing some content after make a visible selection.
				startedTyping = !( isNeutralKey || this.typing ) || ( isCharacterKey && ( wasDeleteKey || wasNeutralKey ) ),
				editor = this.editor;

			if ( startedTyping || modifierSnapshot ) {
				var beforeTypeImage = new Image( this.editor ),
					beforeTypeCount = this.snapshots.length;

				// Use setTimeout, so we give the necessary time to the
				// browser to insert the character into the DOM.
				CKEDITOR.tools.setTimeout( function() {
					var currentSnapshot = this.editor.getSnapshot();

					// In IE, we need to remove the expando attributes.
					if ( CKEDITOR.env.ie )
						currentSnapshot = currentSnapshot.replace( /\s+data-cke-expando=".*?"/g, '' );

					// If changes have taken place, while not been captured yet (#8459),
					// compensate the snapshot.
					if ( beforeTypeImage.contents != currentSnapshot && beforeTypeCount == this.snapshots.length ) {
						// It's safe to now indicate typing state.
						this.typing = true;

						// This's a special save, with specified snapshot
						// and without auto 'fireChange'.
						if ( !this.save( false, beforeTypeImage, false ) )
							// Drop future snapshots.
							this.snapshots.splice( this.index + 1, this.snapshots.length - this.index - 1 );

						this.hasUndo = true;
						this.hasRedo = false;

						this.typesCount = 1;
						this.modifiersCount = 1;

						this.onChange();
					}
				}, 0, this );
			}

			this.lastKeystroke = keystroke;

			// Create undo snap after typed too much (over 25 times).
			if ( isDeleteKey ) {
				this.typesCount = 0;
				this.modifiersCount++;

				if ( this.modifiersCount > 25 ) {
					this.save( false, null, false );
					this.modifiersCount = 1;
				} else {
					setTimeout(function() {
						editor.fire( 'change' );
					}, 0 );
				}
			} else if ( isCharacterKey ) {
				this.modifiersCount = 0;
				this.typesCount++;

				if ( this.typesCount > 25 ) {
					this.save( false, null, false );
					this.typesCount = 1;
				} else {
					setTimeout(function() {
						editor.fire( 'change' );
					}, 0 );
				}
			}

		},

		/**
		 * Reset the undo stack.
		 */
		reset: function() {
			// Remember last pressed key.
			this.lastKeystroke = 0;

			// Stack for all the undo and redo snapshots, they're always created/removed
			// in consistency.
			this.snapshots = [];

			// Current snapshot history index.
			this.index = -1;

			this.limit = this.editor.config.undoStackSize || 20;

			this.currentImage = null;

			this.hasUndo = false;
			this.hasRedo = false;
			this.locked = null;

			this.resetType();
		},

		/**
		 * Reset all states about typing.
		 *
		 * @see #type
		 */
		resetType: function() {
			this.typing = false;
			delete this.lastKeystroke;
			this.typesCount = 0;
			this.modifiersCount = 0;
		},

		fireChange: function() {
			this.hasUndo = !!this.getNextImage( true );
			this.hasRedo = !!this.getNextImage( false );
			// Reset typing
			this.resetType();
			this.onChange();
		},

		/**
		 * Save a snapshot of document image for later retrieve.
		 */
		save: function( onContentOnly, image, autoFireChange ) {
			// Do not change snapshots stack when locked.
			if ( this.locked )
				return false;

			var snapshots = this.snapshots;

			// Get a content image.
			if ( !image )
				image = new Image( this.editor );

			// Do nothing if it was not possible to retrieve an image.
			if ( image.contents === false )
				return false;

			// Check if this is a duplicate. In such case, do nothing.
			if ( this.currentImage ) {
				var equalContent = image.equalsContent( this.currentImage ),
				    equalSelection = image.equalsSelection( this.currentImage );

				if ( equalContent )
					return false;

				this.editor.fire( 'change' );

				if ( !onContentOnly && equalContent && equalSelection )
					return false;
			}

			// Drop future snapshots.
			snapshots.splice( this.index + 1, snapshots.length - this.index - 1 );

			// If we have reached the limit, remove the oldest one.
			if ( snapshots.length == this.limit )
				snapshots.shift();

			// Add the new image, updating the current index.
			this.index = snapshots.push( image ) - 1;

			this.currentImage = image;

			if ( autoFireChange !== false )
				this.fireChange();
			return true;
		},

		restoreImage: function( image ) {
			// Bring editor focused to restore selection.
			var editor = this.editor,
				sel;

			if ( image.bookmarks ) {
				editor.focus();
				// Retrieve the selection beforehand. (#8324)
				sel = editor.getSelection();
			}

			// Start transaction - do not allow any mutations to the
			// snapshots stack done when selecting bookmarks (much probably
			// by selectionChange listener).
			this.locked = 1;

			this.editor.loadSnapshot( image.contents );

			if ( image.bookmarks )
				sel.selectBookmarks( image.bookmarks );
			else if ( CKEDITOR.env.ie ) {
				// IE BUG: If I don't set the selection to *somewhere* after setting
				// document contents, then IE would create an empty paragraph at the bottom
				// the next time the document is modified.
				var $range = this.editor.document.getBody().$.createTextRange();
				$range.collapse( true );
				$range.select();
			}

			this.locked = 0;

			this.index = image.index;

			// Update current image with the actual editor
			// content, since actualy content may differ from
			// the original snapshot due to dom change. (#4622)
			this.update();
			this.fireChange();

			editor.fire( 'change' );
		},

		// Get the closest available image.
		getNextImage: function( isUndo ) {
			var snapshots = this.snapshots,
				currentImage = this.currentImage,
				image, i;

			if ( currentImage ) {
				if ( isUndo ) {
					for ( i = this.index - 1; i >= 0; i-- ) {
						image = snapshots[ i ];
						if ( !currentImage.equalsContent( image ) ) {
							image.index = i;
							return image;
						}
					}
				} else {
					for ( i = this.index + 1; i < snapshots.length; i++ ) {
						image = snapshots[ i ];
						if ( !currentImage.equalsContent( image ) ) {
							image.index = i;
							return image;
						}
					}
				}
			}

			return null;
		},

		/**
		 * Check the current redo state.
		 *
		 * @returns {Boolean} Whether the document has previous state to retrieve.
		 */
		redoable: function() {
			return this.enabled && this.hasRedo;
		},

		/**
		 * Check the current undo state.
		 *
		 * @returns {Boolean} Whether the document has future state to restore.
		 */
		undoable: function() {
			return this.enabled && this.hasUndo;
		},

		/**
		 * Perform undo on current index.
		 */
		undo: function() {
			if ( this.undoable() ) {
				this.save( true );

				var image = this.getNextImage( true );
				if ( image )
					return this.restoreImage( image ), true;
			}

			return false;
		},

		/**
		 * Perform redo on current index.
		 */
		redo: function() {
			if ( this.redoable() ) {
				// Try to save. If no changes have been made, the redo stack
				// will not change, so it will still be redoable.
				this.save( true );

				// If instead we had changes, we can't redo anymore.
				if ( this.redoable() ) {
					var image = this.getNextImage( false );
					if ( image )
						return this.restoreImage( image ), true;
				}
			}

			return false;
		},

		/**
		 * Update the last snapshot of the undo stack with the current editor content.
		 */
		update: function() {
			// Do not change snapshots stack is locked.
			if ( !this.locked )
				this.snapshots.splice( this.index, 1, ( this.currentImage = new Image( this.editor ) ) );
		},

		/**
		 * Lock the snapshot stack to prevent any save/update operations, and additionally
		 * update the tip snapshot with the DOM changes during the locked period when necessary,
		 * after the {@link #unlock} method is called.
		 *
		 * It's mainly used for ensure any DOM operations that shouldn't be recorded (e.g. auto paragraphing).
		 *
		 * **Note:** For every `lock` call you must call {@link #unlock} once to unlock the Undo Manager.
		 *
		 * @since 4.0
		 */
		lock: function() {
			if ( !this.locked ) {
				var imageBefore = new Image( this.editor );

				// If current editor content matches the tip of snapshot stack,
				// the stack tip must be updated by unlock, to include any changes made
				// during this period.
				var matchedTip = this.currentImage && this.currentImage.equalsContent( imageBefore );

				this.locked = { update: matchedTip ? imageBefore : null, level: 1 };
			}
			// Increase the level of lock.
			else
				this.locked.level++;
		},

		/**
		 * Unlock the snapshot stack and check to amend the last snapshot.
		 *
		 * See {@link #lock} for more details.
		 *
		 * @since 4.0
		 */
		unlock: function() {
			if ( this.locked ) {
				// Decrease level of lock and check if equals 0, what means that undoM is completely unlocked.
				if ( !--this.locked.level ) {
					var updateImage = this.locked.update;

					this.locked = null;

					if ( updateImage && !updateImage.equalsContent( new Image( this.editor ) ) )
						this.update();
				}
			}
		}
	};
})();

/**
 * The number of undo steps to be saved. The higher this setting value the more
 * memory is used for it.
 *
 *		config.undoStackSize = 50;
 *
 * @cfg {Number} [undoStackSize=20]
 * @member CKEDITOR.config
 */

/**
 * Fired when the editor is about to save an undo snapshot. This event can be
 * fired by plugins and customizations to make the editor saving undo snapshots.
 *
 * @event saveSnapshot
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired before an undo image is to be taken. An undo image represents the
 * editor state at some point. It's saved into an undo store, so the editor is
 * able to recover the editor state on undo and redo operations.
 *
 * @since 3.5.3
 * @event beforeUndoImage
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @see CKEDITOR.editor#afterUndoImage
 */

/**
 * Fired after an undo image is taken. An undo image represents the
 * editor state at some point. It's saved into an undo store, so the editor is
 * able to recover the editor state on undo and redo operations.
 *
 * @since 3.5.3
 * @event afterUndoImage
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @see CKEDITOR.editor#beforeUndoImage
 */

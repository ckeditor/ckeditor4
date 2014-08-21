/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Undo/Redo system for saving a shapshot for document modification
 *		and other recordable changes.
 */

'use strict';

( function() {
	var keystrokes = [ CKEDITOR.CTRL + 90 /*Z*/, CKEDITOR.CTRL + 89 /*Y*/, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 /*Z*/ ],
		backspaceOrDelete = { 8: 1, 46: 1 };

	CKEDITOR.plugins.add( 'undo', {
		lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		icons: 'redo,redo-rtl,undo,undo-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			var undoManager = editor.undoManager = new UndoManager( editor ),
				editingHandler = undoManager.editingHandler = new NativeEditingHandler( undoManager );

			var undoCommand = editor.addCommand( 'undo', {
				exec: function() {
					if ( undoManager.undo() ) {
						editor.selectionChange();
						this.fire( 'afterUndo' );
					}
				},
				startDisabled: true,
				canUndo: false
			} );

			var redoCommand = editor.addCommand( 'redo', {
				exec: function() {
					if ( undoManager.redo() ) {
						editor.selectionChange();
						this.fire( 'afterRedo' );
					}
				},
				startDisabled: true,
				canUndo: false
			} );

			editor.setKeystroke( [
				[ keystrokes[ 0 ], 'undo' ],
				[ keystrokes[ 1 ], 'redo' ],
				[ keystrokes[ 2 ], 'redo' ]
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
			} );

			// Event manager listeners should be attached on contentDom.
			editor.on( 'contentDom', editingHandler.attachListeners, editingHandler );

			editor.on( 'instanceReady', function() {
				// Saves initial snapshot.
				editor.fire( 'saveSnapshot' );
			} );

			// Always save an undo snapshot - the previous mode might have
			// changed editor contents.
			editor.on( 'beforeModeUnload', function() {
				editor.mode == 'wysiwyg' && undoManager.save( true );
			} );

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
				} );

				editor.ui.addButton( 'Redo', {
					label: editor.lang.undo.redo,
					command: 'redo',
					toolbar: 'undo,20'
				} );
			}

			/**
			 * Resets the undo stack.
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
			 * Amends the top of the undo stack (last undo image) with the current DOM changes.
			 *
			 *		function() {
			 *			editor.fire( 'saveSnapshot' );
			 *			editor.document.body.append(...);
			 *			// Makes new changes following the last undo snapshot a part of it.
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
			} );

			/**
			 * Locks the undo manager to prevent any save/update operations.
			 *
			 * It is convenient to lock the undo manager before performing DOM operations
			 * that should not be recored (e.g. auto paragraphing).
			 *
			 * See {@link CKEDITOR.plugins.undo.UndoManager#lock} for more details.
			 *
			 * **Note:** In order to unlock the undo manager, {@link #unlockSnapshot} has to be fired
			 * the same number of times that `lockSnapshot` has been fired.
			 *
			 * @since 4.0
			 * @event lockSnapshot
			 * @member CKEDITOR.editor
 			 * @param {CKEDITOR.editor} editor This editor instance.
			 * @param data
			 * @param {Boolean} [data.dontUpdate] When set to `true`, the last snapshot will not be updated
			 * with the current content and selection. Read more in the {@link CKEDITOR.plugins.undo.UndoManager#lock} method.
			 * @param {Boolean} [data.forceUpdate] When set to `true`, the last snapshot will always be updated
			 * with the current content and selection. Read more in the {@link CKEDITOR.plugins.undo.UndoManager#lock} method.
			 */
			editor.on( 'lockSnapshot', function( evt ) {
				var data = evt.data;
				undoManager.lock( data && data.dontUpdate, data && data.forceUpdate );
			} );

			/**
			 * Unlocks the undo manager and updates the latest snapshot.
			 *
			 * @since 4.0
			 * @event unlockSnapshot
			 * @member CKEDITOR.editor
 			 * @param {CKEDITOR.editor} editor This editor instance.
			 */
			editor.on( 'unlockSnapshot', undoManager.unlock, undoManager );
		}
	} );

	CKEDITOR.plugins.undo = {};

	/**
	 * Main logic for the Redo/Undo feature.
	 *
	 * @private
	 * @class CKEDITOR.plugins.undo.UndoManager
	 * @constructor Creates an UndoManager class instance.
	 * @param {CKEDITOR.editor} editor
	 */
	var UndoManager = CKEDITOR.plugins.undo.UndoManager = function( editor ) {
		this.editor = editor;

		// Reset the undo stack.
		this.reset();
	};

	UndoManager.prototype = {
		/**
		 * Key groups identifier mapping. Used for accessing members in
		 * {@link CKEDITOR.plugins.undo.NativeEditingHandler#strokesRecorded}.
		 *
		 * * `FUNCTIONAL` &ndash; identifier for the Backspace / Delete key.
		 * * `PRINTABLE` &ndash; identifier for printable keys.
		 *
		 * Example usage:
		 *
		 *		undoManager.strokesRecorded[ undoManager.keyGroupsEnum.FUNCTIONAL ];
		 *
		 * @since 4.4.4
		 * @readonly
		 */
		keyGroupsEnum: {
			PRINTABLE: 0,
			FUNCTIONAL: 1
		},

		/**
		 * An array storing the number of key presses, count in a row. Use {@link #keyGroupsEnum} members as index.
		 *
		 * **Note:** The keystroke count will be reset after reaching the limit of characters per snapshot.
		 *
		 * @since 4.4.4
		 * @readonly
		 */
		strokesRecorded: [ 0, 0 ],

		/**
		 * Codes for navigation keys like Arrows, Page Up/Down, etc.
		 * Used by the {@link #isNavigationKey} method.
		 *
		 * @since 4.4.4
		 * @readonly
		 */
		navigationKeyCodes: {
			37: 1, 38: 1, 39: 1, 40: 1, // Arrows.
			36: 1, 35: 1, // Home, end.
			33: 1, 34: 1 // Pgup, pgdn.
		},

		/**
		 * When the `locked` property is not `null`, the undo manager is locked, so
		 * operations like `save` or `update` are forbidden.
		 *
		 * The manager can be locked and unlocked by the {@link #lock} and {@link #unlock}
		 * methods, respectively.
		 *
		 * @readonly
		 * @property {Object} [locked=null]
		 */

		/**
		 * Contains the previously processed key group, based on {@link #keyGroupsEnum}.
		 * `-1` means an unknown group.
		 *
		 * @since 4.4.4
		 * @readonly
		 * @property {Number} [previousKeyGroup=-1]
		 */
		previousKeyGroup: -1,

		/**
		 * Handles keystroke support for the undo manager. It is called on `keyup` event for
		 * keystrokes that can change the editor content.
		 *
		 * @param {Number} keyCode The key code.
		 */
		type: function( keyCode ) {
			var keyGroupsEnum = this.keyGroupsEnum,
				keyGroup = backspaceOrDelete[ keyCode ] ? keyGroupsEnum.FUNCTIONAL : keyGroupsEnum.PRINTABLE,
				// Count of keystrokes in current a row.
				// Note if strokesPerSnapshotExceeded will be exceeded, it'll be restarted.
				strokesRecorded = this.strokesRecorded[ keyGroup ] + 1,
				keyGroupChanged = keyGroup !== this.previousKeyGroup,
				strokesPerSnapshotExceeded = strokesRecorded >= 25,
				// Identifier of opposite group, used later on to reset its counter.
				oppositeGroup = keyGroup == keyGroupsEnum.FUNCTIONAL ? keyGroupsEnum.PRINTABLE : keyGroupsEnum.FUNCTIONAL;

			if ( !this.typing )
				onTypingStart( this );

			if ( ( keyGroupChanged && this.previousKeyGroup !== -1 ) || strokesPerSnapshotExceeded ) {
				if ( keyGroupChanged ) {
					// Key group changed:
					// Reset the other key group recorded count.
					this.strokesRecorded[ oppositeGroup ] = 0;
					// In case of group changed we need to save snapshot before DOM modification,
					// consider: <p>ab^</p> when user was typing "ab", and is pressing backspace.
					// Since we're in keyup event, DOM is modified, and we have <p>a^</p> - thus
					// snapshot made in keydown, before modification.
					if ( !this.save( false, this.editingHandler.lastKeydownImage, false ) )
						// Drop further snapshots.
						this.snapshots.splice( this.index + 1, this.snapshots.length - this.index - 1 );
				} else {
					// Limit of chars in snapshot exceeded:
					// Reset the count of strokes, so it'll be later assigned to this.strokesRecorded.
					strokesRecorded = 0;

					this.editor.fire( 'saveSnapshot' );
					// Force typing state to be enabled. It was reset because saveSnapshot is calling this.reset().
					this.typing = true;
				}
			}

			// Store recorded strokes count.
			this.strokesRecorded[ keyGroup ] = strokesRecorded;
			// This prop will tell in next itaration what kind of group was processed previously.
			this.previousKeyGroup = keyGroup;
			// Fire change event.
			this.editor.fire( 'change' );
		},

		/**
		 * Resets the undo stack.
		 */
		reset: function() {
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
		 * Resets all typing variables.
		 *
		 * @see #type
		 */
		resetType: function() {
			this.strokesRecorded = [ 0, 0 ];
			this.typing = false;
			this.previousKeyGroup = -1;
		},

		/**
		 * Refreshes the state of the {@link CKEDITOR.plugins.undo.UndoManager undo manager}
		 * as well as the state of the `undo` and `redo` commands.
		 */
		refreshState: function() {
			// These lines can be handled within onChange() too.
			this.hasUndo = !!this.getNextImage( true );
			this.hasRedo = !!this.getNextImage( false );
			// Reset typing
			this.resetType();
			this.onChange();
		},

		/**
		 * Saves a snapshot of the document image for later retrieval.
		 *
		 * @param {Boolean} onContentOnly If set to `true`, the snapshot will be saved only if the content has changed.
		 * @param {CKEDITOR.plugins.undo.Image} image An optional image to save. If skipped, current editor will be used.
		 * @param {Boolean} autoFireChange If set to `false`, will not trigger the `{@link CKEDITOR.editor.change}` event to editor.
		 */
		save: function( onContentOnly, image, autoFireChange ) {
			var editor = this.editor;
			// Do not change snapshots stack when locked, editor is not ready,
			// editable is not ready or when editor is in mode difference than 'wysiwyg'.
			if ( this.locked || editor.status != 'ready' || editor.mode != 'wysiwyg' )
				return false;

			var editable = editor.editable();
			if ( !editable || editable.status != 'ready' )
				return false;

			var snapshots = this.snapshots;

			// Get a content image.
			if ( !image )
				image = new Image( editor );

			// Do nothing if it was not possible to retrieve an image.
			if ( image.contents === false )
				return false;

			// Check if this is a duplicate. In such case, do nothing.
			if ( this.currentImage ) {
				if ( image.equalsContent( this.currentImage ) ) {
					if ( onContentOnly )
						return false;

					if ( image.equalsSelection( this.currentImage ) )
						return false;
				} else if ( autoFireChange !== false )
					editor.fire( 'change' );
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
				this.refreshState();
			return true;
		},

		/**
		 * Sets editor content/selection to the one stored in `image`.
		 *
		 * @param {CKEDITOR.plugins.undo.UndoManager.Image} image
		 */
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
			this.locked = { level: 999 };

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

			this.locked = null;

			this.index = image.index;
			this.currentImage = this.snapshots[ this.index ];

			// Update current image with the actual editor
			// content, since actualy content may differ from
			// the original snapshot due to dom change. (#4622)
			this.update();
			this.refreshState();

			editor.fire( 'change' );
		},

		/**
		 * Gets the closest available image.
		 *
		 * @param {Boolean} isUndo If `true`, it will return the previous image.
		 * @returns {CKEDITOR.plugins.undo.Image} Next image or `null`.
		 */
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
		 * Checks the current redo state.
		 *
		 * @returns {Boolean} Whether the document has a previous state to retrieve.
		 */
		redoable: function() {
			return this.enabled && this.hasRedo;
		},

		/**
		 * Checks the current undo state.
		 *
		 * @returns {Boolean} Whether the document has a future state to restore.
		 */
		undoable: function() {
			return this.enabled && this.hasUndo;
		},

		/**
		 * Performs an undo operation on current index.
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
		 * Performs a redo operation on current index.
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
		 * Updates the last snapshot of the undo stack with the current editor content.
		 *
		 * @param {CKEDITOR.plugins.undo.Image} [newImage] The image which will replace the current one.
		 * If it is not set, it defaults to the image taken from the editor.
		 */
		update: function( newImage ) {
			// Do not change snapshots stack is locked.
			if ( this.locked )
				return;

			if ( !newImage )
				newImage = new Image( this.editor );

			var i = this.index,
				snapshots = this.snapshots;

			// Find all previous snapshots made for the same content (which differ
			// only by selection) and replace all of them with the current image.
			while ( i > 0 && this.currentImage.equalsContent( snapshots[ i - 1 ] ) )
				i -= 1;

			snapshots.splice( i, this.index - i + 1, newImage );
			this.index = i;
			this.currentImage = newImage;
		},

		/**
		 * Amends the last snapshot and changes its selection (only in case when content
		 * is equal between these two).
		 *
		 * @since 4.4.4
		 * @param {CKEDITOR.plugins.undo.Image} newSnapshot New snapshot with new selection.
		 * @returns {Boolean} Returns `true` if selection was amended.
		 */
		updateSelection: function( newSnapshot ) {
			if ( !this.snapshots.length )
				return false;

			var snapshots = this.snapshots,
				lastImage = snapshots[ snapshots.length - 1 ];

			if ( lastImage.equalsContent( newSnapshot ) ) {
				if ( !lastImage.equalsSelection( newSnapshot ) ) {
					snapshots[ snapshots.length - 1 ] = newSnapshot;
					this.currentImage = newSnapshot;
					return true;
				}
			}

			return false;
		},

		/**
		 * Locks the snapshot stack to prevent any save/update operations and when necessary,
		 * updates the tip of the snapshot stack with the DOM changes introduced during the
		 * locked period, after the {@link #unlock} method is called.
		 *
		 * It is mainly used to ensure any DOM operations that should not be recorded
		 * (e.g. auto paragraphing) are not added to the stack.
		 *
		 * **Note:** For every `lock` call you must call {@link #unlock} once to unlock the undo manager.
		 *
		 * @since 4.0
		 * @param {Boolean} [dontUpdate] When set to `true`, the last snapshot will not be updated
		 * with current content and selection. By default, if undo manager was up to date when the lock started,
		 * the last snapshot will be updated to the current state when unlocking. This means that all changes
		 * done during the lock will be merged into the previous snapshot or the next one. Use this option to gain
		 * more control over this behavior. For example, it is possible to group changes done during the lock into
		 * a separate snapshot.
		 * @param {Boolean} [forceUpdate] When set to `true`, the last snapshot will always be updated with the
		 * current content and selection regardless of the current state of the undo manager.
		 * When not set, the last snapshot will be updated only if the undo manager was up to date when locking.
		 * Additionally, this option makes it possible to lock the snapshot when the editor is not in the `wysiwyg` mode,
		 * because when it is passed, the snapshots will not need to be compared.
		 */
		lock: function( dontUpdate, forceUpdate ) {
			if ( !this.locked ) {
				if ( dontUpdate )
					this.locked = { level: 1 };
				else {
					var update = null;

					if ( forceUpdate )
						update = true;
					else {
						// Make a contents image. Don't include bookmarks, because:
						// * we don't compare them,
						// * there's a chance that DOM has been changed since
						// locked (e.g. fake) selection was made, so createBookmark2 could fail.
						// http://dev.ckeditor.com/ticket/11027#comment:3
						var imageBefore = new Image( this.editor, true );

						// If current editor content matches the tip of snapshot stack,
						// the stack tip must be updated by unlock, to include any changes made
						// during this period.
						if ( this.currentImage && this.currentImage.equalsContent( imageBefore ) )
							update = imageBefore;
					}

					this.locked = { update: update, level: 1 };
				}
			}
			// Increase the level of lock.
			else
				this.locked.level++;
		},

		/**
		 * Unlocks the snapshot stack and checks to amend the last snapshot.
		 *
		 * See {@link #lock} for more details.
		 *
		 * @since 4.0
		 */
		unlock: function() {
			if ( this.locked ) {
				// Decrease level of lock and check if equals 0, what means that undoM is completely unlocked.
				if ( !--this.locked.level ) {
					var update = this.locked.update;

					this.locked = null;

					// forceUpdate was passed to lock().
					if ( update === true )
						this.update();
					// update is instance of Image.
					else if ( update ) {
						var newImage = new Image( this.editor, true );

						if ( !update.equalsContent( newImage ) )
							this.update();
					}
				}
			}
		},

		/**
		 * Checks whether a key is one of navigation keys (Arrows, Page Up/Down, etc.).
		 * See also the {@link #navigationKeyCodes} property.
		 *
		 * @since 4.4.4
		 * @param {Number} keyCode
		 * @returns {Boolean}
		 */
		isNavigationKey: function( keyCode ) {
			return !!this.navigationKeyCodes[ keyCode ];
		}
	};

	// Helper method called when undoManager.typing val was changed to true.
	function onTypingStart( undoManager ) {
		// It's safe to now indicate typing state.
		undoManager.typing = true;

		// Manually mark snapshot as available.
		undoManager.hasUndo = true;
		undoManager.hasRedo = false;

		undoManager.onChange();
	}

	/**
	 * Contains a snapshot of the editor content and selection at a given point in time.
	 *
	 * @private
	 * @class CKEDITOR.plugins.undo.Image
	 * @constructor Creates an Image class instance.
	 * @param {CKEDITOR.editor} editor The editor instance on which the image is created.
	 * @param {Boolean} [contentsOnly] If set to `true`, the image will only contain content without the selection.
	 */
	var Image = CKEDITOR.plugins.undo.Image = function( editor, contentsOnly ) {
			this.editor = editor;

			editor.fire( 'beforeUndoImage' );

			var contents = editor.getSnapshot();

			// In IE, we need to remove the expando attributes.
			if ( CKEDITOR.env.ie && contents )
				contents = contents.replace( /\s+data-cke-expando=".*?"/g, '' );

			this.contents = contents;

			if ( !contentsOnly ) {
				var selection = contents && editor.getSelection();
				this.bookmarks = selection && selection.createBookmarks2( true );
			}

			editor.fire( 'afterUndoImage' );
		};

	// Attributes that browser may changing them when setting via innerHTML.
	var protectedAttrs = /\b(?:href|src|name)="[^"]*?"/gi;

	Image.prototype = {
		/**
		 * @param {CKEDITOR.plugins.undo.UndoManager.Image} otherImage Image to compare to.
		 * @returns {Boolean} Returns `true` if content in `otherImage` is the same.
		 */
		equalsContent: function( otherImage ) {
			var thisContents = this.contents,
				otherContents = otherImage.contents;

			// For IE7 and IE QM: Comparing only the protected attribute values but not the original ones.(#4522)
			if ( CKEDITOR.env.ie && ( CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks ) ) {
				thisContents = thisContents.replace( protectedAttrs, '' );
				otherContents = otherContents.replace( protectedAttrs, '' );
			}

			if ( thisContents != otherContents )
				return false;

			return true;
		},

		/**
		 * @param {CKEDITOR.plugins.undo.UndoManager.Image} otherImage Image to compare to.
		 * @returns {Boolean} Returns `true` if selection in `otherImage` is the same.
		 */
		equalsSelection: function( otherImage ) {
			var bookmarksA = this.bookmarks,
				bookmarksB = otherImage.bookmarks;

			if ( bookmarksA || bookmarksB ) {
				if ( !bookmarksA || !bookmarksB || bookmarksA.length != bookmarksB.length )
					return false;

				for ( var i = 0; i < bookmarksA.length; i++ ) {
					var bookmarkA = bookmarksA[ i ],
						bookmarkB = bookmarksB[ i ];

					if ( bookmarkA.startOffset != bookmarkB.startOffset || bookmarkA.endOffset != bookmarkB.endOffset || !CKEDITOR.tools.arrayCompare( bookmarkA.start, bookmarkB.start ) || !CKEDITOR.tools.arrayCompare( bookmarkA.end, bookmarkB.end ) )
						return false;
				}
			}

			return true;
		}

		/**
		 * Editor content.
		 *
		 * @readonly
		 * @property {String} contents
		 */

		/**
		 * Bookmarks representing the selection in an image.
		 *
		 * @readonly
		 * @property {Object[]} bookmarks Array of bookmark2 objects, see {@link CKEDITOR.dom.range#createBookmark2} for definition.
		 */
	};

	var inputFired = 0,
		ignoreInputEvent = false,
		ignoreInputEventListener = function() {
			ignoreInputEvent = true;
		};

	/**
	 * A class encapsulating all native event listeners which have to be used in
	 * order to handle undo manager integration for native editing actions (excluding drag and drop and paste support
	 * handled by the Clipboard plugin).
	 *
	 * @private
	 * @class CKEDITOR.plugins.undo.NativeEditingHandler
	 * @member CKEDITOR.plugins.undo Undo manager owning the handler.
	 * @constructor
	 * @param {CKEDITOR.plugins.undo.UndoManager} undoManager
	 * @since 4.4.4
	 */
	var NativeEditingHandler = CKEDITOR.plugins.undo.NativeEditingHandler = function( undoManager ) {
		// We'll use keyboard + input events to determine if snapshot should be created.
		// Since `input` event is fired before `keyup`. We can tell in `keyup` event if input occured.
		// That will tell us if any printable data was inserted.
		// On `input` event we'll increase `inputFired` counter. Eventually it might be
		// canceled by paste/drop using `ignoreInputEvent` flag.
		// Order of events can be found in http://www.w3.org/TR/DOM-Level-3-Events/

		/**
		 * An undo manager instance owning the editing handler.
		 *
		 * @property {CKEDITOR.plugins.undo.UndoManager} undoManager
		 */
		this.undoManager = undoManager;

		/**
		 * An image of the editor during the `keydown` event (therefore without DOM modification).
		 *
		 * @property {CKEDITOR.plugins.undo.Image} lastKeydownImage
		 */
	};

	NativeEditingHandler.prototype = {
		/**
		 * The `keydown` event listener.
		 *
		 * @param {CKEDITOR.dom.event} evt
		 */
		onKeydown: function( evt ) {
			// Block undo/redo keystrokes when at the bottom/top of the undo stack (#11126 and #11677).
			if ( CKEDITOR.tools.indexOf( keystrokes, evt.data.getKeystroke() ) > -1 ) {
				evt.data.preventDefault();
				return;
			}

			var keyCode = evt.data.getKey(),
				undoManager = this.undoManager;

			// We need to store an image which will be used in case of key group
			// change.
			this.lastKeydownImage = new Image( undoManager.editor );
			if ( undoManager.isNavigationKey( keyCode ) ) {
				if ( undoManager.strokesRecorded[ 0 ] || undoManager.strokesRecorded[ 1 ] ) {
					// We already have image, so we'd like to reuse it.
					undoManager.save( false, this.lastKeydownImage );
					undoManager.resetType();
				}
			}
		},

		/**
		 * The `input` event listener.
		 */
		onInput: function() {
			inputFired += 1;
			// inputFired counter shouldn't be increased if paste/drop event were fired before.
			if ( ignoreInputEvent ) {
				inputFired -= 1;
				ignoreInputEvent = false;
			}
		},

		/**
		 * The `keyup` event listener.
		 *
		 * @param {CKEDITOR.dom.event} evt
		 */
		onKeyup: function( evt ) {
			var undoManager = this.undoManager,
				keyCode = evt.data.getKey(),
				editor = undoManager.editor,
				ieFunctionKeysWorkaround = CKEDITOR.env.ie && keyCode in backspaceOrDelete;

			// IE: doesn't call keypress for backspace/del keys so we need to handle it manually
			// with a workaround. Also we need to be aware that lastKeydownImage might not be available (#12327).
			if ( ieFunctionKeysWorkaround && this.lastKeydownImage ) {
				if ( this.lastKeydownImage.equalsContent( new Image( editor, true ) ) ) {
					// Content was not changed, we don't need to do anything.
					return;
				} else {
					// Content was changed. And since no keypress event was fired, we have
					// inputFired = 0, so undoManager.type method will not be called.
					inputFired += 1;
				}
			}

			if ( inputFired > 0 ) {
				// Reset flag indicating input event.
				inputFired -= 1;
				undoManager.type( keyCode );
			} else if ( undoManager.isNavigationKey( keyCode ) ) {
				// Note content snapshot has been checked in keydown.
				this.onNavigationKey( true );
			}
		},

		/**
		 * Method called for navigation change. At first it will check if current content does not differ
		 * from the last saved snapshot.
		 *
		 * * If the content is different, the method creates a standard, extra snapshot.
		 * * If the content is not different, the method will compare the selection, and will
		 * amend the last snapshot selection if it changed.
		 *
		 * @param {Boolean} skipContentCompare If set to `true`, it will not compare content, and only do a selection check.
		 */
		onNavigationKey: function( skipContentCompare ) {
			var undoManager = this.undoManager;

			// We attempt to save content snapshot, if content didn't change, we'll
			// only amend selection.
			if ( skipContentCompare || !undoManager.save( true, null, false ) )
				undoManager.updateSelection( new Image( undoManager.editor ) );

			undoManager.resetType();
		},

		/**
		 * Resets the input counter. This method is for internal use only.
		 */
		resetCounter: function() {
			inputFired = 0;
		},

		/**
		 * Attaches editable listeners required to provide the undo functionality.
		 */
		attachListeners: function() {
			var editable = this.undoManager.editor.editable(),
				that = this;

			// We'll create a snapshot here (before DOM modification), because we'll
			// need unmodified content when we got keygroup toggled in keyup.
			editable.attachListener( editable, 'keydown', that.onKeydown, that );

			// Only IE can't use input event, because it's not fired in contenteditable.
			editable.attachListener( editable, CKEDITOR.env.ie ? 'keypress' : 'input', that.onInput, that );

			// Keyup executes main snapshot logic.
			editable.attachListener( editable, 'keyup', that.onKeyup, that );

			// On paste and drop we need to cancel inputFired variable.
			// It would result with calling undoManager.type() on any following key.
			editable.attachListener( editable, 'paste', ignoreInputEventListener );
			editable.attachListener( editable, 'drop', ignoreInputEventListener );

			// Click should create a snapshot if needed, but shouldn't cause change event.
			// Don't pass onNavigationKey directly as a listener because it accepts one argument which
			// will conflict with evt passed to listener.
			editable.attachListener( editable, 'click', function() {
				that.onNavigationKey();
			} );
		}
	};
} )();

/**
 * The number of undo steps to be saved. The higher value is set, the more
 * memory is used for it.
 *
 *		config.undoStackSize = 50;
 *
 * @cfg {Number} [undoStackSize=20]
 * @member CKEDITOR.config
 */

/**
 * Fired when the editor is about to save an undo snapshot. This event can be
 * fired by plugins and customizations to make the editor save undo snapshots.
 *
 * @event saveSnapshot
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired before an undo image is to be created. An *undo image* represents the
 * editor state at some point. It is saved into the undo store, so the editor is
 * able to recover the editor state on undo and redo operations.
 *
 * @since 3.5.3
 * @event beforeUndoImage
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @see CKEDITOR.editor#afterUndoImage
 */

/**
 * Fired after an undo image is created. An *undo image* represents the
 * editor state at some point. It is saved into the undo store, so the editor is
 * able to recover the editor state on undo and redo operations.
 *
 * @since 3.5.3
 * @event afterUndoImage
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @see CKEDITOR.editor#beforeUndoImage
 */

/**
 * Fired when the content of the editor is changed.
 *
 * Due to performance reasons, it is not verified if the content really changed.
 * The editor instead watches several editing actions that usually result in
 * changes. This event may thus in some cases be fired when no changes happen
 * or may even get fired twice.
 *
 * If it is important not to get the `change` event fired too often, you should compare the
 * previous and the current editor content inside the event listener. It is
 * not recommended to do that on every `change` event.
 *
 * Please note that the `change` event is only fired in the {@link #property-mode wysiwyg mode}.
 * In order to implement similar functionality in the source mode, you can listen for example to the {@link #key}
 * event or the native [`input`](https://developer.mozilla.org/en-US/docs/Web/Reference/Events/input)
 * event (not supported by Internet Explorer 8).
 *
 *		editor.on( 'mode', function() {
 *			if ( this.mode == 'source' ) {
 *				var editable = editor.editable();
 *				editable.attachListener( editable, 'input', function() {
 *					// Handle changes made in the source mode.
 *				} );
 *			}
 *		} );
 *
 * @since 4.2
 * @event change
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 */
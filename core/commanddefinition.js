/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.commandDefinition} class
 *		which contains the defintion of a command. This file is for
 *		documentation purposes only.
 */

/**
 * Virtual class that illustrates the features of command objects to be
 * passed to the {@link CKEDITOR.editor#addCommand} function.
 *
 * @class CKEDITOR.commandDefinition
 * @abstract
 */

/**
 * The function to be fired when the commend is executed.
 *
 *		editorInstance.addCommand( 'sample', {
 *			exec: function( editor ) {
 *				alert( 'Executing a command for the editor name "' + editor.name + '"!' );
 *			}
 *		} );
 *
 * @method exec
 * @param {CKEDITOR.editor} editor The editor within which to run the command.
 * @param {Object} [data] Additional data to be used to execute the command.
 * @returns {Boolean} Whether the command has been successfully executed.
 * Defaults to `true` if nothing is returned.
 */

/**
 * Whether the command needs to be hooked into the redo/undo system.
 *
 *		editorInstance.addCommand( 'alertName', {
 *			exec: function( editor ) {
 *				alert( editor.name );
 *			},
 *			canUndo: false // No support for undo/redo.
 *		} );
 *
 * @property {Boolean} [canUndo=true]
 */

/**
 * Whether the command is asynchronous, which means that the
 * {@link CKEDITOR.editor#event-afterCommandExec} event will be fired by the
 * command itself manually, and that the return value of this command is not to
 * be returned by the {@link #exec} function.
 *
 * 		editorInstance.addCommand( 'loadoptions', {
 * 			exec: function( editor ) {
 * 				var cmd = this;
 * 				// Asynchronous operation below.
 * 				CKEDITOR.ajax.loadXml( 'data.xml', function() {
 * 					editor.fire( 'afterCommandExec', {
 *						name: 'loadoptions',
 *						command: cmd
 * 					} );
 * 				} );
 * 			},
 * 			async: true // The command needs some time to complete after the exec function returns.
 * 		} );
 *
 * @property {Boolean} [async=false]
 */

/**
 * Whether the command should give focus to the editor before execution.
 *
 *		editorInstance.addCommand( 'maximize', {
 *				exec: function( editor ) {
 *				// ...
 *			},
 *			editorFocus: false // The command does not require focusing the editing document.
 *		} );
 *
 * See also {@link CKEDITOR.command#editorFocus}.
 *
 * @property {Boolean} [editorFocus=true]
 */


/**
 * Whether the command state should be set to {@link CKEDITOR#TRISTATE_DISABLED} on startup.
 *
 *		editorInstance.addCommand( 'unlink', {
 *			exec: function( editor ) {
 *				// ...
 *			},
 *			startDisabled: true // The command is unavailable until the selection is inside a link.
 *		} );
 *
 * @property {Boolean} [startDisabled=false]
 */

/**
 * Indicates that this command is sensitive to the selection context.
 * If `true`, the {@link CKEDITOR.command#method-refresh} method will be
 * called for this command on selection changes, with a single parameter
 * representing the current elements path.
 *
 * @property {Boolean} [contextSensitive=true]
 */

/**
 * Defined by the command definition, a function to determine the command state. It will be invoked
 * when the editor has its `states` or `selection` changed.
 *
 * **Note:** The function provided must be calling {@link CKEDITOR.command#setState} in all circumstances
 * if it is intended to update the command state.
 *
 * @method refresh
 * @param {CKEDITOR.editor} editor
 * @param {CKEDITOR.dom.elementPath} path
 */

/**
 * Sets the element name used to reflect the command state on selection changes.
 * If the selection is in a place where the element is not allowed, the command
 * will be disabled.
 * Setting this property overrides {@link #contextSensitive} to `true`.
 *
 * @property {Boolean} [context=true]
 */

/**
 * The editor modes within which the command can be executed. The execution
 * will have no action if the current mode is not listed in this property.
 *
 *		editorInstance.addCommand( 'link', {
 *			exec: function( editor ) {
 *				// ...
 *			},
 *			modes: { wysiwyg:1 } // The command is available in wysiwyg mode only.
 *		} );
 *
 * See also {@link CKEDITOR.command#modes}.
 *
 * @property {Object} [modes={ wysiwyg:1 }]
 */

/**
 * Whether the command should be enabled in the {@link CKEDITOR.editor#setReadOnly read-only mode}.
 *
 * @since 4.0.0
 * @property {Boolean} [readOnly=false]
 */

/**
 * A property that should be set when a command has no keystroke assigned by {@link CKEDITOR.editor#setKeystroke}, but
 * the keystroke is still supported. For example: `cut`, `copy` and `paste` commands are handled that way.
 * This property is used when displaying keystroke information in tooltips and context menus. It is used by
 * {@link CKEDITOR.editor#getCommandKeystroke}.
 *
 * @since 4.6.0
 * @property {Number} fakeKeystroke
 */

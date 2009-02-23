/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.commandDefinition} class,
 *		which contains the defintion of a command. This file is for
 *		documentation purposes only.
 */

/**
 * (Virtual Class) Do not call this constructor. This class is not really part
 *		of the API. It just illustrates the features of command objects to be
 *		passed to the {@link CKEDITOR.editor.prototype.addCommand} function.
 * @name CKEDITOR.commandDefinition
 * @constructor
 * @example
 */

/**
 * Executes the command.
 * @name CKEDITOR.commandDefinition.prototype.exec
 * @function
 * @param {CKEDITOR.editor} editor The editor within which run the command.
 * @param {Object} [data] Additional data to be used to execute the command.
 * @returns {Boolean} Whether the command has been successfully executed.
 *		Defaults to "true", if nothing is returned.
 * @example
 * editorInstance.addCommand( 'sample',
 * {
 *     exec : function( editor )
 *     {
 *         alert( 'Executing a command for the editor name "' + editor.name + '"!' );
 *     }
 * });
 */

/**
 * Whether the command need to be hooked into the redo/undo system.
 * @name  CKEDITOR.commandDefinition.canUndo
 * @type {Boolean} If not defined or 'true' both hook into undo system, set it
 *		to 'false' explicitly  keep it out.
 * @field
 * @example
 * editorInstance.addCommand( 'alertName',
 * {
 *     exec : function( editor )
 *     {
 *         alert( editor.name );
 *     },
 *     canUndo : false    // No support for undo/redo
 * });
 */

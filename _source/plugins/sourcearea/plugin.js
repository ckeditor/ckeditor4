/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "sourcearea" plugin. It registers the "source" editing
 *		mode, which displays the raw data being edited in the editor.
 */

CKEDITOR.plugins.add( 'sourcearea', {
	requires: [ 'editingblock' ],

	init: function( editor ) {
		var sourcearea = CKEDITOR.plugins.sourcearea;

		editor.on( 'editingBlockReady', function() {
			var textarea;

			editor.addMode( 'source', {
				load: function( holderElement, data ) {
					// Create the source area <textarea>.
					textarea = new CKEDITOR.dom.element( 'textarea' );
					textarea.setAttribute( 'dir', 'ltr' );
					textarea.addClass( 'cke_source' );
					textarea.setStyles({
						width: '100%',
						height: '100%',
						resize: 'none',
						outline: 'none',
						'text-align': 'left' } );

					// Add the tab index for #3098.
					var tabIndex = editor.element && editor.element.getAttribute( 'tabIndex' );
					if ( tabIndex )
						textarea.setAttribute( 'tabIndex', tabIndex );

					// The textarea height/width='100%' doesn't
					// constraint to the 'td' in IE strick mode
					if ( CKEDITOR.env.ie ) {
						textarea.setStyles({
							height: holderElement.$.clientHeight + 'px',
							width: holderElement.$.clientWidth + 'px' } );
					}

					// By some yet unknown reason, we must stop the
					// mousedown propagation for the textarea,
					// otherwise it's not possible to place the caret
					// inside of it (non IE).
					if ( !CKEDITOR.env.ie ) {
						textarea.on( 'mousedown', function( evt ) {
							evt = evt.data.$;
							if ( evt.stopPropagation )
								evt.stopPropagation();
						});
					}

					// Reset the holder element and append the
					// <textarea> to it.
					holderElement.setHtml( '' );
					holderElement.append( textarea );

					// The editor data "may be dirty" after this point.
					editor.mayBeDirty = true;

					// Set the <textarea> value.
					this.loadData( data );

					editor.mode = 'source';
					editor.fire( 'mode' );
				},

				loadData: function( data ) {
					textarea.setValue( data );
				},

				getData: function() {
					return textarea.getValue();
				},

				getSnapshotData: function() {
					return textarea.getValue();
				},

				unload: function( holderElement ) {
					textarea = null;
				},

				focus: function() {
					textarea.focus();
				}
			});
		});

		editor.addCommand( 'source', sourcearea.commands.source );

		if ( editor.ui.addButton ) {
			editor.ui.addButton( 'Source', {
				label: editor.lang.source,
				command: 'source'
			});
		}

		editor.on( 'mode', function() {
			editor.getCommand( 'source' ).setState( editor.mode == 'source' ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );
		});
	}
});

/**
 * Holds the definition of commands an UI elements included with the sourcearea
 * plugin.
 * @example
 */
CKEDITOR.plugins.sourcearea = {
	commands: {
		source: {
			exec: function( editor ) {
				editor.setMode( editor.mode == 'source' ? 'wysiwyg' : 'source' );
			}
		}
	}
};

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
			var textarea, onResize;

			editor.addMode( 'source', {
				load: function( holderElement, data ) {
					if ( CKEDITOR.env.ie && CKEDITOR.env.version < 8 )
						holderElement.setStyle( 'position', 'relative' );

					// Create the source area <textarea>.
					editor.textarea = textarea = new CKEDITOR.dom.element( 'textarea' );
					textarea.setAttributes({
						dir: 'ltr',
						tabIndex: -1
					});
					textarea.addClass( 'cke_source' );

					var styles = {
						width: '100%',
						height: '100%',
						resize: 'none',
						outline: 'none',
						'text-align': 'left'
					};

					// The textarea height/width='100%' doesn't
					// constraint to the 'td' in IE strick mode
					if ( CKEDITOR.env.ie ) {
						if ( CKEDITOR.env.quirks || CKEDITOR.env.version < 8 ) {
							// In IE, we must use absolute positioning to
							// have the textarea filling the full content
							// space height.
							holderElement.setStyle( 'position', 'relative' );
							styles[ 'position' ] = 'absolute';
						}

						if ( !CKEDITOR.env.quirks || CKEDITOR.env.version < 7 ) {
							function getHolderRect() {
								return {
									height: holderElement.$.clientHeight + 'px',
									width: holderElement.$.clientWidth + 'px'
								}
							}

							onResize = function() {
								textarea.setStyles( getHolderRect() );
							};
							styles = CKEDITOR.tools.extend( styles, getHolderRect(), true );
							editor.on( 'resize', onResize );
						}
					} else {
						// By some yet unknown reason, we must stop the
						// mousedown propagation for the textarea,
						// otherwise it's not possible to place the caret
						// inside of it (non IE).
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
					textarea.setStyles( styles );

					// The editor data "may be dirty" after this point.
					editor.mayBeDirty = true;

					// Set the <textarea> value.
					this.loadData( data );

					var keystrokeHandler = editor.keystrokeHandler;
					if ( keystrokeHandler )
						keystrokeHandler.attach( textarea );

					setTimeout( function() {
						editor.mode = 'source';
						editor.fire( 'mode' );
					}, ( CKEDITOR.env.gecko || CKEDITOR.env.webkit ) ? 100 : 0 );
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
					editor.textarea = textarea = null;

					if ( onResize )
						editor.removeListener( 'resize', onResize );
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
		source: { modes:{wysiwyg:1,source:1 },

			exec: function( editor ) {
				editor.getCommand( 'source' ).setState( CKEDITOR.TRISTATE_DISABLED );
				editor.setMode( editor.mode == 'source' ? 'wysiwyg' : 'source' );
			}
		}
	}
};

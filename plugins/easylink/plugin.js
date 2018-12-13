/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var inputTemplate = CKEDITOR.addTemplate( 'input', '<input class="{cls}" id="{id}" placeholder="{placeholder}" type="text">' ),
		linkPreviewTemplate = CKEDITOR.addTemplate( 'linkPreview', '<a class="{cls}" id="{id}" type="{type}" href="{url}">{url}</a>' );

	CKEDITOR.plugins.add( 'easylink', {
		requires: 'balloontoolbar,button,widget',
		init: function( editor ) {

			CKEDITOR.ui.linkPreview = function( definition ) {
				CKEDITOR.tools.extend( this, definition );
				this._ = {};
			};

			CKEDITOR.ui.linkPreview.handler = {
				create: function( definition ) {
					return new CKEDITOR.ui.linkPreview( definition );
				}
			};

			CKEDITOR.ui.linkPreview.prototype = {
				render: function( editor, output ) {
					this._.editor = editor;

					var id = this._.id = CKEDITOR.tools.getNextId();

					linkPreviewTemplate.output( {
						cls: this.cls,
						id: id,
						url: this.url,
						type: this.type
					}, output );
				}
			};

			CKEDITOR.ui.input = function( definition ) {
				CKEDITOR.tools.extend( this, definition );
				this._ = {};
			};

			CKEDITOR.ui.input.handler = {
				create: function( definition ) {
					return new CKEDITOR.ui.input( definition );
				}
			};

			CKEDITOR.ui.input.prototype = {
				render: function( editor, output ) {
					this._.editor = editor;

					var id = this._.id = CKEDITOR.tools.getNextId();

					inputTemplate.output( {
						cls: this.cls,
						id: id,
						placeholder: this.placeholder
					}, output );
				},

				getElement: function() {
					return CKEDITOR.document.getById( this._.id );
				},

				getValue: function() {
					return this.getElement().getValue();
				}
			};

			var input = new CKEDITOR.ui.input( {
					cls: 'cke_balloon_input',
					placeholder: 'http://example.com'
				} ),
				insertLinkToolbar;

			editor.addCommand( 'acceptlink', {
				exec: function( editor ) {
					var href = insertLinkToolbar._items.input.getValue(),
						link = CKEDITOR.plugins.link.getSelectedLink( editor );

					if ( link ) {
						link.setAttribute( 'href', href );
					} else {
						insertLinksIntoSelection( editor, {
							url: {
								protocol: 'http://',
								url: href
							},
							type: 'url',
							linkText: editor.getSelection().getSelectedText()
						} );
					}
					insertLinkToolbar.destroy();
				}
			} );

			var acceptLinkBtn = new CKEDITOR.ui.button( {
				label: 'acceptlink',
				icon: 'link',
				command: 'acceptlink'
			} );

			editor.addCommand( 'easylink', {
				exec: function( editor ) {
					insertLinkToolbar = new CKEDITOR.ui.balloonToolbar( editor, {
						width: 'auto',
						height: 38
					} );
					var sel = editor.getSelection();

					insertLinkToolbar.addItems( {
						input: input,
						accept: acceptLinkBtn
					} );

					insertLinkToolbar.attach( sel );

					var link = CKEDITOR.plugins.link.getSelectedLink( editor );

					if ( link ) {
						input.getElement().setValue( link.getAttribute( 'href' ) );
					}

					input.getElement().focus();

					var element = insertLinkToolbar._items.input.getElement().getAscendant( function( el ) {
						return el.hasClass( 'cke_balloontoolbar' );
					} );

					var listeners = [
						CKEDITOR.document.on( 'mousedown', destroyListener ),
						editor.document.on( 'mousedown', destroyListener )
					];

					function destroyListener( evt ) {
						var target = evt.data.getTarget();

						if ( !element.contains( target ) && !element.equals( target ) ) {
							insertLinkToolbar.destroy();
							CKEDITOR.tools.array.forEach( listeners, function( listener ) {
								listener.removeListener();
							} );
						}
					}
				}
			} );

			editor.ui.addButton && editor.ui.addButton( 'Easylink', {
				label: 'easylink',
				icon: 'link',
				command: 'easylink',
				toolbar: 'blocks,10'
			} );

			var editLinkToolbar;

			editor.on( 'selectionChange', function() {
				var link = CKEDITOR.plugins.link.getSelectedLink( this );

				if ( editLinkToolbar ) {
					editLinkToolbar.destroy();
				}

				if ( !link ) {
					return;
				}

				editLinkToolbar = new CKEDITOR.ui.balloonToolbar( editor, {
					width: 'auto',
					height: 38
				} );

				var url = link.getAttribute( 'href' ),
					linkPreview = new CKEDITOR.ui.linkPreview( {
						cls: 'cke_link_preview',
						placeholder: 'http://example.com',
						type: 'button',
						url: url
					} );

				editLinkToolbar.addItems( {
					preview: linkPreview,
					edit: editor.ui.get( 'Easylink' ),
					unlink: editor.ui.get( 'Unlink' )
				} );

				editLinkToolbar.attach( editor.getSelection() );
			} );
		}
	} );

	// Link dialog copypasta.
	function insertLinksIntoSelection( editor, data ) {
		var linkPlugin = CKEDITOR.plugins.link,
			attributes = linkPlugin.getLinkAttributes( editor, data ),
			ranges = editor.getSelection().getRanges(),
			style = new CKEDITOR.style( {
				element: 'a',
				attributes: attributes.set
			} ),
			rangesToSelect = [],
			initialLinkText,
			range,
			text,
			nestedLinks,
			i,
			j;

		style.type = CKEDITOR.STYLE_INLINE; // need to override... dunno why.

		for ( i = 0; i < ranges.length; i++ ) {
			range = ranges[ i ];

			// Use link URL as text with a collapsed cursor.
			if ( range.collapsed ) {
				// Short mailto link text view (https://dev.ckeditor.com/ticket/5736).
				text = new CKEDITOR.dom.text( data.linkText || attributes.set[ 'data-cke-saved-href' ], editor.document );
				range.insertNode( text );
				range.selectNodeContents( text );
			} else if ( initialLinkText !== data.linkText ) {
				text = new CKEDITOR.dom.text( data.linkText, editor.document );

				// Shrink range to preserve block element.
				range.shrink( CKEDITOR.SHRINK_TEXT );

				// Use extractHtmlFromRange to remove markup within the selection. Also this method is a little
				// smarter than range#deleteContents as it plays better e.g. with table cells.
				editor.editable().extractHtmlFromRange( range );

				range.insertNode( text );
			}

			// Editable links nested within current range should be removed, so that the link is applied to whole selection.
			nestedLinks = range._find( 'a' );

			for ( j = 0; j < nestedLinks.length; j++ ) {
				nestedLinks[ j ].remove( true );
			}


			// Apply style.
			style.applyToRange( range, editor );

			rangesToSelect.push( range );
		}

		editor.getSelection().selectRanges( rangesToSelect );
	}
} )();

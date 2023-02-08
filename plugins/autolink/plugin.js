/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'autolink', {
		requires: 'clipboard,textmatch,link',

		isSupportedEnvironment: function() {
			return !CKEDITOR.env.ie || CKEDITOR.env.edge;
		},

		init: function( editor ) {

			// (#2208)
			if ( !this.isSupportedEnvironment() ) {
				return;
			}

			editor.on( 'paste', function( evt ) {
				if ( evt.data.dataTransfer.getTransferType( editor ) == CKEDITOR.DATA_TRANSFER_INTERNAL ) {
					return;
				}

				var data = evt.data.dataValue;

				// If we found "<" it means that most likely there's some tag and we don't want to touch it.
				if ( data.indexOf( '<' ) > -1 ) {
					return;
				}

				if ( matchLink( data ) ) {
					evt.data.dataValue = getHtmlToInsert( data );
					evt.data.type = 'html';
				}
			} );

			// (#3156)
			editor.on( 'key', function( evt ) {
				if ( editor.mode !== 'wysiwyg' || CKEDITOR.tools.indexOf( editor.config.autolink_commitKeystrokes, evt.data.keyCode ) == -1 ) {
					return;
				}

				var matched = CKEDITOR.plugins.textMatch.match( editor.getSelection().getRanges()[ 0 ], matchCallback );

				if ( matched ) {
					insertLink( matched );
				}

			} );

			function insertLink( match ) {
				var selection = editor.getSelection();
				// We don't want to insert a link if selection is already inside another link.
				if ( selection.getRanges()[ 0 ].startContainer.getAscendant( 'a', true ) ) {
					return;
				}

				selection.selectRanges( [ match.range ] );
				editor.insertHtml( getHtmlToInsert( match.text ), 'text' );

				if ( !CKEDITOR.env.webkit ) {
					// Make sure that link cannot be modified right after insertion
					// by moving selection at the end of inserted node.
					var insertionRange = selection.getRanges()[ 0 ],
						newRange = editor.createRange();

					newRange.setStartAfter( insertionRange.startContainer );
					selection.selectRanges( [ newRange ] );
				}
			}

			function getHtmlToInsert( text ) {
				// URL will be encoded later on with link.setAttribute method. Avoid
				// double encoding of special characters (#4858).
				text = CKEDITOR.tools.htmlDecodeAttr( text );

				var link = new CKEDITOR.dom.element( 'a' ),
					value = text.replace( /"/g, '%22' );

				value = value.match( editor.config.autolink_urlRegex ) ? value : 'mailto:' + value;

				link.setText( text );
				link.setAttribute( 'href', value );

				// (#1824)
				var linkData = CKEDITOR.plugins.link.parseLinkAttributes( editor, link ),
					attributes = CKEDITOR.plugins.link.getLinkAttributes( editor, linkData );

				if ( !CKEDITOR.tools.isEmpty( attributes.set ) ) {
					link.setAttributes( attributes.set );
				}

				if ( attributes.removed.length ) {
					link.removeAttributes( attributes.removed );
				}

				link.removeAttribute( 'data-cke-saved-href' );

				return link.getOuterHtml();
			}

			function matchCallback( text, offset ) {
				var parts = text.slice( 0, offset )
						.split( /\s+/ ),
					query = parts[ parts.length - 1 ];

				if ( !query ) {
					return null;
				}

				if ( !matchLink( query ) ) {
					return null;
				}

				return { start: text.lastIndexOf( query ), end: offset };
			}

			function matchLink( query ) {
				return query.match( editor.config.autolink_urlRegex ) ||
					query.match( editor.config.autolink_emailRegex );
			}
		}
	} );

	/**
	 * The [Auto Link](https://ckeditor.com/cke4/addon/autolink) plugin keystrokes used to finish link completion.
	 *
	 * ```javascript
	 * // Default configuration (13 = Enter, 32 = space).
	 * config.autolink_commitKeystrokes = [ 9, 13 ];
	 * ```
	 *
	 * Commit keystrokes can be also disabled by setting it to an empty array.
	 *
	 * ```javascript
	 * // Disable autolink commit keystrokes.
	 * config.autolink_commitKeystrokes = [];
	 * ```
	 *
	 * @since 4.11.0
	 * @cfg {Number/Number[]} [autolink_commitKeystrokes=[ 13, 32 ]]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.autolink_commitKeystrokes = [ 13, 32 ];

	/**
	 * Regex used by the [Auto Link](https://ckeditor.com/cke4/addon/autolink) plugin to match URL adresses.
	 *
	 * @cfg {RegExp} [autolink_urlRegex]
	 * @since 4.11.0
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.autolink_urlRegex = /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#]\.?)+(\/[^\s]*)?[^\s\.,]$/i;
	// Regex by Imme Emosol.

	/**
	 * Regex used by the [Auto Link](https://ckeditor.com/cke4/addon/autolink) plugin to match email adresses.
	 *
	 * @cfg {RegExp} [autolink_emailRegex]
	 * @since 4.11.0
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.autolink_emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	// Regex by (https://html.spec.whatwg.org/#e-mail-state-(type=email)).
} )();

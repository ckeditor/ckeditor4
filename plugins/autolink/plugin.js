/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var doubleQuoteRegex = /"/g;

	CKEDITOR.plugins.add( 'autolink', {
		requires: 'clipboard,textmatch',

		init: function( editor ) {
			var urlTemplate = new CKEDITOR.template( '<a href="{link}">{text}</a>' ),
				emailTemplate = new CKEDITOR.template( '<a href="mailto:{link}">{text}</a>' );

			editor.on( 'paste', function( evt ) {
				// Pasted text may be encoded. Decode it so we will be able to compare its length with match.
				var text = CKEDITOR.tools.htmlDecode( evt.data.dataValue );

				// Attach afterPaste event here to avoid race condition between events.
				editor.once( 'afterPaste', function() {
					var matched = CKEDITOR.plugins.textMatch.match( editor.getSelection().getRanges()[ 0 ], matchCallback );

					if ( !matched || matched.text.length != text.length ) {
						return;
					}

					insertLink( matched );
				} );
			} );

			// IE has its own link completion and we don't want to interfere with it.
			if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
				return;
			}

			editor.on( 'contentDom', function() {
				var commitKeystrokes = editor.config.autolink_commitKeystrokes || CKEDITOR.config.autolink_commitKeystrokes;
				editor.editable().on( 'keydown', function( evt ) {
					if ( CKEDITOR.tools.indexOf( commitKeystrokes, evt.data.getKey() ) == -1 ) {
						return;
					}

					var matched = CKEDITOR.plugins.textMatch.match( editor.getSelection().getRanges()[ 0 ], matchCallback );

					if ( !matched ) {
						return;
					}

					insertLink( matched );
					// Handle event ASAP thus some plugins may change
					// editor selection or cancel keydown events e.g. wysiwygarea, enterkey.
				}, null, null, 0 );
			} );

			function insertLink( match ) {
				var selection = editor.getSelection();
				// We don't want to insert a link if selection is already inside another link.
				if ( selection.getRanges()[ 0 ].startContainer.getAscendant( 'a', true ) ) {
					return;
				}

				selection.selectRanges( [ match.range ] );
				editor.insertHtml( getHtmlToInsert( match.text ), 'text' );

				// Make sure that link cannot be modified right after insertion
				// by moving selection at the end of inserted node.
				var insertionRange = selection.getRanges()[ 0 ],
					newRange = editor.createRange();

				newRange.setStartAfter( insertionRange.startContainer );
				selection.selectRanges( [ newRange ] );
			}

			function tryToEncodeLink( data ) {
				// If enabled use link plugin to encode email link.
				if ( editor.plugins.link ) {
					var link = CKEDITOR.dom.element.createFromHtml( data ),
						linkData = CKEDITOR.plugins.link.parseLinkAttributes( editor, link ),
						attributes = CKEDITOR.plugins.link.getLinkAttributes( editor, linkData );

					if ( !CKEDITOR.tools.isEmpty( attributes.set ) ) {
						link.setAttributes( attributes.set );
					}

					if ( attributes.removed.length ) {
						link.removeAttributes( attributes.removed );
					}
					return link.getOuterHtml();
				}
				return data;
			}

			function getHtmlToInsert( text ) {
				var opts = {
						text: text,
						link: text.replace( doubleQuoteRegex, '%22' )
					},
					template = opts.link.match( CKEDITOR.config.autolink_urlRegex ) ?
						urlTemplate.output( opts )
						: emailTemplate.output( opts );

				return tryToEncodeLink( template );
			}

			function matchCallback( text, offset ) {
				var query = text.slice( 0, offset );

				var match = query.match( CKEDITOR.config.autolink_urlRegex ) ||
					query.match( CKEDITOR.config.autolink_emailRegex );

				if ( !match ) {
					return null;
				}

				return { start: match.index, end: offset };
			}
		}
	} );

	/**
	 * The [Autolink](https://ckeditor.com/cke4/addon/autolink) plugin keystrokes used to finish link completion.
	 *
	 * ```javascript
	 * // Default config (13 = enter, 32 = space).
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
	 * Regex used by [Autolink](https://ckeditor.com/cke4/addon/autolink) plugin to match URL adresses.
	 *
	 * @cfg {RegExp} [autolink_urlRegex]
	 * @since 4.11.0
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.autolink_urlRegex = /(https?|ftp):\/\/(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?[^\s\.,]$/i;
	// Regex by Imme Emosol.

	/**
	 * Regex used by [Autolink](https://ckeditor.com/cke4/addon/autolink) plugin to match email adresses.
	 *
	 * @cfg {RegExp} [autolink_emailRegex]
	 * @since 4.11.0
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.autolink_emailRegex = /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	// Regex by (https://html.spec.whatwg.org/#e-mail-state-(type=email)).
} )();

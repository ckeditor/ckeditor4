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
			var urlTemplate = new CKEDITOR.template( '<a href="{text}">{text}</a>' ),
				emailTemplate = new CKEDITOR.template( '<a href="mailto:{text}">{text}</a>' );

			editor.on( 'paste', function( evt ) {
				var data = evt.data.dataValue;

				if ( evt.data.dataTransfer.getTransferType( editor ) == CKEDITOR.DATA_TRANSFER_INTERNAL ) {
					return;
				}

				// If we found "<" it means that most likely there's some tag and we don't want to touch it.
				if ( data.indexOf( '<' ) > -1 ) {
					return;
				}

				// Create valid email links (#1761).
				if ( data.match( CKEDITOR.config.autolink_emailRegex ) ) {
					data = data.replace( CKEDITOR.config.autolink_emailRegex,
						'<a href="mailto:' + data.replace( doubleQuoteRegex, '%22' ) + '">$&</a>' );
					data = tryToEncodeLink( data );
				} else {
					// https://dev.ckeditor.com/ticket/13419
					data = data.replace( CKEDITOR.config.autolink_urlRegex,
						'<a href="' + data.replace( doubleQuoteRegex, '%22' ) + '">$&</a>' );
				}

				// If link was discovered, change the type to 'html'. This is important e.g. when pasting plain text in Chrome
				// where real type is correctly recognized.
				if ( data != evt.data.dataValue ) {
					evt.data.type = 'html';
				}

				evt.data.dataValue = data;
			} );

			editor.once( 'instanceReady', function() {
				var commitKeystrokes = editor.config.autolink_commitKeystrokes || CKEDITOR.config.autolink_commitKeystrokes;

				editor.editable().on( 'keydown', function( evt ) {
					if ( CKEDITOR.tools.indexOf( commitKeystrokes, evt.data.getKey() ) == -1 ) {
						return;
					}

					var matched = CKEDITOR.plugins.textMatch.match( editor.getSelection().getRanges()[ 0 ], matchCallback );

					if ( matched ) {
						insertMatch( matched );
					}
				} );
			} );

			function insertMatch( match ) {
				// We don't want to insert a link if selection is already inside another link.
				if ( editor.getSelection().getRanges()[ 0 ].startContainer.getAscendant( 'a', true ) ) {
					return;
				}

				editor.fire( 'lockSnapshot' );

				editor.getSelection().selectRanges( [ match.range ] );
				editor.insertHtml( getHtmlToInsert( match.text ), 'text' );

				editor.fire( 'unlockSnapshot' );
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
				var link = text.replace( doubleQuoteRegex, '%22' ),
					template = link.match( CKEDITOR.config.autolink_urlRegex ) ?
					urlTemplate.output( { text: link } )
					: emailTemplate.output( { text: link } );

				return tryToEncodeLink( template );
			}

			function matchCallback( text, offset ) {
				var query = text.slice( 0, offset ),
					// Remove empty strings.
					parts = query.split( /(\s+)/g ),
					linkText = parts[ parts.length - 1 ];

				if ( !linkText ) {
					return null;
				}

				var match = linkText.match( CKEDITOR.config.autolink_urlRegex ) ||
					linkText.match( CKEDITOR.config.autolink_emailRegex );

				if ( !match ) {
					return null;
				}

				return { start: query.indexOf( linkText ), end: offset };
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
	 * @since 4.10.0
	 * @cfg {Number/Number[]} [autocomplete_commitKeystrokes=[ 13, 32 ]]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.autolink_commitKeystrokes = [ 13, 32 ];

	/**
	 * Regex used by [Autolink](https://ckeditor.com/cke4/addon/autolink) plugin to match URL adresses.
	 *
	 * @cfg {RegExp} [autolink_urlRegex]
	 * @since 4.10.0
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.autolink_urlRegex = /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?[^\s\.,]$/ig;
	// Regex by Imme Emosol.

	/**
	 * Regex used by [Autolink](https://ckeditor.com/cke4/addon/autolink) plugin to match email adresses.
	 *
	 * @cfg {RegExp} [autolink_emailRegex]
	 * @since 4.10.0
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.autolink_emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
	// Regex by (https://www.w3.org/TR/html5/forms.html#valid-e-mail-address).
} )();

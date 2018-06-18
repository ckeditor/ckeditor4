/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var doubleQuoteRegex = /"/g;

	CKEDITOR.plugins.add( 'autolink', {
		requires: 'clipboard,textwatcher,textmatch',

		init: function( editor ) {
			var textwatcher = new CKEDITOR.plugins.textWatcher( editor, textTestCallback ),
				urlTemplate = new CKEDITOR.template( '<a href="{text}">{text}</a>' ),
				emailTemplate = new CKEDITOR.template( '<a href="mailto:{text}">{text}</a>' );

			textwatcher.on( 'matched', onTextMatched );

			textwatcher.attach();

			editor.on( 'destroy', function() {
				textwatcher.destroy();
			} );

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
				if ( data.match( CKEDITOR.config.autolink_emailregex ) ) {
					data = data.replace( CKEDITOR.config.autolink_emailregex,
						'<a href="mailto:' + data.replace( doubleQuoteRegex, '%22' ) + '">$&</a>' );
					data = tryToEncodeLink( data );
				} else {
					// https://dev.ckeditor.com/ticket/13419
					data = data.replace( CKEDITOR.config.autolink_urlregex,
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
				editor.editable().on( 'keydown', function( evt ) {
					var keyCode = evt.data.getKey();

					// Enter
					if ( keyCode != 13 ) {
						return;
					}

					var matched = CKEDITOR.plugins.textMatch.match( editor.getSelection().getRanges()[ 0 ], getMatchCallback() );

					if ( matched ) {
						insertMatch( matched );
					}
				} );
			} );

			function onTextMatched( evt ) {
				// We don't want to insert a link if selection is already inside another link.
				if ( editor.getSelection().getRanges()[ 0 ].startContainer.getAscendant( 'a', true ) ) {
					return;
				}

				insertMatch( evt.data );
			}

			function insertMatch( match ) {
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
					spaceMatch = text.match( /\s+$/ ),
					space = '',
					template;

				// Text could contain following space - we will restore it by appending at the end of a link.
				if ( spaceMatch ) {
					space = text.substring( spaceMatch.index ).replace( /\s/g, '&nbsp;' );
					link = link.substring( 0, spaceMatch.index );
				}

				template = link.match( CKEDITOR.config.autolink_urlregex ) ?
					urlTemplate.output( { text: link } )
					: emailTemplate.output( { text: link } );

				return tryToEncodeLink( template ) + space;
			}

			function textTestCallback( range ) {
				return CKEDITOR.plugins.textMatch.match( range, getMatchCallback( true ) );
			}

			function getMatchCallback( spaceRequired ) {
				return function( text, offset ) {
					var query = text.slice( 0, offset ),
						// Remove empty strings.
						parts = CKEDITOR.tools.array.filter( query.split( /(\s+)/g ), function( part ) {
							return part;
						} ),
						lastIndex = parts.length - 1,
						linkPart;

					if ( spaceRequired ) {
						// Query should contain at least 2 parts - link and a space.
						if ( parts.length < 2 ) {
							return null;
						}

						// If the last part is not a space, abort.
						if ( !parts[ lastIndex ].match( /\s+/ ) ) {
							return null;
						}

						linkPart = parts[ lastIndex - 1 ];
					} else {
						linkPart = parts[ lastIndex ];
					}

					if ( !linkPart ) {
						return null;
					}

					var match = linkPart.match( CKEDITOR.config.autolink_urlregex ) ||
						linkPart.match( CKEDITOR.config.autolink_emailregex );

					if ( !match ) {
						return null;
					}

					return { start: query.indexOf( linkPart ), end: offset };
				};
			}
		}
	} );

	// Regex by Imme Emosol.
	CKEDITOR.config.autolink_urlregex = /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?[^\s\.,]$/ig;

	// Regex by (https://www.w3.org/TR/html5/forms.html#valid-e-mail-address).
	CKEDITOR.config.autolink_emailregex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
} )();

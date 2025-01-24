﻿/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Horizontal Page Break
 */

'use strict';

( function() {
	// Register a plugin named "pagebreak".
	CKEDITOR.plugins.add( 'pagebreak', {
		requires: 'fakeobjects',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'pagebreak,pagebreak-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		onLoad: function() {
			var cssStyles = (
					'background:url(' + CKEDITOR.getUrl( this.path + 'images/pagebreak.gif' ) + ') no-repeat center center;' +
					'clear:both;' +
					'width:100%;' +
					'border-top:#999 1px dotted;' +
					'border-bottom:#999 1px dotted;' +
					'padding:0;' +
					'height:7px;' +
					'cursor:default;'
				).replace( /;/g, ' !important;' ); // Increase specificity to override other styles, e.g. block outline.

			// Add the style that renders our placeholder.
			CKEDITOR.addCss( 'div.cke_pagebreak{' + cssStyles + '}' );
		},

		init: function( editor ) {
			if ( editor.blockless )
				return;

			// Register the command.
			editor.addCommand( 'pagebreak', CKEDITOR.plugins.pagebreakCmd );

			// Register the toolbar button.
			editor.ui.addButton && editor.ui.addButton( 'PageBreak', {
				label: editor.lang.pagebreak.toolbar,
				command: 'pagebreak',
				toolbar: 'insert,70'
			} );

			// Webkit based browsers needs help to select the page-break.
			CKEDITOR.env.webkit && editor.on( 'contentDom', function() {
				editor.document.on( 'click', function( evt ) {
					var target = evt.data.getTarget();
					if ( target.is( 'div' ) && target.hasClass( 'cke_pagebreak' ) )
						editor.getSelection().selectElement( target );
				} );
			} );
		},

		afterInit: function( editor ) {
			// Register a filter to displaying placeholders after mode change.
			var dataProcessor = editor.dataProcessor,
				dataFilter = dataProcessor && dataProcessor.dataFilter,
				htmlFilter = dataProcessor && dataProcessor.htmlFilter,
				styleRegex = /page-break-after\s*:\s*always/i,
				childStyleRegex = /display\s*:\s*none/i;

			function upcastPageBreak( element ) {
				CKEDITOR.tools.extend( element.attributes, attributesSet( editor.lang.pagebreak.alt ), true );

				element.children.length = 0;
			}

			if ( htmlFilter ) {
				htmlFilter.addRules( {
					attributes: {
						'class': function( value, element ) {
							var className = value.replace( 'cke_pagebreak', '' );
							if ( className != value ) {
								var span = CKEDITOR.htmlParser.fragment.fromHtml( '<span style="display: none;">&nbsp;</span>' ).children[ 0 ];
								element.children.length = 0;
								element.add( span );
								var attrs = element.attributes;
								delete attrs[ 'aria-label' ];
								delete attrs.contenteditable;
								delete attrs.title;
							}
							return className;
						}
					}
				}, { applyToAll: true, priority: 5 } );
			}

			if ( dataFilter ) {
				dataFilter.addRules( {
					elements: {
						div: function( element ) {
							// The "internal form" of a pagebreak is pasted from clipboard.
							// ACF may have distorted the HTML because "internal form" is
							// different than "data form". Make sure that element remains valid
							// by re-upcasting it (https://dev.ckeditor.com/ticket/11133).
							if ( element.attributes[ 'data-cke-pagebreak' ] )
								upcastPageBreak( element );

							// Check for "data form" of the pagebreak. If both element and
							// descendants match, convert them to internal form.
							else if ( styleRegex.test( element.attributes.style ) ) {
								var child = element.children[ 0 ];

								if ( child && child.name == 'span' && childStyleRegex.test( child.attributes.style ) )
									upcastPageBreak( element );
							}
						}
					}
				} );
			}
		}
	} );

	// TODO Much probably there's no need to expose this object as public object.
	CKEDITOR.plugins.pagebreakCmd = {
		exec: function( editor ) {
			editor.insertElement( CKEDITOR.plugins.pagebreak.createElement( editor ) );
		},
		context: 'div',
		allowedContent: {
			div: {
				styles: '!page-break-after'
			},
			span: {
				match: function( element ) {
					var parent = element.parent;
					return parent && parent.name == 'div' && parent.styles && parent.styles[ 'page-break-after' ];
				},
				styles: 'display'
			}
		},
		requiredContent: 'div{page-break-after}'
	};

	/**
	 * The namespace containing a set of [Page Break](https://ckeditor.com/cke4/addon/pagebreak) plugin helpers.
	 *
	 * @since 4.12.0
	 * @member CKEDITOR.plugins
	 */
	CKEDITOR.plugins.pagebreak = {
		/**
		 * Creates a read-only {@link CKEDITOR.dom.element} instance that represents a page break.
		 *
		 * @since 4.12.0
		 * @member CKEDITOR.plugins.pagebreak
		 * @param {CKEDITOR.editor} editor
		 * @returns {CKEDITOR.dom.element} A page break element.
		 */
		createElement: function( editor ) {
			return editor.document.createElement( 'div', {
				attributes: attributesSet( editor.lang.pagebreak.alt )
			} );
		}
	};

	// Returns an object representing all the attributes
	// of the "internal form" of the pagebreak element.
	function attributesSet( label ) {
		return {
			'aria-label': label,
			'class': 'cke_pagebreak',
			contenteditable: 'false',
			'data-cke-display-name': 'pagebreak',
			'data-cke-pagebreak': 1,
			style: 'page-break-after: always',
			title: label
		};
	}
} )();

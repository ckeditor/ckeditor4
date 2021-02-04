/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview POC of the line and paragraph numbering plugin.
 */

( function() {
	CKEDITOR.plugins.add( 'linenumbering', {
		// lang: 'en',
		icons: 'linenumbering', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		isSupportedEnvironment: function() {
			return !CKEDITOR.env.ie;
		},

		init: function( editor ) {
			if ( !this.isSupportedEnvironment() ) {
				return;
			}

			editor.on( 'instanceReady', function() {
				var Sidebar = CKEDITOR.tools.createClass( {
					$: function() {
						this.$ = CKEDITOR.dom.element.createFromHtml( '<iframe scrolling="no" class="cke_reset cke_wysiwyg_frame"></iframe>' );
						this.editorContents = editor.container.findOne( '.cke_contents');

						this.setInitialStyles();
						this.attach();
						this.setResizer();
						this.findParagraphs();
						this.renderNumbering();
						this.setupListeners();
					},

					proto: {
						getElement: function() {
							return this.$;
						},

						setInitialStyles: function() {
							this.getElement().setStyles( {
								width: '80px',
								height: this.getHeight() + 'px',
								backgroundColor: '#f8f8f8',
								float: 'left'
							} );
						},

						updateHeight: function() {
							this.getElement().setStyle( 'height', this.getHeight() + 'px' );
						},

						getHeight: function() {
							return this.editorContents.getClientSize().height;
						},

						attach: function() {
							this.getElement().insertBefore( this.editorContents );
						},

						setResizer: function() {
							editor.on( 'resize', function() {
								sidebarInstance.updateHeight();
							} );
						},

						setupListeners: function() {
							editor.on( 'change', function() {
								this.findParagraphs()
								this.renderNumbering();
							}, this );

							editor.editable().getDocument().on( 'scroll', function() {
								this.getElement().$.contentWindow.scrollTo( 0, editor.editable().getWindow().$.scrollY );
							}, this );
						},

						findParagraphs: function() {
							var list = editor.editable().find( 'p' ).toArray();
							this.paragraphs = [];

							CKEDITOR.tools.array.forEach( list, function( item ) {
								this.paragraphs.push( {
									element: item,
									position: item.getDocumentPosition().y
								} );
							}, this );
						},

						renderNumbering: function() {
							var lineCounter = 1;

							this.getElement().getFrameDocument().getBody().setHtml( '' );

							CKEDITOR.tools.array.forEach( this.paragraphs, function( p ) {
								var paragraph = new CKEDITOR.dom.element( 'p' );

								paragraph.setHtml( lineCounter );
								lineCounter++;

								paragraph.setStyles( {
									'font-family': 'Arial',
									'font-size': '13px',
									'line-height': '1.6',
									'margin-top': 0,
									'position': 'absolute',
									'top': p.position + 'px'
								} );

								this.getElement().getFrameDocument().getBody().append( paragraph );
							}, this );
						}
					}
				} );

				var sidebarInstance = new Sidebar();
			} );
		}
	} );
} )();

/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'inlinetoolbar', {
		requires: 'balloonpanel',
		init: function( editor ) {
			CKEDITOR.ui.inlineToolbar.prototype = CKEDITOR.tools.extend( CKEDITOR.ui.balloonPanel.prototype );
			CKEDITOR.ui.inlineToolbar.prototype.build = function() {
				var editor = this.editor;

				this.parts = {
					panel: CKEDITOR.dom.element.createFromHtml( this.templates.panel.output( {
						id: editor.id,
						langDir: editor.lang.dir,
						langCode: editor.langCode,
						name: editor.name,
						style: 'display:none;',
						voiceLabel: editor.lang.editorPanel + ', ' + editor.name
					} ) ),

					content: CKEDITOR.dom.element.createFromHtml( this.templates.content.output( {
						content: this.content || ''
					} ) ),

					triangleOuter: CKEDITOR.dom.element.createFromHtml( this.templates.triangleOuter.output() ),

					triangleInner: CKEDITOR.dom.element.createFromHtml( this.templates.triangleInner.output() )
				};

				// Append UI elements to create a panel.
				this.parts.panel.append( this.parts.triangleOuter );
				this.parts.panel.append( this.parts.content );
				this.parts.triangleOuter.append( this.parts.triangleInner );

				// Register panel children to focusManager (prevent from blurring the editor).
				this.registerFocusable( this.parts.panel );

				// Append the panel to the global document.
				CKEDITOR.document.getBody().append( this.parts.panel );

				// Set default dimensions of the panel.
				this.resize( this.width, this.height );

				// Activates listeners on panel show.
				// All listeners will be deactivated on panel hide.
				this.on( 'show', this.activateShowListeners, this );

				// Deactivate all listeners on panel hide.
				this.on( 'hide', this.deactivateShowListeners, this );
			};

			CKEDITOR.ui.inlineToolbar.prototype.attach = ( function() {
				var winGlobal, frame, editable, isInline;

				function rectIntersectArea( rect1, rect2 ) {
					var hOverlap = Math.max( 0, Math.min( rect1.right, rect2.right ) - Math.max( rect1.left, rect2.left ) ),
						vOverlap = Math.max( 0, Math.min( rect1.bottom, rect2.bottom ) - Math.max( rect1.top, rect2.top ) );

					return hOverlap * vOverlap;
				}

				function newPanelRect( top, left, panelWidth, panelHeight ) {
					var newRect = {
						top: top,
						left: left
					};

					newRect.right = newRect.left + panelWidth;
					newRect.bottom = newRect.top + panelHeight;

					return newRect;
				}

				// Returns element rect absolute to the top-most document, e.g. it considers
				// outer window scroll position, inner window scroll position (framed editor) and
				// frame position (framed editor) in the top-most document.
				function getAbsoluteRect( element ) {
					var elementRect = element.getClientRect(),
						winGlobalScroll = winGlobal.getScrollPosition(),
						frameRect;

					if ( isInline || element.equals( frame ) ) {
						elementRect.top = elementRect.top + winGlobalScroll.y;
						elementRect.left = elementRect.left + winGlobalScroll.x;
						elementRect.right = elementRect.left + elementRect.width;
						elementRect.bottom = elementRect.top + elementRect.height;
					} else {
						frameRect = frame.getClientRect();

						elementRect.top = frameRect.top + elementRect.top + winGlobalScroll.y;
						elementRect.left = frameRect.left + elementRect.left + winGlobalScroll.x;
						elementRect.right = elementRect.left + elementRect.width;
						elementRect.bottom = elementRect.top + elementRect.height;
					}

					return elementRect;
				}
				function isVisible( elementRect, selectedRect ) {
					if ( elementRect.top > selectedRect.bottom || elementRect.bottom < selectedRect.top ) {
						return false;
					}
					return true;
				}

				return function( element, focusElement ) {

					winGlobal = CKEDITOR.document.getWindow();
					frame = this.editor.window.getFrame();
					editable = this.editor.editable();
					isInline = editable.isInline();

					var panelWidth = this.getWidth(),
						panelHeight = this.getHeight(),

						elementRect = getAbsoluteRect( element ),
						editorRect = getAbsoluteRect( isInline ? editable : frame ),

						viewPaneSize = winGlobal.getViewPaneSize(),
						winGlobalScroll = winGlobal.getScrollPosition();

					// allowedRect is the rect into which the panel should fit to remain
					// both within the visible area of the editor and the viewport, i.e.
					// the rect area covered by "#":
					//
					// 	[Viewport]
					// 	+-------------------------------------+
					// 	|                        [Editor]     |
					// 	|                        +--------------------+
					// 	|                        |############|       |
					// 	|                        |############|       |
					// 	|                        |############|       |
					// 	|                        +--------------------+
					// 	|                                     |
					// 	+-------------------------------------+
					var allowedRect = {
						top: Math.max( editorRect.top, winGlobalScroll.y ),
						left: Math.max( editorRect.left, winGlobalScroll.x ),
						right: Math.min( editorRect.right, viewPaneSize.width + winGlobalScroll.x ),
						bottom: Math.min( editorRect.bottom, viewPaneSize.height + winGlobalScroll.y )
					};

					if ( isInline ) {
						// In inline we want to limit position within the window.
						allowedRect = this._getViewPaneRect( winGlobal );

						// We need also consider triangle.
						allowedRect.right += this.triangleWidth;
						allowedRect.bottom += this.triangleHeight;
					}

					// This method will modify elementRect if the element is outside of allowedRect / editorRect.
					// If it's outside then in
					var selectedRect = isInline ? allowedRect : editorRect;
					if ( !isVisible( elementRect, selectedRect ) ) {
						this.hide();
						return;
					} else {
						this.show();
					}

					this.fire( 'attach' );
					this._adjustElementRect( elementRect, selectedRect );
					// The area of the panel.
					var panelArea = panelWidth * panelHeight,
						alignments = {
							'top hcenter': {
								top: elementRect.top - panelHeight - this.triangleHeight,
								left: elementRect.left + elementRect.width / 2 - panelWidth / 2
							},
							'bottom hcenter': {
								top: elementRect.bottom + this.triangleHeight,
								left: elementRect.left + elementRect.width / 2 - panelWidth / 2
							}
						},
						minDifferenceAlignment, alignmentRect, areaDifference;

					// Iterate over all possible alignments to find the optimal one.
					for ( var a in alignments ) {
						// Create a rect which would represent the panel in such alignment.
						alignmentRect = newPanelRect( alignments[ a ].top, alignments[ a ].left, panelWidth, panelHeight );

					// Calculate the difference between the area of the panel and intersection of allowed rect and alignment rect.
						// It is the area of the panel, which would be OUT of allowed rect if such alignment was used. Less is better.
						areaDifference = alignments[ a ].areaDifference = panelArea - rectIntersectArea( alignmentRect, allowedRect );

						// If the difference is 0, it means that the panel is fully within allowed rect. That's great!
						if ( areaDifference === 0 ) {
							minDifferenceAlignment = a;
							break;
						}

						// If there's no alignment of a minimal area difference, use the first available.
						if ( !minDifferenceAlignment ) {
							minDifferenceAlignment = a;
						}

						// Determine the alignment of a minimal area difference. It will be used as a fallback
						// if no aligment provides a perfect fit into allowed rect.
						if ( areaDifference < alignments[ minDifferenceAlignment ].areaDifference ) {
							minDifferenceAlignment = a;
						}
					}

					this.move( alignments[ minDifferenceAlignment ].top, alignments[ minDifferenceAlignment ].left );
					minDifferenceAlignment = minDifferenceAlignment.split( ' ' );

					this.setTriangle( minDifferenceAlignment[0] === 'top' ? 'bottom' : 'top', 'hcenter' );

					// Set focus to proper element.
					if ( focusElement !== false ) {
						( focusElement || this.parts.panel ).focus();
					}
				};
			} )();
			CKEDITOR.ui.inlineToolbar.prototype.create = function( element ) {
				this.attach( element );

				var that = this,
				editable = this.editor.editable();

				this.editor.on( 'resize', function() {
					that.attach( element, false );
				} );
				editable.attachListener( editable.getDocument(), 'scroll', function() {
					that.attach( element, false );
				} );
			};
				/////TEMPORARY CODE ///////
			editor.addCommand( 'testInlineToolbar', {
				exec: function( editor ) {
					var img = editor.editable().findOne( 'img' );
					if ( img ) {
						var panel = new CKEDITOR.ui.balloonPanel( editor, {
							title: 'My Panel',
							content: '<p>This is my panel</p>'
						} );

						// Attach the panel to an element in DOM and show it immediately.
						panel.create( img );
					}
				}
			} );
			editor.ui.addButton( 'testInlineToolbar', {
				label: 'test inlinetoolbar',
				command: 'testInlineToolbar',
				toolbar: 'insert'
			} );
		}
	} );

	CKEDITOR.ui.inlineToolbar = function( editor, definition ) {
		CKEDITOR.ui.balloonPanel.call( this, editor, definition );
		//regitster panel on scroll, resize, rotation device
	};

}() );

/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'inlinetoolbar', {
		requires: 'balloonpanel',
		init: function( editor ) {
			CKEDITOR.ui.inlineToolbar.prototype = Object.create( CKEDITOR.ui.balloonPanel.prototype );
			CKEDITOR.ui.inlineToolbar.prototype.build = function() {
				CKEDITOR.ui.balloonPanel.prototype.build.call( this );
				this.parts.title.remove();
				this.parts.close.remove();
			};

			CKEDITOR.ui.inlineToolbar.prototype._getAlignments = function( elementRect, panelWidth, panelHeight ) {
				return {
					'top hcenter': {
						top: elementRect.top - panelHeight - this.triangleHeight,
						left: elementRect.left + elementRect.width / 2 - panelWidth / 2
					},
					'bottom hcenter': {
						top: elementRect.bottom + this.triangleHeight,
						left: elementRect.left + elementRect.width / 2 - panelWidth / 2
					}
				};
			};

			CKEDITOR.ui.inlineToolbar.prototype.destroy = function() {
				CKEDITOR.ui.balloonPanel.prototype.destroy.call( this );
				if ( this.listeners ) {
					this.editor.removeListener( 'resize', this.listeners.resize );
					this.listeners.scrollEvent.removeListener();
					this.listeners = null;
				}
			};

			CKEDITOR.ui.inlineToolbar.prototype.create = function( element ) {
				this.attach( element );

				var that = this,
				editable = this.editor.editable();
				if ( this.listeners ) {
					this.editor.removeListener( 'resize', this.listeners.resize );
					this.listeners.scrollEvent.removeListener();
					this.listeners = null;
				}
				this.listeners = {
					resize: function() {
						that.attach( element, false );
					},
					scroll: function() {
						that.attach( element, false );
					}
				};

				this.editor.on( 'resize', this.listeners.resize );
				this.listeners.scrollEvent = editable.attachListener( editable.getDocument(), 'scroll', this.listeners.scroll );
			};

			CKEDITOR.ui.inlineToolbar.prototype.detach = function() {
				if ( this.listeners ) {
					this.editor.removeListener( 'resize', this.listeners.resize );
					this.listeners.scrollEvent.removeListener();
					this.listeners = null;
				}
				this.hide();
			};

				/////TEMPORARY CODE ///////
			editor.addCommand( 'testInlineToolbar', {
				exec: function( editor ) {
					var img = editor.editable().findOne( 'img' );
					if ( img ) {
						var panel = new CKEDITOR.ui.inlineToolbar( editor );
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
	};

}() );

/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'inlinetoolbar', {
		requires: 'balloonpanel',
		init: function( editor ) {
			CKEDITOR.ui.inlineToolbarView.prototype = CKEDITOR.tools.extend( {}, CKEDITOR.ui.balloonPanel.prototype );
			CKEDITOR.ui.inlineToolbarView.prototype.build = function() {
				CKEDITOR.ui.balloonPanel.prototype.build.call( this );
				this.parts.title.remove();
				this.parts.close.remove();
			};

			CKEDITOR.ui.inlineToolbarView.prototype._getAlignments = function( elementRect, panelWidth, panelHeight ) {
				var filter = [ 'top hcenter', 'bottom hcenter' ],
					output = {},
					alignments = CKEDITOR.ui.balloonPanel.prototype._getAlignments.call( this, elementRect, panelWidth, panelHeight );
				for ( var a in alignments ) {
					if ( CKEDITOR.tools.indexOf( filter, a ) !== -1 ) {
						output[ a ] = alignments[ a ];
					}
				}
				return output;
			};

			CKEDITOR.ui.inlineToolbarView.prototype._detachListiners = function() {
				if ( this.listeners ) {
					this.editor.removeListener( 'resize', this.listeners.resize );
					this.listeners.scrollEvent.removeListener();
					this.listeners = null;
				}
			};

			CKEDITOR.ui.inlineToolbarView.prototype.destroy = function() {
				CKEDITOR.ui.balloonPanel.prototype.destroy.call( this );
				this._detachListiners();
			};

			CKEDITOR.ui.inlineToolbarView.prototype.create = function( element ) {
				this.attach( element );

				var that = this,
					editable = this.editor.editable();
				this._detachListiners();
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

			CKEDITOR.ui.inlineToolbarView.prototype.detach = function() {
				this._detachListiners();
				this.hide();
			};

			function temporaryCode() {
				editor.addCommand( 'testInlineToolbar', {
					exec: function( editor ) {
						var img = editor.editable().findOne( 'img' );
						if ( img ) {
							var panel = new CKEDITOR.ui.inlineToolbarView( editor );
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
			temporaryCode();
		}
	} );

	CKEDITOR.ui.inlineToolbarView = function( editor, definition ) {
		CKEDITOR.ui.balloonPanel.call( this, editor, definition );
	};

}() );

/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: toolbar,link,inlinetoolbar */
/* bender-include: ../balloonpanel/_helpers/tools.js */
/* global balloonTestsTools */

( function() {
	'use strict';

	bender.editor = {
		name: 'divarea',
		creator: 'replace',
		config: {
			extraPlugins: 'divarea',
			extraAllowedContent: 'span[id]',
			height: 300,
			width: 300
		}
	};


	var spy = sinon.spy,
	tests = {
		// There's no need to call editor.window.scrollTo, because balloon logic initially considers only
		// scrolling of **outer window**. It does not care about editable window, as its scrolling is already
		// "contained" in result returned by the element.getClientRect() of marker.
		_getFrameMethodReplaced: false,

		setUp: function() {
			this.getViewPaneSize = sinon.stub( this.editor.window, 'getViewPaneSize', function() {
				return {
					width: 1183,
					height: 1818
				};
			} );
			this.inlineToolbar = new CKEDITOR.ui.inlineToolbarView( this.editor, {
				width: 100,
				height: 200
			} );

			this.markerElement = this.editor.editable().findOne( '#marker' );

			// Make sure that global window is scrolled down to 0,0.
			window.scrollTo( 0, 0 );

			if ( !this._getFrameMethodReplaced ) {
				// The problem is also window.getFrame().getClientRect() as it returns different results from dashboard and directly.
				this._getFrameMethodReplaced = true;
				var orig = this.editor.window.getFrame;

				this.editor.window.getFrame = function() {
					var ret = orig.call( this );

					if ( ret ) {
						ret.getClientRect = function() {
							return { height: 300, width: 300, left: 1, bottom: 643, right: 301, top: 343 };
						};
					}

					return ret;
				};
			}
			this.moveSpy = spy( this.inlineToolbar, 'move' );
		},

		tearDown: function() {
			this.moveSpy.restore();
			this.getViewPaneSize.restore();
			this.inlineToolbar.destroy();
			this.inlineToolbar = null;
		},


		'test divaera - out of view - bottom center': function() {
			// Position acts as if the editor viewport was at position x: 260, 0.
			this.markerElement.getClientRect = sinon.stub().returns( { height: 15, width: 25, left: 129, bottom: 416.34375, right: 154, top: 401.34375 } );
			balloonTestsTools.attachBalloon( this.inlineToolbar, this.markerElement );

			balloonTestsTools.assertMoveTo( this.moveSpy, 91.5, 181.34375 );

		},

		'test divaera - out of view - hcenter top': function() {
			// Position acts as if the editor viewport was at position x: 260, 500.
			this.markerElement.getClientRect = sinon.stub().returns( { height: 15, width: 25, left: 129, bottom: -75.65625, right: 154, top: -90.65625 } );
			balloonTestsTools.attachBalloon( this.inlineToolbar, this.markerElement );

			balloonTestsTools.assertMoveTo( this.moveSpy, 91.5, 20 );
		}
	};
	bender.test( tests );
} )();

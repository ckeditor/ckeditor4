/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: toolbar,link,inlinetoolbar */
/* bender-include: ../balloonpanel/_helpers/tools.js */
/* global balloonTestsTools */

( function() {
	'use strict';

	var restore = CKEDITOR.dom.window.prototype.getViewPaneSize;
	CKEDITOR.dom.window.prototype.getViewPaneSize = function() {
		return {
			width: 1183,
			height: 1818
		};
	};

	bender.editor = {
		name: 'editor1',
		config: {
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
				this.inlineToolbar = new CKEDITOR.ui.inlineToolbar( this.editor, {
					width: 100,
					height: 200
				} );

				this.markerElement = this.editor.editable().findOne( '#marker' );

				// Make sure that global window is scrolled down to 0,0.
				window.scrollTo( 0, 0 );

				if ( !this._getFrameMethodReplaced ) {
					sinon.stub( this.editor.window, 'getFrame', { height: 300, width: 300, left: 1, bottom: 643, right: 301, top: 343 } );
				}
			},

			tearDown: function() {
				this.inlineToolbar.destroy();
				this.inlineToolbar = null;
			},


			'test classic - out of view - bottom center': function() {
				// Position acts as if the editor viewport was at position x: 260, 0.
				this.markerElement.getClientRect = sinon.stub().returns( { height: 15, width: 25, left: 129, bottom: 416.34375, right: 154, top: 401.34375 } );
				var moveSpy = spy( this.inlineToolbar, 'move' );
				balloonTestsTools.attachBalloon( this.inlineToolbar, this.markerElement );

				balloonTestsTools.assertMoveTo( moveSpy, 92.5, 422 );

				moveSpy.restore();
			},

			'test classic - out of view - hcenter top': function() {
				// Position acts as if the editor viewport was at position x: 260, 500.
				this.markerElement.getClientRect = sinon.stub().returns( { height: 15, width: 25, left: 129, bottom: -75.65625, right: 154, top: -90.65625 } );
				var moveSpy = spy( this.inlineToolbar, 'move' );
				balloonTestsTools.attachBalloon( this.inlineToolbar, this.markerElement );

				balloonTestsTools.assertMoveTo( moveSpy, 92.5, 363 );

				moveSpy.restore();
			}
		};
	bender.test( tests );
	CKEDITOR.dom.window.prototype.getViewPaneSize = restore;
} )();

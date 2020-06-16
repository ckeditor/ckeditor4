/* bender-tags: editor,balloonpanel */
/* bender-ckeditor-plugins: balloonpanel,toolbar,wysiwygarea,basicstyles */
/* bender-include: ./_helpers/tools.js */
/* global balloonTestsTools */

( function() {
	'use strict';

	var getViewPaneSizeStub;

/*
Editors' order is important (#2350).
When inline editor is added as a last one, there appear an error for test:

	Triangle tip y position outside of element
	Expected: Greater than 464 and lower than 485. (string)
	Actual:   1013.5 (number)

It seems that iOS might have some sort of optimization which is not refreshed as frequently as test goes.
That's why method `CKEDITOR.tools.getAbsoluteRectPosition()`, which uses native `getBoundingClientRect()`,
obtain negative `top` and `y` value, which is propagate to test result.
*/
	bender.editors = {
		divarea: {
			name: 'editor2',
			startupData: '<p><strong>Hello</strong> world</p>',
			config: {
				width: 300,
				height: 300,
				allowedContent: true,
				extraPlugins: 'divarea'
			}
		},
		inline: {
			name: 'editor3',
			startupData: '<p><strong>Hello</strong> world</p>',
			creator: 'inline',
			config: {
				width: 300,
				height: 300,
				allowedContent: true
			}
		},
		classic: {
			name: 'editor1',
			startupData: '<p><strong>Hello</strong> world</p>',
			config: {
				width: 300,
				height: 300,
				allowedContent: true
			}
		}
	};

	function calculatePositions( editor, panelWidth, panelHeight ) {
		var panel = new CKEDITOR.ui.balloonPanel( editor, {
			title: 'Test panel #1',
			width: panelWidth,
			height: panelHeight
		} );
		var element = editor.editable().findOne( 'strong' );

		panel.attach( element );

		return {
			elementRect: element.getClientRect( true ),
			triangleTip: balloonTestsTools.getTriangleTipPosition( panel ),
			panel: panel
		};
	}

	var tests = {
		setUp: function() {
			// Stub view port size.
			getViewPaneSizeStub = sinon.stub( CKEDITOR.dom.window.prototype, 'getViewPaneSize' );
			getViewPaneSizeStub.returns( {
				width: 2000,
				height: 3000
			} );
		},
		tearDown: function() {
			getViewPaneSizeStub.restore();
			CKEDITOR.document.getBody().removeStyle( 'min-width' );
			CKEDITOR.document.getBody().removeStyle( 'min-height' );
		},
		'test positioning in nonstatic body': function( editor ) {
			CKEDITOR.document.getBody().setStyles( {
				position: 'relative',
				'margin-left': '300px',
				'margin-top': '300px',
				'min-width': '2000px',
				'min-height': '3000px'
			} );
			var bodyMarginLeft = parseInt( CKEDITOR.document.getBody().getComputedStyle( 'margin-left' ), 10 ),
				bodyMarginTop = parseInt( CKEDITOR.document.getBody().getComputedStyle( 'margin-top' ), 10 ),
				DELTA = 1,
				pos;

			pos = calculatePositions( editor, 100, 50 );

			// Because balloon is positioned absolutely, and body is relative with margin, then we need to add those margin to final result to get proper position on the screen.
			assert.isNumberInRange( pos.triangleTip.x + bodyMarginLeft, pos.elementRect.left - DELTA, pos.elementRect.right + DELTA, 'Triangle tip x position outsid of element' );
			assert.isNumberInRange( pos.triangleTip.y + bodyMarginTop, pos.elementRect.top - DELTA, pos.elementRect.bottom + DELTA, 'Triangle tip y position outside of element' );
			pos.panel.destroy();
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();

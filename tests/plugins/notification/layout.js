/* bender-tags: editor */
/* bender-ckeditor-plugins: notification,toolbar */

/**
 * Tests for layout have input and output data based on the real notification positions, which were checked that are
 * correct. Such tests are not flexible but preparing more complex tests would be too time consuming. These test
 * exists to check if `_layout` code works the same way on all browsers, there is no syntax error and behavior of the
 * `_layout` function will not change in the future. If it will tests should be modified.
 */

'use strict';

bender.editors = {
	top: {},
	bottom: {
		config: {
			toolbarLocation: 'bottom'
		}
	}
};

/**
 * mockValues: {
 * 		mockValues.topToolbarRectBottom
 * 		mockValues.contentsRectWidth
 * 		mockValues.contentsRectHeight
 * 		mockValues.contentsRectLeft
 * 		mockValues.contentsRectTop
 * 		mockValues.contentsRectBottom
 * 		mockValues.contentsPosX
 * 		mockValues.contentsPosY
 * 		mockValues.scrollPosX
 * 		mockValues.scrollPosY
 * 		mockValues.viewRectWidth
 * }
 *
 * expected: {
 * 		position,
 * 		top,
 * 		left
 * }
 */
function createLayoutTest( editorName, mockValues, expected ) {
	return function() {
		var editor = this.editors[ editorName ],
			area = editor._.notificationArea,
			body = CKEDITOR.document.getBody();

		this.sandbox.stub( editor.ui, 'space' )
			.withArgs( 'top' ).returns( {
				getClientRect: function() {
					return {
						bottom: mockValues.topToolbarRectBottom
					};
				},
				isVisible: function() {
					return true;
				}
			} )
			.withArgs( 'bottom' ).returns( {
				getClientRect: function() {
					return {
						bottom: mockValues.bottomToolbarRectBottom
					};
				},
				isVisible: function() {
					return true;
				}
			} );

		this.sandbox.stub( editor.ui.contentsElement, 'getClientRect' ).returns( {
			width: mockValues.contentsRectWidth,
			height: mockValues.contentsRectHeight,
			left: mockValues.contentsRectLeft,
			top: mockValues.contentsRectTop,
			bottom: mockValues.contentsRectBottom
		} );

		this.sandbox.stub( editor.ui.contentsElement, 'getDocumentPosition' ).returns( {
			x: mockValues.contentsPosX,
			y: mockValues.contentsPosY
		} );

		this.sandbox.stub( CKEDITOR.document, 'getWindow' ).returns( {
			getScrollPosition: function() {
				return {
					x: mockValues.scrollPosX,
					y: mockValues.scrollPosY
				};
			},
			getViewPaneSize: function() {
				return {
					width: mockValues.viewRectWidth
				};
			},
			on: function() {}
		} );

		this.sandbox.stub( body, 'getDocumentPosition', function() {
			return { x: 0, y: 0 };
		} );

		this.sandbox.stub( CKEDITOR.document, 'getBody' ).returns( body );

		this.sandbox.stub( area.element, 'getClientRect' ).returns( {
			height: 47
		} );

		area.add( new CKEDITOR.plugins.notification( editor, { message: 'Foo' } ) );

		if ( expected.position ) {
			assert.areSame( expected.position, area.element.getStyle( 'position' ), 'Position.' );
		}

		if ( expected.top ) {
			assert.areSame( expected.top, roundValue( area.element.getStyle( 'top' ) ), 'Top.' );
		}

		if ( expected.left ) {
			assert.areSame( expected.left, roundValue( area.element.getStyle( 'left' ) ) , 'Left.' );
		}

		function roundValue( value ) {
			return Math.round( value.replace( 'px', '' ) ) + 'px';
		}
	};
}

bender.test( {
	'setUp': function() {
		this.sandbox = sinon.sandbox.create();
	},

	'tearDown': function() {
		var editors = CKEDITOR.tools.object.values( this.editors );

		this.sandbox.restore();

		for ( var i = 0; i < editors.length; i++ ) {
			var editor = editors[ i ],
				notifications = editor._.notificationArea.notifications;

			while ( notifications.length ) {
				editor._.notificationArea.remove( notifications[ 0 ] );
			}
		}
	},

	'test horizontal below toolbar': createLayoutTest( 'top', {
		topToolbarRectBottom: 109,
		contentsRectWidth: 960,
		contentsRectHeight: 720.890625,
		contentsRectLeft: 485,
		contentsRectTop: -283.921875,
		contentsRectBottom: 436.96875,
		contentsPosX: 2000,
		contentsPosY: 752.078125,
		scrollPosX: 1515,
		scrollPosY: 1036,
		viewRectWidth: 1903
	}, {
		position: 'fixed',
		top: '109px',
		left: '804px'
	} ),

	'test horizontal top fixed': createLayoutTest( 'top', {
		topToolbarRectBottom: -66,
		contentsRectWidth: 958,
		contentsRectHeight: 200,
		contentsRectLeft: 359,
		contentsRectTop: -66,
		contentsRectBottom: 134,
		contentsPosX: 2001,
		contentsPosY: 861,
		scrollPosX: 1642,
		scrollPosY: 927,
		viewRectWidth: 1903
	}, {
		position: 'fixed',
		top: '0px',
		left: '677px'
	} ),

	'test horizontal top': createLayoutTest( 'top', {
		topToolbarRectBottom: 736,
		contentsRectWidth: 960,
		contentsRectHeight: 720,
		contentsRectLeft: 485,
		contentsRectTop: 16,
		contentsRectBottom: 736,
		contentsPosX: 2000,
		contentsPosY: 752,
		scrollPosX: 1515,
		scrollPosY: 736,
		viewRectWidth: 1903
	}, {
		position: 'absolute',
		top: '752px',
		left: '2319px'
	} ),

	// (#624)
	'test horizontal bottom toolbar with viewport at the top': createLayoutTest( 'bottom', {
		bottomToolbarRectBottom: 736,
		contentsRectWidth: 960,
		contentsRectHeight: 720,
		contentsRectLeft: 485,
		contentsRectTop: 16,
		contentsRectBottom: 736,
		contentsPosX: 2000,
		contentsPosY: 752,
		scrollPosX: 1515,
		scrollPosY: 736,
		viewRectWidth: 1903
	}, {
		position: 'absolute',
		top: '752px',
		left: '2319px'
	} ),

	// (#624)
	'test horizontal bottom toolbar with with viewport in the middle': createLayoutTest( 'bottom', {
		bottomToobarRectBottom: 436.96875,
		contentsRectWidth: 960,
		contentsRectHeight: 720.890625,
		contentsRectLeft: 485,
		contentsRectTop: -283.921875,
		contentsRectBottom: 436.96875,
		contentsPosX: 2000,
		contentsPosY: 752.078125,
		scrollPosX: 1515,
		scrollPosY: 1036,
		viewRectWidth: 1903
	}, {
		position: 'fixed',
		top: '0px',
		left: '804px'
	} ),

	// (#624)
	'test horizontal bottom toolbar with viewport below': createLayoutTest( 'bottom', {
		bottomToobarRectBottom: -166,
		contentsRectWidth: 958,
		contentsRectHeight: 200,
		contentsRectLeft: 416,
		contentsRectTop: -166,
		contentsRectBottom: 34,
		contentsPosX: 2001,
		contentsPosY: 861,
		scrollPosX: 1585,
		scrollPosY: 1027,
		viewRectWidth: 1903
	}, {
		position: 'absolute',
		top: '1014px',
		left: '2319px'
	} ),

	'test horizontal bottom': createLayoutTest( 'top', {
		topToolbarRectBottom: -166,
		contentsRectWidth: 958,
		contentsRectHeight: 200,
		contentsRectLeft: 416,
		contentsRectTop: -166,
		contentsRectBottom: 34,
		contentsPosX: 2001,
		contentsPosY: 861,
		scrollPosX: 1585,
		scrollPosY: 1027,
		viewRectWidth: 1903
	}, {
		position: 'absolute',
		top: '1014px',
		left: '2319px'
	} ),

	'test vertical - narrow content - left 1': createLayoutTest( 'top', {
		topToolbarRectBottom: 0,
		contentsRectWidth: 200,
		contentsRectHeight: 36,
		contentsRectLeft: 578,
		contentsRectTop: 152,
		contentsRectBottom: 188,
		contentsPosX: 2000,
		contentsPosY: 752,
		scrollPosX: 1422,
		scrollPosY: 600,
		viewRectWidth: 1903
	}, {
		position: 'absolute',
		top: '752px',
		left: '2000px'
	} ),

	'test vertical - narrow content - left 2': createLayoutTest( 'top', {
		topToolbarRectBottom: 0,
		contentsRectWidth: 200,
		contentsRectHeight: 36,
		contentsRectLeft: -106,
		contentsRectTop: 152,
		contentsRectBottom: 188,
		contentsPosX: 2000,
		contentsPosY: 752,
		scrollPosX: 2106,
		scrollPosY: 600,
		viewRectWidth: 1903
	}, {
		position: 'absolute',
		top: '752px',
		left: '2000px'
	} ),

	'test vertical - narrow content - right': createLayoutTest( 'top', {
		topToolbarRectBottom: 0,
		contentsRectWidth: 200,
		contentsRectHeight: 36,
		contentsRectLeft: 1679,
		contentsRectTop: 152,
		contentsRectBottom: 188,
		contentsPosX: 2000,
		contentsPosY: 752,
		scrollPosX: 321,
		scrollPosY: 600,
		viewRectWidth: 1903
	}, {
		position: 'absolute',
		top: '752px',
		left: '1878px'
	} ),

	'test vertical - wide content - left fixed': createLayoutTest( 'top', {
		topToolbarRectBottom: 0,
		contentsRectWidth: 960,
		contentsRectHeight: 720.890625,
		contentsRectLeft: -550,
		contentsRectTop: -247.921875,
		contentsRectBottom: 472.96875,
		contentsPosX: 2000,
		contentsPosY: 752.078125,
		scrollPosX: 2550,
		scrollPosY: 1000,
		viewRectWidth: 1903
	}, {
		position: 'fixed',
		top: '0px',
		left: '0px'
	} ),

	'test vertical - wide content - right': createLayoutTest( 'top', {
		topToolbarRectBottom: 0,
		contentsRectWidth: 960,
		contentsRectHeight: 720.890625,
		contentsRectLeft: -741,
		contentsRectTop: -247.921875,
		contentsRectBottom: 472.96875,
		contentsPosX: 2000,
		contentsPosY: 752.078125,
		scrollPosX: 2741,
		scrollPosY: 1000,
		viewRectWidth: 1903
	}, {
		position: 'fixed',
		top: '0px',
		left: '-103px'
	} ),


	'test vertical - wide content - center': createLayoutTest( 'top', {
		topToolbarRectBottom: 0,
		contentsRectWidth: 960,
		contentsRectHeight: 720.890625,
		contentsRectLeft: -231,
		contentsRectTop: -247.921875,
		contentsRectBottom: 472.96875,
		contentsPosX: 2000,
		contentsPosY: 752.078125,
		scrollPosX: 2231,
		scrollPosY: 1000,
		viewRectWidth: 1903
	}, {
		position: 'fixed',
		top: '0px',
		left: '88px'
	} ),

	'test vertical - wide content - right fixed': createLayoutTest( 'top', {
		topToolbarRectBottom: 0,
		contentsRectWidth: 960,
		contentsRectHeight: 720.890625,
		contentsRectLeft: 1496,
		contentsRectTop: -247.921875,
		contentsRectBottom: 472.96875,
		contentsPosX: 2000,
		contentsPosY: 752.078125,
		scrollPosX: 504,
		scrollPosY: 1000,
		viewRectWidth: 1903
	}, {
		position: 'fixed',
		top: '0px',
		left: '1581px'
	} ),

	'test vertical - wide content - left': createLayoutTest( 'top', {
		topToolbarRectBottom: 0,
		contentsRectWidth: 960,
		contentsRectHeight: 720.890625,
		contentsRectLeft: 1685,
		contentsRectTop: -247.921875,
		contentsRectBottom: 472.96875,
		contentsPosX: 2000,
		contentsPosY: 752.078125,
		scrollPosX: 315,
		scrollPosY: 1000,
		viewRectWidth: 1903
	}, {
		position: 'fixed',
		top: '0px',
		left: '1685px'
	} )
} );

/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, table, image2, clipboard */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	var overlay;

	bender.test( {
		// Hide editor under an overlay, to prevent accidental mouse move which might break TC.
		setUp: function() {
			if ( !overlay ) {
				overlay = new CKEDITOR.dom.element( 'div' );

				overlay.setStyles( {
					position: 'fixed',
					width: '100%',
					height: '100%',
					left: 0,
					top: 0
				} );

				CKEDITOR.document.getBody().append( overlay );
			} else {
				overlay.removeStyle( 'display' );
			}
		},
		tearDown: function() {
			overlay.setStyle( 'display', 'none' );
		},
		// (#1648)
		'test drag into table left top cell - empty': assertDragLine( 'table tr:nth-child(1) th:nth-child(1)', 'inside' ),
		'test drag into table middle cell - empty': assertDragLine( 'table tr:nth-child(1) td:nth-child(2)', 'inside' ),
		'test drag into table right bottom cell - empty': assertDragLine( 'table tr:nth-child(2) td:nth-child(3)', 'inside' ),
		'test drag into table middle top cell - empty': assertDragLine( 'table tr:nth-child(1) th:nth-child(2)', 'before' ),
		'test drag into table right middle cell - empty': assertDragLine( 'table tr:nth-child(1) td:nth-child(3)', 'after' ),
		'test drag into table left bottom  cell - empty': assertDragLine( 'table tr:nth-child(2) td:nth-child(1)', 'before' ),
		'test drag into table right top cell - empty': assertDragLine( 'table tr:nth-child(1) th:nth-child(3)', 'after' ),
		'test drag into table left middle cell - empty': assertDragLine( 'table tr:nth-child(1) td:nth-child(1)', 'before' ),
		'test drag into table middle bottom cell - empty': assertDragLine( 'table tr:nth-child(2) td:nth-child(2)', 'after' )
	} );

	function assertDragLine( selector, position ) {
		return function() {
			this.editorBot.setData( CKEDITOR.document.findOne( '#editor-content' ).getHtml(), function() {
				var editor = this.editor,
					editable = editor.editable(),
					handler = editable.findOne( '.cke_widget_drag_handler' ),
					element = editable.findOne( selector ),
					coordinates = getPoint( element.getClientRect(), 'inside' );

				// Adjust mouse position closer to tested edge of cell.
				if ( position in { before: 1 , after: 1 } ) {
					coordinates.y += position === 'before' ? -1 : 1;
				}

				handler.once( 'mousedown', function() {

					editable.fire( 'mousemove', {
						$: {
							clientX: coordinates.x,
							clientY: coordinates.y
						}
					} );

				}, null, null, 9999 );

				editable.once( 'mousemove', function() {
					// Wait for event buffer which is 50ms.
					setTimeout( function() {
						resume( function() {
							if ( position in { before: 1 , after: 1 } ) {
								var referenceElement = element[ position === 'before' ? 'getFirst' : 'getLast' ]();
							}

							var elementRect = ( referenceElement || element ).getClientRect( true ),
								visible = editor.widgets.liner.visible,
								lineRect = visible[ CKEDITOR.tools.objectKeys( visible )[ 0 ] ].getClientRect( true ),
								actual = getPoint( lineRect, position ),
								expected = getPoint( elementRect, position );

							assert.isNumberInRange( expected.x, actual.x - 1, actual.x + 1, 'Line vertical position' );
							assert.isNumberInRange( expected.y, actual.y - 1, actual.y + 1, 'Line horizontal position' );

							editor.once( 'paste', function() {
								resume( function() {
									var widget = editable.findOne( 'figure' );
									assert.isTrue( element[ position === 'after' ? 'getLast' : 'getFirst' ]().contains( widget ), 'Widget in cell' );
								} );
							}, null, null, 999 );

							CKEDITOR.document.fire( 'mouseup', {
								button: CKEDITOR.MOUSE_BUTTON_LEFT,
								getTarget: function() {
									return element;
								}
							} );

							wait();
						} );
					}, 55 );
				}, null, null, 9999 );

				handler.fire( 'mousedown', new CKEDITOR.dom.event( {
					button: CKEDITOR.MOUSE_BUTTON_LEFT,
					target: handler
				} ) );

				wait();
			} );
		};
	}

	function getPoint( rect, position ) {
		var y;

		if ( position in { before: 1 , after: 1 } ) {
			y = position === 'before' ? rect.top : rect.bottom;
		} else {
			y = ( rect.bottom + rect.top ) / 2;
		}

		return {
			x: ( rect.right + rect.left ) / 2,
			y: y
		};
	}
} )();

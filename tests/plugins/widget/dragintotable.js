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
		'test drag into table left top cell': assertDragLine( 'table tr:nth-child(1) th:nth-child(1)' ),
		// (#1648)
		'test drag into table middle cell': assertDragLine( 'table tr:nth-child(1) td:nth-child(2)' ),
		// (#1648)
		'test drag into table right bottom cell': assertDragLine( 'table tr:nth-child(2) td:nth-child(3)' )
	} );

	function assertDragLine( selector ) {
		return function() {
			this.editorBot.setData( CKEDITOR.document.findOne( '#editor-content' ).getHtml(), function() {
				var editor = this.editor,
					editable = editor.editable(),
					handler = editable.findOne( '.cke_widget_drag_handler' ),
					element = editable.findOne( selector ),
					coordinates = getMiddlePoint( element.getClientRect() );

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
							var elementRect = element.getClientRect( true ),
								visible = editor.widgets.liner.visible,
								lineRect = visible[ CKEDITOR.tools.objectKeys( visible )[ 0 ] ].getClientRect( true ),
								actual = getMiddlePoint( lineRect ),
								expected = getMiddlePoint( elementRect );

							assert.isNumberInRange( expected.x, actual.x - 1, actual.x + 1, 'Line vertical position' );
							assert.isNumberInRange( expected.y, actual.y - 1, actual.y + 1, 'Line horizontal position' );

							editor.once( 'paste', function() {
								resume( function() {
									assert.isNotNull( element.findOne( 'figure' ), 'Widget in cell' );
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

	function getMiddlePoint( rect ) {
		return {
			x: ( rect.right + rect.left ) / 2,
			y: ( rect.bottom + rect.top ) / 2
		};
	}
} )();

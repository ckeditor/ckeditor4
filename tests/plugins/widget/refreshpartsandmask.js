/* bender-tags: widget, 3775 */
/* bender-ckeditor-plugins: widget,undo */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		// This test needs to always be the first in the suite because it uses 'elementFromPoint()' method
		// which on IE breaks if there is any message about earlier tests displayed.
		'test partial mask refresh': function() {
			CKEDITOR.addCss( '.left { float: left; width: 200px; } .right { float: right; width: 200px; } .cke_widget_partial_mask { border: 1px solid red };' );
			var editor = this.editor;

			var widgetDef = {
				mask: 'cksource',

				parts: {
					foo: '#foo',
					bar: '#bar',
					cksource: '.cksource'
				},

				editables: {
					editable1: '#foo',
					editable2: '#bar',
					editable3: '.cksource'
				}
			};

			editor.widgets.add( 'testPartialMask', widgetDef );

			this.editorBot.setData( '<div data-widget="testPartialMask" id="widget">' +
				'<p id="foo">foo</p><p id="bar">bar</p></div>',
				function() {
					var div = new CKEDITOR.dom.element( 'div' ),
						element = editor.document.getById( 'widget' ),
						widget = editor.widgets.getByElement( element ),
						firstEditable = editor.document.$.elementFromPoint( 40, 30 ),
						secondEditable = editor.document.$.elementFromPoint( 40, 60 ),
						thirdEditable;

					assert.areEqual( null, widget.parts.cksource, 'Part should be null.' );

					div.setText( 'cksource' );
					div.addClass( 'cksource' );
					widget.element.append( div );
					widget.refreshParts();

					assert.isInstanceOf( CKEDITOR.dom.element, widget.parts.cksource, 'Part should already be an element instance.' );

					widget.refreshMask();

					assert.isNull( widget.wrapper.findOne( '.cke_widget_mask' ), 'Complete mask was created instead of partial.' );
					assert.isInstanceOf( CKEDITOR.dom.element, widget.wrapper.findOne( '.cke_widget_partial_mask' ), 'Mask element was not found.' );
					assert.areSame( 'foo', firstEditable.innerText, 'Mask covers the first editable instead of the third.' );
					assert.areSame( 'bar', secondEditable.innerText, 'Mask covers the second editable instead of the third.' );

					thirdEditable = editor.document.$.elementFromPoint( 40, 90 );

					// IE8 is just IE8. It needs to do the same again (as for the first time it returns null).
					if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 8 ) {
						thirdEditable = editor.document.$.elementFromPoint( 40, 90 );
					}

					assert.areSame( '', thirdEditable.innerText, 'Mask doesn\'t cover the third editable.' );
				}
			);
		}
	} );
} )();

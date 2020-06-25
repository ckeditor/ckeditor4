/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: floatingspace,easyimage,toolbar */
/* bender-include: ../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				removePlugins: 'link'
			}
		},

		divarea: {
			config: {
				extraPlugins: 'divarea',
				removePlugins: 'link'
			}
		},

		inline: {
			creator: 'inline',
			config: {
				removePlugins: 'link'
			}
		},

		// This instance upcasts all figures, despite figure[class] value.
		classicAllFigures: {
			config: {
				easyimage_class: null,
				removePlugins: 'link'
			}
		},

		linkEditor: {
			config: {
				extraPlugins: 'link'
			}
		}
	};

	function dragstart( editor, evt, widget ) {
		var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor );

		// Use realistic target which is the drag handler.
		evt.setTarget( widget.dragHandlerContainer.findOne( 'img' ) );

		dropTarget.fire( 'dragstart', evt );
	}

	function drop( editor, evt, dropRange ) {
		var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor );

		// If drop range is known use a realistic target. If no, then use a mock.
		if ( dropRange ) {
			evt.setTarget( dropRange.startContainer );
		} else {
			evt.setTarget( new CKEDITOR.dom.text( 'targetMock' ) );
		}

		dropTarget.fire( 'drop', evt );
	}

	function dragend( editor, evt, widget ) {
		var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor );

		// Use realistic target which is the drag handler.
		evt.setTarget( widget.dragHandlerContainer.findOne( 'img' ) );

		dropTarget.fire( 'dragend', evt );
	}

	var tests = {
		init: function() {
			// Ignore some irrelevant warnings for this test suite.
			CKEDITOR.on( 'log', function( evt ) {
				if ( evt.data.type == 'warn' ) {
					evt.cancel();
				}
			} );
		},

		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
		},

		'test upcasting image widget (figure)': function( editor, bot ) {
			widgetTestsTools.assertWidget( {
				count: editor.name === 'classicAllFigures' ? 2 : 1,
				widgetOffset: 0,
				nameCreated: 'easyimage',
				html: CKEDITOR.document.getById( 'mixedFigures' ).getHtml(),
				bot: bot,

				assertCreated: function( widget ) {
					if ( editor.name === 'linkEditor' ) {
						assert.isNull( widget.parts.link, 'Widget does have link part if the editor has link plugin' );
					} else {
						assert.isUndefined( widget.parts.link,
							'Widget does not have link part if the editor does not have link plugin' );
					}

					if ( editor.name !== 'classicAllFigures' ) {
						assert.isTrue( widget.hasClass( 'easyimage' ), 'Widget wrapper has main class' );
					}
				}
			} );
		},

		// tp3163
		'test drag and drop retains data style': function( editor, bot ) {
			if ( CKEDITOR.env.webkit && editor.editable().isInline() ) {
				assert.ignore();
			}

			bot.setData( CKEDITOR.document.getById( 'typeData' ).getHtml(), function() {
				var widget = widgetTestsTools.getWidgetByDOMOffset( editor, 0 ),
					evt = bender.tools.mockDropEvent(),
					range = editor.createRange();

				widget.focus();
				editor.execCommand( 'easyimageSide' );

				range.setStart( editor.editable().findOne( 'p' ).getChild( 0 ), 1 );
				range.collapse();

				dragstart( editor, evt, widget );
				drop( editor, evt, range );
				dragend( editor, evt, widget );

				// Drag and drop probably destroyed old widget, so we should fetch it once more.
				widget = editor.widgets.focused;
				assert.isTrue( widget.element.hasClass( 'easyimage-side' ), 'Widget preserved the class' );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );
	bender.test( tests );
} )();

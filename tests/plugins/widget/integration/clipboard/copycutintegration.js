/* bender-tags: widget, clipbaord */
/* bender-ui: collapsed */
/* bender-ckeditor-plugins: widget, undo, wysiwygarea, toolbar, clipboard */

( function() {
	'use strict';

	CKEDITOR.plugins.addExternal( 'customwidget', '%BASE_PATH%plugins/widget/_helpers/customwidget.js' );

	var startupData = '<p>foo bar</p>' +
		'<div class="customwidget">' +
			'<h2>Awesome widget!!!</h2>' +
			'<h3 class="customwidget__title">Type here some title</h3>' +
			'<p class="customwidget__instruction">Below is place to add some fancy text.</p>' +
			'<p class="customwidget__content">Type here something</p>' +
		'</div>';

	bender.editors = {
		classic: {
			name: 'editor',
			startupData: startupData,
			config: {
				extraAllowedContent: 'span',
				extraPlugins: 'customwidget',
				allowedContent: true
			}
		},
		divarea: {
			name: 'divarea',
			startupData: startupData,
			config: {
				extraAllowedContent: 'span',
				extraPlugins: 'divarea,customwidget',
				allowedContent: true
			}
		},
		inline: {
			name: 'inline',
			startupData: startupData,
			creator: 'inline',
			config: {
				extraAllowedContent: 'span',
				extraPlugins: 'customwidget',
				allowedContent: true
			}
		}
	};

	var tests = {
		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
				assert.ignore();
			}
		},

		'test widget not throw error during copy': function( editor, bot ) {
			bot.setData( startupData, function() {
				var editable = editor.editable(),
					range = editor.createRange(),
					pasteEventMock = bender.tools.mockPasteEvent();

				// It's necessary to put selection somewhere in the widget wrapper. That's why selection is made in a such way.
				range.setStart( editable.findOne( 'p' ).getFirst(), 4 );
				range.setEnd( editable.findOne( 'div.cke_widget_wrapper' ), 0 );
				range.select();
				editable.fire( 'copy', pasteEventMock );

				editor.once( 'paste', function( evt ) {
					resume( function() {
						assert.isInnerHtmlMatching( '<p>bar</p>', evt.data.dataValue, {
							customFilters: [ getFilterRemovingBookmarks() ]
						}, 'Widget shouldn\'t be in the output data.' );

					} );
				}, null, null, 1000000 );

				// Event fires asynchronous 'paste' event on editor.
				editable.fire( 'paste', pasteEventMock );
				wait();
			} );
		},

		'test cutting partially selected widget remain collapsed selection in editor': function( editor, bot ) {
			bot.setData( startupData, function() {
				var editable = editor.editable(),
					range = editor.createRange(),
					pasteEventMock = bender.tools.mockPasteEvent(),
					expected = '<p>foo@</p>' +
						'<div class="customwidget">' +
							'<h2>Awesome widget!!!</h2>' +
							'<h3 class="customwidget__title">Type here some title</h3>' +
							'<p class="customwidget__instruction">Below is place to add some fancy text.</p>' +
							'<p class="customwidget__content">Type here something</p>' +
						'</div>';

				// It's necessary to put selection somewhere in the widget wrapper. That's why selection is made in a such way.
				range.setStart( editable.findOne( 'p' ).getFirst(), 3 );
				range.setEnd( editable.findOne( 'div.cke_widget_wrapper' ), 0 );
				range.select();

				editable.once( 'cut', function() {
					CKEDITOR.tools.setTimeout( function() {
						resume( function() {
							assert.isInnerHtmlMatching( expected, editor.getData(), {
								customFilters: [ getFilterRemovingBookmarks() ]
							} );
							assert.isTrue( editor.getSelection().isCollapsed() );

							editable.fire( 'paste', pasteEventMock );
							wait();
						} );
					}, 110 ); // timeout because of widget/plugin.js -> copyTimeout
				}, null, null, 1000000 );

				editor.once( 'paste', function( evt ) {
					resume( function() {
						assert.isInnerHtmlMatching( '<p> bar</p>', evt.data.dataValue, {
							customFilters: [ getFilterRemovingBookmarks() ]
						}, 'Widget shouldn\'t be in the output data.' );

					} );
				}, null, null, 1000000 );

				editable.fire( 'cut', pasteEventMock );
				wait();
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );

	function getFilterRemovingBookmarks() {
		var filter = new CKEDITOR.htmlParser.filter( {
				elements: {
					'^': function( el ) {
						el.filterChildren( filter );
					},
					'span': function( el ) {
						if ( el.attributes.id && /^cke_bm_\d+S$/i.test( el.attributes.id ) ) {
							return false;
						}
					}
				}
			} );

		return filter;
	}
} )();

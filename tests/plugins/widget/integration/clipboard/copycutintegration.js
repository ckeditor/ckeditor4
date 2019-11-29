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
		'test widget not throw error during copy': function( editor ) {
			var editable = editor.editable(),
				range = editor.createRange();

			range.setStart( editable.findOne( 'p' ).getFirst(), 4 );
			range.setEnd( editable.findOne( 'div' ), 0 );
			range.select();

			editable.fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.pass();
		},

		'test cutting partially selected widget remain collapsed selection in editor': function( editor ) {
			var editable = editor.editable(),
				range = editor.createRange(),
				expected = '<p>foo@</p>' +
					'<div class="customwidget">' +
						'<h2>Awesome widget!!!</h2>' +
						'<h3 class="customwidget__title">Type here some title</h3>' +
						'<p class="customwidget__instruction">Below is place to add some fancy text.</p>' +
						'<p class="customwidget__content">Type here something</p>' +
					'</div>';

			range.setStart( editable.findOne( 'p' ).getFirst(), 3 );
			range.setEnd( editable.findOne( 'div' ), 0 );
			range.select();

			editable.once( 'cut', function() {
				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						assert.isInnerHtmlMatching( expected, editor.getData() );
						assert.isTrue( editor.getSelection().isCollapsed() );
					} );
				} );
			} );

			editable.fire( 'cut', new CKEDITOR.dom.event( {} ) );
			wait();
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();

/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: sourcearea,toolbar */

( function() {
	'use strict';

	var editors;

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				classic: {
					name: 'classic'
				},
				inline: {
					name: 'inline',
					creator: 'inline'
				}
			}, function( e ) {
				editors = e;
				that.callback();
			} );
		},

		'test name': function() {
			var doc = new CKEDITOR.dom.document( document ),
				head = doc.getHead();

			assert.isNotNull( head.findOne( 'style[data-cke-temp="1"]' ), 'before' );

			var editor = editors.classic;
			// Wait & ensure async.
			wait( function() {
				editor.setMode( 'source', function() {
					editor.setMode( 'wysiwyg', function() {
						resume( function() {
							assert.isNotNull( head.findOne( 'style[data-cke-temp="1"]' ), 'after' );
						} );
					} );
				} );
			} );
		}
	} );
} )();
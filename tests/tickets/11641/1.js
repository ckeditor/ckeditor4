/* bender-tags: editor */
/* bender-ckeditor-plugins: sourcearea,toolbar */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'classic'
		},
		inline: {
			name: 'inline',
			creator: 'inline'
		}
	};

	bender.test( {
		'test name': function() {
			var doc = new CKEDITOR.dom.document( document ),
				head = doc.getHead();

			assert.isNotNull( head.findOne( 'style[data-cke-temp="1"]' ), 'before' );

			var editor = this.editors.classic;
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

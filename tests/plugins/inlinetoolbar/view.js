/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: inlinetoolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test inlineToolbarView.render': function() {
			var view = new CKEDITOR.ui.inlineToolbarView( this.editor ),
				items = {
					aa: {
						render: function( editor, outputStack ) {
							outputStack.push( 'aa' );
						}
					},
					bb: {
						render: function( editor, outputStack ) {
							outputStack.push( 'bb' );
						}
					}
				};

			view.renderItems( items );

			assert.areSame( 'aabb', view.parts.content.getHtml() );
		},

		'test inlineToolbarView.render empty list': function() {
			var view = new CKEDITOR.ui.inlineToolbarView( this.editor ),
				items = [];

			view.parts.content.setHtml( 'foobar' );

			view.renderItems( items );

			assert.areSame( '', view.parts.content.getHtml() );
		}
	} );
} )();

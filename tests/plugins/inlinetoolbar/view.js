/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: inlinetoolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'strong'
		}
	};

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

			assert.areSame( '<span class="cke_toolgroup">aabb</span>', view.parts.content.getHtml() );
		},

		'test inlineToolbarView.render empty list': function() {
			var view = new CKEDITOR.ui.inlineToolbarView( this.editor ),
				items = [];

			view.parts.content.setHtml( 'foobar' );

			view.renderItems( items );

			assert.areSame( '', view.parts.content.getHtml() );
		},

		'test inline toolbar doesnt steal the focus': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>foo <strong>bar</strong> baz</p>', function() {
				editor.focus();

				var view = new CKEDITOR.ui.inlineToolbarView( editor ),
					pointedElement = editor.editable().findOne( 'strong' );

				view.parts.content.setHtml( 'foo' );
				view.create( pointedElement );

				assert.areSame( this.editor.window.getFrame(), CKEDITOR.document.getActive(), 'Editor frame is focused' );

				view.destroy();
			} );
		}
	} );
} )();

/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: balloontoolbar */
/* bender-include: _helpers/default.js */
/* global ignoreUnsupportedEnvironment */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'strong'
		}
	};

	var tests = {
		'test balloonToolbarView.render': function() {
			var view = new CKEDITOR.ui.balloonToolbarView( this.editor ),
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

			var expectedOutput = CKEDITOR.env.ie ? '<span class="cke_toolgroup" unselectable="on">aabb</span>' : '<span class="cke_toolgroup">aabb</span>';
			assert.beautified.html( expectedOutput, view.parts.content.getHtml() );
		},

		'test balloonToolbarView.render empty list': function() {
			var view = new CKEDITOR.ui.balloonToolbarView( this.editor ),
				items = [];

			view.parts.content.setHtml( 'foobar' );

			view.renderItems( items );

			assert.areSame( '', view.parts.content.getHtml() );
		},

		'test Balloon Toolbar doesnt steal the focus': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>foo <strong>bar</strong> baz</p>', function() {
				editor.focus();

				var view = new CKEDITOR.ui.balloonToolbarView( editor ),
					pointedElement = editor.editable().findOne( 'strong' );

				view.parts.content.setHtml( 'foo' );
				view.attach( pointedElement, { focusElement: false } );

				assert.areSame( this.editor.window.getFrame(), CKEDITOR.document.getActive(), 'Editor frame is focused' );

				view.destroy();
			} );
		},

		'test Balloon Toolbar show and hide methods': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>foo <strong>bar</strong> baz</p>', function() {
				editor.focus();

				var view = new CKEDITOR.ui.balloonToolbarView( editor ),
					pointedElement = editor.editable().findOne( 'strong' );

				view.attach( pointedElement, { focusElement: false, show: false } );
				assert.isFalse( view.rect.visible, 'Toolbar should not be shown' );
				assert.areEqual( 0, view._listeners.length, 'Listeners should not be attached' );

				view.show();
				assert.isTrue( view.rect.visible, 'Toolbar should be shown after show method' );
				assert.areEqual( 4, view._listeners.length, 'Listeners should be attached after show method' );

				view.hide();
				assert.isFalse( view.rect.visible, 'Toolbar should not be shown after hide method' );
				assert.areEqual( 0, view._listeners.length, 'Listeners should not be attached after hide method' );

				view.destroy();
			} );
		}
	};

	ignoreUnsupportedEnvironment( tests );
	bender.test( tests );
} )();

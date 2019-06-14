/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea */

( function() {
	'use strict';

	bender.editor = {
		creator: 'inline',
		name: 'editor1'
	};

	bender.test( {
		'test creation': function() {
			// Check if inline editor was created using editorBot.
			assert.isTrue( this.editor.editable().isInline(), 'Container is div - editor 1' );
			assert.areSame( CKEDITOR.document.getById( 'editor1' ), this.editor.element, 'Element is a textarea - editor1' );

			CKEDITOR.inline( 'editor2', {
				on: {
					instanceReady: function( evt ) {
						resume( function() {
							var editor = evt.editor,
								textarea = CKEDITOR.document.getById( 'editor2' );

							assert.areSame( 'editor2', editor.name, 'Name is correct' );
							assert.areSame( textarea, editor.element, 'Element is a textarea' );
							assert.isFalse( editor.readOnly, 'Editing is enabled' );
							assert.areSame( '<p>bar</p>', bender.tools.compatHtml( editor.getData() ), 'Data is set' );

							assert.isTrue( editor.container.is( 'div' ), 'Container is div' );
							assert.areSame( 'true', editor.container.getAttribute( 'contenteditable' ), 'Container is contentediable' );
							assert.isTrue( editor.container.equals( editor.editable() ), 'Editable is container' );

							assert.areSame( 'none', textarea.getStyle( 'display' ), 'Textarea is hidden' );

							assert.areSame( editor, CKEDITOR.instances.editor2, 'Editor is available in CKEDITOR.instances' );

							assert.isFalse( editor.blockless, 'Editor allow blocks' );
						} );
					}
				}
			} );

			wait();
		},

		'test setData': function() {
			var editor = this.editor,
				initialValue = editor.element.getValue();

			this.editorBot.setData( '<p>test setData</p>', function() {
				assert.areSame( '<p>test setData</p>', editor.getData(), 'New data set correctly' );
				assert.areSame( initialValue, editor.element.getValue(), 'Textarea value remains untouched' );
			} );
		},

		'test updateElement': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>test updateData</p>', function() {
				editor.updateElement();
				assert.areSame( '<p>test updateData</p>', editor.element.getValue(), 'Textarea value updated' );
			} );
		},

		'test create concurrent editor: framed on bound textarea': createConcurrentEditorTest( 'replace', 'editor1' ),

		'test create concurrent editor: inline on bound textarea': createConcurrentEditorTest( 'inline', 'editor1' ),

		'test update data on submit': function() {
			var editor = this.editor,
				form = CKEDITOR.document.getById( 'form' );

			editor.setData( '<p>test auto update</p>', function() {
				form.fire( 'submit' );

				resume( function() {
					assert.areSame( '<p>test auto update</p>', editor.element.getValue(), 'Textarea content should be updated on submit.' );
				} );
			} );

			wait();
		},

		'test destroy cleanup': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'editor3'
			}, function( bot ) {
				bot.setData( '<p>new data</p>', function() {
					var editor = bot.editor,
						element = editor.element;

					element.setCustomData( 'x', 1 );
					editor.container.setCustomData( 'x', 1 );

					editor.destroy();

					assert.areSame( '<p>new data</p>', element.getValue(), 'Textarea value updated on destroy' );
					assert.areEqual( '', element.getStyle( 'display' ), 'Display style is removed' );
					assert.isTrue( element.isVisible(), 'Textarea is visible' );
					assert.isNotNull( element.getParent(), 'Textarea still in DOM' );

					assert.isNull( editor.container.getParent(), 'Editor container detached from DOM' );
					assert.isUndefined( editor.element, 'Editor has no associated element' );
					assert.isUndefined( CKEDITOR.instances.editor3, 'Editor instance was removed' );

					assert.isNull( element.getCustomData( 'x' ), 'Custom data purged' );
					assert.isNull( editor.container.getCustomData( 'x' ), 'Custom data purged' );
				} );
			} );
		},

		// (#3115)
		'test destroy when editor.container is absent': testDestroy( function( editor ) {
			var container = editor.container;

			delete editor.container;
			container.clearCustomData();
			container.remove();
		} ),

		// (#3115)
		'test destroy when editor.container is detached': testDestroy( function( editor ) {
			editor.container.remove();
		} )
	} );

	function testDestroy( callback ) {
		return function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'editor4'
			}, function( bot ) {
				var editor = bot.editor;

				callback( editor );

				try {
					editor.destroy();
					assert.pass( 'Passed without errors' );
				} catch ( err ) {
					assert.fail( err.toString() );
				}
			} );
		};
	}

	function createConcurrentEditorTest( creator, element ) {
		return function() {
			var spy = sinon.spy( CKEDITOR, 'error' );

			CKEDITOR[ creator ]( element );

			spy.restore();
			assert.areSame( 1, spy.callCount, 'Error was thrown' );
			assert.isTrue( spy.calledWithExactly( 'editor-element-conflict', sinon.match( {
				editorName: element
			} ) ), 'Appropriate error code and additional data were used' );
		};
	}
} )();

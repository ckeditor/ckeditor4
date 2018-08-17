/* bender-tags: editor */

( function() {
	'use strict';

	bender.test( {
		'test editor initialized on textarea with required attribute': function() {
			// After refresh Firefox is recovering the old textarea value which is not empty string
			// if tests have been just ran. LOL.
			CKEDITOR.document.getById( 'editor1' ).setValue( '' );

			bender.editorBot.create( {
				name: 'editor1'
			}, function( bot ) {
				var editor = bot.editor,
					textarea = editor.element,
					form = CKEDITOR.document.getById( 'form1' ),
					preventCalled = false,
					requiredFired = false;

				assert.isFalse( textarea.hasAttribute( 'required' ), 'does not have textarea[required] when editor is initialized' );

				//
				// TC1
				editor.once( 'required', function() {
					requiredFired = true;
				} );

				submit();

				assert.isFalse( preventCalled, '1) submitting was not prevented' );
				assert.isTrue( requiredFired, '1) editor#required was fired' );


				//
				// TC 2 - block submitting
				preventCalled = requiredFired = false;

				editor.once( 'required', function() {
					requiredFired = true;
					return false;
				} );

				submit();

				assert.isTrue( preventCalled, '2) submitting was prevented' );
				assert.isTrue( requiredFired, '2) editor#required was fired' );


				//
				// TC 3 - editor isn't empty
				preventCalled = requiredFired = false;

				editor.editable().setHtml( '<p>foo</p>' );
				editor.once( 'required', function() {
					requiredFired = true;
				} );

				submit();

				assert.isFalse( preventCalled, '3) submitting was not prevented' );
				assert.isFalse( requiredFired, '3) editor#required was not fired' );


				editor.destroy();
				assert.isTrue( textarea.hasAttribute( 'required' ), 'has textarea[required] after destroying editor' );
				assert.areSame( 'required', textarea.getAttribute( 'required' ), 'value of textarea[required] after destroying editor' );

				function submit() {
					// We cannot fire native submit event and submit() method won't fire native submit event.
					// Mock CKEDITOR.dom.event's preventDefault method.
					form.fire( 'submit', {
						preventDefault: function() {
							preventCalled = true;
						}
					} );
				}
			} );
		},

		'test no required attribute': function() {
			bender.editorBot.create( {
				name: 'editor2'
			}, function( bot ) {
				var editor = bot.editor,
					textarea = editor.element,
					form = CKEDITOR.document.getById( 'form2' ),
					preventCalled = false,
					requiredFired = false;

				editor.once( 'required', function() {
					requiredFired = true;
				} );

				submit();

				assert.isFalse( preventCalled, '1) submitting was not prevented' );
				assert.isFalse( requiredFired, '1) editor#required was not fired' );

				editor.destroy();

				assert.isFalse( textarea.hasAttribute( 'required' ), 'does not have textarea[required] after destroying editor' );

				function submit() {
					// We cannot fire native submit event and submit() method won't fire native submit event.
					// Mock CKEDITOR.dom.event's preventDefault method.
					form.fire( 'submit', {
						preventDefault: function() {
							preventCalled = true;
						}
					} );
				}
			} );
		}
	} );

} )();

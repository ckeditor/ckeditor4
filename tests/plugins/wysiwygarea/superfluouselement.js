/* bender-tags: editable,wysiwygarea,unit */
/* bender-ckeditor-plugins: enterkey,wysiwygarea */

/**
* This test simulates the situation that occurs when the user selects
* the whole content and presses backspace/delete or starts typing.
* Both IE and Edge tend to insert a superfluous element
* (<p> and <div> respectively) into the empty editable.
*/

( function() {
	'use strict';

	bender.editor = {
		creator: 'replace',
		config: {
			enterMode: CKEDITOR.ENTER_BR
		}
	};

	bender.test( {
		'Test removing superfluous <p> inserted by IE11': function() {
			if ( !CKEDITOR.env.ie || CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var editor = this.editor;

			editor.setData( '', function() {
				resume( function() {
					this.clock = sinon.useFakeTimers();

					bender.tools.setHtmlWithSelection( editor, '<p><br></p>' );
					// This event is fired after hitting backspace. At this point the browser already inserted the element.
					editor.document.fire( 'selectionchange' );

					this.clock.tick( 10 );

					assert.isInnerHtmlMatching( '^', bender.tools.getHtmlWithSelection( editor ) );

					this.clock.restore();
				} );
			} );
			wait();
		},

		'Test removing superfluous <div> inserted by Edge': function() {
			if ( !CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var editor = this.editor;

			editor.setData( '', function() {
				resume( function() {

					editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
						keyCode: 75,
						ctrlKey: false,
						shiftKey: false
					} ) );

					bender.tools.setHtmlWithSelection( editor, '<div>k^</div>' );

					editor.editable().fire( 'keyup' );

					assert.isInnerHtmlMatching( 'k^', bender.tools.getHtmlWithSelection( editor ) );
				} );
			} );
			wait();
		},

		'Test not removing non-superfluous <div> in Edge': function() {
			if ( !CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var editor = this.editor;

			editor.setData( '', function() {
				resume( function() {
					bender.tools.setHtmlWithSelection( editor, '<div>^</div>' );

					editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
						keyCode: 75,
						ctrlKey: false,
						shiftKey: false
					} ) );

					editor.editable().fire( 'keyup' );

					assert.isInnerHtmlMatching( '<div>^&nbsp;</div>', bender.tools.getHtmlWithSelection( editor ) );
				} );
			} );
			wait();
		},

		'Test removing superfluous <div> when typing': function() {
			if ( !CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var editor = this.editor;

			editor.setData( '', function() {
				resume( function() {
					bender.tools.setHtmlWithSelection( editor, '^' );

					// Expected behaviour:
					// keydown <- mark divs for retention, disable marking
					// keydown <- do nothing
					// ...
					// keyup <- remove not marked divs, enable marking
					// keyup <- do nothing
					// ...
					editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
						keyCode: 75,
						ctrlKey: false,
						shiftKey: false
					} ) );

					bender.tools.setHtmlWithSelection( editor, '<div>k^</div>' );

					editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
						keyCode: 76,
						ctrlKey: false,
						shiftKey: false
					} ) );

					editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
						keyCode: 77,
						ctrlKey: false,
						shiftKey: false
					} ) );

					editor.editable().fire( 'keyup' );

					editor.editable().fire( 'keyup' );

					editor.editable().fire( 'keyup' );

					assert.isInnerHtmlMatching( 'k^', bender.tools.getHtmlWithSelection( editor ) );
				} );
			} );
			wait();
		},

		'Test not removing non-superfluous <div> when typing': function() {
			if ( !CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var editor = this.editor;

			editor.setData( '', function() {
				resume( function() {
					bender.tools.setHtmlWithSelection( editor, '<div>^</div>' );

					editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
						keyCode: 75,
						ctrlKey: false,
						shiftKey: false
					} ) );

					editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
						keyCode: 76,
						ctrlKey: false,
						shiftKey: false
					} ) );

					editor.editable().fire( 'keyup' );

					editor.editable().fire( 'keyup' );

					assert.isInnerHtmlMatching( '<div>^&nbsp;</div>', bender.tools.getHtmlWithSelection( editor ) );
				} );
			} );
			wait();
		}

	} );
} )();

/* bender-tags: 13142 */
/* bender-ckeditor-plugins: enterkey,wysiwygarea */

// This test simulates the situation that occurs when the user selects
// the whole content and presses backspace/delete or starts typing.
// Both IE and Edge tend to insert a superfluous element
// (<p> and <div> respectively) into the empty editable.

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

				bender.tools.setHtmlWithSelection( editor, '^' );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
					keyCode: 8,
					ctrlKey: false,
					shiftKey: false
				} ) );

				bender.tools.setHtmlWithSelection( editor, '<p>^</p>' );

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				assert.isInnerHtmlMatching( '^', bender.tools.getHtmlWithSelection( editor ) );
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

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

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

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

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

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

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

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				assert.isInnerHtmlMatching( '<div>^&nbsp;</div>', bender.tools.getHtmlWithSelection( editor ) );
			} );
		} );
		wait();
	},

	// #14831
	'Test not removing [data-cke-temp] <div> when typing': function() {
		if ( !CKEDITOR.env.edge || CKEDITOR.env.version < 14 ) {
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

				bender.tools.setHtmlWithSelection( editor, '<div data-cke-temp>k^</div>' );

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

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				assert.isInnerHtmlMatching( '<div>k^</div>', bender.tools.getHtmlWithSelection( editor ) );
			} );
		} );
		wait();
	}
} );

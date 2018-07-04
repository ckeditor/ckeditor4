/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete */

( function() {
	'use strict';

	var configDefinition = {
		textTestCallback: textTestCallback,
		dataCallback: dataCallback
	};

	bender.editor = {};

	bender.test( {
		setUp: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
				assert.ignore();
			}
		},

		'test preventDefault is called on mousedown': function() {
			var editor = this.editor,
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition ),
				spy = sinon.spy(),
				data = {
					preventDefault: spy
				};

			this.editorBot.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			ac.view.element.fire( 'mousedown', data );

			assert.isTrue( spy.called, 'preventDefault called' );
		}
	} );

	function textTestCallback( selectionRange ) {
		return { text: 'text', range: selectionRange };
	}

	function dataCallback( matchInfo, callback ) {
		return callback( [ { id: 1, name: 'first' }, { id: 2, name: 'second' } ] );
	}
} )();

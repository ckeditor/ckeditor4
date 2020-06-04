/* bender-tags: editor */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		// (#3115)
		'test editable.getUniqueId': function() {
			var editor = this.editor,
				editable = editor.editable(),
				id = 'foo',
				mock = sinon.stub( CKEDITOR.dom.domObject.prototype, 'getUniqueId' ).returns( id );

			assert.isNotNull( id, editable.getUniqueId(), 'id on first call' );
			assert.areSame( id, editable.getUniqueId(), 'id on second call' );

			mock.restore();

			var origMethod = CKEDITOR.dom.domObject.prototype.getUniqueId;

			CKEDITOR.dom.domObject.prototype.getUniqueId = function() {
				throw( 'error' );
			};

			var actualId = editable.getUniqueId();

			CKEDITOR.dom.domObject.prototype.getUniqueId = origMethod;

			assert.areSame( id, actualId, 'id when error thrown' );
		}
	} );
} )();

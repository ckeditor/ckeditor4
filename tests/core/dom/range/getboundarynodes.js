/* bender-tags: editor, tabletools */
/* bender-ckeditor-plugins: tabletools, toolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		setUp: function() {
			this.doc = CKEDITOR.document;
		},

		createRange: function() {
			return new CKEDITOR.dom.range( CKEDITOR.document.getBody() );
		},

		'test getBoundaryNodes empty selection in body': function() {
			if ( CKEDITOR.env.ie ) {
				// IE / Edge does not support iframe[srcdoc] attribute.
				assert.ignore();
			}

			var nestedDoc = this.doc.getById( 'emptyframe' ).getFrameDocument(),
				rng = new CKEDITOR.dom.range( nestedDoc ),
				nestedBody = nestedDoc.findOne('body'),
				ret;

			rng.setStart( nestedBody, 0 );
			rng.collapse();

			ret = rng.getBoundaryNodes();

			assert.areSame(  ret.startNode, nestedBody, 'ret.startNode' );
			assert.areSame(  ret.endNode, nestedBody, 'ret.endNode' );
		},

		'test getBoundaryNodes empty selection in div': function() {
			var rng = new CKEDITOR.dom.range( this.doc ),
				nestedElement = this.doc.findOne('div#inner'),
				ret;

			rng.setStart( nestedElement, 0 );
			rng.collapse();

			ret = rng.getBoundaryNodes();

			assert.areSame(  ret.startNode, nestedElement, 'ret.startNode' );
			assert.areSame(  ret.endNode, nestedElement, 'ret.endNode' );
		},
	} );
} )();

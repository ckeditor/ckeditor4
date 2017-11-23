/* bender-tags: inlinetoolbar, context */
/* bender-ckeditor-plugins: inlinetoolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		setUp: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
				assert.ignore();
			}
		},

		tearDown: function() {
			this.editor.inlineToolbar._manager._clear();
		},

		'test exposes editor.inlineToolbar.create': function() {
			var ContextTypeStub = sinon.stub( CKEDITOR.plugins.inlinetoolbar, 'context' ),
				ret;

			ContextTypeStub.prototype.show = sinon.stub();
			ContextTypeStub.prototype.hide = sinon.stub();
			ContextTypeStub.prototype.destroy = sinon.stub();

			ret = this.editor.inlineToolbar.create( {} );

			ContextTypeStub.restore();

			assert.isInstanceOf( ContextTypeStub, ret, 'Ret type' );
			sinon.assert.calledWithExactly( ContextTypeStub, this.editor, {} );
		}
	} );
} )();

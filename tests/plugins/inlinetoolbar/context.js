/* bender-tags: inlinetoolbar, context */
/* bender-ckeditor-plugins: inlinetoolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		tearDown: function() {
			this.editor.plugins.inlinetoolbar._manager._clear();
		},

		'test exposes editor.plugins.inlinetoolbar.create': function() {
			var ContextTypeStub = sinon.stub( CKEDITOR.plugins.inlinetoolbar, 'context' ),
				ret;

			ContextTypeStub.prototype.show = sinon.stub();
			ContextTypeStub.prototype.hide = sinon.stub();
			ContextTypeStub.prototype.destroy = sinon.stub();

			ret = this.editor.plugins.inlinetoolbar.create( {} );

			ContextTypeStub.restore();

			assert.isInstanceOf( ContextTypeStub, ret, 'Ret type' );
			sinon.assert.calledWithExactly( ContextTypeStub, this.editor, {} );
		}
	} );
} )();

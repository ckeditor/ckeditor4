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
			this.editor.balloonToolbar._manager._clear();
		},

		'test exposes editor.balloonToolbar.create': function() {
			var ContextTypeStub = sinon.stub( CKEDITOR.plugins.balloontoolbar, 'context' ),
				ret;

			ContextTypeStub.prototype.show = sinon.stub();
			ContextTypeStub.prototype.hide = sinon.stub();
			ContextTypeStub.prototype.destroy = sinon.stub();

			ret = this.editor.balloonToolbar.create( {} );

			ContextTypeStub.restore();

			assert.isInstanceOf( ContextTypeStub, ret, 'Ret type' );
			sinon.assert.calledWithExactly( ContextTypeStub, this.editor, {} );
		}
	} );
} )();

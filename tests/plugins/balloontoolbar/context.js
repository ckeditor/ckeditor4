/* bender-tags: balloontoolbar, context */
/* bender-ckeditor-plugins: balloontoolbar */
/* bender-include: _helpers/default.js */

( function() {
	'use strict';

	bender.editor = {};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'balloontoolbar' );
		},

		tearDown: function() {
			this.editor.balloonToolbars._clear();
		},

		'test exposes editor.balloonToolbar.create': function() {
			var ContextTypeStub = sinon.stub( CKEDITOR.plugins.balloontoolbar, 'context' ),
				ret;

			ContextTypeStub.prototype.show = sinon.stub();
			ContextTypeStub.prototype.hide = sinon.stub();
			ContextTypeStub.prototype.destroy = sinon.stub();

			ret = this.editor.balloonToolbars.create( {} );

			ContextTypeStub.restore();

			assert.isInstanceOf( ContextTypeStub, ret, 'Ret type' );
			sinon.assert.calledWithExactly( ContextTypeStub, this.editor, {} );
		}
	};

	bender.test( tests );
} )();

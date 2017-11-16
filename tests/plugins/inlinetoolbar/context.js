/* bender-tags: inlinetoolbar, context */
/* bender-ckeditor-plugins: inlinetoolbar, basicstyles, format */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		tearDown: function() {
			this.editor.plugins.inlinetoolbar._manager._clear();
		},

		'test context.refresh picks up editor element path if none provided': function() {
			var options = {
					refresh: sinon.stub()
				},
				context,
				elementsPathArgument;

			this.editorBot.setHtmlWithSelection( '<p><strong>Fo^o</strong></p>' );

			context = this.editor.plugins.inlinetoolbar.create( options );

			context.refresh();

			assert.areSame( 1, options.refresh.callCount, 'options.refresh call count' );

			elementsPathArgument = options.refresh.args[ 0 ][ 1 ];

			assert.isInstanceOf( CKEDITOR.dom.elementPath, elementsPathArgument, 'Elements path argument type' );
			assert.areSame( 'body,p,strong', this._elementPathSerialize( elementsPathArgument ), 'Elements path used' );
		},

		'test context.refresh uses custom element path if explicitly provided': function() {
			var options = {
					refresh: sinon.stub()
				},
				context,
				customElementPath,
				elementsPathArgument,
				selectionArgument;

			this.editorBot.setHtmlWithSelection( '<p><strong>Fo^o</strong><em>bar</em></p>' );

			context = this.editor.plugins.inlinetoolbar.create( options );

			customElementPath = new CKEDITOR.dom.elementPath( this.editor.editable().findOne( 'em' ).getFirst(), this.editor.editable() );

			context.refresh( customElementPath );

			assert.areSame( 1, options.refresh.callCount, 'options.refresh call count' );

			elementsPathArgument = options.refresh.args[ 0 ][ 1 ];
			selectionArgument = options.refresh.args[ 0 ][ 2 ];

			assert.isInstanceOf( CKEDITOR.dom.elementPath, elementsPathArgument, 'Elements path argument type' );
			assert.areSame( 'body,p,em', this._elementPathSerialize( elementsPathArgument ), 'Elements path used' );

			assert.isInstanceOf( CKEDITOR.dom.selection, selectionArgument, 'Selection argument type' );
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
		},

		// Returns a string with given `elementPath` member names, joined with comma, e.g. "body,ul,li,a,strong".
		_elementPathSerialize: function( elementPath ) {
			return CKEDITOR.tools.array.map( elementPath.elements, function( elem ) {
				return elem.getName();
			} ).reverse().join( ',' );
		}
	} );
} )();

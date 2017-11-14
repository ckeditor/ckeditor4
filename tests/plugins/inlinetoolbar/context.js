/* bender-tags: inlinetoolbar, context */
/* bender-ckeditor-plugins: inlinetoolbar, basicstyles, format */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		init: function() {
			// Stub listener register method, as since it's called in a constructor and it adds
			// selectionChange listener, it causes extra calls to toolbar hide/show methods.
			sinon.stub( CKEDITOR.plugins.inlinetoolbar.context.prototype, '_attachListeners' );
		},

		// 'test adding rich combo': function() {
		// 	var panel = this.editor.inlineToolbar.context( { buttons: 'Format' } );
		// 	assert.isInstanceOf( CKEDITOR.ui.richCombo, panel.getItem( 'Format' ), 'Registered richCombo type.' );
		// 	panel.destroy();
		// },

		'test context.refresh picks up editor element path if none provided': function() {
			var options = {
					refresh: sinon.stub()
				},
				context = this.editor.plugins.inlinetoolbar.create( options ),
				elementsPathArgument;

			this.editorBot.setHtmlWithSelection( '<p><strong>Fo^o</strong></p>' );

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
				context = this.editor.plugins.inlinetoolbar.create( options ),
				customElementPath,
				elementsPathArgument;

			this.editorBot.setHtmlWithSelection( '<p><strong>Fo^o</strong><em>bar</em></p>' );

			customElementPath = new CKEDITOR.dom.elementPath( this.editor.editable().findOne( 'em' ).getFirst(), this.editor.editable() );

			context.refresh( customElementPath );

			assert.areSame( 1, options.refresh.callCount, 'options.refresh call count' );

			elementsPathArgument = options.refresh.args[ 0 ][ 1 ];

			assert.isInstanceOf( CKEDITOR.dom.elementPath, elementsPathArgument, 'Elements path argument type' );
			assert.areSame( 'body,p,em', this._elementPathSerialize( elementsPathArgument ), 'Elements path used' );
		},

		'test exposes editor.plugins.inlinetoolbar.create': function() {
			var ContextTypeStub = sinon.stub( CKEDITOR.plugins.inlinetoolbar, 'context' ),
				ret = this.editor.plugins.inlinetoolbar.create( {} );

			ContextTypeStub.restore();

			assert.isInstanceOf( ContextTypeStub, ret, 'Ret type' );
			sinon.assert.calledWithExactly( ContextTypeStub, this.editor, {} );
		},

		// Returns a string with given `elmeentPath` member names, joined with comma, e.g. "body,ul,li,a,strong".
		_elementPathSerialize: function( elmeentPath ) {
			return CKEDITOR.tools.array.map( elmeentPath.elements, function( elem ) {
				return elem.getName();
			} ).reverse().join( ',' );
		}
	} );
} )();

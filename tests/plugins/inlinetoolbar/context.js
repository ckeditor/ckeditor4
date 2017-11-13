/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: inlinetoolbar,button,richcombo,basicstyles,format  */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test adding button': function() {
			var panel = this.editor.inlineToolbar.context( { buttons: 'Bold' } );
			assert.isInstanceOf( CKEDITOR.ui.button, panel.getItem( 'Bold' ), 'Registered button type.' );
			panel.destroy();
		},

		'test adding rich combo': function() {
			var panel = this.editor.inlineToolbar.context( { buttons: 'Format' } );
			assert.isInstanceOf( CKEDITOR.ui.richCombo, panel.getItem( 'Format' ), 'Registered richCombo type.' );
			panel.destroy();
		},
		/*'test context adding': function() {

		},

		'test focus change': function() {

		},

		'test widget adding': function() {

		},
		'Test widget focusing'*/

		'test context destroy': function() {
			var stub = sinon.stub( this.editor.inlineToolbar, 'destroy' );
			bender.editor.destroy();
			assert.isTrue( stub.called, 'Event show should be fired when editor is destroyed.' );
			stub.restore();
		},

		'test exposes editor.plugins.inlinetoolbar.create': function() {
			var ContextTypeStub = sinon.stub( CKEDITOR.plugins.inlinetoolbar, 'context' ),
				ret = this.editor.plugins.inlinetoolbar.create( {} );

			ContextTypeStub.restore();

			assert.isInstanceOf( ContextTypeStub, ret, 'Ret type' );
			sinon.assert.calledWithExactly( ContextTypeStub, this.editor, {} );
		}
	} );
} )();

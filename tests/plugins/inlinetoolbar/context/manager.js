/* bender-tags: inlinetoolbar, context */
/* bender-ckeditor-plugins: inlinetoolbar, basicstyles */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		tearDown: function() {
			this.editor.plugins.inlinetoolbar._manager._clear();
		},

		'test manager uses custom selection if provided': function() {
			this.editorBot.setHtmlWithSelection( '<p>foo <strong>b^ar</strong> <em>baz</em></p>' );

			var selectionClone = new CKEDITOR.dom.selection( this.editor.getSelection() ),
				rng = selectionClone.getRanges()[ 0 ],
				refreshStub = sinon.stub().returns( false );

			rng.setStart( this.editor.editable().findOne( 'em' ).getFirst(), 1 );
			rng.collapse( true );

			this.editor.plugins.inlinetoolbar.create( {
				refresh: refreshStub
			} );

			this.editor.plugins.inlinetoolbar._manager.check( selectionClone );

			assert.areSame( 1, refreshStub.callCount, 'Refresh call count' );
			assert.areSame( 'body,p,em', this._elementPathSerialize( refreshStub.args[ 0 ][ 1 ] ), 'Path provided to the options.refresh' );
			assert.areSame( selectionClone, refreshStub.args[ 0 ][ 2 ], 'Selection provided to the options.refresh' );
		},

		'test manager uses shrinked selection': function() {
			// Make selection outside of a strong. Despite that, the strong should be used in elements path.
			this.editorBot.setHtmlWithSelection( '<p>foo [<strong>bar</strong>] baz</p>' );

			var refreshStub = sinon.stub().returns( false );

			this.editor.plugins.inlinetoolbar.create( {
				refresh: refreshStub
			} );

			this.editor.plugins.inlinetoolbar._manager.check();

			assert.areSame( 1, refreshStub.callCount, 'Refresh call count' );
			assert.areSame( 'body,p,strong', this._elementPathSerialize( refreshStub.args[ 0 ][ 1 ] ), 'Path provided to options.refresh' );
		},

		// Returns a string with given `elementPath` member names, joined with comma, e.g. "body,ul,li,a,strong".
		_elementPathSerialize: function( elementPath ) {
			return CKEDITOR.tools.array.map( elementPath.elements, function( elem ) {
				return elem.getName();
			} ).reverse().join( ',' );
		}
	} );
} )();

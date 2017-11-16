/* bender-tags: inlinetoolbar, context */
/* bender-ckeditor-plugins: inlinetoolbar, basicstyles */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		tearDown: function() {
			this.editor.plugins.inlinetoolbar._manager._clear();
		},

		'test manager uses shrinked selection': function() {
			// Make selection outside of a strong. Still it should be used in elementspath.
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

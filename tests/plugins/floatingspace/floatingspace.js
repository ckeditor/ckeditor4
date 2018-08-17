/* bender-tags: editor */
/* bender-ckeditor-plugins: floatingspace,toolbar,undo */

'use strict';

bender.editor = {
	creator: 'inline',
	config: {
		extraplugins: 'floatingspace,undo'
	}
};

bender.test( {
	tearDown: function() {
		if ( this.clock ) {
			this.clock.restore();
		}
	},
	'test floatingSpaceLayout event': function() {
		var editor = this.editor;

		this.clock = sinon.useFakeTimers();
		this.listener = sinon.stub();

		this.editor.once( 'floatingSpaceLayout', this.listener );

		editor.focus();
		editor.fire( 'change' );

		this.clock.tick( 2000 );

		assert.isTrue( this.listener.called );
	}
} );

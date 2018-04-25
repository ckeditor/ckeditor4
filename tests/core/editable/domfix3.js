/* bender-tags: editor,edge */

bender.test( {
	// This test is as dirty as hack for Edge itself. To detect if reselection in domFix is not
	// happening for the first focus, we stub selection's selectRanges to detect any
	// selection after focus (#504).
	'test first focus in Edge': function() {
		if ( !CKEDITOR.env.edge ) {
			return assert.ignore();
		}

		bender.editorBot.create( {
			name: 'edgefirstfocus',
			startupData: '<p>Lorem ipsum dolor sit amet</p>'
		}, function( bot ) {
			var editor = bot.editor,
				stub = sinon.stub( CKEDITOR.dom.selection.prototype, 'selectRanges' );

			setTimeout( function() {
				resume( function() {
					stub.restore();
					assert.areSame( 0, stub.callCount, 'reselection count' );
				} );
			}, 150 );

			editor.focus();
			wait();
		} );
	}
} );

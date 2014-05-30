/* bender-tags: editor,unit */

( function() {
	'use strict';

	var doc = CKEDITOR.document;

	var el1, el2, el3, el4,
		ed1, ed2, ed3, ed4,
		tc,
		pending = 3,

		readyHandler =
		{
			instanceReady : function() {
				if ( !pending-- )
					tc.callback();
			}
		};

	function getTabIndex( element ) {
		return element.getAttribute( 'tabindex' );
	}

	bender.test(
	{
		'async:init' : function() {
			tc = this;

			// No initial tabIndex, nothing forced.
			ed1 = CKEDITOR.inline( el1 = doc.getById( 'editable1' ),
				{
					on : readyHandler
				} );

			// Initial tabIndex, nothing forced.
			ed2 = CKEDITOR.inline( el2 = doc.getById( 'editable2' ),
				{
					on : readyHandler
				} );

			// No initial tabIndex, value forced.
			ed3 = CKEDITOR.inline( el3 = doc.getById( 'editable3' ),
				{
					on : readyHandler,
					tabIndex : 100
				} );

			// Initial tabIndex, value forced.
			ed4 = CKEDITOR.inline( el4 = doc.getById( 'editable4' ),
				{
					on : readyHandler,
					tabIndex : 10
				} );
		},

		// Check whether element's tabIndex and config values
		// are used correctly.
		'test tabIndex inheritance' : function() {
			assert.areEqual( 0, ed1.tabIndex );
			assert.areEqual( 42, ed2.tabIndex );
			assert.areEqual( 100, ed3.tabIndex );
			assert.areEqual( 10, ed4.tabIndex );
		},

		// Check if the previous tabIndex of each editable
		// is correctly restored.
		'test tabIndex revert on destroy': function() {
			ed1.destroy();
			ed2.destroy();
			ed3.destroy();
			ed4.destroy();

			assert.isNull( getTabIndex( el1 ) );
			assert.areEqual( 42, getTabIndex( el2 ) );
			assert.isNull( getTabIndex( el3 ) );
			assert.areEqual( 24, getTabIndex( el4 ) );
		}
	} );

} )();
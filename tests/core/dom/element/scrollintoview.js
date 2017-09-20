/* bender-tags: editor,dom */

var doc = CKEDITOR.document,
	win = doc.getWindow();

bender.test( {
	// Reset scroll to top/bottom.
	resetScroll: function( toBottom ) {
		var maxScrollTop = win.$.scrollMaxY || doc.$.documentElement.scrollHeight - doc.$.documentElement.clientHeight;
		win.$.scrollTo( 0, toBottom ? maxScrollTop : 0 );
	},

	// Assert element position is inside of the view port, with an offset to the top/bottom.
	assertElementInView: function( el, offset ) {
		var view = win.getViewPaneSize(), rect = el.getClientRect();
		assert.isTrue( rect.top > -1 && rect.top < view.height, 'check element inside of viewport' );

		// Check within offset.
		if ( offset < 0 )
			assert.isTrue( rect.bottom - view.height > offset, 'check element at the bottom of page' );
		else if ( offset > 0 )
			assert.isTrue( rect.top < offset, 'check element at the top of page' );
	},

	notScrolledAssertion: function() {
		var org = win.getScrollPosition();
		return function() {
			var curr = win.getScrollPosition();
			assert.areSame( org.y, curr.y, 'check page not scrolled' );
		};
	},

	'test not scrolled': function() {
		this.resetScroll();
		var promise = this.notScrolledAssertion();
		doc.getById( 'target1' ).scrollIntoView();
		promise();
	}
} );

/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget */

( function() {
	'use strict';

	var Repository,
		Widget,
		onSpy,
		repo;

	function widgetElementFactory() {
		var span = new CKEDITOR.dom.element( 'span' );
		new CKEDITOR.dom.element( 'p' ).append( span );

		return span;
	}

	bender.editors = {
		editor: {
			creator: 'inline',
			name: 'test_editor'
		}
	};

	bender.test( {
		'setUp': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;
			repo = new Repository( bender.editors.editor );

			onSpy = sinon.spy( Widget.prototype, 'on' );
		},

		'tearDown': function() {
			Widget.prototype.on.restore();
		},

		'test has onWidget function': function() {
			assert.isFunction( repo.onWidget );
		},

		'test event listener added on existing widget': function() {
			var cbMock = sinon.mock();

			var widget = new Widget( repo, 1, widgetElementFactory(), { name: 'image' }, {} );
			repo.instances[ widget.id ] = widget;

			repo.onWidget( 'image', 'action', cbMock );

			assert.isTrue( onSpy.calledOn( widget ) );
			assert.isTrue( onSpy.calledWith( 'action', cbMock ) );
		},

		'test event listener added for element added to repo after calling "onWidget" method': function() {
			var cbMock = sinon.mock();

			repo.onWidget( 'image', 'action', cbMock );

			// The constructor fires repo#instanceCreated itself.
			var widget = new Widget( repo, 1, widgetElementFactory(), { name: 'image' }, {} );
			repo.instances[ widget.id ] = widget;

			assert.isTrue( onSpy.firstCall.calledOn( widget ) );
			assert.isTrue( onSpy.firstCall.calledWithExactly( 'action', cbMock ) );
		},

		'test event listener not added for different widget type': function() {
			repo.onWidget( 'image', 'action', sinon.mock() );

			var widget = new Widget( repo, 1, widgetElementFactory(), { name: 'notimage' }, {} );
			repo.instances[ widget.id ] = widget;

			assert.isTrue( onSpy.neverCalledWith( 'action' ) );
		},

		'test event listener not added for different widget type 2': function() {
			repo.onWidget( 'notimage', 'action', sinon.mock() );

			var widget = new Widget( repo, 1, widgetElementFactory(), { name: 'image' }, {} );
			repo.instances[ widget.id ] = widget;

			assert.isTrue( onSpy.neverCalledWith( 'action' ) );
		},

		'test event listener called with proper arguments': function() {
			var cbMock = sinon.mock();

			repo.onWidget( 'image', 'action', cbMock, null, null, 5 );

			var widget = new Widget( repo, 1, widgetElementFactory(), { name: 'image' }, {} );
			repo.instances[ widget.id ] = widget;

			assert.isTrue( onSpy.firstCall.calledWithExactly( 'action', cbMock, null, null, 5 ) );
		}
	} );
}() );

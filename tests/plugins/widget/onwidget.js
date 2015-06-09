/* bender-ckeditor-plugins: widget */

( function() {
	'use strict';

	var Repository,
		Widget;

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
		'test has onWidget function': function() {
			Repository = CKEDITOR.plugins.widget.repository;

			var repo = new Repository( bender.editors.editor );

			assert.isFunction( repo.onWidget );
		},

		'test event fired repository': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( bender.editors.editor ),
				element = widgetElementFactory();

			var widget = new Widget( repo, 1, element, { name: 'image' }, {} );

			repo.instances[ widget.id ] = widget;
			var cbSpy = sinon.spy();

			repo.onWidget( 'image', 'action', cbSpy );
			widget.fire( 'action' );

			assert.isTrue( cbSpy.calledOnce );
		},

		'test event fired with data': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( bender.editors.editor ),
				element = widgetElementFactory(),
				widget = new Widget( repo, 1, element, { name: 'image' }, {} ),
				cbSpy = sinon.spy();

			repo.instances[ widget.id ] = widget;

			repo.onWidget( 'image', 'action', cbSpy );
			widget.fire( 'action', { foo: 'bar' } );

			assert.areSame( 'bar', cbSpy.args[ 0 ][ 0 ].data.foo );
		},

		'test event fired with context': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( bender.editors.editor ),
				element = widgetElementFactory(),
				widget = new Widget( repo, 1, element, { name: 'image' }, {} ),
				cbSpy = sinon.spy();

			repo.instances[ widget.id ] = widget;

			repo.onWidget( 'image', 'action', cbSpy );
			widget.fire( 'action', { foo: 'bar' } );

			assert.isTrue( cbSpy.calledOn( widget ) );
		},

		'test event fired with overwritten context': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( bender.editors.editor ),
				element = widgetElementFactory(),
				widget = new Widget( repo, 1, element, { name: 'image' }, {} ),
				cbSpy = sinon.spy(),
				context = {};

			repo.instances[ widget.id ] = widget;

			repo.onWidget( 'image', 'action', cbSpy, context );
			widget.fire( 'action', { foo: 'bar' } );

			assert.isTrue( cbSpy.calledOn( context ) );
		},

		'test event fired for element added to repo after callback': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( bender.editors.editor ),
				element = widgetElementFactory(),
				cbSpy = sinon.spy();

			repo.onWidget( 'image', 'action', cbSpy );

			var widget = new Widget( repo, 1, element, { name: 'image' }, {} );
			repo.instances[ widget.id ] = widget;
			widget.fire( 'action' );

			assert.isTrue( cbSpy.calledOnce );
		},

		'test event not fired for different widget type': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( bender.editors.editor ),
				element = widgetElementFactory(),
				cbSpy = sinon.spy();

			repo.onWidget( 'image', 'action', cbSpy );

			var widget = new Widget( repo, 1, element, { name: 'notimage' }, {} );
			repo.instances[ widget.id ] = widget;
			widget.fire( 'action' );

			assert.isTrue( cbSpy.notCalled );
		},

		'test event not fired for different widget type 2': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( bender.editors.editor ),
				element = widgetElementFactory(),
				cbSpy = sinon.spy();

			repo.onWidget( 'notimage', 'action', cbSpy );

			var widget = new Widget( repo, 1, element, { name: 'image' }, {} );
			repo.instances[ widget.id ] = widget;
			widget.fire( 'action' );

			assert.isTrue( cbSpy.notCalled );
		},

		'test event fired in proper order based on priority': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( bender.editors.editor ),
				element = widgetElementFactory(),
				cbSpy1 = sinon.spy(),
				cbSpy2 = sinon.spy();

			repo.onWidget( 'image', 'action', cbSpy1, null, null, 5 );
			repo.onWidget( 'image', 'action', cbSpy2, null, null, 10 );

			var widget = new Widget( repo, 1, element, { name: 'image' }, {} );
			repo.instances[ widget.id ] = widget;
			widget.fire( 'action' );

			assert.isTrue( cbSpy1.calledBefore( cbSpy2 ) );
		}
	} );
}() );

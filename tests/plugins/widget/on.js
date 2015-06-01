/* bender-ckeditor-plugins: widget */

( function() {
	'use strict';

	var Repository,
		Widget,
		editorMock = {
			on: function() {},
			plugins: {
				widget: {
					path: ''
				}
			},
			lang: {
				widget: {
					move: ''
				}
			},
			editable: function() {
				return {
					contains: function() {
						return false;
					}
				};
			}
		};

	function mockElement() {
		return {
			getAttribute: function() {},
			data: function() {},
			addClass: function() {},
			getParent: function() {
				return {
					getName: function() {
						return 'span';
					},
					setAttribute: function() {

					},
					getLast: function() {},
					append: function() {},
					on: function() {},
					removeClass: function() {}
				};
			}
		};
	}

	bender.test( {
		'test has on function': function() {
			Repository = CKEDITOR.plugins.widget.repository;

			var repo = new Repository( editorMock );

			assert.isFunction( repo.on );
		},

		'test event fired repository': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( editorMock ),
				element = mockElement(),
				widget = new Widget( repo, 1, element, { name: 'image' }, {} ),
				cbSpy = sinon.spy();

			repo.on( 'image', 'action', cbSpy );
			widget.fire( 'action' );

			assert.isTrue( cbSpy.calledOnce );
		},

		'test event fired with data': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( editorMock ),
				element = mockElement(),
				widget = new Widget( repo, 1, element, { name: 'image' }, {} ),
				cbSpy = sinon.spy();

			repo.on( 'image', 'action', cbSpy );
			widget.fire( 'action' );

			assert.areSame( widget, cbSpy.args[ 0 ][ 0 ].data.target );
		},

		'test event fired for element added to repo after callback': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( editorMock ),
				element = mockElement(),
				cbSpy = sinon.spy();

			repo.on( 'image', 'action', cbSpy );

			var widget = new Widget( repo, 1, element, { name: 'image' }, {} );
			widget.fire( 'action' );

			assert.isTrue( cbSpy.calledOnce );
		},

		'test event not fired for different widget type': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( editorMock ),
				element = mockElement(),
				cbSpy = sinon.spy();

			repo.on( 'image', 'action', cbSpy );

			var widget = new Widget( repo, 1, element, { name: 'notimage' }, {} );
			widget.fire( 'action' );

			assert.isTrue( cbSpy.notCalled );
		},

		'test event not fired for different widget type 2': function() {
			Repository = CKEDITOR.plugins.widget.repository;
			Widget = CKEDITOR.plugins.widget;

			var repo = new Repository( editorMock ),
				element = mockElement(),
				cbSpy = sinon.spy();

			repo.on( 'notimage', 'action', cbSpy );

			var widget = new Widget( repo, 1, element, { name: 'image' }, {} );
			widget.fire( 'action' );

			assert.isTrue( cbSpy.notCalled );
		}
	} );
}() );

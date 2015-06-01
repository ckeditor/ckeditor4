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
		}
	} );
}() );

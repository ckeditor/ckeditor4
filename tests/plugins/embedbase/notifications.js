/* bender-tags: editor,13421 */
/* bender-ckeditor-plugins: embedbase,embed,toolbar,htmlwriter */
/* bender-include: ../widget/_helpers/tools.js, _helpers/tools.js */
/* global widgetTestsTools, embedTools */

'use strict';

var loadContent;

bender.editors = {
	inline: {
		name: 'editor_inline',
		creator: 'inline',
		config: {
			on: {
				instanceReady: function() {
					var embed = this.widgets.registered.embed;

					loadContent = embed.loadContent;
					embed.loadContent = function() {};
				}
			}
		}
	}
};

var dataWithWidget = '<p>x</p><div data-oembed-url="foo" id="w1">foo</div><p>x</p>',
	getWidgetById = widgetTestsTools.getWidgetById,
	jsonpCallback;

embedTools.mockJsonp( function() {
	jsonpCallback.apply( this, arguments );
} );

bender.test( {
	'test if embedding shows notifications during successful request': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			successCallbackSpy = sinon.spy(),
			errorCallbackSpy = sinon.spy(),
			createTaskSpy = sinon.spy( CKEDITOR.plugins.notificationAggregator.prototype, 'createTask' );

		bot.setData( dataWithWidget, function() {
			var widget = getWidgetById( editor, 'w1' );

			jsonpCallback = function( urlTemplate, urlParams, callback ) {
				resume( function() {
					callback( {
						type: 'rich',
						html: '<p>url:' + urlParams.url + '</p>'
					} );

					createTaskSpy.restore();
					assert.isTrue( successCallbackSpy.called, 'Success callback should be called.' );
					assert.isFalse( errorCallbackSpy.called, 'Error callback should not be called.' );
					assert.isTrue( createTaskSpy.calledOnce, 'Task should be created.' );
				} );
			};

			loadContent.call( widget, '//show/notification', {
				callback: successCallbackSpy,
				errorCallback: errorCallbackSpy
			} );

			wait();
		} );
	},

	'test if embedding notifications can be blocked during successful request': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			successCallbackSpy = sinon.spy(),
			errorCallbackSpy = sinon.spy(),
			createTaskSpy = sinon.spy( CKEDITOR.plugins.notificationAggregator.prototype, 'createTask' );

		bot.setData( dataWithWidget, function() {
			var widget = getWidgetById( editor, 'w1' );

			jsonpCallback = function( urlTemplate, urlParams, callback ) {
				resume( function() {
					callback( {
						type: 'rich',
						html: '<p>url:' + urlParams.url + '</p>'
					} );

					createTaskSpy.restore();
					assert.isTrue( successCallbackSpy.called, 'Success callback should be called.' );
					assert.isFalse( errorCallbackSpy.called, 'Error callback should not be called.' );
					assert.isFalse( createTaskSpy.called, 'Task should not be created.' );
				} );
			};

			loadContent.call( widget, '//show/no-notification', {
				callback: successCallbackSpy,
				errorCallback: errorCallbackSpy,
				noNotifications: true
			} );

			wait();
		} );
	},

	'test if embedding shows notifications during unsuccessful request': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			successCallbackSpy = sinon.spy(),
			errorCallbackSpy = sinon.spy(),
			createTaskSpy = sinon.spy( CKEDITOR.plugins.notificationAggregator.prototype, 'createTask' ),
			showNotificationSpy = sinon.spy( editor, 'showNotification' );

		bot.setData( dataWithWidget, function() {
			var widget = getWidgetById( editor, 'w1' );

			jsonpCallback = function( urlTemplate, urlParams, callback, errorCallback ) {
				resume( function() {
					errorCallback();

					createTaskSpy.restore();
					showNotificationSpy.restore();

					assert.isFalse( successCallbackSpy.called, 'Success callback should not be called.' );
					assert.isTrue( errorCallbackSpy.called, 'Error callback should be called.' );
					assert.isTrue( createTaskSpy.calledOnce, 'Task should be created.' );
					assert.isTrue( showNotificationSpy.calledOnce, 'Notification should be showed.' );
					assert.areEqual( showNotificationSpy.firstCall.returnValue.type, 'warning', 'Notification should have "warning" type.' );
				} );
			};

			loadContent.call( widget, '//error/show/notification', {
				callback: successCallbackSpy,
				errorCallback: errorCallbackSpy
			} );

			wait();
		} );
	},

	'test if embedding notifications can be blocked during unsuccessful request': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			successCallbackSpy = sinon.spy(),
			errorCallbackSpy = sinon.spy(),
			createTaskSpy = sinon.spy( CKEDITOR.plugins.notificationAggregator.prototype, 'createTask' ),
			showNotificationSpy = sinon.spy( editor, 'showNotification' );

		bot.setData( dataWithWidget, function() {
			var widget = getWidgetById( editor, 'w1' );

			jsonpCallback = function( urlTemplate, urlParams, callback, errorCallback ) {
				resume( function() {
					errorCallback();

					createTaskSpy.restore();
					showNotificationSpy.restore();

					assert.isFalse( successCallbackSpy.called, 'Success callback should not be called.' );
					assert.isTrue( errorCallbackSpy.called, 'Error callback should be called.' );
					assert.isFalse( createTaskSpy.called, 'Task should not be created.' );
					assert.isFalse( showNotificationSpy.called, 'Notification should not be showed.' );
				} );
			};

			loadContent.call( widget, '//error/show/no-notification', {
				callback: successCallbackSpy,
				errorCallback: errorCallbackSpy,
				noNotifications: true
			} );

			wait();
		} );
	}
} );

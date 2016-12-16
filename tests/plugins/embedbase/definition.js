/* bender-ckeditor-plugins: embedbase,embed,toolbar,htmlwriter */
/* bender-include: ../widget/_helpers/tools.js, _helpers/tools.js */
/* global widgetTestsTools, embedTools */

'use strict';

bender.editors = {
	inline: {
		name: 'editor_inline',
		creator: 'inline'
	}
};

function createDef( editor ) {
	return CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( editor );
}

function echoJsonpCallback( urlTemplate, urlParams, callback ) {
	callback( {
		type: 'rich',
		html: '<p>url:' + urlParams.url + '</p>'
	} );
}

var dataWithWidget = '<p>x</p><div data-oembed-url="foo" id="w1">foo</div><p>x</p>',
	dataWith2Widgets = '<p>x</p><div data-oembed-url="foo" id="w1">foo</div><div data-oembed-url="foo" id="w2">foo</div><p>x</p>',
	getWidgetById = widgetTestsTools.getWidgetById,
	jsonpCallback;

embedTools.mockJsonp( function() {
	jsonpCallback.apply( this, arguments );
} );

bender.test( {
	spies: [],
	listeners: [],

	init: function() {
		this.editors.inline.dataProcessor.writer.sortAttributes = true;
	},

	tearDown: function() {
		var spy;

		while ( spy = this.spies.pop() ) {
			spy.restore();
		}

		var listener;

		while ( listener = this.listeners.pop() ) {
			listener.removeListener();
		}
	},

	'test def._cacheResponse, def._getCachedResponse': function() {
		var def1 = createDef( this.editors.inline ),
			def2 = createDef( this.editors.inline );

		def1._cacheResponse( 'a', 1 );
		assert.areSame( 1, def1._getCachedResponse( 'a' ), 'def1.get a' );
		assert.isUndefined( def2._getCachedResponse( 'a' ), 'def2.get a - cache per definition' );
	},

	'test def._createTask returned value': function() {
		var def1 = createDef( this.editors.inline ),
			def2 = createDef( this.editors.inline ),
			ret = 1;

		this.spies.push( sinon.stub( CKEDITOR.plugins.notificationAggregator.prototype, 'createTask', function() {
			return ret++;
		} ) );

		assert.areSame( 1, def1._createTask() );
		assert.areSame( 2, def2._createTask() );
	},

	'test def._createTask creates new aggregator once all tasks are finished': function() {
		var origCreateTask = CKEDITOR.plugins.notificationAggregator.prototype.createTask,
			def1 = createDef( this.editors.inline ),
			def2 = createDef( this.editors.inline ),
			aggregators = [];

		this.spies.push( sinon.stub( CKEDITOR.plugins.notificationAggregator.prototype, 'createTask', function() {
			aggregators.push( this );

			return origCreateTask.call( this );
		} ) );

		var task1 = def1._createTask();
		def2._createTask();
		assert.areNotSame( aggregators[ 0 ], aggregators[ 1 ], 'two definitions use different aggregators' );

		task1.done();
		def1._createTask();
		assert.areNotSame( aggregators[ 0 ], aggregators[ 2 ], 'after all tasks are finished, new notifagg is created' );
	},

	'test def._responseToHtml - rich, video': function() {
		var def = createDef( this.editors.inline );

		assert.areSame( 'a', def._responseToHtml( 'http://foo', { type: 'rich', html: 'a' } ), 'rich' );
		assert.areSame( 'b', def._responseToHtml( 'http://foo', { type: 'video', html: 'b' } ), 'video' );
	},

	'test def._responseToHtml - photo': function() {
		var def = createDef( this.editors.inline );

		assert.areSame( '<img src="a&quot;b" alt="" style="max-width:100%;height:auto" />',
			def._responseToHtml( 'http://foo', { type: 'photo', url: 'a"b' } ), 'no title' );

		assert.areSame( '<img src="a" alt="x&quot;y" style="max-width:100%;height:auto" />',
			def._responseToHtml( 'http://foo', { type: 'photo', url: 'a', title: 'x"y' } ), 'with title' );
	},

	'test def._responseToHtml - link': function() {
		var def = createDef( this.editors.inline );

		assert.isNull( def._responseToHtml( 'http://foo', { type: 'link' } ) );
	},

	'test def._responseToHtml - unknown': function() {
		var def = createDef( this.editors.inline );

		assert.isNull( def._responseToHtml( 'http://foo', { type: 'foo', html: 'ignore me' } ) );
	},

	'test def._sendRequest': function() {
		var def = createDef( this.editors.inline ),
			stub = sinon.stub( CKEDITOR.plugins.embedBase._jsonp, 'sendRequest' ),
			errorCallbackSpy = sinon.spy(),
			request = {
				url: 'http://f&y=',
				callback: 1,
				errorCallback: errorCallbackSpy
			};

		this.spies.push( stub );

		def.providerUrl = new CKEDITOR.template( 'x' );
		def._sendRequest( request );

		var args = stub.args[ 0 ];

		assert.areSame( def.providerUrl, args[ 0 ], 'url pattern' );
		assert.areSame( 'http%3A%2F%2Ff%26y%3D', args[ 1 ].url, 'url param url' );
		assert.areSame( request.callback, args[ 2 ], 'callback' );

		request.errorCallback( 'foo error' );
		assert.isTrue( errorCallbackSpy.calledOnce, 'errorCallback' );
	},

	'test def.isUrlValid': function() {
		var def = createDef( this.editors.inline );
		CKEDITOR.event.implementOn( def );

		assert.isTrue( def.isUrlValid( 'http://xxx' ), '1' );
		assert.isTrue( def.isUrlValid( 'https://ąść.mobifoo/*&^%$#?&^%$.xx' ), '2' );
		assert.isTrue( def.isUrlValid( '//xxx.pl/foo' ), '3' );
		assert.isFalse( def.isUrlValid( 'x' ), '4' );
		assert.isFalse( def.isUrlValid( 'ftp://foo.bar' ), '5' );
	},

	'test def.isUrlValid fires validateUrl': function() {
		var def = createDef( this.editors.inline );
		CKEDITOR.event.implementOn( def );

		def.once( 'validateUrl', function( evt ) {
			assert.areSame( 'http://xxx', evt.data );
		} );

		assert.isTrue( def.isUrlValid( 'http://xxx' ) );

		def.once( 'validateUrl', function( evt ) {
			evt.cancel();
		} );
		assert.isFalse( def.isUrlValid( 'http://xxx' ) );
	},

	'test getErrorMessage - with custom message': function() {
		var def = createDef( this.editors.inline );

		assert.areSame( 'foo //bar.bom', def.getErrorMessage( 'foo {url}', '//bar.bom' ) );
		assert.areSame( 'foo //bar.bom2', def.getErrorMessage( 'foo {url}', '//bar.bom2', 'ignore me' ) );
		assert.areSame( 'foo', def.getErrorMessage( 'foo' ) );
	},

	'test getErrorMessage - with translation string': function() {
		var def = createDef( this.editors.inline ),
			lang = this.editors.inline.lang.embedbase;

		lang.getErrorMessage = 'foo';
		lang.getErrorMessage2 = 'bar {url}';
		lang.getErrorMessageSuff = 'bom {url}';

		assert.areSame( 'foo', def.getErrorMessage( 'getErrorMessage' ) );
		assert.areSame( 'foo', def.getErrorMessage( 'getErrorMessage', '//foo.foo' ) );
		assert.areSame( 'bar //bar.bom', def.getErrorMessage( 'getErrorMessage2', '//bar.bom' ) );
		assert.areSame( 'bom //bar.bom', def.getErrorMessage( 'getErrorMessage', '//bar.bom', 'Suff' ) );
	},

	'test def.loadContent fires sendRequest event': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			that = this;

		bot.setData( dataWithWidget, function() {
			var widget = getWidgetById( editor, 'w1' ),
				spy = sinon.stub( widget, '_sendRequest' ),
				eventsCount = 0;

			that.spies.push( spy );

			that.listeners.push( widget.on( 'sendRequest', function( evt ) {
				eventsCount += 1;

				assert.areSame( 1, eventsCount, 'event is fired only once' );
				assert.areSame( '//fires/sendrequest/event', evt.data.url, 'url' );
				assert.isFunction( evt.data.callback, 'callback' );
				assert.isFunction( evt.data.errorCallback, 'errorCallback' );
				assert.isInstanceOf( CKEDITOR.plugins.notificationAggregator.task, evt.data.task, 'task' );

				evt.data.task.done();
				evt.cancel();
			} ) );

			widget.loadContent( '//fires/sendrequest/event' );

			assert.areSame( 1, eventsCount, 'event is fired synchronously' );
			assert.isFalse( spy.called, 'canceling event stops executing _sendRequest' );
		} );
	},

	'test def.loadContent caches responses': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			that = this;

		bot.setData( dataWith2Widgets, function() {
			var widget1 = getWidgetById( editor, 'w1' ),
				widget2 = getWidgetById( editor, 'w2' ),
				data1;

			jsonpCallback = echoJsonpCallback;

			widget1.loadContent( '//caches/responses', {
				callback: function() {
					data1 = editor.getData();

					that.listeners.push( widget2.on( 'sendRequest', sinon.stub().throws() ) );
					var handleResponseSpy = sinon.spy();
					that.listeners.push( widget2.on( 'handleResponse', handleResponseSpy ) );
					var createTaskSpy = sinon.spy( widget2, '_createTask' );
					that.spies.push( createTaskSpy );

					var isAsync = false,
						wasAsync;

					widget2.loadContent( '//caches/responses', {
						callback: function() {
							// resume() is useles because it is asynchronous itself...
							// so if we want to check if loadContent is really async, we need to copy the value now ;/.
							wasAsync = isAsync;
							resume( function() {
								assert.isTrue( wasAsync, 'loadContent using cache is still async' );
								assert.areSame( '<p>x</p><div data-oembed-url="//caches/responses" id="w1"><p>url:%2F%2Fcaches%2Fresponses</p></div>' +
									'<div data-oembed-url="foo" id="w2">foo</div><p>x</p>',
									data1, 'data after first loadContent' );

								assert.areSame( '<p>x</p><div data-oembed-url="//caches/responses" id="w1"><p>url:%2F%2Fcaches%2Fresponses</p></div>' +
									'<div data-oembed-url="//caches/responses" id="w2"><p>url:%2F%2Fcaches%2Fresponses</p></div><p>x</p>',
									editor.getData(), 'data after second loadContent' );

								assert.isFalse( createTaskSpy.called, 'when cache is hit, task is not created' );
								assert.isTrue( handleResponseSpy.calledOnce, 'handleResponse is fired' );
							} );
						}
					} );

					isAsync = true;
				}
			} );

			wait();
		} );
	},

	'test def.loadContent response handling': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			that = this;

		bot.setData( dataWithWidget, function() {
			var widget = getWidgetById( editor, 'w1' ),
				handleResponseSpy = sinon.spy( widget, '_handleResponse' ),
				eventsCount = 0;

			that.spies.push( handleResponseSpy );

			that.listeners.push( widget.on( 'handleResponse', function( evt ) {
				eventsCount += 1;

				evt.data.html = evt.data.response.html + '<p>customized</p>';
			}, null, null, 9 ) );
			// We want to check if our customization won't be overwritten
			// if someone for some reason changed the default liteners priority to 10 (it should be 999).
			// The idea is that someone may add listeners on widgetRepo#instanceCreated and that listeners
			// would be added before the deault ones.

			jsonpCallback = echoJsonpCallback;

			widget.loadContent( '//response/handling', {
				callback: function() {
					resume( function() {
						assert.areSame( 1, eventsCount, 'handleResponse event is fired once' );
						assert.isTrue( handleResponseSpy.calledOnce, '_handleResponse is called once' );
						assert.isTrue( handleResponseSpy.args[ 0 ][ 0 ].task.isDone(), 'task was done' );
						assert.isTrue( handleResponseSpy.returnValues[ 0 ], '_handleResponse returned true' );
						assert.areSame( '<p>x</p><div data-oembed-url="//response/handling" id="w1">' +
							'<p>url:%2F%2Fresponse%2Fhandling</p><p>customized</p></div><p>x</p>',
							editor.getData(), 'response was customized' );
						assert.areSame( '//response/handling', widget.data.url, 'widget\'s url has been changed' );
					} );
				}
			} );

			wait();
		} );
	},

	'test def.loadContent request error handling': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			that = this;

		bot.setData( dataWithWidget, function() {
			var widget = getWidgetById( editor, 'w1' ),
				handleErrorSpy = sinon.spy( widget, '_handleError' ),
				origSendRequest = widget._sendRequest,
				canceledSpy = sinon.spy(),
				showNotificationSpy = sinon.stub( editor, 'showNotification' );

			that.spies.push( sinon.stub( widget, '_handleResponse' ).throws() );
			that.spies.push( handleErrorSpy );
			that.spies.push( sinon.stub( widget, '_sendRequest', function( request ) {
				request.task.on( 'canceled', canceledSpy );
				origSendRequest.apply( this, arguments );
			} ) );
			that.spies.push( showNotificationSpy );

			jsonpCallback = function( urlTemplate, urlParams, callback, errorCallback ) {
				errorCallback();
			};

			widget.loadContent( '//error/handling', {
				callback: sinon.stub().throws(),
				errorCallback: function() {
					resume( function() {
						assert.isTrue( handleErrorSpy.calledOnce, '_handleError was called' );
						assert.isTrue( canceledSpy.calledOnce, 'task was canceled' );
						assert.areSame( 'foo', widget.data.url, 'widget\'s url has not been changed' );

						assert.isTrue( showNotificationSpy.calledOnce, 'showNotification was called' );
						assert.areSame( editor.lang.embedbase.fetchingFailed.replace( /{url}/, '//error/handling' ),
							showNotificationSpy.args[ 0 ][ 0 ], 'notification message' );

						assert.isUndefined( widget._getCachedResponse( '//error/handling' ), 'response was not cached' );
					} );
				}
			} );

			wait();
		} );
	},

	'test def.loadContent unsupported response error handling': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			that = this;

		bot.setData( dataWithWidget, function() {
			var widget = getWidgetById( editor, 'w1' ),
				handleErrorSpy = sinon.spy( widget, '_handleError' ),
				handleResponseSpy = sinon.spy( widget, '_handleResponse' ),
				origSendRequest = widget._sendRequest,
				canceledSpy = sinon.spy(),
				showNotificationSpy = sinon.stub( editor, 'showNotification' ),
				url = '//unsupported/response/handling';

			that.spies.push( handleErrorSpy );
			that.spies.push( handleResponseSpy );
			that.spies.push( sinon.stub( widget, '_sendRequest', function( request ) {
				request.task.on( 'canceled', canceledSpy );
				origSendRequest.apply( this, arguments );
			} ) );
			that.spies.push( showNotificationSpy );

			jsonpCallback = function( urlTemplate, urlParams, callback ) {
				callback( {
					type: 'unsupported'
				} );
			};

			widget.loadContent( url, {
				callback: sinon.stub().throws(),
				errorCallback: function() {
					resume( function() {
						assert.isTrue( handleErrorSpy.calledOnce, '_handleError was called' );
						assert.isTrue( canceledSpy.calledOnce, 'task was canceled' );
						assert.areSame( 'foo', widget.data.url, 'widget\'s url has not been changed' );

						assert.isTrue( handleResponseSpy.calledOnce, '_handleResponse was called once' );
						assert.isFalse( handleResponseSpy.returnValues[ 0 ], '_handleResponse returned false' );

						assert.isTrue( showNotificationSpy.calledOnce, 'showNotification was called' );
						assert.areSame( editor.lang.embedbase.unsupportedUrl.replace( /{url}/, url ),
							showNotificationSpy.args[ 0 ][ 0 ], 'notification message' );

						assert.isUndefined( widget._getCachedResponse( url ), 'response was not cached' );
					} );
				}
			} );

			wait();
		} );
	},

	'test canceling handleResponse': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			that = this;

		bot.setData( dataWithWidget, function() {
			var widget = getWidgetById( editor, 'w1' ),
				task,
				handleResponseSpy = sinon.spy( widget, '_handleResponse' ),
				showNotificationSpy = sinon.stub( editor, 'showNotification' );

			widget.on( 'sendRequest', function( evt ) {
				task = evt.data.task;
			} );

			widget.on( 'handleResponse', function( evt ) {
				evt.data.errorMessage = 'foo error {url}';
				evt.cancel();
			} );

			that.spies.push( handleResponseSpy );
			that.spies.push( showNotificationSpy );

			jsonpCallback = echoJsonpCallback;

			widget.loadContent( '//canceling/handleresponse', {
				callback: sinon.stub().throws(),

				errorCallback: function() {
					resume( function() {
						assert.areSame( 'foo', widget.data.url, 'widget\'s url has not been changed' );
						assert.areSame( dataWithWidget, editor.getData() );

						assert.isTrue( task.isCanceled(), 'task is canceled' );

						assert.isTrue( handleResponseSpy.calledOnce, '_handleResponse was called once' );
						assert.isFalse( handleResponseSpy.returnValues[ 0 ], '_handleResponse returned false' );

						assert.isTrue( showNotificationSpy.calledOnce, 'showNotification was called once' );
						assert.areSame( 'foo error //canceling/handleresponse', showNotificationSpy.args[ 0 ][ 0 ], 'notification message' );

						assert.isUndefined( widget._getCachedResponse( '//canceling/handleresponse' ), 'response was not cached' );
					} );
				}
			} );

			wait();
		} );
	},

	'test if embedding is canceled when widget is no longer valid': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			successCallbackSpy = sinon.spy(),
			errorCallbackSpy = sinon.spy();

		bot.setData( dataWithWidget, function() {
			var widget = getWidgetById( editor, 'w1' ),
				task;

			jsonpCallback = function( urlTemplate, urlParams, callback ) {
				resume( function() {
					callback( {
						type: 'rich',
						html: '<p>url:' + urlParams.url + '</p>'
					} );

					assert.isTrue( task.isDone(), 'The task is done.' );
					assert.isFalse( successCallbackSpy.called, 'Success callback was not called.' );
					assert.isFalse( errorCallbackSpy.called, 'Error callback was not called.' );
				} );
			};

			widget.on( 'sendRequest', function( evt ) {
				task = evt.data.task;
			} );

			widget.loadContent( '//canceling/handleresponse', {
				callback: successCallbackSpy,
				errorCallback: errorCallbackSpy
			} );

			editor.widgets.destroy( widget );

			wait();
		} );

	}
} );

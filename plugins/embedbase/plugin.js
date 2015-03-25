/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'embedbase', {
		lang: 'en', // %REMOVE_LINE_CORE%
		requires: 'widget,notificationaggregator',

		onLoad: function() {
			CKEDITOR._.jsonpCallbacks = {};
		},

		init: function() {
			CKEDITOR.dialog.add( 'embedBase', this.path + 'dialogs/embedbase.js' );
		}
	} );

	function createWidgetBaseDefinition( editor ) {
		var aggregator,
			lang = editor.lang.embedbase;

		return {
			mask: true,
			template: '<div></div>',
			pathName: lang.pathName,
			// This cache object will be shared between all instances of this widget.
			_cache: {},
			// https://iframely.com/docs/providers
			urlRegExp: /^((https?:)?\/\/|www\.)/i,

			init: function() {
				this.on( 'sendRequest', function( evt ) {
					this._sendRequest( evt.data );
				}, this, null, 999 );

				// Expose the widget in the dialog - needed to trigger loadContent() and do error handling.
				this.on( 'dialog', function( evt ) {
					evt.data.widget = this;
				}, this );

				this.on( 'handleResponse', function( evt ) {
					if ( evt.data.html ) {
						return;
					}

					var retHtml = this._responseToHtml( evt.data.url, evt.data.response );

					if ( retHtml !== null ) {
						evt.data.html = retHtml;
					} else {
						evt.data.errorMessage = 'unsupportedUrl';
						evt.cancel();
					}
				}, this, null, 999 );
			},

			// We can't load content on #data, because that would make it rather impossible
			// to listen to load success and error.
			loadContent: function( url, opts ) {
				opts = opts || {};

				var that = this,
					cachedResponse = this._getCachedResponse( url ),
					request = {
						url: url,
						callback: finishLoading,
						errorCallback: function( msg ) {
							that._handleError( request, msg );
							opts.errorCallback && opts.errorCallback( msg );
						}
					};

				if ( cachedResponse ) {
					// Keep the async nature (it caused a bug the very first day when the loadContent()
					// was synchronous when cache was hit :D).
					setTimeout( function() {
						finishLoading( cachedResponse );
					} );
					return;
				}

				if ( !opts.noNotifications ) {
					request.task = this._createTask();
				}

				// The execution will be followed by #sendRequest's listener.
				this.fire( 'sendRequest', request );

				function finishLoading( response ) {
					request.response = response;

					if ( that._handleResponse( request ) ) {
						that._cacheResponse( url, response );
						opts.callback && opts.callback();
					}
				}
			},

			isUrlValid: function( url ) {
				return this.urlRegExp.test( url ) && ( this.fire( 'validateUrl', url ) !== false );
			},

			getErrorMessage: function( messageTypeOrMessage, suffix, url ) {
				var message = editor.lang.embedbase[ messageTypeOrMessage + ( suffix || '' ) ];
				if ( !message ) {
					message = messageTypeOrMessage;
				}

				return new CKEDITOR.template( message ).output( { url: url } );
			},

			_sendRequest: function( request ) {
				Jsonp.sendRequest(
					this.providerUrl,
					{
						url: encodeURIComponent( request.url )
					},
					request.callback,
					function() {
						request.errorCallback( 'fetchingFailed' );
					}
				);
			},

			_handleResponse: function( request ) {
				if ( request.task ) {
					request.task.done();
				}

				var evtData = {
					url: request.url,
					html: '',
					response: request.response
				};

				if ( this.fire( 'handleResponse', evtData ) !== false ) {
					this._setContent( request.url, evtData.html );
					return true;
				} else {
					request.errorCallback( evtData.errorMessage );
					return false;
				}
			},

			_handleError: function( request, messageTypeOrMessage ) {
				if ( request.task ) {
					request.task.cancel();

					editor.showNotification( this.getErrorMessage( messageTypeOrMessage, '', request.url ), 'warning' );
				}
			},

			_responseToHtml: function( url, response ) {
				if ( response.type == 'photo' ) {
					return '<img src="' + CKEDITOR.tools.htmlEncodeAttr( response.url ) + '" ' +
						'alt="' + CKEDITOR.tools.htmlEncodeAttr( response.title || '' ) + '" style="max-width:100%;height:auto" />';
				} else if ( response.type == 'video' || response.type == 'rich' ) {
					return response.html;
				}

				return null;
			},

			_setContent: function( url, content ) {
				this.setData( 'url', url );
				this.element.setHtml( content );
			},

			_createTask: function() {
				if ( !aggregator || aggregator.isFinished() ) {
					aggregator = new CKEDITOR.plugins.notificationAggregator( editor, lang.fetchingMany, lang.fetchingOne );

					aggregator.on( 'finished', function() {
						aggregator.notification.hide();
					} );
				}

				return aggregator.createTask();
			},

			_cacheResponse: function( url, response ) {
				this._cache[ url ] = response;
			},

			_getCachedResponse: function( url ) {
				return this._cache[ url ];
			}
		};
	}

	var Jsonp = {
		_attachScript: function( url, errorCallback ) {
			// ATM we can't use CKE scriptloader here, because it will make sure that script
			// with given URL is added only once.
			var script = new CKEDITOR.dom.element( 'script' );
			script.setAttribute( 'src', url );
			script.on( 'error', errorCallback );

			CKEDITOR.document.getBody().append( script );

			return script;
		},

		sendRequest: function( urlTemplate, urlParams, callback, errorCallback ) {
			urlParams = urlParams || {};

			var callbackKey = CKEDITOR.tools.getNextNumber(),
				scriptElement;

			urlParams.callback = 'CKEDITOR._.jsonpCallbacks[' + callbackKey + ']';

			CKEDITOR._.jsonpCallbacks[ callbackKey ] = function( response ) {
				// On IEs scripts are sometimes loaded synchronously. It is bad for two reasons:
				// * nature of sendRequest() is unstable,
				// * scriptElement does not exist yet.
				setTimeout( function() {
					cleanUp();
					callback( response );
				} );
			};

			scriptElement = this._attachScript( urlTemplate.output( urlParams ), function() {
				cleanUp();
				errorCallback();
			} );

			function cleanUp() {
				scriptElement.remove();
				delete CKEDITOR._.jsonpCallbacks[ callbackKey ];
			}
		}
	};

	CKEDITOR.plugins.embedBase = {
		createWidgetBaseDefinition: createWidgetBaseDefinition,
		_jsonp: Jsonp
	};

} )();
/* bender-ckeditor-plugins: embedbase,embed,toolbar,htmlwriter */
/* bender-include: _helpers/tools.js */
/* global embedTools */

( function() {
	'use strict';

	bender.editor = {
		embed_provider: '//fake.url/provider?url={url}&callback={callback}'
	};

	var currentResponse = {},
		html = '<strong>bar baz</strong>',
		mockResponse = {
			html: '<p>foo bar</p>',
			type: 'rich'
		};

	embedTools.mockJsonp( function( urlTemplate, urlParams, callback ) {
		callback.apply( this, currentResponse );
	} );

	var imgHtml = '<img class="cke_widget_embed_thumbnail" src="http://fake.url">',
		compactImgHtml = '<img class="cke_widget_embed_thumbnail cke_widget_embed_compact" src="http://fake.url">',
		titleHtml = '<p class="cke_widget_embed_title">Title</p>',
		descriptionHtml = '<p class="cke_widget_embed_description">Description</p>',
		providerHtml =
		'<p class="cke_widget_embed_provider">' +
			'<img class="cke_widget_embed_favicon" src="https://www.google.com/s2/favicons?domain=http%3A%2F%2Ffake.url" ' +
				'onerror="this.style.display=\'none\'">' +
			'Provider' +
		'</p>';

	bender.test( {
		tearDown: function() {
			currentResponse = {};
		},

		//(#2306)
		'test upcast with no cached response': testUpcast( {
			response: null,
			html: null
		} ),

		//(#2306)
		'test upcast with cached response _generateContent returns null': testUpcast( {
			response: mockResponse,
			html: null
		} ),

		//(#2306)
		'test upcast with cached response _generateContent returns new html': testUpcast( {
			response: mockResponse,
			html: html
		} ),

		//(#2306)
		'test downcast element with "data-restore-html" attribute': testDowncast( {
			restoreHtml: true
		} ),

		//(#2306)
		'test downcast element without "data-restore-html" attribute': testDowncast( {
			restoreHtml: false
		} ),

		//(#2306)
		'test content when _generateContent returns null': testContent( {
			response: mockResponse,
			html: null
		} ),

		//(#2306)
		'test content when _generateContent returns html': testContent( {
			response: mockResponse,
			html: html
		} ),

		//(#2306)
		'test request should be send on widget.init when upcasted widget has no cached response': testInit( {
			getResponse: true
		} ),

		//(#2306)
		'test request shouldn\'t be send when upcasted widget has no cached response': testInit( {
			getResponse: false
		} ),

		//(#2306)
		'test _generateContent when response doesn\'t contain script': testGenerateContent( {
			response: {
				html: '<p>Foo bar</p>'
			},
			expected: null
		} ),

		//(#2306)
		'test _generateContent when response contains script case 1': testGenerateContent( {
			response: {
				html: '<p>Foo bar</p><script src="http//fake.url"><\/script>'
			},
			expected: null
		} ),

		//(#2306)
		'test _generateContent when response contains script case 2': testGenerateContent( {
			response: {
				html: '<p>Foo bar</p><script src="//if-cdn.com/embed.js"><\/script>',
				thumbnail_url: 'http://fake.url'
			},
			expected: '<figure class="cke_widget_embed_container">' + imgHtml + '</figure>'
		} ),

		//(#2306)
		'test _generateContent when response contains script case 3': testGenerateContent( {
			response: {
				html: '<p>Foo bar</p><script src="//if-cdn.com/embed.js"><\/script>',
				title: 'Title'
			},
			expected: '<div class="cke_widget_embed_container cke_widget_embed_caption">' + titleHtml + '</div>'
		} ),

		//(#2306)
		'test _generateContent when response contains script case 4': testGenerateContent( {
			response: {
				description: 'Description',
				html: '<p>Foo bar</p><script src="//if-cdn.com/embed.js"><\/script>'
			},
			expected: '<div class="cke_widget_embed_container cke_widget_embed_caption">' + descriptionHtml + '</div>'
		} ),

		//(#2306)
		'test _generateContent when response contains script case 5': testGenerateContent( {
			response: {
				html: '<p>Foo bar</p><script src="//if-cdn.com/embed.js"><\/script>',
				provider_name: 'Provider',
				url: 'http://fake.url'
			},
			expected:
				'<div class="cke_widget_embed_container cke_widget_embed_caption">' + providerHtml + '</div>'
		} ),

		//(#2306)
		'test _generateContent when response contains script case 6': testGenerateContent( {
			response: {
				description: 'Description',
				html: '<p>Foo bar</p><script src="//if-cdn.com/embed.js"><\/script>',
				provider_name: 'Provider',
				thumbnail_url: 'http://fake.url',
				title: 'Title',
				url: 'http://fake.url'
			},
			expected:
				'<figure class="cke_widget_embed_container">' +
					imgHtml +
					'<figcaption class="cke_widget_embed_caption">' +
						titleHtml +
						descriptionHtml +
						providerHtml +
					'</figcaption>' +
				'</figure>'
		} ),

		//(#2306)
		'test _generateContent when response contains script case 7': testGenerateContent( {
			response: {
				description: 'Description',
				html: '<p>Foo bar</p><script src="//if-cdn.com/embed.js"><\/script>',
				provider_name: 'Provider',
				title: 'Title',
				url: 'http://fake.url'
			},
			expected:
				'<div class="cke_widget_embed_container cke_widget_embed_caption">' +
					titleHtml +
					descriptionHtml +
					providerHtml +
				'</div>'
		} ),

		//(#2306)
		'test _generateContent when response contains script case 8': testGenerateContent( {
			response: {
				description: 'Description',
				html: '<p>Foo bar</p><script src="//if-cdn.com/embed.js"><\/script>',
				title: 'Title',
				url: 'http://fake.url'
			},
			expected:
				'<div class="cke_widget_embed_container cke_widget_embed_caption">' +
					titleHtml +
					descriptionHtml +
					providerHtml.replace( 'Provider', 'fake.url' ) +
				'</div>'
		} ),

		//(#2306)
		'test _generateContent when response contains script case 9': testGenerateContent( {
			response: {
				description: 'Description',
				html: '<p style="height:140px">Foo bar</p><script src="//if-cdn.com/embed.js"><\/script>',
				provider_name: 'Provider',
				thumbnail_url: 'http://fake.url',
				title: 'Title',
				url: 'http://fake.url'
			},
			expected:
				'<figure class="cke_widget_embed_container">' +
					compactImgHtml +
					'<figcaption class="cke_widget_embed_caption">' +
						titleHtml +
						descriptionHtml +
						providerHtml +
					'</figcaption>' +
				'</figure>'
		} )
	} );

	function createWidget( editor, callback ) {
		var widget = CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( editor );

		CKEDITOR.event.implementOn( widget );

		widget.element = new CKEDITOR.dom.element( 'div' );

		callback && callback( widget );
		widget.init();

		return widget;
	}

	function testUpcast( options ) {
		return function() {
			var editor = this.editor,
				widgetDef = editor.widgets.registered.embed,
				upcastFn = widgetDef.upcast,
				element = new CKEDITOR.htmlParser.element( 'div' ),
				getCachedResponseStub = sinon.stub( widgetDef, '_getCachedResponse' ).returns( options.response ),
				generateContentStub = sinon.stub( widgetDef, '_generateContent' ).returns( options.html ),
				setHtmlSpy = element.setHtml = sinon.spy(),
				fakeUrl = 'http://fake.url',
				data = {};

			element.attributes[ 'data-oembed-url' ] = fakeUrl;
			currentResponse = options.response;

			upcastFn( element, data );

			generateContentStub.restore();
			getCachedResponseStub.restore();

			var getResponseAttr = element.attributes[ 'data-get-response' ];

			assert.areSame( fakeUrl, data.url );

			options.response ? assertWithResponse() : assertWithoutResponse();

			options.html ? assertWithHtml() : assertWithoutHtml();

			function assertWithHtml() {
				assert.areSame( 'true', element.attributes[ 'data-restore-html' ] );
				assert.areSame( options.html, setHtmlSpy.lastCall.args[ 0 ] );
			}

			function assertWithoutHtml() {
				assert.isUndefined( element.attributes[ 'data-restore-html' ] );
				assert.areSame( 0, setHtmlSpy.callCount );
			}

			function assertWithResponse() {
				assert.isUndefined( getResponseAttr );
				assert.areSame( options.response, generateContentStub.lastCall.args[ 0 ] );
			}

			function assertWithoutResponse() {
				assert.areSame( 'true', getResponseAttr );
				assert.areSame( 0, generateContentStub.callCount );
			}
		};
	}

	function testDowncast( options ) {
		return function() {
			var editor = this.editor,
				element = new CKEDITOR.htmlParser.element( 'div' ),
				widgetDef = createWidget( editor ),
				downcastFn = editor.widgets.registered.embed.downcast,
				getCachedResponseStub = sinon.stub( widgetDef, '_getCachedResponse' ).returns( mockResponse ),
				setHtmlSpy = element.setHtml = sinon.spy();

			if ( options.restoreHtml ) {
				element.attributes[ 'data-restore-html' ] = 'true';
			}

			widgetDef.data = { url: 'http://fake.url' };
			downcastFn.call( widgetDef, element );

			getCachedResponseStub.restore();

			assert.isUndefined( element.attributes[ 'data-restore-html' ] );

			if ( options.restoreHtml ) {
				assert.areSame( mockResponse.html, setHtmlSpy.lastCall.args[ 0 ] );
			} else {
				assert.areSame( 0, setHtmlSpy.callCount );
			}
		};
	}

	function testContent( options ) {
		return function() {
			var editor = this.editor,
				widgetDef = createWidget( editor ),
				generateContentMock = sinon.stub( widgetDef, '_generateContent' ).returns( options.html ),
				setContentSpy = widgetDef._setContent = sinon.spy();

			widgetDef._handleResponse( { response: options.response } );

			generateContentMock.restore();

			var expected = options.html || options.response.html;

			assert.areSame( expected, setContentSpy.lastCall.args[ 1 ],
				'setContent called with' + ( options.html ? 'html from _generateContent' : 'response.html' ) );
		};
	}

	function testInit( options ) {
		return function() {
			var editor = this.editor,
				fakeUrl = 'http://fake.url',
				loadContentSpy = sinon.spy(),
				getResponse = options.getResponse;

			createWidget( editor, function( widget ) {
				getResponse && widget.element.setAttribute( 'data-get-response', 'true' );

				widget.element.data( 'oembed-url', fakeUrl );
				widget.loadContent = loadContentSpy;
			} );

			var expected = getResponse ? 1 : 0;

			assert.areSame( expected, loadContentSpy.callCount );
			getResponse && assert.areSame( fakeUrl, loadContentSpy.lastCall.args[ 0 ] );
		};
	}

	function testGenerateContent( options ) {
		return function() {
			var editor = this.editor,
				generateContent = editor.widgets.registered.embed._generateContent,
				content = generateContent( options.response );

			assert.areSame( options.expected, content );
		};
	}
} )();

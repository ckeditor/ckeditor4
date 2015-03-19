/* bender-ckeditor-plugins: embedbase,toolbar */

'use strict';

bender.editors = {
	classic: {
		name: 'editor_classic',
		creator: 'replace'
	}
};

function createDef( editor ) {
	return CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( editor );
}

bender.test( {
	spies: [],

	tearDown: function() {
		var spy;

		while ( spy = this.spies.pop() ) {
			spy.restore();
		}
	},

	'test def._cacheResponse, def._getCachedResponse': function() {
		var def1 = createDef( this.editors.classic ),
			def2 = createDef( this.editors.classic );

		def1._cacheResponse( 'a', 1 );
		assert.areSame( 1, def1._getCachedResponse( 'a' ), 'def1.get a' );
		assert.isUndefined( def2._getCachedResponse( 'a' ), 'def2.get a - cache per definition' );
	},

	'test def._createTask returned value': function() {
		var def1 = createDef( this.editors.classic ),
			def2 = createDef( this.editors.classic ),
			ret = 1;

		this.spies.push( sinon.stub( CKEDITOR.plugins.notificationAggregator.prototype, 'createTask', function() {
			return ret++;
		} ) );

		assert.areSame( 1, def1._createTask() );
		assert.areSame( 2, def2._createTask() );
	},

	'test def._createTask creates new aggregator once all tasks are finished': function() {
		var origCreateTask = CKEDITOR.plugins.notificationAggregator.prototype.createTask,
			def1 = createDef( this.editors.classic ),
			def2 = createDef( this.editors.classic ),
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
		var def = createDef( this.editors.classic );

		assert.areSame( 'a', def._responseToHtml( 'http://foo', { type: 'rich', html: 'a' } ), 'rich' );
		assert.areSame( 'b', def._responseToHtml( 'http://foo', { type: 'video', html: 'b' } ), 'video' );
	},

	'test def._responseToHtml - photo': function() {
		var def = createDef( this.editors.classic );

		assert.areSame( '<img src="a&quot;b" alt="" style="max-width:100%;height:auto" />',
			def._responseToHtml( 'http://foo', { type: 'photo', url: 'a"b' } ), 'no title' );

		assert.areSame( '<img src="a" alt="x&quot;y" style="max-width:100%;height:auto" />',
			def._responseToHtml( 'http://foo', { type: 'photo', url: 'a', title: 'x"y' } ), 'with title' );
	},

	'test def._responseToHtml - link': function() {
		var def = createDef( this.editors.classic );

		assert.areSame( '<a href="http://foo&quot;&lt;bar">http://foo"&lt;bar</a>',
			def._responseToHtml( 'http://foo"<bar', { type: 'link' } ), 'no url, no title' );

		assert.areSame( '<a href="http://foo&quot;&lt;bar">http://foo"&lt;bar</a>',
			def._responseToHtml( 'http://foo', { type: 'link', url: 'http://foo"<bar' } ), 'with url' );

		assert.areSame( '<a href="http://foo" title="a&quot;b">http://foo</a>',
			def._responseToHtml( 'http://foo', { type: 'link', title: 'a"b' } ), 'with title' );
	},

	'test def._sendRequest': function() {
		var def = createDef( this.editors.classic ),
			stub = sinon.stub( CKEDITOR.plugins.embedBase._jsonp, 'sendRequest' ),
			request = {
				url: 'http://f&y=',
				callback: 1,
				errorCallback: 2
			};

		this.spies.push( stub );

		def.providerUrl = new CKEDITOR.template( 'x' );
		def._sendRequest( request );

		var args = stub.args[ 0 ];

		assert.areSame( def.providerUrl, args[ 0 ], 'url pattern' );
		assert.areSame( 'http%3A%2F%2Ff%26y%3D', args[ 1 ].url, 'url param url' );
		assert.areSame( request.callback, args[ 2 ], 'callback' );
		assert.areSame( request.errorCallback, args[ 3 ], 'errorCallback' );
	},

	'test def.isUrlValid': function() {
		var def = createDef( this.editors.classic );
		CKEDITOR.event.implementOn( def );

		assert.isTrue( def.isUrlValid( 'http://xxx' ), '1' );
		assert.isTrue( def.isUrlValid( 'https://ąść.mobifoo/*&^%$#?&^%$.xx' ), '2' );
		assert.isTrue( def.isUrlValid( '//xxx.pl/foo' ), '3' );
		assert.isFalse( def.isUrlValid( 'x' ), '4' );
	},

	'test def.isUrlValid fires validateUrl': function() {
		var def = createDef( this.editors.classic );
		CKEDITOR.event.implementOn( def );

		def.once( 'validateUrl', function( evt ) {
			assert.areSame( 'http://xxx', evt.data );
		} );

		assert.isTrue( def.isUrlValid( 'http://xxx' ) );

		def.once( 'validateUrl', function( evt ) {
			evt.cancel();
		} );
		assert.isFalse( def.isUrlValid( 'http://xxx' ) );
	}
} );
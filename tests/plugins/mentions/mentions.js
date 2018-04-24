/* bender-tags: editor */
/* bender-ckeditor-plugins: mentions */

( function() {
	'use strict';

	bender.editor = true;

	var feedData = [ 'Anna', 'Annabelle', 'John', 'Thomas' ],
		expectedFeedData = [ 'Anna', 'Annabelle' ];

	bender.test( {
		'test array feed with match': function() {
			var editor = this.editor, bot = this.editorBot,
				config = {
					feed: feedData
				},
				mentions = new CKEDITOR.plugins.mentions( editor, config );

			bot.setHtmlWithSelection( '<p>@An^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assertView( mentions, expectedFeedData );

			mentions.destroy();
		},

		'test array feed without match': function() {
			var editor = this.editor, bot = this.editorBot,
				config = {
					feed: feedData
				},
				mentions = new CKEDITOR.plugins.mentions( editor, config );

			bot.setHtmlWithSelection( '<p>@A^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assertView( mentions, [] );

			mentions.destroy();
		},

		'test array feed with custom minChars': function() {
			var editor = this.editor, bot = this.editorBot,
				config = {
					feed: feedData,
					minChars: 0
				},
				mentions = new CKEDITOR.plugins.mentions( editor, config );

			bot.setHtmlWithSelection( '<p>@A^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assertView( mentions, expectedFeedData );

			mentions.destroy();
		},

		'test array feed with custom marker': function() {
			var editor = this.editor, bot = this.editorBot,
				config = {
					feed: feedData,
					marker: '$'
				},
				mentions = new CKEDITOR.plugins.mentions( editor, config );

			bot.setHtmlWithSelection( '<p>$An^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assertView( mentions, expectedFeedData );

			mentions.destroy();
		},

		'test callback feed with match': function() {
			var editor = this.editor, bot = this.editorBot,
				config = {
					feed: successFeed( function( opts ) {
							assert.areEqual( '@', opts.marker );
							assert.areEqual( 'Ann', opts.query );
						} )
				},
				mentions = new CKEDITOR.plugins.mentions( editor, config );

			bot.setHtmlWithSelection( '<p>@Ann^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assertView( mentions, expectedFeedData );

			mentions.destroy();
		},

		'test callback feed without match': function() {
			var editor = this.editor, bot = this.editorBot,
				config = {
					feed: failureFeed( function( opts ) {
							assert.areEqual( '@', opts.marker );
							assert.areEqual( 'Th', opts.query );
						} )
				},
				mentions = new CKEDITOR.plugins.mentions( editor, config );

			bot.setHtmlWithSelection( '<p>@Th^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assertView( mentions, [] );

			mentions.destroy();
		},

		'test callback feed with custom marker': function() {
			var editor = this.editor, bot = this.editorBot,
				config = {
					marker: '#',
					feed: successFeed( function( opts ) {
							assert.areEqual( '#', opts.marker );
							assert.areEqual( 'Ann', opts.query );
						} )
				},
				mentions = new CKEDITOR.plugins.mentions( editor, config );

			bot.setHtmlWithSelection( '<p>#Ann^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assertView( mentions, expectedFeedData );

			mentions.destroy();
		},

		'test URL feed with match': function() {
			var editor = this.editor, bot = this.editorBot,
				data = [ { id: 1, name: 'Anna' }, { id: 2, name: 'Annabelle' } ],
				ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
					assert.areEqual( '/controller/method/Ann', url );
					callback( JSON.stringify( data ) );
				} ),
				config = {
					feed: '/controller/method/{encodedQuery}'
				},
				mentions = new CKEDITOR.plugins.mentions( editor, config );

			bot.setHtmlWithSelection( '<p>@Ann^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assertView( mentions, expectedFeedData );

			mentions.destroy();

			ajaxStub.restore();
		},

		'test URL gets encoded': function() {
			var editor = this.editor,
				ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
					callback( JSON.stringify( [] ) );
				} ),
				mentions = new CKEDITOR.plugins.mentions( editor, {
					feed: '/controller/method/?query={encodedQuery}&format=json'
				} );

			// Artificially faked callback to consider non-standard chars.
			mentions.autocomplete.textWatcher.callback = function() {
				return {
					text: '@F&/oo',
					range: editor.getSelection().getRanges()[ 0 ]
				};
			};

			this.editorBot.setHtmlWithSelection( '<p>@F&/oo^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			mentions.destroy();
			ajaxStub.restore();

			assert.areSame( 1, ajaxStub.callCount, 'AJAX call count' );
			sinon.assert.calledWith( ajaxStub, '/controller/method/?query=F%26%2Foo&format=json', sinon.match.any );
		},

		'test URL feed without match': function() {
			var editor = this.editor, bot = this.editorBot,
				ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
					assert.areEqual( '/controller/method/Th', url );
					callback( null );
				} ),
				config = {
					feed: '/controller/method/{encodedQuery}'
				},
				mentions = new CKEDITOR.plugins.mentions( editor, config );

			bot.setHtmlWithSelection( '<p>@Th^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assertView( mentions, [] );

			mentions.destroy();

			ajaxStub.restore();
		},

		'test feed with custom template': function() {
			var editor = this.editor, bot = this.editorBot,
				config = {
					feed: feedData,
					template: '<li data-id="{id}">{name} is the best!</li>'
				},
				mentions = new CKEDITOR.plugins.mentions( editor, config );

			bot.setHtmlWithSelection( '<p>@An^</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assertView( mentions, [ 'Anna is the best!', 'Annabelle is the best!' ] );

			mentions.destroy();
		},

		'test attach mentions from configuration': function() {
			var config = {
					mentions: [ { feed: feedData } ]
				};

			bender.editorBot.create( { name: 'editor_config_attach', config: config }, function( bot ) {
				var editor = bot.editor,
					mentions = editor.plugins.mentions.instances[ 0 ];

				bot.setHtmlWithSelection( '<p>@An^</p>' );

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				assertView( mentions, expectedFeedData );

				mentions.destroy();
			} );
		}
	} );

	function assertView( mentions, matches ) {
		var viewElement = mentions.autocomplete.view.element,
			isOpened = viewElement.hasClass( 'cke_autocomplete_opened' ),
			items = viewElement.find( 'li' ),
			itemsArray = items.toArray();

		if ( matches.length ) {
			assert.isTrue( isOpened, 'View should be opened' );
		} else {
			assert.isFalse( isOpened, 'View should be closed' );
		}

		assert.areEqual( matches.length, items.count(), 'Invalid items count' );

		for ( var i = items.count() - 1; i >= 0; i-- ) {
			assert.areEqual( mentions.marker + matches[ i ], itemsArray[ i ].getHtml(), 'Match and item html are not equal' );
		}
	}

	function successFeed( customAssert ) {
		return function( opts, callback ) {
			var data = [
				{ id: 1, name: 'Anna' },
				{ id: 2, name: 'Annabelle' }
			];

			customAssert && customAssert( opts, data );
			callback( data );
		};
	}

	function failureFeed( customAssert ) {
		return function( opts, callback ) {
			customAssert && customAssert( opts );
			callback( [] );
		};
	}

} )();

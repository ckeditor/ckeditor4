/* bender-tags: editor */
/* bender-ckeditor-plugins: mentions */

( function() {
	'use strict';

	bender.editor = true;

	var feedData = [ 'Anna', 'Annabelle', 'John', 'Thomas' ],
		expectedFeedData = [ 'Anna', 'Annabelle' ];

	bender.test( {

		setUp: function() {
			this.createMentionsInstance = function( config ) {
				this._mentions = new CKEDITOR.plugins.mentions( this.editor, config );
				return this._mentions;
			};
		},

		tearDown: function() {
			if ( this._mentions ) {
				this._mentions.destroy();
			}
		},

		'test array feed with match': function() {
			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );
			assertView( this.createMentionsInstance( { feed: feedData } ), expectedFeedData );
		},

		'test array feed without match': function() {
			this.editorBot.setHtmlWithSelection( '<p>@A^</p>' );
			assertView( this.createMentionsInstance( { feed: feedData } ), [] );
		},

		'test array feed with custom minChars': function() {
			this.editorBot.setHtmlWithSelection( '<p>@A^</p>' );

			assertView( this.createMentionsInstance( {
				feed: feedData,
				minChars: 0
			} ), expectedFeedData );
		},

		'test array feed with custom marker': function() {
			this.editorBot.setHtmlWithSelection( '<p>$An^</p>' );

			assertView( this.createMentionsInstance( {
				feed: feedData,
				marker: '$'
			} ), expectedFeedData );
		},

		'test callback feed with match': function() {
			this.editorBot.setHtmlWithSelection( '<p>@Ann^</p>' );

			assertView( this.createMentionsInstance( {
				feed: successFeed( function( opts ) {
					assert.areEqual( '@', opts.marker );
					assert.areEqual( 'Ann', opts.query );
				} )
			} ), expectedFeedData );
		},

		'test callback feed without match': function() {
			this.editorBot.setHtmlWithSelection( '<p>@Th^</p>' );

			assertView( this.createMentionsInstance( {
				feed: failureFeed( function( opts ) {
					assert.areEqual( '@', opts.marker );
					assert.areEqual( 'Th', opts.query );
				} )
			} ), [] );
		},

		'test callback feed with custom marker': function() {
			this.editorBot.setHtmlWithSelection( '<p>#Ann^</p>' );

			assertView( this.createMentionsInstance( {
				marker: '#',
				feed: successFeed( function( opts ) {
					assert.areEqual( '#', opts.marker );
					assert.areEqual( 'Ann', opts.query );
				} )
			} ), expectedFeedData );
		},

		'test URL feed with match': function() {
			var data = [ { id: 1, name: 'Anna' }, { id: 2, name: 'Annabelle' } ],
				ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
					assert.areEqual( '/controller/method/Ann', url );
					callback( JSON.stringify( data ) );
				} );

			this.editorBot.setHtmlWithSelection( '<p>@Ann^</p>' );

			assertView( this.createMentionsInstance( {
				feed: '/controller/method/{encodedQuery}'
			} ), expectedFeedData );

			ajaxStub.restore();
		},

		'test URL gets encoded': function() {
			var editor = this.editor,
				ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
					callback( JSON.stringify( [] ) );
				} ),
				mentions = this.createMentionsInstance( {
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

			ajaxStub.restore();

			assert.areSame( 1, ajaxStub.callCount, 'AJAX call count' );
			sinon.assert.calledWith( ajaxStub, '/controller/method/?query=F%26%2Foo&format=json', sinon.match.any );
		},

		'test URL feed without match': function() {
			var ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
				assert.areEqual( '/controller/method/Th', url );
				callback( null );
			} );

			this.editorBot.setHtmlWithSelection( '<p>@Th^</p>' );

			assertView( this.createMentionsInstance( {
				feed: '/controller/method/{encodedQuery}'
			} ), [] );

			ajaxStub.restore();
		},

		'test feed with custom template': function() {
			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );

			assertView( this.createMentionsInstance( {
				feed: feedData,
				template: '<li data-id="{id}">{name} is the best!</li>'
			} ), [ 'Anna is the best!', 'Annabelle is the best!' ] );
		},

		'test attach mentions from configuration': function() {
			var config = {
				mentions: [ { feed: feedData } ]
			};

			bender.editorBot.create( { name: 'editor_config_attach', config: config }, function( bot ) {
				var editor = bot.editor,
					mentions = editor.plugins.mentions.instances[ 0 ];

				bot.setHtmlWithSelection( '<p>@An^</p>' );

				assertView( mentions, expectedFeedData );

				mentions.destroy();
			} );
		}
	} );

	function assertView( mentions, matches ) {
		// Fire keyup event on editable to trigger text matching and open autocomplete view if it matches.
		mentions.autocomplete.editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

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

/* bender-tags: editor */
/* bender-ckeditor-plugins: mentions */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: 'strong'
		}
	};

	var feedData = [ 'Anna', 'Annabelle', 'John', 'Thomas' ],
		expectedFeedData = [ 'Anna', 'Annabelle' ];

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'mentions', this.editor );
		},

		tearDown: function() {
			if ( this._mentions ) {
				this._mentions.destroy();
				this._mentions = null;

				CKEDITOR._.mentions.cache = {};
			}
		},

		// (#2491)
		'test matching diacritic characters': function() {
			var diacritics = 'áàâäãéèëêíìïîóòöôõúùüûñçăşţ';

			this.editorBot.setHtmlWithSelection( '<p>@' + diacritics + '^</p>' );
			testView( this.createMentionsInstance( { feed: [ diacritics ] } ), [ diacritics ] );
		},

		// (#2491)
		'test matching underscore character': function() {
			var expected = 'john_doe';

			this.editorBot.setHtmlWithSelection( '<p>@' + expected + '^</p>' );
			testView( this.createMentionsInstance( { feed: [ expected ] } ), [ expected ] );
		},

		// (#2491)
		'test not matching special characters': function() {
			var editor = this.editor,
				specialCharacters = '~!@#$%^&*()-+=`/.,\'"<>?|\\/[]{}'.split( '' ),
				mentions = this.createMentionsInstance( {
					feed: specialCharacters,
					throttle: 0,
					minChars: 0
				} );

			for ( var i = 0; i < specialCharacters.length; i++ ) {
				var expected = specialCharacters[ i ],
					viewElement = mentions._autocomplete.view.element;

				// Some characters e.g. `[` are used as selection markers,
				// they need to be inserted directly to the editor.
				this.editorBot.setHtmlWithSelection( '<p>^</p>' );
				editor.insertText( '@' + expected );

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				assert.isFalse( viewElement.hasClass( 'cke_autocomplete_opened' ),
					'View should be closed for "' + expected + '" character' );

			}
		},

		'test array feed with match': function() {
			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );
			testView( this.createMentionsInstance( { feed: feedData } ), expectedFeedData );
		},

		// (#1934)
		'test case sensitive array feed with match': function() {
			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );
			testView( this.createMentionsInstance( { feed: feedData, caseSensitive: true } ), expectedFeedData );
		},

		'test array feed without match': function() {
			this.editorBot.setHtmlWithSelection( '<p>@A^</p>' );
			testView( this.createMentionsInstance( { feed: feedData } ), [] );
		},

		'test feed with a marker as a part of word': function() {
			this.editorBot.setHtmlWithSelection( '<p>a@An^</p>' );
			testView( this.createMentionsInstance( { feed: feedData } ), [] );
		},

		// (#1934)
		'test case sensitive array feed without match - lowercase query': function() {
			this.editorBot.setHtmlWithSelection( '<p>@an^</p>' );
			testView( this.createMentionsInstance( { feed: feedData, caseSensitive: true } ), [] );
		},

		// (#1934)
		'test case sensitive array feed without match - lowercase data': function() {
			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );
			testView( this.createMentionsInstance( { feed: [ 'anna' ], caseSensitive: true } ), [] );
		},

		// (#1934)
		'test case insensitive array match': function() {
			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );
			testView( this.createMentionsInstance( { feed: [ 'Andy', 'anna' ], caseSensitive: false } ), [ 'Andy', 'anna' ] );
		},

		'test array feed with custom minChars': function() {
			this.editorBot.setHtmlWithSelection( '<p>@A^</p>' );

			testView( this.createMentionsInstance( {
				feed: feedData,
				minChars: 0
			} ), expectedFeedData );
		},

		'test array feed with custom marker "$"': function() {
			this.editorBot.setHtmlWithSelection( '<p>$An^</p>' );

			testView( this.createMentionsInstance( {
				feed: feedData,
				marker: '$'
			} ), expectedFeedData );
		},

		'test array feed with custom marker "."': function() {
			this.editorBot.setHtmlWithSelection( '<p>.An^</p>' );

			testView( this.createMentionsInstance( {
				feed: feedData,
				marker: '.'
			} ), expectedFeedData );
		},

		'test array feed with custom marker "/"': function() {
			this.editorBot.setHtmlWithSelection( '<p>/An^</p>' );

			testView( this.createMentionsInstance( {
				feed: feedData,
				marker: '/'
			} ), expectedFeedData );
		},

		'test passing custom pattern': function() {
			this.editorBot.setHtmlWithSelection( '<p>anna^</p>' );

			testView( this.createMentionsInstance( {
				feed: feedData,
				pattern: /^a+\w*$/, // Match only words starting with "a".
				marker: null,
				minChars: 0
			} ), expectedFeedData );
		},

		'test failing custom pattern': function() {
			this.editorBot.setHtmlWithSelection( '<p>thomas^</p>' );

			testView( this.createMentionsInstance( {
				feed: feedData,
				pattern: /^a+\w*$/, // Match only words starting with "a".
				marker: null,
				minChars: 0
			} ), [] );
		},

		'test callback feed with match': function() {
			this.editorBot.setHtmlWithSelection( '<p>@Ann^</p>' );

			testView( this.createMentionsInstance( {
				feed: successFeed( function( opts ) {
					assert.areEqual( '@', opts.marker );
					assert.areEqual( 'Ann', opts.query );
				} )
			} ), expectedFeedData );
		},

		'test callback feed without match': function() {
			this.editorBot.setHtmlWithSelection( '<p>@Th^</p>' );

			testView( this.createMentionsInstance( {
				feed: failureFeed( function( opts ) {
					assert.areEqual( '@', opts.marker );
					assert.areEqual( 'Th', opts.query );
				} )
			} ), [] );
		},

		'test callback feed with custom marker': function() {
			this.editorBot.setHtmlWithSelection( '<p>#Ann^</p>' );

			testView( this.createMentionsInstance( {
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

			testView( this.createMentionsInstance( {
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
			mentions._autocomplete.textWatcher.callback = function() {
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

		'test valid URL called for multi char marker': function() {
			var ajaxStub = sinon.stub( CKEDITOR.ajax, 'load' );

			this.createMentionsInstance( {
				feed: '/controller/method/{encodedQuery}',
				marker: '##'
			} );

			this.editorBot.setHtmlWithSelection( '<p>##MultiMarker^</p>' );

			this.editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			this.editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) ); // ENTER

			ajaxStub.restore();

			assert.areSame( 1, ajaxStub.callCount, 'Call count' );
			sinon.assert.calledWith( ajaxStub, '/controller/method/MultiMarker' );
		},

		'test URL feed without match': function() {
			var ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
				assert.areEqual( '/controller/method/Th', url );
				callback( null );
			} );

			this.editorBot.setHtmlWithSelection( '<p>@Th^</p>' );

			testView( this.createMentionsInstance( {
				feed: '/controller/method/{encodedQuery}'
			} ), [] );

			ajaxStub.restore();
		},

		'test feed with custom view template': function() {
			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );

			testView( this.createMentionsInstance( {
				feed: feedData,
				itemTemplate: '<li data-id="{id}">{name} is the best!</li>'
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

				testView( mentions, expectedFeedData );

				mentions.destroy();
			} );
		},

		'test URL has no race condition': function() {
			var ajaxCallsLeft = 2,
				callbacksLeft = 2,
				mentions = this.createMentionsInstance( {
					feed: '/controller/method/{encodedQuery}',
					throttle: 0
				} ),
				dataSet = {
					1: [ { id: 2, name: 'Annabelle' } ],
					2: [ { id: 1, name: 'Anna' }, { id: 2, name: 'Annabelle' } ]
				},
				ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
					var data = url.indexOf( 'Annab' ) != -1 ? dataSet[ 1 ] : dataSet[ 2 ];

					ajaxCallsLeft--;

					window.setTimeout( function() {
						callback( JSON.stringify( data ) );

						callbacksLeft--;
						if ( !callbacksLeft ) {
							resume( function() {
								ajaxStub.restore();
								testView( mentions, [ 'Annabelle' ], true );
							} );
						}
					}, ajaxCallsLeft * 50 );
				} );

			this.editorBot.setHtmlWithSelection( '<p>@Anna^</p>' );
			mentions._autocomplete.editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			this.editorBot.setHtmlWithSelection( '<p>@Annab^</p>' );
			mentions._autocomplete.editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			wait();
		},

		// (#1969)
		'test URL feed cache can be disabled': function() {
			var mentions = this.createMentionsInstance( {
					feed: '{encodedQuery}',
					cache: false,
					minChars: 0,
					throttle: 0
				} ),
				dataSet = [
					{ id: 1, name: 'Anna' },
					{ id: 2, name: 'Annabelle' }
				],
				ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
					callback( JSON.stringify( dataSet ) );
				} );

			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );
			testView( mentions, expectedFeedData );

			this.editorBot.setHtmlWithSelection( '<p>@Ann^</p>' );
			testView( mentions, expectedFeedData );

			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );
			testView( mentions, expectedFeedData );

			assert.areEqual( 3, ajaxStub.callCount, 'CKEDITOR.ajax.load call count' );

			ajaxStub.restore();
		},

		// (#1969)
		'test URL feed responses are cached': function() {
			var mentions = this.createMentionsInstance( {
					feed: '{encodedQuery}',
					minChars: 0,
					throttle: 0
				} ),
				dataSet = [
					{ id: 1, name: 'Anna' },
					{ id: 2, name: 'Annabelle' }
				],
				ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
					callback( JSON.stringify( dataSet ) );
				} );

			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );
			testView( mentions, expectedFeedData );

			this.editorBot.setHtmlWithSelection( '<p>@Ann^</p>' );
			testView( mentions, expectedFeedData );

			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );
			testView( mentions, expectedFeedData );

			assert.areEqual( 2, ajaxStub.callCount );

			ajaxStub.restore();
		},

		// (#1969)
		'test URL feed invalid responses are not cached': function() {
			var mentions = this.createMentionsInstance( {
					feed: '{encodedQuery}',
					minChars: 0,
					throttle: 0
				} ),
				ajaxStub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
					callback( null );
				} );

			this.editorBot.setHtmlWithSelection( '<p>@test^</p>' );
			testView( mentions, [] );

			assert.isUndefined( CKEDITOR._.mentions.cache.test );

			ajaxStub.restore();
		},

		// (#1987)
		'test custom output template with default item': function() {
			var editable = this.editor.editable();

			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );

			this.createMentionsInstance( {
				feed: [ 'Anna' ],
				outputTemplate: '<strong>{name}</strong>'
			} );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) ); // ENTER

			assert.areEqual( '<p><strong>@Anna</strong></p>', editable.getData() );
		},

		// (#1987)
		'test custom output template with custom item': function() {
			var editable = this.editor.editable();

			this.editorBot.setHtmlWithSelection( '<p>@An^</p>' );

			this.createMentionsInstance( {
				feed: function( opts, callback ) {
					callback( [ {
						id: 1,
						name: 'Anna',
						surname: 'Doe'
					} ] );
				},
				outputTemplate: '<strong>{name} {surname}</strong>'
			} );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) ); // ENTER

			assert.areEqual( '<p><strong>@Anna Doe</strong></p>', editable.getData() );
		},

		createMentionsInstance: function( config ) {
			this._mentions = new CKEDITOR.plugins.mentions( this.editor, config );
			return this._mentions;
		}
	} );

	function testView( mentions, matches, skipTrigger ) {
		if ( !skipTrigger ) {
			// Fire keyup event on editable to trigger text matching and open _autocomplete view if it matches.
			mentions._autocomplete.editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
		}

		var viewElement = mentions._autocomplete.view.element,
			isOpened = viewElement.hasClass( 'cke_autocomplete_opened' ),
			items = viewElement.find( 'li' ),
			itemsArray = items.toArray();

		if ( matches.length ) {
			assert.isTrue( isOpened, 'View should be opened.' );
		} else {
			assert.isFalse( isOpened, 'View should be closed.' );
		}

		assert.areEqual( matches.length, items.count(), 'Invalid items count.' );

		for ( var i = items.count() - 1; i >= 0; i-- ) {
			assert.areEqual( mentions.marker + matches[ i ], itemsArray[ i ].getHtml(), 'Match and item html are not equal.' );
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

/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: pastefromword */
( function() {
	'use strict';

	window.decodeArray = function( toDecode ) {
			if ( Array.isArray( toDecode ) ) {
				return window.easyDebug( toDecode );
			} else if ( toDecode.getOuterHtml ) {
				return toDecode.getOuterHtml();
			} else {
				return toDecode + '';
			}
		};

	window.easyDebug = function( arr ) {
			return arr.map( window.decodeArray );
		};

	var tests = {
			setUp: function() {
				this.pastefromword = CKEDITOR.plugins.pastefromword;
				// Array of stubs that will be restored in the tearDown method.
				this.stubs = [];
			},

			tearDown: function() {
				var curStub;

				for ( var i = this.stubs.length - 1; i >= 0; i-- ) {
					curStub = this.stubs.pop(); 
					curStub.restore();
				}
			},

			'test List.groupLists with a single list': function() {
				var items = this._extractItemsFromList( 'simplelist' ),
					ret = this.pastefromword.lists.groupLists( items );

				assert.areSame( 1, ret.length, 'Returned array length (lists count)' );
				assert.areSame( 7, ret[ 0 ].length, 'Returned array\'s first child length' );
			},

			'test List.groupLists with nested lists': function() {
				this.stubs.push( sinon.stub( this.pastefromword.lists, 'chopDiscontinousLists' ).returns( true ) );

				var items = this._extractItemsFromList( 'nestedlist' ),
					ret = this.pastefromword.lists.groupLists( items );

				assert.areSame( 1, ret.length, 'Returned array length (lists count)' );
				assert.areSame( 6, ret[ 0 ].length, 'Returned array\'s first child length' );
			},

			// Returns an array of CKEDITOR.htmlParser.node elements from a list in test suite html file.
			// This is handy, because `htmlParser.fragment.fromHtml` creates automatically a wrapping ul.
			//
			// @param {String} id Id of a list.
			// @returns {CKEDITOR.htmlParser.node[]}
			_extractItemsFromList: function( id ) {
				var ret = CKEDITOR.htmlParser.fragment.fromHtml( CKEDITOR.document.getById( id ).getHtml() );

				return ret.children[ 0 ].children;
			}
		};

	CKEDITOR.scriptLoader.load( '../../../apps/ckeditor/plugins/pastefromword/filter/default.js', function( success ) {
		if ( !success ) {
			throw new Error( 'Can\'t load legacy.js file' );
		}

		bender.test( tests );
	} );

} )();
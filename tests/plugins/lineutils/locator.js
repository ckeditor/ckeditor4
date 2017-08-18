/* bender-tags: editor,lineutils */
/* bender-ckeditor-plugins: lineutils */

( function() {
	'use strict';

	var finder, locator;

	CKEDITOR.addCss(
		'body { padding: 0px !important; margin: 0px !important; }' +
		'body * { outline: 1px solid #ccc } '
	);

	bender.editor = {
		config: {
			allowedContent: true,
			autoParagraph: false,
			on: {
				instanceReady: function() {
					finder = new CKEDITOR.plugins.lineutils.finder( this, {
						lookups: {
							lookup: function() {
								return CKEDITOR.LINEUTILS_BEFORE | CKEDITOR.LINEUTILS_AFTER | CKEDITOR.LINEUTILS_INSIDE;
							}
						}
					} );

					locator = new CKEDITOR.plugins.lineutils.locator( this );
				}
			}
		}
	};

	function uid( doc, id ) {
		return doc.getById( id ).getUniqueId();
	}

	function assertSorted( expected, sorted ) {
		assert.areSame( expected.length, sorted.length, 'All locations has been returned.' );

		for ( var i = sorted.length; i--; ) {
			assert.areSame( expected[ i ].uid, sorted[ i ].uid, 'Uid of the location is correct.' );
			assert.areSame( expected[ i ].type, sorted[ i ].type, 'Type of the location is correct.'  );
			assert.areSame( expected[ i ].dist, sorted[ i ].dist, 'Distance of the location is correct.' );
		}
	}

	function locationTest( def ) {
		return function() {
			var bot = this.editorBot,
				editor = this.editor,
				doc = editor.document;

			bot.setData( def.data, function() {
				locator.locate( finder.greedySearch() );
				def.assert( doc );
			} );
		};
	}

	bender.test( {
		'test locator\'s getSorted': locationTest( {
			data:
				'<div id="a" style="height: 50px">y</div>' +
				'<div id="b" style="height: 50px; margin-top: 50px;">' +
					'<div id="c" style="height: 10px; margin-top: 10px;">x</div>' +
				'</div>',
			assert: function( doc ) {
				assertSorted( [
					{ uid: uid( doc, 'a' ), type: '1', dist: 0 },
					{ uid: uid( doc, 'a' ), type: '4', dist: 25 },
					{ uid: uid( doc, 'b' ), type: '1', dist: 75 },
					{ uid: uid( doc, 'c' ), type: '1', dist: 100 },
					{ uid: uid( doc, 'c' ), type: '4', dist: 105 },
					{ uid: uid( doc, 'c' ), type: '2', dist: 110 },
					{ uid: uid( doc, 'b' ), type: '2', dist: 150 }
				], locator.sort( 0 ) );
			}
		} ),

		'test locator\'s getSorted with number restriction': locationTest( {
			data:
				'<div id="a" style="height: 50px">y</div>' +
				'<div id="b" style="height: 50px; margin-top: 50px;">' +
					'<div id="c" style="height: 10px; margin-top: 10px;">x</div>' +
				'</div>',
			assert: function( doc ) {
				assertSorted( [
					{ uid: uid( doc, 'c' ), type: '2', dist: 10 },
					{ uid: uid( doc, 'c' ), type: '4', dist: 15 },
					{ uid: uid( doc, 'c' ), type: '1', dist: 20 }
				], locator.sort( 120, 3 ) );
			}
		} )
	} );
} )();

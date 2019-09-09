/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var el1 = CKEDITOR.dom.element.createFromHtml( '<div>Foo</div>' ),
		el2 = CKEDITOR.dom.element.createFromHtml( '<p>Bar</p>' ),
		ranges = CKEDITOR.tools.array.map(
			[ {
				start: [ el1, 0 ],
				end: [ el1, 1 ]
			}, {
				start: [ el1, 0 ],
				end: [ el1, 1 ]
			}, {
				start: [ el1, 0 ],
				end: [ el2, 1 ]
			}, {
				start: [ el2, 0 ],
				end: [ el1, 0 ]
			} , {
				start: [ el2, 0 ],
				end: [ el2, 1 ]
			} ], function( options ) {
				var rng = new CKEDITOR.dom.range( CKEDITOR.document );

				rng.setStart( options.start[ 0 ], options.start[ 1 ] );
				rng.setEnd( options.end[ 0 ], options.end[ 1 ] );

				return rng;
			}
		);

	// (#3175)
	bender.test( {
		'test range.equals on self': testEquals( ranges[ 0 ], ranges[ 0 ], true ),
		'test range.equals on identical range': testEquals( ranges[ 0 ], ranges[ 1 ], true ),
		'test range.equals on different range with same start': testEquals( ranges[ 0 ], ranges[ 2 ], false ),
		'test range.equals on different range with same end': testEquals( ranges[ 0 ], ranges[ 3 ], false ),
		'test range.equals on completely different range': testEquals( ranges[ 0 ], ranges[ 4 ], false )
	} );

	function testEquals( range1, range2, expected ) {
		return function() {
			assert[ expected ? 'isTrue' : 'isFalse' ]( range1.equals( range2 ), 'range.equals()' );
		};
	}
} )();

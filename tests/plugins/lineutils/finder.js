/* bender-tags: editor,lineutils */
/* bender-ckeditor-plugins: lineutils */
/* global lineutilsTestsTools */

( function() {
	'use strict';

	var finder,
		lookupEls1 = [],
		lookupEls2 = [],
		assertRelations = lineutilsTestsTools.assertRelations;

	bender.editor = {
		config: {
			allowedContent: true,
			autoParagraph: false,
			on: {
				instanceReady: function() {
					finder = new CKEDITOR.plugins.lineutils.finder( this, {
						lookups: {
							'lookup REL_BEFORE': function( el ) {
								lookupEls1.push( el.getName() );

								return CKEDITOR.LINEUTILS_BEFORE;
							},

							'lookup REL_AFTER': function( el ) {
								lookupEls2.push( el.getName() );

								return CKEDITOR.LINEUTILS_AFTER | CKEDITOR.LINEUTILS_INSIDE;
							}
						}
					} );
				}
			}
		}
	};

	function traverseTest( def ) {
		return function() {
			var bot = this.editorBot,
				editor = this.editor,
				doc = editor.document;

			bot.setData( def.data, function() {
				finder.relations = {};
				finder.traverseSearch( def.start( doc ) );

				def.assert( editor );

				lookupEls1 = [];
				lookupEls2 = [];
			} );
		};
	}

	function greedyTest( def ) {
		return function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( def.data, function() {
				finder.greedySearch();

				def.assert( editor );

				lookupEls1 = [];
				lookupEls2 = [];
			} );
		};
	}

	function assertLookupElements( elements, msg, sort ) {
		arrayAssert.itemsAreSame( elements, sort ? lookupEls1.sort() : lookupEls1, 'Lookup #1: ' + msg );
		arrayAssert.itemsAreSame( elements, sort ? lookupEls2.sort() : lookupEls2, 'Lookup #2: ' + msg );
	}

	bender.test( {
		'test lookup functions': traverseTest( {
			data: '<p>y</p><div>y<p>y<span id="x">x</span>y</p>y</div><p>y</p>',
			start: function( doc ) {
				return doc.getById( 'x' );
			},
			assert: function() {
				assertLookupElements( [ 'span', 'p', 'div' ], 'Lookup visited only one branch of DOM.' );
			}
		} ),

		'test lookup with limits (editable)': traverseTest( {
			data: '<p>y</p><div>y<p>y<span id="x">x</span>y</p>y</div><p>y</p>',
			start: function( doc ) {
				return doc.getBody();
			},
			assert: function() {
				assertLookupElements( [], 'Lookup stopped once reached the limit.' );
			}
		} ),

		'test lookup with limits (nested editable)': traverseTest( {
			data: '<p>y</p><div contenteditable="false">y<p contenteditable="true">y<span id="x">x</span>y</p>y</div><p>y</p>',
			start: function( doc ) {
				return doc.getById( 'x' );
			},
			assert: function() {
				assertLookupElements( [ 'span', 'p' ], 'Lookup stopped once reached the limit.' );
			}
		} ),

		'test unique relations': traverseTest( {
			data: '<p>a</p><div>b<p>y<span id="x">x</span>c</p>d</div><p>e</p>',
			start: function( doc ) {
				return doc.getById( 'x' );
			},
			assert: function( editor ) {
				assertRelations( editor, finder, '<p>a</p>|<div>|b|<p>|y|<span id="x">|x</span>|c</p>|d</div>|<p>e</p>' );
			}
		} ),

		'test unique relations - normalization': traverseTest( {
			data: '<p>a</p><div><p><span id="x">x</span></p></div><p>b</p>',
			start: function( doc ) {
				return doc.getById( 'x' );
			},
			assert: function( editor ) {
				assertRelations( editor, finder, '<p>a</p>|<div>|<p>|<span id="x">|x</span>|</p>|</div>|<p>b</p>' );
			}
		} ),

		'test unique relations - only child': traverseTest( {
			data: '<div contenteditable="true"><p id="x">x</p></div>',
			start: function( doc ) {
				return doc.getById( 'x' );
			},
			assert: function( editor ) {
				assertRelations( editor, finder, '|<div contenteditable="true">|<p id="x">|x</p>|</div>|' );
			}
		} ),

		'test lookup greedy find': greedyTest( {
			data: 'x<div contenteditable="false"><blockquote>y</blockquote>y<p contenteditable="true">y<span id="x">x</span>y</p>y</div>',
			assert: function() {
				assertLookupElements( [ 'div', 'p', 'span' ], 'Lookup never checked non-editable internals.', true );
			}
		} ),

		'test lookup greedy find: siblings': greedyTest( {
			data: '<blockquote>y</blockquote><div>z</div>',
			assert: function() {
				assertLookupElements( [ 'blockquote', 'div' ], 'Lookup visited both elements in greedy search.', true );
			}
		} ),

		'test lookup greedy find: invisible': greedyTest( {
			data: 'a<blockquote style="display: none">x</blockquote><div style="display: none">y</div>',
			assert: function() {
				assertLookupElements( [], 'Invisible elements are not considered.' );
			}
		} ),

		'test lookup greedy find: invisible sibling (normalization)': greedyTest( {
			data: 'a<blockquote>x</blockquote><div style="display: none">y</div>',
			assert: function() {
				assertLookupElements( [ 'blockquote' ], 'Invisible elements are not considered.' );
			}
		} )
	} );
} )();

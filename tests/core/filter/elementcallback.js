/* bender-tags: editor,unit */
/* global acfTestTools */

( function() {
	'use strict';

	var createFilter = acfTestTools.createFilter,
		createFilterTester = acfTestTools.createFilterTester;

	bender.editors = {
		editor: {
			name: 'editor1'
		}
	};

	bender.test( {
		'test elementCallbacks property': function() {
			var filter = new CKEDITOR.filter( 'p' );

			assert.isNull( filter.elementCallbacks, 'initially null' );

			filter.addElementCallback( function() {} );
			assert.isArray( filter.elementCallbacks, 'becomes array' );
			assert.areSame( 1, filter.elementCallbacks.length );
		},

		'test callback is executed on all elements when filtering': function() {
			var filter = createFilter( 'p b i' ),
				names = [];

			filter.filter.addElementCallback( function( el ) {
				names.push( el.name );
			} );

			filter( '<p><b>x</b>x<b><i>y</i>x</b></p>', '<p><b>x</b>x<b><i>y</i>x</b></p>' );
			assert.areSame( 'p,b,b,i', names.join( ',' ), 'all elements are visited' );

			names = [];
			filter( '<h1>x</h1><p><u>y</u></p>', '<p>x</p><p>y</p>' );
			assert.areSame( 'h1,p,u', names.join( ',' ), 'not allowed elements are visited' );

			names = [];
			filter( '<p>x<img src="foo" alt="" />y<textarea cols="10" rows="10">x</textarea>z</p>', '<p>xyxz</p>' );
			assert.areSame( 'p,img,textarea', names.join( ',' ), 'empty elements are visited' );
		},

		// In this test we need to use real editor, because script tag is protected by the htmlDP.
		'test callback is executed on protected elements when filtering': function() {
			var editor = this.editors.editor,
				t = createFilterTester( editor ),
				names = [];

			editor.filter.addElementCallback( function( el ) {
				names.push( el.name );
			} );

			try {
				t( '<p>x</p><script>foo</scr' + 'ipt><p>y</p>', '<p>x</p><p>y</p>' );
				assert.areSame( 'p,script,p', names.join( ',' ), 'protected elements are visited' );
			} catch ( e ) {
				throw e;
			} finally {
				editor.filter.elementCallbacks = [];
			}
		},

		'test callback is not executed when checking': function() {
			var filter = new CKEDITOR.filter( 'p b' );

			filter.addElementCallback( function( el ) {
				assert.fail( 'callback should not be executed when checking rule: ' + el.name );
			} );

			filter.check( 'p' );
			filter.check( 'script' );
			filter.check( 'h1' );
			assert.isTrue( true );
		},

		'test callbacks are executed until one of them returns a value': function() {
			var filter = createFilter( 'p' ),
				executed = [];

			filter.filter.addElementCallback( function() {
				executed.push( 'a' );
			} );
			filter.filter.addElementCallback( function() {
				executed.push( 'b' );
				return CKEDITOR.FILTER_SKIP_TREE;
			} );
			filter.filter.addElementCallback( function() {
				executed.push( 'c' );
			} );

			filter( '<p>a</p><p>a</p>', '<p>a</p><p>a</p>' );

			assert.areSame( 'a,b,a,b', executed.join( ',' ) );
		},

		'test FILTER_SKIP_TREE skips entire tree': function() {
			var filter = createFilter( 'p b' );

			filter.filter.addElementCallback( function( el ) {
				if ( el.name == 'i' )
					return CKEDITOR.FILTER_SKIP_TREE;
			} );

			filter( '<p foo="1"><b bar="1">x</b></p>',				'<p><b>x</b></p>' );
			filter( '<p><i foo="1">x</i><u>x</u></p>',				'<p><i foo="1">x</i>x</p>' );
			filter( '<p><i><u>x<img alt="" src="" /></u></i></p>',	'<p><i><u>x<img alt="" src="" /></u></i></p>' );
		}
	} );
} )();
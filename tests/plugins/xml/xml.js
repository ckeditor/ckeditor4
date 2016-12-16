/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: xml */

( function() {
	'use strict';

	bender.test( {
		'test xml.baseXml': function() {
			var xml = new CKEDITOR.xml( '<data/>' );
			assert.isObject( xml.baseXml );
		},

		'test selectSingleNode': function() {
			var xml = new CKEDITOR.xml( '<foo><bar x="2"/>bom<bar x="1"/></foo>' );

			var node = xml.selectSingleNode( 'foo/bar[@x="1"]' );
			assert.areSame( '1', node.getAttribute( 'x' ) );
			assert.areSame( 'bar', node.tagName );
		},

		'test selectNodes': function() {
			var xml = new CKEDITOR.xml( '<foo><bar/><bom/><bar/></foo>' );

			var nodes = xml.selectNodes( 'foo/bar' );
			assert.areSame( 2, nodes.length );
			assert.areSame( 'bar', nodes[ 0 ].tagName );
		},

		'test getInnerXml': function() {
			var xml = new CKEDITOR.xml( '<foo><bar x="2"/>bom<bar x="1"/></foo>' );

			assert.isMatching( /^<bar x=\"2\"( )?\/>bom<bar x=\"1\"( )?\/>$/, xml.getInnerXml( 'foo' ) );
		}
	} );

} )();
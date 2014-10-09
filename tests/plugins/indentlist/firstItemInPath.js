/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: indentlist */

( function() {
	'use strict';
	var firstItemInPath,
		query = { ul: 1, ol: 1 };

	bender.test( {
		'test element direct in list': function() {
			var root = CKEDITOR.dom.element.createFromHtml( [
					'<ul>',
						'<li id="one" >one</li>',
						'<li id="two" >two</li>',
					'</ul>'
				].join( '' ) ),
				one = root.findOne( '#one' ),
				two = root.findOne( '#two' ),
				pathOne = new CKEDITOR.dom.elementPath( one, root ),
				pathTwo = new CKEDITOR.dom.elementPath( two, root );

			firstItemInPath = CKEDITOR.plugins.indentlist.firstItemInPath;

			assert.isTrue( firstItemInPath( query, pathOne, root ) );
			assert.isFalse( firstItemInPath( query, pathTwo, root ) );

		},

		'test element with paragraph in list': function() {
			var root = CKEDITOR.dom.element.createFromHtml( [
					'<ul>',
						'<li><p id="one">one</p></li>',
						'<li><p id="two">two</p></li>',
					'</ul>'
				].join( '' ) ),
				one = root.findOne( '#one' ),
				two = root.findOne( '#two' ),
				pathOne = new CKEDITOR.dom.elementPath( one, root ),
				pathTwo = new CKEDITOR.dom.elementPath( two, root );

			firstItemInPath = CKEDITOR.plugins.indentlist.firstItemInPath;

			assert.isTrue( firstItemInPath( query, pathOne, root ) );
			assert.isFalse( firstItemInPath( query, pathTwo, root ) );
		}
	} );
} )();
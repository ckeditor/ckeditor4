/* bender-tags: tableselection */
/* bender-ckeditor-plugins: tableselection */
/* bender-include: _helpers/tableselection.js */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'editor1',
			creator: 'replace',
			config: {
				height: 300
			}
		},
		divarea: {
			name: 'divarea',
			config: {
				extraPlugins: 'divarea'
			}
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		// #515
		'test mouseover on scrollbar': function( editor, bot ) {
			var editable = editor.editable();

			bot.setData( '<p>Test</p><p>Test</p><p>Test</p><p>Test</p>' +
				'<p>Test</p><p>Test</p><p>Test</p><p>Test</p>' +
				'<p>Test</p><p>Test</p><p>Test</p><p>Test</p>' +
				'<p>Test</p><p>Test</p><p>Test</p><p>Test</p>' +
				'<p>Test</p><p>Test</p><p>Test</p><p>Test</p>', function() {

				editable.$.scrollTop = 150;
				editor.document.fire( 'mousemove', new CKEDITOR.dom.event( {
					target: editable.getDocument()
				} ) );

				assert.pass();
			} );

		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();

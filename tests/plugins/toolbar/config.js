/* bender-tags: editor */
/* bender-ckeditor-plugins: floatingspace,toolbar,basicstyles,list,link,about */
/* bender-ckeditor-remove-plugins: liststyle */

( function() {
	'use strict';

	function comp( expected, actual ) {
		var buttons = [];

		actual = actual.items;

		for ( var i = 0; i < actual.length; ++i ) {
			buttons.push( actual[ i ].type == CKEDITOR.UI_SEPARATOR ? '-' : actual[ i ].name );
		}

		return CKEDITOR.tools.arrayCompare( expected, buttons );
	}

	bender.test( {
		'test config.toolbar object': function() {
			bender.editorBot.create( {
				name: 'editor1',
				config: {
					toolbar: [
						[ 'Bold' ], [ 'Link', '-', 'Unlink' ],
						'/',
						{ name: 'about', items: [ 'About', 'Italic' ] }
					]
				}
			},
			function( bot ) {
				var editor = bot.editor;

				assert.areEqual( 4, editor.toolbar.length );
				assert.isTrue( comp( [ 'bold' ], editor.toolbar[ 0 ] ) );
				assert.isTrue( comp( [ 'link', '-', 'unlink' ], editor.toolbar[ 1 ] ) );
				assert.areSame( '/', editor.toolbar[ 2 ] );
				assert.areSame( 'about', editor.toolbar[ 3 ].name );
				assert.isTrue( comp( [ 'about', 'italic' ], editor.toolbar[ 3 ] ) );

				bot.assertInputOutput(
					'<p><strong>A</strong><em>B</em><sup>C</sup></p><ul><li>D</li></ul>',
					'<p><strong>A</strong><em>B</em>C</p><p>D</p>',
					'<p><strong>A</strong><em>B</em>C</p><p>D</p>' );
			} );
		},

		'test config.toolbar string': function() {
			bender.editorBot.create( {
				name: 'editor2',
				config: {
					toolbar: 'Custom',
					toolbar_Custom: [ [ 'Italic' ], [ 'About' ] ]
				}
			},
			function( bot ) {
				var editor = bot.editor;

				assert.areEqual( 2, editor.toolbar.length );
				assert.isTrue( comp( [ 'italic' ], editor.toolbar[ 0 ] ) );
				assert.isTrue( comp( [ 'about' ], editor.toolbar[ 1 ] ) );
			} );
		},

		'test config.toolbarGroups and config.removeButtons': function() {
			bender.editorBot.create( {
				name: 'editor3',
				config: {
					toolbarGroups: [
						{ name: 'about' },
						'/',
						{ name: 'test', groups: [ 'basicstyles', 'list' ] }
					],
					removeButtons: 'Underline,Strike,Subscript,Superscript,BulletedList'
				}
			},
			function( bot ) {
				var editor = bot.editor;

				assert.areEqual( 3, editor.toolbar.length );
				assert.areSame( 'about', editor.toolbar[ 0 ].name );
				assert.isTrue( comp( [ 'about' ], editor.toolbar[ 0 ] ) );
				assert.areSame( '/', editor.toolbar[ 1 ] );
				assert.areSame( 'test', editor.toolbar[ 2 ].name );
				assert.isTrue( comp( [ 'bold', 'italic', '-', 'numberedlist' ], editor.toolbar[ 2 ] ) );

				bot.assertInputOutput(
					'<p><strong>A</strong><em>B</em><sup>C</sup></p><ul><li>D</li></ul><ol><li>E</li></ol>',
					'<p><strong>A</strong><em>B</em>C</p><p>D</p><ol><li>E</li></ol>',
					'<p><strong>A</strong><em>B</em>C</p><p>D</p><ol><li>E</li></ol>' );
			} );
		},

		// (#5122)
		'test config.removeButtons accepts array of buttons': function() {
			bender.editorBot.create( {
				name: 'editor-5122',
				config: {
					plugins: [ 'toolbar', 'wysiwygarea', 'basicstyles' ],
					removeButtons: [ 'Bold', 'Italic' ]
				}
			},
			function( bot ) {
				var editor = bot.editor,
					basicStyleGroup = getToolbarGroup( editor, 'basicstyles' );

				assert.isTrue( comp( [ 'underline', 'strike', 'subscript', 'superscript' ], basicStyleGroup ) );

				bot.assertInputOutput(
					'<p><strong>A</strong><em>B</em><sup>C</sup></p>',
					'<p>AB<sup>C</sup></p>',
					'<p>AB<sup>C</sup></p>' );
			} );
		}
	} );

	function getToolbarGroup( editor, name ) {
		return CKEDITOR.tools.array.find( editor.toolbar, function( group ) {
			return group.name === name;
		} );
	}
} )();

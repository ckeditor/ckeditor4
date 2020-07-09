/* bender-tags: editor,colorbutton,1795 */
/* bender-ckeditor-plugins: colorbutton,undo,toolbar,wysiwygarea */
/* bender-include: _helpers/tools.js */
/* global colorHistoryTools */

( function() {
	'use strict';

	// The 'removePlugins' config is set for testing build version.
	bender.test( {
		'test ariasetsize is correct (automatic: 0, morecolors: 0, history: empty)': function() {
			testAriaAttributes(
				{
					first: 1,
					last: 24,
					total: 24
				},
				'<p>Foobar</p>',
				{
					colorButton_enableAutomatic: false,
					removePlugins: 'colordialog'
				}
			);
		},

		'test ariasetsize is correct (automatic: 0, morecolors: 0, history: 1 color)': function() {
			testAriaAttributes(
				{
					first: 1,
					last: 24,
					total: 25
				},
				'<p><span style="color:red;background-color:yellow;">Foobar</span></p>',
				{
					colorButton_enableAutomatic: false,
					removePlugins: 'colordialog'
				}
			);
		},

		'test ariasetsize is correct (automatic: 0, morecolors: 1, history: empty)': function() {
			testAriaAttributes(
				{
					first: 1,
					last: 24,
					total: 25
				},
				'<p>Foobar</p>',
				{
					extraPlugins: 'colordialog',
					colorButton_enableAutomatic: false
				}
			);
		},

		'test ariasetsize is correct (automatic: 0, morecolors: 1, history: 1 color)': function() {
			testAriaAttributes(
				{
					first: 1,
					last: 24,
					total: 26
				},
				'<p><span style="color:red;background-color:yellow;">Foobar</span></p>',
				{
					extraPlugins: 'colordialog',
					colorButton_enableAutomatic: false
				}
			);
		},

		'test ariasetsize is correct (automatic: 1, morecolors: 0, history: empty)': function() {
			testAriaAttributes(
				{
					first: 2,
					last: 25,
					total: 25
				},
				'<p>Foobar</p>',
				{
					removePlugins: 'colordialog'
				}
			);
		},

		'test ariasetsize is correct (automatic: 1, morecolors: 0, history: 1 color)': function() {
			testAriaAttributes(
				{
					first: 2,
					last: 25,
					total: 26
				},
				'<p><span style="color:red;background-color:yellow;">Foobar</span></p>',
				{
					removePlugins: 'colordialog'
				}
			);
		},

		'test ariasetsize is correct (automatic: 1, morecolors: 1, history: empty)': function() {
			testAriaAttributes(
				{
					first: 2,
					last: 25,
					total: 26
				},
				'<p>Foobar</p>',
				{
					extraPlugins: 'colordialog'
				}
			);
		},

		'test ariasetsize is correct (automatic: 1, morecolors: 1, history: 1 color)': function() {
			testAriaAttributes(
				{
					first: 2,
					last: 25,
					total: 27
				},
				'<p><span style="color:red;background-color:yellow;">Foobar</span></p>',
				{
					extraPlugins: 'colordialog'
				}
			);
		}
	} );

	function testAriaAttributes( data, startupData, config ) {
		config = config || {};

		bender.editorBot.create( {
			name: 'editor' + new Date().getTime(),
			startupData: startupData,
			config: config
		}, function( bot ) {
			var editor = bot.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			assertAria( editor, data, txtColorBtn );
			assertAria( editor, data, bgColorBtn );
		} );
	}

	function assertAria( editor, data, panel ) {
		panel.click( editor );

		var firstColorBox = colorHistoryTools.findInPanel( '[data-value]', panel ),
			lastColorBox = colorHistoryTools.findInPanel( '[data-value="000"]', panel );

		assert.areEqual( '1ABC9C', firstColorBox.getAttribute( 'data-value' ), 'Order is incorrect (' + panel.title + ').' );
		assert.areEqual( data.first, firstColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect (' + panel.title + ').' );
		assert.areEqual( data.total, firstColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect (' + panel.title + ').' );

		assert.areEqual( '000', lastColorBox.getAttribute( 'data-value' ), 'Order is incorrect (' + panel.title + ').' );
		assert.areEqual( data.last, lastColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect (' + panel.title + ').' );
		assert.areEqual( data.total, lastColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect (' + panel.title + ').' );
	}
} )();
